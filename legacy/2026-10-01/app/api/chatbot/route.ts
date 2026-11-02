import { NextResponse } from "next/server";
import { z } from "zod";
import { notifyTelegram } from "@/lib/admin/telegram";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

const chatbotSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email().max(255).optional().or(z.literal("")).default(""),
  phone: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(2).max(2000),
  locale: z.enum(["ko", "en"]).optional().default("ko"),
});

const CATEGORY_PRESETS = {
  website: { label: "홈페이지/랜딩페이지", price: "30만원부터", days: "3일 내외", keywords: ["홈페이지", "웹사이트", "랜딩", "사이트", "반응형"] },
  shop: { label: "쇼핑몰/카페24", price: "30만원부터", days: "3-5일", keywords: ["쇼핑몰", "카페24", "상품", "커머스", "스토어"] },
  logo: { label: "로고/명함", price: "3만원부터", days: "1-2일", keywords: ["로고", "명함", "브랜딩", "ci", "bi"] },
  detail: { label: "상세페이지", price: "12만원부터", days: "2-3일", keywords: ["상세페이지", "상세", "판매 이미지"] },
  ppt: { label: "PPT/제안서", price: "8만원부터", days: "1-2일", keywords: ["ppt", "피피티", "제안서", "ir", "사업계획서", "발표자료"] },
  automation: { label: "자동화/앱 MVP", price: "80만원부터", days: "5일 내외", keywords: ["자동화", "앱", "mvp", "크롤링", "대시보드", "api"] },
  video: { label: "영상 콘텐츠", price: "15만원부터", days: "2-3일", keywords: ["영상", "쇼츠", "릴스", "편집", "유튜브"] },
  other: { label: "맞춤 제작", price: "범위 확인 후 견적", days: "협의", keywords: [] },
} as const;

type Category = keyof typeof CATEGORY_PRESETS;

function detectCategory(message: string): Category {
  const text = message.toLowerCase();
  const entries = Object.entries(CATEGORY_PRESETS) as Array<[Category, (typeof CATEGORY_PRESETS)[Category]]>;
  return entries.find(([, preset]) => preset.keywords.some((keyword) => text.includes(keyword)))?.[0] ?? "other";
}

function buildReply(category: Category, saved: boolean): string {
  const preset = CATEGORY_PRESETS[category];
  const savedLine = saved ? "문의 내용은 담당자가 확인할 수 있도록 접수되었습니다." : "현재 저장 환경을 확인 중이라 상담 내용만 먼저 안내드립니다.";
  return [
    `${preset.label} 요청으로 확인됩니다.`,
    `예상 기준은 ${preset.price}, 일정은 ${preset.days}입니다.`,
    "정확한 금액은 작업 범위와 원본 자료 확인 후 확정됩니다.",
    savedLine,
    "성함과 연락처를 남겨주시면 빠르게 이어서 안내드리겠습니다.",
  ].join("\n");
}

export async function POST(request: Request) {
  const parsed = chatbotSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  const payload = parsed.data;
  const category = detectCategory(payload.message);
  let saved = false;
  let leadId: string | undefined;
  let quoteId: string | undefined;

  if (hasSupabaseAdminConfig()) {
    const supabase = createSupabaseAdminClient();
    const { data: lead, error: leadError } = await supabase
      .from("leads")
      .insert({
        channel: "website",
        customer_name: payload.name || "챗봇 고객",
        email: payload.email || null,
        phone: payload.phone || null,
        last_contact_at: new Date().toISOString(),
        source_meta: { source: "public_chatbot", locale: payload.locale },
        tags: ["chatbot"],
      })
      .select("id")
      .single<{ id: string }>();

    if (!leadError && lead) {
      leadId = lead.id;
      const { data: quote } = await supabase
        .from("quote_requests")
        .insert({
          lead_id: lead.id,
          channel: "website",
          raw_text: payload.message,
          category,
          customer_summary: `${payload.name || "챗봇 고객"} / ${CATEGORY_PRESETS[category].label}`,
          urgency: "normal",
          status: "new",
        })
        .select("id")
        .single<{ id: string }>();

      quoteId = quote?.id;
      const assistantReply = buildReply(category, true);
      await supabase.from("conversations").insert([
        {
          lead_id: lead.id,
          channel: "website",
          role: "customer",
          content: payload.message,
          metadata: { source: "public_chatbot", quote_id: quoteId },
        },
        {
          lead_id: lead.id,
          channel: "website",
          role: "assistant",
          content: assistantReply,
          metadata: { category, quote_id: quoteId },
        },
      ]);
      saved = true;
    }
  }

  const reply = buildReply(category, saved);

  await notifyTelegram(
    [
      "신규 AIO 챗봇 문의",
      `이름: ${payload.name || "미입력"}`,
      `연락: ${payload.email || "-"}${payload.phone ? ` / ${payload.phone}` : ""}`,
      `분류: ${CATEGORY_PRESETS[category].label}`,
      `내용: ${payload.message.slice(0, 500)}`,
      `관리자: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com"}/admin/inbox`,
    ].join("\n"),
  );

  return NextResponse.json({
    success: true,
    data: {
      saved,
      leadId,
      quoteId,
      category,
      reply,
    },
  });
}
