/**
 * HubSpot CRM, aligned with n8n "Lead Capture - Reactive" HTTP nodes.
 * Default associations use v4 PUT `/crm/v4/objects/{from}/.../default/{to}/...` (documented API).
 */

const BASE = "https://api.hubapi.com";

/** @param {string} token */
function headers(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

/**
 * @param {string} token
 * @param {string} method
 * @param {string} path
 * @param {object} [body]
 */
export async function hubspotRequest(token, method, path, body) {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: headers(token),
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const err = new Error(`HubSpot ${method} ${path}: ${res.status}`);
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

/**
 * v4 default (unlabeled) association, one pair per request (stable path in HubSpot docs).
 * @param {string} token
 * @param {'contact'|'company'|'deal'} fromType
 * @param {string} fromId
 * @param {'contact'|'company'|'deal'} toType
 * @param {string} toId
 */
export async function associateV4DefaultPut(token, fromType, fromId, toType, toId) {
  const path = `/crm/v4/objects/${fromType}/${fromId}/associations/default/${toType}/${toId}`;
  await hubspotRequest(token, "PUT", path);
}

/**
 * @param {string} token
 * @returns {Promise<{ pipeline: string, stage: string }>}
 */
export async function getDefaultPipelineAndStage(token) {
  const data = await hubspotRequest(token, "GET", "/crm/v3/pipelines/deals");
  const first = data?.results?.[0];
  if (!first?.id || !first.stages?.[0]?.id) {
    throw new Error("Could not resolve default deal pipeline/stage from HubSpot");
  }
  return { pipeline: first.id, stage: first.stages[0].id };
}

/**
 * First stage id for a specific deal pipeline (when only pipeline id is set in env).
 * @param {string} token
 * @param {string} pipelineId
 */
export async function getFirstStageForPipeline(token, pipelineId) {
  const data = await hubspotRequest(token, "GET", "/crm/v3/pipelines/deals");
  const p = data?.results?.find((x) => String(x.id) === String(pipelineId));
  if (!p?.stages?.[0]?.id) {
    throw new Error(`Could not resolve deal stage for pipeline ${pipelineId}`);
  }
  return p.stages[0].id;
}

/**
 * @param {string} token
 * @param {string} domain
 */
export async function searchCompanyByDomain(token, domain) {
  if (!domain) return null;
  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "domain",
            operator: "EQ",
            value: domain,
          },
        ],
      },
    ],
    properties: ["name", "domain"],
    limit: 1,
  };
  const data = await hubspotRequest(token, "POST", "/crm/v3/objects/companies/search", body);
  return data?.results?.[0] || null;
}

/**
 * @param {string} token
 * @param {string} email
 */
export async function searchContactByEmail(token, email) {
  if (!email) return null;
  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: "email",
            operator: "EQ",
            value: email.toLowerCase().trim(),
          },
        ],
      },
    ],
    properties: ["email", "firstname", "lastname"],
    limit: 1,
  };
  const data = await hubspotRequest(token, "POST", "/crm/v3/objects/contacts/search", body);
  return data?.results?.[0] || null;
}

/** Property internal names; override via env; defaults match n8n HTTP/HubSpot nodes */
export function propertyNames() {
  return {
    contact: {
      submitterType: process.env.HUBSPOT_CONTACT_PROP_SUBMITTER_TYPE || "submitter_type",
      additionalNotes: process.env.HUBSPOT_CONTACT_PROP_ADDITIONAL_NOTES || "additional_notes",
    },
    company: {
      ownershipStructure:
        process.env.HUBSPOT_COMPANY_PROP_OWNERSHIP_STRUCTURE || "ownership_structure",
      foundedYear: process.env.HUBSPOT_COMPANY_PROP_FOUNDED_YEAR || "founded_year",
      notableCustomers: process.env.HUBSPOT_COMPANY_PROP_NOTABLE_CUSTOMERS || "notable_customers",
      annualrevenue: process.env.HUBSPOT_COMPANY_PROP_ANNUAL_REVENUE || "annualrevenue",
    },
    deal: {
      transitionGoal: process.env.HUBSPOT_DEAL_PROP_TRANSITION_GOAL || "transition_goal",
      transitionTiming: process.env.HUBSPOT_DEAL_PROP_TRANSITION_TIMING || "transition_timing",
      sourceDetail: process.env.HUBSPOT_DEAL_PROP_SOURCE_DETAIL || "source_detail",
      financialNotes: process.env.HUBSPOT_DEAL_PROP_FINANCIAL_NOTES || "financial_notes",
      fileAttachments: process.env.HUBSPOT_DEAL_PROP_FILE_ATTACHMENTS || "file_attachments",
    },
  };
}

