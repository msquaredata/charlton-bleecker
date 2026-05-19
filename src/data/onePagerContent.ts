import {
  CRITERIA,
  PILLARS,
  PROCESS_STEPS,
  WHY_US,
} from "@/data/criteria";
import { TEAM } from "@/data/team";

export { CRITERIA, PILLARS, PROCESS_STEPS, WHY_US };

export const CONTACT_EMAIL = "ContactUs@CharltonBleecker.com" as const;

export const CALENDLY_URL =
  "https://calendly.com/gts-charltonbleecker" as const;

const ndaEntry = WHY_US.find(
  (c): c is (typeof WHY_US)[number] & { cta: { label: string; href: string } } =>
    "cta" in c && Boolean(c.cta),
);

export const NDA_TEMPLATE_HREF = ndaEntry?.cta?.href ?? "";

export const HERO_HEADLINE =
  "We partner with founders to build enduring businesses." as const;

export const HERO_TAGLINE =
  "Permanent capital. Operational freedom. Long-term value." as const;

export const ABOUT_HEADLINE =
  "Built differently. Invested permanently." as const;

export const ABOUT_LEAD =
  "Charlton Bleecker Group LLC is a private holding company focused on acquiring and growing enduring scalable B2B businesses. We partner with owner-managers to position companies for long-term success, without the constraints of a fund termination date. Unlike traditional private equity firms, we do not prioritize the exit. Your legacy, your team, and your culture remain intact. We welcome challenges, whether operational, financial or succession." as const;

/** Side-by-side contrasts for the model one-pager. */
export const MODEL_COMPARISON = [
  {
    dimension: "Time horizon",
    traditional: "Fund life and exit timelines drive decisions.",
    ours: "Permanent capital — we compound without a forced exit clock.",
  },
  {
    dimension: "Hold period",
    traditional: "Typical 3–7 year hold; portfolio integration pressure.",
    ours: "We hold for the long term; no flip, no culture reset.",
  },
  {
    dimension: "Governance",
    traditional: "Heavy board control and playbook rollouts common.",
    ours: "Operational autonomy — capital and strategic support, and clear milestones.",
  },
  {
    dimension: "Certainty",
    traditional: "LP committees, fund cycles, and re-trades can stall or change deals.",
    ours: "When we say yes, we mean it. No surprises.",
  },
  {
    dimension: "Process",
    traditional: "Long, opaque auctions and shifting valuation posture.",
    ours: "Fair, transparent reasoning; intro to LOI in weeks when there is fit.",
  },
] as const;

export const BRIEF_HOOK =
  "If you are founder-led and considering a partner for liquidity, growth, or succession, this brief summarizes how we work — and why it is different from a traditional private equity process." as const;

export const TRUST_LEAD = TEAM[0]
  ? `${TEAM[0].name}, ${TEAM[0].title}, leads the firm with a career across investing, banking, operations, and governance.`
  : "Leadership combines deep experience across investing, banking, operations, and governance.";

export const DISCLAIMER_SHORT =
  "This material is for informational purposes only and does not constitute an offer to sell or a solicitation to buy any security." as const;

export const ONE_PAGER_VARIANTS = [
  {
    slug: "model",
    title: "Model comparison",
    description:
      "Traditional private equity firms vs permanent holding — criteria and process on one screen.",
  },
  {
    slug: "overview",
    title: "Visual overview",
    description:
      "Infographic-style flow: positioning, pillars, proof points, and path to close.",
  },
  {
    slug: "brief",
    title: "Founder brief",
    description:
      "Memo-style narrative for a quick read and forward to stakeholders.",
  },
] as const;
