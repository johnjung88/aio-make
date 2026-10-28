import type { Metadata } from "next";
import { CaseShowroom } from "@/components/lab-samples/showroom";

export const metadata: Metadata = {
  title: "개발 쇼룸 · 실제 작동 샘플",
  description:
    "건축 공간 탐색, 패션 쇼핑몰, 영업 리드 자동화의 검토용 작동 샘플",
  robots: { index: false, follow: false },
};
export default function PreviewPage() {
  return <CaseShowroom />;
}