/**
 * n8n "Create Company" body, extended fields on by default (set HUBSPOT_USE_EXTENDED_COMPANY_PROPS=false to trim).
 * @param {Record<string, string>} raw
 * @param {object} n
 * @param {string} n.domain
 * @param {number | null} n.annualrevenue
 */
export function buildCompanyProperties(raw, n) {
  const names = propertyNames().company;
  const props = {
    name: raw.businessName || "Unknown company",
    website: raw.website || undefined,
    domain: n.domain || undefined,
    industry: raw.industry || undefined,
    city: raw.hqCity || undefined,
    state: raw.hqState || undefined,
  };

  const extended = process.env.HUBSPOT_USE_EXTENDED_COMPANY_PROPS !== "false";
  if (extended) {
    if (raw.ownership) props[names.ownershipStructure] = raw.ownership;
    if (raw.yearFounded) props[names.foundedYear] = String(raw.yearFounded);
    if (raw.notableCustomers) props[names.notableCustomers] = raw.notableCustomers;
    if (n.annualrevenue != null) props[names.annualrevenue] = String(n.annualrevenue);
    if (n.hubspot_owner_id) props.hubspot_owner_id = String(n.hubspot_owner_id);
  }

  return stripUndefined(props);
}

/**
 * n8n "Create or update a contact", submitter_type, additional_notes, hubspot_owner_id.
 * @param {Record<string, string>} raw
 * @param {object} n
 * @param {string} n.additional_notes
 * @param {string} n.hubspot_owner_id
 */
export function buildContactProperties(raw, n) {
  const names = propertyNames().contact;
  const props = {
    firstname: raw.firstName || "",
    lastname: raw.lastName || "",
    email: raw.email?.toLowerCase().trim() || "",
    phone: raw.phone || "",
  };

  const extended = process.env.HUBSPOT_USE_EXTENDED_CONTACT_PROPS !== "false";
  if (extended) {
    if (raw.role) props[names.submitterType] = raw.role;
    if (n.additional_notes) props[names.additionalNotes] = n.additional_notes;
    if (n.hubspot_owner_id) props.hubspot_owner_id = String(n.hubspot_owner_id);
  }

  return stripUndefined(props);
}

/**
 * n8n "Create Deal", description = fit_summary only; same custom props as workflow.
 * @param {Record<string, string>} raw
 * @param {object} n
 */
export function buildDealProperties(raw, n) {
  const names = propertyNames().deal;
  const props = {
    dealname: n.dealname,
    pipeline: n.pipeline,
    dealstage: n.dealstage,
    description: n.fit_summary || "",
  };

  const useExtended = process.env.HUBSPOT_USE_EXTENDED_DEAL_PROPS !== "false";
  if (useExtended) {
    if (raw.transitionGoal) props[names.transitionGoal] = raw.transitionGoal;
    if (raw.transitionTiming) props[names.transitionTiming] = raw.transitionTiming;
    if (n.financial_notes) props[names.financialNotes] = n.financial_notes;
    if (raw.referralSource) props[names.sourceDetail] = raw.referralSource;
    if (n.hubspot_owner_id) props.hubspot_owner_id = String(n.hubspot_owner_id);
    props[names.fileAttachments] = "";
  }

  return stripUndefined(props);
}

function stripUndefined(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null) out[k] = v;
  }
  return out;
}

/**
 * @param {string} token
 * @param {'companies'|'contacts'|'deals'} objectType
 * @param {Record<string, string>} properties
 */
export async function createObject(token, objectType, properties) {
  const data = await hubspotRequest(token, "POST", `/crm/v3/objects/${objectType}`, {
    properties,
  });
  return data;
}

export async function patchObject(token, objectType, id, properties) {
  return hubspotRequest(token, "PATCH", `/crm/v3/objects/${objectType}/${id}`, {
    properties,
  });
}

