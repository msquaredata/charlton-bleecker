export type FormOption = { label: string; value: string };

/**
 * Parses Label,Value,Active? CSV (same format as legacy industries.csv).
 * When Value is omitted, Label is used as the submitted value.
 */
export function parseFormOptionsCsv(csvText: string): FormOption[] {
  const normalized = csvText.replace(/^\uFEFF/, "").trim();
  const lines = normalized.split(/\r?\n/);
  if (lines.length < 2) return [];

  const out: FormOption[] = [];
  for (const line of lines.slice(1)) {
    if (!line.trim()) continue;
    const parts = line.split(",").map((p) => p.trim());
    const label = parts[0];
    if (!label) continue;
    const value = parts[1] || label;
    const active = parts[2]?.replace(/\r/g, "");
    if (active && active.toUpperCase() !== "Y") continue;
    out.push({ label, value });
  }
  return out;
}

export async function fetchFormOptions(
  csvUrl: string,
): Promise<FormOption[]> {
  const res = await fetch(csvUrl);
  if (!res.ok) throw new Error(String(res.status));
  return parseFormOptionsCsv(await res.text());
}
