import { InboxStatusActions } from "@/components/admin/inbox-status-actions";
import { getInboxItems } from "@/lib/admin/data";

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

export default async function AdminInboxPage() {
  const { items, error } = await getInboxItems();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Unified Inbox</p>
        <h2 className="mt-2 text-3xl font-semibold">통합 인박스</h2>
        <p className="mt-2 text-sm text-muted-foreground">사이트 견적 요청과 외부 플랫폼 응답 초안을 한 곳에서 관리합니다.</p>
      </div>

      {error && <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-card px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">아직 인박스 항목이 없습니다.</p>
          </div>
        ) : (
          items.map((item) => (
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
                  <InboxStatusActions requestId={item.requestId} responseId={item.responseId} currentStatus={item.status} />
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
