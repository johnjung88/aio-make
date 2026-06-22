"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, PauseCircle, XCircle } from "lucide-react";
import type { ApprovalItem } from "@/lib/admin/command-center";

type ApprovalDecision = "approved" | "rejected" | "on_hold";

const ACTIONS: Array<{
  status: ApprovalDecision;
  label: string;
  className: string;
  icon: typeof CheckCircle2;
}> = [
  { status: "approved", label: "확인 완료", icon: CheckCircle2, className: "border-primary/30 text-primary hover:bg-primary/10" },
  { status: "on_hold", label: "보류", icon: PauseCircle, className: "border-cyan-400/30 text-cyan-200 hover:bg-cyan-400/10" },
  { status: "rejected", label: "반려", icon: XCircle, className: "border-rose-400/30 text-rose-200 hover:bg-rose-400/10" },
];

export function ApprovalActions({ item }: { item: ApprovalItem }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busyStatus, setBusyStatus] = useState<ApprovalDecision | null>(null);
  const [isPending, startTransition] = useTransition();

  async function decide(status: ApprovalDecision) {
    setError(null);
    setBusyStatus(status);

    const body = item.source === "approval_requests"
      ? { id: item.id, status, decisionNote: note.trim() || undefined }
      : {
          sourceId: item.id,
          title: item.title,
          approvalType: item.type,
          status,
          priority: item.priority,
          requestedBy: item.requestedBy,
          targetType: item.targetType,
          targetId: item.targetId,
          summary: item.summary,
          dueAt: item.dueAt,
          decisionNote: note.trim() || undefined,
        };

    const res = await fetch("/api/admin/approvals", {
      method: item.source === "approval_requests" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const payload = await res.json().catch(() => ({}));
      setError(typeof payload.error === "string" ? payload.error : "처리하지 못했습니다.");
      setBusyStatus(null);
      return;
    }

    setNote("");
    setBusyStatus(null);
    startTransition(() => router.refresh());
  }

  if (item.status !== "pending") {
    return <p className="text-xs text-muted-foreground">처리 완료된 확인 기록입니다.</p>;
  }

  return (
    <div className="space-y-2">
      <input
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="결정 메모"
        className="h-8 w-full rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs outline-none focus:border-primary/60"
      />
      <div className="flex flex-wrap gap-1.5">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const busy = busyStatus === action.status || isPending;
          return (
            <button
              key={action.status}
              type="button"
              onClick={() => decide(action.status)}
              disabled={busy}
              className={`inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs transition disabled:cursor-wait disabled:opacity-60 ${action.className}`}
            >
              {busyStatus === action.status ? <Loader2 className="size-3 animate-spin" /> : <Icon className="size-3" />}
              {action.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}
