// Backdates the most recent booking's three scheduled-email timestamps so the
// cron route fires them immediately. For testing only.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const STORE = join(process.cwd(), "data", "bookings.json");
const TARGET_EMAIL = process.argv[2];
if (!TARGET_EMAIL) {
  console.error("Usage: node scripts/fire-scheduled-test.mjs <email>");
  process.exit(1);
}

const all = JSON.parse(readFileSync(STORE, "utf8"));
const idx = all.map((b, i) => ({ b, i })).reverse().find((x) => x.b.clientEmail === TARGET_EMAIL)?.i;
if (idx === undefined) {
  console.error(`No booking found for ${TARGET_EMAIL}`);
  process.exit(1);
}

const past = new Date(Date.now() - 60 * 1000).toISOString();
all[idx].scheduledEmails.reminder24h = { scheduledFor: past, sent: false };
all[idx].scheduledEmails.reminder1h = { scheduledFor: past, sent: false };
all[idx].scheduledEmails.followUp = { scheduledFor: past, sent: false };

writeFileSync(STORE, JSON.stringify(all, null, 2), "utf8");
console.log(`Backdated all 3 scheduled emails for booking ${all[idx].id} (${TARGET_EMAIL})`);
