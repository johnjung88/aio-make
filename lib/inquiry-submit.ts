import "server-only";
import { inquiryDb, validEnvelope, type Envelope } from "./local-store.ts";

export function notificationConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY &&
      (process.env.INQUIRY_EMAIL_FROM || process.env.RESEND_FROM_EMAIL),
  );
}
export async function saveInquiry(envelope: Envelope) {
  if (!validEnvelope(envelope)) throw Error("INVALID_INQUIRY");
  const db = await inquiryDb();
  return db.transaction(async (tx) => {
    const result = await tx.query<{ id: string }>(
      "INSERT INTO inquiries(id,envelope,created_at) VALUES($1,$2,$3) ON CONFLICT(id) DO NOTHING RETURNING id",
      [envelope.id, JSON.stringify(envelope), envelope.receivedAt],
    );
    if (!result.rows.length) {
      const previous = await tx.query<{ payload: unknown }>(
        "SELECT envelope->'payload' AS payload FROM inquiries WHERE id=$1",
        [envelope.id],
      );
      const canonical = (value: unknown): string =>
        JSON.stringify(value, function (_, v) {
          return v && typeof v === "object" && !Array.isArray(v)
            ? Object.fromEntries(
                Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
              )
            : v;
        });
      if (canonical(previous.rows[0]?.payload) !== canonical(envelope.payload))
        throw Error("IDEMPOTENCY_CONFLICT");
    } else {
      await tx.query(
        "INSERT INTO inquiry_notifications(inquiry_id) VALUES($1)",
        [envelope.id],
      );
    }
    return { inquiryId: envelope.id, duplicate: !result.rows.length };
  });
}

// The inquiry is durable before notification. Unknown delivery is held for
// reconciliation, never automatically sent again.
export async function notifyInquiry(id: string) {
  if (!notificationConfigured()) return "pending";
  const db = await inquiryDb();
  const claim = await db.query(
    "UPDATE inquiry_notifications SET state='sending',attempts=attempts+1,updated_at=now() WHERE inquiry_id=$1 AND state IN ('pending','failed') RETURNING inquiry_id",
    [id],
  );
  if (!claim.rows.length) return "unchanged";
  let state = "unknown",
    providerId: string | null = null,
    code: string | null = "DELIVERY_UNCONFIRMED";
  try {
    const saved = await db.query<{ envelope: Envelope }>(
      "SELECT envelope FROM inquiries WHERE id=$1",
      [id],
    );
    const e = saved.rows[0].envelope,
      p = e.payload;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + process.env.RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": "aio-inquiry/" + id,
      },
      body: JSON.stringify({
        from: process.env.INQUIRY_EMAIL_FROM || process.env.RESEND_FROM_EMAIL,
        to: ["aiomake2023@gmail.com"],
        ...(p.email ? { reply_to: p.email } : {}),
        subject: "[AIO MAKE] 새 문의 " + id,
        text: [
          "AIO MAKE 웹사이트 문의",
          "접수번호: " + id,
          "성함: " + p.name,
          "회사: " + p.company,
          "이메일: " + p.email,
          "전화: " + p.phone,
          "분야: " + p.division,
          "서비스: " + p.service,
          "",
          p.message,
          "",
          "관리자에서 확인: https://aio-make.com/admin",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(15000),
    });
    const body = await response.json();
    if (response.ok && typeof body.id === "string") {
      state = "sent";
      providerId = body.id;
      code = null;
    } else if (
      response.status >= 400 &&
      response.status < 500 &&
      response.status !== 409
    ) {
      state = "failed";
      code = "PROVIDER_" + response.status;
    }
  } catch {
    /* Retain ambiguous delivery without losing the saved inquiry. */
  }
  await db.query(
    "UPDATE inquiry_notifications SET state=$2,provider_id=$3,last_error=$4,updated_at=now() WHERE inquiry_id=$1",
    [id, state, providerId, code],
  );
  return state;
}
