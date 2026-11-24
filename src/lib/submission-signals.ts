import type { BotCheckResult } from "@/lib/public-lead-spam-guard";

type HeaderReader = { get(name: string): string | null };

const BOT_CHECK_LABEL: Record<BotCheckResult, string> = {
  passed: "Turnstile passed",
  "test-mode": "Turnstile in TEST mode (not a real check)",
  "not-configured": "NOT RUN (Turnstile is not configured on this deployment)",
};

function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function readHeader(headers: HeaderReader, name: string): string | undefined {
  const raw = headers.get(name)?.trim();
  if (!raw) return undefined;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/**
 * Plain-text block appended to team notification emails: where the request came from
 * (approximate, from the host's edge headers) and whether the bot check ran.
 * Does not include the visitor's IP address.
 */
export function describeSubmissionSignals(
  headers: HeaderReader,
  botCheck: BotCheckResult,
): string {
  const country = (
    readHeader(headers, "x-vercel-ip-country") ??
    readHeader(headers, "cf-ipcountry")
  )?.toUpperCase();
  const region = readHeader(headers, "x-vercel-ip-country-region");
  const city = readHeader(headers, "x-vercel-ip-city");

  const place = country
    ? [`${country} (${countryName(country)})`, region, city]
        .filter(Boolean)
        .join(", ")
    : "unknown (location header not available)";

  return [
    "--- Submission signals (added by the site, not typed by the sender) ---",
    `Country of origin: ${place}`,
    `Bot check: ${BOT_CHECK_LABEL[botCheck]}`,
    "Hidden spam trap (honeypot): clear",
    "Location is approximate and a VPN or proxy can hide it.",
  ].join("\n");
}
