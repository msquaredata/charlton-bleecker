/**
 * Strips baked-in checkerboard backgrounds and writes App Router favicon assets.
 * Usage: node scripts/process-favicon.mjs [source.png]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const defaultSource = path.resolve(
  "assets",
  "brand",
  "favicon-source.png",
);
const source = path.resolve(process.argv[2] ?? defaultSource);

if (!fs.existsSync(source)) {
  console.error(`Source image not found: ${source}`);
  process.exit(1);
}

function isBackgroundPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;
  return spread < 28 && min > 205;
}

function foregroundAlpha(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;
  if (isBackgroundPixel(r, g, b)) return 0;
  if (r > g + 18 && r > b + 18 && r > 150) return 255;
  if (spread < 28 && min > 205) return 0;
  const redness = r - Math.max(g, b);
  if (redness > 8) return Math.min(255, Math.round(80 + redness * 4));
  return 0;
}

async function makeTransparentPng(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const alpha = foregroundAlpha(data[i], data[i + 1], data[i + 2]);
    data[i + 3] = alpha;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png();
}

const appDir = path.resolve("src", "app");
const brandDir = path.resolve("assets", "brand");
fs.mkdirSync(brandDir, { recursive: true });
fs.mkdirSync(appDir, { recursive: true });

if (path.resolve(source) !== path.resolve(defaultSource)) {
  fs.copyFileSync(source, defaultSource);
}

const transparent = await makeTransparentPng(source);

await transparent.clone().png().toFile(path.join(appDir, "icon.png"));

await transparent
  .clone()
  .resize(180, 180, { kernel: sharp.kernel.nearest })
  .png()
  .toFile(path.join(appDir, "apple-icon.png"));

const legacyIco = path.join(appDir, "favicon.ico");
if (fs.existsSync(legacyIco)) {
  fs.unlinkSync(legacyIco);
}

console.log("Wrote src/app/icon.png and src/app/apple-icon.png (transparent background).");
