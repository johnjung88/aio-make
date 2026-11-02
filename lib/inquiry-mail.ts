import "server-only";
import {
  createHmac,
  timingSafeEqual,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
} from "node:crypto";
import {
  setting,
  localMode,
  importInquiry,
  validEnvelope,
  type Envelope,
} from "./local-store.ts";
export const mailbox = "aiomake2023@gmail.com";
function signingKey() {
  const k = process.env.INQUIRY_SIGNING_SECRET;
  if (!k || k.length < 32) throw Error("MAIL_SIGNING_NOT_CONFIGURED");
  return k;
}
export function signedEnvelope(e: Envelope) {
  const data = Buffer.from(JSON.stringify(e)).toString("base64url");
  return {
    data,
    signature: createHmac("sha256", signingKey()).update(data).digest("hex"),
  };
}
export function parseSigned(data: string, signature: string) {
  const expected = createHmac("sha256", signingKey())
    .update(data)
    .digest("hex");
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    throw Error("INVALID_SIGNATURE");
  const e: unknown = JSON.parse(
    Buffer.from(data, "base64url").toString("utf8"),
  );
  if (!validEnvelope(e)) throw Error("INVALID_ENVELOPE");
  return e;
}
function key() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw Error("LOCAL_SECRET_REQUIRED");
  return createHash("sha256").update(secret).digest();
}
export function seal(value: string) {
  const iv = randomBytes(12),
    c = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([c.update(value, "utf8"), c.final()]);
  return Buffer.concat([iv, c.getAuthTag(), encrypted]).toString("base64url");
}
export function unseal(value: string) {
  const b = Buffer.from(value, "base64url"),
    d = createDecipheriv("aes-256-gcm", key(), b.subarray(0, 12));
  d.setAuthTag(b.subarray(12, 28));
  return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
}
export function googleConfigured() {
  return !!(process.env.GMAIL_CLIENT_ID && process.env.GMAIL_CLIENT_SECRET);
}
async function refreshToken(mode: "read" | "send") {
  if (mode === "send" && process.env.GMAIL_SEND_REFRESH_TOKEN)
    return process.env.GMAIL_SEND_REFRESH_TOKEN;
  if (!localMode()) throw Error("MAIL_SEND_NOT_CONNECTED");
  const token = await setting("gmail_" + mode);
  if (typeof token !== "string") throw Error("GOOGLE_NOT_CONNECTED");
  return unseal(token);
}
export async function googleToken(mode: "read" | "send") {
  if (!googleConfigured()) throw Error("GOOGLE_CLIENT_REQUIRED");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID!,
      client_secret: process.env.GMAIL_CLIENT_SECRET!,
      refresh_token: await refreshToken(mode),
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(15000),
  });
  const body = await res.json();
  if (!res.ok || !body.access_token) throw Error("GOOGLE_RECONNECT_REQUIRED");
  return body.access_token as string;
}
export async function sendInquiry(envelope: Envelope) {
  const token = await googleToken("send"),
    signed = signedEnvelope(envelope);
  const p = envelope.payload;
  const text = [
    "AIO MAKE 웹사이트 문의",
    "접수번호: " + envelope.id,
    "성함: " + p.name,
    "이메일: " + p.email,
    "전화: " + p.phone,
    "회사: " + p.company,
    "분야: " + p.division,
    "서비스: " + p.service,
    "",
    p.message,
    "",
    "--- AIO INQUIRY V1 ---",
    signed.data,
    signed.signature,
    "--- END AIO INQUIRY ---",
  ].join("\r\n");
  const raw = [
    "From: AIO MAKE <" + mailbox + ">",
    "To: " + mailbox,
    "Subject: [AIO-INQUIRY] " + envelope.id,
    "Message-ID: <aio-" + envelope.id + "@aio-make.com>",
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: base64",
    "",
    Buffer.from(text)
      .toString("base64")
      .match(/.{1,76}/g)!
      .join("\r\n"),
  ].join("\r\n");
  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: Buffer.from(raw).toString("base64url") }),
      signal: AbortSignal.timeout(20000),
    },
  );
  const result = await res.json();
  if (!res.ok || !result.id) throw Error("MAIL_DELIVERY_FAILED");
  return { inquiryId: envelope.id, duplicate: false };
}
type Part = { mimeType?: string; body?: { data?: string }; parts?: Part[] };
function textPart(p: Part): string {
  return (
    (p.mimeType === "text/plain" && p.body?.data
      ? Buffer.from(p.body.data, "base64url").toString("utf8")
      : "") + (p.parts ?? []).map(textPart).join("\n")
  );
}
let running: Promise<unknown> | undefined;
export async function syncInquiries() {
  if (!localMode()) throw Error("LOCAL_ONLY");
  if (running) return running;
  running = (async () => {
    const token = await googleToken("read");
    const since = Number(await setting("gmail_sync_since")) || 0;
    const query =
      "in:anywhere from:" +
      mailbox +
      " to:" +
      mailbox +
      " subject:AIO-INQUIRY" +
      (since ? " after:" + Math.floor((since - 86400000) / 1000) : "");
    let pageToken = "",
      imported = 0,
      duplicates = 0,
      rejected = 0;
    const started = Date.now();
    do {
      const url = new URL(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages",
      );
      url.searchParams.set("q", query);
      url.searchParams.set("maxResults", "100");
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      const list = await fetch(url, {
        headers: { Authorization: "Bearer " + token },
        signal: AbortSignal.timeout(15000),
      });
      if (!list.ok) throw Error("MAIL_READ_FAILED");
      const data = await list.json();
      for (const m of data.messages ?? []) {
        const res = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages/" +
            encodeURIComponent(m.id) +
            "?format=full",
          {
            headers: { Authorization: "Bearer " + token },
            signal: AbortSignal.timeout(15000),
          },
        );
        if (!res.ok) throw Error("MAIL_READ_FAILED");
        const body = await res.json();
        const match = textPart(body.payload).match(
          /--- AIO INQUIRY V1 ---\s+([A-Za-z0-9_-]+)\s+([a-f0-9]{64})\s+--- END AIO INQUIRY ---/,
        );
        if (!match) {
          rejected++;
          continue;
        }
        let e: Envelope;
        try {
          e = parseSigned(match[1], match[2]);
        } catch {
          rejected++;
          continue;
        }
        if (await importInquiry(e, m.id)) imported++;
        else duplicates++;
      }
      pageToken = data.nextPageToken ?? "";
    } while (pageToken);
    await setting("gmail_sync_since", started);
    const result = {
      imported,
      duplicates,
      rejected,
      syncedAt: new Date().toISOString(),
    };
    await setting("gmail_sync_status", result);
    return result;
  })().finally(() => {
    running = undefined;
  });
  return running;
}
export function mailError(e: unknown) {
  const code = e instanceof Error ? e.message : "";
  const messages: Record<string, string> = {
    GOOGLE_CLIENT_REQUIRED: "Google 연결 설정이 필요합니다",
    GOOGLE_NOT_CONNECTED: "Google 계정을 연결해주세요",
    MAIL_SEND_NOT_CONNECTED: "문의 이메일 발송 연결이 필요합니다",
    MAIL_SIGNING_NOT_CONFIGURED: "문의 연동 설정을 확인해주세요",
    GOOGLE_RECONNECT_REQUIRED:
      "Google 인증이 만료되었거나 취소되었습니다 다시 연결해주세요",
    MAIL_DELIVERY_FAILED:
      "문의 전송을 확인하지 못했습니다 입력 내용을 유지한 채 다시 시도해주세요",
    MAIL_READ_FAILED:
      "문의 이메일을 불러오지 못했습니다 잠시 후 다시 시도해주세요",
  };
  return (
    messages[code] ??
    "연결을 완료하지 못했습니다 설정과 네트워크를 확인해주세요"
  );
}
