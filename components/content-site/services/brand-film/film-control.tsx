"use client";
/* 브랜드 홍보 영상 히어로의 배경 영상 일시정지 버튼(이 페이지의 고유 client 섬 1개).
 * - 같은 히어로 섹션 안의 자동재생 영상(video[data-cs-autoplay]) 하나만 제어한다.
 * - 자동재생·헤더 움직임 토글·reduced-motion 처리는 shell/frame.tsx가 맡는다. 여기서는
 *   사용자가 멈춘 영상을 frame이 다시 재생하지 않게 막고(play 이벤트에서 다시 pause),
 *   헤더 토글을 다시 켜면 사용자 정지도 풀어 준다.
 * - 라벨은 실제 재생 상태(play/pause 이벤트)를 따른다. 서버 렌더 초기값은 '영상 재생'. */
import { useCallback, useEffect, useRef, useState } from "react";
import { useCsMotion } from "../../shell/frame";

export function FilmControl({
  pauseLabel,
  playLabel,
}: {
  pauseLabel: string;
  playLabel: string;
}) {
  const button = useRef<HTMLButtonElement>(null);
  const userPaused = useRef(false);
  const lastMotion = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const { motion } = useCsMotion();

  const findVideo = useCallback(
    () =>
      button.current
        ?.closest("section")
        ?.querySelector<HTMLVideoElement>("video[data-cs-autoplay]") ?? null,
    [],
  );

  useEffect(() => {
    const video = findVideo();
    if (!video) return;
    const onPlay = () => {
      if (userPaused.current) {
        video.pause();
        return;
      }
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    setPlaying(!video.paused);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, [findVideo]);

  // 헤더 움직임 토글을 다시 켜면(paused → on) 이 영상의 사용자 정지도 푼다.
  // 자식 effect가 frame(부모) effect보다 먼저 실행되므로 frame의 play()보다 앞선다.
  useEffect(() => {
    if (lastMotion.current === "paused" && motion === "on")
      userPaused.current = false;
    lastMotion.current = motion;
  }, [motion]);

  const onClick = () => {
    const video = findVideo();
    if (!video) return;
    if (!video.paused) {
      userPaused.current = true;
      video.pause();
      return;
    }
    userPaused.current = false;
    video.muted = true;
    video.play().catch(() => {});
  };

  return (
    <button
      ref={button}
      type="button"
      className="cs-svc-brand-film-control"
      data-state={playing ? "playing" : "paused"}
      aria-label={playing ? pauseLabel : playLabel}
      onClick={onClick}
    >
      <span className="cs-svc-brand-film-control-icon" aria-hidden="true" />
    </button>
  );
}
