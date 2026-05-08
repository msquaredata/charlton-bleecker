import "../lib/load-env.js";
import { getIntroEmailMeta } from "../lib/intro-templates/index.js";

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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

export default function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET, OPTIONS");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!checkSecret(req)) {
    return unauthorized(res);
  }

  try {
    const meta = getIntroEmailMeta();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.status(200).json(meta);
  } catch (e) {
    console.error("intro-email-meta:", e);
    return res.status(500).json({ error: "Failed to load metadata" });
  }
}
