"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Circle,
  Copy,
  Expand,
  Eye,
  Layers3,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import {
  initialStudyState,
  studyOutput,
  studyReducer,
} from "@/lib/lab-study-engine";
import StudyScene from "./scene";
import styles from "./studies.module.css";

export type Direction = "a" | "b" | "c";
const directionData = {
  a: {
    label: "SPATIAL SYSTEM",
    title: "시스템을 탐색하는 공간",
    reference: "Lusion",
    url: "https://lusion.co/",
  },
  b: {
    label: "SCROLL NARRATIVE",
    title: "스크롤로 풀리는 개발 스토리",
    reference: "basement.studio",
    url: "https://basement.studio/",
  },
  c: {
    label: "INTERACTIVE MACHINE",
    title: "직접 조작하는 시스템 실험실",
    reference: "Blobmixer / 14islands",
    url: "https://blobmixer.14islands.com/",
  },
};

function StudyHeader({
  direction,
  dark = false,
}: {
  direction?: Direction;
  dark?: boolean;
}) {
  return (
    <header className={`${styles.header} ${dark ? styles.headerDark : ""}`}>
      <Link
        className={styles.brand}
        href="/lab/studies"
        aria-label="AIO MAKE 세 시안 비교"
      >
        aio<span>make®</span>
      </Link>
      <nav aria-label="시안 비교" className={styles.directionNav}>
        {(["a", "b", "c"] as const).map((id) => (
          <Link
            key={id}
            href={`/lab/studies/${id}`}
            aria-current={direction === id ? "page" : undefined}
          >
            <span>{id.toUpperCase()}</span>
            <span className={styles.navTitle}>
              {directionData[id].label.split(" ")[0]}
            </span>
          </Link>
        ))}
      </nav>
      <Link className={styles.backLink} href="/lab/studies" aria-label="세 시안 비교로 돌아가기">
        <span>세 시안 비교</span>
        <ArrowUpRight size={17} />
      </Link>
    </header>
  );
}

function StudyFooter({ direction }: { direction: Direction }) {
  const next = direction === "a" ? "b" : direction === "b" ? "c" : "a";
  return (
    <footer className={styles.footer}>
      <div>
        <span className={styles.eyebrow}>
          DESIGN STUDY / {direction.toUpperCase()}
        </span>
        <p>화면과 핵심 체험을 비교하는 작동 시안입니다.</p>
        <a href={directionData[direction].url} target="_blank" rel="noreferrer">
          기준 장면: {directionData[direction].reference}
          <ArrowUpRight size={14} />
        </a>
      </div>
      <Link href={`/lab/studies/${next}`}>
        다음 시안 <b>{next.toUpperCase()}</b>
        <ArrowRight size={24} />
      </Link>
    </footer>
  );
}

export function StudyGallery() {
  const [preview, setPreview] = useState<Direction>("c");
  return (
    <div className={`${styles.site} ${styles.gallery}`}>
      <StudyHeader />
      <main className={styles.galleryMain}>
        <div className={styles.galleryTop}>
          <span className={styles.eyebrow}>
            AIO MAKE / DEVELOPMENT STUDIES / 01—03
          </span>
          <span>같은 목적. 서로 다른 세 가지 경험.</span>
        </div>
        <h1>
          How should
          <br />a system <em>feel?</em>
        </h1>
        <div className={styles.galleryIntro}>
          <p>
            웹과 자동화를 하나의 시스템으로.
            <br />세 가지 작동 시안에서 방향을 비교해 보세요.
          </p>
          <span>
            <MousePointer2 size={17} />
            선택하고, 움직이고, 시험해 보세요.
          </span>
        </div>
        <div
          className={styles.galleryDirections}
          onMouseLeave={() => setPreview("c")}
        >
          {(["a", "b", "c"] as const).map((id, index) => (
            <Link
              onMouseEnter={() => setPreview(id)}
              onFocus={() => setPreview(id)}
              className={styles.galleryDirection}
              href={`/lab/studies/${id}`}
              key={id}
              data-active={preview === id}
            >
              <div
                className={`${styles.directionArt} ${styles[`art${id.toUpperCase()}`]}`}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <i>
                  {id === "a"
                    ? "EXPLORE"
                    : id === "b"
                      ? "KEEP\nGOING."
                      : "INPUT →\nOUTPUT"}
                </i>
                <b>{id.toUpperCase()}</b>
              </div>
              <div className={styles.directionHeading}>
                <span>
                  0{index + 1} / {directionData[id].label}
                </span>
                <ArrowUpRight size={23} />
              </div>
              <h2>{directionData[id].title}</h2>
              <p>
                {id === "a"
                  ? "부품을 고르고, 3D 구조 속으로 이동합니다."
                  : id === "b"
                    ? "스크롤을 따라 문장이 구조와 흐름으로 바뀝니다."
                    : "조건을 바꾸고, 실제 분기와 결과를 확인합니다."}
              </p>
              <span className={styles.openStudy}>
                작동 시안 열기
                <ArrowRight size={18} />
              </span>
            </Link>
          ))}
        </div>
        <div className={styles.galleryNote}>
          <p>
            시각 표현 · 모션 연결감 · 조작의 의미 · 모바일 사용감을 함께
            비교합니다.
          </p>
          <Link href="/lab">
            기존 /lab 원형 보기
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </main>
    </div>
  );
}

