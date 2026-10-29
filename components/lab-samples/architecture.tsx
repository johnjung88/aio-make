"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Layers3,
  Moon,
  MoveUpRight,
  RotateCcw,
  Sun,
} from "lucide-react";
import styles from "./samples.module.css";
import { InteractionHint } from "./interaction-hint";

const BuildingScene = dynamic(() => import("./building-scene"), {
  ssr: false,
  loading: () => (
    <div className={styles.sceneLoading}>
      <span />
      공간을 준비하고 있습니다
    </div>
  ),
});
export const FLOOR_INFO = [
  {
    name: "Ground floor",
    title: "사람과 마당이 만나는 층",
    area: "186",
    spaces: [
      {
        name: "라운지",
        detail: "큰 창을 따라 중정과 시선이 이어지는 환대의 공간",
        area: "62",
      },
      {
        name: "커뮤니티 테이블",
        detail: "입주자와 방문자가 자연스럽게 마주 앉는 공유 공간",
        area: "48",
      },
      {
        name: "프로젝트 갤러리",
        detail: "건축 모형과 재료를 가까이에서 살펴보는 전시 공간",
        area: "76",
      },
    ],
  },
  {
    name: "Creative floor",
    title: "집중과 협업 사이의 여백",
    area: "172",
    spaces: [
      {
        name: "오픈 스튜디오",
        detail: "빛이 깊이 들어오는 공동 작업실과 모형 제작 공간",
        area: "78",
      },
      {
        name: "미팅룸",
        detail: "중정을 향한 시야와 함께 프로젝트를 논의하는 공간",
        area: "42",
      },
      {
        name: "머티리얼 라이브러리",
        detail: "목재·석재·금속의 물성을 나란히 비교하는 자료실",
        area: "52",
      },
    ],
  },
  {
    name: "Private floor",
    title: "도시 위에 놓인 작은 쉼",
    area: "154",
    spaces: [
      {
        name: "루프 테라스",
        detail: "실내에서 바깥으로 일상이 확장되는 정원형 테라스",
        area: "42",
      },
      {
        name: "프라이빗 라운지",
        detail: "깊은 처마 아래 부드러운 빛을 받아들이는 휴식 공간",
        area: "48",
      },
      {
        name: "스테이 룸",
        detail: "방과 수납·욕실의 관계를 한눈에 읽을 수 있는 체류 공간",
        area: "64",
      },
    ],
  },
];
const STAGES = ["기초", "골조", "외장", "완성"];

export function FloorPlan({
  floor,
  room,
  onRoom,
}: {
  floor: number;
  room: number;
  onRoom: (room: number) => void;
}) {
  return (
    <div className={styles.floorPlan}>
      <svg
        viewBox="0 0 600 400"
        role="group"
        aria-label={`${floor + 1}층 평면도`}
      >
        <defs>
          <pattern
            id="planGrid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="#cbd0c7"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="600" height="400" fill="url(#planGrid)" />
        <path
          d="M45 50H555V350H45Z"
          fill="#eeeae1"
          stroke="#575c4f"
          strokeWidth="6"
        />
        <path d="M215 50V350M385 50V350" stroke="#575c4f" strokeWidth="5" />
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            onClick={() => onRoom(i)}
            role="button"
            tabIndex={0}
            aria-label={`${FLOOR_INFO[floor].spaces[i].name} 선택`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onRoom(i);
              }
            }}
          >
            <rect
              x={49 + i * 170}
              y="54"
              width="162"
              height="292"
              fill={i === room ? "#d6dfb0" : "#f6f3ed"}
            />
            <rect
              x={72 + i * 170}
              y="85"
              width="112"
              height="65"
              rx="5"
              fill="#d5c9b5"
            />
            <rect
              x={88 + i * 170}
              y="190"
              width="78"
              height="42"
              rx="6"
              fill="#c4b59b"
            />
            <circle cx={126 + i * 170} cy="280" r="20" fill="#b3c58f" />
            <text
              x={130 + i * 170}
              y="326"
              textAnchor="middle"
              fill="#414638"
              fontSize="14"
            >
              0{i + 1}
            </text>
          </g>
        ))}
      </svg>
      <span>N ↑</span>
    </div>
  );
}

