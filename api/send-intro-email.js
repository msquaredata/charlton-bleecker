import "../lib/load-env.js";
import { sendViaResend } from "../lib/email.js";
import { getOutreachFromDefault } from "../lib/intro-templates/constants.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
}

function unauthorized(res) {
  return res.status(401).json({ error: "Unauthorized" });
}

function checkSecret(req) {
  const secret = process.env.OUTREACH_UTILITY_SECRET;
  if (!secret) return false;
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  return token === secret;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_HTML = 600_000;
const MAX_TEXT = 200_000;
const MAX_FROM = 320;

function sanitizeOneLine(s, max) {
  return String(s ?? "")
    .replace(/[\r\n\u2028\u2029]/g, " ")
    .trim()
    .slice(0, max);
}

/** @returns {{ list: string[] } | { error: string }} */
function parseReplyToField(raw) {
  const t = String(raw ?? "").trim();
  if (!t) return { list: [] };
  const parts = t.split(",").map((p) => p.trim()).filter(Boolean);
  for (const p of parts) {
    if (!EMAIL_RE.test(p)) {
      return { error: `Invalid Reply-To address: ${p}` };
    }
  }
  return { list: parts };
}

/** Remove obvious script injections from HTML body (internal tool; light guard). */
function stripDangerousHtml(html) {
  return String(html)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\bon\w+\s*=/gi, "data-stripped=");
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

  if (!checkSecret(req)) {
    return unauthorized(res);
  }

  let body = await readJsonBody(req);
  if (!body) {
    return res.status(400).json({ error: "Invalid or missing JSON body" });
  }

  const to = String(body.to || "").trim();
  const subject = String(body.subject || "").trim();
  let html = String(body.html || "");
  let text = String(body.text || "");

  if (!to || !EMAIL_RE.test(to)) {
    return res.status(400).json({ error: "Invalid or missing 'to' email address" });
  }
  if (!subject) {
    return res.status(400).json({ error: "Missing subject" });
  }
  if (!html && !text) {
    return res.status(400).json({ error: "Provide html and/or text" });
  }
  if (html.length > MAX_HTML || text.length > MAX_TEXT) {
    return res.status(400).json({ error: "Payload too large" });
  }

  if (html) {
    html = stripDangerousHtml(html);
  }
  if (!text && html) {
    text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  let fromHeader = sanitizeOneLine(body.from, MAX_FROM);
  if (!fromHeader) {
    fromHeader = getOutreachFromDefault();
  }
  if (!fromHeader.includes("@")) {
    return res.status(400).json({
      error:
        "From must include an email address on a domain verified in Resend (e.g. G Todd Silva <you@mail.charltonbleecker.com>).",
    });
  }

  const replyParsed = parseReplyToField(body.replyTo);
  if ("error" in replyParsed) {
    return res.status(400).json({ error: replyParsed.error });
  }

  const result = await sendViaResend({
    to,
    subject,
    html,
    text,
    from: fromHeader,
    replyTo: replyParsed.list.length ? replyParsed.list : undefined,
  });

  if (result.skipped) {
    return res.status(503).json({
      error: "Email not configured",
      detail: "Set RESEND_API_KEY and NOTIFY_FROM_EMAIL (or RESEND_FROM_EMAIL) on the server.",
    });
  }
  if (!result.ok) {
    return res.status(502).json({
      error: "Send failed",
      status: result.status,
      detail:
        typeof result.errText === "string"
          ? result.errText.slice(0, 800)
          : undefined,
    });
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(200).json({ ok: true });
}

/** @param {import('http').IncomingMessage} req */
async function readJsonBody(req) {
  const direct = coerceJsonBody(req);
  if (direct) return direct;
  const chunks = [];
  try {
    for await (const chunk of req) {
      chunks.push(chunk);
    }
  } catch (_e) {
    return null;
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** @param {import('http').IncomingMessage} req */
function coerceJsonBody(req) {
  const b = req.body;
  if (b && typeof b === "object" && !Buffer.isBuffer(b)) {
    return b;
  }
  if (typeof b === "string") {
    try {
      return JSON.parse(b || "{}");
    } catch {
      return null;
    }
  }
  return null;
}
