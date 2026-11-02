import "server-only";
import { inquiryStoreReady, persistentLimit } from "./local-store";
export { sameOrigin } from "./origin";
export async function readJson(request: Request, maxBytes = 50000) {
  if (Number(request.headers.get("content-length") ?? 0) > maxBytes)
    throw new Error("REQUEST_TOO_LARGE");
  const reader = request.body?.getReader();
  if (!reader) throw new SyntaxError("EMPTY_BODY");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("REQUEST_TOO_LARGE");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function rateLimit(
  request: Request,
  bucket: string,
  limit: number,
  seconds: number,
) {
  if (!inquiryStoreReady()) return false;
  const header = process.env.VERCEL
    ? "x-vercel-forwarded-for"
    : "x-forwarded-for";
  const address =
    request.headers.get(header)?.split(",")[0]?.trim() ?? "unknown";
  return persistentLimit(address, bucket, limit, seconds);
}
