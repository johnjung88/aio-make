/* 플랫폼 프레임(서버 컴포넌트, R7 WP-0). 폰 외곽 9:19.5 안에 플랫폼별 화면 틀(상단 바·액션 열·재생 막대 자리)을 두고
 * 소재(children)를 "콘텐츠 영역"에 끼운다. 화면비는 콘텐츠 영역이 보여준다(릴스·쇼츠·틱톡 9:16, 피드 4:5, 유튜브·페이스북 16:9, 웹툰 세로 스크롤).
 * 아이콘은 lucide-react의 범용 아이콘만 쓴다. 브랜드 아이콘은 쓰지 않고, 로고는 logos.ts의 공식 파일만 쓴다.
 * 틀의 글자·막대는 장식이라 스크린리더에서 숨기고, 소재(children)와 로고 alt만 읽힌다.
 * 조회수·좋아요 같은 숫자는 틀에 넣지 않는다(아이콘과 빈 막대만). 숫자는 쓰는 쪽이 children으로 넣는다. */
import type { CSSProperties, ReactNode } from "react";
import { Bookmark, Heart, MessageCircle, Music2, Play, Send, Share2, ThumbsUp } from "lucide-react";
import { getPlatformLogo, LOGO_SIZE_DEFAULT, type PlatformLogoId } from "./logos";
import "./platform-frame.css";

export type PlatformFrameKind =
  | "reels"
  | "shorts"
  | "tiktok"
  | "feed45"
  | "youtube169"
  | "fbvideo"
  | "webtoon";

/** 플랫폼별 이름(aria-label)과 콘텐츠 영역 화면비 설명 */
export const PLATFORM_FRAME_INFO: Record<PlatformFrameKind, { label: string; ratio: string }> = {
  reels: { label: "인스타그램 릴스 화면", ratio: "9:16" },
  shorts: { label: "유튜브 쇼츠 화면", ratio: "9:16" },
  tiktok: { label: "틱톡 화면", ratio: "9:16" },
  feed45: { label: "인스타그램 피드 화면", ratio: "4:5" },
  youtube169: { label: "유튜브 시청 화면", ratio: "16:9" },
  fbvideo: { label: "페이스북 피드 영상 화면", ratio: "16:9" },
  webtoon: { label: "웹툰 뷰어 화면", ratio: "세로 스크롤" },
};

