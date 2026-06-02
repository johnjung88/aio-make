import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CalendarClock, WalletCards, Users, Download } from "lucide-react";
import { getDashboardMetrics } from "@/lib/admin/data";

function formatWon(value: number): string {
  return `₩${value.toLocaleString("ko-KR")}`;
}

export default async function AdminDashboardPage() {
  const { metrics, recentItems, error } = await getDashboardMetrics();
  const cards = [
    { label: "전체 리드", value: metrics.totalLeads.toLocaleString("ko-KR"), icon: Users },
    { label: "진행 계약", value: metrics.activeProjects.toLocaleString("ko-KR"), icon: BriefcaseBusiness },
    { label: "7일 내 마감", value: metrics.dueSoon.toLocaleString("ko-KR"), icon: CalendarClock },
    { label: "미수금", value: formatWon(metrics.unpaidAmount), icon: WalletCards },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Today</p>
          <h2 className="mt-2 text-3xl font-semibold">AIO 의장님 대시보드</h2>
          <p className="mt-2 text-sm text-muted-foreground">계약 일정, 입금/미수, 고객 DB, 신규 문의 흐름을 한 화면에서 확인합니다.</p>
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
          <Link href="/admin/contracts" className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">
            계약 관리
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>

      {error && <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}

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

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-lg border border-white/10 bg-card">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h3 className="font-semibold">최근 문의</h3>
            <Link href="/admin/inbox" className="text-sm text-primary">
              전체 보기
            </Link>
          </div>
          <div className="divide-y divide-white/10">
            {recentItems.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground">아직 표시할 견적 요청이 없습니다.</p>
            ) : (
              recentItems.map((item) => (
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

        <div className="rounded-lg border border-white/10 bg-card p-5">
          <h3 className="font-semibold">관리 우선순위</h3>
          <div className="mt-5 space-y-3 text-sm">
            <Link href="/admin/contracts" className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10">
              <span>계약 마감일과 납품 상태 점검</span>
              <ArrowRight className="size-4 text-primary" />
            </Link>
            <Link href="/admin/contracts" className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10">
              <span>입금액과 미수금 업데이트</span>
              <ArrowRight className="size-4 text-primary" />
            </Link>
            <Link href="/admin/customers" className="flex items-center justify-between rounded-lg bg-white/5 px-4 py-3 transition hover:bg-white/10">
              <span>고객 태그·메모 정리</span>
              <ArrowRight className="size-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
