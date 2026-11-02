"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Check, Send } from "lucide-react";

type Props = {
  requestId: string;
  responseId?: string;
  currentStatus: string;
};

const ACTIONS = [
  { status: "sent", label: "발송 완료", icon: Send },
  { status: "contracted", label: "계약 전환", icon: Check },
  { status: "archived", label: "보관", icon: Archive },
] as const;

export function InboxStatusActions({ requestId, responseId, currentStatus }: Props) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(status: string) {
    setPendingStatus(status);
    setError(null);
    try {
      const res = await fetch("/api/admin/inbox", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, responseId, status }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        throw new Error(json.error ?? "상태 변경 실패");
      }
      router.refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "상태 변경 실패");
    } finally {
      setPendingStatus(null);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {ACTIONS.map((action) => {
          const Icon = action.icon;
          const disabled = pendingStatus !== null || currentStatus === action.status;
          return (
            <button
              key={action.status}
              type="button"
              disabled={disabled}
              onClick={() => updateStatus(action.status)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-foreground disabled:opacity-40"
            >
              <Icon className="size-3.5" />
              {pendingStatus === action.status ? "처리 중" : action.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
    </div>
  );
}
