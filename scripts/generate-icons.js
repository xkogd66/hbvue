#!/usr/bin/env node
/**
 * Regenerate all PWA / favicon raster assets from the vector master
 * `public/img/icons/icon.svg`.
 *
 * Why: the original source art (`src/assets/logo.png`) is only 25x25, so every
 * upscaled PNG looked blurry. `icon.svg` is the crisp vector source of truth;
 * this script renders it at each required size (plus maskable + opaque iOS
 * variants) so the icons stay sharp at every resolution.
 *
 * Usage:
 *   npm i -D sharp to-ico
 *   node scripts/generate-icons.js
 *
 * Requires `sharp` (SVG rasterisation) and `to-ico` (multi-size favicon.ico),
 * which are intentionally NOT project dependencies - install them only when
 * regenerating icons.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const toIco = require('to-ico');

const root = path.resolve(__dirname, '..');
const src = path.join(root, 'public/img/icons/icon.svg');
const out = path.join(root, 'public/img/icons');
const BRAND_GREEN = { r: 34, g: 197, b: 94 }; // #22c55e
const svg = fs.readFileSync(src);

// Rendered with a transparent background (fine for browser favicons).
const transparentSizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'msapplication-icon-144x144.png': 144,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
};

// iOS apple-touch icons must be opaque: iOS ignores transparency and composites
// onto black, so render full-bleed on the brand colour.
const opaqueSizes = {
  'apple-touch-icon-152x152.png': 152,
  'apple-touch-icon.png': 180,
};

(async () => {
  for (const [name, px] of Object.entries(transparentSizes)) {
    await sharp(svg, { density: 300 })
      .resize(px, px, { fit: 'contain', background: { ...BRAND_GREEN, alpha: 0 } })
      .png()
      .toFile(path.join(out, name));
    console.log('wrote', name, `${px}x${px}`);
  }

  for (const [name, px] of Object.entries(opaqueSizes)) {
    const art = await sharp(svg, { density: 300 })
      .resize(px, px, { fit: 'contain', background: { ...BRAND_GREEN, alpha: 1 } })
      .flatten({ background: BRAND_GREEN })
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(out, name), art);
    console.log('wrote', name, `${px}x${px} (opaque)`);
  }

  // Maskable icons: art padded into the 80% safe zone on a full-bleed square.
  for (const [name, px] of Object.entries({
    'android-chrome-maskable-192x192.png': 192,
    'android-chrome-maskable-512x512.png': 512,
  })) {
    const inner = Math.round(px * 0.78);
    const pad = Math.round((px - inner) / 2);
    const art = await sharp(svg, { density: 300 }).resize(inner, inner).png().toBuffer();
    await sharp({
      create: { width: px, height: px, channels: 4, background: { ...BRAND_GREEN, alpha: 1 } },
    })
      .composite([{ input: art, top: pad, left: pad }])
      .png()
      .toFile(path.join(out, name));
    console.log('wrote', name, `${px}x${px} (maskable)`);
  }

  // Multi-resolution favicon.ico (16/32/48) from the same vector.
  const icoBuffers = await Promise.all(
    [16, 32, 48].map((px) =>
      sharp(svg, { density: 300 })
        .resize(px, px)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .png()
        .toBuffer()
    )
  );
  fs.writeFileSync(path.join(root, 'public/favicon.ico'), await toIco(icoBuffers));
  console.log('wrote public/favicon.ico (16/32/48)');
})();
