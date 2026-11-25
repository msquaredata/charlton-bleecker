import { describe, expect, it } from "vitest";
import {
  ageDaysFromRdap,
  assessSubmissionRisk,
  emailDomain,
  formatRiskBlock,
  parseElapsedMs,
  riskSubjectPrefix,
} from "./submission-risk";

const goodDomain = { canReceiveMail: true, hasMx: true, ageDays: 3000 };
const base = {
  country: "US",
  botCheck: "passed" as const,
  elapsedMs: 45_000,
  domain: goodDomain,
};

describe("assessSubmissionRisk", () => {
  it("rates a clean US deal green", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "deal",
      email: "owner@acmemachining.com",
      message: "We are a family-owned machine shop looking for a succession partner.",
      hqState: "OH",
    });
    expect(r.level).toBe("green");
  });

  it("rates a gmail-only US contact green", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "contact",
      email: "jane@gmail.com",
      message: "Hello, I would like to talk about selling my business next year.",
      domain: { canReceiveMail: true, hasMx: true, ageDays: null },
    });
    expect(r.level).toBe("green");
  });

  it("rates a vendor pitch from an unreachable domain red", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "contact",
      email: "todd@premierecognison.com",
      message: "We reviewed your company profile and offer accounting services and bookkeeping.",
      domain: { canReceiveMail: false, hasMx: false, ageDays: null },
    });
    expect(r.level).toBe("red");
  });

  it("rates the same pitch yellow or worse without domain facts, but not green", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "contact",
      email: "todd@premierecognison.com",
      message: "We reviewed your company profile and offer accounting services.",
      domain: null,
    });
    expect(r.level).not.toBe("green");
  });

  it("rates a non-US deal claiming a US HQ red", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "deal",
      email: "owner@acmemachining.com",
      message: "Looking to sell.",
      country: "NG",
      hqState: "TX",
    });
    expect(r.level).toBe("red");
  });

  it("treats US territories as US", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "deal",
      email: "owner@acmemachining.com",
      message: "Looking to sell my company.",
      country: "PR",
    });
    expect(r.level).toBe("green");
  });

  it("rates a too-fast submission red", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "deal",
      email: "owner@acmemachining.com",
      message: "Looking to sell my company.",
      elapsedMs: 900,
    });
    expect(r.level).toBe("red");
  });

  it("rates a disposable email domain red", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "contact",
      email: "x@mailinator.com",
      message: "Please call me about a possible sale.",
    });
    expect(r.level).toBe("red");
  });

  it("rates a brand-new domain red", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "deal",
      email: "owner@newco.com",
      message: "Looking to sell my company.",
      domain: { canReceiveMail: true, hasMx: true, ageDays: 5 },
    });
    expect(r.level).toBe("red");
  });

  it("never lets missing data alone turn green into red", () => {
    const r = assessSubmissionRisk({
      kind: "deal",
      email: "owner@acmemachining.com",
      message: "Looking to sell my company.",
      botCheck: "passed",
      country: "US",
      elapsedMs: null,
      domain: null,
    });
    expect(r.level).toBe("yellow");
  });
});

describe("helpers", () => {
  it("builds subject prefixes", () => {
    expect(riskSubjectPrefix("red")).toBe("[RED] ");
    expect(riskSubjectPrefix("yellow")).toBe("[YELLOW] ");
    expect(riskSubjectPrefix("green")).toBe("[GREEN] ");
  });

  it("formats the block with reasons", () => {
    const r = assessSubmissionRisk({
      ...base,
      kind: "deal",
      email: "a@b.com",
      message: "x",
      country: "CN",
    });
    const text = formatRiskBlock(r);
    expect(text).toContain("RISK FLAG:");
    expect(text).toContain("outside the US (CN)");
  });

  it("parses the email domain and elapsed time", () => {
    expect(emailDomain("Todd@PremiereCognison.com")).toBe("premierecognison.com");
    expect(emailDomain("nope")).toBeNull();
    expect(parseElapsedMs("1234")).toBe(1234);
    expect(parseElapsedMs("")).toBeNull();
    expect(parseElapsedMs(null)).toBeNull();
    expect(parseElapsedMs("-5")).toBeNull();
  });

  it("reads domain age from RDAP", () => {
    const now = new Date("2026-11-24T00:00:00Z");
    expect(
      ageDaysFromRdap({ events: [{ eventAction: "registration", eventDate: "2026-11-14T00:00:00Z" }] }, now),
    ).toBe(10);
    expect(ageDaysFromRdap({ events: [] }, now)).toBeNull();
    expect(ageDaysFromRdap(null, now)).toBeNull();
  });
});
