/**
 * Team notification — parity with former n8n Outlook step.
 * Set RESEND_API_KEY + INTERNAL_NOTIFY_EMAIL (+ optional FROM_EMAIL) or use SMTP (see .env.example).
 */

/**
 * Matches n8n "Outlook - Notify Team" subject line.
 * @param {Record<string, string>} raw
 */
export function buildTeamNotifySubject(raw) {
  return `New Deal Submission — ${raw.firstName} ${raw.lastName} - ${raw.businessName}`;
}

/**
 * Matches n8n "Outlook - Notify Team" body (HubSpot link when HUBSPOT_PORTAL_ID is set).
 * @param {Record<string, string>} raw
 * @param {object} n normalizeLeadPayload result
 * @param {string} dealId
 */
export function buildTeamNotifyBody(raw, n, dealId) {
  const portal = process.env.HUBSPOT_PORTAL_ID;
  const hubSpotLine = portal
    ? `https://app.hubspot.com/contacts/${portal}/record/0-3/${dealId}`
    : `${dealId} (set HUBSPOT_PORTAL_ID in env for a direct HubSpot link)`;

  return `A new deal submission has been received from the website.

Name: ${raw.firstName} ${raw.lastName}
Email: ${raw.email}
Role: ${raw.role}
Company: ${raw.businessName} || ${raw.companyRepresented || ""}
Revenue: ${raw.revenueRangeText}
EBITDA Margin: ${raw.ebitdaMargin}
Industry: ${n.industryLabel || raw.industry}
Headquarters: ${raw.hqCity}, ${raw.hqState}

Deal Summary: ${n.fit_summary || ""}

To review this lead in HubSpot:
${hubSpotLine}

— Charlton Bleecker Intake System`;
}

/**
 * Confirmation to the person who submitted the form.
 * @param {Record<string, string>} raw
 */
export function buildSubmitterConfirmationSubject() {
  return "Thank you for your submission!";
}

/**
 * @param {Record<string, string>} raw
 */
export function buildSubmitterConfirmationBody(raw) {
  const firstName = raw.firstName?.trim() || "there";
  return `Dear ${firstName},

Thank you for taking the time to share your business opportunity with the Charlton Bleecker Group.

Your submission has been received successfully, and our team will review the details shortly.

If your submission aligns with our current focus areas, one of our partners will reach out to you directly to discuss next steps.

We appreciate your trust and interest in working with us.

Warm regards,

The Charlton Bleecker Group Team
https://www.charltonbleecker.com/`;
}

/**
 * Generic Resend send (team notifications, submitter confirmation, outreach utility).
 * @param {object} opts
 * @param {string} opts.subject
 * @param {string} opts.text
 * @param {string} [opts.html]
 * @param {string|string[]} opts.to
 * @param {string} [opts.from] — overrides NOTIFY_FROM_EMAIL / RESEND_FROM_EMAIL when set
 * @param {string|string[]} [opts.replyTo] — Resend `reply_to` (e.g. inbox on root domain while From uses verified subdomain)
 */
export async function sendViaResend(opts) {
  const resendKey = process.env.RESEND_API_KEY;
  const from =
    opts.from ||
    process.env.NOTIFY_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "Deal Intake <onboarding@resend.dev>";

  if (!resendKey) {
    return { skipped: true };
  }

  const toList = Array.isArray(opts.to)
    ? opts.to
    : String(opts.to)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  if (!toList.length) {
    return { skipped: true };
  }

  /** @type Record<string, unknown> */
  const payload = {
    from,
    to: toList,
    subject: opts.subject,
    text: opts.text,
    html:
      opts.html ||
      `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(opts.text)}</pre>`,
  };

  if (opts.replyTo != null && opts.replyTo !== "") {
    const raw = Array.isArray(opts.replyTo)
      ? opts.replyTo
      : String(opts.replyTo).split(",");
    const replyList = raw.map((s) => String(s).trim()).filter(Boolean);
    if (replyList.length) {
      payload.reply_to = replyList;
    }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[email] Resend error:", res.status, errText);
    return { ok: false, status: res.status, errText };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: true, data };
}

async function sendResendEmail(opts) {
  return sendViaResend(opts);
}

/**
 * @param {object} opts
 * @param {string} opts.subject
 * @param {string} opts.text
 * @param {string} [opts.html]
 */
export async function sendTeamNotification(opts) {
  const to = process.env.INTERNAL_NOTIFY_EMAIL || process.env.TEAM_NOTIFY_EMAIL;

  if (!to) {
    console.warn(
      "[email] Skipping team notification: set RESEND_API_KEY and INTERNAL_NOTIFY_EMAIL (or configure SMTP_* in a fork)."
    );
    return { skipped: true };
  }

  const result = await sendResendEmail({
    to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
  if (result.skipped) {
    console.warn(
      "[email] Skipping team notification: set RESEND_API_KEY and INTERNAL_NOTIFY_EMAIL (or configure SMTP_* in a fork)."
    );
    return { skipped: true };
  }
  return result;
}

/**
 * Thank-you email to the submitter. Set LEAD_INTAKE_SEND_SUBMITTER_EMAIL=false to disable.
 * Uses the same Resend key + NOTIFY_FROM_EMAIL as team mail; does not require INTERNAL_NOTIFY_EMAIL.
 * @param {Record<string, string>} raw
 */
export async function sendSubmitterConfirmation(raw) {
  if (process.env.LEAD_INTAKE_SEND_SUBMITTER_EMAIL === "false") {
    return { skipped: true };
  }

  const addr = String(raw.email || "").trim();
  if (!addr) {
    return { skipped: true };
  }

  const subject = buildSubmitterConfirmationSubject();
  const text = buildSubmitterConfirmationBody(raw);
  const result = await sendResendEmail({ to: addr, subject, text });

  if (result.skipped) {
    console.warn(
      "[email] Submitter confirmation skipped: set RESEND_API_KEY and NOTIFY_FROM_EMAIL (verified domain in Resend)."
    );
  }
  return result;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
