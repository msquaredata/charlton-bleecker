/**
 * Seeded templates: Group A (cold outreach) + Group B (enquiry response).
 * Bodies are plain text with {{tokens}}; shell adds logo, CTA link, closing line, fixed signature.
 */

/** @typedef {{ id: string, label: string, group: 'cold' | 'enquiry', closingPhrase: string, subjectSuggestion: string, defaultBody: string }} IntroTemplate */

/** @type {IntroTemplate[]} */
export const INTRO_TEMPLATES = [
  {
    id: "cold-full",
    label: "Cold — Full letter",
    group: "cold",
    closingPhrase: "Warmly,",
    subjectSuggestion: "Opportunity — {{companyName}}",
    defaultBody: `From the desk of {{senderName}}
{{senderTitleLine}}
{{senderAddress}}

{{date}}

Dear {{recipientFullName}},

Ref: {{companyName}}

Sorry for writing to you directly like this. Because the topic may be sensitive, I preferred to reach out privately before anything more formal.

I acquire and support enduring businesses, with particular interest in the {{sector}} space. I am looking for opportunities to invest in or acquire companies where we can add operational depth and capital discipline.

A confidential, no-obligation conversation is often the best next step—nothing ventured, nothing gained.

Please reach me at {{officePhone}}. I focus on one serious opportunity at a time; when the fit is right, I dedicate myself fully to that process.`,
  },
  {
    id: "cold-short",
    label: "Cold — Short",
    group: "cold",
    closingPhrase: "Warmly,",
    subjectSuggestion: "{{companyName}} — introduction",
    defaultBody: `From the desk of {{senderName}}
{{senderTitleLine}}
{{senderAddress}}

{{date}}

Dear {{recipientFullName}},

Ref: {{companyName}}

I am reaching out privately given the sensitivity of the topic. Charlton Bleecker acquires and scales enduring businesses; I am particularly interested in the {{sector}} space and would welcome a confidential conversation about whether {{companyName}} could be a fit.

Please call {{officePhone}} when convenient.`,
  },
  {
    id: "cold-cta",
    label: "Cold — CTA forward",
    group: "cold",
    closingPhrase: "Warmly,",
    subjectSuggestion: "Confidential — {{companyName}}",
    defaultBody: `From the desk of {{senderName}}
{{senderTitleLine}}
{{senderAddress}}

{{date}}

Dear {{recipientFullName}},

Ref: {{companyName}}

Brief note: we acquire and scale enduring businesses and are actively reviewing opportunities in {{sector}}. If a confidential introduction makes sense, I would welcome a short call—{{officePhone}}.

When you are ready to share structured details with our deal team, you can use the secure link provided below.`,
  },
  {
    id: "enquiry-overview",
    label: "Enquiry — Overview / capability",
    group: "enquiry",
    closingPhrase: "Best regards,",
    subjectSuggestion: "Thank you for your enquiry — Charlton Bleecker",
    defaultBody: `Dear {{recipientFullName}},

Many thanks for your enquiry—it was great to hear from you.

Charlton Bleecker Group acquires and scales enduring businesses. Where we see alignment, we may pursue an outright purchase or a meaningful equity stake, alongside hands-on leadership and the appropriate capital to stabilize and grow the company.

If that kind of conversation could be relevant, we would welcome a confidential discussion.`,
  },
  {
    id: "enquiry-pipeline",
    label: "Enquiry — Pipeline / breadth",
    group: "enquiry",
    closingPhrase: "Best regards,",
    subjectSuggestion: "Re: your enquiry — Charlton Bleecker",
    defaultBody: `Dear {{recipientFullName}},

Many thanks for your enquiry—it was great to hear from you.

We have been actively evaluating opportunities as we continue to build our portfolio of enduring businesses.

We are not limited to a single industry—we look across sectors when we see a credible path to operational improvement and growth. Whether your company is mainstream or niche, fit matters most. If you would like to explore next steps, we would be glad to open a conversation.`,
  },
  {
    id: "enquiry-founder",
    label: "Enquiry — Founder-led",
    group: "enquiry",
    closingPhrase: "Best regards,",
    subjectSuggestion: "Thank you — Charlton Bleecker Group",
    defaultBody: `Dear {{recipientFullName}},

Many thanks for your enquiry—it was good to hear from you.

Charlton Bleecker Group exists to acquire and scale enduring businesses—especially where fresh leadership and disciplined execution can unlock the next chapter. My focus is practical: effective management, revenue momentum, and developing people—the foundations of any durable company.

Above all, I believe in listening first. If you are open to an initial conversation, I would welcome the dialogue.`,
  },
];
