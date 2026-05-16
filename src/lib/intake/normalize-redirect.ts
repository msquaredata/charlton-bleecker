/** Map legacy thank-you paths to Next routes. */
export function normalizeThankYouRedirect(redirect?: string): string {
  const r = (redirect || "/thank-you").trim();
  if (r === "thank-you.html" || r === "/thank-you.html") return "/thank-you";
  return r.startsWith("/") ? r : `/${r}`;
}

export function leadIntakeApiUrl(): string {
  const base = process.env.NEXT_PUBLIC_LEAD_INTAKE_API_URL?.replace(/\/$/, "");
  return base ? `${base}/api/lead-intake` : "/api/lead-intake";
}
