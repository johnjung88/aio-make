"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Check, CircleDollarSign, Plus, Search, WalletCards } from "lucide-react";
import type { AdminContract } from "@/lib/admin/data";

const CHANNELS = [
  ["website", "웹사이트"],
  ["soomgo", "숨고"],
  ["kmong", "크몽"],
  ["wishket", "위시켓"],
  ["elancer", "이랜서"],
  ["notefolio", "노트폴리오"],
  ["upwork", "Upwork"],
  ["contra", "Contra"],
  ["cafe24", "카페24"],
  ["referral", "소개"],
  ["other", "기타"],
] as const;

const CATEGORIES = [
  ["website", "홈페이지"],
  ["shop", "쇼핑몰"],
  ["logo", "로고/명함"],
  ["detail", "상세페이지"],
  ["ppt", "PPT"],
  ["automation", "자동화"],
  ["video", "영상"],
  ["bundle", "패키지"],
  ["other", "기타"],
] as const;

const PROJECT_STATUSES = [
  ["in_progress", "진행중"],
  ["review", "검수"],
  ["blocked", "보류"],
  ["completed", "납품 완료"],
  ["canceled", "취소"],
] as const;

const PAYMENT_LABELS: Record<string, string> = {
  unpaid: "미수",
  partial: "부분 입금",
  paid: "입금 완료",
  canceled: "취소",
};

const PROJECT_LABELS: Record<string, string> = Object.fromEntries(PROJECT_STATUSES);

type FormState = {
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  channel: string;
  category: string;
  productName: string;
  contractedAmount: string;
  paidAmount: string;
  startDate: string;
  dueDate: string;
  notes: string;
};

const emptyForm: FormState = {
  customerName: "",
  companyName: "",
  email: "",
  phone: "",
  channel: "soomgo",
  category: "ppt",
  productName: "",
  contractedAmount: "",
  paidAmount: "0",
  startDate: new Date().toISOString().slice(0, 10),
  dueDate: "",
  notes: "",
};

