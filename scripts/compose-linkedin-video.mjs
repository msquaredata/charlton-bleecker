/**
 * Compose a LinkedIn-ready hero mashup: NYC background + brand gradient + logo fade-in.
 *
 * Requires FFmpeg on PATH.
 *
 * Usage:
 *   node scripts/compose-linkedin-video.mjs
 *   node scripts/compose-linkedin-video.mjs --format square
 *   node scripts/compose-linkedin-video.mjs --format portrait
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const videoSrc = path.join(root, "public", "video", "nyc.mp4");
const logoSrc = path.join(root, "public", "cbg-logo.png");
const brandDir = path.join(root, "assets", "brand");
const outDir = path.join(root, "public", "video");

const PLAYBACK_RATE = 0.72;
const DURATION_SEC = 12;
/** Freeze last frame so the logo remains on screen after footage stops. */
const END_HOLD_SEC = 2;
/** Logo width as a fraction of the output frame (centered). */
const LOGO_WIDTH_RATIO = 0.78;

const formats = {
  landscape: { w: 1920, h: 1080, name: "linkedin-hero-landscape.mp4" },
  square: { w: 1080, h: 1080, name: "linkedin-hero-square.mp4" },
  portrait: { w: 1080, h: 1350, name: "linkedin-hero-portrait.mp4" },
};

function parseFormatArg() {
  const idx = process.argv.indexOf("--format");
  const value = idx >= 0 ? process.argv[idx + 1] : "landscape";
  if (!formats[value]) {
    console.error(`Unknown format "${value}". Use: landscape | square | portrait`);
    process.exit(1);
  }
  return formats[value];
}

function isNearWhite(r, g, b) {
  return r > 238 && g > 238 && b > 238;
}

function isRed(r, g, b) {
  return r > g + 15 && r > b + 15 && r > 120;
}

function isRedFringe(r, g, b) {
  return r > 95 && r > g + 10 && r > b + 10 && r - Math.max(g, b) > 15;
}

const BRAND_RED = { r: 255, g: 65, b: 54 };
const TEXT_MIN_X = 206;
const PERIOD_MIN_X = 712;

function clipMaskX(mask, width, height, maxX) {
  for (let p = 0; p < mask.length; p++) {
    if (p % width > maxX) mask[p] = 0;
  }
}

function connectedComponents(mask, width, height) {
  const labels = new Int32Array(mask.length);
  const components = [];
  let nextLabel = 0;

  for (let p = 0; p < mask.length; p++) {
    if (!mask[p] || labels[p]) continue;
    nextLabel++;
    const pixels = [];
    const queue = [p];
    labels[p] = nextLabel;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;
    let sumX = 0;

    while (queue.length > 0) {
      const cp = queue.pop();
      pixels.push(cp);
      const x = cp % width;
      const y = Math.floor(cp / width);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
      sumX += x;

      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const np = ny * width + nx;
        if (!mask[np] || labels[np]) continue;
        labels[np] = nextLabel;
        queue.push(np);
      }
    }

    components.push({
      label: nextLabel,
      pixels,
      minX,
      maxX,
      minY,
      maxY,
      centroidX: sumX / pixels.length,
    });
  }

  return components;
}

function componentToMask(component, width, height) {
  const mask = new Uint8Array(width * height);
  for (const p of component.pixels) mask[p] = 1;
  return mask;
}

function pickFlagAndPeriodComponents(components) {
  const left = components.filter((c) => c.maxX < TEXT_MIN_X);
  const right = components.filter((c) => c.minX >= PERIOD_MIN_X);
  const flag =
    left.sort((a, b) => a.minX - b.minX || b.pixels.length - a.pixels.length)[0] ??
    null;
  const period =
    right.sort((a, b) => b.centroidX - a.centroidX || b.pixels.length - a.pixels.length)[0] ??
    null;
  return { flag, period };
}

function dilateMask(mask, width, height, radius = 1) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      let on = false;
      for (let dy = -radius; dy <= radius && !on; dy++) {
        for (let dx = -radius; dx <= radius && !on; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          if (mask[ny * width + nx]) on = true;
        }
      }
      out[p] = on ? 1 : 0;
    }
  }
  return out;
}

function erodeMask(mask, width, height, radius = 1) {
  const out = new Uint8Array(mask.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const p = y * width + x;
      if (!mask[p]) continue;
      let solid = true;
      for (let dy = -radius; dy <= radius && solid; dy++) {
        for (let dx = -radius; dx <= radius && solid; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height || !mask[ny * width + nx]) {
            solid = false;
          }
        }
      }
      out[p] = solid ? 1 : 0;
    }
  }
  return out;
}

function fillHoles(mask, width, height, bounds) {
  const { minX, minY, maxX, maxY } = bounds;
  const outside = new Uint8Array(mask.length);
  const queue = [];

  const trySeed = (x, y) => {
    const p = y * width + x;
    if (!mask[p] && !outside[p]) {
      outside[p] = 1;
      queue.push(p);
    }
  };

  for (let x = minX; x <= maxX; x++) {
    trySeed(x, minY);
    trySeed(x, maxY);
  }
  for (let y = minY; y <= maxY; y++) {
    trySeed(minX, y);
    trySeed(maxX, y);
  }

  while (queue.length > 0) {
    const p = queue.pop();
    const x = p % width;
    const y = Math.floor(p / width);
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < minX || nx > maxX || ny < minY || ny > maxY) continue;
      const np = ny * width + nx;
      if (!mask[np] && !outside[np]) {
        outside[np] = 1;
        queue.push(np);
      }
    }
  }

  const filled = new Uint8Array(mask);
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const p = y * width + x;
      if (!mask[p] && !outside[p]) filled[p] = 1;
    }
  }
  return filled;
}

