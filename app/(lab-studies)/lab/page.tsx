import type { Metadata } from "next";
import { LabMain } from "@/components/lab-main/lab-main";

export const metadata: Metadata = {
  title: "웹사이트·쇼핑몰·자동화 제작",
  description:
    "웹사이트·쇼핑몰·자동화를 실제 사용 장면으로 보여드립니다 내 업종과 업무를 골라 필요한 기능을 확인해보세요",
  robots: { index: true, follow: true },
};

export default function LabPage() {
  return <LabMain />;
}
