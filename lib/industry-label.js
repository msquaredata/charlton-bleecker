import fs from "node:fs";
import path from "node:path";

/** @type {{ label: string; value: string }[] | null} */
let industryOptions = null;

function parseIndustriesCsv(csvText) {
  const lines = csvText.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const out = [];
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

function loadIndustryOptions() {
  if (!industryOptions) {
    const filePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "data",
      "industries.csv",
    );
    industryOptions = parseIndustriesCsv(fs.readFileSync(filePath, "utf8"));
  }
  return industryOptions;
}

function formatIndustryFallback(value) {
  return String(value)
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** @param {string | undefined} value */
export function getIndustryLabel(value) {
  const v = String(value ?? "").trim();
  if (!v) return "";
  const match = loadIndustryOptions().find(
    (o) => o.value === v || o.label === v,
  );
  return match?.label ?? formatIndustryFallback(v);
}
