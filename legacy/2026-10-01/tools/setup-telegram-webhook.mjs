const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://aio-make.com").replace(/\/$/, "");

if (!token) {
  console.error("Missing TELEGRAM_BOT_TOKEN");
  process.exit(1);
}

if (!secret) {
  console.error("Missing TELEGRAM_WEBHOOK_SECRET");
  process.exit(1);
}

const webhookUrl = `${siteUrl}/api/telegram/webhook`;
const response = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    secret_token: secret,
    allowed_updates: ["message", "edited_message"],
  }),
});

const json = await response.json();
if (!response.ok || !json.ok) {
  console.error("Telegram setWebhook failed");
  console.error(JSON.stringify(json, null, 2));
  process.exit(1);
}

console.log(`Telegram webhook set: ${webhookUrl}`);
