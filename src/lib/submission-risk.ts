import type { BotCheckResult } from "@/lib/public-lead-spam-guard";

/**
 * Rule-based risk flag for public form submissions (contact + deal intake).
 * Label only: it never blocks or hides a submission. Every reason is listed in the email
 * so a human can see why a flag was raised. Any "hard" finding makes the flag red.
 */

export type RiskLevel = "green" | "yellow" | "red";

export type RiskFinding = {
  points: number;
  /** A hard finding turns the flag red on its own. */
  hard?: boolean;
  reason: string;
};

export type RiskAssessment = {
  level: RiskLevel;
  score: number;
  findings: RiskFinding[];
};

export type DomainFacts = {
  /** true if the domain has MX or A/AAAA records, false if it has none, null if unknown. */
  canReceiveMail: boolean | null;
  /** true if the domain has MX records. null if unknown. */
  hasMx: boolean | null;
  /** Days since registration from RDAP. null if unknown. */
  ageDays: number | null;
};

export type RiskInput = {
  kind: "contact" | "deal";
  email: string;
  /** Free text the sender wrote (contact message, or the deal's free-text answers joined). */
  message?: string;
  /** Upper-case ISO country code from the host's edge headers, if any. */
  country?: string;
  botCheck: BotCheckResult;
  /** Milliseconds between the form opening and submitting (measured in the browser). */
  elapsedMs?: number | null;
  /** US state the deal says it is headquartered in (deal form only). */
  hqState?: string;
  domain?: DomainFacts | null;
};

const US_CODES = new Set(["US", "PR", "GU", "VI", "AS", "MP"]);

const FREE_MAIL = new Set([
  "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", "icloud.com",
  "me.com", "live.com", "msn.com", "proton.me", "protonmail.com", "gmx.com",
  "mail.com", "yandex.com",
]);

const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "yopmail.com", "trashmail.com", "throwawaymail.com",
  "sharklasers.com", "getnada.com", "maildrop.cc", "dispostable.com", "fakeinbox.com",
]);

/** Phrases that vendors and spammers use; a real seller or advisor rarely writes these. */
const SOLICITATION_PATTERNS: RegExp[] = [
  /\b(seo|backlinks?|guest post|link ?building|cold email)\b/i,
  /\b(web ?design|website redesign|digital marketing|lead generation|app development|virtual assistant)\b/i,
  /\bsocial media (management|marketing)\b/i,
  /\boutsourc\w*/i,
  /\b(bookkeeping|payroll)\b/i,
  /\baccounting (services|solutions|needs)\b/i,
  /\b(reviewed|came across|visited|saw) your (company|website|profile)\b/i,
  /\bexplor(e|ing) the possibility of (working|partnering)\b/i,
  /\bsupport our (company|business)\S* .{0,40}needs\b/i,
  /\bincrease your (traffic|sales|revenue|leads)\b/i,
];

export function emailDomain(email: string): string | null {
  const at = email.trim().toLowerCase().lastIndexOf("@");
  if (at < 1) return null;
  const domain = email
    .trim()
    .toLowerCase()
    .slice(at + 1);
  return /^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain) ? domain : null;
}

export function parseElapsedMs(value: unknown): number | null {
  if (typeof value === "string" && value.trim() === "") return null;
  const n = typeof value === "string" ? Number(value) : value;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? n : null;
}

