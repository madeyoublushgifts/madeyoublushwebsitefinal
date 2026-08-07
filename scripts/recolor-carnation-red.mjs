/**
 * Recolor Made You Blush carnation stem card → deep burgundy/crimson.
 * Petal-only HSL remap from the clean pink card (no cutout composite).
 * Protects green stem/calyx and soft pink dappled background.
 *
 * Usage: node scripts/recolor-carnation-red.mjs
 */
import sharp from "sharp";

const src = process.argv[2] || "public/images/myb/myb-stem-carnation.png";
const out = process.argv[3] || "public/images/myb/myb-stem-carnation-red.png";

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return [h * 360, s, l];
}

function hslToRgb(h, s, l) {
  h = (((h % 360) + 360) % 360) / 360;
  let r;
  let g;
  let b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v * 255))));
}

function isGreen(H, r, g) {
  return (H > 28 && H < 170 && g >= r - 4) || (g > r + 2 && H > 25 && H < 180);
}

function isPinkHue(H) {
  return H >= 315 || H <= 28;
}

/**
 * Petal vs dappled bg:
 * bg shadows: rg up to ~50 but S≈0.50–0.55, L≈0.80
 * petal body: rg ≳ 52
 * light tips: rg 44–52, L≳0.86, S≳0.72 (high-sat highlights — not bg)
 */
function isPetalPixel(r, g, b) {
  const [H, S, L] = rgbToHsl(r, g, b);
  if (isGreen(H, r, g)) return false;
  if (!isPinkHue(H)) return false;
  if (L >= 0.96) return false;
  const rg = r - g;
  const rb = r - b;
  // Body / mid — clear separation from bg
  if (rg >= 52 && rb >= 46 && S >= 0.32) return true;
  // Dark folds
  if (L < 0.72 && rg >= 40 && r > g && r > b && S >= 0.28) return true;
  // Mid tips
  if (rg >= 50 && rb >= 44 && S >= 0.35 && L < 0.92) return true;
  // Specular / pale petal tips (distinguish from bg via high S)
  if (L >= 0.84 && L < 0.96 && S >= 0.7 && rg >= 44 && rb >= 38) return true;
  return false;
}

/** Deep burgundy ~H 348, mid L ~0.25–0.30; light tips stay a touch lighter for soft edges */
function toCrimson(r, g, b) {
  const [, S, L] = rgbToHsl(r, g, b);
  const newH = 348;
  const newS = Math.min(0.84, Math.max(0.62, 0.58 + S * 0.24));
  const Lnorm = Math.min(1, Math.max(0, (L - 0.30) / 0.62));
  // Body mid ≈ 0.27; pale tips ≈ 0.38 so AA fringe doesn't flash chalky
  const newL = 0.13 + Math.pow(Lnorm, 1.05) * 0.28;
  return hslToRgb(newH, newS, newL);
}

const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const w = info.width;
const h = info.height;
const N = w * h;

let minX = 1e9;
let maxX = 0;
let minY = 1e9;
let maxY = 0;
let sx = 0;
let sy = 0;
let sw = 0;
for (let y = 40; y < 320; y++) {
  for (let x = 340; x < 700; x++) {
    const p = (y * w + x) * 4;
    const r = data[p];
    const g = data[p + 1];
    const b = data[p + 2];
    const [H, S, L] = rgbToHsl(r, g, b);
    const rg = r - g;
    if (!isGreen(H, r, g) && isPinkHue(H) && rg > 70 && S > 0.35 && L < 0.88) {
      const wt = rg - 70;
      sx += x * wt;
      sy += y * wt;
      sw += wt;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}
if (sw < 1) {
  console.error("Could not locate bloom centroid");
  process.exit(1);
}
const cx = sx / sw;
const cy = sy / sw;
const rx = (maxX - minX) / 2 + 38;
const ry = (maxY - minY) / 2 + 34;

const hard = new Uint8Array(N);
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const ex = (x - cx) / rx;
    const ey = (y - cy) / ry;
    if (ex * ex + ey * ey > 1.12) continue;
    const p = (y * w + x) * 4;
    if (isPetalPixel(data[p], data[p + 1], data[p + 2])) hard[y * w + x] = 1;
  }
}

