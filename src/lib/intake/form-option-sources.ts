/** CSV paths for submit-form dropdowns (Label,Value,Active? format). */
export const FORM_OPTION_CSV = {
  role: "/assets/data/roles.csv",
  industry: "/assets/data/industries.csv",
  hqState: "/assets/data/hq-states.csv",
  ownership: "/assets/data/ownership.csv",
  transitionGoal: "/assets/data/transition-goals.csv",
  transitionTiming: "/assets/data/transition-timing.csv",
  revenueRangeText: "/assets/data/revenue-ranges.csv",
  ebitdaMargin: "/assets/data/ebitda-margins.csv",
  leverage: "/assets/data/leverage.csv",
  referralSource: "/assets/data/referral-sources.csv",
} as const;

export type FormOptionKey = keyof typeof FORM_OPTION_CSV;
