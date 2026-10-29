"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from "react";
import {
  MessageCircle,
  Play,
  RotateCcw,
  Search,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { PlatformLogoMark } from "@/components/platform-frame/platform-frame";
import {
  getPlatformLogo,
  type PlatformLogoId,
} from "@/components/platform-frame/logos";
import {
  calendarScene,
  countUpMs,
  improveScene,
  insightScene,
  loopHintMs,
  marketingBrand,
  marketingCopy,
  marketingImages,
  marketingScenes,
  marketingStages,
  operateScenes,
  platformOrder,
  scenesOfStage,
  searchScene,
  stageProgress,
  typingStepMs,
  type Stat,
  type Tile,
} from "@/lib/home-journey-marketing";
import "./journey-marketing.css";

// 02 마케팅 단계(R7): 4단계 스테퍼 + 폰 시뮬레이터.
// 화면에 보이는 글자와 수치는 전부 lib/home-journey-marketing.ts의 값이다. 이 파일에는 문구와 숫자를 새로 쓰지 않는다.
// 자동 진행: 섹션이 50% 이상 보일 때만, reduced-motion이 아닐 때만. 호버·키보드 포커스·터치·직접 선택이면 멈춘다.
// 한 번에 장면 1개만 렌더하므로 동시에 움직이는 화면은 1개다.

const SCENE_COUNT = marketingScenes.length;
const LAST_SCENE = SCENE_COUNT - 1;

/** 섹션이 절반 이상 보이는지(탭이 숨겨지면 false)와 reduced-motion */
function useSectionActivity() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      setReduced(media.matches);
      setActive(visible && !document.hidden);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        update();
      },
      { threshold: 0.5 },
    );
    if (root.current) observer.observe(root.current);
    media.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return { root, active, reduced };
}

const NUMBER = /^(\d[\d,]*(?:\.\d+)?)(.*)$/;

function formatCount(value: number, decimals: number, grouped: boolean) {
  const text = value.toFixed(decimals);
  if (!grouped) return text;
  const [whole, fraction] = text.split(".");
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return fraction ? `${withCommas}.${fraction}` : withCommas;
}

/** 값 한 개. 움직임이 켜져 있으면 0에서 값까지 600ms 카운트업, 아니면 값 그대로 */
function Num({ value, animate }: { value: string; animate: boolean }) {
  const match = NUMBER.exec(value);
  const [text, setText] = useState(() =>
    animate && match
      ? formatCount(
          0,
          (match[1].split(".")[1] ?? "").length,
          match[1].includes(","),
        ) + match[2]
      : value,
  );
  useEffect(() => {
    const parts = NUMBER.exec(value);
    if (!parts || !animate) {
      setText(value);
      return;
    }
    const target = parseFloat(parts[1].replace(/,/g, ""));
    const decimals = (parts[1].split(".")[1] ?? "").length;
    const grouped = parts[1].includes(",");
    const suffix = parts[2];
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / countUpMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setText(
        t >= 1
          ? value
          : formatCount(target * eased, decimals, grouped) + suffix,
      );
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, animate]);
  return <>{text}</>;
}

/** 검색창 타이핑. 움직임이 꺼져 있으면 문장 전체 */
function Typed({ text, animate }: { text: string; animate: boolean }) {
  const [shown, setShown] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) {
      setShown(text.length);
      return;
    }
    setShown(0);
    let count = 0;
    const id = window.setInterval(() => {
      count += 1;
      setShown(count);
      if (count >= text.length) window.clearInterval(id);
    }, typingStepMs);
    return () => window.clearInterval(id);
  }, [text, animate]);
  return <>{text.slice(0, shown)}</>;
}

function Logo({ id }: { id: PlatformLogoId }) {
  return <PlatformLogoMark id={id} size={16} />;
}

function Thumb({ index, sizes }: { index: number; sizes: string }) {
  return (
    <Image
      className="wj-mk-img"
      src={marketingImages[index % marketingImages.length]}
      alt=""
      fill
      sizes={sizes}
      loading="lazy"
    />
  );
}

function Avatar() {
  return (
    <span className="wj-mk-avatar" aria-hidden="true">
      {marketingBrand.initial}
    </span>
  );
}

