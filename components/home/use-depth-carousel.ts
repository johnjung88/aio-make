"use client";
/* 메인 #work 컨텐츠 단계 카드 캐러셀 훅(R7 WP-3).
 * - 활성 카드 번호 1개(current)만 상태로 둔다. 카드 위치는 위치 계산(depthPos)으로 data-pos에 싣고 CSS가 3D로 보간한다.
 * - 768px 이상은 3D 캐러셀(옆 카드 클릭·스와이프·키보드), 미만은 CSS scroll-snap 가로 넘김이다.
 *   가로 넘김에서는 스크롤이 멈춘 자리의 가운데 카드가 활성 카드가 되고, 자동 넘김·막대 선택은 그 카드로 스크롤한다.
 * - 자동 넘김은 /content 3D 카드와 같다(이미지 3.5초·영상 5.2초). 정지: 마우스 올림, 키보드 포커스, 터치 중,
 *   화면 밖, 탭 숨김, reduced-motion. 정지가 풀리거나 카드가 바뀌면 시계를 처음부터 다시 잰다.
 * - wheel 리스너·인라인 스타일 없음. 영상은 이 훅이 아니라 카드가 활성일 때만 마운트한다. */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from "react";
import { useStageActivity } from "@/components/content-home/use-stage-activity";
import {
  isSwipe,
  nearestIndex,
  platformMotion,
  wrapIndex,
} from "@/lib/home-journey-platforms";

export function useDepthCarousel({
  count,
  dwells,
}: {
  count: number;
  /** 카드별로 머무는 시간(ms). 이미지 카드와 영상 카드가 다르다 */
  dwells: number[];
}) {
  const [current, setCurrent] = useState(0);
  const [hover, setHover] = useState(false);
  const [focusPause, setFocusPause] = useState(false);
  const [touching, setTouching] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const { root, active: inView, reduced } = useStageActivity();
  const track = useRef<HTMLUListElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const programmatic = useRef(false);
  const settle = useRef<number | null>(null);
  const release = useRef<number | null>(null);

  const dwellMs = dwells[current] ?? platformMotion.dwellMs;
  const moving = inView && !reduced;
  const running = moving && !hover && !focusPause && !touching;

  const pauseVideos = useCallback(() => {
    root.current?.querySelectorAll("video").forEach((video) => video.pause());
  }, [root]);

  const select = useCallback(
    (index: number) => {
      pauseVideos();
      setCurrent(wrapIndex(index, count));
    },
    [count, pauseVideos],
  );

  // 3D(768px 이상)와 가로 넘김(미만)을 구분한다. 첫 렌더는 CSS만으로 두 모양이 모두 맞다.
  useEffect(() => {
    const query = window.matchMedia(
      `(min-width: ${platformMotion.desktopMin}px)`,
    );
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // 자동 넘김 시계
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      pauseVideos();
      setCurrent((value) => wrapIndex(value + 1, count));
    }, dwellMs);
    return () => window.clearTimeout(timer);
  }, [running, current, dwellMs, count, pauseVideos]);

  // 화면 밖·탭 숨김·reduced-motion이면 영상을 멈춘다
  useEffect(() => {
    if (!moving) pauseVideos();
  }, [moving, pauseVideos]);

  // 가로 넘김: 활성 카드가 바뀌면 그 카드를 가운데로 스크롤한다
  useEffect(() => {
    const node = track.current;
    if (!node || desktop) return;
    const card = node.children[current] as HTMLElement | undefined;
    if (!card) return;
    const target = card.offsetLeft - (node.clientWidth - card.offsetWidth) / 2;
    if (Math.abs(node.scrollLeft - target) < 2) return;
    programmatic.current = true;
    node.scrollTo({ left: target, behavior: reduced ? "auto" : "smooth" });
    if (release.current !== null) window.clearTimeout(release.current);
    release.current = window.setTimeout(() => {
      programmatic.current = false;
    }, 900);
  }, [current, desktop, reduced]);

  // 가로 넘김: 사용자가 넘겨서 스크롤이 멈추면 가운데 카드를 활성 카드로 삼는다
  const onScroll = useCallback(() => {
    if (desktop) return;
    if (settle.current !== null) window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      if (programmatic.current) {
        programmatic.current = false;
        return;
      }
      const node = track.current;
      if (!node) return;
      const centers = Array.from(node.children).map((child) => {
        const card = child as HTMLElement;
        return card.offsetLeft + card.offsetWidth / 2;
      });
      const next = nearestIndex(centers, node.scrollLeft + node.clientWidth / 2);
      pauseVideos();
      setCurrent(next);
    }, platformMotion.settleMs);
  }, [desktop, pauseVideos]);

  useEffect(
    () => () => {
      if (settle.current !== null) window.clearTimeout(settle.current);
      if (release.current !== null) window.clearTimeout(release.current);
    },
    [],
  );

  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.target as HTMLElement).closest("video")) return;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = current + 1;
    if (event.key === "ArrowLeft") next = current - 1;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = count - 1;
    if (next !== null) {
      event.preventDefault();
      select(next);
    }
  };

  // 키보드 포커스(:focus-visible)일 때만 멈춘다. 마우스로 누른 버튼에 남은 포커스로는 멈추지 않는다
  const onFocus = (event: FocusEvent) => {
    let visible = false;
    try {
      visible = (event.target as HTMLElement).matches(":focus-visible");
    } catch {
      visible = true;
    }
    setFocusPause(visible);
  };
  const onBlur = (event: FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null))
      setFocusPause(false);
  };

  const rootProps = {
    onKeyDown,
    onFocus,
    onBlur,
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHover(true);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHover(false);
    },
  };

  const stageProps = {
    onTouchStart: (event: TouchEvent) => {
      suppressClick.current = false;
      setTouching(true);
      // 가로 넘김(미만)은 브라우저 스크롤이 처리한다. 3D에서만 스와이프를 직접 읽는다
      if (!desktop) {
        touch.current = null;
        return;
      }
      touch.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    },
    onTouchEnd: (event: TouchEvent) => {
      setTouching(false);
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x;
      const dy = event.changedTouches[0].clientY - touch.current.y;
      touch.current = null;
      if (isSwipe(dx, dy)) {
        suppressClick.current = true;
        select(current + (dx < 0 ? 1 : -1));
      }
    },
    onTouchCancel: () => {
      touch.current = null;
      setTouching(false);
    },
    onClickCapture: (event: MouseEvent) => {
      if (suppressClick.current) {
        event.preventDefault();
        event.stopPropagation();
        suppressClick.current = false;
      }
    },
  };

  return {
    root,
    track,
    current,
    select,
    moving,
    running,
    reduced,
    onScroll,
    rootProps,
    stageProps,
  };
}