const ports = [
  {
    title: "읽히는 웹",
    en: "READABLE WEB",
    code: "01",
    body: "사람이 찾고, AI가 이해하는 웹의 기반을 만듭니다.",
    tags: ["정보 구조", "페이지 경험", "AEO 기반"],
    detail:
      "명확한 정보의 계층과 다음 행동이 연결된 웹사이트. 검색과 AI가 읽을 수 있는 의미 구조를 함께 설계합니다.",
  },
  {
    title: "이어지는 데이터",
    en: "CONNECTED DATA",
    code: "02",
    body: "흩어진 정보를 모으고, 다음 판단에 연결합니다.",
    tags: ["수집", "정제", "대시보드"],
    detail:
      "입력의 출처와 변환 과정을 남깁니다. 필요한 데이터를 한 흐름에서 확인하고, 사람이 검수할 지점을 분명히 합니다.",
  },
  {
    title: "작동하는 자동화",
    en: "LIVING WORKFLOW",
    code: "03",
    body: "매번 하던 일을, 계속 작동하는 흐름으로 바꿉니다.",
    tags: ["조건 분기", "업무 연결", "반복 실행"],
    detail:
      "수집부터 분류, 실행, 결과 확인까지. 예외가 생겼을 때 멈추고 사람이 이어받을 수 있는 자동화를 만듭니다.",
  },
  {
    title: "운영의 통제권",
    en: "HUMAN CONTROL",
    code: "04",
    body: "상태를 보고, 멈추고, 다시 이어갈 수 있습니다.",
    tags: ["검수", "오류 복구", "인계"],
    detail:
      "운영자가 상태와 원인을 이해하고 수동으로 개입할 수 있게 설계합니다. 실행과 복구 방법도 시스템의 일부입니다.",
  },
];

