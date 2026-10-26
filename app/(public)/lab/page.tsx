import type { Metadata } from "next";
import LabPrototype from "@/components/lab-prototype/lab-prototype";

export const metadata: Metadata = {
  title: "읽히는 웹, 이어지는 운영",
  description:
    "웹사이트의 정보 구조부터 반복 업무의 운영 흐름까지 직접 확인하는 AIO MAKE 개발 프로토타입",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  return <LabPrototype />;
}
