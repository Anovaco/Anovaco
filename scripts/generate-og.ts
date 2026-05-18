import sharp from "sharp";
import { writeFile } from "fs/promises";
import path from "path";

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <!-- Forest green background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#1B2B21" />

  <!-- Border inset 40px from edges -->
  <rect x="40" y="40" width="${WIDTH - 80}" height="${HEIGHT - 80}"
        fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1" />

  <!-- Gold corner dots -->
  <circle cx="40" cy="40" r="3" fill="#D4AF37" />
  <circle cx="${WIDTH - 40}" cy="40" r="3" fill="#D4AF37" />
  <circle cx="40" cy="${HEIGHT - 40}" r="3" fill="#D4AF37" />
  <circle cx="${WIDTH - 40}" cy="${HEIGHT - 40}" r="3" fill="#D4AF37" />

  <!-- A-mark container: 96x96 rounded square centered horizontally, top at y=202 -->
  <rect x="552" y="202" width="96" height="96" rx="14"
        fill="rgba(244,241,237,0.08)" stroke="rgba(244,241,237,0.15)" stroke-width="1" />

  <!-- A-mark glyph (path in 0..52 viewbox), scaled to 96 and translated into the container -->
  <g transform="translate(552 202) scale(1.846154)">
    <path d="M26 10 L38 38 H32.5 L26 24 L19.5 38 H14 Z" fill="#F4F1ED" />
    <rect x="18" y="28" width="16" height="2.5" fill="#D4AF37" />
  </g>

  <!-- ANOVA wordmark (52px, weight 300, 0.4em tracking, uppercase, canvas) -->
  <text x="600" y="370"
        font-family="Helvetica, Arial, sans-serif"
        font-size="52" font-weight="300"
        letter-spacing="20.8"
        fill="#F4F1ED"
        text-anchor="middle">ANOVA</text>

  <!-- CO. subtext (14px, weight 300, 0.6em tracking, uppercase, gold) -->
  <text x="600" y="394"
        font-family="Helvetica, Arial, sans-serif"
        font-size="14" font-weight="300"
        letter-spacing="8.4"
        fill="#D4AF37"
        text-anchor="middle">CO.</text>

  <!-- Gold divider line, 48x1, centered, 24px below CO. -->
  <line x1="576" y1="418" x2="624" y2="418" stroke="#D4AF37" stroke-width="1" />

  <!-- Descriptor line (11px, weight 400, 0.25em tracking, uppercase) -->
  <text x="600" y="446"
        font-family="Helvetica, Arial, sans-serif"
        font-size="11" font-weight="400"
        letter-spacing="2.75"
        fill="rgba(244,241,237,0.55)"
        text-anchor="middle">BUSINESS SOLUTIONS CONSULTING</text>

  <!-- Tagline (18px, weight 300, 0.2em tracking, uppercase, canvas/50%) -->
  <text x="600" y="486"
        font-family="Helvetica, Arial, sans-serif"
        font-size="18" font-weight="300"
        letter-spacing="3.6"
        fill="rgba(244,241,237,0.5)"
        text-anchor="middle">GROWTH, ENGINEERED.</text>

  <!-- URL bottom-right (14px, 0.15em tracking, uppercase, canvas/30%) -->
  <text x="${WIDTH - 64}" y="${HEIGHT - 56}"
        font-family="Helvetica, Arial, sans-serif"
        font-size="14"
        letter-spacing="2.1"
        fill="rgba(244,241,237,0.3)"
        text-anchor="end">ANOVACO.CA</text>
</svg>`;

async function main() {
  const out = path.join(process.cwd(), "public", "og-image.png");
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(out, png);
  const meta = await sharp(png).metadata();
  console.log(`Wrote ${out} — ${meta.width}x${meta.height} ${png.length} bytes`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
