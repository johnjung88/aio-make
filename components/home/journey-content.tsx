"use client";
/* 메인 #work 03 컨텐츠 단계(R7 WP-3): 서비스 6종을 플랫폼 규격 폰 프레임에 담은 카드 캐러셀.
 * - 탭·하위 칩·넘김 버튼·링크 줄이 없다. 768px 이상은 3D 캐러셀, 미만은 scroll-snap 가로 넘김(3D·블러 없음)
 * - 카드 6장은 같은 9:19.5 폰 외곽이고, 플랫폼 화면비는 프레임 안 콘텐츠 영역이 보여준다(웹툰 세로 스크롤·유튜브 16:9·릴스 9:16·틱톡 9:16·페이스북 16:9·피드 4:5)
 * - 활성 카드만 영상 요소를 마운트한다. 활성 카드 전체가 서비스 페이지 링크(새 탭)이고 옆 카드를 누르면 그 카드로 넘어간다
 * - 카드에 지표 숫자를 넣지 않는다(아이콘만). 공개판은 자체 연출 예시 소재, 검토판은 서버가 고른 작업물을 쓴다
 * - 소재 선택·크기 표·플랫폼 매핑은 lib/home-journey-platforms.ts, 위치·자동 넘김·입력은 use-depth-carousel.ts */
import Image from "next/image";
import { useEffect, useRef } from "react";
import { PlatformFrame } from "@/components/platform-frame/platform-frame";
import type { ContentSelection } from "@/lib/home-journey";
import {
  cardPlan,
  depthPos,
  platformMotion,
  type CardMediaSpec,
  type CardPlan,
} from "@/lib/home-journey-platforms";
import { newTabProps } from "@/lib/new-tab";
import { homeCardMedia } from "@/lib/content-home";
import { useDepthCarousel } from "./use-depth-carousel";
import { ProductionCase } from "./production-case";
import "./journey-content.css";

const CARD_SIZES = "(min-width: 1440px) 280px, 248px";

/** 활성 카드에만 마운트한다. 재생은 play()로만(서버 HTML에는 재생 속성이 없다) */
function CardVideo({
  media,
  play,
}: {
  media: Extract<CardMediaSpec, { kind: "video" }>;
  play: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (play) {
      node.muted = true;
      node.play().catch(() => {});
    } else node.pause();
  }, [play]);
  return (
    <video
      ref={ref}
      src={media.src}
      poster={media.poster}
      width={media.width}
      height={media.height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.alt}
    />
  );
}

function StillImage({
  src,
  alt,
  tone,
}: {
  src: string;
  alt: string;
  tone?: "static";
}) {
  return (
    <div className={tone ? "wjc-kb wjc-kb--static" : "wjc-kb"}>
      <Image src={src} alt={alt} fill sizes={CARD_SIZES} />
    </div>
  );
}

function CardBody({
  plan,
  selected,
  play,
  reduced,
}: {
  plan: CardPlan;
  selected: boolean;
  play: boolean;
  reduced: boolean;
}) {
  const media = plan.media;
  if (media.kind === "strip") {
    const first = media.pages[0];
    // 웹툰: 활성 카드만 컷을 이어 붙여 세로로 읽는다. 그 밖에는 첫 컷만 둔다
    if (selected && !reduced && media.pages.length > 1)
      return (
        <div className="wjc-roll">
          <div className="wjc-roll-a">
            <div className="wjc-roll-b">
              {media.pages.map((page, index) => (
                <Image
                  key={page.src}
                  className="wjc-cut"
                  src={page.src}
                  alt={index === 0 ? page.alt : ""}
                  width={page.width}
                  height={page.height}
                  sizes={CARD_SIZES}
                />
              ))}
            </div>
          </div>
        </div>
      );
    return (
      <StillImage
        src={first.src}
        alt={selected ? first.alt : ""}
        tone="static"
      />
    );
  }
  if (media.kind === "video") {
    if (selected && !reduced) return <CardVideo media={media} play={play} />;
    return media.poster ? (
      <StillImage
        src={media.poster}
        alt={selected ? media.alt : ""}
        tone="static"
      />
    ) : (
      <div className="wjc-blank" />
    );
  }
  if (plan.id === "animation" && media.src === homeCardMedia.animation.poster) {
    return <div className="wjc-poses">{homeCardMedia.animation.images?.map((src, index) => <Image key={src} src={src} alt={selected && index === 0 ? media.alt : ""} width={524} height={942} sizes="100px" />)}</div>;
  }
  return (
    <>
      <StillImage src={media.src} alt={selected ? media.alt : ""} />
      {plan.kinetic && (
        <span className="wjc-kinetic t-chip" aria-hidden="true">
          <span>MOTION</span>
          <span>GRAPHICS</span>
        </span>
      )}
    </>
  );
}

function JourneyContentCarousel({
  selections,
}: {
  selections: ContentSelection[];
}) {
  const count = selections.length;
  const plans = selections.map(cardPlan);
  const dwells = plans.map((plan) =>
    plan.media.kind === "video"
      ? platformMotion.videoDwellMs
      : platformMotion.dwellMs,
  );
  const {
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
  } = useDepthCarousel({ count, dwells });
  const active = plans[current];

  return (
    <div
      className="wjc"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="컨텐츠 종류별 작업물 카드"
      data-run={moving ? "true" : "false"}
      data-autoplay={reduced ? "off" : running ? "running" : "paused"}
      {...rootProps}
    >
      <div className="wjc-stage wj-media" {...stageProps}>
        <ul className="wjc-track" ref={track} onScroll={onScroll}>
          {plans.map((plan, index) => {
            const selected = index === current;
            return (
              <li
                key={plan.id}
                className="wjc-card"
                data-service={plan.id}
                data-pos={depthPos(index, current, count)}
                data-active={selected ? "true" : undefined}
                aria-hidden={!selected}
              >
                <PlatformFrame
                  platform={plan.platform}
                  logo={plan.logo}
                  tag={plan.tag ?? undefined}
                  title={plan.title}
                  sponsored={plan.sponsored}
                >
                  <CardBody
                    plan={plan}
                    selected={selected}
                    play={selected && moving}
                    reduced={reduced}
                  />
                </PlatformFrame>
                {selected ? (
                  <a
                    className="wjc-open"
                    href={plan.href}
                    aria-label={plan.linkLabel}
                    {...newTabProps}
                  />
                ) : (
                  <button
                    type="button"
                    className="wjc-select"
                    tabIndex={-1}
                    aria-label={`${plan.label} 선택`}
                    onClick={() => select(index)}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="wjc-caption t-small">{active.caption}</p>
      {active.note && <p className="wjc-note t-small">{active.note}</p>}
      <div className="wjc-dots" role="group" aria-label="컨텐츠 종류 선택">
        {plans.map((plan, index) => (
          <button
            key={plan.id}
            type="button"
            className="wjc-dot"
            aria-label={`${plan.label} 보기`}
            aria-current={index === current ? "true" : undefined}
            onClick={() => select(index)}
          >
            <span className="wjc-bar" aria-hidden="true" />
          </button>
        ))}
      </div>
      <p className="wjc-sr" aria-live={running ? "off" : "polite"}>
        {`${current + 1} / ${count} ${active.label}`}
      </p>
    </div>
  );
}

export function JourneyContent({
  selections,
}: {
  selections: ContentSelection[];
}) {
  return (
    <div className="wjc-group">
      <ProductionCase />
      <JourneyContentCarousel selections={selections} />
    </div>
  );
}