function drawFilledCircle(mask, width, height, cx, cy, radius) {
  const r2 = radius * radius;
  const y0 = Math.max(0, cy - radius);
  const y1 = Math.min(height - 1, cy + radius);
  const x0 = Math.max(0, cx - radius);
  const x1 = Math.min(width - 1, cx + radius);
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) mask[y * width + x] = 1;
    }
  }
}

function buildRedMask(data, width, height) {
  const mask = new Uint8Array(width * height);
  for (let p = 0; p < mask.length; p++) {
    const i = p * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (isRed(r, g, b) || isRedFringe(r, g, b)) mask[p] = 1;
  }
  return mask;
}

function maskBounds(mask, width, height) {
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let found = false;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!mask[y * width + x]) continue;
      found = true;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }

  if (!found) return null;
  return { minX, minY, maxX, maxY };
}

function buildCleanFlagMask(flagComponent, width, height) {
  if (!flagComponent) return new Uint8Array(width * height);

  let mask = componentToMask(flagComponent, width, height);
  // Thicken and smooth stroke breaks only — never fill the flag interior.
  mask = dilateMask(mask, width, height, 2);
  mask = erodeMask(mask, width, height, 1);
  clipMaskX(mask, width, height, TEXT_MIN_X - 10);
  return mask;
}

function buildCleanPeriodMask(periodComponent, width, height) {
  const mask = new Uint8Array(width * height);
  if (!periodComponent) return mask;

  const cx = Math.round(periodComponent.centroidX);
  const cy = Math.round((periodComponent.minY + periodComponent.maxY) / 2);
  const radius = Math.max(
    5,
    Math.round(
      Math.max(
        periodComponent.maxX - periodComponent.minX,
        periodComponent.maxY - periodComponent.minY,
      ) / 2,
    ),
  );
  drawFilledCircle(mask, width, height, cx, cy, radius);
  return mask;
}

function paintMask(data, mask, color) {
  for (let p = 0; p < mask.length; p++) {
    if (!mask[p]) continue;
    const i = p * 4;
    data[i] = color.r;
    data[i + 1] = color.g;
    data[i + 2] = color.b;
    data[i + 3] = 255;
  }
}

function processLogoPixels(data, width, height, flagMask, periodMask) {
  for (let p = 0; p < width * height; p++) {
    const i = p * 4;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (flagMask[p] || periodMask[p]) {
      data[i + 3] = 0;
      continue;
    }
    if (isNearWhite(r, g, b)) {
      data[i + 3] = 0;
      continue;
    }
    if (isRed(r, g, b) || isRedFringe(r, g, b)) {
      data[i + 3] = 0;
      continue;
    }
    const ink = 255 - Math.min(r, g, b);
    if (ink <= 15) {
      data[i + 3] = 0;
      continue;
    }
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = Math.min(255, Math.round(ink * 1.15));
  }

  paintMask(data, flagMask, BRAND_RED);
  paintMask(data, periodMask, BRAND_RED);
}

async function makeTransparentLogo() {
  fs.mkdirSync(brandDir, { recursive: true });
  const out = path.join(brandDir, "cbg-logo-transparent.png");

  const { data, info } = await sharp(logoSrc)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const redMask = buildRedMask(data, info.width, info.height);
  const { flag, period } = pickFlagAndPeriodComponents(
    connectedComponents(redMask, info.width, info.height),
  );
  const flagMask = buildCleanFlagMask(flag, info.width, info.height);
  const periodMask = buildCleanPeriodMask(period, info.width, info.height);
  processLogoPixels(data, info.width, info.height, flagMask, periodMask);

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(out);

  return out;
}

function ffmpegBin() {
  return process.platform === "win32" ? "ffmpeg" : "ffmpeg";
}

function compose({ w, h, name }, logoPath) {
  fs.mkdirSync(outDir, { recursive: true });
  const out = path.join(outDir, name);

  const logoW = Math.round(w * LOGO_WIDTH_RATIO);

  const filter = [
    `[0:v]setpts=PTS/${PLAYBACK_RATE},scale=${w}:${h}:force_original_aspect_ratio=increase,crop=${w}:${h},tpad=stop_mode=clone:stop_duration=${END_HOLD_SEC},format=rgba[base]`,
    `color=c=0x1a1a1a@0.82:s=${w}x${h}[dark]`,
    `[base][dark]overlay=0:0[graded]`,
    `color=c=0xc0392b@0.12:s=${w}x${h}[accent]`,
    `[graded][accent]overlay=0:0[toned]`,
    `[1:v]scale=${logoW}:-1,format=rgba[logo]`,
    `[toned][logo]overlay=x=(main_w-overlay_w)/2:y=(main_h-overlay_h)/2,format=yuv420p[v]`,
  ].join(";");

  execFileSync(
    ffmpegBin(),
    [
      "-y",
      "-i",
      videoSrc,
      "-loop",
      "1",
      "-i",
      logoPath,
      "-filter_complex",
      filter,
      "-map",
      "[v]",
      "-map",
      "0:a?",
      "-t",
      String(DURATION_SEC + END_HOLD_SEC),
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      out,
    ],
    { stdio: "inherit" },
  );

  return out;
}

async function main() {
  if (!fs.existsSync(videoSrc)) {
    console.error(`Missing video: ${videoSrc}`);
    process.exit(1);
  }
  if (!fs.existsSync(logoSrc)) {
    console.error(`Missing logo: ${logoSrc}`);
    process.exit(1);
  }

  const format = parseFormatArg();
  console.log(`Creating transparent logo…`);
  const logoPath = await makeTransparentLogo();
  console.log(`Wrote ${logoPath}`);
  console.log(`Composing ${format.w}x${format.h} LinkedIn video…`);
  const out = compose(format, logoPath);
  console.log(`Done: ${out}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
