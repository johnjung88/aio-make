"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Search } from "lucide-react";
import type { InboxItem } from "@/lib/admin/data";
import { InboxStatusActions } from "@/components/admin/inbox-status-actions";

const STATUS_LABELS: Record<string, string> = {
  new: "신규",
  draft: "초안",
  sent: "발송 완료",
  viewed: "열람",
  replied: "답변",
  matched: "매칭",
  contracted: "계약",
  rejected: "거절",
  archived: "보관",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function InboxFilter({ items }: { items: InboxItem[] }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = items.filter((item) => {
    const matchStatus = statusFilter === "all" || item.status === statusFilter;
    if (!matchStatus) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.customerName.toLowerCase().includes(q) ||
      (item.companyName ?? "").toLowerCase().includes(q) ||
      (item.email ?? "").toLowerCase().includes(q) ||
      item.rawText.toLowerCase().includes(q) ||
      (item.category ?? "").toLowerCase().includes(q) ||
      item.channel.toLowerCase().includes(q)
    );
  });

  const statuses = Array.from(new Set(items.map((i) => i.status)));

  return (
    <div className="space-y-4">
      {/* 검색 + 필터 바 */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="고객명·이메일·내용 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm placeholder:text-muted-foreground/50 outline-none focus:border-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border border-white/10 bg-[#0a0a0a] px-3 text-sm text-muted-foreground"
        >
          <option value="all">전체 상태 ({items.length})</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s] ?? s} ({items.filter((i) => i.status === s).length})</option>
          ))}
        </select>
      </div>

      {/* 목록 */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-card px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      ) : (
        filtered.map((item) => (
          <article key={item.requestId} className="rounded-lg border border-white/10 bg-card p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">{item.channel}</span>
                  <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">
                    {STATUS_LABELS[item.status] ?? item.status}
                  </span>
                  {item.category && <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">{item.category}</span>}
                  <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                </div>

                <h3 className="mt-4 text-lg font-semibold">{item.customerName}</h3>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {item.companyName && <span>{item.companyName}</span>}
                  {item.email && <span>{item.email}</span>}
                  {item.phone && <span>{item.phone}</span>}
                  {item.deadlineText && <span>일정: {item.deadlineText}</span>}
                </div>

                {(item.serviceKey || item.assignedPmQueue || item.entryPath) && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {item.serviceKey && <span className="rounded-full bg-white/5 px-2 py-1 text-muted-foreground">service: {item.serviceKey}</span>}
                    {item.assignedPmQueue && <span className="rounded-full bg-white/5 px-2 py-1 text-muted-foreground">PM: {item.assignedPmQueue}</span>}
                    {item.handoffStatus && <span className="rounded-full bg-white/5 px-2 py-1 text-muted-foreground">handoff: {item.handoffStatus}</span>}
                    {item.notificationStatus && <span className="rounded-full bg-white/5 px-2 py-1 text-muted-foreground">notify: {item.notificationStatus}</span>}
                    {item.entryPath && <span className="rounded-full bg-white/5 px-2 py-1 text-muted-foreground">entry: {item.entryPath}</span>}
                  </div>
                )}
                {item.handoffReason && <p className="mt-2 text-xs text-muted-foreground">인계 사유: {item.handoffReason}</p>}

                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-white/5 p-4 text-sm leading-6 text-muted-foreground">{item.rawText}</p>

                {item.responseText && (
                  <details className="mt-4 rounded-lg border border-white/10 bg-white/[0.03]">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium">응답 초안 보기</summary>
                    <pre className="whitespace-pre-wrap border-t border-white/10 p-4 text-sm leading-6 text-muted-foreground">{item.responseText}</pre>
                  </details>
                )}
              </div>

              <div className="w-full shrink-0 lg:w-72">
                <div className="space-y-3">
                  <Link
                    href={`/admin/quotes/new?requestId=${encodeURIComponent(item.requestId)}`}
                    className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-85"
                  >
                    <FileText className="size-3.5" />
                    견적서 만들기
                  </Link>
                  <InboxStatusActions requestId={item.requestId} responseId={item.responseId} currentStatus={item.status} />
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </div>
  );
}
