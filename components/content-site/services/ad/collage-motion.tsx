"use client";
/* SNS 광고 영상 히어로 콜라주의 레일 흐름(이 페이지의 고유 client 섬 1개).
 * 카드 레일([data-rail])이 위아래로 천천히 왕복한다(한 번 왕복 24초). 서비스 CSS에서는 @keyframes를 쓸 수 없어
 * (테스트 7의 CSS 파서가 키프레임 단계를 선택자로 읽는다) Web Animations API로 움직인다.
 * - prefers-reduced-motion: reduce면 만들지 않는다(설정이 바뀌면 다시 판단).
 * - 헤더 움직임 토글(useCsMotion)이 꺼지면 pause(), 켜지면 play(). 5초 넘는 자동 움직임은 이 토글로 멈춘다(WCAG 2.2.2).
 * - 콜라주는 장식이라 컨테이너 하나에 role="img"와 aria-label만 둔다. 카드는 링크가 아니다. */
import { useEffect, useRef } from "react";
import { useCsMotion } from "../../shell/frame";

/** 한 방향 이동 시간(왕복의 절반) */
const HALF_TRIP_MS = 12 * 1000;
/** 레일 높이 대비 이동 폭 */
const DRIFT = "4%";

export function CollageMotion({
  label,
  className,
  children,
}: {
  label: string;
  className: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const animations = useRef<Animation[]>([]);
  const { motion } = useCsMotion();
  const motionRef = useRef(motion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      for (const a of animations.current) a.cancel();
      animations.current = [];
    };
    const start = () => {
      stop();
      if (query.matches || !root.current) return;
      const rails = root.current.querySelectorAll<HTMLElement>("[data-rail]");
      rails.forEach((rail, index) => {
        if (typeof rail.animate !== "function") return;
        const animation = rail.animate(
          [
            { transform: `translate3d(0, -${DRIFT}, 0)` },
            { transform: `translate3d(0, ${DRIFT}, 0)` },
          ],
          {
            duration: HALF_TRIP_MS,
            iterations: Infinity,
            direction: index % 2 ? "alternate-reverse" : "alternate",
            easing: "ease-in-out",
          },
        );
        if (motionRef.current !== "on") animation.pause();
        animations.current.push(animation);
      });
    };
    start();
    query.addEventListener("change", start);
    return () => {
      query.removeEventListener("change", start);
      stop();
    };
  }, []);

  useEffect(() => {
    motionRef.current = motion;
    for (const a of animations.current) {
      if (motion === "on") a.play();
      else a.pause();
    }
  }, [motion]);

  return (
    <div ref={root} className={className} role="img" aria-label={label}>
      {children}
    </div>
  );
}
