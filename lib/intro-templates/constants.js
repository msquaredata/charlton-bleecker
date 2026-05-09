export const OUTREACH_TAGLINE = "We acquire and scale enduring businesses.";

export function getIntroCtaUrl() {
  const u = process.env.INTRO_EMAIL_CTA_URL?.trim();
  return u || "https://www.charltonbleecker.com/";
}

export function getOutreachLogoUrl() {
  const u = process.env.OUTREACH_LOGO_URL?.trim();
  return (
    u ||
    "https://images.squarespace-cdn.com/content/v1/6887def2f753014feeec9714/4ccbe1cd-98c0-483f-bbd2-4d7913c7e2c8/CBG.png?format=500w"
  );
}

/** From header must use a domain verified in Resend (often mail.charltonbleecker.com). */
export function getOutreachFromDefault() {
  const o = process.env.OUTREACH_FROM_EMAIL?.trim();
  if (o) return o;
  const n = process.env.NOTIFY_FROM_EMAIL?.trim();
  if (n) return n;
  return "G Todd Silva <gts@mail.charltonbleecker.com>";
}

/** Reply-To can be any inbox you control (e.g. gts@charltonbleecker.com) without verifying root in Resend for the From domain. */
export function getOutreachReplyToDefault() {
  const o = process.env.OUTREACH_REPLY_TO?.trim();
  if (o) return o;
  return "gts@CharltonBleecker.com";
}

/** Default merge field values (client may override). */
export const OUTREACH_MERGE_DEFAULTS = {
  senderName: "G Todd Silva",
  senderTitleLine: "Founder & CEO",
  senderAddress: "Charlton Bleecker Group LLC\n[Your address]",
  officePhone: "+1 954 892 4959",
  recipientFullName: "",
  companyName: "",
  sector: "",
};
