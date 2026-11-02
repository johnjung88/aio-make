// 텔레그램 발송 유틸 — Markdown 옵션 지원
// 메시지 포맷 명세: docs/_aio_bot_specs/메시지템플릿_v1.md

export type TelegramSendOptions = {
  parseMode?: "Markdown" | "MarkdownV2" | "HTML" | "none";
  disableWebPagePreview?: boolean;
  disableNotification?: boolean;
};

export async function notifyTelegram(text: string, options: TelegramSendOptions = {}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await sendTelegramMessage(chatId, text, options);
}

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options: TelegramSendOptions = {},
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const parseMode = options.parseMode ?? "Markdown";
  const body: Record<string, unknown> = {
    chat_id: chatId,
    text,
    disable_web_page_preview: options.disableWebPagePreview ?? true,
  };
  if (parseMode !== "none") {
    body.parse_mode = parseMode;
  }
  if (options.disableNotification) {
    body.disable_notification = true;
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[telegram] non-OK response:", res.status, detail.slice(0, 300));
    }
  } catch (error) {
    console.error("[telegram] notification error:", error instanceof Error ? error.message : error);
  }
}

// =====================================================
// 파일 첨부 발송 (sendDocument)
// =====================================================
export type TelegramDocumentOptions = {
  caption?: string;
  parseMode?: "Markdown" | "MarkdownV2" | "HTML" | "none";
  disableNotification?: boolean;
  contentType?: string;
};

export async function sendTelegramDocument(
  chatId: string | number,
  file: Buffer | Uint8Array,
  filename: string,
  options: TelegramDocumentOptions = {},
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const contentType =
    options.contentType ?? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  const form = new FormData();
  form.append("chat_id", String(chatId));

  // Node 20+ globalThis.Blob 사용. BlobPart 타입은 ArrayBuffer를 요구하므로
  // Buffer/Uint8Array의 backing buffer가 SharedArrayBuffer로 추론되는 문제를 피한다.
  const arrayBuffer = new ArrayBuffer(file.byteLength);
  new Uint8Array(arrayBuffer).set(file instanceof Buffer ? new Uint8Array(file) : file);
  const blob = new Blob([arrayBuffer], { type: contentType });
  form.append("document", blob, filename);

  if (options.caption) {
    form.append("caption", options.caption);
    const parseMode = options.parseMode ?? "Markdown";
    if (parseMode !== "none") form.append("parse_mode", parseMode);
  }
  if (options.disableNotification) form.append("disable_notification", "true");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, {
      method: "POST",
      body: form,
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[telegram] sendDocument non-OK:", res.status, detail.slice(0, 300));
    }
  } catch (error) {
    console.error("[telegram] sendDocument error:", error instanceof Error ? error.message : error);
  }
}

export async function notifyTelegramDocument(
  file: Buffer | Uint8Array,
  filename: string,
  options: TelegramDocumentOptions = {},
): Promise<void> {
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!chatId) return;
  await sendTelegramDocument(chatId, file, filename, options);
}
