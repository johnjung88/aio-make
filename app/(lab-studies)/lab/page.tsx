import type { Metadata } from "next";
import { LabMain } from "@/components/lab-main/lab-main";

export const metadata: Metadata = {
  title: "웹사이트·쇼핑몰·자동화 제작",
  description:
    "건축 공간 탐색부터 상품 구매와 영업 리드 정리까지, AIO MAKE가 만드는 기능을 직접 확인해보세요",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <LabMain />;
}
