/**
 * Gera ícones PWA placeholder (PNG válidos) para public/icons/
 * Tema: #ec4899 (theme_color do manifest)
 * Uso: node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ICONS_DIR = path.join(__dirname, '..', 'public', 'icons');
const THEME_COLOR = '#ec4899';

const sizes = [
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-256x256.png', size: 256 },
  { name: 'icon-384x384.png', size: 384 },
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-maskable-512x512.png', size: 512 },
];

async function generate() {
  if (!fs.existsSync(ICONS_DIR)) {
    fs.mkdirSync(ICONS_DIR, { recursive: true });
  }

  for (const { name, size } of sizes) {
    const outPath = path.join(ICONS_DIR, name);
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: THEME_COLOR,
      },
    })
      .png()
      .toFile(outPath);
    console.log('Created:', name);
  }
  console.log('Done. Icons in', ICONS_DIR);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
