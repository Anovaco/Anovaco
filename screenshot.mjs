import puppeteer from "puppeteer";
import { existsSync, mkdirSync, readdirSync } from "fs";
import path from "path";

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const outDir = "./temporary screenshots";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const used = new Set(
  readdirSync(outDir)
    .map((f) => f.match(/^screenshot-(\d+)/)?.[1])
    .filter(Boolean)
    .map(Number)
);
let n = 1;
while (used.has(n)) n++;
const filename = label
  ? `screenshot-${n}-${label}.png`
  : `screenshot-${n}.png`;
const outPath = path.join(outDir, filename);

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(outPath);
