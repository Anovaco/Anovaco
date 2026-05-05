import puppeteer from "puppeteer";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const url = "http://localhost:3000/contact";
const outDir = "./temporary screenshots";
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
const used = new Set(
  readdirSync(outDir).map((f) => f.match(/^screenshot-(\d+)/)?.[1]).filter(Boolean).map(Number),
);
let n = 1;
while (used.has(n)) n++;
const outPath = path.join(outDir, `screenshot-${n}-booked-slot.png`);

// Pre-fill the form draft so steps 1-4 pass validation and we can advance
// quickly to the time-picker step.
const draft = {
  business_name: "Booked Slot Demo",
  city: "Toronto",
  industry: "Software",
  name: "Demo User",
  role: "Founder",
  email: "demo@example.com",
  phone: "+1-555-0100",
  interests: ["SEO", "Web Design"],
  challenge: "Demonstrating the booked-slot UI.",
  referral: "Self",
  referral_other: "",
  // No date/time yet — we'll click them in.
};

const browser = await puppeteer.launch({ headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1100, deviceScaleFactor: 1 });

// Seed the draft before the form mounts.
await page.evaluateOnNewDocument((draftJson) => {
  localStorage.setItem("anova_audit_form_draft", draftJson);
}, JSON.stringify(draft));

await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

// Click "Next" four times to advance from step 1 → step 5.
for (let i = 0; i < 4; i++) {
  await page.click(".msf-next");
  await new Promise((r) => setTimeout(r, 350));
}

// Pick May 22 2026 on the calendar. The Calendar component uses a date-fns
// month grid; we navigate to May 2026 and click the cell.
const TARGET = { y: 2026, m: 5, d: 22 };
const TARGET_LABEL = "May 22nd, 2026"; // react-day-picker aria-label format

// Step the calendar forward until the target month is showing.
for (let safety = 0; safety < 24; safety++) {
  const caption = await page.$eval(".rdp-caption_label, [class*='caption']", (el) => el.textContent ?? "").catch(() => "");
  if (caption.includes("May 2026")) break;
  const nextBtn = await page.$('button[aria-label*="next" i], button[name="next-month"], .rdp-button_next');
  if (!nextBtn) break;
  await nextBtn.click();
  await new Promise((r) => setTimeout(r, 200));
}

// Click the day cell. Try a few selectors.
const clicked = await page.evaluate((label) => {
  const candidates = [
    ...document.querySelectorAll(`button[aria-label="${label}"]`),
    ...document.querySelectorAll(`button[name="day"]`),
  ];
  for (const c of candidates) {
    const txt = c.getAttribute("aria-label") ?? c.textContent ?? "";
    if (txt.includes("May 22") || txt === "22") {
      (c).click();
      return txt;
    }
  }
  return null;
}, TARGET_LABEL);

console.log("Clicked day:", clicked);

// Wait for /api/availability to resolve and the slot list to render.
await new Promise((r) => setTimeout(r, 1500));

await page.screenshot({ path: outPath, fullPage: true });
await browser.close();
console.log(outPath);
