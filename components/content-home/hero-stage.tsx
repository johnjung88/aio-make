"use client";
/* 히어로 작품 묶음의 움직임 스위치(R5 WP-H). 서버에서 그린 작품 링크를 그대로 감싸고,
 * 화면 밖·탭 숨김·헤더 움직임 토글이면 data-active="false"로 드리프트·패럴랙스 루프를 멈춘다. */
import type { ReactNode } from "react";
import { useCsMotion } from "@/components/content-site/shell/frame";
import { useStageActivity } from "./use-stage-activity";

export function HeroStage({ children }: { children: ReactNode }) {
  const { root, active, reduced } = useStageActivity();
  const { motion } = useCsMotion();
  return (
    <div
      ref={root}
      className="ch-hero-works"
      data-active={active && !reduced && motion === "on" ? "true" : "false"}
    >
      {children}
    </div>
  );
}
