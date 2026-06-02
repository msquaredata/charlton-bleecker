/** Client IP behind a trusted proxy (first X-Forwarded-For hop, else X-Real-IP). */
export function getClientIp(headers: {
  get(name: string): string | null;
}): string | undefined {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return undefined;
}
