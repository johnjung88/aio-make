import type React from "react";
import Link from "next/link";
import { BarChart3, BriefcaseBusiness, DollarSign, Image, Inbox, LayoutDashboard, Link2, LogOut, PieChart, Users, Download, Receipt } from "lucide-react";
import { requireAdminSession } from "@/lib/admin-auth";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }>; disabled?: boolean };

const navItems: NavItem[] = [
  { href: "/admin",                       label: "대시보드",     icon: LayoutDashboard },
  { href: "/admin/contracts",             label: "계약 관리",    icon: BriefcaseBusiness },
  { href: "/admin/customers",             label: "고객 DB",      icon: Users },
  { href: "/admin/inbox",                 label: "문의함",       icon: Inbox },
  { href: "/admin/portfolios",            label: "포트폴리오",   icon: Image },
  { href: "/admin/marketing/links",       label: "UTM 링크",     icon: Link2 },
  { href: "/admin/analytics",             label: "방문자 분석",  icon: PieChart },
  { href: "/admin/kanban",                label: "업무 보드",    icon: BarChart3 },
  { href: "/admin/revenue",               label: "매출 리포트",  icon: DollarSign },
  { href: "/admin/expenses",              label: "지출 관리",    icon: Receipt },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminSession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-card/80 lg:block">
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 px-6 py-5">
            <p className="text-xs font-semibold uppercase text-primary">AIO-MAKE</p>
            <h1 className="mt-1 text-lg font-semibold">통합 관리자</h1>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <span
                    key={item.href}
                    className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground/50"
                  >
                    <Icon className="size-4" />
                    {item.label}
                    <span className="ml-auto text-[10px]">soon</span>
                  </span>
                );
              }

              return (
                <Link key={item.href} href={item.href} className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 p-3 space-y-1">
            <a
              href="/api/admin/export"
              download
              className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              title="운영 데이터 엑셀 백업"
            >
              <Download className="size-4" />
              엑셀 백업
            </a>
            <form action="/api/admin/logout" method="post">
              <button className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
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
              <Link href="/admin/contracts" className="rounded-lg border border-white/10 px-3 py-2 text-xs">
                계약
              </Link>
            </div>
          </div>
        </header>
        <main className="mx-auto min-h-screen w-full max-w-7xl px-5 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
