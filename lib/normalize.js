/**
 * Ported from n8n workflow "Normalize & Prepare Payload" (Lead Capture - Reactive).
 * Matches domain handling, revenue/EBITDA parsers, financial_notes, fit_summary, dealname, pipeline/stage/owner.
 */

import { getIndustryLabel } from "./industry-label.js";

/** @param {string | undefined} s */
function normalize(s) {
  return String(s || "")
    .replace(/&lt;/gi, "<")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

/** n8n-style domain: strip protocol, www, trailing slash */
/** @param {string | undefined} website */
export function extractDomain(website) {
  if (!website || typeof website !== "string") return "";
  let domain = website
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "")
    .trim()
    .toLowerCase();
  return domain;
}

/** @param {string | undefined} value */
export function formatIndustry(value) {
  if (!value) return "";
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** @param {string | undefined} raw */
export function toRevenueMidpoint(raw) {
  const s = normalize(raw);
  if (!s) return null;

  if (/^<\s*\$?\s*2\s*M\b/.test(s)) return 1_000_000;

  const range = s.match(/\$?\s*(\d+(?:\.\d+)?)\s*M\s*[-–—]\s*\$?\s*(\d+(?:\.\d+)?)\s*M/);
  if (range) {
    const lo = parseFloat(range[1]);
    const hi = parseFloat(range[2]);
    return Math.round(((lo + hi) / 2) * 1_000_000);
  }

  const plus = s.match(/\$?\s*(\d+(?:\.\d+)?)\s*M\+/);
  if (plus) return parseFloat(plus[1]) * 1_000_000;

  return null;
}

/** @param {string | undefined} raw */
export function toEbitdaMidpoint(raw) {
  const s = normalize(raw);
  if (!s) return null;

  if (/^<\s*5\s*%/.test(s)) return 0.05;

  const range = s.match(/(\d+(?:\.\d+)?)\s*%?\s*[-–—]\s*(\d+(?:\.\d+)?)\s*%/);
  if (range) {
    const lo = parseFloat(range[1]);
    const hi = parseFloat(range[2]);
    return (lo + hi) / 200;
  }

  const plus = s.match(/(\d+(?:\.\d+)?)\s*%\+/);
  if (plus) return parseFloat(plus[1]) / 100;

  return null;
}

/**
 * Contact field `additional_notes` in n8n (company represented only).
 * @param {Record<string, string>} body
 */
export function buildAdditionalNotes(body) {
  const notes = [];
  if (body.companyRepresented) {
    notes.push(`Company represented (if not owner) by: ${body.companyRepresented}`);
  }
  return notes.join("\n\n");
}

/**
 * n8n financial_notes: EBITDA, Leverage, Key Assets (no revenue line — revenue → company annualrevenue).
 * @param {Record<string, string>} body
 */
export function buildFinancialNotes(body) {
  const financialNotes = [];
  if (body.ebitdaMargin) financialNotes.push(`EBITDA Margin: ${body.ebitdaMargin}`);
  if (body.leverage) financialNotes.push(`Leverage: ${body.leverage}`);
  if (body.keyassets) financialNotes.push(`Key Assets: ${body.keyassets}`);
  return financialNotes.length ? financialNotes.join("\n") : "";
}

/**
 * n8n fit_summary wording.
 * @param {Record<string, string>} body
 */
export function buildFitSummary(body) {
  const parts = [];
  if (body.fitReason) parts.push(`Why it's a strong fit: ${body.fitReason}`);
  if (body.challenge) parts.push(`Challenges: ${body.challenge}`);
  if (body.hasManagementTeam) {
    parts.push(`Management Team: ${body.hasManagementTeam === "on" ? "Yes" : "No"}`);
  }
  if (body.notableCustomers) parts.push(`Notable Customers: ${body.notableCustomers}`);
  if (body.otherDetails) parts.push(`Additional Notes: ${body.otherDetails}`);
  return parts.length ? parts.join("\n\n") : "";
}

/**
 * n8n: businessName + " - " + formatIndustry(industry)
 * @param {Record<string, string>} body
 */
export function buildDealName(body) {
  const nameParts = [];
  if (body.businessName) nameParts.push(body.businessName.trim());
  if (body.industry) nameParts.push(formatIndustry(body.industry));
  return nameParts.join(" - ") || "New Lead - Charlton Bleecker";
}

/**
 * Full document for team email / logs (richer than HubSpot deal description).
 * @param {Record<string, string>} fields
 * @param {object} computed
 * @param {string} computed.fit_summary
 * @param {string} computed.financial_notes
 */
export function buildIntakeDocument(fields, computed) {
  const lines = [
    "=== Deal Prospect Intake ===",
    "",
    "A new deal submission has been received from the website.",
    "",
    `Name: ${fields.firstName || ""} ${fields.lastName || ""}`.trim(),
    `Email: ${fields.email || ""}`,
    `Role: ${fields.role || ""}`,
    `Company: ${fields.businessName || ""} || ${fields.companyRepresented || ""}`,
    `Revenue: ${fields.revenueRangeText || ""}`,
    `EBITDA Margin: ${fields.ebitdaMargin || ""}`,
    `Industry: ${computed.industryLabel || fields.industry || ""}`,
    `Headquarters: ${fields.hqCity || ""}, ${fields.hqState || ""}`.replace(/,\s*$/, ""),
    "",
    `Deal Summary (fit_summary):`,
    computed.fit_summary || "(none)",
    "",
    `Financial notes: ${computed.financial_notes || "(none)"}`,
    "",
    "=== End ===",
  ];
  return lines.join("\n");
}

/**
 * Single entry: all n8n-normalized values for HubSpot + email.
 * Pipeline/stage placeholders when env unset are overridden in the API handler. Owner is only set when HUBSPOT_DEAL_OWNER_ID is set (no default user id).
 * @param {Record<string, string>} raw
 */
export function normalizeLeadPayload(raw) {
  const domain = extractDomain(raw.website);
  const additional_notes = buildAdditionalNotes(raw);
  const annualrevenue = toRevenueMidpoint(raw.revenueRangeText);
  const ebitdaMarginValue = toEbitdaMidpoint(raw.ebitdaMargin);
  const financial_notes = buildFinancialNotes(raw);
  const fit_summary = buildFitSummary(raw);
  const dealname = buildDealName(raw);

  const pipeline = process.env.HUBSPOT_PIPELINE_ID || "default";
  const dealstage = process.env.HUBSPOT_DEAL_STAGE_ID || "2200525526";
  const hubspot_owner_id = process.env.HUBSPOT_DEAL_OWNER_ID?.trim() || "";

  return {
    domain,
    additional_notes,
    annualrevenue,
    ebitdaMarginValue,
    financial_notes,
    fit_summary,
    dealname,
    industryLabel: getIndustryLabel(raw.industry),
    pipeline,
    dealstage,
    hubspot_owner_id,
  };
}
