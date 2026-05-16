/**
 * Best-effort LinkedIn headshot URL via Unavatar (unofficial third-party).
 * LinkedIn has no supported public API for arbitrary profile photos; this can
 * break or rate-limit. Prefer files under /public/team/ when available.
 */
export function linkedInUnavatarSrc(linkedinUrl: string | null): string | null {
  if (!linkedinUrl?.trim()) return null;
  const m = linkedinUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);
  const raw = m?.[1]?.replace(/\/$/, "").trim();
  if (!raw) return null;
  const slug = decodeURIComponent(raw);
  return `https://unavatar.io/linkedin.com/in/${encodeURIComponent(slug)}`;
}
