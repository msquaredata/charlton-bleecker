/**
 * Browser-only: merge tokens + email HTML shell (keep behavior aligned with server meta defaults).
 */

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Insert vars into {{tokens}}; escape replacement values for HTML context. */
export function mergeTokensHtml(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = vars[key];
    return escapeHtml(v != null && v !== "" ? String(v) : "");
  });
}

/** Plain-text email body: no HTML escaping on values. */
export function mergeTokensPlain(template, vars) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const v = vars[key];
    return v != null && v !== "" ? String(v) : "";
  });
}

function paragraphsToHtml(plain) {
  const chunks = plain
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return chunks
    .map(
      (p) =>
        `<p style="margin:0 0 14px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:#1a1a1a;">${p.replace(/\n/g, "<br/>")}</p>`
    )
    .join("");
}

const CTA_LABEL = "Share your opportunity (deal prospect intake)";

/**
 * @param {object} opts
 * @param {string} opts.mergedBodyPlain — already merged plain text (main letter)
 * @param {string} opts.ctaUrl
 * @param {string} opts.logoUrl
 * @param {string} opts.tagline
 * @param {string} opts.closingPhrase
 * @param {string[]} opts.signatureLines
 */
export function buildFullEmailHtml(opts) {
  const { mergedBodyPlain, ctaUrl, logoUrl, tagline, closingPhrase, signatureLines } =
    opts;
  const innerHtml = paragraphsToHtml(mergedBodyPlain.trim());
  const sigHtml = signatureLines
    .map(
      (line) =>
        `<div style="margin:0 0 2px 0;font-family:Georgia,'Times New Roman',serif;font-size:14px;line-height:1.45;color:#1a1a1a;">${escapeHtml(line)}</div>`
    )
    .join("");
  const safeUrl = escapeHtml(ctaUrl);
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#f4f2ef;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f2ef;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e6e2dc;border-radius:4px;">
<tr><td style="padding:28px 28px 16px 28px;text-align:center;border-bottom:1px solid #ece8e3;">
<img src="${escapeHtml(logoUrl)}" alt="Charlton Bleecker" width="220" style="max-width:220px;height:auto;display:block;margin:0 auto 14px auto;border:0;"/>
<div style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:#5c5348;font-style:italic;line-height:1.4;">${escapeHtml(tagline)}</div>
</td></tr>
<tr><td style="padding:24px 28px 32px 28px;">
${innerHtml}
<p style="margin:22px 0 16px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.55;color:#1a1a1a;">
<a href="${safeUrl}" style="color:#1a4d6d;font-weight:600;text-decoration:underline;">${escapeHtml(CTA_LABEL)}</a>
</p>
<p style="margin:0 0 10px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;line-height:1.5;color:#1a1a1a;">${escapeHtml(closingPhrase)}</p>
${sigHtml}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/**
 * @param {object} opts
 * @param {string} opts.mergedBodyPlain
 * @param {string} opts.ctaUrl
 * @param {string} opts.closingPhrase
 * @param {string[]} opts.signatureLines
 */
export function buildFullEmailText(opts) {
  const { mergedBodyPlain, ctaUrl, closingPhrase, signatureLines } = opts;
  const lines = [
    mergedBodyPlain.trim(),
    "",
    `${CTA_LABEL}: ${ctaUrl}`,
    "",
    closingPhrase,
    ...signatureLines,
  ];
  return lines.join("\n");
}
