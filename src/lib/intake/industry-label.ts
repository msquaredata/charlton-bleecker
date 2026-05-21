import fs from "node:fs";
import path from "node:path";
import {
  parseFormOptionsCsv,
  type FormOption,
} from "@/lib/intake/parse-form-options-csv";

function formatIndustryFallback(value: string): string {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

let industryOptions: FormOption[] | null = null;

function loadIndustryOptions(): FormOption[] {
  if (!industryOptions) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "data",
      "industries.csv",
    );
    industryOptions = parseFormOptionsCsv(fs.readFileSync(filePath, "utf8"));
  }
  return industryOptions;
}

/** Human-readable industry label for emails/logs; falls back to formatted value. */
export function getIndustryLabel(value: string | undefined): string {
  const v = String(value ?? "").trim();
  if (!v) return "";
  const match = loadIndustryOptions().find(
    (o) => o.value === v || o.label === v,
  );
  return match?.label ?? formatIndustryFallback(v);
}
