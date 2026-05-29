"use client";

import { useState } from "react";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

type ChatMessage = {
  role: "assistant" | "customer";
  content: string;
};

const QUICK_MESSAGES = [
  "PPT 제안서 디자인 의뢰하고 싶어요.",
  "홈페이지 제작 견적이 궁금합니다.",
  "상세페이지 제작 일정과 금액 알려주세요.",
  "업무 자동화 MVP 상담받고 싶어요.",
];

export function PublicChatbot({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "안녕하세요. 필요한 제작 내용을 적어주시면 예상 범위와 일정을 먼저 안내드릴게요.",
    },
  ]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    const customerMessage = message.trim();
    setError("");
    setIsSending(true);
    setMessages((current) => [...current, { role: "customer", content: customerMessage }]);
    setMessage("");

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: customerMessage,
          locale: locale === "en" ? "en" : "ko",
        }),
      });
      const json = (await response.json()) as { success: boolean; data?: { reply?: string }; error?: string };
      if (!response.ok || !json.success) {
        throw new Error(json.error ?? "문의 전송에 실패했습니다.");
      }
      trackEvent("submit_chat", {});
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: json.data?.reply ?? "문의가 접수되었습니다. 담당자가 확인 후 이어서 안내드리겠습니다.",
        },
      ]);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "문의 전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="fixed right-4 top-3 z-[70] flex flex-col-reverse items-end gap-3 sm:bottom-5 sm:right-5 sm:top-auto sm:z-50 sm:flex-col">
      {open && (
        <section className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-lg border border-white/10 bg-card shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="size-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">AIO 상담</h2>
                <p className="text-xs text-muted-foreground">예상 견적과 일정 확인</p>
              </div>
            </div>
            <button className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition hover:text-foreground" onClick={() => setOpen(false)} aria-label="상담창 닫기">
              <X className="size-4" />
            </button>
          </div>

          <div className="max-h-[320px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((chat, index) => (
              <div key={`${chat.role}-${index}`} className={chat.role === "customer" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={
                    chat.role === "customer"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground"
                      : "max-w-[85%] whitespace-pre-wrap rounded-lg bg-white/5 px-3 py-2 text-sm text-foreground"
                  }
                >
                  {chat.content}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto border-y border-white/10 px-4 py-3">
            {QUICK_MESSAGES.map((item) => (
              <button
                key={item}
                className="shrink-0 rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
                onClick={() => setMessage(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-3 p-4">
            <div className="grid grid-cols-2 gap-2">
              <input className="h-9 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none focus:border-primary" placeholder="성함" value={name} onChange={(event) => setName(event.target.value)} />
              <input className="h-9 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none focus:border-primary" placeholder="전화번호" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </div>
            <input className="h-9 w-full rounded-lg border border-white/10 bg-background px-3 text-sm outline-none focus:border-primary" type="email" placeholder="이메일" value={email} onChange={(event) => setEmail(event.target.value)} />
            <div className="flex gap-2">
              <textarea
                className="min-h-20 flex-1 resize-none rounded-lg border border-white/10 bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="제작 내용, 일정, 예산을 적어주세요."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
              <button className="flex w-11 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-60" disabled={isSending || !message.trim()} aria-label="문의 보내기">
                {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
            {error && <p className="text-xs text-amber-200">{error}</p>}
          </form>
        </section>
      )}

      <button
        className="flex h-12 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/30 transition hover:brightness-105"
        onClick={() => { setOpen((current) => { if (!current) trackEvent("open_chatbot", {}); return !current; }); }}
        aria-label="AIO 상담 열기"
      >
        <MessageCircle className="size-5" />
        상담
      </button>
    </div>
  );
}
