"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";

/** Count-up that triggers when in view */
function CountUp({
  to,
  duration = 2.2,
  suffix = "",
}: {
  to: number;
  duration?: number;
  suffix?: string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (n) => Math.round(n).toString());
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, {
        duration,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [inView, to, count, duration]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

/**
 * Editorial 활자형 — 매거진 페이지 안에서 헤드라인처럼 자리잡는 활자 디스플레이.
 * 다크 그래프 카드 X. 페이퍼 톤 + 큰 활자 + 양옆 가로 선 + 작은 메타.
 */
export function MagazineVitalSign() {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, margin: "-15%" });

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1100px] mx-auto mb-[72px] relative"
      style={{
        padding: "clamp(40px, 6vw, 80px) clamp(20px, 4vw, 64px)",
        background: "var(--tone-magazine-paper-2)",
        borderTop: "1px solid var(--tone-magazine-ink)",
        borderBottom: "1px solid var(--tone-magazine-ink)",
      }}
    >
      {/* 상단 작은 메타 라인 */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="flex items-center justify-between mb-8 md:mb-12"
        style={{
          fontFamily: "var(--font-jetbrains)",
          fontSize: 10.5,
          color: "var(--tone-magazine-ink-3)",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
        }}
      >
        <span className="hidden sm:inline">— Vital Signs</span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block animate-dot-pulse-mag"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--tone-magazine-red)",
            }}
          />
          Live · May 2026
        </span>
        <span className="hidden sm:inline">No. 16 / Vol. I —</span>
      </motion.div>

      {/* 중앙 활자 디스플레이 */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
        {/* 142 — 누적 의뢰 */}
        <div className="text-center flex-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: "clamp(72px, 14vw, 168px)",
              lineHeight: 0.9,
              color: "var(--tone-magazine-ink)",
              letterSpacing: "-0.03em",
            }}
          >
            <CountUp to={142} duration={2.2} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-3 md:mt-4 inline-flex items-baseline gap-2"
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(16px, 1.6vw, 20px)",
                fontStyle: "normal",
                color: "var(--tone-magazine-ink-2)",
                fontWeight: 500,
              }}
            >
              clients
            </span>
            <span
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: "clamp(11px, 1vw, 12.5px)",
                color: "var(--tone-magazine-ink-3)",
                letterSpacing: "-0.003em",
              }}
            >
              누적 의뢰
            </span>
          </motion.div>
        </div>

        {/* 가운데 분리 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="flex md:flex-col items-center justify-center gap-3 md:gap-4 md:py-4"
        >
          <span
            className="hidden md:block"
            style={{ width: 1, height: 36, background: "var(--tone-magazine-ink)" }}
          />
          <span
            className="md:hidden"
            style={{ width: 36, height: 1, background: "var(--tone-magazine-ink)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-fraunces)",
              fontStyle: "normal",
              fontSize: "clamp(20px, 2vw, 26px)",
              color: "var(--tone-magazine-ink-faint)",
              fontWeight: 400,
              lineHeight: 1,
            }}
          >
            &amp;
          </span>
          <span
            className="hidden md:block"
            style={{ width: 1, height: 36, background: "var(--tone-magazine-ink)" }}
          />
          <span
            className="md:hidden"
            style={{ width: 36, height: 1, background: "var(--tone-magazine-ink)" }}
          />
        </motion.div>

        {/* 98% — 재의뢰율 */}
        <div className="text-center flex-1">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            style={{
              fontFamily: "var(--font-marcellus)",
              fontSize: "clamp(72px, 14vw, 168px)",
              lineHeight: 0.9,
              color: "var(--tone-magazine-red)",
              letterSpacing: "-0.03em",
            }}
          >
            <CountUp to={98} duration={2.4} />
            <span style={{ fontSize: "0.55em", letterSpacing: 0, marginLeft: 4 }}>
              %
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-3 md:mt-4 inline-flex items-baseline gap-2"
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces)",
                fontSize: "clamp(16px, 1.6vw, 20px)",
                fontStyle: "normal",
                color: "var(--tone-magazine-ink-2)",
                fontWeight: 500,
              }}
            >
              return
            </span>
            <span
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: "clamp(11px, 1vw, 12.5px)",
                color: "var(--tone-magazine-ink-3)",
                letterSpacing: "-0.003em",
              }}
            >
              재의뢰율
            </span>
          </motion.div>
        </div>
      </div>

      {/* 하단 가로 활자 라인 — 16개월 기간 표시 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="mt-10 md:mt-14 flex items-center justify-center gap-3 md:gap-5"
      >
        <span
          style={{ width: "clamp(28px, 6vw, 64px)", height: 1, background: "var(--tone-magazine-line-2)" }}
        />
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(9.5px, 1vw, 11px)",
            color: "var(--tone-magazine-ink-2)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          Jan 2025 — May 2026
        </span>
        <span
          style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--tone-magazine-ink-3)" }}
        />
        <span
          style={{
            fontFamily: "var(--font-jetbrains)",
            fontSize: "clamp(9.5px, 1vw, 11px)",
            color: "var(--tone-magazine-ink-2)",
            letterSpacing: "0.32em",
            textTransform: "uppercase",
          }}
        >
          16 Months Live
        </span>
        <span
          style={{ width: "clamp(28px, 6vw, 64px)", height: 1, background: "var(--tone-magazine-line-2)" }}
        />
      </motion.div>
    </div>
  );
}
