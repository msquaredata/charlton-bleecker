"use client";

import { useEffect, useState } from "react";
import {
  FORM_OPTION_CSV,
  type FormOptionKey,
} from "@/lib/intake/form-option-sources";
import {
  EBITDA,
  GOALS,
  LEVERAGE,
  OWNERSHIP,
  REFERRAL,
  REVENUE,
  ROLES,
  TIMING,
} from "@/lib/intake/lead-form-options";
import {
  fetchFormOptions,
  type FormOption,
} from "@/lib/intake/parse-form-options-csv";
import { US_STATES } from "@/data/us-states";

function asOptions(values: readonly string[]): FormOption[] {
  return values.map((v) => ({ label: v, value: v }));
}

const FALLBACK: Record<FormOptionKey, FormOption[]> = {
  role: asOptions(ROLES),
  industry: [],
  hqState: US_STATES.map((s) => ({ label: s.name, value: s.code })),
  ownership: asOptions(OWNERSHIP),
  transitionGoal: asOptions(GOALS),
  transitionTiming: asOptions(TIMING),
  revenueRangeText: asOptions(REVENUE),
  ebitdaMargin: asOptions(EBITDA),
  leverage: asOptions(LEVERAGE),
  referralSource: asOptions(REFERRAL),
};

function mergeOptions(
  incoming?: Record<FormOptionKey, FormOption[]>,
): Record<FormOptionKey, FormOption[]> {
  const next = { ...FALLBACK };
  if (!incoming) return next;
  for (const key of Object.keys(FORM_OPTION_CSV) as FormOptionKey[]) {
    const opts = incoming[key];
    if (opts?.length) next[key] = opts;
  }
  return next;
}

function isComplete(opts: Record<FormOptionKey, FormOption[]>): boolean {
  return (Object.keys(FORM_OPTION_CSV) as FormOptionKey[]).every(
    (k) => opts[k].length > 0,
  );
}

export function useLeadFormOptions(
  initialFromServer?: Record<FormOptionKey, FormOption[]>,
) {
  const [options, setOptions] = useState<Record<FormOptionKey, FormOption[]>>(
    () => mergeOptions(initialFromServer),
  );
  const [errors, setErrors] = useState<Partial<Record<FormOptionKey, string>>>(
    {},
  );

  useEffect(() => {
    if (initialFromServer && isComplete(mergeOptions(initialFromServer))) {
      if (initialFromServer.industry.length) {
        window.dispatchEvent(new CustomEvent("leadForm:industriesLoaded"));
      }
      return;
    }

    let cancelled = false;
    const entries = Object.entries(FORM_OPTION_CSV) as [
      FormOptionKey,
      string,
    ][];

    void Promise.all(
      entries.map(async ([key, url]) => {
        try {
          const opts = await fetchFormOptions(url);
          if (!opts.length) throw new Error("empty");
          return { key, opts, error: null as string | null };
        } catch {
          return {
            key,
            opts: FALLBACK[key],
            error: "Error loading options",
          };
        }
      }),
    ).then((results) => {
      if (cancelled) return;
      const next = { ...FALLBACK };
      const nextErrors: Partial<Record<FormOptionKey, string>> = {};
      for (const { key, opts, error } of results) {
        next[key] = opts.length ? opts : FALLBACK[key];
        if (error) nextErrors[key] = error;
      }
      setOptions(next);
      setErrors(nextErrors);
      if (next.industry.length) {
        window.dispatchEvent(new CustomEvent("leadForm:industriesLoaded"));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [initialFromServer]);

  return { options, errors };
}
