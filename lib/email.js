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
Industry: ${raw.industry}
Headquarters: ${raw.hqCity}, ${raw.hqState}

Deal Summary: ${n.fit_summary || ""}

To review this lead in HubSpot:
${hubSpotLine}

— Charlton Bleecker Intake System`;
}

/**
 * @param {object} opts
 * @param {string} opts.subject
 * @param {string} opts.text
 * @param {string} [opts.html]
 */
export async function sendTeamNotification(opts) {
  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.INTERNAL_NOTIFY_EMAIL || process.env.TEAM_NOTIFY_EMAIL;
  const from =
    process.env.NOTIFY_FROM_EMAIL ||
    process.env.RESEND_FROM_EMAIL ||
    "Deal Intake <onboarding@resend.dev>";

  if (!resendKey || !to) {
    console.warn(
      "[email] Skipping team notification: set RESEND_API_KEY and INTERNAL_NOTIFY_EMAIL (or configure SMTP_* in a fork)."
    );
    return { skipped: true };
  }

  const recipients = String(to)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: opts.subject,
      text: opts.text,
      html: opts.html || `<pre style="font-family:system-ui,sans-serif;white-space:pre-wrap">${escapeHtml(opts.text)}</pre>`,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("[email] Resend error:", res.status, errText);
    return { ok: false, status: res.status, errText };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: true, data };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
