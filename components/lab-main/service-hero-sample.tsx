"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./service-hero-sample.module.css";

const spaces = [
  {
    name: "공간",
    title: "빛과 여백을 따라",
    body: "공간의 분위기를 먼저 살펴보세요",
    image: "/lab/space-pc.webp",
  },
  {
    name: "머무름",
    title: "하루를 머무는 방식",
    body: "숙박 공간의 이야기와 시설을 함께 살펴보세요",
    image: "/lab/stay-pc.webp",
  },
];
const initialTasks = [
  {
    id: "01",
    title: "화면 구성 확인",
    detail: "기획 · 화면 목록과 탐색 순서",
    done: false,
  },
  {
    id: "02",
    title: "모바일 검수",
    detail: "검수 · 작은 화면의 선택 흐름",
    done: false,
  },
  {
    id: "03",
    title: "운영 자료 정리",
    detail: "인계 · 사용 방법과 확인 항목",
    done: true,
  },
];

function Window({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={styles.window}>
      <div className={styles.chrome}>
        <span aria-hidden="true" className={styles.dots}>
          •••
        </span>
        <span>{label}</span>
        <span aria-hidden="true">↗</span>
      </div>
      {children}
    </div>
  );
}

function WebsitePreview() {
  const [selected, setSelected] = useState(0);
  const space = spaces[selected];
  return (
    <Window label="SPACE INDEX / 공간을 탐색하는 웹사이트">
      <div className={styles.siteNav}>
        <b>여백의 기록</b>
        <span>SPACE & STAY</span>
      </div>
      <div className={styles.spaceImage}>
        <span className={styles.imageFallback}>공간과 머무름의 기록</span>
        {/* Existing concept artwork is kept as an image, never as the interactive UI. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={space.image}
          alt={`${space.name} 가상 브랜드 웹사이트 시안`}
        />
        <span className={styles.imageIndex}>0{selected + 1} / 02</span>
      </div>
      <div className={styles.spaceFooter}>
        <div role="status">
          <strong>{space.title}</strong>
          <p>{space.body}</p>
        </div>
        <div className={styles.choices} aria-label="웹사이트 장면 선택">
          {spaces.map((s, i) => (
            <button
              key={s.name}
              type="button"
              aria-pressed={selected === i}
              onClick={() => setSelected(i)}
            >
              {s.name} ↗
            </button>
          ))}
        </div>
      </div>
    </Window>
  );
}

function CommercePreview() {
  const [size, setSize] = useState("S");
  const [worn, setWorn] = useState(true);
  return (
    <Window label="FORME / 상품과 선택이 이어지는 쇼핑몰">
      <div className={styles.siteNav}>
        <b>FORME</b>
        <span>THE EVERYDAY EDIT</span>
      </div>
      <div className={styles.commerce}>
        <div
          className={styles.productPhoto}
          data-worn={worn}
          role="img"
          aria-label={`차콜 울 코트 ${worn ? "착용" : "상품"} 가상 이미지`}
        >
          <span>
            CHARCOAL
            <br />
            WOOL COAT
          </span>
        </div>
        <div className={styles.productCopy}>
          <p className={styles.micro}>COLLECTION / 01</p>
          <strong>
            일상에 남는
            <br />
            단정한 실루엣
          </strong>
          <p>
            더블 브레스트 울 코트
            <br />
            Charcoal
          </p>
          <fieldset className={styles.options}>
            <legend>사이즈 선택</legend>
            {["XS", "S", "M"].map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={size === s}
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </fieldset>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => setWorn((v) => !v)}
          >
            {worn ? "상품 이미지 보기" : "착용 이미지 보기"} ↗
          </button>
        </div>
      </div>
      <div className={styles.result} role="status">
        <span>선택한 옵션</span>
        <strong>Charcoal / {size}</strong>
      </div>
    </Window>
  );
}

function AutomationPreview() {
  const [missing, setMissing] = useState(false);
  const [result, setResult] = useState<null | boolean>(null);
  const change = (next: boolean) => {
    setMissing(next);
    setResult(null);
  };
  return (
    <Window label="FLOW / 입력부터 예외 확인까지">
      <div className={styles.flowHeader}>
        <p className={styles.micro}>WORKFLOW PREVIEW</p>
        <strong>
          반복은 연결하고
          <br />
          예외는 남깁니다
        </strong>
      </div>
      <div className={styles.flow}>
        <div className={styles.node}>
          <span>01 / INPUT</span>
          <b>자료 입력</b>
          <p>문의 자료 한 건</p>
        </div>
        <span className={styles.connector} aria-hidden="true">
          →
        </span>
        <div className={styles.node}>
          <span>02 / RULE</span>
          <b>필수 항목 대조</b>
          <p>연락처 확인</p>
        </div>
        <span className={styles.connector} aria-hidden="true">
          →
        </span>
        <div className={styles.node} data-resolved={result !== null}>
          <span>03 / RESULT</span>
          <b>
            {result === null ? "결과 대기" : result ? "보류 분기" : "정상 분기"}
          </b>
          <p>
            {result === null
              ? "직접 실행해보세요"
              : result
                ? "담당자 확인 필요"
                : "결과 정리 가능"}
          </p>
        </div>
      </div>
      <div className={styles.flowControls}>
        <div className={styles.choices} aria-label="자동화 입력 선택">
          <button
            type="button"
            aria-pressed={!missing}
            onClick={() => change(false)}
          >
            정상 자료
          </button>
          <button
            type="button"
            aria-pressed={missing}
            onClick={() => change(true)}
          >
            연락처 누락
          </button>
        </div>
        <button
          className={styles.primary}
          type="button"
          onClick={() => setResult(missing)}
        >
          흐름 실행 ↗
        </button>
      </div>
      <p className={styles.result} role="status">
        {result === null
          ? "입력을 고르고 흐름을 실행하세요"
          : result
            ? "보류 · 연락처를 확인한 뒤 다시 실행하세요"
            : "정상 · 필수 항목 확인 후 결과를 정리했습니다"}
      </p>
    </Window>
  );
}

function ProgramPreview() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("전체");
  const done = tasks.filter((t) => t.done).length;
  const shown = tasks.filter(
    (t) => filter === "전체" || (filter === "완료" ? t.done : !t.done),
  );
  return (
    <Window label="WORKSPACE / 팀에 맞는 관리 프로그램">
      <div className={styles.workspace}>
        <div className={styles.workspaceTitle}>
          <div>
            <p className={styles.micro}>PROJECT / SAMPLE</p>
            <strong>오늘의 작업 보드</strong>
          </div>
          <span className={styles.counter}>
            {done}
            <small> / {tasks.length} 완료</small>
          </span>
        </div>
        <div className={styles.choices} aria-label="작업 상태 필터">
          {["전체", "진행", "완료"].map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.taskList}>
          {shown.length ? (
            shown.map((t) => (
              <div className={styles.task} key={t.id}>
                <span className={styles.taskId}>{t.id}</span>
                <div>
                  <b>{t.title}</b>
                  <p>{t.detail}</p>
                </div>
                <button
                  type="button"
                  aria-pressed={t.done}
                  aria-label={`${t.title} ${t.done ? "진행으로 변경" : "완료로 변경"}`}
                  onClick={() =>
                    setTasks((list) =>
                      list.map((item) =>
                        item.id === t.id ? { ...item, done: !item.done } : item,
                      ),
                    )
                  }
                >
                  {t.done ? "완료 ✓" : "완료하기"}
                </button>
              </div>
            ))
          ) : (
            <p className={styles.empty}>진행 중인 작업이 없습니다</p>
          )}
        </div>
        <div className={styles.boardBottom}>
          <p role="status">
            진행 {tasks.length - done} · 완료 {done}
          </p>
          <button
            className={styles.textButton}
            type="button"
            onClick={() => {
              setTasks(initialTasks);
              setFilter("전체");
            }}
          >
            처음으로 ↺
          </button>
        </div>
      </div>
    </Window>
  );
}

export function ServiceHeroSample({ service }: { service: string }) {
  return (
    <div className={styles.sample} data-hero-sample={service}>
      <div className={styles.caption}>
        <span>LIVE PREVIEW</span>
        <span>가상 샘플 · 직접 눌러보세요</span>
      </div>
      {service === "website" ? (
        <WebsitePreview />
      ) : service === "shopping-mall" ? (
        <CommercePreview />
      ) : service === "automation" ? (
        <AutomationPreview />
      ) : (
        <ProgramPreview />
      )}
      <p className={styles.footnote}>
        기능 시연용 예시 · 실제 주문·저장·외부 발송 없음
      </p>
      <noscript>
        <p className={styles.footnote}>
          현재는 초기 화면입니다 선택 체험은 JavaScript를 켜면 사용할 수
          있습니다
        </p>
      </noscript>
    </div>
  );
}
