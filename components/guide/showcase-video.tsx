"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

const videos = {
  brand: {
    title: "AIO MAKE를 만나보세요",
    copy: "영상 제작부터 마케팅, 개발까지 필요한 일을 함께 완성합니다",
    label: "AIO MAKE 브랜드 소개 영상",
    src: "/videos/brand-intro-v01.mp4",
    poster: "/videos/brand-intro-poster.jpg",
    action: "회사 소개 보기",
  },
  webtoon: {
    title: "이야기가 웹툰이 되는 순간",
    copy: "캐릭터와 장면, 이야기를 담은 웹툰 제작을 만나보세요",
    label: "1억의 구단주 웹툰 제작 소개 영상",
    src: "/videos/webtoon-reference-v02.mp4",
    poster: "/videos/webtoon-reference-poster.jpg",
    action: "웹툰 서비스 소개",
  },
};

export function ShowcaseVideo({ kind }: { kind: keyof typeof videos }) {
  const video = videos[kind];
  const ref = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  async function play() {
    setError(false);
    try {
      await ref.current?.play();
      setStarted(true);
    } catch {
      setError(true);
    }
  }
  return (
    <section
      className={`showcase-video showcase-video-${kind}`}
      aria-label={kind === "brand" ? video.label : undefined}
      aria-labelledby={kind === "webtoon" ? `${kind}-video-title` : undefined}
    >
      {kind === "webtoon" && (
        <div className="showcase-video-heading centered-copy">
          <span>WEBTOON SHOWREEL</span>
          <h2 id={`${kind}-video-title`}>{video.title}</h2>
          <p>{video.copy}</p>
        </div>
      )}
      <div className="showcase-video-frame">
        <video
          ref={ref}
          src={video.src}
          poster={video.poster}
          preload="none"
          controls={started}
          playsInline
          aria-label={video.label}
          onPlay={() => setStarted(true)}
          onError={() => setError(true)}
        />
        {!started && (
          <button
            className="showcase-video-play"
            onClick={play}
            aria-label={`${video.action} 재생`}
          >
            <span className="showcase-play-icon">
              <Play size={28} fill="currentColor" aria-hidden="true" />
            </span>
            <span>{video.action}</span>
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="showcase-video-error">
          영상을 재생하지 못했습니다 <a href={video.src}>영상 파일 열기</a>
        </p>
      )}
    </section>
  );
}
