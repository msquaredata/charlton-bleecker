"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import FadeUp from "@/components/ui/FadeUp";
import { US_STATES } from "@/data/us-states";

const KEY_ASSETS = [
  "Contracts",
  "Equipment",
  "Goodwill/Brand",
  "IP/Patents",
  "Real Estate",
  "Team",
  "Technology",
  "Other",
] as const;

const CHALLENGES = [
  "Succession Planning",
  "Excessive Debt",
  "Need Growth Capital",
  "Operational Efficiency",
  "Market Pressure/Competition",
  "Overdue Bills",
  "Other",
] as const;

const ROLES = [
  "Owner",
  "Accountant",
  "Advisor",
  "Attorney",
  "Broker",
  "Executive",
  "Other",
] as const;

const OWNERSHIP = [
  "Founder/Family-Owned",
  "Partnership",
  "Private Company",
  "PE-Backed",
  "Other",
] as const;

const GOALS = [
  "Exit",
  "Growth Capital",
  "Partial Sale/Recap",
  "Strategic Partnership",
] as const;

const TIMING = ["Immediate", "< 12 months", "1–3 years", "3+ years"] as const;

const REVENUE = [
  "< $2M",
  "$2–5M",
  "$5–10M",
  "$10–25M",
  "$25M+",
] as const;

const EBITDA = [
  "Negative",
  "< 5%",
  "5–10%",
  "10–20%",
  "20%+",
] as const;

const LEVERAGE = [
  "None",
  "Manageable",
  "Heavily Leveraged",
  "Prefer not to say",
] as const;

const REFERRAL = ["Referral", "Website", "Event", "Other"] as const;

type IndustryOpt = { label: string; value: string };

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-white/90"
    >
      {children}
      {required ? <span className="text-[var(--color-accent)]"> *</span> : null}
    </label>
  );
}

