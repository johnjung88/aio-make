"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleCheck,
  CircleDot,
  Code2,
  Copy,
  FileText,
  Globe2,
  Layers3,
  LoaderCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Square,
  Workflow,
  X,
  AlertCircle,
  Plus,
} from "lucide-react";
import styles from "./lab-prototype.module.css";

const cx = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(" ");
const architecture = {
  web: [
    {
      name: "브랜드 정보",
      icon: FileText,
      detail: "회사와 서비스의 핵심 정보를 정리합니다",
      code: "content.source",
    },
    {
      name: "읽히는 구조",
      icon: Code2,
      detail: "정보의 순서와 페이지의 의미를 설계합니다",
      code: "structure.schema",
    },
    {
      name: "사용자 경험",
      icon: Layers3,
      detail: "탐색과 선택이 실제 행동으로 이어집니다",
      code: "interface.state",
    },
    {
      name: "문의와 운영",
      icon: Workflow,
      detail: "요청을 남기고 다음 업무로 연결합니다",
      code: "workflow.output",
    },
  ],
  system: [
    {
      name: "요청 입력",
      icon: FileText,
      detail: "반복 업무의 시작점과 입력을 정합니다",
      code: "request.input",
    },
    {
      name: "분류와 검증",
      icon: Code2,
      detail: "필수 정보를 확인하고 처리 경로를 나눕니다",
      code: "rules.validate",
    },
    {
      name: "실행과 검수",
      icon: ShieldCheck,
      detail: "자동 처리와 사람이 확인할 지점을 구분합니다",
      code: "review.required",
    },
    {
      name: "결과와 다음 작업",
      icon: Workflow,
      detail: "사용할 수 있는 결과와 다음 작업을 묶습니다",
      code: "handoff.ready",
    },
  ],
};
const examples = [
  {
    label: "웹사이트 의뢰",
    text: "브랜드 소개 웹사이트를 리뉴얼하고 싶어요. 서비스 소개와 제작 사례를 정리하고 문의로 연결하고 싶습니다.",
  },
  {
    label: "콘텐츠 의뢰",
    text: "신제품을 소개할 숏폼 영상을 만들고 싶어요. 제품 사진과 원고는 준비됐고 인스타그램과 유튜브에서 사용합니다.",
  },
  {
    label: "반복 보고 업무",
    text: "매주 여러 채널의 데이터를 모아 보고서를 만들고 있어요. 데이터 수집과 정리를 자동화하고 최종 검수는 직접 하고 싶습니다.",
  },
];
const steps = [
  { name: "입력 확인", detail: "필요한 정보가 있는지 확인" },
  { name: "작업 분류", detail: "요청에 맞는 경로 선택" },
  { name: "검수 지점", detail: "사람이 확인할 내용 정리" },
  { name: "결과 묶음", detail: "다음 업무로 이어질 목록" },
];
const services = [
  {
    id: "website",
    label: "웹사이트",
    number: "01",
    icon: Globe2,
    title: "정보가 잘 읽히고,\n문의로 이어지는 웹",
    text: "브랜드의 정보와 고객의 질문을 페이지 구조로 정리합니다",
    items: [
      "정보 구조와 실제 카피",
      "PC·모바일의 탐색 흐름",
      "문의·콘텐츠 운영 연결",
    ],
    code: "web.foundation",
    display: ["브랜드", "서비스", "사례", "문의"],
  },
  {
    id: "shopping-mall",
    label: "쇼핑몰",
    number: "02",
    icon: Layers3,
    title: "상품을 살펴보고,\n선택할 수 있는 화면",
    text: "상품의 정보와 필요한 구매 흐름에 맞춰 작업 범위를 정합니다",
    items: [
      "상품·브랜드 화면 구성",
      "카페24 스킨과 수정 범위",
      "상품·결제·배송의 연결 확인",
    ],
    code: "commerce.structure",
    display: ["상품", "목록", "선택", "구매"],
  },
  {
    id: "automation",
    label: "업무 자동화",
    number: "03",
    icon: Workflow,
    title: "반복은 연결하고,\n판단할 지점은 남깁니다",
    text: "입력부터 결과까지 실제 업무에 맞는 흐름을 설계합니다",
    items: [
      "입력·분류·처리의 연결",
      "검수·실패·재시도 흐름",
      "수동 처리와 복구 안내",
    ],
    code: "operations.workflow",
    display: ["입력", "분류", "검수", "결과"],
  },
  {
    id: "program",
    label: "대시보드·도구",
    number: "04",
    icon: Code2,
    title: "필요한 상태를 보고,\n다음 작업을 선택합니다",
    text: "업무에서 실제로 쓰는 데이터와 조작에 맞춰 화면을 만듭니다",
    items: [
      "업무 상태와 권한 설계",
      "필요한 데이터·도구 연결",
      "운영자 입력과 오류 처리",
    ],
    code: "tools.interface",
    display: ["데이터", "상태", "판단", "작업"],
  },
];
const process = [
  {
    title: "요청을 구조로",
    body: "현재 사이트와 반복 업무를 보고 실제 필요한 범위를 정리합니다",
    output: "요구사항 · 작업 범위 · 보존할 자료",
  },
  {
    title: "작동하는 원형",
    body: "핵심 화면을 직접 조작하며 선택·진행·실패와 복구를 확인합니다",
    output: "React 프로토타입 · PC/모바일 흐름",
  },
  {
    title: "구현과 검수",
    body: "합의한 기능을 구현하고 정상 흐름과 실패 상황을 함께 시험합니다",
    output: "실제 화면 · 기능 검수 기록",
  },
  {
    title: "인계와 운영",
    body: "결과물의 위치와 사용 방법, 사람이 이어서 처리할 방법을 정리합니다",
    output: "소스 · 실행 안내 · 복구 SOP",
  },
];
type RunState = "idle" | "running" | "completed" | "failed" | "cancelled";
type BriefResult = {
  service: string;
  category: string;
  deliverables: string[];
  review: string;
};
function classifyBrief(text: string): BriefResult {
  if (/영상|콘텐츠|숏폼|인스타|유튜브/.test(text))
    return {
      service: "automation",
      category: "콘텐츠 제작 요청",
      deliverables: [
        "제공 소재 확인",
        "채널별 제작 규격 정리",
        "장면 구성과 검수 목록",
      ],
      review: "브랜드 표현·소재 권리·최종 장면",
    };
  if (/자동화|보고서|데이터|반복/.test(text))
    return {
      service: "automation",
      category: "반복 업무 연결",
      deliverables: [
        "입력 데이터와 수집 경로",
        "처리·오류·재시도 규칙",
        "검수와 수동 복구 단계",
      ],
      review: "데이터 누락·판정 기준·최종 결과",
    };
  return {
    service: "website",
    category: "웹사이트 제작 요청",
    deliverables: [
      "사이트 목적과 정보 구조",
      "페이지·기능·제공 자료",
      "문의 흐름과 검수 기준",
    ],
    review: "핵심 카피·화면 구성·문의 연결",
  };
}
function normaliseAddress(input: string) {
  const value = input.trim();
  const parsed = new URL(
    /^https?:\/\//i.test(value) ? value : "https://" + value,
  );
  if (
    !["https:", "http:"].includes(parsed.protocol) ||
    parsed.username ||
    parsed.password ||
    !parsed.hostname.includes(".") ||
    parsed.hostname === "localhost"
  )
    throw new Error("공개 웹사이트 주소를 입력해 주세요");
  return parsed.hostname.replace(/^www\./, "");
}

