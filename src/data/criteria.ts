export const PILLARS = [
  {
    title: "Operational Freedom",
    body: "Our model gives managers the freedom to lead, with the backing of experienced investors focused on long-term value creation. We provide capital and strategic support — not a new boss.",
    image: "/operationalfreedom.png",
  },
  {
    title: "Collaborative Expertise",
    body: "Our team brings deep expertise spanning corporate finance, M&A, capital raising, governance, legal, and turnarounds — providing both strategic insight and tactical execution from day one.",
    image: "/collaborativeexperience.png",
  },
  {
    title: "Sector Focus",
    body: "We invest in industries where we can add meaningful value: Healthcare, Technology, Defense, Professional Services, and Industrials.",
    image: "/sectorfocus.png",
  },
] as const;

export const CRITERIA = [
  { label: "Annual Revenue", value: "$3M – $30M" },
  { label: "EBITDA", value: "$1M – $8M" },
  { label: "EBITDA Margin", value: "15%+" },
  { label: "Geography", value: "United States" },
  { label: "Ownership", value: "Founder-owned" },
  { label: "Business Type", value: "B2B Focus" },
  { label: "Hold Period", value: "Permanent" },
  { label: "Deal Structure", value: "Flexible" },
] as const;

export const WHY_US = [
  {
    icon: "Shield" as const,
    title: "Your Legacy, Protected",
    body: "We don't flip. We hold. Your brand, culture, and people remain intact after the transaction — no integration into a portfolio, no culture reset.",
  },
  {
    icon: "Users" as const,
    title: "Operational Autonomy",
    body: "Management stays in place. We provide capital and strategic support — not a new boss or a corporate playbook.",
  },
  {
    icon: "CheckCircle" as const,
    title: "Certainty of Close",
    body: "Permanent capital means no fund cycles, no LP approval committees, no re-trades. When we say yes, we mean it.",
  },
  {
    icon: "BarChart2" as const,
    title: "Fair, Transparent Valuations",
    body: "We lead with our number and explain our math. No games, no bait-and-switch after diligence.",
  },
  {
    icon: "Zap" as const,
    title: "Speed & Simplicity",
    body: "Intro call to LOI in weeks, not months. Focused diligence from an experienced team that respects your time.",
  },
  {
    icon: "Lock" as const,
    title: "Confidentiality First",
    body: "NDA available before any conversation begins. We protect your process and your people throughout.",
    cta: {
      label: "Download NDA",
      href: "https://www.dropbox.com/scl/fi/2m4d1l5l4o3qphqobz8z2/CBG-Template-Non-Disclosure-Agreement-FINAL.docx?rlkey=ou8xxne8wandla7rrb5witc6y&st=7u4jq0uu&dl=0",
    },
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Intro Call",
    body: "30-minute conversation to assess fit — no pressure, no deck required.",
  },
  {
    number: "02",
    title: "NDA & Overview",
    body: "Sign our NDA, share a brief overview of your business at your comfort level.",
  },
  {
    number: "03",
    title: "Letter of Intent",
    body: "We move fast. LOI with our valuation framework typically within 2–4 weeks.",
  },
  {
    number: "04",
    title: "Due Diligence",
    body: "Focused, respectful diligence process — typically 45–60 days.",
  },
  {
    number: "05",
    title: "Close",
    body: "Legal docs, funding, and transition planning executed efficiently.",
  },
  {
    number: "06",
    title: "Partnership",
    body: "We're in it for the long haul. Ongoing strategic support, capital access, and collaboration.",
  },
] as const;
