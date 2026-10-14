"use client";
/* 컨텐츠 사이트 루트. pathname → data-cs-theme / data-cs-service / data-cs-page (서버 렌더에서도 같은 값),
 * 움직임 상태(data-motion)와 JS 표시(data-js)를 둔다. 자동재생 영상(video[data-cs-autoplay])의
 * 재생·정지도 여기서 한 번에 다룬다(서버 HTML에 autoplay 속성 없음). */
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { csRoute } from "@/lib/content-site/theme-map";

type Motion = "on" | "paused";
type MotionContextValue = { motion: Motion; toggle: () => void };

const MotionContext = createContext<MotionContextValue>({
  motion: "on",
  toggle: () => {},
});

/** 서비스 고유 client 섬이 헤더 움직임 토글 상태를 읽을 때 쓴다. */
export function useCsMotion() {
  return useContext(MotionContext);
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ContentSiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const route = csRoute(pathname);
  const root = useRef<HTMLDivElement>(null);
  const [motion, setMotion] = useState<Motion>("on");
  const [js, setJs] = useState(false);

  useEffect(() => {
    setJs(true);
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotion(query.matches ? "paused" : "on");
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  // 자동재생 영상: 움직임이 켜져 있고 reduced-motion이 아닐 때만 play().
  useEffect(() => {
    const videos =
      root.current?.querySelectorAll<HTMLVideoElement>(
        "video[data-cs-autoplay]",
      ) ?? [];
    const cleanups: (() => void)[] = [];
    for (const video of videos) {
      const playing = () => video.setAttribute("data-playing", "");
      video.addEventListener("playing", playing);
      cleanups.push(() => video.removeEventListener("playing", playing));
      if (motion === "on" && !reducedMotion()) {
        video.muted = true;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
    return () => cleanups.forEach((fn) => fn());
  }, [motion, pathname]);

  const toggle = useCallback(
    () => setMotion((m) => (m === "on" ? "paused" : "on")),
    [],
  );
  const value = useMemo(() => ({ motion, toggle }), [motion, toggle]);

  return (
    <MotionContext.Provider value={value}>
      <div
        ref={root}
        className="cs-site"
        data-cs-theme={route.theme}
        data-cs-service={route.service}
        data-cs-page={route.page}
        data-motion={motion}
        data-js={js ? "" : undefined}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}
