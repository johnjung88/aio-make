"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import {
  ArrowUpRight,
  Boxes,
  Code2,
  FileText,
  Layers3,
  Play,
  Square,
  Workflow,
} from "lucide-react";
import styles from "./system-canvas.module.css";

const maps = {
  web: [
    {
      name: "브랜드 정보",
      code: "content.source",
      detail: "회사와 서비스의 핵심 정보를 정리합니다",
      icon: FileText,
      surface: "CONTENT",
    },
    {
      name: "읽히는 구조",
      code: "structure.schema",
      detail: "정보의 순서와 페이지의 의미를 설계합니다",
      icon: Code2,
      surface: "STRUCTURE",
    },
    {
      name: "사용자 경험",
      code: "interface.state",
      detail: "탐색과 선택이 실제 행동으로 이어집니다",
      icon: Layers3,
      surface: "INTERFACE",
    },
    {
      name: "문의와 운영",
      code: "workflow.output",
      detail: "요청을 남기고 다음 업무로 연결합니다",
      icon: Workflow,
      surface: "OPERATIONS",
    },
  ],
  system: [
    {
      name: "요청 입력",
      code: "request.input",
      detail: "반복 업무의 시작점과 입력을 정합니다",
      icon: FileText,
      surface: "INPUT",
    },
    {
      name: "분류와 검증",
      code: "rules.validate",
      detail: "필수 정보를 확인하고 처리 경로를 나눕니다",
      icon: Code2,
      surface: "VALIDATE",
    },
    {
      name: "실행과 검수",
      code: "review.required",
      detail: "자동 처리와 사람이 확인할 지점을 구분합니다",
      icon: Layers3,
      surface: "REVIEW",
    },
    {
      name: "결과와 다음 작업",
      code: "handoff.ready",
      detail: "사용할 수 있는 결과와 다음 작업을 묶습니다",
      icon: Workflow,
      surface: "OUTPUT",
    },
  ],
};

export default function SystemCanvas() {
  const [mode, setMode] = useState<"web" | "system">("web");
  const [active, setActive] = useState(1);
  const [flat, setFlat] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(true);
  const surface = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const nodes = maps[mode];

  function stop() {
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = null;
    setPlaying(false);
  }
  useEffect(() => {
    const current = surface.current;
    if (!current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(current);
    return () => {
      observer.disconnect();
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);
  useEffect(() => {
    if (!visible && timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
      setPlaying(false);
    }
  }, [visible]);
  function play() {
    if (playing) {
      stop();
      return;
    }
    stop();
    setPlaying(true);
    setActive(0);
    let index = 0;
    const advance = () => {
      timer.current = window.setTimeout(() => {
        index += 1;
        if (index > 3) {
          setPlaying(false);
          timer.current = null;
          return;
        }
        setActive(index);
        advance();
      }, 850);
    };
    advance();
  }
  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
        .matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--tilt-x",
      (((event.clientX - rect.left) / rect.width) * 8 - 4).toFixed(2) + "deg",
    );
    event.currentTarget.style.setProperty(
      "--tilt-y",
      (((event.clientY - rect.top) / rect.height) * -6 + 3).toFixed(2) + "deg",
    );
  }

  return (
    <div
      className={styles.canvas}
      ref={surface}
      data-flat={flat}
      data-visible={visible}
      data-system-canvas
    >
      <div className={styles.canvasTop}>
        <span>
          <i /> SYSTEM CANVAS <b>/ 01</b>
        </span>
        <span className={styles.live}>INTERACTIVE</span>
      </div>
      <div className={styles.toolbar}>
        <div className={styles.modes} aria-label="구조 미리보기">
          {(["web", "system"] as const).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              onClick={() => {
                stop();
                setMode(value);
                setActive(1);
              }}
            >
              {value === "web" ? "웹 구조" : "운영 흐름"}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.viewButton}
          aria-pressed={flat}
          onClick={() => setFlat(!flat)}
        >
          <Boxes size={15} /> {flat ? "공간으로 보기" : "평면으로 보기"}
        </button>
      </div>
      <div
        className={styles.stage}
        onPointerMove={tilt}
        onPointerLeave={(event) => {
          event.currentTarget.style.setProperty("--tilt-x", "0deg");
          event.currentTarget.style.setProperty("--tilt-y", "0deg");
        }}
      >
        <div className={styles.sceneLabel}>
          {mode === "web" ? "A READABLE FOUNDATION" : "AN OPERATING SYSTEM"}
        </div>
        <div className={styles.halo} aria-hidden="true" />
        <div className={styles.assembly} aria-hidden="true">
          <div className={styles.floor}>
            <span /> <span /> <span />
          </div>
          {nodes.map((item, index) => (
            <div
              key={item.code}
              className={styles.layer}
              data-active={active === index}
              style={
                {
                  "--level": index,
                  "--column": index % 2,
                  "--row": Math.floor(index / 2),
                } as CSSProperties
              }
            >
              <div className={styles.layerEdges} />
              <span className={styles.layerIndex}>0{index + 1}</span>
              <div className={styles.layerLines}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <strong>{item.surface}</strong>
              <span className={styles.layerCode}>{item.code}</span>
              <div className={styles.layerMark}>
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          ))}
        </div>
        <div className={styles.sceneAxis}>
          <span>STRUCTURE</span>
          <span className={styles.axisLine} />
          <span>SYSTEM</span>
        </div>
        <button
          className={styles.playButton}
          type="button"
          onClick={play}
          aria-label={playing ? "연결 흐름 중지" : "연결 흐름 재생"}
        >
          {playing ? (
            <Square size={12} fill="currentColor" />
          ) : (
            <Play size={12} fill="currentColor" />
          )}
          {playing ? "연결 중" : "흐름 재생"}
        </button>
      </div>
      <div className={styles.ports} aria-label="구조 노드 선택">
        {nodes.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              type="button"
              key={item.code}
              aria-pressed={active === index}
              onClick={() => {
                stop();
                setActive(index);
              }}
            >
              <span className={styles.portNumber}>0{index + 1}</span>
              <Icon size={16} strokeWidth={1.5} />
              <span>{item.name}</span>
              <i />
            </button>
          );
        })}
      </div>
      <div className={styles.detail} aria-live="polite" aria-atomic="true">
        <span className={styles.detailNumber}>0{active + 1}</span>
        <div key={nodes[active].code} className={styles.detailCopy}>
          <span>{nodes[active].code}</span>
          <p>{nodes[active].detail}</p>
        </div>
        <ArrowUpRight size={17} />
      </div>
      <div className={styles.canvasFoot}>
        <span>노드를 눌러 연결을 살펴보세요</span>
        <span>DESIGNED TO CONNECT</span>
      </div>
    </div>
  );
}
