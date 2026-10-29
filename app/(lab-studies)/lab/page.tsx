import { LabMain } from "@/components/lab-main/lab-main";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "생각한 기능이 작동하는 화면으로 | AIO 랩",
  "웹사이트·쇼핑몰·자동화를 직접 체험하세요 가상 브랜드의 공간 탐색과 상품 선택, 업무 처리 흐름을 확인하고 필요한 구성으로 상담하세요",
  "/lab",
);

export default function LabPage() {
  return <LabMain />;
}
