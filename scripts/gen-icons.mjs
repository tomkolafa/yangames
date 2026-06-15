/* Rasterize icon.svg into the PNG sizes the manifest + iOS need. */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile('icon.svg');
const out = [
  { name: 'icon-180.png', size: 180 }, // apple-touch-icon
  { name: 'icon-192.png', size: 192 }, // manifest
  { name: 'icon-512.png', size: 512 }, // manifest + maskable
];

for (const { name, size } of out) {
  await sharp(svg, { density: 512 }).resize(size, size).png().toFile(name);
  console.log('wrote', name, `(${size}x${size})`);
}
