import { NextRequest, NextResponse } from "next/server";
import { normalizeLeadPayload } from "@/lib/intake/normalize.js";
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
} from "@/lib/intake/hubspot.js";
import {
  sendTeamNotification,
  sendSubmitterConfirmation,
  buildTeamNotifySubject,
  buildTeamNotifyBody,
} from "@/lib/intake/email.js";
import {
  guardBodyFromFormData,
  runPublicLeadSpamGuard,
} from "@/lib/public-lead-spam-guard";

export const runtime = "nodejs";

function corsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": process.env.CORS_ALLOW_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function getField(formData: FormData, name: string): string {
  const v = formData.get(name);
  if (v === null || v === undefined) return "";
  return typeof v === "string" ? v : String(v);
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
] as const;

function validate(raw: Record<string, string>): string[] {
  return REQUIRED.filter((k) => !String(raw[k] || "").trim());
}

function shouldSkipHubSpot(): boolean {
  return process.env.LEAD_INTAKE_BYPASS_HUBSPOT === "true";
}

function summarizeHubSpotBody(body: unknown): string {
  if (!body || typeof body !== "object") return "";
  const parts: string[] = [];
  const b = body as Record<string, unknown>;
  if (b.message != null) {
    const m = b.message;
    parts.push(Array.isArray(m) ? m.join("; ") : String(m));
  }
  if (Array.isArray(b.errors)) {
    for (const e of b.errors) {
      if (!e || typeof e !== "object") continue;
      const err = e as Record<string, unknown>;
      let line = [err.message, err.code].filter(Boolean).join(" ");
      const ctx = err.context as Record<string, unknown> | undefined;
      const props = ctx?.propertyName;
      if (Array.isArray(props) && props.length) {
        line = line ? `${line} (${props.join(", ")})` : props.join(", ");
      }
      if (line) parts.push(String(line));
    }
  }
  return parts.filter(Boolean).join("; ");
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  const headers = corsHeaders();

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400, headers },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e) {
    console.error("lead-intake: parse error", e);
    return NextResponse.json(
      { error: "Invalid form data" },
      { status: 400, headers },
    );
  }

  const guard = await runPublicLeadSpamGuard(
    request,
    guardBodyFromFormData(formData),
  );
  if (guard.shortCircuit) {
    return NextResponse.json(guard.body, { status: guard.status, headers });
  }

  const raw: Record<string, string> = {
    firstName: getField(formData, "firstName"),
    lastName: getField(formData, "lastName"),
    email: getField(formData, "email"),
    phone: getField(formData, "phone"),
    role: getField(formData, "role"),
    companyRepresented: getField(formData, "companyRepresented"),
    businessName: getField(formData, "businessName"),
    website: getField(formData, "website"),
    industry: getField(formData, "industry"),
    hqCity: getField(formData, "hqCity"),
    hqState: getField(formData, "hqState"),
    yearFounded: getField(formData, "yearFounded"),
    ownership: getField(formData, "ownership"),
    transitionGoal: getField(formData, "transitionGoal"),
    transitionTiming: getField(formData, "transitionTiming"),
    revenueRangeText: getField(formData, "revenueRangeText"),
    ebitdaMargin: getField(formData, "ebitdaMargin"),
    leverage: getField(formData, "leverage"),
    keyassets: getField(formData, "keyassets"),
    notableCustomers: getField(formData, "notableCustomers"),
    fitReason: getField(formData, "fitReason"),
    challenge: getField(formData, "challenge"),
    hasManagementTeam: getField(formData, "hasManagementTeam"),
    referralSource: getField(formData, "referralSource"),
    otherDetails: getField(formData, "otherDetails"),
  };

  const websiteTrim = raw.website.trim();
  if (websiteTrim && !/^https?:\/\//i.test(websiteTrim)) {
    raw.website = `https://${websiteTrim}`;
  }

  const missing = validate(raw);
  if (missing.length) {
    return NextResponse.json(
      { error: "Missing required fields", fields: missing },
      { status: 400, headers },
    );
  }

  const n = normalizeLeadPayload(raw);

  const token = process.env.HUBSPOT_ACCESS_TOKEN?.trim();

  const redirectRaw =
    process.env.THANK_YOU_REDIRECT?.trim() || "/thank-you";
  const redirect =
    redirectRaw === "thank-you.html" ? "/thank-you" : redirectRaw;

  if (shouldSkipHubSpot()) {
    console.warn(
      "lead-intake: HubSpot skipped (LEAD_INTAKE_BYPASS_HUBSPOT). Team + submitter email via Resend; never enable in production.",
    );
    const subject = buildTeamNotifySubject(raw);
    const text = buildTeamNotifyBody(raw, n, "bypass-no-hubspot-deal");
    const emailResult = await sendTeamNotification({ subject, text });
    if (emailResult.skipped) {
      console.warn(
        "[email] Team notification skipped: set RESEND_API_KEY and INTERNAL_NOTIFY_EMAIL (or TEAM_NOTIFY_EMAIL) to test Resend without HubSpot.",
      );
    } else if (!emailResult.ok) {
      console.error(
        "[email] Resend error (HubSpot skipped):",
        emailResult.status,
        emailResult.errText,
      );
      return NextResponse.json(
        {
          error: "Email notification failed",
          hint:
            typeof emailResult.errText === "string"
              ? emailResult.errText.slice(0, 500)
              : "Resend API returned an error. Check NOTIFY_FROM_EMAIL domain verification in Resend.",
        },
        { status: 502, headers },
      );
    }
    const subResult = await sendSubmitterConfirmation(raw);
    if (!subResult.skipped && !subResult.ok) {
      console.error(
        "[email] Submitter confirmation failed (HubSpot skipped):",
        subResult.status,
        subResult.errText,
      );
    }
    return NextResponse.json(
      { status: "received", redirect },
      { status: 200, headers },
    );
  }

  if (!token) {
    console.error("lead-intake: HUBSPOT_ACCESS_TOKEN is not set");
    return NextResponse.json(
      {
        error: "Server configuration error",
        hint:
          "Add HUBSPOT_ACCESS_TOKEN to .env.local, or set LEAD_INTAKE_BYPASS_HUBSPOT=true to test the form and email without HubSpot.",
      },
      { status: 500, headers },
    );
  }

  try {
    let company = n.domain ? await searchCompanyByDomain(token, n.domain) : null;

    const companyProps = buildCompanyProperties(
      raw,
      n,
    ) as Record<string, string>;

    if (company?.id) {
      await patchObject(token, "companies", company.id, companyProps);
    } else {
      company = await createObject(token, "companies", companyProps);
    }
    const companyId = company.id;

    let contact = await searchContactByEmail(token, raw.email);
    const contactProps = buildContactProperties(
      raw,
      n,
    ) as Record<string, string>;

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

    let pipeline: string;
    let dealstage: string;
    if (!hasExplicitPipeline) {
      const resolved = await getDefaultPipelineAndStage(token);
      pipeline = resolved.pipeline;
      dealstage = hasExplicitStage ? stageEnv! : resolved.stage;
    } else {
      pipeline = pipelineEnv!;
      dealstage = hasExplicitStage
        ? stageEnv!
        : await getFirstStageForPipeline(token, pipeline);
    }

    const dealProps = buildDealProperties(raw, {
      ...n,
      pipeline,
      dealstage,
    }) as Record<string, string>;
    const deal = await createObject(token, "deals", dealProps);
    const dealId = deal.id;

    await associateV4DefaultPut(token, "contact", contactId, "company", companyId);
    await associateV4DefaultPut(token, "deal", dealId, "contact", contactId);
    await associateV4DefaultPut(token, "deal", dealId, "company", companyId);

    const subject = buildTeamNotifySubject(raw);
    const text = buildTeamNotifyBody(raw, n, dealId);
    const emailResult = await sendTeamNotification({ subject, text });
    if (emailResult.skipped) {
      console.warn(
        "[email] Team notification skipped after HubSpot success: set RESEND_API_KEY and INTERNAL_NOTIFY_EMAIL on this deployment.",
      );
    } else if (!emailResult.ok) {
      console.error(
        "[email] Resend error after HubSpot success:",
        emailResult.status,
        emailResult.errText,
      );
    }

    const subResult = await sendSubmitterConfirmation(raw);
    if (!subResult.skipped && !subResult.ok) {
      console.error(
        "[email] Submitter confirmation failed after HubSpot success:",
        subResult.status,
        subResult.errText,
      );
    }

    return NextResponse.json(
      { status: "received", redirect },
      { status: 200, headers },
    );
  } catch (err: unknown) {
    const e = err as { body?: unknown; status?: number; message?: string };
    const body = e?.body;
    const hubspotMsg =
      summarizeHubSpotBody(body) ||
      (typeof body === "string" ? body : "");
    const status = e?.status;
    const isHubSpotAuthFailure =
      status === 401 ||
      /: 401\b/.test(String(e?.message || "")) ||
      /oauth token|access token|unauthorized|invalid.*token|expired.*token/i.test(
        hubspotMsg,
      );

    console.error(
      "lead-intake: HubSpot error",
      e?.message,
      hubspotMsg || body || err,
    );

    const payload: { error: string; hint?: string; detail?: string } = {
      error: "Unable to complete intake. Please try again later.",
    };
    const exposeHint =
      (hubspotMsg || isHubSpotAuthFailure) &&
      (process.env.LEAD_INTAKE_DEBUG === "1" ||
        process.env.VERCEL_ENV === "preview");

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
    return NextResponse.json(payload, { status: 502, headers });
  }
}
