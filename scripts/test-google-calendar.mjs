import { google } from "googleapis";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "..", ".env.local");
const envText = readFileSync(envPath, "utf8");

const env = {};
for (const rawLine of envText.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if (
    (val.startsWith('"') && val.endsWith('"')) ||
    (val.startsWith("'") && val.endsWith("'"))
  ) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const clientEmail = env.GOOGLE_CLIENT_EMAIL;
const privateKey = (env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const calendarId = env.GOOGLE_CALENDAR_ID;

const fail = (msg) => {
  console.error(`\n❌ ${msg}`);
  process.exit(1);
};

console.log("=== Google Calendar Connection Test ===\n");
console.log(`Service account: ${clientEmail || "(missing)"}`);
console.log(`Calendar ID:     ${calendarId || "(missing)"}`);
console.log(
  `Private key:     ${privateKey ? `present (${privateKey.length} chars)` : "(missing)"}\n`,
);

if (!clientEmail || !privateKey || !calendarId) {
  fail("Missing one or more required env vars in .env.local");
}

const auth = new google.auth.JWT({
  email: clientEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

try {
  console.log("[1/3] Authorizing service account...");
  await auth.authorize();
  console.log("      ✅ Auth OK\n");

  console.log("[2/3] Reading target calendar metadata...");
  const meta = await calendar.calendars.get({ calendarId });
  console.log(`      ✅ Calendar found: "${meta.data.summary}" (tz: ${meta.data.timeZone})\n`);

  console.log("[3/3] Creating + deleting a test event to verify write access...");
  const start = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const created = await calendar.events.insert({
    calendarId,
    requestBody: {
      summary: "[TEST] Anova Co. API connection check",
      description: "Auto-created by scripts/test-google-calendar.mjs — safe to ignore. Will be deleted immediately.",
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
    },
  });
  console.log(`      ✅ Event created (id: ${created.data.id})`);
  await calendar.events.delete({ calendarId, eventId: created.data.id });
  console.log(`      ✅ Event deleted\n`);

  console.log("🎉 All checks passed. Google Calendar integration is working.\n");
} catch (err) {
  const code = err?.code || err?.response?.status;
  const reason = err?.errors?.[0]?.reason || err?.response?.data?.error?.message;
  console.error(`\n❌ Failed${code ? ` (HTTP ${code})` : ""}${reason ? `: ${reason}` : ""}`);
  console.error(err?.message || err);
  process.exit(1);
}