export interface PlatformFrameProps {
  platform: PlatformFrameKind;
  logo?: PlatformLogoId;
  /** 프레임 상단 안쪽 왼쪽 태그(예: "연출 예시") */
  tag?: string;
  /** 웹툰 상단 바 제목 */
  title?: string;
  /** 인스타그램 피드의 "광고" 표기 */
  sponsored?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** 공식 로고 1개. 파일이 없으면(UNKNOWN) 이름 글자로 대신한다 */
export function PlatformLogoMark({ id, size = LOGO_SIZE_DEFAULT }: { id: PlatformLogoId; size?: number }) {
  const logo = getPlatformLogo(id);
  if (!logo.src) {
    return (
      <span className="pf-logo-text" data-logo={id} data-logo-status="unknown">
        {logo.name}
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 공식 파일을 변형 없이 그대로 보여 준다(최적화 변환 금지)
    <img
      className="pf-logo"
      data-logo={id}
      data-logo-status={logo.status}
      src={logo.src}
      alt={logo.name}
      width={size}
      height={size}
      decoding="async"
    />
  );
}

const lines = (count: number) =>
  Array.from({ length: count }, (_, i) => <span key={i} className="pf-line" />);

function Rail({ withMusic }: { withMusic?: boolean }) {
  return (
    <div className="pf-rail" aria-hidden="true">
      <Heart className="pf-ico" strokeWidth={1.8} />
      <MessageCircle className="pf-ico" strokeWidth={1.8} />
      <Send className="pf-ico" strokeWidth={1.8} />
      <Bookmark className="pf-ico" strokeWidth={1.8} />
      {withMusic ? <Music2 className="pf-ico pf-ico--disc" strokeWidth={1.8} /> : null}
    </div>
  );
}

export function PlatformFrame({
  platform,
  logo,
  tag,
  title,
  sponsored,
  className,
  style,
  children,
}: PlatformFrameProps) {
  const info = PLATFORM_FRAME_INFO[platform];
  const mark = logo ? <PlatformLogoMark id={logo} /> : null;
  const media = (
    <div className="pf-media">
      {tag ? <span className="pf-tag">{tag}</span> : null}
      {children}
    </div>
  );
  let body: ReactNode;

  switch (platform) {
    case "reels":
    case "shorts":
    case "tiktok":
      body = (
        <>
          {media}
          <div className="pf-top" aria-hidden="true">
            {platform === "tiktok" ? (
              <span className="pf-tabs">
                <i />
                <b />
              </span>
            ) : (
              <span className="pf-title-line" />
            )}
          </div>
          {mark ? <span className="pf-mark">{mark}</span> : null}
          <Rail withMusic={platform === "tiktok"} />
          <div className="pf-bottom" aria-hidden="true">
            <span className="pf-account">
              <i className="pf-avatar" />
              <span className="pf-line" />
            </span>
            {lines(2)}
            <span className="pf-progress">
              <i />
            </span>
          </div>
        </>
      );
      break;
    case "feed45":
      body = (
        <>
          <div className="pf-row" aria-hidden="true">
            <i className="pf-avatar" />
            <span className="pf-col">
              <span className="pf-line" />
              {sponsored ? <em className="pf-sponsored">광고</em> : <span className="pf-line" />}
            </span>
            {mark}
          </div>
          {media}
          <div className="pf-actions" aria-hidden="true">
            <Heart className="pf-ico" strokeWidth={1.8} />
            <MessageCircle className="pf-ico" strokeWidth={1.8} />
            <Send className="pf-ico" strokeWidth={1.8} />
            <Bookmark className="pf-ico pf-ico--end" strokeWidth={1.8} />
          </div>
          <div className="pf-lines" aria-hidden="true">
            {lines(2)}
          </div>
        </>
      );
      break;
    case "youtube169":
      body = (
        <>
          {media}
          <div className="pf-seek" aria-hidden="true">
            <i />
          </div>
          <div className="pf-meta" aria-hidden="true">
            <span className="pf-line pf-line--title" />
            <span className="pf-line" />
          </div>
          <div className="pf-row" aria-hidden="true">
            <i className="pf-avatar" />
            <span className="pf-col">
              <span className="pf-line" />
            </span>
            {mark}
          </div>
          <div className="pf-next" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span key={i} className="pf-next-item">
                <i className="pf-thumb">
                  <Play className="pf-ico pf-ico--sm" strokeWidth={1.8} />
                </i>
                <span className="pf-col">
                  <span className="pf-line" />
                  <span className="pf-line" />
                </span>
              </span>
            ))}
          </div>
        </>
      );
      break;
    case "fbvideo":
      body = (
        <>
          <div className="pf-row" aria-hidden="true">
            <i className="pf-avatar" />
            <span className="pf-col">
              <span className="pf-line" />
              <span className="pf-line" />
            </span>
            {mark}
          </div>
          <div className="pf-lines" aria-hidden="true">
            {lines(2)}
          </div>
          {media}
          <div className="pf-actions pf-actions--even" aria-hidden="true">
            <ThumbsUp className="pf-ico" strokeWidth={1.8} />
            <MessageCircle className="pf-ico" strokeWidth={1.8} />
            <Share2 className="pf-ico" strokeWidth={1.8} />
          </div>
        </>
      );
      break;
    case "webtoon":
      body = (
        <>
          <div className="pf-viewer-bar" aria-hidden="true">
            <span className="pf-viewer-title">{title ?? ""}</span>
          </div>
          {media}
        </>
      );
      break;
  }

  return (
    <div
      className={["pf", className].filter(Boolean).join(" ")}
      data-platform={platform}
      data-ratio={info.ratio}
      role="group"
      aria-label={info.label}
      style={style}
    >
      <div className="pf-device">
        <div className="pf-screen">
          <span className="pf-notch" aria-hidden="true" />
          {body}
        </div>
      </div>
    </div>
  );
}