function SpatialStudy() {
  const [focus, setFocus] = useState(-1);
  const [resetToken, setResetToken] = useState(0);
  const [paused, setPaused] = useState(false);
  const selected = focus < 0 ? null : ports[focus];
  return (
    <div className={`${styles.site} ${styles.spatial}`}>
      <StudyHeader direction="a" dark />
      <main>
        <section className={styles.spatialHero}>
          <div className={styles.spatialMeta}>
            <span className={styles.eyebrow}>A / SPATIAL SYSTEM</span>
            <span className={styles.live}>
              <i />
              SYSTEM EXPLORER
            </span>
          </div>
          <div className={styles.spatialCopy}>
            <h1>
              One system.
              <br />
              <em>
                Many moving
                <br />
                parts.
              </em>
            </h1>
            <p>
              읽히는 웹부터, 이어지는 운영까지.
              <br />
              하나의 시스템 안에서 살펴보세요.
            </p>
            <span className={styles.dragHint}>
              <MousePointer2 size={15} />
              드래그로 회전 · 부품을 눌러 탐색
            </span>
          </div>
          <div className={styles.spatialCanvas}>
            <StudyScene
              variant="spatial"
              focus={focus}
              resetToken={resetToken}
              paused={paused}
              onSelect={setFocus}
            />
            <div className={styles.sceneCoordinates}>
              AIO—CORE / 01
              <br />
              READ / CONNECT / RUN
            </div>
          </div>
          <div className={styles.spatialTools}>
            <button
              onClick={() => {
                setFocus(-1);
                setResetToken((value) => value + 1);
              }}
              aria-label="시스템 전체 보기"
            >
              <Expand size={17} />
              전체 보기
            </button>
            <button
              onClick={() => setPaused((value) => !value)}
              aria-pressed={paused}
            >
              {paused ? <Play size={16} /> : <Pause size={16} />}
              {paused ? "모션 재생" : "모션 정지"}
            </button>
          </div>
          <div className={styles.spatialInfo} key={focus}>
            <span>
              {selected
                ? `${selected.code} / ${selected.en}`
                : "EXPLORE THE CONNECTIONS"}
            </span>
            <h2>
              {selected ? (
                selected.title
              ) : (
                <>
                  각각의 부품이
                  <br />
                  하나의 흐름이 됩니다.
                </>
              )}
            </h2>
            <p>
              {selected
                ? selected.body
                : "아래 네 가지 연결을 선택해 구조와 역할을 확인하세요."}
            </p>
            {selected && (
              <div className={styles.tagRow}>
                {selected.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
          <div className={styles.portNavigation} aria-label="시스템 구성 탐색">
            {ports.map((port, index) => (
              <button
                key={port.code}
                aria-pressed={focus === index}
                onClick={() => setFocus(index)}
              >
                <span>{port.code}</span>
                <b>{port.title}</b>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
        </section>
        <section className={styles.spatialDetail}>
          <span className={styles.eyebrow}>THE PARTS / THE WHOLE</span>
          <h2>{selected ? selected.title : "만들고 끝내지 않습니다."}</h2>
          <p>
            {selected
              ? selected.detail
              : "웹사이트와 데이터를 연결하고, 반복 업무를 실행하고, 사람이 운영할 수 있는 기반을 만듭니다. 각 부품의 완성도와 부품 사이의 연결을 함께 설계합니다."}
          </p>
          <Link href="/lab/studies/c">
            실제로 조건을 바꿔보기
            <ArrowUpRight size={20} />
          </Link>
        </section>
      </main>
      <StudyFooter direction="a" />
    </div>
  );
}

const chapters = [
  {
    number: "01",
    title: "읽히는 구조.",
    en: "BE FOUND.",
    body: "필요한 정보가 명확한 계층을 갖습니다. 방문자가 이해하고, 검색과 AI가 읽을 수 있는 웹을 설계합니다.",
    label: "웹사이트 · 정보 설계 · AEO 기반",
  },
  {
    number: "02",
    title: "이어지는 흐름.",
    en: "STAY CONNECTED.",
    body: "웹에서 시작한 요청이 다음 업무로 이어집니다. 흩어진 데이터와 도구를 하나의 흐름으로 연결합니다.",
    label: "데이터 수집 · 연결 · 조건 분기",
  },
  {
    number: "03",
    title: "계속되는 운영.",
    en: "KEEP GOING.",
    body: "자동화의 상태를 확인하고, 예외를 검수하고, 필요하면 사람이 이어받습니다. 운영 방법까지 함께 만듭니다.",
    label: "자동화 · 검수 · 복구 · 인계",
  },
];

function StoryStudy() {
  const journey = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [chapter, setChapter] = useState(0);
  const [reveal, setReveal] = useState(55);
  useEffect(() => {
    let dead = false;
    let revert = () => {};
    async function setup() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (dead || !journey.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const context = gsap.context(() => {
        ScrollTrigger.create({
          trigger: journey.current,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            setProgress(self.progress);
            setChapter(Math.min(2, Math.floor(self.progress * 3)));
          },
        });
      }, journey);
      revert = () => context.revert();
    }
    setup();
    return () => {
      dead = true;
      revert();
    };
  }, []);
  const goChapter = (index: number) => {
    if (!journey.current) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const top = journey.current.getBoundingClientRect().top + window.scrollY;
    const distance = journey.current.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + distance * ((index + 0.4) / 3),
      behavior: reduced ? "instant" : "smooth",
    });
  };
  return (
    <div className={`${styles.site} ${styles.story}`}>
      <StudyHeader direction="b" />
      <main>
        <section className={styles.storyHero}>
          <div className={styles.storyHeroTop}>
            <span className={styles.eyebrow}>B / SCROLL NARRATIVE</span>
            <span>DESIGNED TO KEEP WORKING.</span>
          </div>
          <h1>
            BUILT TO
            <br />
            <span>KEEP</span>
            <br />
            GOING<span className={styles.storyDot}>.</span>
          </h1>
          <div className={styles.storyHeroBottom}>
            <p>
              읽히는 웹.
              <br />
              이어지는 데이터.
              <br />
              계속 작동하는 시스템.
            </p>
            <a href="#story-journey">
              스크롤하며 살펴보기
              <ArrowDown size={21} />
            </a>
            <span>
              ONE SYSTEM AGENCY
              <br />
              BASED IN KOREA / AIO MAKE
            </span>
          </div>
          <div className={styles.storyHeroOrbit} aria-hidden="true">
            <span>MAKE ↗</span>
          </div>
        </section>
        <div ref={journey} id="story-journey" className={styles.storyJourney}>
          <div className={styles.storySticky}>
            <div className={styles.storyProgress}>
              <span>FROM STRUCTURE TO OPERATION</span>
              <span>{chapters[chapter].number} / 03</span>
              <div style={{ transform: `scaleX(${progress})` }} />
            </div>
            <div className={styles.storyChapterText} key={chapter}>
              <span>{chapters[chapter].label}</span>
              <h2>{chapters[chapter].title}</h2>
              <p>{chapters[chapter].body}</p>
            </div>
            <div className={styles.storyCanvas}>
              <StudyScene variant="story" progress={progress} />
            </div>
            <strong className={styles.storyChapterWord}>
              {chapters[chapter].en}
            </strong>
            <nav className={styles.chapterNav} aria-label="스토리 장면 이동">
              {chapters.map((item, index) => (
                <button
                  key={item.number}
                  aria-pressed={chapter === index}
                  onClick={() => goChapter(index)}
                >
                  <span>{item.number}</span>
                  {item.title}
                  <ArrowUpRight size={15} />
                </button>
              ))}
            </nav>
          </div>
        </div>
        <section className={styles.storyCompare}>
          <div className={styles.storyCompareHeading}>
            <span className={styles.eyebrow}>CHANGE THE WAY IT WORKS</span>
            <h2>
              복잡함은 덜고.
              <br />
              <em>흐름은 남깁니다.</em>
            </h2>
            <p>핸들을 움직여 같은 업무의 두 구조를 비교해 보세요.</p>
          </div>
          <div className={styles.beforeAfter}>
            <div className={styles.afterDiagram}>
              <span>AFTER / CONNECTED SYSTEM</span>
              <div>
                <b>수집</b>
                <ArrowRight />
                <b>분류</b>
                <ArrowRight />
                <b>실행</b>
                <ArrowRight />
                <b>검수</b>
              </div>
              <p>연결된 경로 · 확인 가능한 상태 · 사람의 통제권</p>
            </div>
            <div
              className={styles.beforeDiagram}
              style={{ clipPath: `inset(0 ${100 - reveal}% 0 0)` }}
            >
              <span>BEFORE / DISCONNECTED TASKS</span>
              <div>
                {[
                  "메일 확인",
                  "복사",
                  "시트 입력",
                  "분류",
                  "파일 찾기",
                  "담당자 전달",
                ].map((text, index) => (
                  <b
                    key={text}
                    style={{ transform: `rotate(${index % 2 ? 6 : -5}deg)` }}
                  >
                    {text}
                  </b>
                ))}
              </div>
              <p>흩어진 업무 · 반복 입력 · 누락되는 맥락</p>
            </div>
            <div
              className={styles.compareHandle}
              style={{ left: `${reveal}%` }}
              aria-hidden="true"
            >
              <span>↔</span>
            </div>
            <input
              aria-label="업무 구조 비교 비율"
              type="range"
              min="5"
              max="95"
              value={reveal}
              onChange={(event) => setReveal(Number(event.target.value))}
            />
          </div>
          <span className={styles.sampleCaption}>
            구조를 설명하기 위한 자체 샘플입니다. 실제 고객 성과 수치가
            아닙니다.
          </span>
        </section>
        <section className={styles.storyClosing}>
          <span>WHAT HAPPENS NEXT?</span>
          <h2>
            당신의 다음 흐름을
            <br />
            함께 설계합니다.
          </h2>
          <Link href="/lab/studies/c">
            시스템 직접 시험하기
            <ArrowUpRight size={25} />
          </Link>
        </section>
      </main>
      <StudyFooter direction="b" />
    </div>
  );
}

const machineSteps = ["수집", "분류", "분기", "실행", "결과"];
const statusLabels = {
  idle: "실행 준비",
  running: "처리 중",
  paused: "일시정지",
  error: "실행 단계 응답 지연",
  complete: "처리 완료",
  manual: "수동 검수로 전환",
};

function MachineStudy() {
  const [required, setRequired] = useState(true);
  const [count, setCount] = useState(3);
  const [injectFailure, setInjectFailure] = useState(false);
  const [inspect, setInspect] = useState(0);
  const [copied, setCopied] = useState(false);
  const [state, dispatch] = useReducer(studyReducer, initialStudyState);
  const output = studyOutput(required, count, state);
  const policyOutput = studyOutput(required, count, initialStudyState);
  const done = state.status === "complete" || state.status === "manual";
  const busy = state.status === "running" || state.status === "paused";
  useEffect(() => {
    if (state.status !== "running") return;
    const timer = window.setTimeout(
      () => dispatch({ type: "tick", injectFailure }),
      950,
    );
    return () => window.clearTimeout(timer);
  }, [state.status, state.step, injectFailure]);
  useEffect(() => {
    if (state.step >= 0) setInspect(state.step);
  }, [state.step]);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  const reset = () => {
    dispatch({ type: "reset" });
    setInspect(0);
  };
  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(
        `검토 업무: 문의 분류\n샘플 ${count}건 / 연락처 확인 ${required ? "필수" : "생략"}\n초안 작성 ${output.draft}건 / 수동 확인 ${output.review}건\n고정 샘플을 사용한 화면 시안`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className={`${styles.site} ${styles.machine}`}>
      <StudyHeader direction="c" />
      <main>
        <section className={styles.machineIntro}>
          <div>
            <span className={styles.eyebrow}>C / INTERACTIVE MACHINE</span>
            <h1>
              Make it
              <br />
              <em>work.</em>
              <span>↗</span>
            </h1>
          </div>
          <div>
            <span className={styles.live}>
              <i />
              YOUR SYSTEM, IN YOUR HANDS.
            </span>
            <p>
              조건을 바꾸면, 흐름이 달라집니다.
              <br />
              실행하고 멈추고, 실패에서 복구해 보세요.
            </p>
            <span className={styles.samplePill}>
              고정 샘플 · 외부 전송 없음
            </span>
          </div>
        </section>
        <section
          className={styles.machineWorkbench}
          aria-label="자동화 시스템 실험"
        >
          <div className={styles.machineStage}>
            <div className={styles.workbenchTop}>
              <span>01 / INQUIRY ROUTER</span>
              <span className={styles.statusPill} data-status={state.status}>
                <i />
                {statusLabels[state.status]}
              </span>
            </div>
            <div className={styles.machineCanvas}>
              <StudyScene
                variant="machine"
                branch={required}
                running={state.status === "running"}
                fault={state.status === "error"}
                stage={state.step}
                volume={count}
                paused={state.status === "paused"}
              />
              <div className={styles.machineModelLabel}>
                REQUEST
                <br />
                ORCHESTRATOR<span>조건 → 경로 → 결과</span>
              </div>
            </div>
            <div className={styles.machineTimeline} aria-label="처리 단계">
              {machineSteps.map((label, index) => (
                <button
                  key={label}
                  data-state={
                    state.status === "manual" && index >= 3
                      ? "manual"
                      : state.status === "error" && index === 3
                        ? "error"
                        : state.step > index || state.status === "complete"
                          ? "done"
                          : state.step === index
                            ? "active"
                            : "waiting"
                  }
                  aria-pressed={inspect === index}
                  onClick={() => setInspect(index)}
                >
                  <span>
                    {state.status === "manual" && index >= 3 ? (
                      <ArrowUpRight size={13} />
                    ) : state.step > index || state.status === "complete" ? (
                      <Check size={13} />
                    ) : (
                      `0${index + 1}`
                    )}
                  </span>
                  <b>{label}</b>
                  <Eye size={13} />
                </button>
              ))}
            </div>
            <div className={styles.inspector} key={inspect}>
              <span>INSPECT / 0{inspect + 1}</span>
              <h3>
                {
                  [
                    "문의가 들어옵니다.",
                    "요청의 맥락을 나눕니다.",
                    "조건이 다음 경로를 정합니다.",
                    "각 경로에서 업무를 수행합니다.",
                    "결과와 다음 행동을 남깁니다.",
                  ][inspect]
                }
              </h3>
              <p>
                {
                  [
                    `${count}건의 고정 샘플 중 ${Math.ceil(count / 3)}건에 연락처가 없습니다.`,
                    "웹사이트 구축 문의로 분류합니다. 이 시안은 고정 규칙을 사용합니다.",
                    required
                      ? `연락처 누락 ${policyOutput.review}건은 수동 확인으로, ${policyOutput.draft}건은 초안 작성으로 연결합니다.`
                      : `연락처 확인을 생략해 ${count}건 모두 초안 작성으로 연결합니다.`,
                    state.status === "error"
                      ? "응답 지연을 주입했습니다. 재시도하거나 사람이 검수하도록 넘길 수 있습니다."
                      : state.failureConsumed
                        ? "재시도 경로로 복구했습니다. 처음부터 다시 분류하지 않고 이어서 처리합니다."
                        : "경로에 맞춰 제안서 초안 또는 확인 대기 항목을 만듭니다.",
                    done
                      ? `초안 ${output.draft}건 / 확인 대기 ${output.review}건. 아래에서 산출물을 확인하세요.`
                      : "실행을 마치면 초안과 확인 대기 항목을 구분해 보여줍니다.",
                  ][inspect]
                }
              </p>
            </div>
          </div>
          <aside className={styles.machineControls}>
            <div className={styles.controlsTitle}>
              <SlidersHorizontal size={19} />
              <span>시스템 설정</span>
              <span>EDIT</span>
            </div>
            <div className={styles.controlBlock}>
              <span className={styles.controlLabel}>대표 업무</span>
              <strong>웹사이트 문의 분류</strong>
              <p>요청을 읽고, 다음 행동으로 연결합니다.</p>
            </div>
            <fieldset disabled={busy} className={styles.controlFieldset}>
              <legend className={styles.controlLabel}>처리 조건</legend>
              <label className={styles.switchRow}>
                <span>
                  연락처 확인 필수
                  <small>누락된 요청은 수동 검수로 보냅니다.</small>
                </span>
                <input
                  type="checkbox"
                  checked={required}
                  onChange={(event) => {
                    setRequired(event.target.checked);
                    reset();
                  }}
                />
                <i aria-hidden="true" />
              </label>
              <label className={styles.rangeLabel} htmlFor="study-volume">
                샘플 요청 수{" "}
                <b>
                  {count}
                  <small>건</small>
                </b>
              </label>
              <input
                id="study-volume"
                type="range"
                min="3"
                max="9"
                step="3"
                value={count}
                onChange={(event) => {
                  setCount(Number(event.target.value));
                  reset();
                }}
              />
              <div className={styles.rangeTicks}>
                <span>3</span>
                <span>6</span>
                <span>9</span>
              </div>
              <div className={styles.routeSummary}>
                <span>
                  <i />
                  초안 작성<b>{policyOutput.draft}</b>
                </span>
                <span>
                  <i />
                  수동 확인<b>{policyOutput.review}</b>
                </span>
              </div>
            </fieldset>
            <fieldset disabled={busy} className={styles.controlFieldset}>
              <legend className={styles.controlLabel}>예외 상황</legend>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  checked={injectFailure}
                  onChange={(event) => {
                    setInjectFailure(event.target.checked);
                    reset();
                  }}
                />
                <span>
                  실행 단계에서 응답 지연 넣기
                  <small>복구 동작을 직접 시험합니다.</small>
                </span>
              </label>
            </fieldset>
            <div className={styles.runActions}>
              <button
                className={styles.runButton}
                onClick={() =>
                  dispatch({
                    type:
                      state.status === "running"
                        ? "pause"
                        : state.status === "paused"
                          ? "resume"
                          : "start",
                  })
                }
                disabled={state.status === "error"}
              >
                {state.status === "running" ? (
                  <Pause size={18} />
                ) : (
                  <Play size={18} fill="currentColor" />
                )}
                {state.status === "running"
                  ? "일시정지"
                  : state.status === "paused"
                    ? "이어서 실행"
                    : done
                      ? "다시 실행"
                      : "시스템 실행"}
                <ArrowUpRight size={19} />
              </button>
              <button
                className={styles.resetButton}
                onClick={reset}
                aria-label="실험 초기화"
              >
                <RotateCcw size={19} />
              </button>
            </div>
            <div className={styles.runFeedback} aria-live="polite">
              <span>{statusLabels[state.status]}</span>
              <p>
                {state.status === "idle"
                  ? "설정을 바꾼 뒤 실행해 보세요."
                  : state.status === "paused"
                    ? "현재 상태를 유지하고 있습니다."
                    : state.status === "running"
                      ? `${machineSteps[Math.max(0, state.step)]} 단계를 처리하고 있습니다.`
                      : state.status === "error"
                        ? "아래에서 복구 방법을 선택하세요."
                        : "산출물에서 경로별 차이를 확인하세요."}
              </p>
            </div>
            {state.status === "error" && (
              <div className={styles.recovery} role="alert">
                <b>흐름이 멈췄습니다.</b>
                <p>재시도하거나 수동 검수로 이어갈 수 있습니다.</p>
                <button onClick={() => dispatch({ type: "retry" })}>
                  <RotateCcw size={15} />이 단계 재시도
                </button>
                <button onClick={() => dispatch({ type: "manual" })}>
                  수동 검수로 전환
                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </aside>
        </section>
        <section className={styles.machineResults} aria-label="처리 산출물">
          <div className={styles.resultsTitle}>
            <div>
              <span className={styles.eyebrow}>THE OUTPUT</span>
              <h2>
                바뀐 조건.
                <br />
                달라진 결과.
              </h2>
            </div>
            <p>
              {done
                ? `샘플 ${count}건이 처리됐습니다.`
                : "실행을 마치면 결과가 여기에 남습니다."}
              <br />
              {done
                ? "각 요청이 어떤 경로를 거쳤는지 확인하세요."
                : "실제 생성·전송 대신 고정 샘플을 사용합니다."}
            </p>
          </div>
          <div className={styles.outputTable}>
            <div className={styles.outputTableHead}>
              <span>요청</span>
              <span>입력 상태</span>
              <span>처리 경로</span>
              <span>산출물</span>
            </div>
            {done ? (
              output.items.map((item) => (
                <div className={styles.outputRow} key={item.id}>
                  <span>{item.id}</span>
                  <span>
                    {item.contactMissing ? "연락처 누락" : "연락처 있음"}
                  </span>
                  <span data-review={item.route === "수동 확인"}>
                    {item.route === "수동 확인" ? (
                      <Circle size={12} />
                    ) : (
                      <Check size={14} />
                    )}
                    {item.route}
                  </span>
                  <span>{item.result}</span>
                </div>
              ))
            ) : (
              <div className={styles.emptyOutput}>
                <Layers3 size={32} />
                <span>다음 흐름을 기다리고 있습니다.</span>
              </div>
            )}
          </div>
          <div className={styles.outputBottom}>
            <span>고정 샘플 / 실제 AI 생성·문의 저장·외부 API 연동 없음</span>
            {done && (
              <button onClick={copySummary}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "검토 요약 복사됨" : "검토 요약 복사"}
              </button>
            )}
          </div>
        </section>
      </main>
      <StudyFooter direction="c" />
    </div>
  );
}

export function DirectionStudy({ direction }: { direction: Direction }) {
  return direction === "a" ? (
    <SpatialStudy />
  ) : direction === "b" ? (
    <StoryStudy />
  ) : (
    <MachineStudy />
  );
}