function MultiToggle({
  id,
  label,
  options,
  selected,
  onChange,
}: {
  id: string;
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const toggleByValue = useCallback(
    (v: string) => {
      const on = selected.includes(v);
      onChange(on ? selected.filter((x) => x !== v) : [...selected, v]);
    },
    [selected, onChange],
  );

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-white/90">{label}</legend>
      <div
        id={id}
        className="flex flex-wrap gap-2 rounded-md border border-white/20 bg-white/5 p-3"
      >
        {options.map((opt) => {
          const on = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleByValue(opt)}
              className={
                on
                  ? "rounded-full bg-[var(--color-accent)] px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white/85 hover:border-white/50"
              }
            >
              {opt}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function Submit() {
  const router = useRouter();
  const [industries, setIndustries] = useState<IndustryOpt[]>([]);
  const [loadIndErr, setLoadIndErr] = useState<string | null>(null);
  const [keyassets, setKeyassets] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/assets/data/industries.csv");
        if (!res.ok) throw new Error(String(res.status));
        const text = await res.text();
        const lines = text.trim().split("\n").slice(1);
        const parsed: IndustryOpt[] = [];
        for (const line of lines) {
          const parts = line.split(",").map((p) => p.trim());
          const label = parts[0];
          const value = parts[1];
          const active = parts[2]?.toUpperCase();
          if (active === "Y" && label && value) parsed.push({ label, value });
        }
        if (!cancelled) setIndustries(parsed);
      } catch {
        if (!cancelled) setLoadIndErr("Could not load industries.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const website = String(fd.get("website") || "").trim();
    if (website && !/^https?:\/\//i.test(website)) {
      fd.set("website", `https://${website}`);
    }

    fd.set("keyassets", keyassets.join(", "));
    fd.set("challenge", challenge.join(", "));
    if (!(form.elements.namedItem("hasManagementTeam") as HTMLInputElement)
      ?.checked) {
      fd.delete("hasManagementTeam");
    } else {
      fd.set("hasManagementTeam", "on");
    }

    try {
      const res = await fetch("/api/lead-intake", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as {
        status?: string;
        redirect?: string;
        error?: string;
        hint?: string;
        fields?: string[];
      };

      if (res.ok && data.status === "received") {
        const r = data.redirect || "/thank-you";
        const path = r.startsWith("/") ? r : `/${r}`;
        router.push(path === "/thank-you.html" ? "/thank-you" : path);
        return;
      }

      let msg = data.error || "Submission failed.";
      if (Array.isArray(data.fields) && data.fields.length) {
        msg += ` Missing: ${data.fields.join(", ")}.`;
      } else if (data.hint) {
        msg += ` ${data.hint}`;
      }
      setErrorMsg(msg);
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <section id="submit" className="section-pad bg-[var(--color-dark)] text-white">
      <div className="container-site max-w-3xl">
        <FadeUp>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
            Deal intake
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold md:text-4xl">
            Submit Your Company
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Share a concise overview below. Estimates are fine. We&apos;ll respond
            within one business day.
          </p>
        </FadeUp>
        <FadeUp delay={0.08}>
          <form className="mt-10 space-y-12" onSubmit={onSubmit} noValidate>
            {errorMsg ? (
              <div
                role="alert"
                className="rounded-md border border-red-400/60 bg-red-950/40 px-4 py-3 text-sm"
              >
                {errorMsg}
              </div>
            ) : null}

            <div>
              <h3 className="font-display text-lg font-semibold">1 · Contact</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="firstName" required>
                    First name
                  </FieldLabel>
                  <input
                    id="firstName"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="lastName" required>
                    Last name
                  </FieldLabel>
                  <input
                    id="lastName"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="role" required>
                    Role / relationship
                  </FieldLabel>
                  <select
                    id="role"
                    name="role"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="email" required>
                    Email
                  </FieldLabel>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="phone" required>
                    Phone
                  </FieldLabel>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="^(\+?1-)?\d{3}-\d{3}-\d{4}$"
                    title="XXX-XXX-XXXX or +1-XXX-XXX-XXXX"
                    placeholder="+1-555-000-1234"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="companyRepresented">
                    Company represented (if not owner)
                  </FieldLabel>
                  <input
                    id="companyRepresented"
                    name="companyRepresented"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                2 · Business profile
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="businessName" required>
                    Business name
                  </FieldLabel>
                  <input
                    id="businessName"
                    name="businessName"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="website" required>
                    Website
                  </FieldLabel>
                  <input
                    id="website"
                    name="website"
                    required
                    placeholder="www.example.com"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="industry" required>
                    Industry / sector
                  </FieldLabel>
                  <select
                    id="industry"
                    name="industry"
                    required
                    defaultValue=""
                    className={inputClass}
                    disabled={!industries.length && !loadIndErr}
                  >
                    <option value="" disabled>
                      {loadIndErr
                        ? loadIndErr
                        : industries.length
                          ? "Select industry"
                          : "Loading…"}
                    </option>
                    {industries.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="hqCity" required>
                    HQ city
                  </FieldLabel>
                  <input id="hqCity" name="hqCity" required className={inputClass} />
                </div>
                <div>
                  <FieldLabel htmlFor="hqState" required>
                    HQ state
                  </FieldLabel>
                  <select
                    id="hqState"
                    name="hqState"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {US_STATES.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="yearFounded">Year founded</FieldLabel>
                  <input
                    id="yearFounded"
                    name="yearFounded"
                    type="number"
                    min={1800}
                    max={2100}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                3 · Ownership &amp; transaction
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="ownership" required>
                    Current ownership
                  </FieldLabel>
                  <select
                    id="ownership"
                    name="ownership"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select type
                    </option>
                    {OWNERSHIP.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="transitionGoal" required>
                    Transaction goal
                  </FieldLabel>
                  <select
                    id="transitionGoal"
                    name="transitionGoal"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select goal
                    </option>
                    {GOALS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="transitionTiming" required>
                    Transaction timing
                  </FieldLabel>
                  <select
                    id="transitionTiming"
                    name="transitionTiming"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select timing
                    </option>
                    {TIMING.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                4 · Financial snapshot
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3 md:col-span-1">
                  <FieldLabel htmlFor="revenueRangeText" required>
                    Annual revenue
                  </FieldLabel>
                  <select
                    id="revenueRangeText"
                    name="revenueRangeText"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select range
                    </option>
                    {REVENUE.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3 md:col-span-1">
                  <FieldLabel htmlFor="ebitdaMargin" required>
                    EBITDA margin
                  </FieldLabel>
                  <select
                    id="ebitdaMargin"
                    name="ebitdaMargin"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select margin
                    </option>
                    {EBITDA.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3 md:col-span-1">
                  <FieldLabel htmlFor="leverage" required>
                    Debt / leverage
                  </FieldLabel>
                  <select
                    id="leverage"
                    name="leverage"
                    required
                    defaultValue=""
                    className={inputClass}
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    {LEVERAGE.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <MultiToggle
                    id="keyassets-toggle"
                    label="Key assets"
                    options={KEY_ASSETS}
                    selected={keyassets}
                    onChange={setKeyassets}
                  />
                </div>
                <div className="sm:col-span-3">
                  <FieldLabel htmlFor="notableCustomers">
                    Notable customers or contracts
                  </FieldLabel>
                  <textarea
                    id="notableCustomers"
                    name="notableCustomers"
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                5 · Strategic fit
              </h3>
              <div className="mt-4 grid gap-4">
                <div>
                  <FieldLabel htmlFor="fitReason">
                    Why is this a strong fit for Charlton Bleecker?
                  </FieldLabel>
                  <textarea
                    id="fitReason"
                    name="fitReason"
                    rows={4}
                    className={inputClass}
                  />
                </div>
                <MultiToggle
                  id="challenge-toggle"
                  label="Biggest current challenges"
                  options={CHALLENGES}
                  selected={challenge}
                  onChange={setChallenge}
                />
                <div className="flex items-start gap-2">
                  <input
                    id="hasManagementTeam"
                    name="hasManagementTeam"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-white/30"
                  />
                  <label
                    htmlFor="hasManagementTeam"
                    className="text-sm text-white/85"
                  >
                    Experienced management team in place
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                6 · Miscellaneous
              </h3>
              <div className="mt-4 grid gap-4">
                <div>
                  <FieldLabel htmlFor="referralSource">
                    How did you hear about us?
                  </FieldLabel>
                  <select
                    id="referralSource"
                    name="referralSource"
                    defaultValue={REFERRAL[0]}
                    className={inputClass}
                  >
                    {REFERRAL.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="otherDetails">Other details</FieldLabel>
                  <textarea
                    id="otherDetails"
                    name="otherDetails"
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-white/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/60">
                By submitting, you agree to our confidentiality &amp; data use
                terms.
              </p>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-12 min-w-[160px] items-center justify-center rounded-sm bg-[var(--color-accent)] px-8 font-semibold text-white hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        </FadeUp>
      </div>
    </section>
  );
}
