/**
 * GET /api — avoids a bare 404 when someone opens /api in the browser.
 * The form POSTs to /api/lead-intake (multipart).
 */
export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      service: "lead-intake-form-cbg",
      message:
        "POST multipart/form-data to /api/lead-intake (same fields as the HTML form). Outreach utility: GET /api/intro-email-meta and POST /api/send-intro-email (Bearer OUTREACH_UTILITY_SECRET).",
      leadIntake: "/api/lead-intake",
      outreachMeta: "/api/intro-email-meta",
      outreachSend: "/api/send-intro-email",
    });
  }
  res.setHeader("Allow", "GET, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  return res.status(405).json({ error: "Method not allowed" });
}
