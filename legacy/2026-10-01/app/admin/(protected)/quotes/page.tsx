import Link from "next/link";
import { FileText, Inbox, Plus } from "lucide-react";
import { getInboxItems } from "@/lib/admin/data";

export const metadata = {
  title: "견적서 관리 | AIO 관리자",
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminQuotesPage() {
  const { items, error } = await getInboxItems(30);

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Quotes</p>
          <h2 className="mt-2 text-3xl font-semibold">견적서 관리</h2>
          <p className="mt-2 text-sm text-muted-foreground">문의 고객 정보를 불러와 견적서를 만들고 PDF로 출력합니다.</p>
        </div>
        <Link href="/admin/quotes/new" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">
          <Plus className="size-4" />
          빈 견적서 작성
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {error}
        </p>
      )}

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <Inbox className="size-4 text-primary" />
          <h3 className="text-sm font-semibold">최근 문의에서 견적서 만들기</h3>
        </div>
        <div className="divide-y divide-white/10">
          {items.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="text-sm text-muted-foreground">불러올 문의가 없습니다. 빈 견적서로 작성할 수 있습니다.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.requestId} className="grid gap-3 px-5 py-4 text-sm md:grid-cols-[1fr_120px_130px] md:items-center">
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.customerName} {item.companyName ? `· ${item.companyName}` : ""}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.rawText}</p>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
                <Link
                  href={`/admin/quotes/new?requestId=${encodeURIComponent(item.requestId)}`}
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground"
                >
                  <FileText className="size-3.5" />
                  견적서
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
