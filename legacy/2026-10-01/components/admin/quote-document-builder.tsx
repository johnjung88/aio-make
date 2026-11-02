"use client";

import { useMemo, useState } from "react";
import { FileText, Plus, Printer, Trash2 } from "lucide-react";

type QuoteLine = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type QuoteDocumentInitial = {
  quoteNo: string;
  issueDate: string;
  validUntil: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  projectTitle: string;
  category: string;
  requestSummary: string;
  lines: QuoteLine[];
};

function krw(value: number): string {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function makeLine(): QuoteLine {
  return {
    id: globalThis.crypto?.randomUUID?.() ?? `line-${Date.now()}-${Math.random()}`,
    name: "서비스 항목",
    description: "작업 범위와 납품물을 입력하세요.",
    quantity: 1,
    unitPrice: 100000,
  };
}

export function QuoteDocumentBuilder({ initial }: { initial: QuoteDocumentInitial }) {
  const [quoteNo, setQuoteNo] = useState(initial.quoteNo);
  const [issueDate, setIssueDate] = useState(initial.issueDate);
  const [validUntil, setValidUntil] = useState(initial.validUntil);
  const [customerName, setCustomerName] = useState(initial.customerName);
  const [companyName, setCompanyName] = useState(initial.companyName);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [projectTitle, setProjectTitle] = useState(initial.projectTitle);
  const [category, setCategory] = useState(initial.category);
  const [requestSummary, setRequestSummary] = useState(initial.requestSummary);
  const [delivery, setDelivery] = useState("범위 확정 및 입금 후 5영업일 내 1차 납품");
  const [paymentTerms, setPaymentTerms] = useState("착수금 50% / 완료 후 잔금 50%");
  const [memo, setMemo] = useState("최종 가격, 납기, 고객 발송은 의장님 승인 후 확정합니다.");
  const [vatEnabled, setVatEnabled] = useState(true);
  const [lines, setLines] = useState<QuoteLine[]>(initial.lines.length > 0 ? initial.lines : [makeLine()]);

  const subtotal = useMemo(
    () => lines.reduce((sum, line) => sum + Math.max(0, line.quantity) * Math.max(0, line.unitPrice), 0),
    [lines],
  );
  const vat = vatEnabled ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + vat;

  function updateLine(id: string, updates: Partial<QuoteLine>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...updates } : line)));
  }

  function removeLine(id: string) {
    setLines((current) => (current.length > 1 ? current.filter((line) => line.id !== id) : current));
  }

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .quote-print-area, .quote-print-area * { visibility: visible !important; }
          .quote-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: #111827 !important;
            padding: 24px !important;
          }
          .quote-no-print { display: none !important; }
          @page { size: A4; margin: 16mm; }
        }
      `}</style>

      <div className="quote-no-print grid gap-4 lg:grid-cols-[1fr_360px]">
        <section className="rounded-lg border border-white/10 bg-card p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase text-primary">Quote Builder</p>
              <h3 className="mt-1 text-lg font-semibold">견적서 입력</h3>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground hover:opacity-85"
            >
              <Printer className="size-4" />
              PDF 출력
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Field label="견적번호" value={quoteNo} onChange={setQuoteNo} />
            <Field label="작성일" type="date" value={issueDate} onChange={setIssueDate} />
            <Field label="유효기한" type="date" value={validUntil} onChange={setValidUntil} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="고객명" value={customerName} onChange={setCustomerName} />
            <Field label="회사명" value={companyName} onChange={setCompanyName} />
            <Field label="이메일" value={email} onChange={setEmail} />
            <Field label="연락처" value={phone} onChange={setPhone} />
            <Field label="프로젝트명" value={projectTitle} onChange={setProjectTitle} />
            <Field label="서비스 카테고리" value={category} onChange={setCategory} />
          </div>

          <label className="mt-4 block text-xs font-medium text-muted-foreground" htmlFor="quote-summary">
            요청 요약
          </label>
          <textarea
            id="quote-summary"
            value={requestSummary}
            onChange={(event) => setRequestSummary(event.target.value)}
            className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/60"
          />

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">견적 항목</h4>
              <button
                type="button"
                onClick={() => setLines((current) => [...current, makeLine()])}
                className="inline-flex h-8 items-center gap-2 rounded-md border border-white/10 px-3 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground"
              >
                <Plus className="size-3.5" />
                항목 추가
              </button>
            </div>
            {lines.map((line) => (
              <div key={line.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                <div className="grid gap-3 md:grid-cols-[1fr_90px_140px_32px]">
                  <input
                    value={line.name}
                    onChange={(event) => updateLine(line.id, { name: event.target.value })}
                    className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
                    placeholder="항목명"
                  />
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(event) => updateLine(line.id, { quantity: Number(event.target.value) })}
                    className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
                    aria-label="수량"
                  />
                  <input
                    type="number"
                    min={0}
                    step={1000}
                    value={line.unitPrice}
                    onChange={(event) => updateLine(line.id, { unitPrice: Number(event.target.value) })}
                    className="h-9 rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
                    aria-label="단가"
                  />
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    className="grid size-9 place-items-center rounded-md border border-white/10 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-200"
                    aria-label="항목 삭제"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
                <input
                  value={line.description}
                  onChange={(event) => updateLine(line.id, { description: event.target.value })}
                  className="mt-2 h-9 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
                  placeholder="상세 설명"
                />
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4 rounded-lg border border-white/10 bg-card p-5">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            <h3 className="text-sm font-semibold">조건/합계</h3>
          </div>
          <Field label="납기" value={delivery} onChange={setDelivery} />
          <Field label="결제 조건" value={paymentTerms} onChange={setPaymentTerms} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={vatEnabled} onChange={(event) => setVatEnabled(event.target.checked)} />
            VAT 10% 포함
          </label>
          <label className="block text-xs font-medium text-muted-foreground" htmlFor="quote-memo">
            내부/고객 안내 메모
          </label>
          <textarea
            id="quote-memo"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            className="min-h-24 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary/60"
          />
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>공급가</span>
              <span>{krw(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-muted-foreground">
              <span>VAT</span>
              <span>{krw(vat)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <span>총 견적</span>
              <span>{krw(total)}</span>
            </div>
          </div>
        </aside>
      </div>

      <section className="quote-print-area rounded-lg border border-white/10 bg-white p-8 text-slate-950 shadow-sm">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">AIO-MAKE</p>
            <h1 className="mt-3 text-3xl font-bold">견적서</h1>
            <p className="mt-2 text-sm text-slate-500">AIO Agency 외주 제작 견적</p>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">{quoteNo}</p>
            <p className="mt-1 text-slate-500">작성일 {issueDate}</p>
            <p className="text-slate-500">유효기한 {validUntil}</p>
          </div>
        </div>

        <div className="grid gap-6 border-b border-slate-200 py-6 md:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold text-slate-500">고객 정보</h2>
            <p className="mt-3 text-lg font-semibold">{customerName || "고객명 미입력"}</p>
            <p className="text-sm text-slate-600">{companyName || "-"}</p>
            <p className="mt-2 text-sm text-slate-500">{email || "-"} / {phone || "-"}</p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-500">프로젝트</h2>
            <p className="mt-3 text-lg font-semibold">{projectTitle || "프로젝트명 미입력"}</p>
            <p className="text-sm text-slate-600">{category || "-"}</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-500">{requestSummary || "-"}</p>
          </div>
        </div>

        <table className="mt-6 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
              <th className="py-3">항목</th>
              <th className="py-3">설명</th>
              <th className="py-3 text-right">수량</th>
              <th className="py-3 text-right">단가</th>
              <th className="py-3 text-right">금액</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-b border-slate-100 align-top">
                <td className="py-3 font-semibold">{line.name}</td>
                <td className="py-3 text-slate-600">{line.description}</td>
                <td className="py-3 text-right">{line.quantity}</td>
                <td className="py-3 text-right">{krw(line.unitPrice)}</td>
                <td className="py-3 text-right font-semibold">{krw(line.quantity * line.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong className="text-slate-950">납기:</strong> {delivery}</p>
            <p><strong className="text-slate-950">결제 조건:</strong> {paymentTerms}</p>
            <p><strong className="text-slate-950">비고:</strong> {memo}</p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">공급가</span>
              <span>{krw(subtotal)}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span className="text-slate-500">VAT</span>
              <span>{krw(vat)}</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-lg font-bold">
              <span>총 견적</span>
              <span>{krw(total)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary/60"
      />
    </label>
  );
}
