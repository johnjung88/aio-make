"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics/client";

function usePageAccent(): string {
  const pathname = usePathname();
  if (/\/services\/website/.test(pathname)) return "#4DD4AC";
  if (/\/services\/shopping-mall/.test(pathname)) return "#FB923C";
  if (/\/services\/automation-app/.test(pathname)) return "#818CF8";
  if (/\/services\/(design|detail-page|ppt-design)/.test(pathname)) return "#C66060";
  if (/\/services\/marketing/.test(pathname)) return "#8BE0C2";
  if (/\/services\/video/.test(pathname)) return "#E8A340";
  return "#C8A24A";
}

type ChatMessage = { role: "assistant" | "customer"; content: string };

const QUICK = [
  "홈페이지 제작 견적이 궁금해요",
  "쇼핑몰(카페24) 만들고 싶어요",
  "상세페이지 일정·금액 알려주세요",
  "PPT·제안서 디자인 의뢰",
  "로고·명함 브랜딩 문의",
  "업무 자동화·앱 MVP 상담",
];

export function PublicChatbot({ locale }: { locale: string }) {
  const accent = usePageAccent();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [requested, setRequested] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "안녕하세요, AIO 상담입니다 👋\n어떤 작업이 필요하신가요? 아래에서 골라주시거나 직접 적어주시면 예상 범위·일정을 먼저 안내드릴게요.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, open]);

  async function send(text: string, opts?: { request?: boolean }) {
    const t = text.trim();
    if (!t || isSending) return;
    setError("");
    setIsSending(true);
    setStarted(true);
    setMessages((c) => [...c, { role: "customer", content: t }]);
    setMessage("");
    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message: t, locale: locale === "en" ? "en" : "ko" }),
      });
      const json = (await res.json()) as { success: boolean; data?: { reply?: string }; error?: string };
      if (!res.ok || !json.success) throw new Error(json.error ?? "전송에 실패했습니다.");
      trackEvent("submit_chat", {});
      setMessages((c) => [
        ...c,
        { role: "assistant", content: json.data?.reply ?? "접수되었습니다. 담당자가 확인 후 이어서 안내드리겠습니다." },
      ]);
      if (opts?.request) setRequested(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "전송에 실패했습니다.");
    } finally {
      setIsSending(false);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(message);
  }

  function requestCallback() {
    if (!name.trim() || !phone.trim()) {
      setError("이름과 연락처를 입력해 주세요.");
      return;
    }
    void send(`상담 신청합니다. (${name.trim()} / ${phone.trim()})`, { request: true });
  }

  return (
    <div className="fixed right-4 top-3 z-[70] flex flex-col-reverse items-end gap-3 sm:bottom-5 sm:right-5 sm:top-auto sm:z-50 sm:flex-col">
      {open && (
        <section className="flex max-h-[78vh] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-card shadow-2xl shadow-black/40">
          {/* header */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-lg" style={{ background: accent, color: "#0D1117" }}>
                <Bot className="size-4" />
              </span>
              <div>
                <h2 className="text-sm font-semibold">AIO 상담</h2>
                <p className="text-xs text-muted-foreground">예상 견적·일정 즉시 안내</p>
              </div>
            </div>
            <button
              className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-muted-foreground transition hover:text-foreground"
              onClick={() => setOpen(false)}
              aria-label="상담창 닫기"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((chat, index) => (
              <div key={`${chat.role}-${index}`} className={chat.role === "customer" ? "flex justify-end" : "flex justify-start"}>
                <p
                  className={
                    chat.role === "customer"
                      ? "max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-sm px-3 py-2 text-sm"
                      : "max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-sm bg-white/5 px-3 py-2 text-sm leading-relaxed text-foreground"
                  }
                  style={chat.role === "customer" ? { background: accent, color: "#0D1117" } : undefined}
                >
                  {chat.content}
                </p>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <p className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-white/5 px-3 py-2 text-sm text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> 입력 중…
                </p>
              </div>
            )}

            {/* quick replies — only before the first customer message */}
            {!started && (
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => void send(q)}
                    className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary hover:text-foreground"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* contact capture */}
          {!requested ? (
            <div className="border-t border-white/10 px-4 py-3">
              <div className="mb-2 flex gap-2">
                <input
                  className="h-9 flex-1 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none focus:border-primary"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="h-9 flex-1 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none focus:border-primary"
                  placeholder="연락처"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button
                  type="button"
                  onClick={requestCallback}
                  disabled={isSending}
                  className="shrink-0 rounded-lg px-3 text-sm font-semibold transition hover:brightness-105 disabled:opacity-60"
                  style={{ background: accent, color: "#0D1117" }}
                >
                  상담 신청
                </button>
              </div>
              {error && <p className="text-xs text-amber-300">{error}</p>}
            </div>
          ) : (
            <div className="border-t border-white/10 px-4 py-3 text-sm text-foreground" style={{ background: `${accent}18` }}>
              상담 신청이 접수되었습니다. 1시간 내(영업시간 기준) 담당자가 연락드리겠습니다. 🙌
            </div>
          )}

          {/* chat input */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              className="h-10 flex-1 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none focus:border-primary"
              placeholder="필요한 작업을 적어주세요…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="flex size-10 items-center justify-center rounded-lg transition hover:brightness-105 disabled:opacity-60"
              style={{ background: accent, color: "#0D1117" }}
              disabled={isSending || !message.trim()}
              aria-label="메시지 보내기"
            >
              {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </button>
          </form>
        </section>
      )}

      <button
        className="flex h-12 items-center gap-2 rounded-lg px-4 text-sm font-semibold shadow-lg shadow-black/30 transition hover:brightness-105"
        style={{ background: accent, color: "#0D1117" }}
        onClick={() => { setOpen((current) => { if (!current) trackEvent("open_chatbot", {}); return !current; }); }}
        aria-label="AIO 상담 열기"
      >
        <MessageCircle className="size-5" />
        상담
      </button>
    </div>
  );
}