function formatWon(value: number): string {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function inputClassName() {
  return "h-10 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none transition focus:border-primary";
}

function toNumber(value: string): number {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function ContractsManager({ contracts }: { contracts: AdminContract[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [paidEdits, setPaidEdits] = useState<Record<string, string>>({});
  const [dueEdits, setDueEdits] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return contracts.filter((contract) => {
      const haystack = [contract.customerName, contract.companyName, contract.email, contract.productName, contract.channel]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const queryMatched = !needle || haystack.includes(needle);
      const statusMatched =
        statusFilter === "all" || contract.projectStatus === statusFilter || contract.paymentStatus === statusFilter;
      return queryMatched && statusMatched;
    });
  }, [contracts, query, statusFilter]);

  const totals = useMemo(
    () =>
      contracts.reduce(
        (acc, contract) => {
          const canceled = contract.projectStatus === "canceled" || contract.paymentStatus === "canceled";
          if (!canceled) {
            acc.amount += contract.contractedAmount;
            acc.paid += contract.paidAmount;
            acc.unpaid += contract.outstandingAmount;
          }
          if (contract.projectStatus !== "completed" && !canceled) acc.active += 1;
          return acc;
        },
        { amount: 0, paid: 0, unpaid: 0, active: 0 },
      ),
    [contracts],
  );

  async function createContract(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/admin/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        contractedAmount: toNumber(form.contractedAmount),
        paidAmount: toNumber(form.paidAmount),
      }),
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    if (!response.ok || !json.success) {
      setMessage(json.error ?? "계약 저장에 실패했습니다.");
      return;
    }
    setForm(emptyForm);
    setMessage("계약이 추가되었습니다.");
    startTransition(() => router.refresh());
  }

  async function updateContract(contract: AdminContract, updates: { status?: string; paidAmount?: number; dueDate?: string }) {
    setMessage("");
    const response = await fetch("/api/admin/contracts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId: contract.projectId,
        invoiceId: contract.invoiceId,
        ...updates,
      }),
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    if (!response.ok || !json.success) {
      setMessage(json.error ?? "계약 업데이트에 실패했습니다.");
      return;
    }
    setMessage("변경사항이 저장되었습니다.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={WalletCards} label="계약 총액" value={formatWon(totals.amount)} />
        <MetricCard icon={CircleDollarSign} label="입금 합계" value={formatWon(totals.paid)} />
        <MetricCard icon={CalendarClock} label="미수금" value={formatWon(totals.unpaid)} tone="danger" />
        <MetricCard icon={Check} label="진행 계약" value={`${totals.active.toLocaleString("ko-KR")}건`} />
      </section>

      <form onSubmit={createContract} className="rounded-lg border border-white/10 bg-card p-5">
        <div className="flex items-center gap-2">
          <Plus className="size-4 text-primary" />
          <h3 className="font-semibold">외주 계약 추가</h3>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <input className={inputClassName()} required placeholder="고객명" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} />
          <input className={inputClassName()} placeholder="회사명" value={form.companyName} onChange={(event) => setForm({ ...form, companyName: event.target.value })} />
          <input className={inputClassName()} type="email" placeholder="이메일" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          <input className={inputClassName()} placeholder="전화번호" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <select className={inputClassName()} value={form.channel} onChange={(event) => setForm({ ...form, channel: event.target.value })}>
            {CHANNELS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select className={inputClassName()} value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>
            {CATEGORIES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input className={inputClassName()} required placeholder="계약명 / 납품물" value={form.productName} onChange={(event) => setForm({ ...form, productName: event.target.value })} />
          <input className={inputClassName()} inputMode="numeric" required placeholder="계약금액" value={form.contractedAmount} onChange={(event) => setForm({ ...form, contractedAmount: event.target.value })} />
          <input className={inputClassName()} inputMode="numeric" placeholder="입금액" value={form.paidAmount} onChange={(event) => setForm({ ...form, paidAmount: event.target.value })} />
          <input className={inputClassName()} type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} />
          <input className={inputClassName()} type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} />
          <button className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60" disabled={isPending}>
            계약 저장
          </button>
        </div>
        <textarea className="mt-3 min-h-20 w-full rounded-lg border border-white/10 bg-background px-3 py-2 text-sm outline-none transition focus:border-primary" placeholder="계약/납품 메모" value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} />
      </form>

      {message && <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">{message}</p>}

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">계약 리스트</h3>
            <p className="mt-1 text-sm text-muted-foreground">채널별 계약, 마감일, 입금/미수 상태를 관리합니다.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-background px-3">
              <Search className="size-4 text-muted-foreground" />
              <input className="w-56 bg-transparent text-sm outline-none" placeholder="고객, 계약명 검색" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <select className={inputClassName()} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">전체 상태</option>
              {PROJECT_STATUSES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
              <option value="unpaid">미수</option>
              <option value="partial">부분 입금</option>
              <option value="paid">입금 완료</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-white/10">
          {filtered.length === 0 ? (
            <p className="p-8 text-sm text-muted-foreground">표시할 계약이 없습니다.</p>
          ) : (
            filtered.map((contract) => {
              const paidValue = paidEdits[contract.projectId] ?? String(contract.paidAmount);
              const dueValue = dueEdits[contract.projectId] ?? contract.dueDate ?? "";
              return (
                <article key={contract.projectId} className="grid gap-4 p-5 xl:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-semibold">{contract.productName}</h4>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">{contract.channel}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">{PROJECT_LABELS[contract.projectStatus] ?? contract.projectStatus}</span>
                      <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">{PAYMENT_LABELS[contract.paymentStatus] ?? contract.paymentStatus}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {contract.customerName}
                      {contract.companyName ? ` / ${contract.companyName}` : ""}
                      {contract.email ? ` / ${contract.email}` : ""}
                      {contract.phone ? ` / ${contract.phone}` : ""}
                    </p>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <p className="rounded-lg bg-white/5 px-3 py-2">계약 {formatWon(contract.contractedAmount)}</p>
                      <p className="rounded-lg bg-white/5 px-3 py-2">입금 {formatWon(contract.paidAmount)}</p>
                      <p className="rounded-lg bg-white/5 px-3 py-2 text-amber-200">미수 {formatWon(contract.outstandingAmount)}</p>
                    </div>
                    {contract.notes && <p className="mt-3 text-sm text-muted-foreground">{contract.notes}</p>}
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                    <select className={inputClassName()} defaultValue={contract.projectStatus} onChange={(event) => updateContract(contract, { status: event.target.value })}>
                      {PROJECT_STATUSES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <input className={`${inputClassName()} min-w-0 flex-1`} type="date" value={dueValue} onChange={(event) => setDueEdits({ ...dueEdits, [contract.projectId]: event.target.value })} />
                      <button className="h-10 rounded-lg border border-white/10 px-3 text-sm" onClick={() => updateContract(contract, { dueDate: dueValue })}>
                        일정
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input className={`${inputClassName()} min-w-0 flex-1`} inputMode="numeric" value={paidValue} onChange={(event) => setPaidEdits({ ...paidEdits, [contract.projectId]: event.target.value })} />
                      <button className="h-10 rounded-lg border border-white/10 px-3 text-sm" onClick={() => updateContract(contract, { paidAmount: toNumber(paidValue) })}>
                        입금
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, tone }: { icon: typeof WalletCards; label: string; value: string; tone?: "danger" }) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className={tone === "danger" ? "size-4 text-amber-300" : "size-4 text-primary"} />
      </div>
      <p className="mt-4 text-2xl font-semibold">{value}</p>
    </div>
  );
}
