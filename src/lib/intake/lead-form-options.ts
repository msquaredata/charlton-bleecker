/** Multiselect + validation patterns. Select options load from `public/assets/data/*.csv`. */

/** Fallback values if a CSV fails to load (matches legacy `index.html`). */
export const ROLES = [
  "Owner",
  "Accountant",
  "Advisor",
  "Attorney",
  "Broker",
  "Executive",
  "Other",
] as const;

export const OWNERSHIP = [
  "Founder/Family-Owned",
  "Partnership",
  "Private Company",
  "PE-Backed",
  "Other",
] as const;

export const GOALS = [
  "Exit",
  "Growth Capital",
  "Partial Sale/Recap",
  "Strategic Partnership",
] as const;

export const TIMING = ["Immediate", "< 12 months", "1–3 years", "3+ years"] as const;

export const REVENUE = [
  "< $2M",
  "$2–5M",
  "$5–10M",
  "$10–25M",
  "$25M+",
] as const;

export const EBITDA = [
  "Negative",
  "< 5%",
  "5–10%",
  "10–20%",
  "20%+",
] as const;

export const LEVERAGE = [
  "None",
  "Manageable",
  "Heavily Leveraged",
  "Prefer not to say",
] as const;

export const REFERRAL = ["Referral", "Website", "Event", "Other"] as const;

export const KEY_ASSETS = [
  "Contracts",
  "Equipment",
  "Goodwill/Brand",
  "IP/Patents",
  "Real Estate",
  "Team",
  "Technology",
  "Other",
] as const;

export const CHALLENGES = [
  "Succession Planning",
  "Excessive Debt",
  "Need Growth Capital",
  "Operational Efficiency",
  "Market Pressure/Competition",
  "Overdue Bills",
  "Other",
] as const;

export const WEBSITE_PATTERN =
  "^(https?:\\/\\/)?(www\\.)?[a-zA-Z0-9][a-zA-Z0-9\\-]{0,61}[a-zA-Z0-9]?(\\.[a-zA-Z]{2,})+(/.*)?$";
