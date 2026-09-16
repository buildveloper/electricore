/**
 * Derives the site's brand assets from the supplied logo file.
 *
 * Run with: node scripts/build-brand-assets.mjs
 *
 * The supplied artwork is an 864x860 square emblem on its own deep navy ground,
 * built for dark backgrounds. Palette sampled from it:
 *
 *   background   #131927   the artwork's own ground
 *   electric     #05c9e3   hue 187, saturation 98%
 *   copper       #fb8627   hue 27,  saturation 84%
 *   light        #f0f4f8
 *
 * Outputs:
 *   public/logo/electricore-logo.png   the supplied file, whole, untouched
 *   public/logo/electricore-mark.png   the same artwork sized for the interface
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = process.argv[2] ?? 'logo/639193095_122101179489271579_6775032627402071717_n.jpg';
const OUT = 'public/logo';

await mkdir(OUT, { recursive: true });

// ---------------------------------------------------------- full reference --
const meta = await sharp(SOURCE).metadata();
const full = await sharp(SOURCE).png({ compressionLevel: 9 }).toBuffer();
await writeFile(`${OUT}/electricore-logo.png`, full);
console.log(
  `electricore-logo.png   ${meta.width}x${meta.height}  ${(full.length / 1024).toFixed(0)}kB  (supplied file, unmodified)`,
);

// ------------------------------------------------------------- ui artwork ---
// One square mark covers the header, hero and footer. WebP rather than PNG:
// the emblem is detailed artwork and lossless would ship 500kB for a logo.
const MARK_WIDTH = 384;
const mark = await sharp(SOURCE)
  .resize({ width: MARK_WIDTH, kernel: 'lanczos3' })
  .webp({ quality: 86 })
  .toBuffer();
await writeFile(`${OUT}/electricore-mark.webp`, mark);
const markMeta = await sharp(mark).metadata();
console.log(
  `electricore-mark.webp  ${markMeta.width}x${markMeta.height}  ${(mark.length / 1024).toFixed(0)}kB`,
);

// ----------------------------------------------------------------- palette --
const { data, info } = await sharp(SOURCE).raw().toBuffer({ resolveWithObject: true });
const buckets = new Map();
const collect = (predicate) => {
  let best = null;
  let bestScore = -1;
  const counts = new Map();
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mx = Math.max(r, g, b);
    const mn = Math.min(r, g, b);
    const sat = mx ? (mx - mn) / mx : 0;
    const l = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    let h;
    if (mx === mn) h = -1;
    else if (mx === r) h = (((g - b) / (mx - mn)) % 6) * 60;
    else if (mx === g) h = ((b - r) / (mx - mn) + 2) * 60;
    else h = ((r - g) / (mx - mn) + 4) * 60;
    if (h < 0) h += 360;
    if (!predicate({ r, g, b, l, sat, h })) continue;
    const key = [r, g, b].map((v) => Math.round(v / 8) * 8).join(',');
    counts.set(key, (counts.get(key) ?? 0) + 1);
    const score = sat * (l / 255);
    if (score > bestScore) {
      bestScore = score;
      best = { r, g, b, l, sat, h };
    }
  }
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  return { best, ranked };
};

const hex = ({ r, g, b }) =>
  '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

const electric = collect(({ sat, h, l }) => sat > 0.5 && h >= 170 && h <= 240 && l > 90);
const copper = collect(({ sat, h, l }) => sat > 0.5 && (h < 60 || h > 320) && l > 90);
// The ground is measured at the artwork's corners rather than sampled by
// darkness, because the deep copper shadows are darker than the background.
const { data: cornerData, info: cornerInfo } = await sharp(SOURCE)
  .extract({ left: 0, top: 0, width: 12, height: 12 })
  .raw()
  .toBuffer({ resolveWithObject: true });
const ground = { best: { r: 0, g: 0, b: 0, l: 0, sat: 0, h: 0 }, ranked: [] };
{
  let sr = 0,
    sg = 0,
    sb = 0,
    n = 0;
  for (let i = 0; i < cornerData.length; i += cornerInfo.channels) {
    sr += cornerData[i];
    sg += cornerData[i + 1];
    sb += cornerData[i + 2];
    n++;
  }
  ground.best = {
    r: sr / n,
    g: sg / n,
    b: sb / n,
    l: 0.2126 * (sr / n) + 0.7152 * (sg / n) + 0.0722 * (sb / n),
    sat: 0,
    h: 0,
  };
}

console.log('\nsampled from the logo file');
console.log(`  ground    ${hex(ground.best)}  lightness ${ground.best.l.toFixed(0)}`);
console.log(`  electric  ${hex(electric.best)}  hue ${electric.best.h.toFixed(0)}  sat ${(electric.best.sat * 100).toFixed(0)}%`);
console.log(`  copper    ${hex(copper.best)}  hue ${copper.best.h.toFixed(0)}  sat ${(copper.best.sat * 100).toFixed(0)}%`);
console.log(
  `  also      ${electric.ranked.map(([k]) => '#' + k.split(',').map((v) => Math.min(255, +v).toString(16).padStart(2, '0')).join('')).join(' ')}`,
);
