import "../lib/load-env.js";
import formidable from "formidable";
import { normalizeLeadPayload } from "../lib/normalize.js";
import {
  searchCompanyByDomain,
  searchContactByEmail,
  createObject,
  patchObject,
  associateV4DefaultPut,
  getDefaultPipelineAndStage,
  getFirstStageForPipeline,
  buildCompanyProperties,
  buildContactProperties,
  buildDealProperties,
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

/** Flatten HubSpot CRM error JSON for logs / optional client hint */
function summarizeHubSpotBody(body) {
  if (!body || typeof body !== "object") return "";
  const parts = [];
  if (body.message != null) {
    const m = body.message;
    parts.push(Array.isArray(m) ? m.join("; ") : String(m));
  }
  if (Array.isArray(body.errors)) {
    for (const e of body.errors) {
      if (!e || typeof e !== "object") continue;
      let line = [e.message, e.code].filter(Boolean).join(" ");
      const props = e.context?.propertyName;
      if (Array.isArray(props) && props.length) {
        line = line ? `${line} (${props.join(", ")})` : props.join(", ");
      }
      if (line) parts.push(line);
    }
  }
  return parts.filter(Boolean).join(" — ");
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

  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();
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

    const pipelineEnv = process.env.HUBSPOT_PIPELINE_ID;
    const stageEnv = process.env.HUBSPOT_DEAL_STAGE_ID;
    const hasExplicitPipeline = Boolean(pipelineEnv && pipelineEnv !== "default");
    const hasExplicitStage = Boolean(stageEnv);

    let pipeline;
    let dealstage;
    if (!hasExplicitPipeline) {
      const resolved = await getDefaultPipelineAndStage(token);
      pipeline = resolved.pipeline;
      dealstage = hasExplicitStage ? stageEnv : resolved.stage;
    } else {
      pipeline = pipelineEnv;
      dealstage = hasExplicitStage ? stageEnv : await getFirstStageForPipeline(token, pipeline);
    }

    const dealProps = buildDealProperties(raw, { ...n, pipeline, dealstage });
    const deal = await createObject(token, "deals", dealProps);
    const dealId = deal.id;

    await associateV4DefaultPut(token, "contact", contactId, "company", companyId);
    await associateV4DefaultPut(token, "deal", dealId, "contact", contactId);
    await associateV4DefaultPut(token, "deal", dealId, "company", companyId);

    const subject = buildTeamNotifySubject(raw);
    const text = buildTeamNotifyBody(raw, n, dealId);
    await sendTeamNotification({ subject, text });

    const redirect = process.env.THANK_YOU_REDIRECT || "thank-you.html";
    return res.status(200).json({ status: "received", redirect });
  } catch (err) {
    const body = err?.body;
    const hubspotMsg = summarizeHubSpotBody(body) || (typeof body === "string" ? body : "");
    const status = err?.status;
    const isHubSpotAuthFailure =
      status === 401 ||
      /: 401\b/.test(String(err?.message || "")) ||
      /oauth token|access token|unauthorized|invalid.*token|expired.*token/i.test(hubspotMsg);

    console.error("lead-intake: HubSpot error", err?.message, hubspotMsg || body || err);

    const payload = {
      error: "Unable to complete intake. Please try again later.",
    };
    const exposeHint =
      (hubspotMsg || isHubSpotAuthFailure) &&
      (process.env.LEAD_INTAKE_DEBUG === "1" || process.env.VERCEL_ENV === "preview");

    if (exposeHint) {
      if (isHubSpotAuthFailure) {
        payload.hint =
          "HubSpot rejected the access token (wrong value, revoked private app, or expired token). In Vercel → Project → Settings → Environment Variables, set HUBSPOT_ACCESS_TOKEN to a current Private App access token from HubSpot (Settings → Integrations → Private Apps). Redeploy after saving.";
        if (process.env.LEAD_INTAKE_DEBUG === "1" && hubspotMsg) {
          payload.detail = hubspotMsg;
        }
      } else if (hubspotMsg) {
        payload.hint = hubspotMsg;
      }
    }
    return res.status(502).json(payload);
  }
}
