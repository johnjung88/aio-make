"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, Save, Search, Tags, Users } from "lucide-react";
import type { AdminCustomer } from "@/lib/admin/data";

function formatWon(value: number): string {
  return `₩${value.toLocaleString("ko-KR")}`;
}

function inputClassName() {
  return "h-10 rounded-lg border border-white/10 bg-background px-3 text-sm outline-none transition focus:border-primary";
}

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function CustomersManager({ customers }: { customers: AdminCustomer[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [channelFilter, setChannelFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [edits, setEdits] = useState<Record<string, { notes: string; tags: string }>>({});

  const channels = useMemo(() => Array.from(new Set(customers.map((customer) => customer.channel))).sort(), [customers]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers.filter((customer) => {
      const haystack = [
        customer.customerName,
        customer.companyName,
        customer.email,
        customer.phone,
        customer.channel,
        customer.latestCategory,
        customer.tags.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return (!needle || haystack.includes(needle)) && (channelFilter === "all" || customer.channel === channelFilter);
    });
  }, [channelFilter, customers, query]);

  const totals = useMemo(
    () =>
      customers.reduce(
        (acc, customer) => {
          if (customer.email) acc.email += 1;
          acc.projects += customer.projectCount;
          acc.revenue += customer.paidRevenue;
          return acc;
        },
        { email: 0, projects: 0, revenue: 0 },
      ),
    [customers],
  );

  function getEdit(customer: AdminCustomer) {
    return edits[customer.leadId] ?? { notes: customer.notes ?? "", tags: customer.tags.join(", ") };
  }

  async function saveCustomer(customer: AdminCustomer) {
    const edit = getEdit(customer);
    setMessage("");
    const response = await fetch("/api/admin/customers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leadId: customer.leadId,
        notes: edit.notes,
        tags: parseTags(edit.tags),
      }),
    });
    const json = (await response.json()) as { success: boolean; error?: string };
    if (!response.ok || !json.success) {
      setMessage(json.error ?? "고객 정보를 저장하지 못했습니다.");
      return;
    }
    setMessage("고객 메모가 저장되었습니다.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard icon={Users} label="전체 고객 DB" value={`${customers.length.toLocaleString("ko-KR")}명`} />
        <MetricCard icon={Mail} label="이메일 보유" value={`${totals.email.toLocaleString("ko-KR")}명`} />
        <MetricCard icon={Tags} label="계약 이력" value={`${totals.projects.toLocaleString("ko-KR")}건`} />
        <MetricCard icon={Save} label="입금 매출" value={formatWon(totals.revenue)} />
      </section>

      {message && <p className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-muted-foreground">{message}</p>}

      <section className="rounded-lg border border-white/10 bg-card">
        <div className="flex flex-col gap-3 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-semibold">고객 DB</h3>
            <p className="mt-1 text-sm text-muted-foreground">문의·계약 고객을 모아 태그, 메모, 재접촉 대상으로 관리합니다.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-background px-3">
              <Search className="size-4 text-muted-foreground" />
              <input className="w-56 bg-transparent text-sm outline-none" placeholder="이름, 이메일, 태그 검색" value={query} onChange={(event) => setQuery(event.target.value)} />
            </label>
            <select className={inputClassName()} value={channelFilter} onChange={(event) => setChannelFilter(event.target.value)}>
              <option value="all">전체 채널</option>
              {channels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 p-5 xl:grid-cols-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">표시할 고객이 없습니다.</p>
          ) : (
            filtered.map((customer) => {
              const edit = getEdit(customer);
              return (
                <article key={customer.leadId} className="rounded-lg border border-white/10 bg-background p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold">{customer.customerName}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {customer.companyName ? `${customer.companyName} / ` : ""}
                        {customer.channel}
                        {customer.latestCategory ? ` / ${customer.latestCategory}` : ""}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 px-2 py-1 text-xs text-muted-foreground">
                      문의 {customer.quoteCount} / 계약 {customer.projectCount}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <p className="flex min-h-10 items-center gap-2 rounded-lg bg-white/5 px-3">
                      <Mail className="size-4 text-primary" />
                      {customer.email ?? "이메일 없음"}
                    </p>
                    <p className="flex min-h-10 items-center gap-2 rounded-lg bg-white/5 px-3">
                      <Phone className="size-4 text-primary" />
                      {customer.phone ?? "전화번호 없음"}
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                    <input
                      className={inputClassName()}
                      placeholder="태그: ppt, 재문의, 뉴스레터"
                      value={edit.tags}
                      onChange={(event) =>
                        setEdits({
                          ...edits,
                          [customer.leadId]: { ...edit, tags: event.target.value },
                        })
                      }
                    />
                    <button className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60" disabled={isPending} onClick={() => saveCustomer(customer)}>
                      저장
                    </button>
                  </div>
                  <textarea
                    className="mt-3 min-h-24 w-full rounded-lg border border-white/10 bg-card px-3 py-2 text-sm outline-none transition focus:border-primary"
                    placeholder="고객 메모, 재접촉 시점, 마케팅 동의 여부 등"
                    value={edit.notes}
                    onChange={(event) =>
                      setEdits({
                        ...edits,
                        [customer.leadId]: { ...edit, notes: event.target.value },
                      })
                    }
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>매출 {formatWon(customer.paidRevenue)}</span>
                    <span>최근 접촉 {customer.lastContactAt ? customer.lastContactAt.slice(0, 10) : customer.createdAt.slice(0, 10)}</span>
                    {customer.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-white/5 px-2 py-1">
                        {tag}
                      </span>
                    ))}
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

function MetricCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-4 text-2xl font-semibold">{value}</p>
    </div>
  );
}
