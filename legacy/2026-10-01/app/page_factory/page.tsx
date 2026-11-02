import type { Metadata } from "next";

import { PageFactoryWorkspace } from "@/components/page-factory/page-factory-workspace";

export const metadata: Metadata = {
  title: "AI 상세페이지 제작팀 | AIO",
  description:
    "브리프 입력 후 기획, 디자인, 카피, 검수 AI가 칸반 업무 체계로 상세페이지를 제작하는 AIO Page Factory.",
};

export default function PageFactoryPage() {
  return <PageFactoryWorkspace />;
}