// Largest connected petal blob
const seen = new Uint8Array(N);
let best = [];
let bestSize = 0;
for (let i = 0; i < N; i++) {
  if (!hard[i] || seen[i]) continue;
  const q = [i];
  let qi = 0;
  seen[i] = 1;
  const cells = [i];
  while (qi < q.length) {
    const cur = q[qi++];
    const x = cur % w;
    const y = (cur / w) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const ni = ny * w + nx;
      if (!hard[ni] || seen[ni]) continue;
      seen[ni] = 1;
      q.push(ni);
      cells.push(ni);
    }
  }
  if (cells.length > bestSize) {
    bestSize = cells.length;
    best = cells;
  }
}

const filled = new Uint8Array(N);
for (const i of best) filled[i] = 1;

// Re-attach nearby tip islands (serrations disconnected by 1–2 bg-ish pixels)
{
  const islandSeen = new Uint8Array(N);
  for (let i = 0; i < N; i++) {
    if (!hard[i] || filled[i] || islandSeen[i]) continue;
    const q = [i];
    let qi = 0;
    islandSeen[i] = 1;
    const cells = [i];
    while (qi < q.length) {
      const cur = q[qi++];
      const x = cur % w;
      const y = (cur / w) | 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
        const ni = ny * w + nx;
        if (!hard[ni] || islandSeen[ni] || filled[ni]) continue;
        islandSeen[ni] = 1;
        q.push(ni);
        cells.push(ni);
      }
    }
    let near = false;
    for (const ci of cells) {
      const x = ci % w;
      const y = (ci / w) | 0;
      for (let dy = -16; dy <= 16 && !near; dy++) {
        for (let dx = -16; dx <= 16; dx++) {
          if (dx * dx + dy * dy > 256) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (filled[ny * w + nx]) {
            near = true;
            break;
          }
        }
      }
      if (near) break;
    }
    if (near) {
      for (const ci of cells) filled[ci] = 1;
    }
  }
}

// Limited dilation (2 passes): only into pixels that still read as petals
for (let pass = 0; pass < 2; pass++) {
  const add = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (filled[i]) continue;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (filled[(y + dy) * w + (x + dx)]) n++;
        }
      }
      if (n < 2) continue;
      const p = i * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const [H, S, L] = rgbToHsl(r, g, b);
      if (isGreen(H, r, g)) continue;
      if (!isPinkHue(H)) continue;
      const rg = r - g;
      // Expand into tips: high-S pale edges, or solid mid chroma
      if (rg >= 48 && S >= 0.32 && L < 0.93) add.push(i);
      else if (L >= 0.84 && S >= 0.68 && rg >= 44 && L < 0.96) add.push(i);
      else if (n >= 4 && rg >= 46 && S >= 0.3 && L < 0.9) add.push(i);
    }
  }
  for (const i of add) filled[i] = 1;
}

// Fill interior holes
{
  let bminX = 1e9;
  let bmaxX = 0;
  let bminY = 1e9;
  let bmaxY = 0;
  for (let i = 0; i < N; i++) {
    if (!filled[i]) continue;
    const x = i % w;
    const y = (i / w) | 0;
    bminX = Math.min(bminX, x);
    bmaxX = Math.max(bmaxX, x);
    bminY = Math.min(bminY, y);
    bmaxY = Math.max(bmaxY, y);
  }
  for (let y = bminY; y <= bmaxY; y++) {
    for (let x = bminX; x <= bmaxX; x++) {
      const i = y * w + x;
      if (filled[i]) continue;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < bminX || ny < bminY || nx > bmaxX || ny > bmaxY) continue;
          if (filled[ny * w + nx]) n++;
        }
      }
      if (n < 6) continue;
      const p = i * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const [H] = rgbToHsl(r, g, b);
      if (isGreen(H, r, g)) continue;
      if (!isPinkHue(H)) continue;
      if (r - g < 40) continue;
      filled[i] = 1;
    }
  }
}

