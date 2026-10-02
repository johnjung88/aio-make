import "server-only";
import { createHash } from "node:crypto";
import { localMode, persistentLimit } from "./local-store";
export { sameOrigin } from "./origin";
export async function readJson(request: Request, maxBytes = 50000) {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes)
    throw new Error("REQUEST_TOO_LARGE");
  const text = await request.text();
  if (Buffer.byteLength(text) > maxBytes) throw new Error("REQUEST_TOO_LARGE");
  return JSON.parse(text);
}
const localLimits = new Map<string, { count: number; reset: number }>();
export async function rateLimit(
  request: Request,
  bucket: string,
  limit: number,
  seconds: number,
) {
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const key = createHash("sha256")
    .update(bucket + ":" + address)
    .digest("hex");
  if (localMode()) return persistentLimit(address, bucket, limit, seconds);
  if (bucket !== "contact" || process.env.CONTACT_PUBLIC_ENABLED !== "true")
    return false;
  const now = Date.now();
  for (const [k, v] of localLimits) if (v.reset < now) localLimits.delete(k);
  let item = localLimits.get(key);
  if (!item || item.reset < now) {
    item = { count: 0, reset: now + seconds * 1000 };
    localLimits.set(key, item);
  }
  item.count++;
  return item.count <= limit;
}
