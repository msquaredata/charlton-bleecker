import { afterEach, describe, expect, it, vi } from "vitest";
import {
  TURNSTILE_CLOUDFLARE_TEST_SECRET_ALWAYS_PASS,
  extractTurnstileToken,
  isLeadHoneypotTripped,
  omitSpamGuardFields,
  runPublicLeadSpamGuard,
} from "@/lib/public-lead-spam-guard";

const request = { headers: { get: () => null } };

describe("isLeadHoneypotTripped", () => {
  it("is false when honeypot empty or missing", () => {
    expect(isLeadHoneypotTripped({})).toBe(false);
    expect(isLeadHoneypotTripped({ _lead_hp: "" })).toBe(false);
    expect(isLeadHoneypotTripped({ _lead_hp: "   " })).toBe(false);
  });

  it("is true when honeypot has content", () => {
    expect(isLeadHoneypotTripped({ _lead_hp: "bot" })).toBe(true);
  });
});

describe("extractTurnstileToken", () => {
  it("reads known field aliases", () => {
    expect(extractTurnstileToken({ cfTurnstileResponse: "a" })).toBe("a");
    expect(extractTurnstileToken({ "cf-turnstile-response": "b" })).toBe("b");
  });
});

describe("omitSpamGuardFields", () => {
  it("removes anti-spam keys", () => {
    const out = omitSpamGuardFields({
      name: "Jane",
      _lead_hp: "",
      cfTurnstileResponse: "tok",
    });
    expect(out).toEqual({ name: "Jane" });
  });
});

describe("runPublicLeadSpamGuard", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("honeypot trip returns 200 without side effects shape", async () => {
    const result = await runPublicLeadSpamGuard(request, { _lead_hp: "spam" });
    expect(result).toEqual({
      shortCircuit: true,
      status: 200,
      body: {
        success: true,
        message: "Thanks — we've received your message.",
      },
    });
  });

  it("requires token when secret is set", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "real-secret");
    const result = await runPublicLeadSpamGuard(request, {});
    expect(result).toMatchObject({
      shortCircuit: true,
      status: 400,
      body: { code: "TURNSTILE_REQUIRED" },
    });
  });

  it("accepts any non-empty token with Cloudflare test secret", async () => {
    vi.stubEnv(
      "TURNSTILE_SECRET_KEY",
      TURNSTILE_CLOUDFLARE_TEST_SECRET_ALWAYS_PASS,
    );
    const result = await runPublicLeadSpamGuard(request, {
      cfTurnstileResponse: "dummy-token",
    });
    expect(result).toEqual({ shortCircuit: false });
  });

  it("fails verification for garbage token with real secret", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "real-secret");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: false }),
      }),
    );
    const result = await runPublicLeadSpamGuard(request, {
      cfTurnstileResponse: "bad",
    });
    expect(result).toMatchObject({
      shortCircuit: true,
      status: 403,
      body: { code: "TURNSTILE_FAILED" },
    });
  });
});
