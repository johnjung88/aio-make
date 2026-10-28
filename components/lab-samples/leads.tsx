"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CircleHelp,
  Database,
  FileText,
  GitBranch,
  LoaderCircle,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  addProspect,
  csvCell,
  DEFAULT_LEADS,
  DEFAULT_MASTER,
  DEFAULT_RULES,
  leadsToCsv,
  parseLeadCsv,
  processLeads,
  type Customer,
  type LeadInput,
  type LeadResult,
  type LeadRules,
} from "@/lib/lab-case-engine";
import { SampleDialog } from "./dialog";
import styles from "./samples.module.css";

const STEPS = [
  { label: "RAW 수집", detail: "입력 데이터를 확인합니다", tool: "RAW / CSV" },
  {
    label: "원장 중복대조",
    detail: "같은 고객을 먼저 찾습니다",
    tool: "CUSTOMER MASTER",
  },
  {
    label: "Jev 선별",
    detail: "조건과 판단 이유를 남깁니다",
    tool: "JEV / SAMPLE RULES",
  },
  {
    label: "컨택 초안",
    detail: "정해진 가이드로 준비합니다",
    tool: "HERMES · ASIDE",
  },
  {
    label: "잠재고객 관리",
    detail: "고객 ID와 후속 일정을 잇습니다",
    tool: "ONE CUSTOMER RECORD",
  },
];
const STATUSES = {
  qualified: "선별",
  hold: "보류",
  duplicate: "중복",
  excluded: "확인 필요",
};
const GUIDE =
  "업종에 맞는 웹사이트·쇼핑몰·업무 자동화를 제작하는 AIO MAKE입니다\n현재 고객 유입과 반복 업무의 흐름을 먼저 살펴보고, 필요한 기능과 제작 범위를 함께 정리합니다";

