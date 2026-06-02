"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import FadeUp from "@/components/ui/FadeUp";
import LeadFormDevFixtures from "@/components/intake/LeadFormDevFixtures";
import SubmitThankYouInline from "@/components/intake/SubmitThankYouInline";
import { useLeadFormOptions } from "@/hooks/useLeadFormOptions";
import type { FormOptionKey } from "@/lib/intake/form-option-sources";
import type { FormOption } from "@/lib/intake/parse-form-options-csv";

export type SubmitProps = {
  /** Preloaded from CSV on the server so dropdowns are populated on first paint. */
  initialOptions?: Record<FormOptionKey, FormOption[]>;
};
import {
  CHALLENGES,
  KEY_ASSETS,
  PHONE_PATTERN,
  WEBSITE_PATTERN,
} from "@/lib/intake/lead-form-options";
import { isEmbeddedFrame } from "@/lib/intake/is-embedded";
import {
  leadIntakeApiUrl,
  normalizeThankYouRedirect,
} from "@/lib/intake/normalize-redirect";
import PublicLeadHoneypotInput from "@/components/forms/PublicLeadHoneypotInput";
import PublicLeadTurnstile, {
  isPublicLeadTurnstileEnabled,
} from "@/components/forms/PublicLeadTurnstile";

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

