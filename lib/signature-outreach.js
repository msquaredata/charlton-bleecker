/**
 * Fixed signature for outreach utility emails (plan: same for all templates).
 */

export const OUTREACH_SIGNATURE_LINES = [
  "G Todd Silva",
  "Founder & CEO",
  "Charlton Bleecker Group LLC",
  "+1 954 892 4959",
  "gts@CharltonBleecker.com",
];

export function outreachSignaturePlainText() {
  return OUTREACH_SIGNATURE_LINES.join("\n");
}
