import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DirectionStudy,
  type Direction,
} from "@/components/lab-studies/studies";

export const dynamicParams = false;
export function generateStaticParams() {
  return ["a", "b", "c"].map((direction) => ({ direction }));
}
export const metadata: Metadata = {
  title: "개발 페이지 작동 시안",
  robots: { index: false, follow: false },
};
export default async function StudyPage({
  params,
}: {
  params: Promise<{ direction: string }>;
}) {
  const { direction } = await params;
  if (!["a", "b", "c"].includes(direction)) notFound();
  return <DirectionStudy direction={direction as Direction} />;
}
