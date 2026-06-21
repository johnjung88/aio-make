import Link from "next/link";
import { ArrowRight, BarChart3, Link2, Megaphone, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { getCommandCenterData } from "@/lib/admin/command-center";

export const metadata = {
  title: "마케팅 관리 | AIO 관리자",
};

export default async function MarketingPage() {
  const data = await getCommandCenterData();
  const marketing = data.marketing;
  const conversionRate = marketing.sessions30d > 0 ? ((marketing.conversions30d / marketing.sessions30d) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Marketing</p>
          <h2 className="mt-2 text-3xl font-semibold">마케팅 분석 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">캠페인, UTM 링크, 방문 세션, 문의 전환을 한 화면에서 확인합니다.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/analytics" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <BarChart3 className="size-4" />
            방문자 분석
          </Link>
          <Link href="/admin/marketing/links" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">
            <Link2 className="size-4" />
            UTM 링크
          </Link>
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "활성 캠페인", value: marketing.activeCampaigns.toLocaleString("ko-KR"), icon: Megaphone },
          { label: "활성 UTM", value: marketing.activeTrackingLinks.toLocaleString("ko-KR"), icon: Link2 },
          { label: "30일 세션", value: marketing.sessions30d.toLocaleString("ko-KR"), icon: Users },
          { label: "30일 이벤트", value: marketing.events30d.toLocaleString("ko-KR"), icon: MousePointerClick },
          { label: "문의 전환율", value: `${conversionRate}%`, icon: TrendingUp },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg border border-white/10 bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <Icon className="size-4 text-primary" />
              </div>
              <p className="mt-4 text-2xl font-semibold">{card.value}</p>
            </div>
          );
        })}
      </section>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-lg border border-white/10 bg-card">
          <div className="border-b border-white/10 px-5 py-4">
            <h3 className="text-sm font-semibold">상위 유입 소스</h3>
          </div>
          <div className="space-y-3 p-5">
            {marketing.topSources.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">UTM 유입 데이터가 없습니다.</p>
            ) : (
              marketing.topSources.map((source) => {
                const max = marketing.topSources[0]?.sessions ?? 1;
                return (
                  <div key={source.source} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{source.source}</span>
                      <span className="text-muted-foreground">{source.sessions}세션</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(4, Math.round((source.sessions / max) * 100))}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="rounded-lg border border-white/10 bg-card p-5">
          <h3 className="text-sm font-semibold">운영 액션</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              { href: "/admin/marketing/links/new", label: "새 UTM 링크 만들기", desc: "캠페인별 링크와 source/medium을 기록합니다." },
              { href: "/admin/analytics", label: "전환 이벤트 보기", desc: "CTA, 견적 제출, 페이지뷰 흐름을 확인합니다." },
              { href: "/admin/inbox", label: "마케팅 유입 문의 확인", desc: "문의 상태와 PM handoff를 정리합니다." },
              { href: "/admin/approvals", label: "tracking/live 승인대기", desc: "Pixel, paid, live 변경은 승인 전 HOLD입니다." },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06]">
                <span className="flex items-center justify-between gap-3 text-sm font-medium">
                  {action.label}
                  <ArrowRight className="size-4 text-primary" />
                </span>
                <span className="mt-2 block text-xs text-muted-foreground">{action.desc}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
