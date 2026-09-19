import { createHmac, timingSafeEqual } from "node:crypto";
export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function verifySlack(
  raw: string,
  timestamp: string,
  signature: string,
  secret: string,
  now = Date.now(),
) {
  if (
    !secret ||
    !/^\d+$/.test(timestamp) ||
    Math.abs(now / 1000 - Number(timestamp)) > 300
  )
    return false;
  return safeEqual(
    "v0=" +
      createHmac("sha256", secret)
        .update(`v0:${timestamp}:${raw}`)
        .digest("hex"),
    signature,
  );
}
export function workerAllowed(request: Request) {
  const token = process.env.MARKETING_WORKER_TOKEN;
  return (
    !!token &&
    safeEqual(request.headers.get("authorization") || "", `Bearer ${token}`)
  );
}
export function ownerAllowed(actor: {
  user?: { id?: string };
  team?: { id?: string };
  channel?: { id?: string };
}) {
  return (
    !!process.env.MARKETING_SLACK_OWNER &&
    !!process.env.MARKETING_SLACK_TEAM &&
    !!process.env.MARKETING_SLACK_CHANNEL &&
    actor.user?.id === process.env.MARKETING_SLACK_OWNER &&
    actor.team?.id === process.env.MARKETING_SLACK_TEAM &&
    actor.channel?.id === process.env.MARKETING_SLACK_CHANNEL
  );
}
export function replyAddress(id: string) {
  const domain = process.env.MARKETING_REPLY_DOMAIN,
    secret = process.env.MARKETING_REPLY_SECRET;
  if (!domain || !secret) throw new Error("Reply routing not configured");
  return `reply+${id}.${createHmac("sha256", secret).update(id).digest("hex").slice(0, 24)}@${domain}`;
}
export function matchReplyAddress(address: string) {
  const found = address.match(
    /reply\+([a-f0-9-]{36})\.([a-f0-9]{24})@([^>\s]+)/i,
  );
  if (!found) return null;
  return safeEqual(replyAddress(found[1]).toLowerCase(), found[0].toLowerCase())
    ? found[1]
    : null;
}