export function LeadsSample({
  onConsult,
}: {
  onConsult: (summary: string) => void;
}) {
  const [inputs, setInputs] = useState<LeadInput[]>(() =>
    DEFAULT_LEADS.map((l) => ({ ...l })),
  );
  const [master, setMaster] = useState<Customer[]>(() =>
    DEFAULT_MASTER.map((c) => ({ ...c })),
  );
  const [rules, setRules] = useState<LeadRules>({ ...DEFAULT_RULES });
  const [guide, setGuide] = useState(GUIDE);
  const [results, setResults] = useState<LeadResult[]>([]);
  const [stage, setStage] = useState(-1);
  const [inspect, setInspect] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [fault, setFault] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState("RAW-01");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState("pipeline");
  const [logs, setLogs] = useState<string[]>([]);
  const [moved, setMoved] = useState<string[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);
  const [csvText, setCsvText] = useState(() => leadsToCsv(DEFAULT_LEADS));
  const [csvError, setCsvError] = useState("");
  const pipelineRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = pipelineRef.current;
    const step = strip?.children[inspect] as HTMLElement | undefined;
    if (strip && step && strip.scrollWidth > strip.clientWidth)
      strip.scrollTo({
        left: Math.max(0, step.offsetLeft - strip.offsetLeft - 12),
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  }, [inspect]);
  const preview = useMemo(
    () => processLeads(inputs, master, rules, guide),
    [inputs, master, rules, guide],
  );
  const counts = {
    duplicates: results.filter((r) => r.status === "duplicate").length,
    qualified: results.filter((r) => r.status === "qualified").length,
    held: results.filter((r) => r.status === "hold" || r.status === "excluded")
      .length,
  };
  const displayResults = stage >= 2 && inspect >= 2;
  const rows = (displayResults ? results : inputs).filter(
    (r) =>
      `${r.company} ${r.domain}`.toLowerCase().includes(search.toLowerCase()) &&
      (!displayResults ||
        filter === "all" ||
        ("status" in r &&
          (filter === "hold"
            ? r.status === "hold" || r.status === "excluded"
            : r.status === filter))),
  );
  const selectedInput = inputs.find((l) => l.id === selected) ?? inputs[0];
  const selectedResult = displayResults
    ? results.find((l) => l.id === selected)
    : undefined;
  const matchResult =
    stage >= 1 && inspect === 1
      ? (results.length ? results : preview).find((l) => l.id === selected)
      : undefined;
  const qualified =
    stage >= 3 ? results.filter((l) => l.status === "qualified") : [];
  const log = (message: string) =>
    setLogs((items) => [
      ...items,
      `${new Date().toLocaleTimeString("ko-KR", { hour12: false })}  ${message}`,
    ]);

  useEffect(() => {
    if (!running || paused || error || stage >= 3) return;
    const timer = setTimeout(() => {
      const next = stage + 1;
      if (next === 2 && fault) {
        setError(true);
        setRunning(false);
        setInspect(2);
        setLogs((items) => [
          ...items,
          "선별 지연 시연 · 같은 입력을 보존하고 재시도 대기",
        ]);
        return;
      }
      setStage(next);
      setInspect(next);
      if (next === 1)
        setLogs((items) => [
          ...items,
          `고객원장 ${master.length}건과 정규화 도메인 대조`,
        ]);
      if (next === 2) {
        setResults(preview);
        setLogs((items) => [
          ...items,
          `중복 ${preview.filter((l) => l.status === "duplicate").length}건 제외 · 조건과 선별 이유 생성`,
        ]);
      }
      if (next >= 3) {
        setRunning(false);
        setLogs((items) => [
          ...items,
          `컨택 초안 ${preview.filter((l) => l.status === "qualified").length}건 준비 · 검수 대기 · 외부 발송 없음`,
        ]);
      }
    }, 850);
    return () => clearTimeout(timer);
  }, [running, paused, error, stage, fault, preview, master.length]);

  const start = () => {
    if (running) {
      setPaused(!paused);
      return;
    }
    setError(false);
    setPaused(false);
    setResults([]);
    setMoved([]);
    setStage(0);
    setInspect(0);
    setFilter("all");
    setView("pipeline");
    setRunning(true);
    setLogs([`RAW ${inputs.length}건 입력 · 로컬 샘플 처리 시작`]);
  };
  const reset = () => {
    setRunning(false);
    setPaused(false);
    setError(false);
    setFault(false);
    setStage(-1);
    setInspect(0);
    setInputs(DEFAULT_LEADS.map((l) => ({ ...l })));
    setMaster(DEFAULT_MASTER.map((c) => ({ ...c })));
    setResults([]);
    setMoved([]);
    setLogs([]);
    setRules({ ...DEFAULT_RULES });
    setGuide(GUIDE);
    setFilter("all");
    setSearch("");
    setSelected("RAW-01");
    setView("pipeline");
  };
  const applyInputs = () => {
    try {
      const parsed = parseLeadCsv(csvText);
      setInputs(parsed);
      setSelected(parsed[0].id);
      setResults([]);
      setStage(-1);
      setInspect(0);
      setMoved([]);
      setFilter("all");
      setCsvOpen(false);
      setCsvError("");
      setLogs([`새 RAW ${parsed.length}건을 불러왔습니다`]);
    } catch (e) {
      setCsvError(e instanceof Error ? e.message : "CSV 형식을 확인해주세요");
    }
  };
  const move = (lead: LeadResult) => {
    if (
      running ||
      stage < 3 ||
      lead.status !== "qualified" ||
      moved.includes(lead.id)
    )
      return;
    setMaster((list) => addProspect(list, lead));
    setMoved((ids) => (ids.includes(lead.id) ? ids : [...ids, lead.id]));
    setStage(4);
    setInspect(4);
    log(
      `${lead.company} · ${lead.customerId} 유지 · 컨택 완료 시연 후 잠재고객으로 관리`,
    );
  };
  const download = () => {
    const data =
      view === "master"
        ? [
            ["고객ID", "회사", "도메인", "상태", "후속작업"],
            ...master.map((c) => [
              c.customerId,
              c.company,
              c.domain,
              c.status,
              c.followUp ?? "",
            ]),
          ]
        : [
            [
              "고객ID",
              "회사",
              "도메인",
              "판정",
              "점수",
              "판단이유",
              "컨택초안",
            ],
            ...results.map((r) => [
              r.customerId,
              r.company,
              r.normalizedDomain,
              STATUSES[r.status],
              r.score,
              r.reasons.join(" / "),
              r.draft,
            ]),
          ];
    const blob = new Blob(
      ["\uFEFF" + data.map((r) => r.map(csvCell).join(",")).join("\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download =
      view === "master"
        ? "aio-customer-master-demo.csv"
        : "aio-lead-results-demo.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    log("현재 결과를 CSV로 내보냈습니다");
  };
  return (
    <div className={styles.leads}>
      <div className={styles.leadIntro} data-reveal>
        <div>
          <span className={styles.eyebrow}>AIO / SALES OPERATIONS</span>
          <h2>
            리드를 찾는 일에서,
            <br />
            <em>관계를 이어가는 일까지</em>
          </h2>
        </div>
        <p>
          같은 고객을 두 번 접촉하지 않도록
          <br />
          수집·선별·컨택·후속 관리를 하나의 원장으로
        </p>
      </div>
      <div className={styles.workspace} data-reveal>
        <div className={styles.workspaceHeader}>
          <span className={styles.salesBrand}>
            <span>
              ai<span>o</span>
            </span>
            Sales workspace<small>DEMO</small>
          </span>
          <div className={styles.workspaceHealth}>
            <i />
            가상 데이터 · 규칙 기반 시연
          </div>
          <span className={styles.operatorAvatar}>A</span>
        </div>
        <div className={styles.workspaceNav}>
          {[
            { id: "pipeline", text: "리드 파이프라인", icon: GitBranch },
            { id: "master", text: "고객원장", icon: Database },
            { id: "drafts", text: "컨택 초안", icon: FileText },
            { id: "logs", text: "실행 기록", icon: ShieldCheck },
          ].map(({ id, text, icon: Icon }) => (
            <button
              type="button"
              key={id}
              aria-pressed={view === id}
              onClick={() => setView(id)}
            >
              <Icon size={16} />
              {text}
              {id === "master" && <small>{master.length}</small>}
              {id === "drafts" && <small>{qualified.length}</small>}
            </button>
          ))}
        </div>
        <div className={styles.workspaceBody}>
          <div className={styles.workspaceTitle}>
            <div>
              <span className={styles.workspaceCrumb}>
                Workspace <ChevronRight size={12} />{" "}
                {view === "master" ? "Customer master" : "Outbound pipeline"}
              </span>
              <h2>
                {view === "master"
                  ? "하나의 고객, 하나의 기록"
                  : view === "drafts"
                    ? "가이드에 맞춰 준비한 컨택"
                    : view === "logs"
                      ? "무엇을 처리했는지 남기는 기록"
                      : "발굴 고객 파이프라인"}
              </h2>
              <p>
                {view === "master"
                  ? "발굴과 잠재고객의 상태가 달라도 고객 ID는 유지됩니다"
                  : "입력을 바꾸고, 기준을 정하고, 실제 형식의 결과를 열어보세요"}
              </p>
            </div>
            <div className={styles.workspaceActions}>
              <button
                type="button"
                className={styles.lightButton}
                disabled={running}
                onClick={() => setSettingsOpen(true)}
              >
                <Settings2 size={15} />
                선별 조건
              </button>
              <button
                type="button"
                className={styles.runButton}
                onClick={start}
              >
                {running ? (
                  paused ? (
                    <Play size={15} />
                  ) : (
                    <Pause size={15} />
                  )
                ) : (
                  <Play size={15} />
                )}
                {running
                  ? paused
                    ? "이어 실행"
                    : "일시정지"
                  : stage >= 3
                    ? "다시 실행"
                    : "샘플 실행"}
              </button>
            </div>
          </div>
          <div className={styles.leadStats}>
            <div>
              <span>RAW 입력</span>
              <strong>
                {inputs.length}
                <small>건</small>
              </strong>
              <p>직접 바꿀 수 있는 원본</p>
            </div>
            <div>
              <span>중복 확인</span>
              <strong>
                {stage >= 2 ? counts.duplicates : "—"}
                <small>건</small>
              </strong>
              <p>원장 + 이번 수집분 대조</p>
            </div>
            <div>
              <span>선별 고객</span>
              <strong>
                {stage >= 2 ? counts.qualified : "—"}
                <small>건</small>
              </strong>
              <p>기준과 연락 경로 확인</p>
            </div>
            <div>
              <span>잠재고객 전환</span>
              <strong>
                {moved.length}
                <small>건</small>
              </strong>
              <p>고객 ID 그대로 후속 관리</p>
            </div>
          </div>
          {view === "pipeline" && (
            <>
              <div
                ref={pipelineRef}
                className={styles.pipeline}
                aria-label="영업 리드 처리 단계"
              >
                {STEPS.map((step, i) => (
                  <button
                    type="button"
                    key={step.label}
                    className={`${styles.pipelineStep} ${stage >= i ? styles.stepReached : ""} ${inspect === i ? styles.stepSelected : ""}`}
                    onClick={() => setInspect(i)}
                    disabled={i > Math.max(0, stage)}
                    aria-pressed={inspect === i}
                  >
                    <div>
                      <span>
                        {stage > i ? (
                          <Check size={14} />
                        ) : running && !paused && stage === i ? (
                          <LoaderCircle className={styles.spinning} size={14} />
                        ) : (
                          String(i + 1).padStart(2, "0")
                        )}
                      </span>
                      <small>{step.tool}</small>
                    </div>
                    <strong>{step.label}</strong>
                    <p>{step.detail}</p>
                    {i < 4 && (
                      <ArrowRight size={17} className={styles.pipelineArrow} />
                    )}
                  </button>
                ))}
              </div>
              <div className={styles.pipelineCaption}>
                <span>
                  <i className={running && !paused ? styles.liveDot : ""} />
                  {error
                    ? "선별 지연 시연 · 입력 보존됨"
                    : running
                      ? paused
                        ? "일시정지됨 · 이어 실행할 수 있습니다"
                        : `${STEPS[Math.min(stage, 4)].label} 처리 중`
                      : stage >= 3
                        ? `컨택 초안 ${qualified.length}건 준비 · 컨택 완료 시연 ${moved.length}건`
                        : "샘플 실행을 누르면 원본부터 결과까지 이어집니다"}
                </span>
                <button type="button" onClick={reset}>
                  <RotateCcw size={13} />
                  전체 초기화
                </button>
              </div>
              {error && (
                <div className={styles.pipelineError} role="alert">
                  <CircleHelp size={23} />
                  <div>
                    <strong>선별 단계의 지연을 시연했습니다</strong>
                    <p>
                      원본과 원장 대조 결과를 보존했습니다 · 실제 API 호출은
                      없습니다
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setError(false);
                      setFault(false);
                      setStage(1);
                      setRunning(true);
                      setPaused(false);
                      log("같은 입력으로 선별 단계 재시도");
                    }}
                  >
                    이 단계 재시도
                    <ArrowRight size={15} />
                  </button>
                </div>
              )}
              <div className={styles.leadDataLayout}>
                <div className={styles.leadTablePanel}>
                  <div className={styles.tableTitle}>
                    <div>
                      <h3>
                        {inspect === 0
                          ? "RAW 수집 데이터"
                          : inspect === 1
                            ? "고객원장과 중복 대조"
                            : inspect === 2
                              ? "선별 조건과 판단 근거"
                              : inspect === 3
                                ? "컨택 초안 검수 대기"
                                : "컨택 후 잠재고객 관리"}
                      </h3>
                      <span>
                        {inputs.length} records · 샘플 전용 .example 도메인
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles.lightButton}
                      disabled={running}
                      onClick={() => {
                        setCsvText(leadsToCsv(inputs));
                        setCsvOpen(true);
                        setCsvError("");
                      }}
                    >
                      <Plus size={14} />
                      CSV 바꾸기
                    </button>
                  </div>
                  <div className={styles.tableControls}>
                    <div>
                      {[
                        { id: "all", text: "전체" },
                        { id: "qualified", text: "선별" },
                        { id: "hold", text: "보류" },
                        { id: "duplicate", text: "중복" },
                      ].map((f) => (
                        <button
                          type="button"
                          key={f.id}
                          disabled={!displayResults && f.id !== "all"}
                          aria-pressed={filter === f.id}
                          onClick={() => setFilter(f.id)}
                        >
                          {f.text}
                        </button>
                      ))}
                    </div>
                    <label>
                      <Search size={14} />
                      <input
                        aria-label="고객명 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="고객 검색"
                      />
                    </label>
                  </div>
                  <div className={styles.leadTableScroll}>
                    <table className={styles.leadTable}>
                      <thead>
                        <tr>
                          <th>고객 / 회사</th>
                          <th>관심 서비스</th>
                          <th>예산</th>
                          <th>상태</th>
                          <th>적합도</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => {
                          const result =
                            "status" in row ? (row as LeadResult) : null;
                          return (
                            <tr
                              key={row.id}
                              data-selected={selected === row.id}
                              onClick={() => setSelected(row.id)}
                            >
                              <td>
                                <button
                                  type="button"
                                  onClick={() => setSelected(row.id)}
                                >
                                  <span className={styles.companyAvatar}>
                                    {row.company.slice(0, 1)}
                                  </span>
                                  <span>
                                    <strong>{row.company}</strong>
                                    <small>
                                      {row.domain || "도메인 확인 필요"}
                                    </small>
                                  </span>
                                </button>
                              </td>
                              <td>{row.service}</td>
                              <td>{row.budget.toLocaleString("ko-KR")}만원</td>
                              <td>
                                <span
                                  className={`${styles.statusBadge} ${result ? styles[result.status] : ""}`}
                                >
                                  {moved.includes(row.id)
                                    ? "잠재고객"
                                    : result
                                      ? STATUSES[result.status]
                                      : "수집"}
                                </span>
                              </td>
                              <td>
                                {result && result.status !== "duplicate" ? (
                                  <span className={styles.scoreCell}>
                                    <i style={{ width: `${result.score}%` }} />
                                    <b>{result.score}</b>
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {rows.length === 0 && (
                      <div className={styles.tableEmpty}>
                        조건에 맞는 고객이 없습니다
                      </div>
                    )}
                  </div>
                  <div className={styles.tableBottom}>
                    <span>
                      {rows.length}개 표시 / {inputs.length}개 원본
                    </span>
                    <button
                      type="button"
                      disabled={!results.length}
                      onClick={download}
                    >
                      <ArrowDownToLine size={14} />
                      결과 CSV
                    </button>
                  </div>
                </div>
                <aside className={styles.leadInspector} aria-live="polite">
                  <div className={styles.inspectorHeading}>
                    <span className={styles.eyebrow}>RECORD DETAILS</span>
                    <span className={styles.inspectorDot} />
                  </div>
                  <select
                    className={styles.recordSelect}
                    aria-label="상세 확인 고객"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                  >
                    {inputs.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.company}
                      </option>
                    ))}
                  </select>
                  <h3>{selectedInput?.company ?? "고객을 선택하세요"}</h3>
                  <span className={styles.inspectorDomain}>
                    {selectedResult?.normalizedDomain ||
                      matchResult?.normalizedDomain ||
                      selectedInput?.domain ||
                      "도메인 확인 필요"}
                  </span>
                  <div className={styles.inspectorId}>
                    <Database size={14} />
                    {selectedResult?.customerId ??
                      matchResult?.customerId ??
                      "실행 후 고객 ID 대조"}
                  </div>
                  {selectedResult ? (
                    <>
                      <div className={styles.decisionTitle}>
                        <span>선별 근거</span>
                        <span
                          className={`${styles.statusBadge} ${styles[selectedResult.status]}`}
                        >
                          {STATUSES[selectedResult.status]}
                        </span>
                      </div>
                      <ul className={styles.decisionReasons}>
                        {selectedResult.reasons.map((reason) => (
                          <li key={reason}>
                            <Check size={13} />
                            {reason}
                          </li>
                        ))}
                      </ul>
                      {selectedResult.draft && inspect >= 3 && stage >= 3 && (
                        <>
                          <div className={styles.draftHeading}>
                            <FileText size={14} />
                            가이드 기반 컨택 초안
                          </div>
                          <pre className={styles.draftPreview}>
                            {selectedResult.draft}
                          </pre>
                          <button
                            type="button"
                            className={styles.runButton}
                            disabled={
                              running ||
                              stage < 3 ||
                              moved.includes(selectedResult.id)
                            }
                            onClick={() => move(selectedResult)}
                          >
                            {moved.includes(selectedResult.id) ? (
                              <Check size={15} />
                            ) : (
                              <ArrowRight size={15} />
                            )}
                            {moved.includes(selectedResult.id)
                              ? "잠재고객 관리로 연결됨"
                              : "컨택 완료로 시연"}
                          </button>
                          <p className={styles.finePrint}>
                            외부 발송 없이 고객 상태와 후속 일정만 변경합니다
                          </p>
                        </>
                      )}
                      {inspect === 4 && (
                        <p className={styles.masterNote}>
                          {moved.includes(selectedResult.id)
                            ? "컨택 완료 시연 · 고객 ID 유지 · 3일 뒤 회신 확인"
                            : "이 고객은 아직 컨택 완료로 전환하지 않았습니다"}
                        </p>
                      )}
                    </>
                  ) : matchResult ? (
                    <div className={styles.beforeRun}>
                      <Database size={24} />
                      <p>
                        {matchResult.status === "duplicate"
                          ? "원장 또는 이번 RAW에서 같은 도메인을 확인했습니다 · 재접촉 대상에서 제외합니다"
                          : matchResult.normalizedDomain
                            ? "원장에 없는 도메인입니다 · 다음 단계에서 수요와 예산을 판단합니다"
                            : "도메인이 없어 대조할 수 없습니다 · 원본 확인이 필요합니다"}
                      </p>
                      <span>
                        이 단계에서는 선별 점수나 컨택 초안을 생성하지 않습니다
                      </span>
                    </div>
                  ) : (
                    <div className={styles.beforeRun}>
                      <Sparkles size={24} />
                      <p>
                        샘플을 실행하면 이 고객을 선택한 이유와 다음 작업을
                        확인할 수 있습니다
                      </p>
                      <span>
                        최소 예산 {rules.minBudget}만원
                        <br />
                        기준 점수 {rules.minScore}점 / 서비스 {rules.service}
                      </span>
                    </div>
                  )}
                </aside>
              </div>
            </>
          )}
          {view === "master" && (
            <div className={styles.masterView}>
              <div className={styles.tableTitle}>
                <div>
                  <h3>전체 고객원장</h3>
                  <span>원본을 복제하지 않고 고객 ID와 상태로 관리합니다</span>
                </div>
                <button
                  type="button"
                  className={styles.lightButton}
                  onClick={download}
                >
                  <ArrowDownToLine size={14} />
                  원장 CSV
                </button>
              </div>
              <div className={styles.masterList}>
                {master.map((c) => (
                  <div key={c.customerId}>
                    <span className={styles.companyAvatar}>
                      {c.company.slice(0, 1)}
                    </span>
                    <div>
                      <strong>{c.company}</strong>
                      <small>{c.domain}</small>
                    </div>
                    <code>{c.customerId}</code>
                    <span className={styles.statusBadge}>{c.status}</span>
                    <p>{c.followUp ?? "기존 거래 기록 확인"}</p>
                  </div>
                ))}
              </div>
              <p className={styles.masterNote}>
                <ShieldCheck size={17} />
                같은 도메인을 다시 수집해도 같은 고객으로 대조합니다
              </p>
            </div>
          )}
          {view === "drafts" && (
            <div className={styles.draftsView}>
              {qualified.length ? (
                qualified.map((lead) => (
                  <article key={lead.id}>
                    <div>
                      <span className={styles.statusBadge}>
                        {moved.includes(lead.id) ? "잠재고객" : "검수 대기"}
                      </span>
                      <span>{lead.customerId}</span>
                    </div>
                    <h3>{lead.company}</h3>
                    <small>To {lead.contact}</small>
                    <pre>{lead.draft}</pre>
                    <button
                      type="button"
                      className={styles.lightButton}
                      disabled={moved.includes(lead.id)}
                      onClick={() => move(lead)}
                    >
                      {moved.includes(lead.id)
                        ? "잠재고객 연결됨"
                        : "컨택 완료로 시연"}
                      <ArrowRight size={15} />
                    </button>
                  </article>
                ))
              ) : (
                <div className={styles.tableEmpty}>
                  <FileText size={27} />
                  <h3>아직 준비한 초안이 없습니다</h3>
                  <p>파이프라인을 실행하면 선별된 고객의 초안이 생성됩니다</p>
                </div>
              )}
            </div>
          )}
          {view === "logs" && (
            <div className={styles.executionLog}>
              <span className={styles.eyebrow}>EXECUTION HISTORY</span>
              <h3>이번 브라우저에서의 처리 기록</h3>
              {logs.length ? (
                logs.map((item, i) => (
                  <div key={`${i}-${item}`}>
                    <Check size={15} />
                    <code>{item}</code>
                  </div>
                ))
              ) : (
                <p>샘플 실행 후 기록을 확인할 수 있습니다</p>
              )}
            </div>
          )}
        </div>
        <div className={styles.workspaceFooter}>
          <span>
            <ShieldCheck size={13} />
            가상 고객 데이터 · 실제 AI·발송 연동 없음
          </span>
          <span>입력 · 판단 · 초안 · 원장의 연결을 체험합니다</span>
        </div>
      </div>
      <div className={styles.toolEcosystem}>
        <span>BUILT AROUND YOUR WORKFLOW</span>
        <div>
          {[
            "Hermes",
            "Aside",
            "Claude",
            "Codex",
            "Grok Bot",
            "Jev",
            "카카오톡",
          ].map((name) => (
            <span key={name} className={styles.toolBrand}>
              {["Hermes", "Aside", "Claude", "Codex", "카카오톡"].includes(
                name,
              ) && (
                <Image
                  src={`/lab-samples/${name === "카카오톡" ? "kakaotalk" : name.toLowerCase()}.${name === "Hermes" || name === "Aside" ? "png" : "svg"}`}
                  alt=""
                  unoptimized
                  width="21"
                  height="21"
                />
              )}
              {name}
            </span>
          ))}
        </div>
        <p>
          화면은 샘플 규칙으로 동작합니다 · 실제 도구 연결과 역할은 프로젝트에
          맞춰 정합니다
        </p>
      </div>
      <button
        type="button"
        className={styles.leadConsult}
        onClick={() =>
          onConsult(
            `관심 서비스: 영업 리드 자동화\n흐름: RAW → 고객원장 중복대조 → Jev 선별·이유 → 가이드 기반 컨택 → 잠재고객 관리\n샘플 입력: ${inputs.length}건 / 중복 ${counts.duplicates}건 / 선별 ${counts.qualified}건 / 보류 ${counts.held}건\n조건: 최소 예산 ${rules.minBudget}만원, 기준 ${rules.minScore}점, 서비스 ${rules.service}\n필요 결과: 고객원장, 판단 이유, 컨택 초안, 후속 일정`,
          )
        }
      >
        <span>이 흐름을 우리 업무에 적용하려면</span>자동화 범위 상담하기
        <ArrowUpRight size={23} />
      </button>
      <SampleDialog
        open={settingsOpen}
        title="선별 조건과 컨택 가이드"
        onClose={() => setSettingsOpen(false)}
      >
        <div className={styles.ruleSettings}>
          <span className={styles.eyebrow}>SAMPLE QUALIFICATION RULES</span>
          <h2>
            조건을 바꾸면
            <br />
            선별 결과도 달라집니다
          </h2>
          <label>
            최소 예산 · 만원
            <input
              type="number"
              min="0"
              max="10000"
              step="50"
              value={rules.minBudget}
              onChange={(e) =>
                setRules({
                  ...rules,
                  minBudget: Math.min(
                    10000,
                    Math.max(0, Number(e.target.value)),
                  ),
                })
              }
            />
          </label>
          <label>
            기준 점수 · {rules.minScore}점
            <input
              type="range"
              min="30"
              max="100"
              step="10"
              value={rules.minScore}
              onChange={(e) =>
                setRules({ ...rules, minScore: Number(e.target.value) })
              }
            />
          </label>
          <label>
            우선 서비스
            <select
              value={rules.service}
              onChange={(e) => setRules({ ...rules, service: e.target.value })}
            >
              {["전체", "웹사이트", "쇼핑몰", "자동화"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            컨택 가이드
            <textarea
              value={guide}
              maxLength={800}
              onChange={(e) => setGuide(e.target.value)}
              rows={5}
            />
          </label>
          <label className={styles.faultChoice}>
            <input
              type="checkbox"
              checked={fault}
              onChange={(e) => setFault(e.target.checked)}
            />
            <span>선별 지연·재시도 상황 시연</span>
          </label>
          <p>
            조건은 다음 실행부터 적용됩니다 · 실제 Jev 모델 호출이 아닌 샘플
            규칙입니다
          </p>
          <button
            type="button"
            className={styles.runButton}
            onClick={() => setSettingsOpen(false)}
          >
            조건 저장
            <Check size={16} />
          </button>
        </div>
      </SampleDialog>
      <SampleDialog
        open={csvOpen}
        title="RAW 데이터 바꾸기"
        onClose={() => setCsvOpen(false)}
        wide
      >
        <div className={styles.csvEditor}>
          <span className={styles.eyebrow}>YOUR INPUT, DIFFERENT RESULTS</span>
          <h2>샘플 데이터를 직접 바꿔보세요</h2>
          <p>
            회사,도메인,서비스,예산만원,이메일 순서 · 최대 50행 · 이 브라우저
            안에서만 처리합니다
          </p>
          <textarea
            aria-label="RAW CSV 데이터"
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={13}
            spellCheck={false}
          />
          <div>
            <button
              type="button"
              className={styles.lightButton}
              onClick={() =>
                setCsvText(
                  leadsToCsv([
                    ...DEFAULT_LEADS,
                    {
                      ...DEFAULT_LEADS[0],
                      id: "RAW-09",
                      company: "블룸 추가 중복",
                      domain: "http://www.bloom-studio.example/contact",
                    },
                  ]),
                )
              }
            >
              <Plus size={14} />
              중복 예시 한 행 추가
            </button>
            <button
              type="button"
              className={styles.runButton}
              onClick={applyInputs}
            >
              이 데이터 사용
              <ArrowRight size={16} />
            </button>
          </div>
          <p className={styles.formNotice} role="alert">
            {csvError}
          </p>
        </div>
      </SampleDialog>
    </div>
  );
}