const outBuf = Buffer.from(data);
let changed = 0;
for (let i = 0; i < N; i++) {
  if (!filled[i]) continue;
  const p = i * 4;
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];
  const [H] = rgbToHsl(r, g, b);
  if (isGreen(H, r, g)) continue;
  // Full HSL remap on hard mask — preserves texture via L, no muddy pink mix
  const [nr, ng, nb] = toCrimson(r, g, b);
  outBuf[p] = nr;
  outBuf[p + 1] = ng;
  outBuf[p + 2] = nb;
  changed++;
}

/**
 * Antialias fringe fix: pink-on-pink AA was invisible; crimson-on-pink makes it a halo.
 * Estimate petal/bg mix from local chroma vs nearby bg, then rebuild with crimson.
 */
{
  // Local bg chroma from ring just outside bloom ellipse
  let bgRg = 0;
  let bgN = 0;
  for (let y = Math.max(0, (cy - ry - 30) | 0); y < Math.min(h, (cy + ry + 30) | 0); y++) {
    for (let x = Math.max(0, (cx - rx - 30) | 0); x < Math.min(w, (cx + rx + 30) | 0); x++) {
      const ex = (x - cx) / rx;
      const ey = (y - cy) / ry;
      const e2 = ex * ex + ey * ey;
      if (e2 < 1.15 || e2 > 1.55) continue;
      if (filled[y * w + x]) continue;
      const p = (y * w + x) * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const [H] = rgbToHsl(r, g, b);
      if (isGreen(H, r, g)) continue;
      bgRg += r - g;
      bgN++;
    }
  }
  const bgRgMean = bgN ? bgRg / bgN : 40;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      if (filled[i]) continue;
      let n = 0;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx * dx + dy * dy > 5) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          if (filled[ny * w + nx]) n++;
        }
      }
      if (n < 1) continue;
      const p = i * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      const [H, S, L] = rgbToHsl(r, g, b);
      if (isGreen(H, r, g)) continue;
      if (!isPinkHue(H)) continue;
      const rg = r - g;
      // Mix ratio from chroma above local bg (AA pixels sit between bg and petal)
      let mix = (rg - bgRgMean) / 28;
      if (S >= 0.65 && L >= 0.84) mix = Math.max(mix, 0.35 + (S - 0.65));
      if (n >= 3) mix += 0.08;
      mix = Math.max(0, Math.min(0.92, mix));
      if (mix < 0.12) continue;
      // Reject pure bg: low sat shadows even if near mask
      if (S < 0.45 && rg < bgRgMean + 6 && L < 0.88) continue;
      const [nr, ng, nb] = toCrimson(r, g, b);
      // Rebuild AA: keep some of original lightness via mix, not chalky white rim
      outBuf[p] = Math.round(r * (1 - mix) + nr * mix);
      outBuf[p + 1] = Math.round(g * (1 - mix) + ng * mix);
      outBuf[p + 2] = Math.round(b * (1 - mix) + nb * mix);
      // If still much lighter than neighbors, nudge toward crimson more
      if (mix > 0.4 && L > 0.88) {
        const t = 0.55;
        outBuf[p] = Math.round(outBuf[p] * (1 - t) + nr * t);
        outBuf[p + 1] = Math.round(outBuf[p + 1] * (1 - t) + ng * t);
        outBuf[p + 2] = Math.round(outBuf[p + 2] * (1 - t) + nb * t);
      }
      changed++;
    }
  }
}

await sharp(outBuf, { raw: { width: w, height: h, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(
  JSON.stringify({
    out,
    changed,
    mainBlob: bestSize,
    cx: Math.round(cx),
    cy: Math.round(cy),
    rx: Math.round(rx),
    ry: Math.round(ry),
  }),
);
