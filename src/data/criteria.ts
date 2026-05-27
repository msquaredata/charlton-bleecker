export const PILLARS = [
  {
    title: "Operational Freedom",
    body: "Our model gives managers the freedom to lead, with the backing of experienced investors focused on long-term value creation. We provide capital and strategic support.",
    image: "/operationalfreedom.png",
  },
  {
    title: "Collaborative Expertise",
    body: "Our team brings deep expertise spanning corporate finance, M&A, capital raising, technology, governance, and legal, providing both strategic insight and tactical execution from day one.",
    image: "/collaborativeexperience.png",
  },
  {
    title: "Sector Focus",
    body: "We invest in B2B industries where we can add meaningful value including Healthcare, Professional Services, and the intersection of Industrial Manufacturing & Technology.",
    image: "/sectorfocus.png",
  },
] as const;

export const CRITERIA = [
  { label: "Annual Revenue", value: "$3M+" },
  { label: "EBITDA", value: "$1M+" },
  { label: "EBITDA Margin", value: "15%+ potential" },
  { label: "Geography", value: "United States" },
  { label: "Ownership", value: "Founder-owned" },
  { label: "Business Type", value: "B2B Focus" },
  { label: "Hold Period", value: "Long term to permanent" },
  { label: "Deal Structure", value: "Flexible, creative" },
] as const;

export const WHY_US = [
  {
    icon: "Shield" as const,
    title: "Your Legacy, Protected",
    body: "We build and grow. We don't flip. Your brand, culture, and people remain intact after the transaction, no culture reset.",
  },
  {
    icon: "Users" as const,
    title: "Operational Autonomy",
    body: "We provide capital and strategic support, and clear milestones. We give managers the opportunity to do what they do best.",
  },
  {
    icon: "CheckCircle" as const,
    title: "Certainty of Close",
    body: "Permanent capital means when we say yes, we mean it. No surprises.",
  },
  {
    icon: "BarChart2" as const,
    title: "Fair, Transparent Valuations",
    body: "We lead with our offer and explain our reasoning. No games, no bait-and-switch after due diligence.",
  },
  {
    icon: "Zap" as const,
    title: "Speed & Simplicity",
    body: "Intro call to LOI in weeks, not months. Focused diligence from an experienced team that respects your time.",
  },
  {
    icon: "Lock" as const,
    title: "Confidentiality",
    body: "NDA available before any conversation begins. We protect all parties throughout the process.",
    cta: {
      label: "Download NDA",
      href: "/documents/cbg-nda.pdf",
    },
  },
] as const;

export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Intro Call",
    body: "30-minute conversation to assess fit, with no pressure, no deck required.",
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
    body: "Focused, respectful diligence process, typically 45–60 days.",
  },
  {
    number: "05",
    title: "Close",
    body: "Legal docs, funding, and transition planning executed efficiently.",
  },
  {
    number: "06",
    title: "Partnership",
    body: "Ongoing strategic support, capital access, and collaboration.",
  },
] as const;
