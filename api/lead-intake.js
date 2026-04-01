import "../lib/load-env.js";
import formidable from "formidable";
import { normalizeLeadPayload } from "../lib/normalize.js";
import {
  searchCompanyByDomain,
  searchContactByEmail,
  createObject,
  patchObject,
  associateV3Batch,
  buildCompanyProperties,
  buildContactProperties,
  buildDealProperties,
  ASSOCIATION_PATHS,
} from "../lib/hubspot.js";
import { sendTeamNotification, buildTeamNotifySubject, buildTeamNotifyBody } from "../lib/email.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

/** @param {import('formidable').Fields} fields */
function getField(fields, name) {
  const v = fields[name];
  if (v === undefined) return "";
  const raw = Array.isArray(v) ? v[0] : v;
  if (raw === undefined || raw === null) return "";
  return typeof raw === "string" ? raw : String(raw);
}

const REQUIRED = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "role",
  "businessName",
  "website",
  "industry",
  "hqCity",
  "hqState",
  "ownership",
  "transitionGoal",
  "transitionTiming",
  "revenueRangeText",
  "ebitdaMargin",
  "leverage",
];

function validate(raw) {
  const missing = REQUIRED.filter((k) => !String(raw[k] || "").trim());
  return missing;
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) {
    if (process.env.LEAD_INTAKE_BYPASS_HUBSPOT === "true") {
      console.warn("lead-intake: LEAD_INTAKE_BYPASS_HUBSPOT — skipping HubSpot (local test only)");
      const redirect = process.env.THANK_YOU_REDIRECT || "thank-you.html";
      return res.status(200).json({ status: "received", redirect });
    }
    console.error("lead-intake: HUBSPOT_ACCESS_TOKEN is not set");
    return res.status(500).json({
      error: "Server configuration error",
      hint: "Add HUBSPOT_ACCESS_TOKEN to .env.local, or set LEAD_INTAKE_BYPASS_HUBSPOT=true to test the form without HubSpot.",
    });
  }

  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    return res.status(400).json({ error: "Expected multipart/form-data" });
  }

  let fields;
  try {
    const form = formidable({ multiples: false });
    [fields] = await form.parse(req);
  } catch (e) {
    console.error("lead-intake: parse error", e);
    return res.status(400).json({ error: "Invalid form data" });
  }

  /** @type {Record<string, string>} */
  const raw = {
    firstName: getField(fields, "firstName"),
    lastName: getField(fields, "lastName"),
    email: getField(fields, "email"),
    phone: getField(fields, "phone"),
    role: getField(fields, "role"),
    companyRepresented: getField(fields, "companyRepresented"),
    businessName: getField(fields, "businessName"),
    website: getField(fields, "website"),
    industry: getField(fields, "industry"),
    hqCity: getField(fields, "hqCity"),
    hqState: getField(fields, "hqState"),
    yearFounded: getField(fields, "yearFounded"),
    ownership: getField(fields, "ownership"),
    transitionGoal: getField(fields, "transitionGoal"),
    transitionTiming: getField(fields, "transitionTiming"),
    revenueRangeText: getField(fields, "revenueRangeText"),
    ebitdaMargin: getField(fields, "ebitdaMargin"),
    leverage: getField(fields, "leverage"),
    keyassets: getField(fields, "keyassets"),
    notableCustomers: getField(fields, "notableCustomers"),
    fitReason: getField(fields, "fitReason"),
    challenge: getField(fields, "challenge"),
    hasManagementTeam: getField(fields, "hasManagementTeam"),
    referralSource: getField(fields, "referralSource"),
    otherDetails: getField(fields, "otherDetails"),
  };

  const missing = validate(raw);
  if (missing.length) {
    return res.status(400).json({ error: "Missing required fields", fields: missing });
  }

  const n = normalizeLeadPayload(raw);

  try {
    let company = n.domain ? await searchCompanyByDomain(token, n.domain) : null;

    const companyProps = buildCompanyProperties(raw, n);

    if (company?.id) {
      await patchObject(token, "companies", company.id, companyProps);
    } else {
      company = await createObject(token, "companies", companyProps);
    }
    const companyId = company.id;

    let contact = await searchContactByEmail(token, raw.email);
    const contactProps = buildContactProperties(raw, n);

    if (contact?.id) {
      await patchObject(token, "contacts", contact.id, contactProps);
    } else {
      contact = await createObject(token, "contacts", contactProps);
    }
    const contactId = contact.id;

    const dealProps = buildDealProperties(raw, n);
    const deal = await createObject(token, "deals", dealProps);
    const dealId = deal.id;

    await associateV3Batch(
      token,
      ASSOCIATION_PATHS.contactCompany,
      contactId,
      companyId,
      "contact_to_company"
    );
    await associateV3Batch(
      token,
      ASSOCIATION_PATHS.dealContact,
      dealId,
      contactId,
      "deal_to_contact"
    );
    await associateV3Batch(
      token,
      ASSOCIATION_PATHS.dealCompany,
      dealId,
      companyId,
      "deal_to_company"
    );

    const subject = buildTeamNotifySubject(raw);
    const text = buildTeamNotifyBody(raw, n, dealId);
    await sendTeamNotification({ subject, text });

    const redirect = process.env.THANK_YOU_REDIRECT || "thank-you.html";
    return res.status(200).json({ status: "received", redirect });
  } catch (err) {
    console.error("lead-intake: HubSpot error", err?.message, err?.body || err);
    return res.status(502).json({
      error: "Unable to complete intake. Please try again later.",
    });
  }
}
