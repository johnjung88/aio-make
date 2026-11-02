import type React from "react";
import Link from "next/link";
import {
  BriefcaseBusiness, CalendarDays, CheckSquare, DollarSign, Image, Inbox,
  LayoutDashboard, Link2, LogOut, PieChart, Users, Download,
  Receipt, Bot, Settings, FileText, Megaphone, ShieldCheck, Wallet,
} from "lucide-react";
import { requireAdminSession } from "@/lib/admin-auth";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
  {
    title: "지휘센터",
    items: [
      { href: "/admin/calendar",  label: "일정 캘린더", icon: CalendarDays },
      { href: "/admin/approvals", label: "승인 센터", icon: ShieldCheck },
      { href: "/admin/work",      label: "업무 칸반", icon: CheckSquare },
    ],
  },
  {
    title: "영업 · 고객",
    items: [
      { href: "/admin/inbox",      label: "문의함",    icon: Inbox },
      { href: "/admin/quotes",     label: "견적서",    icon: FileText },
      { href: "/admin/customers",  label: "고객 DB",   icon: Users },
      { href: "/admin/contracts",  label: "계약 관리", icon: BriefcaseBusiness },
    ],
  },
  {
    title: "재무",
    items: [
      { href: "/admin/finance",   label: "종합 관리",   icon: Wallet },
      { href: "/admin/revenue",   label: "매출 관리",   icon: DollarSign },
      { href: "/admin/expenses",  label: "지출 관리",   icon: Receipt },
    ],
  },
  {
    title: "마케팅 · 분석",
    items: [
      { href: "/admin/marketing",        label: "마케팅 관리", icon: Megaphone },
      { href: "/admin/analytics",        label: "방문자 분석", icon: PieChart },
      { href: "/admin/marketing/links",  label: "UTM 링크",    icon: Link2 },
    ],
  },
  {
    title: "콘텐츠",
    items: [
      { href: "/admin/portfolios",  label: "포트폴리오",    icon: Image },
      { href: "/admin/team",        label: "팀 · 조직도",   icon: Users },
      { href: "/admin/services",    label: "서비스 · 가격", icon: Megaphone },
      { href: "/admin/magazine",    label: "매거진 · 홈",   icon: FileText },
    ],
  },
  {
    title: "시스템",
    items: [
      { href: "/admin/bot",       label: "봇 관리",   icon: Bot },
      { href: "/admin/settings",  label: "설정 · 점검", icon: Settings },
    ],
  },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-card/80 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase text-primary">AIO-MAKE</p>
            <h1 className="mt-1 text-lg font-semibold">ERP Command Center</h1>
          </div>

          {/* 대시보드 — 그룹 밖 단독 */}
          <div className="px-3 pt-4 pb-1">
            <Link href="/admin" className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm font-medium text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
              <LayoutDashboard className="size-4" />
              대시보드
            </Link>
          </div>

          {/* 5개 그룹 네비게이션 */}
          <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    if (item.disabled) {
                      return (
                        <span
                          key={item.href}
                          className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground/40 cursor-not-allowed"
                        >
                          <Icon className="size-4" />
                          {item.label}
                          <span className="ml-auto text-[10px]">soon</span>
                        </span>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex h-9 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                      >
                        <Icon className="size-4" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* 하단 고정: 엑셀 백업 · 로그아웃 */}
          <div className="border-t border-white/10 p-3 space-y-0.5">
            <a
              href="/api/admin/export"
              download
              className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              title="운영 데이터 엑셀 백업"
            >
              <Download className="size-4" />
              엑셀 백업
            </a>
            <form action="/api/admin/logout" method="post">
              <button className="flex h-9 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
                <LogOut className="size-4" />
                로그아웃
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-background/90 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-sm font-semibold">
              AIO 관리자
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/admin/inbox" className="rounded-lg border border-white/10 px-3 py-2 text-xs">
                문의함
              </Link>
              <Link href="/admin/approvals" className="rounded-lg border border-white/10 px-3 py-2 text-xs">
                승인
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
