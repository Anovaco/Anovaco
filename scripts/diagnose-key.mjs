import { createPrivateKey } from "node:crypto";
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

const raw = env.GOOGLE_PRIVATE_KEY || "";
const pem = raw.replace(/\\n/g, "\n");

console.log(`Raw length:        ${raw.length}`);
console.log(`After \\n replace:  ${pem.length}`);
console.log(`Newlines in pem:   ${(pem.match(/\n/g) || []).length}`);
console.log(`Starts with:       ${JSON.stringify(pem.slice(0, 30))}`);
console.log(`Ends with:         ${JSON.stringify(pem.slice(-30))}`);
console.log(`Has BEGIN header:  ${pem.includes("-----BEGIN PRIVATE KEY-----")}`);
console.log(`Has END header:    ${pem.includes("-----END PRIVATE KEY-----")}`);
console.log(`Contains \\r:       ${pem.includes("\r")}`);
console.log(`Has stray quotes:  ${pem.includes('"')}`);

try {
  const k = createPrivateKey(pem);
  console.log(`\n✅ Key parsed OK. Type: ${k.asymmetricKeyType}, format: ${k.type}`);
} catch (e) {
  console.log(`\n❌ createPrivateKey failed: ${e.code || ""} ${e.message}`);
}
