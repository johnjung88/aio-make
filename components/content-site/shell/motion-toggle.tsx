"use client";
/* 헤더 안 움직임 토글(WCAG 2.2.2). 상태는 저장하지 않는다. reduced-motion 환경의 초기값은 paused. */
import { CS_COPY } from "@/lib/content-site/copy";
import { useCsMotion } from "./frame";

export function MotionToggle() {
  const { motion, toggle } = useCsMotion();
  const paused = motion === "paused";
  const label = paused ? CS_COPY.motion.play : CS_COPY.motion.pause;
  return (
    <button
      type="button"
      className="cs-motion-toggle"
      aria-pressed={paused}
      aria-label={label}
      title={label}
      onClick={toggle}
    >
      <span className="cs-motion-toggle-icon" aria-hidden="true" />
    </button>
  );
}