export default function LabPrototype() {
  const [architectureMode, setArchitectureMode] = useState<"web" | "system">(
    "web",
  );
  const [node, setNode] = useState(1);
  const [example, setExample] = useState(0);
  const [brief, setBrief] = useState(examples[0].text);
  const [runState, setRunState] = useState<RunState>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [failureExample, setFailureExample] = useState(false);
  const [result, setResult] = useState<BriefResult | null>(null);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [processIndex, setProcessIndex] = useState(1);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [checkScenario, setCheckScenario] = useState<"ready" | "review">(
    "review",
  );
  const [expandedCheck, setExpandedCheck] = useState(0);
  const [draft, setDraft] = useState<string[]>([]);
  const [contactService, setContactService] = useState("website");
  const [copyState, setCopyState] = useState("");
  const timers = useRef<number[]>([]);
  const checkTimer = useRef<number | null>(null);
  const generation = useRef(0);
  const addressInput = useRef<HTMLInputElement>(null);
  const service = services[serviceIndex];
  const nodes = architecture[architectureMode];

  const clearRun = () => {
    generation.current += 1;
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };
  useEffect(
    () => () => {
      generation.current += 1;
      timers.current.forEach(window.clearTimeout);
      if (checkTimer.current !== null) window.clearTimeout(checkTimer.current);
    },
    [],
  );
  function resetRun() {
    clearRun();
    setRunState("idle");
    setActiveStep(-1);
    setResult(null);
  }
  function startRun(forceValid = false) {
    clearRun();
    setResult(null);
    setRunState("running");
    setActiveStep(0);
    const currentGeneration = generation.current;
    const shouldFail =
      (!forceValid && failureExample) || brief.trim().length < 12;
    const computed = classifyBrief(brief);
    [600, 1250, 1950, 2650].forEach((time, index) => {
      timers.current.push(
        window.setTimeout(() => {
          if (generation.current !== currentGeneration) return;
          if (index === 0 && shouldFail) {
            clearRun();
            setRunState("failed");
            setActiveStep(0);
            return;
          }
          if (index === 3) {
            setActiveStep(4);
            setResult(computed);
            setRunState("completed");
          } else setActiveStep(index + 1);
        }, time),
      );
    });
  }
  function addToDraft(item: string, selectedService = service.id) {
    setDraft((previous) =>
      previous.includes(item) ? previous : [...previous, item],
    );
    setContactService(selectedService);
    setCopyState("");
  }
  async function copyDraft() {
    const text = [
      "AIO MAKE 개발 상담",
      services.find((item) => item.id === contactService)?.label,
      ...draft,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopyState("요청 내용을 복사했어요");
    } catch {
      setCopyState("아래 선택 내용을 문의 화면에 함께 남겨주세요");
    }
  }
  function startCheck(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAddressError("");
    setCheckResult(null);
    let host: string;
    try {
      host = normaliseAddress(address);
    } catch {
      setAddressError("example.com처럼 올바른 웹사이트 주소를 입력해 주세요");
      addressInput.current?.focus();
      return;
    }
    if (checkTimer.current !== null) window.clearTimeout(checkTimer.current);
    setCheckLoading(true);
    checkTimer.current = window.setTimeout(() => {
      setCheckResult(host);
      setCheckLoading(false);
    }, 1000);
  }
  const checks = [
    {
      title: "페이지의 대표 정보",
      state: "확인됨",
      text: "페이지 제목과 설명이 어떤 정보를 담는지 확인하는 자리입니다",
      detail: "예시: 회사명과 서비스가 드러나는 title과 description",
    },
    {
      title: "정보의 순서와 제목",
      state: checkScenario === "ready" ? "확인됨" : "보완 필요",
      text: "대표 제목과 하위 정보의 관계를 살펴봅니다",
      detail: "예시: H1 하나와 섹션 목적에 맞는 하위 제목 구조",
    },
    {
      title: "브랜드를 설명하는 근거",
      state: checkScenario === "ready" ? "확인됨" : "추가 확인",
      text: "회사·서비스·연락 정보가 일관되게 읽히는지 살펴봅니다",
      detail: "예시: 브랜드 기본 정보와 구조화 데이터의 내용 일치",
    },
  ];

  return (
    <div className={styles.page} data-lab-prototype>
      <div className={styles.sectionBar}>
        <a href="#lab-top" className={styles.sectionBrand}>
          <span className={styles.square} /> AIO ENGINEERING{" "}
          <span className={styles.barDivider}>/</span>
          <span>개발</span>
        </a>
        <nav aria-label="개발 페이지 탐색">
          <a href="#workflow">작동 방식</a>
          <a href="#capabilities">할 수 있는 일</a>
          <a href="#structure-check">
            구조 체크 <ArrowUpRight size={13} />
          </a>
        </nav>
        <span className={styles.previewBadge}>INTERACTIVE PROTOTYPE</span>
      </div>

      <section className={styles.hero} id="lab-top">
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <span className={styles.liveDot} /> WEB & AUTOMATION / ONE SYSTEM
          </div>
          <h1>
            AI가 읽고,
            <br />
            사람이 운영하는
            <br />
            <span>기반을 세웁니다</span>
          </h1>
          <p className={styles.heroLead}>
            브랜드의 정보가 잘 읽히는 웹부터
            <br className={styles.desktopBreak} /> 반복 업무가 이어지는 운영
            흐름까지
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryButton} href="#workflow">
              작동 방식 체험하기 <ArrowRight size={17} />
            </a>
            <a className={styles.textButton} href="#capabilities">
              개발 범위 살펴보기 <ArrowDown size={15} />
            </a>
          </div>
          <div className={styles.heroFoot}>
            <span>DESIGN THE STRUCTURE</span>
            <i />
            <span>BUILD THE FLOW</span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.window}>
            <div className={styles.windowBar}>
              <span className={styles.windowDots}>
                <i />
                <i />
                <i />
              </span>
              <span>aio / system.canvas</span>
              <span className={styles.livePill}>
                <i /> Live preview
              </span>
            </div>
            <div className={styles.canvasToolbar}>
              <div className={styles.segmented} aria-label="구조 미리보기">
                {(["web", "system"] as const).map((mode) => (
                  <button
                    type="button"
                    key={mode}
                    aria-pressed={architectureMode === mode}
                    onClick={() => {
                      setArchitectureMode(mode);
                      setNode(1);
                    }}
                  >
                    {mode === "web" ? "웹 구조" : "운영 흐름"}
                  </button>
                ))}
              </div>
              <span className={styles.canvasHint}>
                노드를 선택해 보세요 <CircleDot size={12} />
              </span>
            </div>
            <div className={styles.diagram}>
              <div className={styles.diagramCaption}>
                {architectureMode === "web"
                  ? "A READABLE FOUNDATION"
                  : "AN OPERATING SYSTEM"}
              </div>
              <svg
                className={styles.connections}
                viewBox="0 0 600 330"
                fill="none"
                aria-hidden="true"
              >
                <path d="M110 110H280Q300 110 300 130V190Q300 210 320 210H490" />
                <path d="M110 110V210H490" className={styles.dottedPath} />
                <path
                  d="M110 110H280Q300 110 300 130V190Q300 210 320 210H490"
                  className={styles.flowPath}
                />
              </svg>
              {nodes.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    className={cx(
                      styles.graphNode,
                      styles["node" + index],
                      index === node && styles.selectedNode,
                    )}
                    aria-pressed={node === index}
                    onClick={() => setNode(index)}
                  >
                    <span className={styles.nodeIcon}>
                      <Icon size={20} strokeWidth={1.5} />
                    </span>
                    <span>{item.name}</span>
                    <span className={styles.nodePort} />
                  </button>
                );
              })}
              <span className={styles.diagramAxis}>INPUT</span>
              <span className={styles.diagramAxisEnd}>OUTPUT</span>
            </div>
            <div className={styles.nodeDetail} aria-live="polite">
              <span className={styles.detailIndex}>0{node + 1}</span>
              <div>
                <span className={styles.mono}>{nodes[node].code}</span>
                <p>{nodes[node].detail}</p>
              </div>
              <ArrowUpRight size={17} />
            </div>
            <div className={styles.windowStatus}>
              <span>
                <i /> 모든 단계는 하나의 흐름으로
              </span>
              <span>4 NODES / CONNECTED</span>
            </div>
          </div>
          <div className={styles.visualCaption}>
            <span className={styles.plusMark}>+</span>
            <span>화면의 뒤편에서, 운영의 다음 단계까지</span>
            <span>01 — 04</span>
          </div>
        </div>
      </section>

      <div className={styles.connectionStrip}>
        <span>서로 이어지는 네 가지 역할</span>
        <div>
          <a href="#capabilities">
            <b>01</b> 발견
          </a>
          <ChevronRight size={13} />
          <Link href="/marketing">
            <b>02</b> 인용
          </Link>
          <ChevronRight size={13} />
          <Link href="/content">
            <b>03</b> 기억
          </Link>
          <ChevronRight size={13} />
          <a href="#workflow">
            <b>04</b> 운영
          </a>
        </div>
        <span>ONE SYSTEM, CONNECTED</span>
      </div>

      <section className={styles.workflowSection} id="workflow">
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.eyebrow}>01 / INTERACTIVE WORKFLOW</div>
            <h2>
              한 번의 요청이
              <br />
              다음 작업이 되기까지
            </h2>
          </div>
          <p>
            입력하고, 분류하고, 검수하는 흐름
            <br />
            직접 실행하며 연결 지점을 확인하세요
          </p>
        </div>
        <div className={styles.workflowPanel}>
          <div className={styles.workflowInput}>
            <div className={styles.panelLabel}>
              <span>
                <span className={styles.liveDot} /> REQUEST INPUT
              </span>
              <span>01</span>
            </div>
            <div className={styles.exampleTabs} aria-label="자동화 요청 예제">
              {examples.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={example === index}
                  disabled={runState === "running"}
                  onClick={() => {
                    resetRun();
                    setExample(index);
                    setBrief(item.text);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <label className={styles.inputLabel} htmlFor="lab-brief">
              요청 내용을 바꿔 실행할 수 있어요
            </label>
            <textarea
              id="lab-brief"
              value={brief}
              onChange={(event) => {
                resetRun();
                setBrief(event.target.value);
              }}
              disabled={runState === "running"}
              rows={4}
              maxLength={800}
            />
            <div className={styles.requestMeta}>
              <span>
                <FileText size={13} /> 예제 규칙으로 처리하는 동작 데모
              </span>
              <span>{brief.length}/800</span>
            </div>
            <div className={styles.runControls}>
              {runState === "running" ? (
                <button
                  type="button"
                  className={styles.runButton}
                  onClick={() => {
                    clearRun();
                    setRunState("cancelled");
                  }}
                >
                  <Square size={14} /> 실행 중지
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.runButton}
                  onClick={() => startRun()}
                >
                  <Play size={15} fill="currentColor" />{" "}
                  {runState === "completed" ? "다시 실행하기" : "흐름 실행하기"}
                  <ArrowRight size={16} />
                </button>
              )}
              <button
                type="button"
                className={styles.resetButton}
                aria-label="자동화 데모 초기화"
                onClick={resetRun}
              >
                <RotateCcw size={17} />
              </button>
            </div>
            <button
              type="button"
              className={cx(
                styles.failureToggle,
                failureExample && styles.failureActive,
              )}
              aria-pressed={failureExample}
              disabled={runState === "running"}
              onClick={() => {
                setFailureExample(!failureExample);
                resetRun();
              }}
            >
              <span className={styles.switchTrack}>
                <i />
              </span>
              누락 자료가 있을 때도 확인하기
            </button>
          </div>
          <div className={styles.workflowOutput}>
            <div className={styles.outputHeading}>
              <span className={styles.mono}>WORKFLOW / EXECUTION</span>
              <span
                className={cx(
                  styles.runStatus,
                  runState === "completed" && styles.statusComplete,
                )}
                role="status"
              >
                {runState === "running" ? (
                  <>
                    <LoaderCircle size={12} className={styles.spin} /> 실행 중
                  </>
                ) : runState === "completed" ? (
                  <>
                    <Check size={12} /> 검수 준비 완료
                  </>
                ) : runState === "failed" ? (
                  "입력 확인 필요"
                ) : runState === "cancelled" ? (
                  "중지됨"
                ) : (
                  "실행 대기"
                )}
              </span>
            </div>
            <ol className={styles.pipeline}>
              {steps.map((step, index) => {
                const complete = activeStep > index;
                const current = activeStep === index;
                const failed = runState === "failed" && index === 0;
                return (
                  <li
                    key={step.name}
                    className={cx(
                      complete && styles.stepComplete,
                      current && runState === "running" && styles.stepRunning,
                      failed && styles.stepFailed,
                    )}
                  >
                    <span className={styles.stepIcon}>
                      {failed ? (
                        <AlertCircle size={15} />
                      ) : complete ? (
                        <Check size={15} />
                      ) : current && runState === "running" ? (
                        <LoaderCircle size={15} className={styles.spin} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </span>
                    <div>
                      <strong>{step.name}</strong>
                      <span>{step.detail}</span>
                    </div>
                    <span className={styles.stepState}>
                      {complete
                        ? "DONE"
                        : failed
                          ? "REVIEW"
                          : current && runState === "running"
                            ? "RUNNING"
                            : "WAITING"}
                    </span>
                  </li>
                );
              })}
            </ol>
            <div className={styles.resultArea} aria-live="polite">
              {runState === "failed" ? (
                <div className={styles.errorResult}>
                  <AlertCircle size={18} />
                  <div>
                    <strong>요청의 필수 정보를 먼저 확인합니다</strong>
                    <p>
                      {brief.trim().length < 12
                        ? "만들고 싶은 작업을 조금 더 구체적으로 입력해 주세요"
                        : "자료가 빠진 요청은 자동으로 완료하지 않고 확인 단계에 남깁니다"}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (brief.trim().length < 12) {
                          setBrief(examples[example].text);
                          setRunState("idle");
                          setActiveStep(-1);
                        } else {
                          setFailureExample(false);
                          startRun(true);
                        }
                      }}
                    >
                      {brief.trim().length < 12
                        ? "예시 요청으로 입력 보완하기"
                        : "누락 자료를 보완하고 다시 실행하기"}{" "}
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              ) : result ? (
                <div className={styles.readyResult}>
                  <div>
                    <CircleCheck size={17} />
                    <span>검수할 작업 묶음</span>
                    <span>{result.category}</span>
                  </div>
                  <ul>
                    {result.deliverables.map((item) => (
                      <li key={item}>
                        <Check size={12} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p>
                    사람이 확인할 것 <b>{result.review}</b>
                  </p>
                  <button
                    type="button"
                    onClick={() => addToDraft(result.category, result.service)}
                  >
                    {draft.includes(result.category) ? (
                      <>
                        <Check size={13} /> 상담 목록에 담았어요
                      </>
                    ) : (
                      <>
                        이 흐름 상담에 담기 <Plus size={13} />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className={styles.awaitingResult}>
                  <Layers3 size={23} strokeWidth={1.2} />
                  <span>
                    {runState === "running"
                      ? "입력과 다음 작업을 연결하고 있습니다"
                      : runState === "cancelled"
                        ? "요청은 전송되지 않았어요 다시 실행할 수 있습니다"
                        : "실행하면 작업 목록과 검수 지점이 여기에 나타납니다"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.workflowFoot}>
          <span>
            <ShieldCheck size={14} /> 자동 처리의 끝에는 확인할 기준이 남습니다
          </span>
          <span>외부 AI 호출·실제 요청 전송 없이 동작하는 프로토타입</span>
        </div>
      </section>

      <section className={styles.capabilitiesSection} id="capabilities">
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.eyebrow}>02 / WHAT WE BUILD</div>
            <h2>
              필요한 곳부터 만들고,
              <br />
              이어질 부분을 연결합니다
            </h2>
          </div>
          <p>
            사이트를 만드는 일과 운영을 연결하는 일<br />
            지금 필요한 범위를 선택해 보세요
          </p>
        </div>
        <div className={styles.serviceLayout}>
          <div
            className={styles.serviceList}
            role="tablist"
            aria-label="개발 서비스"
          >
            {services.map((item, index) => (
              <button
                key={item.id}
                role="tab"
                id={"service-tab-" + index}
                aria-selected={serviceIndex === index}
                aria-controls="lab-service-panel"
                tabIndex={serviceIndex === index ? 0 : -1}
                type="button"
                onClick={() => setServiceIndex(index)}
                onKeyDown={(event) => {
                  const last = services.length - 1;
                  const next =
                    event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? last
                        : ["ArrowRight", "ArrowDown"].includes(event.key)
                          ? (index + 1) % services.length
                          : ["ArrowLeft", "ArrowUp"].includes(event.key)
                            ? (index + last) % services.length
                            : null;
                  if (next === null) return;
                  event.preventDefault();
                  setServiceIndex(next);
                  document.getElementById("service-tab-" + next)?.focus();
                }}
              >
                <span>{item.number}</span>
                <strong>{item.label}</strong>
                <ArrowUpRight size={19} />
              </button>
            ))}
          </div>
          <div
            className={styles.servicePanel}
            role="tabpanel"
            id="lab-service-panel"
            aria-labelledby={"service-tab-" + serviceIndex}
          >
            <div className={styles.serviceVisual}>
              <span className={styles.mono}>{service.code}</span>
              <div className={styles.miniBrowser}>
                <div>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.miniBrowserContent}>
                  <span className={styles.miniBrand}>
                    A<span>IO</span>
                  </span>
                  <div className={styles.miniNav}>
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className={styles.miniHeadline}>
                    {service.display[0]}
                    <br />
                    <span>{service.display[1]}</span>
                  </div>
                  <div className={styles.miniGrid}>
                    <i />
                    <i />
                    <i />
                  </div>
                  <span className={styles.miniAction}>
                    {service.display[2]} <ArrowRight size={13} />
                  </span>
                </div>
              </div>
              <div className={styles.visualLink}>
                <CircleDot size={13} />
                <span>{service.display.join(" → ")}</span>
              </div>
            </div>
            <div className={styles.serviceInfo}>
              <span className={styles.serviceNumber}>
                0{serviceIndex + 1} / CAPABILITY
              </span>
              <h3>
                {service.title.split("\n").map((line, index) => (
                  <span key={line}>
                    {index > 0 && <br />}
                    {line}
                  </span>
                ))}
              </h3>
              <p>{service.text}</p>
              <ul>
                {service.items.map((item) => (
                  <li key={item}>
                    <Check size={14} />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={styles.textButton}
                onClick={() => addToDraft(service.label, service.id)}
              >
                {draft.includes(service.label)
                  ? "상담 목록에 담았어요"
                  : "이 범위 상담에 담기"}{" "}
                {draft.includes(service.label) ? (
                  <Check size={15} />
                ) : (
                  <Plus size={15} />
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.checkSection} id="structure-check">
        <div className={styles.checkIntro}>
          <div className={styles.eyebrow}>03 / A READABLE FOUNDATION</div>
          <h2>
            AI가 읽기 전에,
            <br />
            정보의 구조부터
          </h2>
          <p>
            어떤 정보가 있고, 어떻게 연결되는지
            <br />
            구조 체크의 결과 화면을 먼저 살펴보세요
          </p>
          <div className={styles.checkNote}>
            <CircleDot size={15} />
            <span>
              현재는 샘플 결과를 체험하는 화면입니다
              <br />
              입력한 사이트를 실제 수집하거나 판정하지 않습니다
            </span>
          </div>
        </div>
        <div className={styles.checkCard}>
          <div className={styles.checkCardHead}>
            <span>
              <Code2 size={16} /> STRUCTURE CHECK
            </span>
            <span>SAMPLE</span>
          </div>
          <form onSubmit={startCheck} noValidate>
            <label htmlFor="lab-url">확인할 웹사이트 주소</label>
            <div className={styles.urlInput}>
              <Globe2 size={16} />
              <input
                id="lab-url"
                ref={addressInput}
                inputMode="url"
                autoComplete="url"
                placeholder="example.com"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                aria-invalid={!!addressError}
                aria-describedby={addressError ? "lab-url-error" : undefined}
              />
              <button type="submit" disabled={checkLoading}>
                {checkLoading ? (
                  <LoaderCircle size={17} className={styles.spin} />
                ) : (
                  <ArrowRight size={18} />
                )}
                <span className={styles.srOnly}>샘플 구조 체크 실행</span>
              </button>
            </div>
            {addressError && (
              <p className={styles.fieldError} id="lab-url-error">
                {addressError}
              </p>
            )}
            <div className={styles.checkScenario}>
              <span>샘플 유형</span>
              {(["review", "ready"] as const).map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-pressed={checkScenario === value}
                  onClick={() => setCheckScenario(value)}
                >
                  {value === "review" ? "보완할 구조" : "정리된 구조"}
                </button>
              ))}
            </div>
          </form>
          {checkLoading ? (
            <div className={styles.checkLoading} role="status">
              <LoaderCircle size={22} className={styles.spin} />
              <p>결과 화면을 준비하고 있습니다</p>
            </div>
          ) : checkResult ? (
            <div className={styles.checkResults} aria-live="polite">
              <div className={styles.domainLabel}>
                <span>{checkResult}</span>
                <span>샘플 체크리스트</span>
              </div>
              {checks.map((item, index) => (
                <div key={item.title} className={styles.checkItem}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedCheck(expandedCheck === index ? -1 : index)
                    }
                    aria-expanded={expandedCheck === index}
                  >
                    <CircleCheck size={16} />
                    <strong>{item.title}</strong>
                    <span
                      className={cx(
                        styles.checkState,
                        item.state !== "확인됨" && styles.checkReview,
                      )}
                    >
                      {item.state}
                    </span>
                    <Plus
                      size={13}
                      className={expandedCheck === index ? styles.rotated : ""}
                    />
                  </button>
                  {expandedCheck === index && (
                    <p>
                      {item.text}
                      <br />
                      <span>{item.detail}</span>
                    </p>
                  )}
                </div>
              ))}
              <button
                type="button"
                className={styles.checkCta}
                onClick={() => addToDraft("웹사이트 정보 구조 점검", "website")}
              >
                {draft.includes("웹사이트 정보 구조 점검")
                  ? "상담 목록에 담았어요"
                  : "정보 구조 상담에 이어쓰기"}{" "}
                <ArrowUpRight size={14} />
              </button>
            </div>
          ) : (
            <div className={styles.checkPlaceholder}>
              <div>
                <span />
                <span />
                <span />
              </div>
              <p>주소를 입력하면 결과 화면을 체험할 수 있어요</p>
              <span>확인 근거 · 보완할 구조 · 다음 작업</span>
            </div>
          )}
        </div>
      </section>

      <section className={styles.processSection} id="process">
        <div className={styles.sectionHead}>
          <div>
            <div className={styles.eyebrow}>04 / BUILT TO KEEP WORKING</div>
            <h2>
              만드는 과정도,
              <br />
              이어 쓰는 방법도
            </h2>
          </div>
          <p>
            단계마다 직접 확인할 결과가 있습니다
            <br />각 단계를 선택해 살펴보세요
          </p>
        </div>
        <div className={styles.processGrid}>
          <div className={styles.processSteps}>
            {process.map((item, index) => (
              <button
                type="button"
                key={item.title}
                aria-pressed={processIndex === index}
                onClick={() => setProcessIndex(index)}
              >
                <span>0{index + 1}</span>
                <strong>{item.title}</strong>
                <ArrowRight size={16} />
              </button>
            ))}
          </div>
          <div className={styles.processDetail} aria-live="polite">
            <span className={styles.eyebrow}>
              DELIVERABLE / 0{processIndex + 1}
            </span>
            <h3>{process[processIndex].title}</h3>
            <p>{process[processIndex].body}</p>
            <div>
              <FileText size={18} />
              <span>{process[processIndex].output}</span>
              <Check size={16} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} id="lab-contact">
        <div className={styles.contactCopy}>
          <div className={styles.eyebrow}>LET’S CONNECT THE NEXT STEP</div>
          <h2>
            지금 필요한 작업부터
            <br />
            함께 정리합니다
          </h2>
          <p>
            만들고 싶은 화면이나 반복되는 업무를 알려주세요
            <br />
            현재 가진 자료에서 시작할 수 있는 범위를 찾습니다
          </p>
          <div className={styles.nextLinks}>
            <Link href="/marketing">
              인용될 근거 살펴보기 <ArrowUpRight size={14} />
            </Link>
            <Link href="/content">
              브랜드를 보여줄 작품 보기 <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        <div className={styles.contactDraft}>
          <div className={styles.draftHeading}>
            <span>선택한 상담 내용</span>
            <span>{String(draft.length).padStart(2, "0")}</span>
          </div>
          {draft.length ? (
            <ul>
              {draft.map((item) => (
                <li key={item}>
                  <Check size={14} />
                  <span>{item}</span>
                  <button
                    type="button"
                    aria-label={item + " 상담 목록에서 제거"}
                    onClick={() =>
                      setDraft((previous) =>
                        previous.filter((value) => value !== item),
                      )
                    }
                  >
                    <X size={14} />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.emptyDraft}>
              위에서 필요한 범위를 담거나
              <br />
              바로 상담을 시작할 수 있어요
            </p>
          )}
          <Link
            className={styles.primaryButton}
            href={"/lab/contact?service=" + encodeURIComponent(contactService)}
          >
            선택한 범위로 문의하기 <ArrowUpRight size={17} />
          </Link>
          {draft.length > 0 && (
            <button
              type="button"
              className={styles.copyButton}
              onClick={copyDraft}
            >
              <Copy size={13} /> 요청 내용 복사하기
            </button>
          )}
          <p className={styles.copyStatus} role="status">
            {copyState ||
              "선택 내용은 이 화면에만 보관되며 자동 전송되지 않습니다"}
          </p>
        </div>
      </section>
      <div className={styles.prototypeFoot}>
        <span>
          <CircleDot size={12} /> AIO MAKE / LAB PROTOTYPE
        </span>
        <span>직접 조작하는 화면 · 실제 제작 전 검토용</span>
      </div>
    </div>
  );
}
