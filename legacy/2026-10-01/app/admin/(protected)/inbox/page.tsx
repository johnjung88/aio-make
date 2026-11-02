import { getInboxItems, getAdaInquiriesCount } from "@/lib/admin/data";
import { AlertTriangle } from "lucide-react";
import { InboxFilter } from "@/components/admin/inbox-filter";


export default async function AdminInboxPage() {
  const [{ items, error }, adaCount] = await Promise.all([
    getInboxItems(),
    getAdaInquiriesCount(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Unified Inbox</p>
        <h2 className="mt-2 text-3xl font-semibold">통합 인박스</h2>
        <p className="mt-2 text-sm text-muted-foreground">자사몰 견적 요청, 챗봇 유입, 상담/견적 진행 상태를 한 곳에서 관리합니다.</p>
      </div>

      {adaCount > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-orange-400" />
          <p>
            <strong>미연동 문의 {adaCount}건</strong> — 폼 저장 실패 시 임시 보관된 문의입니다.
            Supabase에서 <code className="rounded bg-white/10 px-1">ada_inquiries</code> 테이블을 직접 확인하세요.
          </p>
        </div>
      )}

      {error && <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">{error}</p>}

      {items.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-card px-5 py-12 text-center">
          <p className="text-sm text-muted-foreground">아직 인박스 항목이 없습니다.</p>
        </div>
      ) : (
        <InboxFilter items={items} />
      )}
    </div>
  );
}