function StatRow({ stats, animate }: { stats: Stat[]; animate: boolean }) {
  return (
    <dl className="wj-mk-stats">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dt>{stat.label}</dt>
          <dd>
            <Num value={stat.value} animate={animate} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function TileGrid({
  label,
  tiles,
  animate,
  shape,
}: {
  label: string;
  tiles: Tile[];
  animate: boolean;
  shape: "reel" | "short";
}) {
  return (
    <section className="wj-mk-tiles-wrap">
      <p className="wj-mk-sub">{label}</p>
      <ul className="wj-mk-tiles" data-shape={shape}>
        {tiles.map((tile, index) => (
          <li key={index} className="wj-mk-tile">
            <Thumb index={tile.image} sizes="100px" />
            {tile.value ? (
              <span className="wj-mk-views">
                <Play aria-hidden="true" />
                <Num value={tile.value} animate={animate} />
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SearchScene({ animate }: { animate: boolean }) {
  return (
    <div className="wj-mk-body">
      <div className="wj-mk-search">
        <Search aria-hidden="true" />
        <span className="wj-mk-query">
          <Typed text={searchScene.query} animate={animate} />
          <i className="wj-mk-caret" aria-hidden="true" />
        </span>
      </div>
      <ul className="wj-mk-analysis" data-run={animate}>
        {searchScene.rows.map((row) => (
          <li key={row.key} className="wj-mk-analysis-row">
            <b className="wj-mk-chip">{row.key}</b>
            <span>{row.text}</span>
          </li>
        ))}
      </ul>
      <section className="wj-mk-plan-preview">
        <p className="wj-mk-sub">{calendarScene.title}</p>
        <ul>
          {calendarScene.rows.map((row) => (
            <li key={row.day}>
              <b>{row.day}</b>
              <span>{row.title}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CalendarScene() {
  return (
    <div className="wj-mk-body">
      <div className="wj-mk-head">
        <Avatar />
        <span className="wj-mk-head-text">
          <b>{marketingBrand.name}</b>
          <span>{calendarScene.title}</span>
        </span>
      </div>
      <ol className="wj-mk-days" aria-hidden="true">
        {calendarScene.days.map((day) => (
          <li key={day.label} data-on={day.on}>
            {day.label}
          </li>
        ))}
      </ol>
      <ul className="wj-mk-plan">
        {calendarScene.rows.map((row) => (
          <li key={row.day} className="wj-mk-plan-row">
            <b className="wj-mk-plan-day">{row.day}</b>
            <Logo id={row.platform} />
            <span className="wj-mk-plan-text">
              <span>{row.format}</span>
              <b>{row.title}</b>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfileHead({
  logo,
  title,
  stats,
  animate,
}: {
  logo: PlatformLogoId;
  title: string;
  stats: Stat[];
  animate: boolean;
}) {
  return (
    <>
      <div className="wj-mk-bar">
        <span className="wj-mk-bar-title">{title}</span>
        <Logo id={logo} />
      </div>
      <div className="wj-mk-profile" data-count={stats.length}>
        <Avatar />
        <span className="wj-mk-profile-text">
          <b>{marketingBrand.name}</b>
          <span>
            {marketingBrand.handle} · {marketingBrand.category}
          </span>
        </span>
        <StatRow stats={stats} animate={animate} />
      </div>
    </>
  );
}

function PlatformScene({
  id,
  animate,
}: {
  id: "instagram" | "youtube" | "tiktok" | "facebook";
  animate: boolean;
}) {
  if (id === "facebook") {
    const data = operateScenes.facebook;
    return (
      <div className="wj-mk-body">
        <ProfileHead
          logo="facebook"
          title={data.title}
          stats={data.stats}
          animate={animate}
        />
        <div className="wj-mk-post">
          <div className="wj-mk-post-media">
            <Thumb index={2} sizes="200px" />
          </div>
          <span className="wj-mk-line" aria-hidden="true" />
          <span className="wj-mk-line wj-mk-line--short" aria-hidden="true" />
          <p className="wj-mk-sub">{data.reactionsLabel}</p>
          <dl className="wj-mk-reactions">
            {data.reactions.map((item, index) => (
              <div key={item.label}>
                {index === 0 ? (
                  <ThumbsUp aria-hidden="true" />
                ) : index === 1 ? (
                  <MessageCircle aria-hidden="true" />
                ) : (
                  <Share2 aria-hidden="true" />
                )}
                <dt>{item.label}</dt>
                <dd>
                  <Num value={item.value} animate={animate} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    );
  }
  const data = operateScenes[id];
  return (
    <div className="wj-mk-body">
      <ProfileHead
        logo={id}
        title={data.title}
        stats={data.stats}
        animate={animate}
      />
      <TileGrid
        label={data.tilesLabel}
        tiles={data.tiles}
        animate={animate}
        shape={id === "instagram" ? "reel" : "short"}
      />
    </div>
  );
}

function InsightScene({ animate }: { animate: boolean }) {
  const [grown, setGrown] = useState(!animate);
  useEffect(() => {
    if (!animate) {
      setGrown(true);
      return;
    }
    setGrown(false);
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setGrown(true)),
    );
    return () => cancelAnimationFrame(frame);
  }, [animate]);
  return (
    <div className="wj-mk-body">
      <div className="wj-mk-bar">
        <span className="wj-mk-bar-title">{insightScene.title}</span>
        <span className="wj-mk-range">{insightScene.range}</span>
      </div>
      <dl className="wj-mk-kpis">
        {insightScene.kpis.map((kpi) => (
          <div key={kpi.label}>
            <dt>{kpi.label}</dt>
            <dd>
              <Num value={kpi.value} animate={animate} />
            </dd>
          </div>
        ))}
      </dl>
      <ul className="wj-mk-bars" data-grown={grown}>
        {insightScene.bars.map((bar) => (
          <li key={bar.platform} className="wj-mk-bar-row">
            <Logo id={bar.platform} />
            <span className="wj-mk-bar-track" aria-hidden="true">
              <i className="wj-mk-bar-fill" data-r={bar.ratio} />
            </span>
            <span className="wj-mk-bar-value">
              <Num value={bar.value} animate={animate} />
            </span>
          </li>
        ))}
      </ul>
      <section>
        <p className="wj-mk-sub">{insightScene.keywordsLabel}</p>
        <ol className="wj-mk-keywords">
          {insightScene.keywords.map((word) => (
            <li key={word}>{word}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ImproveScene({
  animate,
  showLoop,
}: {
  animate: boolean;
  showLoop: boolean;
}) {
  return (
    <div className="wj-mk-body">
      <div className="wj-mk-bar">
        <span className="wj-mk-bar-title">{improveScene.title}</span>
      </div>
      <ul className="wj-mk-ab">
        {improveScene.variants.map((variant) => (
          <li
            key={variant.key}
            className="wj-mk-ab-card"
            data-winner={variant.winner}
          >
            <div className="wj-mk-ab-media">
              <Thumb index={variant.image} sizes="120px" />
              <b className="wj-mk-ab-key">{variant.key}</b>
            </div>
            <span className="wj-mk-ab-name">{variant.name}</span>
            <span className="wj-mk-ab-views">
              <span>{variant.label}</span>
              <b>
                <Num value={variant.value} animate={animate} />
              </b>
            </span>
            {variant.winner ? (
              <span className="wj-mk-badge">{improveScene.winnerBadge}</span>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="wj-mk-faq">{improveScene.faq}</p>
      <p className="wj-mk-loop" data-show={showLoop}>
        <RotateCcw aria-hidden="true" />
        <span>{improveScene.loop}</span>
      </p>
    </div>
  );
}

function Fill({
  state,
  sceneIndex,
}: {
  state: "idle" | "done" | "active";
  sceneIndex: number;
}) {
  if (state !== "active")
    return <i className="wj-mk-fill" data-state={state} />;
  const { from, to } = stageProgress(sceneIndex);
  const duration = marketingScenes[sceneIndex].duration / 1000;
  return (
    <i
      key={sceneIndex}
      className="wj-mk-fill"
      data-state="active"
      data-from={from}
      data-p={to}
      data-d={duration}
    />
  );
}

export function JourneyMarketing() {
  const { root, active, reduced } = useSectionActivity();
  const [sceneIndex, setSceneIndex] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [held, setHeld] = useState(false);
  const [loopHint, setLoopHint] = useState(false);

  const scene = marketingScenes[sceneIndex];
  const stage = scene.stage;
  const running = active && !reduced && !hover && !focusIn && !held;
  const animate = active && !reduced;
  const showLoop = reduced || loopHint;

  // 섹션이 다시 보이면 장면 애니메이션을 처음부터 다시 그린다. 화면 밖으로 나가면 직접 선택한 멈춤을 푼다.
  useEffect(() => {
    if (active && !reduced) setEpoch((value) => value + 1);
    if (!active) setHeld(false);
  }, [active, reduced]);

  // 자동 진행: 실행 중일 때만 현재 장면 길이만큼 기다렸다가 다음 장면으로 넘어간다.
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setSceneIndex((index) => (index + 1) % SCENE_COUNT),
      scene.duration,
    );
    return () => window.clearTimeout(timer);
  }, [running, sceneIndex, epoch, scene.duration]);

  // 마지막 장면의 끝 0.8초: 01로 돌아가는 화살표를 보이고 01 행을 깜박인다.
  useEffect(() => {
    setLoopHint(false);
    if (!running || sceneIndex !== LAST_SCENE) return;
    const timer = window.setTimeout(
      () => setLoopHint(true),
      scene.duration - loopHintMs,
    );
    return () => window.clearTimeout(timer);
  }, [running, sceneIndex, epoch, scene.duration]);

  const choose = useCallback((index: number) => {
    setSceneIndex(index);
    setHeld(true);
  }, []);
  const chooseStage = (index: number) => choose(scenesOfStage(index)[0]);

  const onBlurCapture = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null))
      setFocusIn(false);
  };
  const onFocusCapture = (event: FocusEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).matches(":focus-visible"))
      setFocusIn(true);
  };

  let screen: ReactNode;
  switch (scene.id) {
    case "search":
      screen = <SearchScene animate={animate} />;
      break;
    case "calendar":
      screen = <CalendarScene />;
      break;
    case "insight":
      screen = <InsightScene animate={animate} />;
      break;
    case "improve":
      screen = <ImproveScene animate={animate} showLoop={showLoop} />;
      break;
    default:
      screen = <PlatformScene id={scene.id} animate={animate} />;
  }

  const stageState = (index: number): "idle" | "done" | "active" =>
    index === stage ? "active" : index < stage ? "done" : "idle";

  return (
    <div
      ref={root}
      className="wj-mk"
      role="group"
      aria-label={marketingCopy.sectionAria}
      data-stage={stage}
      data-scene={scene.id}
      data-running={running}
      data-loop={showLoop && stage === 3}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHover(true);
      }}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={onFocusCapture}
      onBlurCapture={onBlurCapture}
    >
      <p className="wj-mk-label">{marketingCopy.label}</p>

      <div
        className="wj-mk-progress"
        role="group"
        aria-label={marketingCopy.stepsAria}
      >
        {marketingStages.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="wj-mk-seg"
            aria-pressed={index === stage}
            aria-label={marketingCopy.stepButton(item.num, item.title)}
            onClick={() => chooseStage(index)}
          >
            <span className="wj-mk-track" aria-hidden="true">
              <Fill state={stageState(index)} sceneIndex={sceneIndex} />
            </span>
          </button>
        ))}
      </div>

      <div className="wj-mk-stage" onTouchStart={() => setHeld(true)}>
        <p
          className="wj-mk-output"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span>
            {marketingStages[stage].num} {marketingStages[stage].title}
          </span>
          <b>{marketingStages[stage].task}</b>
        </p>
        <p className="wj-mk-example">{marketingCopy.example}</p>
        <div
          className="wj-mk-phone"
          role="group"
          aria-label={marketingCopy.phoneAria}
        >
          <div className="wj-mk-device">
            <div className="wj-mk-screen">
              <span className="wj-mk-notch" aria-hidden="true" />
              {stage === 0 ? (
                <div
                  className="wj-mk-tabs"
                  role="group"
                  aria-label={marketingCopy.tabsAria}
                >
                  {[searchScene.tab, calendarScene.tab].map((label, index) => (
                    <button
                      key={label}
                      type="button"
                      className="wj-mk-tab"
                      aria-pressed={sceneIndex === index}
                      onClick={() => choose(index)}
                    >
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              ) : null}
              <div
                key={`${scene.id}-${epoch}`}
                className="wj-mk-scene"
                data-scene={scene.id}
              >
                {screen}
              </div>
            </div>
          </div>
        </div>
        <div
          className="wj-mk-logos"
          role="group"
          aria-label={marketingCopy.logosAria}
        >
          {platformOrder.map((id) => (
            <button
              key={id}
              type="button"
              className="wj-mk-logo"
              aria-pressed={scene.platform === id}
              aria-label={marketingCopy.logoButton(getPlatformLogo(id).name)}
              onClick={() =>
                choose(marketingScenes.findIndex((s) => s.platform === id))
              }
            >
              <PlatformLogoMark id={id} />
            </button>
          ))}
        </div>
      </div>

      <ol className="wj-mk-steps">
        {marketingStages.map((item, index) => (
          <li key={item.id} className="wj-mk-item">
            <button
              type="button"
              className="wj-mk-step"
              aria-current={index === stage ? "step" : undefined}
              data-blink={index === 0 && showLoop && stage === 3}
              onClick={() => chooseStage(index)}
            >
              <span className="wj-mk-step-head">
                <span className="wj-mk-num">{item.num}</span>
                <span className="wj-mk-name">{item.title}</span>
              </span>
              <span className="wj-mk-task">{item.task}</span>
              <span className="wj-mk-desc">
                {item.descLines?.length
                  ? item.descLines.map((line, lineIndex, lines) => (
                      <span className="wj-mk-desc-line" key={line}>
                        {line}
                        {lineIndex < lines.length - 1 ? " " : ""}
                      </span>
                    ))
                  : item.desc}
              </span>
              <span className="wj-mk-rowfill" aria-hidden="true">
                <Fill state={stageState(index)} sceneIndex={sceneIndex} />
              </span>
            </button>
          </li>
        ))}
      </ol>
      <noscript>
        <ol className="wj-mk-static">
          {marketingStages.map((item) => (
            <li key={item.id}>
              <b>
                {item.num} {item.title}
              </b>
              <p>{item.task}</p>
              <p>{item.desc}</p>
            </li>
          ))}
        </ol>
      </noscript>
    </div>
  );
}
