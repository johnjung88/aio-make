import { createHmac, timingSafeEqual } from "node:crypto";
export const sessionCookie = "aio_admin_session";
const maxAge = 60 * 60 * 8;
function equal(a: string, b: string) {
  const x = Buffer.from(a),
    y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
export function credentialsReady() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD &&
      process.env.ADMIN_SESSION_SECRET &&
      process.env.ADMIN_SESSION_SECRET.length >= 32,
  );
}
export function verifyCredentials(user: string, password: string) {
  return (
    credentialsReady() &&
    equal(user, process.env.ADMIN_USERNAME!) &&
    equal(password, process.env.ADMIN_PASSWORD!)
  );
}
export function createToken() {
  if (!credentialsReady()) throw new Error("관리자 인증 설정이 필요합니다.");
  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      exp: Math.floor(Date.now() / 1000) + maxAge,
    }),
  ).toString("base64url");
  return (
    payload +
    "." +
    createHmac("sha256", process.env.ADMIN_SESSION_SECRET!)
      .update(payload)
      .digest("base64url")
  );
}
export function verifyToken(token: string) {
  if (!credentialsReady()) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;
  const expected = createHmac("sha256", process.env.ADMIN_SESSION_SECRET!)
    .update(payload)
    .digest("base64url");
  if (!equal(signature, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return (
      data.role === "admin" &&
      Number.isFinite(data.exp) &&
      data.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
