import "server-only";

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

export type MonthlyRevenue = {
  month:   string;   // "YYYY-MM-DD" (해당 월 1일)
  revenue: number;
  expense: number;
  profit:  number;
};

export type ChannelRevenue = {
  channel:            string;
  leads:              number;
  projects:           number;
  contracted_amount:  number;
  paid_amount:        number;
  outstanding_amount: number;
  completed_projects: number;
};

export type CategoryRevenue = {
  category:           string;
  projects:           number;
  contracted_amount:  number;
  paid_amount:        number;
  outstanding_amount: number;
};

export type RevenueReport = {
  monthly:    MonthlyRevenue[];
  channels:   ChannelRevenue[];
  categories: CategoryRevenue[];
  kpi: {
    thisMonthRevenue:   number;
    thisMonthExpense:   number;
    thisMonthProfit:    number;
    totalOutstanding:   number;
    totalPaid:          number;
    avgContractAmount:  number;
  };
};

const EMPTY_KPI = {
  thisMonthRevenue:  0,
  thisMonthExpense:  0,
  thisMonthProfit:   0,
  totalOutstanding:  0,
  totalPaid:         0,
  avgContractAmount: 0,
};

export async function getRevenueReport(): Promise<(RevenueReport & { dbError?: string }) | null> {
  if (!hasSupabaseAdminConfig()) return null;

  const supabase = createSupabaseAdminClient();

  const [monthlyRes, channelRes, categoryRes] = await Promise.all([
    supabase.from("v_monthly_revenue").select("*").limit(24),
    supabase.from("v_channel_revenue").select("*"),
    supabase.from("v_category_revenue").select("*"),
  ]);

  // 뷰가 라이브 DB에 미적용되면 에러가 조용히 0으로 보이는 문제를 방지
  const dbError = monthlyRes.error?.message || channelRes.error?.message || categoryRes.error?.message;

  const monthly    = (monthlyRes.data  ?? []) as MonthlyRevenue[];
  const channels   = (channelRes.data  ?? []) as ChannelRevenue[];
  const categories = (categoryRes.data ?? []) as CategoryRevenue[];

  // KPI 계산 (이번 달 기준)
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const thisMonth = monthly.find((m) => m.month === thisMonthKey);

  const totalPaid        = channels.reduce((s, c) => s + (c.paid_amount ?? 0), 0);
  const totalOutstanding = channels.reduce((s, c) => s + (c.outstanding_amount ?? 0), 0);
  const totalProjects    = channels.reduce((s, c) => s + (c.projects ?? 0), 0);
  const totalContracted  = channels.reduce((s, c) => s + (c.contracted_amount ?? 0), 0);

  return {
    monthly,
    channels,
    categories,
    dbError,
    kpi: {
      thisMonthRevenue:  thisMonth?.revenue  ?? 0,
      thisMonthExpense:  thisMonth?.expense  ?? 0,
      thisMonthProfit:   thisMonth?.profit   ?? 0,
      totalOutstanding,
      totalPaid,
      avgContractAmount: totalProjects > 0 ? Math.round(totalContracted / totalProjects) : 0,
    },
  };
}

export function formatKRW(n: number): string {
  if (n >= 100_000_000) return `${(n / 100_000_000).toFixed(1)}억`;
  if (n >= 10_000)      return `${Math.round(n / 10_000).toLocaleString("ko-KR")}만`;
  return `${n.toLocaleString("ko-KR")}원`;
}

const CHANNEL_LABELS: Record<string, string> = {
  website:   "자사몰",
  soomgo:    "숨고",
  kmong:     "크몽",
  wishket:   "위시켓",
  elancer:   "이랜서",
  notefolio: "노트폴리오",
  instagram: "인스타",
  blog:      "블로그",
  youtube:   "유튜브",
  kakao:     "카카오",
  referral:  "소개",
  direct:    "다이렉트",
  other:     "기타",
};

export function channelLabel(ch: string): string {
  return CHANNEL_LABELS[ch] ?? ch;
}

const CATEGORY_LABELS: Record<string, string> = {
  website:    "웹사이트",
  shop:       "쇼핑몰",
  logo:       "로고·명함",
  detail:     "상세페이지",
  ppt:        "PPT 디자인",
  automation: "자동화·앱",
  video:      "영상",
  bundle:     "묶음",
  other:      "기타",
};

export function categoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat;
}

export { EMPTY_KPI };
