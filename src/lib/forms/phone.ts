/** Digits only from a phone string. */
export function phoneDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/**
 * US/Canada phone: 10 digits, or 11 digits starting with country code 1.
 * Punctuation and spaces are ignored.
 */
export function isValidUsPhone(value: string): boolean {
  const d = phoneDigits(value);
  return d.length === 10 || (d.length === 11 && d.startsWith("1"));
}

/**
 * Progressive US phone formatting for `type="tel"` inputs.
 * - Up to 10 digits → (555) 123-4567
 * - 11 digits starting with 1 → +1 (555) 123-4567
 */
export function formatUsPhoneInput(raw: string): string {
  let digits = phoneDigits(raw).slice(0, 11);
  if (!digits) return "";

  if (digits.length === 11 && digits.startsWith("1")) {
    const n = digits.slice(1);
    return `+1 (${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
  }

  digits = digits.slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export const PHONE_INVALID_MESSAGE =
  "Enter a 10-digit US phone number (country code +1 optional).";
