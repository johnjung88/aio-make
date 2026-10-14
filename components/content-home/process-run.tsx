"use client";
/* 제작 과정 진행 모션의 시작 신호(client). 목록(ol)이 화면에 25% 들어오면 data-run="run"으로 바꿔 CSS 모션을 한 번만 시작한다.
 * 모션을 줄이는 환경이거나 observer가 없으면 data-run을 두지 않아 완료 상태 그대로 정지로 보인다.
 * 아이템(li)은 서버가 그린 children이며 이 파일은 자체 글자·그림을 만들지 않는다. */
import { useEffect, useRef, type ReactNode } from "react";

export function ProcessRun({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    list.dataset.run = "ready";
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        list.dataset.run = "run";
        observer.disconnect();
      },
      { threshold: 0.25 },
    );
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ol ref={ref} className="ch-steps" data-count={count}>
      {children}
    </ol>
  );
}