export function assessSubmissionRisk(input: RiskInput): RiskAssessment {
  const findings: RiskFinding[] = [];
  const add = (points: number, reason: string, hard = false) =>
    findings.push({ points, reason, ...(hard ? { hard: true } : {}) });

  // Sender address
  const domain = emailDomain(input.email);
  if (!domain) {
    add(3, "The email address looks malformed");
  } else {
    if (DISPOSABLE.has(domain)) {
      add(4, `Throwaway email provider (${domain})`, true);
    } else if (input.kind === "contact" && FREE_MAIL.has(domain)) {
      add(1, `Free email provider (${domain})`);
    }
    const d = input.domain;
    if (d) {
      if (d.canReceiveMail === false) {
        add(5, `The email domain (${domain}) has no mail or DNS records, so it cannot receive email`, true);
      } else if (d.hasMx === false) {
        add(2, `The email domain (${domain}) has no mail (MX) records`);
      }
      if (d.ageDays !== null) {
        if (d.ageDays < 30) {
          add(4, `The email domain was registered ${d.ageDays} day(s) ago`, true);
        } else if (d.ageDays < 90) {
          add(2, `The email domain was registered ${d.ageDays} days ago`);
        }
      }
    }
  }

  // Where it came from (CBG expects US senders; outside the US is rare)
  const country = input.country?.toUpperCase();
  if (!country) {
    add(1, "Location unavailable");
  } else if (!US_CODES.has(country)) {
    add(3, `Sent from outside the US (${country})`);
    if (input.kind === "deal" && input.hqState?.trim()) {
      add(2, `Says it is headquartered in ${input.hqState.trim()}, but was sent from ${country}`);
    }
  }

  // Bot signals
  if (input.botCheck !== "passed") {
    add(2, input.botCheck === "test-mode" ? "Bot check ran in test mode only" : "Bot check did not run");
  }
  if (input.elapsedMs === null || input.elapsedMs === undefined) {
    add(2, "No page-timing data (the form may have been posted directly)");
  } else if (input.elapsedMs < 2500) {
    add(5, `Submitted ${(input.elapsedMs / 1000).toFixed(1)} seconds after the page opened`, true);
  }

  // What it says
  const text = (input.message ?? "").trim();
  if (SOLICITATION_PATTERNS.some((p) => p.test(text))) {
    add(3, "The wording reads like a vendor sales pitch, not a seller or advisor");
  }
  if (input.kind === "contact") {
    const links = (text.match(/https?:\/\/|www\./gi) ?? []).length;
    if (links >= 3) add(3, `Contains ${links} links`);
    else if (links >= 1) add(1, "Contains a link");
    if (text.length > 0 && text.length < 15) add(1, "Very short message");
  }

  const score = findings.reduce((sum, f) => sum + f.points, 0);
  const level: RiskLevel =
    findings.some((f) => f.hard) || score >= 5 ? "red" : score >= 2 ? "yellow" : "green";
  return { level, score, findings };
}

export function riskSubjectPrefix(level: RiskLevel): string {
  return `[${level.toUpperCase()}] `;
}

export function formatRiskBlock(a: RiskAssessment): string {
  const label = a.level.toUpperCase();
  const lines = [`RISK FLAG: ${label} (score ${a.score})`];
  if (a.findings.length === 0) {
    lines.push("- No warning signs found");
  } else {
    for (const f of a.findings) lines.push(`- ${f.reason}${f.hard ? " (strong signal)" : ""}`);
  }
  lines.push(
    "An automatic estimate from the signals above. Green is not a guarantee and red is not proof; it never blocks a submission.",
  );
  return lines.join("\n");
}

/** Days since registration from an RDAP domain response, or null if it has no registration event. */
export function ageDaysFromRdap(rdap: unknown, now: Date = new Date()): number | null {
  const events = (rdap as { events?: { eventAction?: string; eventDate?: string }[] } | null)?.events;
  if (!Array.isArray(events)) return null;
  const reg = events.find((e) => e.eventAction === "registration" && e.eventDate);
  if (!reg?.eventDate) return null;
  const t = Date.parse(reg.eventDate);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((now.getTime() - t) / 86_400_000));
}

/**
 * Looks up whether the sender's domain can receive mail and how old it is.
 * Fails open: anything slow or unknown comes back null, which adds no points.
 */
export async function lookupDomainFacts(
  domain: string,
  timeoutMs = 2500,
): Promise<DomainFacts> {
  const unknown: DomainFacts = { canReceiveMail: null, hasMx: null, ageDays: null };
  const work = (async (): Promise<DomainFacts> => {
    const dns = await import("node:dns/promises");
    const missing = (e: unknown) => {
      const code = (e as { code?: string })?.code;
      return code === "ENOTFOUND" || code === "ENODATA";
    };
    const probe = async <T,>(p: Promise<T[]>) => {
      try {
        return { ok: (await p).length > 0, fail: false };
      } catch (e) {
        return { ok: false, fail: !missing(e) };
      }
    };
    const [mx, a, aaaa] = await Promise.all([
      probe(dns.resolveMx(domain)),
      probe(dns.resolve4(domain)),
      probe(dns.resolve6(domain)),
    ]);
    const anyFailed = mx.fail || a.fail || aaaa.fail;
    const canReceiveMail = mx.ok || a.ok || aaaa.ok ? true : anyFailed ? null : false;
    const hasMx = mx.ok ? true : mx.fail ? null : false;

    let ageDays: number | null = null;
    try {
      const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
        headers: { accept: "application/rdap+json" },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (res.ok) ageDays = ageDaysFromRdap(await res.json());
    } catch {
      /* fail open */
    }
    return { canReceiveMail, hasMx, ageDays };
  })();
  const timeout = new Promise<DomainFacts>((resolve) => setTimeout(() => resolve(unknown), timeoutMs + 500));
  try {
    return await Promise.race([work, timeout]);
  } catch {
    return unknown;
  }
}
