import { describe, expect, it } from "vitest";
import { describeSubmissionSignals } from "@/lib/submission-signals";

function headers(values: Record<string, string>) {
  return { get: (name: string) => values[name.toLowerCase()] ?? null };
}

describe("describeSubmissionSignals", () => {
  it("reports country, region, city and a passed bot check", () => {
    const text = describeSubmissionSignals(
      headers({
        "x-vercel-ip-country": "US",
        "x-vercel-ip-country-region": "FL",
        "x-vercel-ip-city": "Fort%20Lauderdale",
      }),
      "passed",
    );
    expect(text).toContain("US (United States), FL, Fort Lauderdale");
    expect(text).toContain("Bot check: Turnstile passed");
  });

  it("falls back to Cloudflare's country header", () => {
    const text = describeSubmissionSignals(
      headers({ "cf-ipcountry": "de" }),
      "passed",
    );
    expect(text).toContain("DE (Germany)");
  });

  it("says so when no location is available and the bot check did not run", () => {
    const text = describeSubmissionSignals(headers({}), "not-configured");
    expect(text).toContain("unknown (location header not available)");
    expect(text).toContain("NOT RUN");
  });

  it("never prints an IP address", () => {
    const text = describeSubmissionSignals(
      headers({ "x-forwarded-for": "203.0.113.9", "x-vercel-ip-country": "US" }),
      "passed",
    );
    expect(text).not.toContain("203.0.113.9");
  });
});
