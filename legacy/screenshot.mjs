import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.join(__dirname, 'temporary screenshots');

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

function nextScreenshotPath(label) {
  const files = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
  let max = 0;
  for (const f of files) {
    const match = f.match(/^screenshot-(\d+)/);
    if (match) max = Math.max(max, parseInt(match[1], 10));
  }
  const n = max + 1;
  const name = label ? `screenshot-${n}-${label}.png` : `screenshot-${n}.png`;
  return path.join(screenshotsDir, name);
}

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  const outPath = nextScreenshotPath(label);
  await page.screenshot({ path: outPath, fullPage: true });
  await browser.close();

  console.log(`Screenshot saved: ${outPath}`);
})();
