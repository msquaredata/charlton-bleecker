import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getClientIp } from "@/lib/client-ip";

let ratelimit: Ratelimit | null | undefined;

function leadPostRpm(): number {
  const raw = process.env.PUBLIC_LEAD_POST_RPM?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 15;
  return Number.isFinite(n) && n > 0 ? n : 15;
}

function getLeadPostRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) {
    ratelimit = null;
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(leadPostRpm(), "1 m"),
    prefix: "public-lead-post",
  });
  return ratelimit;
}

/** Returns retry-after seconds when limited; null when allowed or Redis is not configured. */
export async function checkPublicLeadRateLimit(headers: {
  get(name: string): string | null;
}): Promise<{ retryAfter: number } | null> {
  const rl = getLeadPostRatelimit();
  if (!rl) return null;

  const ip = getClientIp(headers) ?? "unknown";
  const result = await rl.limit(`ip:${ip}`);
  if (result.success) return null;

  const retryAfter = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000),
  );
  return { retryAfter };
}
