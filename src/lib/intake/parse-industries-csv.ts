import {
  fetchFormOptions,
  parseFormOptionsCsv,
  type FormOption,
} from "@/lib/intake/parse-form-options-csv";

export type IndustryOption = FormOption;

export { parseFormOptionsCsv as parseIndustriesCsv };

export async function fetchIndustries(
  csvUrl = "/assets/data/industries.csv",
): Promise<IndustryOption[]> {
  return fetchFormOptions(csvUrl);
}
