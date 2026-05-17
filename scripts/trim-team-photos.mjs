/**
 * Trims uniform studio margins from headshots in public/team/.
 * Usage: node scripts/trim-team-photos.mjs
 */
import { readdir, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const teamDir = path.join(__dirname, "..", "public", "team");

async function sampleStudioBackground(input) {
  const img = sharp(input);
  const { width, height } = await img.metadata();
  if (!width || !height) throw new Error("Invalid image");

  const { data, info } = await img
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const y = Math.max(1, Math.floor(height * 0.08));
  const points = [0.2, 0.35, 0.5, 0.65, 0.8].map((fx) => {
    const x = Math.floor(width * fx);
    const i = (y * width + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  });

  const r = Math.round(points.reduce((s, p) => s + p[0], 0) / points.length);
  const g = Math.round(points.reduce((s, p) => s + p[1], 0) / points.length);
  const b = Math.round(points.reduce((s, p) => s + p[2], 0) / points.length);
  return { r, g, b };
}

async function trimFile(input) {
  let meta = await sharp(input).metadata();

  for (let pass = 0; pass < 4; pass++) {
    const background = await sampleStudioBackground(input);
    const { data, info } = await sharp(input)
      .trim({ background, threshold: 55, lineArt: false })
      .jpeg({ quality: 92, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });

    if (info.width === meta.width && info.height === meta.height) break;
    const tmp = `${input}.tmp.jpg`;
    await sharp(data).toFile(tmp);
    await unlink(input).catch(() => {});
    await rename(tmp, input);
    meta = info;
  }

  const { width: w, height: h } = meta;
  if (w && h && w > 48 && h > 48) {
    const shave = 3;
    const tmp = `${input}.shave.jpg`;
    await sharp(input)
      .extract({
        left: shave,
        top: shave,
        width: w - shave * 2,
        height: h - shave * 2,
      })
      .jpeg({ quality: 92, mozjpeg: true })
      .toFile(tmp);
    await unlink(input).catch(() => {});
    await rename(tmp, input);
    meta.width = w - shave * 2;
    meta.height = h - shave * 2;
  }

  return meta;
}

const files = (await readdir(teamDir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

for (const file of files) {
  const input = path.join(teamDir, file);
  const meta = await trimFile(input);
  console.log(`${file}: ${meta.width}x${meta.height}`);
}
