import { describe, expect, it } from "vitest";
import {
  formatUsPhoneInput,
  isValidUsPhone,
  phoneDigits,
} from "@/lib/forms/phone";

describe("phoneDigits", () => {
  it("strips non-digits", () => {
    expect(phoneDigits("(555) 123-4567")).toBe("5551234567");
    expect(phoneDigits("+1 (555) 123-4567")).toBe("15551234567");
  });
});

describe("isValidUsPhone", () => {
  it("accepts 10 digits in common formats", () => {
    expect(isValidUsPhone("5551234567")).toBe(true);
    expect(isValidUsPhone("(555) 123-4567")).toBe(true);
    expect(isValidUsPhone("555-123-4567")).toBe(true);
    expect(isValidUsPhone("555.123.4567")).toBe(true);
    expect(isValidUsPhone("555 123 4567")).toBe(true);
  });

  it("accepts 11 digits with leading 1", () => {
    expect(isValidUsPhone("15551234567")).toBe(true);
    expect(isValidUsPhone("+1 (555) 123-4567")).toBe(true);
    expect(isValidUsPhone("1-555-123-4567")).toBe(true);
  });

  it("rejects too short, too long, or bad country code", () => {
    expect(isValidUsPhone("")).toBe(false);
    expect(isValidUsPhone("555123456")).toBe(false);
    expect(isValidUsPhone("25551234567")).toBe(false);
    expect(isValidUsPhone("55512345678")).toBe(false);
  });
});

describe("formatUsPhoneInput", () => {
  it("formats progressively", () => {
    expect(formatUsPhoneInput("5")).toBe("5");
    expect(formatUsPhoneInput("555")).toBe("555");
    expect(formatUsPhoneInput("5551")).toBe("(555) 1");
    expect(formatUsPhoneInput("555123")).toBe("(555) 123");
    expect(formatUsPhoneInput("5551234")).toBe("(555) 123-4");
    expect(formatUsPhoneInput("5551234567")).toBe("(555) 123-4567");
  });

  it("formats 11-digit numbers with +1", () => {
    expect(formatUsPhoneInput("15551234567")).toBe("+1 (555) 123-4567");
    expect(formatUsPhoneInput("+1 (555) 123-4567")).toBe("+1 (555) 123-4567");
  });

  it("caps at 11 digits", () => {
    expect(formatUsPhoneInput("15551234567899")).toBe("+1 (555) 123-4567");
  });
});
