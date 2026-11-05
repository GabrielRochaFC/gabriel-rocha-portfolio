import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const bg = "#14120b";
const fg = "#e8e4d9";
const amber = "#e8a838";
const muted = "#a8a292";
const path = "#7d9aab";
const line = "#2c281e";
const font = "DejaVu Sans Mono";

function iconSvg(size) {
  const glyph = Math.round(size * 0.46);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" fill="${bg}"/>
    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" fill="${amber}" font-family="${font}" font-size="${glyph}">$</text>
  </svg>`;
}

async function pngIcon(size) {
  return sharp(Buffer.from(iconSvg(size))).png().toBuffer();
}

function ico(images) {
  const count = images.length;
  const header = 6 + count * 16;
  let offset = header;
  const entries = [];
  for (const image of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(image.size === 256 ? 0 : image.size, 0);
    entry.writeUInt8(image.size === 256 ? 0 : image.size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(image.png.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += image.png.length;
  }
  const dir = Buffer.alloc(6);
  dir.writeUInt16LE(0, 0);
  dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(count, 4);
  return Buffer.concat([dir, ...entries, ...images.map((image) => image.png)]);
}

const sizes = [16, 32, 180, 192, 512];
const pngs = new Map();
for (const size of sizes) {
  pngs.set(size, await pngIcon(size));
}

await writeFile("public/favicon.svg", iconSvg(32));
await writeFile("public/favicon-16x16.png", pngs.get(16));
await writeFile("public/favicon-32x32.png", pngs.get(32));
await writeFile("public/apple-touch-icon.png", pngs.get(180));
await writeFile("public/android-chrome-192x192.png", pngs.get(192));
await writeFile("public/android-chrome-512x512.png", pngs.get(512));
await writeFile(
  "public/favicon.ico",
  ico([
    { size: 16, png: pngs.get(16) },
    { size: 32, png: pngs.get(32) },
  ]),
);

const photo = await sharp("public/portrait.jpg")
  .resize(420, 420, { fit: "cover", position: "centre" })
  .png()
  .toBuffer();

const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${bg}"/>
  <rect x="72" y="105" width="420" height="420" fill="none" stroke="${line}" stroke-width="2"/>
  <text x="556" y="196" fill="${amber}" font-family="${font}" font-size="28">gabriel@rocha ~ $</text>
  <rect x="868" y="172" width="18" height="30" fill="${amber}"/>
  <text x="556" y="286" fill="${fg}" font-family="${font}" font-size="64">Gabriel Rocha</text>
  <text x="556" y="342" fill="${muted}" font-family="${font}" font-size="30">full stack</text>
  <text x="556" y="430" fill="${fg}" font-family="${font}" font-size="24">TypeScript · Node.js · Next.js</text>
  <text x="556" y="474" fill="${muted}" font-family="${font}" font-size="24">Brazil</text>
  <text x="556" y="530" fill="${path}" font-family="${font}" font-size="24">gabrielrocha.tech</text>
</svg>`;

await sharp(Buffer.from(card))
  .composite([{ input: photo, left: 72, top: 105 }])
  .png()
  .toFile("public/opengraph.png");

console.log("meta images written");
