import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Inbox, MessageCircle, MousePointerClick, Settings, Sparkles } from "lucide-react";
import { getInboxItems } from "@/lib/admin/data";

export const metadata = {
  title: "자사몰 봇 관리 | AIO 관리자",
};

const QUICK_REPLIES = [
  "홈페이지 제작 견적이 궁금해요",
  "쇼핑몰(카페24) 만들고 싶어요",
  "상세페이지 일정·금액 알려주세요",
  "PPT·제안서 디자인 의뢰",
  "로고·명함 브랜딩 문의",
  "업무 자동화·앱 MVP 상담",
];

const CATEGORY_RULES = [
  { category: "website", label: "홈페이지/랜딩페이지", price: "30만원부터", days: "3일 내외", keywords: "홈페이지, 웹사이트, 랜딩, 사이트, 반응형" },
  { category: "shop", label: "쇼핑몰/카페24", price: "30만원부터", days: "3-5일", keywords: "쇼핑몰, 카페24, 상품, 커머스, 스토어" },
  { category: "logo", label: "로고/명함", price: "3만원부터", days: "1-2일", keywords: "로고, 명함, 브랜딩" },
  { category: "detail", label: "상세페이지", price: "12만원부터", days: "2-3일", keywords: "상세페이지, 상세, 판매 이미지" },
  { category: "ppt", label: "PPT/제안서", price: "8만원부터", days: "1-2일", keywords: "PPT, 제안서, IR, 사업계획서" },
  { category: "automation", label: "자동화/앱 MVP", price: "80만원부터", days: "5일 내외", keywords: "자동화, 앱, MVP, 크롤링, 대시보드" },
  { category: "video", label: "영상 콘텐츠", price: "15만원부터", days: "2-3일", keywords: "영상, 쇼츠, 릴스, 편집" },
];

export default async function AdminBotPage() {
  const { items, error } = await getInboxItems(80);
  const chatbotItems = items.filter(
    (item) =>
      item.rawText &&
      (item.source === "public_chatbot" || (item.channel === "website" && item.customerName === "챗봇 고객")),
  );
  const newChatbotItems = chatbotItems.filter((item) => item.status === "new");
  const categoryCounts = CATEGORY_RULES.map((rule) => ({
    ...rule,
    count: chatbotItems.filter((item) => item.category === rule.category).length,
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Website Chatbot</p>
          <h2 className="mt-2 text-3xl font-semibold">자사몰 봇 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">자사몰 방문자를 상담하고 예상 견적·일정을 안내한 뒤 문의함으로 전환시키는 봇을 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/ko" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            자사몰 보기
          </Link>
          <Link href="/admin/inbox" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">
            문의함
          </Link>
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          봇 문의 데이터를 불러오지 못했습니다: {error}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "봇 목적", value: "견적 문의 유도", sub: "상담 → 연락처 → 문의함", icon: Bot },
          { label: "봇 유입 문의", value: `${chatbotItems.length}건`, sub: `신규 ${newChatbotItems.length}건`, icon: Inbox },
          { label: "빠른 질문", value: `${QUICK_REPLIES.length}개`, sub: "서비스별 시작 버튼", icon: MousePointerClick },
          { label: "자동 분류", value: `${CATEGORY_RULES.length}개`, sub: "서비스/가격/일정 매칭", icon: Sparkles },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{card.sub}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex items-center gap-2">
            <MessageCircle className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">자사몰 봇 전환 흐름</h3>
          </div>
          <div className="mt-5 space-y-3">
            {[
              "방문자가 상담 버튼을 열면 서비스별 빠른 질문을 보여줍니다.",
              "문의 문장을 `/api/chatbot`으로 보내 서비스 카테고리, 예상가, 일정을 자동 안내합니다.",
              "이름과 연락처를 받으면 `leads`, `quote_requests`, `conversations`에 저장합니다.",
              "저장된 문의는 통합 문의함과 CEO Snapshot에 표시되고, 텔레그램 알림도 발송합니다.",
              "정확한 견적/납기/고객 발송은 승인센터와 의장님 승인 후 확정합니다.",
            ].map((step, index) => (
              <div key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs text-primary">{index + 1}</span>
                <p className="text-muted-foreground">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex items-center gap-2">
            <Settings className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">현재 빠른 질문</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {QUICK_REPLIES.map((reply) => (
              <span key={reply} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-muted-foreground">
                {reply}
              </span>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            현재 빠른 질문과 분류 규칙은 코드에 고정되어 있습니다. admin에서 직접 수정하려면 `chatbot_playbooks` 테이블과 승인 후 publish 흐름을 추가해야 합니다.
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">분류/견적 안내 규칙</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-muted-foreground">
                <th className="px-5 py-3">카테고리</th>
                <th className="px-5 py-3">예상가</th>
                <th className="px-5 py-3">일정</th>
                <th className="px-5 py-3">키워드</th>
                <th className="px-5 py-3 text-right">문의</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {categoryCounts.map((rule) => (
                <tr key={rule.category} className="hover:bg-white/[0.03]">
                  <td className="px-5 py-3 font-medium">{rule.label}</td>
                  <td className="px-5 py-3 text-primary">{rule.price}</td>
                  <td className="px-5 py-3 text-muted-foreground">{rule.days}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{rule.keywords}</td>
                  <td className="px-5 py-3 text-right">{rule.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">최근 자사몰 봇 문의</h3>
        </div>
        <div className="divide-y divide-white/10">
          {chatbotItems.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">표시할 봇 문의가 없습니다.</p>
          ) : (
            chatbotItems.slice(0, 8).map((item) => (
              <Link key={item.requestId} href="/admin/inbox" className="grid gap-3 px-5 py-4 text-sm hover:bg-white/[0.03] md:grid-cols-[1fr_120px_120px] md:items-center">
                <div>
                  <p className="font-medium">{item.customerName}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.rawText}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-3 text-primary" />
                  {item.category ?? "미분류"}
                </span>
                <span className="flex items-center justify-end gap-1.5 text-xs text-primary">
                  문의함
                  <ArrowRight className="size-3.5" />
                </span>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