function OptionsSelect({
  optionKey,
  id,
  name,
  label,
  required,
  placeholder,
  options,
  loadError,
  defaultValue = "",
  inputClass,
}: {
  optionKey: FormOptionKey;
  id: string;
  name: string;
  label: React.ReactNode;
  required?: boolean;
  placeholder: string;
  options: FormOption[];
  loadError?: string;
  defaultValue?: string;
  inputClass: string;
}) {
  const loading = !options.length && !loadError;
  return (
    <div>
      <FieldLabel htmlFor={id} required={required}>
        {label}
      </FieldLabel>
      <select
        key={`${id}-${options.length}-${loadError ?? ""}`}
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        disabled={loading && Boolean(required)}
        className={`${inputClass} [&>option]:bg-white [&>option]:text-[#1a1a1a]`}
        data-option-key={optionKey}
      >
        {required ? (
          <option value="" disabled>
            {loadError ||
              (options.length ? placeholder : "Loading options...")}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Submit({ initialOptions }: SubmitProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const { options, errors } = useLeadFormOptions(initialOptions);
  const [keyassets, setKeyassets] = useState<string[]>([]);
  const [challenge, setChallenge] = useState<string[]>([]);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showInlineThankYou, setShowInlineThankYou] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (isPublicLeadTurnstileEnabled() && !turnstileToken.trim()) {
      setErrorMsg("Please complete the security check below.");
      return;
    }

    setSubmitting(true);
    const form = e.currentTarget;
    const fd = new FormData(form);

    const website = String(fd.get("website") || "").trim();
    if (website && !/^https?:\/\//i.test(website)) {
      fd.set("website", `https://${website}`);
    }

    if (!(form.elements.namedItem("hasManagementTeam") as HTMLInputElement)
      ?.checked) {
      fd.delete("hasManagementTeam");
    } else {
      fd.set("hasManagementTeam", "on");
    }

    fd.set("_lead_hp", honeypotRef.current?.value ?? "");
    if (turnstileToken.trim()) {
      fd.set("cf-turnstile-response", turnstileToken.trim());
    }

    try {
      const res = await fetch(leadIntakeApiUrl(), {
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
        const path = normalizeThankYouRedirect(data.redirect);
        if (isEmbeddedFrame()) {
          setShowInlineThankYou(true);
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.setTimeout(() => router.push(path), 800);
        }
        return;
      }

      let msg = data.error || "Submission failed. Please try again.";
      if (Array.isArray(data.fields) && data.fields.length) {
        msg += ` Missing: ${data.fields.join(", ")}.`;
      } else if (data.hint) {
        msg += ` ${data.hint}`;
      }
      setErrorMsg(msg);
    } catch {
      setErrorMsg("Unable to connect to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-[var(--color-accent)] focus:outline-none";

  return (
    <section id="submit" className="pb-24 bg-[var(--color-dark)] text-white">
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
          {showInlineThankYou ? (
            <SubmitThankYouInline />
          ) : (
          <form
            ref={formRef}
            id="leadForm"
            className="mt-10 space-y-12"
            onSubmit={onSubmit}
            noValidate
          >
            <PublicLeadHoneypotInput ref={honeypotRef} />
            <input type="hidden" name="keyassets" value={keyassets.join(", ")} />
            <input type="hidden" name="challenge" value={challenge.join(", ")} />
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
                  <FieldLabel htmlFor="firstNameInput" required>
                    First name
                  </FieldLabel>
                  <input
                    id="firstNameInput"
                    name="firstName"
                    required
                    autoComplete="given-name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="lastNameInput" required>
                    Last name
                  </FieldLabel>
                  <input
                    id="lastNameInput"
                    name="lastName"
                    required
                    autoComplete="family-name"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <OptionsSelect
                    optionKey="role"
                    id="roleSelect"
                    name="role"
                    label="Role / relationship"
                    required
                    placeholder="Select role"
                    options={options.role}
                    loadError={errors.role}
                    inputClass={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="emailInput" required>
                    Email
                  </FieldLabel>
                  <input
                    id="emailInput"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="phoneInput" required>
                    Phone
                  </FieldLabel>
                  <input
                    id="phoneInput"
                    name="phone"
                    type="tel"
                    required
                    pattern={PHONE_PATTERN}
                    title="Please enter a phone number in the format XXX-XXX-XXXX, optionally including the country code (e.g., +1-555-000-1234)."
                    placeholder="+1-555-000-1234"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="companyRepresentedInput">
                    Company represented (if not owner)
                  </FieldLabel>
                  <input
                    id="companyRepresentedInput"
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
                  <FieldLabel htmlFor="businessNameInput" required>
                    Business name
                  </FieldLabel>
                  <input
                    id="businessNameInput"
                    name="businessName"
                    required
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="websiteInput" required>
                    Website
                  </FieldLabel>
                  <input
                    id="websiteInput"
                    name="website"
                    required
                    placeholder="www.example.com"
                    pattern={WEBSITE_PATTERN}
                    title="Please enter a valid website URL (e.g., www.example.com or example.com)"
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <OptionsSelect
                    optionKey="industry"
                    id="industrySelect"
                    name="industry"
                    label="Industry / sector"
                    required
                    placeholder="Select an option..."
                    options={options.industry}
                    loadError={errors.industry}
                    inputClass={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="hqCityInput" required>
                    HQ city
                  </FieldLabel>
                  <input
                    id="hqCityInput"
                    name="hqCity"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <OptionsSelect
                    optionKey="hqState"
                    id="hqStateSelect"
                    name="hqState"
                    label="HQ state"
                    required
                    placeholder="Select state"
                    options={options.hqState}
                    loadError={errors.hqState}
                    inputClass={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="yearFoundedInput">Year founded</FieldLabel>
                  <input
                    id="yearFoundedInput"
                    name="yearFounded"
                    type="number"
                    min={1800}
                    max={2100}
                    pattern="\d{4}"
                    title="Please enter a four-digit year (e.g., 1998)."
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
                  <OptionsSelect
                    optionKey="ownership"
                    id="ownershipSelect"
                    name="ownership"
                    label="Current ownership"
                    required
                    placeholder="Select type"
                    options={options.ownership}
                    loadError={errors.ownership}
                    inputClass={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <OptionsSelect
                    optionKey="transitionGoal"
                    id="transitionGoalSelect"
                    name="transitionGoal"
                    label="Transaction goal"
                    required
                    placeholder="Select goal"
                    options={options.transitionGoal}
                    loadError={errors.transitionGoal}
                    inputClass={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <OptionsSelect
                    optionKey="transitionTiming"
                    id="transitionTimingSelect"
                    name="transitionTiming"
                    label="Transaction timing"
                    required
                    placeholder="Select timing"
                    options={options.transitionTiming}
                    loadError={errors.transitionTiming}
                    inputClass={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-lg font-semibold">
                4 · Financial snapshot
              </h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-3 md:col-span-1">
                  <OptionsSelect
                    optionKey="revenueRangeText"
                    id="revenueRangeTextSelect"
                    name="revenueRangeText"
                    label="Annual revenue"
                    required
                    placeholder="Select range"
                    options={options.revenueRangeText}
                    loadError={errors.revenueRangeText}
                    inputClass={inputClass}
                  />
                </div>
                <div className="sm:col-span-3 md:col-span-1">
                  <OptionsSelect
                    optionKey="ebitdaMargin"
                    id="ebitdaMarginSelect"
                    name="ebitdaMargin"
                    label="EBITDA margin"
                    required
                    placeholder="Select margin"
                    options={options.ebitdaMargin}
                    loadError={errors.ebitdaMargin}
                    inputClass={inputClass}
                  />
                </div>
                <div className="sm:col-span-3 md:col-span-1">
                  <OptionsSelect
                    optionKey="leverage"
                    id="leverageSelect"
                    name="leverage"
                    label="Debt / leverage"
                    required
                    placeholder="Select status"
                    options={options.leverage}
                    loadError={errors.leverage}
                    inputClass={inputClass}
                  />
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
                  <FieldLabel htmlFor="notableCustomersInput">
                    Notable customers or contracts
                  </FieldLabel>
                  <textarea
                    id="notableCustomersInput"
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
                  <FieldLabel htmlFor="fitReasonInput">
                    Why is this a strong fit for Charlton Bleecker?
                  </FieldLabel>
                  <textarea
                    id="fitReasonInput"
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
                    id="hasManagementTeamCheckbox"
                    name="hasManagementTeam"
                    type="checkbox"
                    className="mt-1 size-4 rounded border-white/30"
                  />
                  <label
                    htmlFor="hasManagementTeamCheckbox"
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
                  <OptionsSelect
                    optionKey="referralSource"
                    id="referralSourceSelect"
                    name="referralSource"
                    label="How did you hear about us?"
                    placeholder="Select source"
                    options={options.referralSource}
                    loadError={errors.referralSource}
                    defaultValue={
                      options.referralSource[0]?.value ?? "Referral"
                    }
                    inputClass={inputClass}
                  />
                </div>
                <div>
                  <FieldLabel htmlFor="otherDetailsInput">Other detail</FieldLabel>
                  <textarea
                    id="otherDetailsInput"
                    name="otherDetails"
                    rows={3}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <PublicLeadTurnstile
              className="border-t border-white/15 pt-6"
              onToken={setTurnstileToken}
              onExpire={() => setTurnstileToken("")}
            />

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
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
          )}
        </FadeUp>
        <LeadFormDevFixtures
          industriesReady={options.industry.length > 0}
          onApplyKeyassets={setKeyassets}
          onApplyChallenge={setChallenge}
          onClearMultiselects={() => {
            setKeyassets([]);
            setChallenge([]);
          }}
        />
      </div>
    </section>
  );
}

