/** POST endpoints that accept anonymous public leads (rate limit + spam guard). */
export const PUBLIC_LEAD_POST_PATHS = [
  "/api/contact",
  "/api/lead-intake",
] as const;

export type PublicLeadPostPath = (typeof PUBLIC_LEAD_POST_PATHS)[number];

export function isPublicLeadPostPath(pathname: string): pathname is PublicLeadPostPath {
  return (PUBLIC_LEAD_POST_PATHS as readonly string[]).includes(pathname);
}
