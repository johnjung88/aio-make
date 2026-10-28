import type { Metadata } from "next";
import { StudyGallery } from "@/components/lab-studies/studies";

export const metadata: Metadata = {
  title: "개발 페이지 — 세 가지 작동 시안",
  robots: { index: false, follow: false },
};
export default function StudiesPage() {
  return <StudyGallery />;
}
