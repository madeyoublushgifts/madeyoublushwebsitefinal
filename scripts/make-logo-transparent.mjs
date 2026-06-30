/**
 * Build transparent logo PNG — hard key only, no sharpen/feather/halo.
 *
 * Usage:
 *   node scripts/make-logo-transparent.mjs [source-path]
 */
import fs from "fs/promises";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultSource = path.join(__dirname, "../src/assets/logo-source.jpg");
const sourcePath = process.argv[2] ? path.resolve(process.argv[2]) : defaultSource;
const outPath = path.join(__dirname, "../src/assets/logo-made-you-blush.png");
const tempPath = path.join(__dirname, "../src/assets/logo-made-you-blush.tmp.png");

/** Remove white/black matte only — keep coloured pixels fully opaque. */
function isBackground(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;

  // White matte
  if (min >= 248) return true;
  if (min >= 238 && spread <= 10) return true;

  // Black matte (fallback for dark exports)
  if (max <= 12) return true;
  if (max <= 24 && spread <= 8) return true;

  return false;
}

const { data, info } = await sharp(sourcePath, { failOn: "none" })
  .rotate()
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  if (isBackground(data[i], data[i + 1], data[i + 2])) {
    data[i + 3] = 0;
  } else {
    data[i + 3] = 255;
  }
}

await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim({ threshold: 1 })
  .png({ compressionLevel: 6, palette: false })
  .toFile(tempPath);

await fs.unlink(outPath).catch(() => undefined);
await fs.rename(tempPath, outPath);

const meta = await sharp(outPath).metadata();
console.log(`Logo ready: ${meta.width}x${meta.height}px -> ${outPath}`);
