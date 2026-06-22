import Link from "next/link";
import { AlertTriangle, CheckCircle2, PauseCircle, ShieldCheck, XCircle } from "lucide-react";
import { getCommandCenterData, type ApprovalItem } from "@/lib/admin/command-center";
import { ApprovalActions } from "@/components/admin/approval-actions";

export const metadata = {
  title: "승인 센터 | AIO 관리자",
};

const TYPE_LABELS: Record<ApprovalItem["type"], string> = {
  customer_message: "고객 발송",
  price_due_date: "가격·납기",
  contract_payment: "계약·결제",
  refund_settlement: "환불·정산",
  portfolio_publish: "포트폴리오 공개",
  tracking_live: "추적·라이브",
  risk_escalation: "위험 보고",
};

const STATUS_META = {
  pending: { label: "대기", icon: ShieldCheck, className: "border-amber-400/20 bg-amber-400/10 text-amber-200" },
  approved: { label: "승인", icon: CheckCircle2, className: "border-primary/20 bg-primary/10 text-primary" },
  rejected: { label: "반려", icon: XCircle, className: "border-rose-400/20 bg-rose-400/10 text-rose-200" },
  on_hold: { label: "보류", icon: PauseCircle, className: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200" },
};

export default async function ApprovalsPage() {
  const data = await getCommandCenterData();
  const pending = data.approvals.filter((item) => item.status === "pending");

  return (
    <div className="space-y-7">
      <div>
        <p className="text-xs font-medium uppercase text-primary">Approval Center</p>
        <h2 className="mt-2 text-3xl font-semibold">승인 센터</h2>
        <p className="mt-2 text-sm text-muted-foreground">고객 발송, 가격·납기, 계약·정산, 포트폴리오 공개, tracking/live 변경을 승인·보류·반려로 기록합니다.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["승인대기", pending.length],
          ["P0", pending.filter((item) => item.priority === "P0").length],
          ["가상 게이트", data.approvals.filter((item) => item.source === "virtual_gate").length],
          ["실테이블", data.approvals.filter((item) => item.source === "approval_requests").length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {data.warnings.length > 0 && (
        <div className="flex gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <p>{data.warnings[0]}</p>
        </div>
      )}

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="text-sm font-semibold">승인대기 큐</h3>
        </div>
        <div className="divide-y divide-white/10">
          {data.approvals.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">승인대기 항목이 없습니다.</p>
          ) : (
            data.approvals.map((item) => {
              const status = STATUS_META[item.status];
              const Icon = status.icon;
              return (
                <div key={item.id} className="grid gap-3 px-5 py-4 text-sm xl:grid-cols-[90px_110px_1fr_120px_105px_230px] xl:items-center">
                  <span className={`w-fit rounded-full border px-2 py-1 text-xs ${item.priority === "P0" ? "border-rose-400/30 bg-rose-400/10 text-rose-200" : "border-white/10 text-muted-foreground"}`}>
                    {item.priority}
                  </span>
                  <span className="text-xs text-muted-foreground">{TYPE_LABELS[item.type]}</span>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    {item.summary && <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{item.summary}</p>}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.requestedBy}</span>
                  <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2 py-1 text-xs ${status.className}`}>
                    <Icon className="size-3" />
                    {status.label}
                  </span>
                  <ApprovalActions item={item} />
                </div>
              );
            })
          )}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-card p-5">
        <h3 className="text-sm font-semibold">승인 전 실행 금지선</h3>
        <div className="mt-4 grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-3">
          {["고객-facing 최종 발송", "가격·납기·계약 확정", "결제·환불·정산 실행", "포트폴리오 공개", "tracking/pixel/live 변경", "domain/security/token 변경"].map((item) => (
            <div key={item} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-muted-foreground">
              {item}
            </div>
          ))}
        </div>
        <Link href="/admin" className="mt-4 inline-flex text-sm text-primary">대시보드로 돌아가기</Link>
      </section>
    </div>
  );
}
