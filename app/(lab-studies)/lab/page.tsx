import type { Metadata } from "next";
import { LabMain } from "@/components/lab-main/lab-main";

export const metadata: Metadata = {
  title: "생각한 기능이 작동하는 화면으로 | AIO 랩",
  description:
    "웹사이트·쇼핑몰·자동화를 직접 체험하세요 가상 브랜드의 공간 탐색과 상품 선택, 업무 처리 흐름을 확인하고 필요한 구성으로 상담하세요",
  robots: { index: true, follow: true },
};

export default function LabPage() {
  return <LabMain />;
}
