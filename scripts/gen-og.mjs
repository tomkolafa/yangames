/* Generate og.png (1200×630) — the social link-preview card.
   Cream brand background + soft coral glow + the cat mascot + the
   YANDL / RUNDL tile logos. The cat is composited from the real asset. */
import sharp from 'sharp';

const W = 1200, H = 630;

function tileRow(x, y, letters, colors) {
  var s = 72, gap = 11, r = 18;
  return letters.map(function (ch, i) {
    var tx = x + i * (s + gap);
    return (
      '<rect x="' + tx + '" y="' + y + '" width="' + s + '" height="' + s + '" rx="' + r + '" fill="' + colors[i] + '"/>' +
      '<text x="' + (tx + s / 2) + '" y="' + (y + s / 2 + 1) + '" text-anchor="middle" dominant-baseline="central" ' +
      'font-family="Arial, sans-serif" font-weight="800" font-size="38" fill="#ffffff">' + ch + '</text>'
    );
  }).join('');
}

const TX = 470; // right-column x (clears the cat)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="20%" cy="42%" r="55%">
      <stop offset="0%" stop-color="#F6C7B4" stop-opacity="0.9"/>
      <stop offset="60%" stop-color="#FBEDC6" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#FBF7F0" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#FBF7F0"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <text x="${TX}" y="150" font-family="Arial, sans-serif" font-weight="800" font-size="26"
        letter-spacing="6" fill="#9B9085">YANGAMES</text>

  ${tileRow(TX, 178, ['Y', 'A', 'N', 'D', 'L'], ['#E8755C', '#8FD3B6', '#F4D58D', '#C7B6E8', '#A7D3E8'])}
  ${tileRow(TX, 272, ['R', 'U', 'N', 'D', 'L'], ['#E8755C', '#F4D58D', '#8FD3B6', '#C7B6E8', '#F4B942'])}

  <text x="${TX}" y="408" font-family="Arial, sans-serif" font-weight="700" font-size="34" fill="#2E2A28">Two little daily games.</text>
  <text x="${TX}" y="452" font-family="Arial, sans-serif" font-weight="600" font-size="24" fill="#6B635E">Guess the word · run &amp; dodge · beat your score</text>
  <text x="${TX}" y="520" font-family="Arial, sans-serif" font-weight="700" font-size="24" fill="#E8755C">yandlgames.vercel.app</text>
</svg>`;

const cat = await sharp('assets/illustrations/cat.png')
  .resize({ height: 440, fit: 'inside' })
  .toBuffer();
const meta = await sharp(cat).metadata();

await sharp(Buffer.from(svg))
  .composite([{ input: cat, left: Math.round(190 - meta.width / 2), top: 100 }])
  .png()
  .toFile('og.png');

console.log('wrote og.png (1200x630), cat', meta.width + 'x' + meta.height);
