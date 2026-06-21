import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckSquare,
  Download,
  Inbox,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { getCommandCenterData } from "@/lib/admin/command-center";

function formatWon(value: number): string {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export default async function AdminDashboardPage() {
  const data = await getCommandCenterData();
  const { metrics } = data;
  const cards = [
    { label: "오늘 신규 문의", value: metrics.todayNewInquiries.toLocaleString("ko-KR"), icon: Inbox },
    { label: "승인대기", value: metrics.pendingApprovals.toLocaleString("ko-KR"), icon: ShieldCheck },
    { label: "오늘 일정", value: metrics.todaySchedule.toLocaleString("ko-KR"), icon: CalendarClock },
    { label: "진행 프로젝트", value: metrics.activeProjects.toLocaleString("ko-KR"), icon: BriefcaseBusiness },
    { label: "Blocked", value: metrics.blockedWork.toLocaleString("ko-KR"), icon: AlertTriangle },
    { label: "미수금", value: formatWon(metrics.unpaidAmount), icon: WalletCards },
    { label: "이번 달 순익", value: formatWon(metrics.netThisMonth), icon: TrendingUp },
    { label: "PM 업무", value: data.workItems.length.toLocaleString("ko-KR"), icon: CheckSquare },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">CEO Snapshot</p>
          <h2 className="mt-2 text-3xl font-semibold">AIO Admin ERP Command Center</h2>
          <p className="mt-2 text-sm text-muted-foreground">일정, 매출, 문의, 마케팅, 승인대기, PM 진행을 매일 한 화면에서 확인합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/api/admin/export"
            download
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
            title="운영 데이터 엑셀 백업 다운로드"
          >
            <Download className="size-4" />
            엑셀 백업
          </a>
          <Link href="/admin/approvals" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
            승인 센터
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {[...data.warnings, ...data.errors].slice(0, 2).map((message) => (
        <p key={message} className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{message}</p>
      ))}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
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

      <section className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-lg border border-white/10 bg-card">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="font-semibold">최근 문의 · 상담 큐</h3>
            <Link href="/admin/inbox" className="text-sm text-primary">
              전체 보기
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {data.recentInquiries.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">아직 표시할 견적 요청이 없습니다.</p>
            ) : (
              data.recentInquiries.slice(0, 6).map((item) => (
                <Link key={item.requestId} href="/admin/inbox" className="block px-5 py-4 transition hover:bg-white/[0.03]">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">{item.customerName}</p>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">{item.channel}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.rawText}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-card">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="font-semibold">승인대기 · 위험</h3>
            <Link href="/admin/approvals" className="text-sm text-primary">
              승인 센터
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {data.approvals.length === 0 && data.risks.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">대기 중인 승인/위험 항목이 없습니다.</p>
            ) : (
              <>
                {data.approvals.slice(0, 4).map((item) => (
                  <Link key={item.id} href="/admin/approvals" className="block px-5 py-4 transition hover:bg-white/[0.03]">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium">{item.title}</p>
                      <span className={`rounded-full px-2 py-1 text-xs ${item.priority === "P0" ? "bg-rose-400/15 text-rose-200" : "border border-white/10 text-muted-foreground"}`}>{item.priority}</span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{item.summary ?? item.requestedBy}</p>
                  </Link>
                ))}
                {data.risks.slice(0, 3).map((risk) => (
                  <Link key={risk.id} href={risk.href} className="block px-5 py-4 transition hover:bg-white/[0.03]">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium">{risk.title}</p>
                      <span className="rounded-full bg-amber-400/10 px-2 py-1 text-xs text-amber-200">{risk.severity}</span>
                    </div>
                    <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{risk.reason}</p>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">다가오는 일정</h3>
            <Link href="/admin/calendar" className="text-sm text-primary">캘린더</Link>
          </div>
          <div className="mt-4 space-y-2">
            {data.calendarEvents.slice(0, 5).map((event) => (
              <Link key={event.id} href={event.href} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06]">
                <span className="line-clamp-1">{event.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{event.date}</span>
              </Link>
            ))}
            {data.calendarEvents.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">일정 없음</p>}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">PM 진행</h3>
            <Link href="/admin/work" className="text-sm text-primary">업무 현황</Link>
          </div>
          <div className="mt-4 space-y-2">
            {data.workItems.slice(0, 5).map((item) => (
              <Link key={item.id} href={item.href} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06]">
                <span className="line-clamp-1">{item.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{item.priority}</span>
              </Link>
            ))}
            {data.workItems.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">업무 없음</p>}
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-card p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">마케팅 성과</h3>
            <Link href="/admin/marketing" className="text-sm text-primary">마케팅</Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-white/[0.03] p-3">
              <p className="text-xs text-muted-foreground">30일 세션</p>
              <p className="mt-2 text-xl font-semibold">{metrics.sessions30d.toLocaleString("ko-KR")}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-3">
              <p className="text-xs text-muted-foreground">문의 전환</p>
              <p className="mt-2 text-xl font-semibold">{metrics.conversions30d.toLocaleString("ko-KR")}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-3">
              <p className="text-xs text-muted-foreground">캠페인</p>
              <p className="mt-2 text-xl font-semibold">{data.marketing.activeCampaigns.toLocaleString("ko-KR")}</p>
            </div>
            <div className="rounded-lg bg-white/[0.03] p-3">
              <p className="text-xs text-muted-foreground">UTM</p>
              <p className="mt-2 text-xl font-semibold">{data.marketing.activeTrackingLinks.toLocaleString("ko-KR")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
