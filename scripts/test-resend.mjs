import { Resend } from "resend";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envText = readFileSync(resolve(__dirname, "..", ".env.local"), "utf8");

const env = {};
for (const rawLine of envText.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq === -1) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  env[key] = val;
}

const apiKey = env.RESEND_API_KEY;
const to = env.NOTIFICATION_EMAIL || "ano@anovaco.ca";
const from = "Anova Co. <ano@anovaco.ca>";

console.log("=== Resend Connection Test ===\n");
console.log(`API key:     ${apiKey ? `present (${apiKey.length} chars, prefix ${apiKey.slice(0, 4)}…)` : "(missing)"}`);
console.log(`From:        ${from}`);
console.log(`To:          ${to}\n`);

if (!apiKey) {
  console.error("❌ RESEND_API_KEY missing");
  process.exit(1);
}

const resend = new Resend(apiKey);

try {
  console.log("Sending test email...");
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject: "[TEST] Anova Co. Resend integration check",
    text: [
      "This is an automated test from scripts/test-resend.mjs.",
      "",
      "If you're reading this, the Resend API key works and the sender domain is verified.",
      "",
      `Sent at: ${new Date().toISOString()}`,
    ].join("\n"),
  });

  if (error) {
    console.error(`\n❌ Resend returned error:`);
    console.error(JSON.stringify(error, null, 2));
    process.exit(1);
  }

  console.log(`\n✅ Email accepted by Resend (id: ${data?.id})`);
  console.log(`   Check inbox: ${to}`);
} catch (err) {
  console.error(`\n❌ Send failed: ${err?.message || err}`);
  if (err?.response?.data) console.error(JSON.stringify(err.response.data, null, 2));
  process.exit(1);
}
