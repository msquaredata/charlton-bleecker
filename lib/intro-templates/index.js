import { OUTREACH_SIGNATURE_LINES } from "../signature-outreach.js";
import {
  getIntroCtaUrl,
  getOutreachLogoUrl,
  OUTREACH_MERGE_DEFAULTS,
  OUTREACH_TAGLINE,
} from "./constants.js";
import { INTRO_TEMPLATES } from "./defaults.js";

export {
  getIntroCtaUrl,
  getOutreachLogoUrl,
  OUTREACH_MERGE_DEFAULTS,
  OUTREACH_TAGLINE,
} from "./constants.js";
export { INTRO_TEMPLATES } from "./defaults.js";
export { OUTREACH_SIGNATURE_LINES } from "../signature-outreach.js";

export function getIntroEmailMeta() {
  return {
    ctaUrl: getIntroCtaUrl(),
    logoUrl: getOutreachLogoUrl(),
    tagline: OUTREACH_TAGLINE,
    signatureLines: [...OUTREACH_SIGNATURE_LINES],
    mergeDefaults: { ...OUTREACH_MERGE_DEFAULTS },
    templates: INTRO_TEMPLATES.map((t) => ({
      id: t.id,
      label: t.label,
      group: t.group,
      closingPhrase: t.closingPhrase,
      subjectSuggestion: t.subjectSuggestion,
      defaultBody: t.defaultBody,
    })),
  };
}
