import { getClientIp } from "@/lib/client-ip";

/** Hidden honeypot field — must stay empty for real users. */
export const PUBLIC_LEAD_HONEYPOT_FIELD = "_lead_hp";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare test secret — skip siteverify; accept any non-empty token. NEVER in production. */
export const TURNSTILE_CLOUDFLARE_TEST_SECRET_ALWAYS_PASS =
  "1x0000000000000000000000000000000AA";

export function extractTurnstileToken(
  body: Record<string, unknown>,
): string | undefined {
  const raw =
    body.cfTurnstileResponse ??
    body.turnstileToken ??
    body.cf_turnstile_response ??
    body["cf-turnstile-response"];
  if (typeof raw === "string" && raw.trim().length > 0) return raw.trim();
  return undefined;
}

export function isLeadHoneypotTripped(body: Record<string, unknown>): boolean {
  const hp = body[PUBLIC_LEAD_HONEYPOT_FIELD];
  return typeof hp === "string" && hp.trim().length > 0;
}

async function verifyTurnstileToken(
  token: string,
  remoteIp: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return true;
  if (secret === TURNSTILE_CLOUDFLARE_TEST_SECRET_ALWAYS_PASS) {
    return token.trim().length > 0;
  }
  const params = new URLSearchParams();
  params.set("secret", secret);
  params.set("response", token);
  if (remoteIp) params.set("remoteip", remoteIp);
  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}

export type PublicLeadSpamGuardResult =
  | { shortCircuit: true; status: number; body: Record<string, unknown> }
  | { shortCircuit: false };

/** Honeypot + Turnstile. Does not mutate body. */
export async function runPublicLeadSpamGuard(
  request: { headers: { get(name: string): string | null } },
  body: Record<string, unknown>,
): Promise<PublicLeadSpamGuardResult> {
  if (isLeadHoneypotTripped(body)) {
    return {
      shortCircuit: true,
      status: 200,
      body: {
        success: true,
        message: "Thanks — we've received your message.",
      },
    };
  }

  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (secret) {
    const token = extractTurnstileToken(body);
    if (!token) {
      return {
        shortCircuit: true,
        status: 400,
        body: {
          success: false,
          error:
            "Security check failed. Please refresh the page and try again.",
          code: "TURNSTILE_REQUIRED",
        },
      };
    }
    const remoteIp = getClientIp(request.headers);
    const ok = await verifyTurnstileToken(token, remoteIp);
    if (!ok) {
      return {
        shortCircuit: true,
        status: 403,
        body: {
          success: false,
          error: "Security verification failed. Please try again.",
          code: "TURNSTILE_FAILED",
        },
      };
    }
  }

  return { shortCircuit: false };
}

const SPAM_GUARD_BODY_KEYS = [
  PUBLIC_LEAD_HONEYPOT_FIELD,
  "cfTurnstileResponse",
  "turnstileToken",
  "cf_turnstile_response",
  "cf-turnstile-response",
] as const;

export function omitSpamGuardFields<T extends Record<string, unknown>>(
  body: T,
): T {
  const out = { ...body } as Record<string, unknown>;
  for (const k of SPAM_GUARD_BODY_KEYS) {
    delete out[k];
  }
  return out as T;
}

/** Build guard input from multipart lead intake FormData. */
export function guardBodyFromFormData(formData: FormData): Record<string, unknown> {
  const get = (name: string): string => {
    const v = formData.get(name);
    if (v === null || v === undefined) return "";
    return typeof v === "string" ? v : String(v);
  };
  return {
    [PUBLIC_LEAD_HONEYPOT_FIELD]: get(PUBLIC_LEAD_HONEYPOT_FIELD),
    cfTurnstileResponse: get("cfTurnstileResponse"),
    turnstileToken: get("turnstileToken"),
    cf_turnstile_response: get("cf_turnstile_response"),
    "cf-turnstile-response": get("cf-turnstile-response"),
  };
}