export function ArchitectureSample({
  onConsult,
  active,
}: {
  onConsult: (value: string) => void;
  active: boolean;
}) {
  const [floor, setFloor] = useState(-1);
  const [room, setRoom] = useState(0);
  const [stage, setStage] = useState(3);
  const [exploded, setExploded] = useState(false);
  const [night, setNight] = useState(false);
  const [plan, setPlan] = useState(false);
  const [resetToken, setReset] = useState(0);
  const [interacted, setInteracted] = useState(false);
  const [sceneStatus, setSceneStatus] = useState<
    "loading" | "ready" | "failed"
  >("loading");
  const current = FLOOR_INFO[Math.max(0, floor)];
  const selectFloor = (i: number) => {
    setFloor(i);
    setRoom(0);
    setStage(3);
    if (i < 0) setPlan(false);
  };
  return (
    <div className={styles.architecture}>
      <div className={styles.archNav}>
        <span className={styles.archWordmark}>
          NEST<span>ARCHITECTS</span>
        </span>
        <nav aria-label="건축 사례 메뉴">
          <button
            type="button"
            onClick={() => {
              setFloor(-1);
              setPlan(false);
              setStage(3);
              setReset((n) => n + 1);
            }}
          >
            프로젝트
          </button>
          <button type="button" onClick={() => selectFloor(0)}>
            공간 탐색
          </button>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("architecture-story")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            설계 이야기
          </button>
        </nav>
        <span>SEOUL · 2026</span>
      </div>
      <div className={styles.archHeading} data-reveal>
        <div>
          <span className={styles.eyebrow}>
            SEONGSU COURTYARD / CONCEPT PROJECT
          </span>
          <h2>
            건물의 안쪽까지,
            <br />
            <em>공간의 이야기를 읽다</em>
          </h2>
        </div>
        <p>
          층을 고르고, 공간을 들여다보세요
          <br />
          도면 위의 정보가 입체적인 경험으로 이어집니다
        </p>
      </div>
      <div
        className={`${styles.archStage} ${night ? styles.night : ""}`}
        data-reveal
        onClickCapture={(event) => {
          if (
            event.target instanceof Element &&
            event.target.closest("button, input, [role=button]")
          )
            setInteracted(true);
        }}
      >
        <div className={styles.archScene}>
          {plan ? (
            <FloorPlan
              floor={Math.max(0, floor)}
              room={room}
              onRoom={(value) => {
                setInteracted(true);
                setRoom(value);
              }}
            />
          ) : (
            <BuildingScene
              floor={floor}
              room={room}
              stage={stage}
              exploded={exploded}
              night={night}
              resetToken={resetToken}
              active={active}
              onFloor={selectFloor}
              onRoom={setRoom}
              onInteract={() => setInteracted(true)}
              onStatus={setSceneStatus}
            />
          )}
        </div>
        <div className={styles.archTools}>
          <button
            type="button"
            onClick={() => setNight(!night)}
            aria-label={night ? "낮으로 보기" : "저녁으로 보기"}
          >
            {night ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setExploded(!exploded)}
            aria-pressed={exploded}
            aria-label="층을 분리해서 보기"
          >
            <Layers3 size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setReset((n) => n + 1);
              setFloor(-1);
              setExploded(false);
              setStage(3);
              setPlan(false);
              setRoom(0);
            }}
            aria-label="건물 시점 초기화"
          >
            <RotateCcw size={18} />
          </button>
        </div>
        <div className={styles.floorSelector} aria-label="건물 층 선택">
          {["ALL", "1F", "2F", "3F"].map((label, i) => (
            <button
              key={label}
              type="button"
              onClick={() => selectFloor(i - 1)}
              aria-pressed={floor === i - 1}
            >
              <span>{label}</span>
              <small>{i === 0 ? "건물 전체" : FLOOR_INFO[i - 1].name}</small>
              <MoveUpRight size={16} />
            </button>
          ))}
        </div>
        <aside className={styles.spaceCard} aria-live="polite">
          <div className={styles.spaceCardTop}>
            <span>
              {floor === -1
                ? "PROJECT OVERVIEW"
                : `${floor + 1}F / SPACE EXPLORER`}
            </span>
            <span className={styles.archDot} />
          </div>
          <h2>{floor === -1 ? "도시와 마당 사이" : current.title}</h2>
          <p>
            {floor === -1
              ? "외부의 빛, 내부의 동선, 층마다 달라지는 생활을 하나의 건물에서 탐색합니다"
              : current.spaces[room].detail}
          </p>
          <div className={styles.archMetrics}>
            <div>
              <strong>
                {floor === -1 ? "512" : current.spaces[room].area}
                <small>m²</small>
              </strong>
              <span>
                {floor === -1
                  ? "연면적 · 가상 설계"
                  : `${current.spaces[room].name} 면적`}
              </span>
            </div>
            <div>
              <strong>{floor === -1 ? "3" : `0${room + 1}`}</strong>
              <span>{floor === -1 ? "Floors" : "Selected space"}</span>
            </div>
          </div>
          {floor !== -1 && (
            <div className={styles.roomChoices}>
              {current.spaces.map((s, i) => (
                <button
                  type="button"
                  key={s.name}
                  aria-pressed={room === i}
                  onClick={() => setRoom(i)}
                >
                  <span>0{i + 1}</span>
                  {s.name}
                  <ArrowUpRight size={14} />
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            className={styles.archPlanToggle}
            onClick={() => {
              setPlan(!plan);
              if (floor === -1) setFloor(0);
            }}
          >
            {plan ? "입체 공간으로 돌아가기" : "평면도와 함께 보기"}
            <ArrowUpRight size={16} />
          </button>
        </aside>
        <div className={styles.constructionBar}>
          <div>
            <span>BUILDING IN PROGRESS</span>
            <strong>
              {STAGES[stage]}
              <small> {String(stage + 1).padStart(2, "0")} / 04</small>
            </strong>
          </div>
          <label>
            <span className={styles.srOnly}>건물이 지어지는 과정</span>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={stage}
              onChange={(e) => {
                setStage(Number(e.target.value));
                setFloor(-1);
                setPlan(false);
              }}
            />
            <span>
              {STAGES.map((s, i) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => {
                    setStage(i);
                    setFloor(-1);
                    setPlan(false);
                  }}
                  aria-pressed={stage === i}
                >
                  {s}
                </button>
              ))}
            </span>
          </label>
        </div>
      </div>
      <InteractionHint
        interacted={interacted}
        plan={plan || sceneStatus === "failed"}
      />
      <section className={styles.archStory} id="architecture-story">
        <div data-reveal>
          <span className={styles.eyebrow}>THE PROJECT, EXPLAINED</span>
          <h2>
            보이는 형태 너머의
            <br />
            설계 의도까지
          </h2>
          <p>
            건축사무소의 웹사이트가 프로젝트를 설명하는 방법
            <br />
            공간 선택과 도면, 재료와 동선이 함께 움직입니다
          </p>
          <span className={styles.conceptNote}>
            AIO 기능 시연을 위한 가상 건축 프로젝트
          </span>
        </div>
        <div className={styles.archStoryDetails}>
          <div>
            <span>01</span>
            <h3>층을 따라 읽는 공간</h3>
            <p>선택한 층과 공간의 용도·면적·설명을 함께 확인합니다</p>
          </div>
          <div>
            <span>02</span>
            <h3>시간을 따라 보는 건축</h3>
            <p>기초에서 골조, 외장과 완성으로 이어지는 과정을 살펴봅니다</p>
          </div>
          <button
            type="button"
            onClick={() =>
              onConsult(
                `관심 서비스: 건축사무소 웹사이트\n예시 프로젝트: 성수 코트야드\n선택: ${floor === -1 ? "건물 전체" : `${floor + 1}층 · ${current.spaces[room].name}`}\n관심 기능: 입체 공간 탐색, 층 분리, 평면 연동, 공정 타임라인\n표현: ${plan ? "평면" : "3D"} / ${night ? "저녁" : "낮"}`,
              )
            }
          >
            이 공간 경험으로 제작 상담하기
            <ArrowUpRight size={20} />
          </button>
        </div>
      </section>
      <div className={styles.archEnd}>
        <span>NEST / A CONCEPT BY AIO MAKE</span>
        <ArrowDown size={17} />
        <span>ARCHITECTURE AS AN EXPERIENCE</span>
      </div>
    </div>
  );
}
