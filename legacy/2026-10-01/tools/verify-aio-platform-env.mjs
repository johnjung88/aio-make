import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");

const required = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "ADMIN_PASSWORD",
  "ADMIN_SESSION_SECRET",
];

const recommended = [
  "ANTHROPIC_API_KEY",
  "ANTHROPIC_MODEL",
  "TELEGRAM_BOT_TOKEN",
  "TELEGRAM_CHAT_ID",
  "TELEGRAM_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
  "NEXT_PUBLIC_GA_ID",
  "ANALYTICS_HMAC_SECRET",
];

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const env = {};
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function getValue(env, key) {
  return process.env[key] ?? env[key] ?? "";
}

function maskValue(value) {
  if (!value) return "";
  if (value.length <= 8) return "set";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

const fileEnv = parseEnvFile(envPath);
const missingRequired = [];
const missingRecommended = [];

console.log("AIO platform environment check");
console.log(`Source: ${fs.existsSync(envPath) ? ".env.local + process.env" : "process.env only"}`);
console.log("");

for (const key of required) {
  const value = getValue(fileEnv, key);
  if (!value) missingRequired.push(key);
  console.log(`${value ? "OK  " : "MISS"} required    ${key}${value ? ` = ${maskValue(value)}` : ""}`);
}

for (const key of recommended) {
  const value = getValue(fileEnv, key);
  if (!value) missingRecommended.push(key);
  console.log(`${value ? "OK  " : "MISS"} recommended ${key}${value ? ` = ${maskValue(value)}` : ""}`);
}

console.log("");

if (missingRequired.length > 0) {
  console.error(`Missing required variables: ${missingRequired.join(", ")}`);
}

if (missingRecommended.length > 0) {
  console.warn(`Missing recommended variables: ${missingRecommended.join(", ")}`);
}

if (missingRequired.length > 0) {
  process.exit(1);
}

console.log("Required environment variables are present.");
