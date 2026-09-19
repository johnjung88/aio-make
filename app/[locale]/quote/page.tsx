import { QuoteForm } from "@/components/marketing/quote-form";
export const metadata = {
  title: "마케팅 상담 신청",
  description:
    "업체 정보와 지금의 마케팅 고민을 남겨 주세요. 문의는 할인 순번 확정이 아닙니다.",
};
export default function Page() {
  return <QuoteForm />;
}
