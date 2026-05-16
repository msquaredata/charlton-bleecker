import "server-only";
import fs from "node:fs";
import path from "node:path";
import {
  FORM_OPTION_CSV,
  type FormOptionKey,
} from "@/lib/intake/form-option-sources";
import {
  parseFormOptionsCsv,
  type FormOption,
} from "@/lib/intake/parse-form-options-csv";

/** Read CSV dropdown data from `public/assets/data` at build/request time. */
export function loadFormOptionsFromDisk(): Record<FormOptionKey, FormOption[]> {
  const out = {} as Record<FormOptionKey, FormOption[]>;

  for (const [key, url] of Object.entries(FORM_OPTION_CSV) as [
    FormOptionKey,
    string,
  ][]) {
    const relative = url.replace(/^\//, "");
    const filePath = path.join(process.cwd(), "public", relative);
    const text = fs.readFileSync(filePath, "utf8");
    out[key] = parseFormOptionsCsv(text);
  }

  return out;
}
