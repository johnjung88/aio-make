"use client";
/* 애니메이션 '움직이기 전 확인' 탭(WP-A, 이 서비스의 유일한 client 섬).
 * - JS가 없을 때(서버 HTML·하이드레이션 전): 세 항목이 제목과 함께 세로로 모두 보인다.
 * - 마운트 후: APG 탭(←/→/↑/↓·Home·End, 끝에서 순환). 패널 높이는 세 항목을 같은 칸에 겹쳐 가장 긴 것에 맞추고,
 *   보이지 않는 사본은 heading 없는 요소 + aria-hidden으로 둔다(P3 방식).
 * 문구는 서버(landing.tsx)가 props로 넘긴다. 서버 전용 데이터·전체 랜딩 데이터는 import하지 않는다.
 * 그림은 CSS 도형(aria-hidden) + '연출 예시' 태그. 이야기 그림은 문장 카드 + 시작·전개·마무리 장면 3칸으로 상자를 채운다.
 * 패널 안 문구는 그림 윗선에 맞춘다(animation.css, VERIFY_FINAL_P2R WP-A-3). */
import { useEffect, useRef, useState } from "react";
import type React from "react";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import { CsTag } from "../../ui/tag";

type Item = { readonly title: string; readonly body: string };

export type BeforeMotionProps = {
  tabsLabel: string;
  items: readonly Item[];
  story: {
    readonly label: string;
    readonly line: string;
    readonly beats: readonly string[];
  };
  views: readonly string[];
  frames: readonly string[];
};

const PANEL_ID = "cs-animation-before-panel";
const tabId = (i: number) => `cs-animation-before-tab-${i + 1}`;
const pad2 = (n: number) => String(n).padStart(2, "0");
const NEXT_KEYS = ["ArrowRight", "ArrowDown"];
const PREV_KEYS = ["ArrowLeft", "ArrowUp"];
const ART = ["story", "character", "frames"] as const;

/* ---------------------------------------------------------------- CSS 그림 */
function Art({
  index,
  props,
  tagged,
}: {
  index: number;
  props: BeforeMotionProps;
  tagged: boolean;
}) {
  const kind = ART[index] ?? "story";
  return (
    <div className="cs-svc-animation-art" data-art={kind}>
      <div className="cs-svc-animation-art-inner" aria-hidden="true">
        {kind === "story" ? (
          <div className="cs-svc-animation-story">
            <span className="cs-svc-animation-story-card">
              <span className="cs-t-caption">{props.story.label}</span>
              <span className="cs-svc-animation-story-line cs-t-h3">
                {props.story.line}
              </span>
            </span>
            <span className="cs-svc-animation-beats">
              {props.story.beats.map((beat, i) => (
                <span key={beat} className="cs-svc-animation-beat" data-beat={i + 1}>
                  <span className="cs-svc-animation-beat-frame">
                    <span className="cs-svc-animation-frame-ground" />
                    <span className="cs-svc-animation-frame-char" />
                    <span className="cs-svc-animation-frame-prop" />
                  </span>
                  <span className="cs-t-caption">{beat}</span>
                </span>
              ))}
            </span>
          </div>
        ) : null}
        {kind === "character" ? (
          <div className="cs-svc-animation-sheet">
            {props.views.map((view, i) => (
              <span
                key={view}
                className="cs-svc-animation-figure"
                data-view={i === 0 ? "front" : "side"}
              >
                <span className="cs-svc-animation-figure-head">
                  <span className="cs-svc-animation-figure-eye" />
                  <span className="cs-svc-animation-figure-eye" />
                </span>
                <span className="cs-svc-animation-figure-body" />
                <span className="cs-svc-animation-figure-label cs-t-caption">
                  {view}
                </span>
              </span>
            ))}
          </div>
        ) : null}
        {kind === "frames" ? (
          <div className="cs-svc-animation-frames">
            {props.frames.map((frame, i) => (
              <span
                key={frame}
                className="cs-svc-animation-frame"
                data-frame={i + 1}
              >
                <span className="cs-svc-animation-frame-num cs-t-caption">
                  {pad2(i + 1)}
                </span>
                <span className="cs-svc-animation-frame-ground" />
                <span className="cs-svc-animation-frame-char" />
                <span className="cs-svc-animation-frame-prop" />
                <span className="cs-svc-animation-frame-label cs-t-caption">
                  {frame}
                </span>
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {tagged ? <CsTag overlay>{MEDIA_TAGS.staged}</CsTag> : null}
    </div>
  );
}

/* ---------------------------------------------------------------- 항목 내용 */
function Content({
  index,
  props,
  sizer = false,
}: {
  index: number;
  props: BeforeMotionProps;
  sizer?: boolean;
}) {
  const item = props.items[index];
  if (sizer)
    return (
      <div className="cs-svc-animation-item is-sizer" aria-hidden="true">
        <div className="cs-svc-animation-item-copy">
          <div className="cs-t-h3">{item.title}</div>
          <div className="cs-t-body">{item.body}</div>
        </div>
        <Art index={index} props={props} tagged={false} />
      </div>
    );
  return (
    <div className="cs-svc-animation-item">
      <div className="cs-svc-animation-item-copy">
        <span className="cs-svc-animation-item-num cs-t-caption" aria-hidden="true">
          {pad2(index + 1)}
        </span>
        <h3 className="cs-t-h3">{item.title}</h3>
        <p className="cs-t-body">{item.body}</p>
      </div>
      <Art index={index} props={props} tagged />
    </div>
  );
}

/* ---------------------------------------------------------------- 탭 */
export function BeforeMotionTabs(props: BeforeMotionProps) {
  const { items, tabsLabel } = props;
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setReady(true);
  }, []);

  const select = (index: number, focus = false) => {
    const next = (index + items.length) % items.length;
    setCurrent(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number | null = null;
    if (NEXT_KEYS.includes(event.key)) next = current + 1;
    else if (PREV_KEYS.includes(event.key)) next = current - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  if (!ready)
    return (
      <ol className="cs-svc-animation-before" data-mode="list">
        {items.map((item, i) => (
          <li key={item.title}>
            <Content index={i} props={props} />
          </li>
        ))}
      </ol>
    );

  return (
    <div className="cs-svc-animation-before" data-mode="tabs">
      <div
        className="cs-svc-animation-tabs"
        role="tablist"
        aria-label={tabsLabel}
        onKeyDown={onKeyDown}
      >
        {items.map((item, i) => (
          <button
            key={item.title}
            ref={(node) => {
              tabRefs.current[i] = node;
            }}
            type="button"
            role="tab"
            id={tabId(i)}
            className="cs-svc-animation-tab cs-t-chip"
            aria-selected={i === current}
            aria-controls={PANEL_ID}
            tabIndex={i === current ? 0 : -1}
            onClick={() => select(i)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div
        className="cs-svc-animation-panel"
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={tabId(current)}
        tabIndex={0}
      >
        <div className="cs-svc-animation-stack">
          {items.map((item, i) => (
            <Content key={item.title} index={i} props={props} sizer={i !== current} />
          ))}
        </div>
      </div>
    </div>
  );
}
