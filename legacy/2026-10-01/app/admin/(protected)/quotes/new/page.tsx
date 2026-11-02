import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getInboxItems } from "@/lib/admin/data";
import { QuoteDocumentBuilder, type QuoteDocumentInitial } from "@/components/admin/quote-document-builder";

export const metadata = {
  title: "견적서 작성 | AIO 관리자",
};

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function makeQuoteNo(): string {
  const now = new Date();
  return `AIO-Q-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function categoryLabel(category?: string): string {
  const labels: Record<string, string> = {
    website: "웹사이트",
    shop: "쇼핑몰",
    logo: "로고·명함",
    detail: "상세페이지",
    ppt: "PPT 디자인",
    automation: "자동화·앱",
    video: "영상",
    bundle: "묶음",
    other: "기타",
  };
  return category ? labels[category] ?? category : "";
}

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ requestId?: string }>;
}) {
  const { requestId } = await searchParams;
  const { items, error } = requestId ? await getInboxItems(200) : { items: [], error: undefined };
  const source = requestId ? items.find((item) => item.requestId === requestId) : undefined;
  const today = new Date();
  const valid = new Date(today);
  valid.setDate(today.getDate() + 14);

  const initial: QuoteDocumentInitial = {
    quoteNo: makeQuoteNo(),
    issueDate: dateKey(today),
    validUntil: dateKey(valid),
    customerName: source?.customerName ?? "",
    companyName: source?.companyName ?? "",
    email: source?.email ?? "",
    phone: source?.phone ?? "",
    projectTitle: source ? `${source.customerName} ${categoryLabel(source.category) || "제작"} 견적` : "",
    category: categoryLabel(source?.category),
    requestSummary: source?.rawText ?? "",
    lines: [
      {
        id: "line-main",
        name: categoryLabel(source?.category) || "AIO 제작 서비스",
        description: source?.deadlineText ? `요청 일정: ${source.deadlineText}` : "기획, 제작, 검수, 납품 범위를 포함합니다.",
        quantity: 1,
        unitPrice: source?.budget && source.budget > 0 ? source.budget : 100000,
      },
    ],
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Quote Document</p>
          <h2 className="mt-2 text-3xl font-semibold">견적서 작성</h2>
          <p className="mt-2 text-sm text-muted-foreground">내용을 입력한 뒤 PDF 출력 버튼으로 저장용 견적서를 만듭니다.</p>
        </div>
        <Link href="/admin/quotes" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
          <ArrowLeft className="size-4" />
          견적서 목록
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          문의 정보를 불러오지 못해 빈 견적서로 시작합니다: {error}
        </p>
      )}

      <QuoteDocumentBuilder initial={initial} />
    </div>
  );
}
