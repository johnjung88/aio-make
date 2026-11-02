"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileArchive,
  FileText,
  Image as ImageIcon,
  LayoutDashboard,
  Loader2,
  MessageSquareText,
  MonitorSmartphone,
  PenLine,
  Play,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

import type {
  FactoryColumnId,
  FactoryComment,
  FactoryProject,
  FactoryRole,
  FactoryTask,
} from "@/lib/page-factory/team";
import styles from "./page-factory-workspace.module.css";

type BriefForm = {
  brandName: string;
  productName: string;
  category: string;
  subCategory: string;
  packageTier: string;
  targetChannel: string;
  deliveryFormat: string;
  price: string;
  normalPrice: string;
  composition: string;
  volume: string;
  shipping: string;
  certifications: string;
  cautions: string;
  targetAge: string;
  targetPersona: string;
  customerProblem: string;
  customerDesire: string;
  objections: string;
  usp1: string;
  proof1: string;
  usp2: string;
  proof2: string;
  usp3: string;
  proof3: string;
  brandTone: string;
  visualStyle: string;
  mainColor: string;
  imageAssets: string;
  gifNeeds: string;
  references: string;
  forbiddenWords: string;
  notes: string;
};

const columns: Array<{ id: FactoryColumnId; title: string; caption: string }> = [
  { id: "brief", title: "브리프", caption: "접수" },
  { id: "strategy", title: "기획", caption: "전략" },
  { id: "design", title: "디자인", caption: "방향" },
  { id: "copy", title: "카피", caption: "문구" },
  { id: "feedback", title: "피드백", caption: "조율" },
  { id: "review", title: "검수", caption: "확인" },
  { id: "done", title: "납품", caption: "Export" },
];

const roleMeta: Record<FactoryRole, { label: string; short: string; work: string; icon: typeof Bot }> = {
  client: { label: "사용자", short: "USER", work: "시작·최종 승인", icon: UsersRound },
  planner: { label: "기획/마케터", short: "PLAN", work: "브랜드·타겟·소구", icon: Sparkles },
  designer: { label: "디자이너", short: "DESIGN", work: "레이아웃·이미지·GIF", icon: ImageIcon },
  copywriter: { label: "카피라이터", short: "COPY", work: "후킹·문구·CTA", icon: PenLine },
  reviewer: { label: "검수자", short: "CHECK", work: "오탈자·근거·납품", icon: ShieldCheck },
};

const categoryOptions = [
  { value: "food", label: "식품" },
  { value: "beauty", label: "화장품/뷰티" },
  { value: "health", label: "건강기능식품" },
  { value: "fashion", label: "패션/잡화" },
  { value: "kids", label: "키즈/육아" },
  { value: "pet", label: "반려동물" },
  { value: "home-living", label: "홈/리빙" },
  { value: "service", label: "서비스/무형상품" },
  { value: "other", label: "기타" },
];

const packageOptions = [
  { value: "basic", label: "BASIC · 짧은 상세" },
  { value: "standard", label: "STANDARD · 기본 제작" },
  { value: "premium", label: "PREMIUM · 고급 제작" },
  { value: "launch", label: "LAUNCH · 브랜드 런칭" },
];

const channelOptions = [
  { value: "smartstore", label: "스마트스토어" },
  { value: "cafe24", label: "카페24" },
  { value: "coupang", label: "쿠팡" },
  { value: "kmong", label: "크몽/숨고" },
  { value: "own-mall", label: "자사몰" },
];

const targetAgeOptions = [
  { value: "10-20", label: "10~20대" },
  { value: "20-30", label: "20~30대" },
  { value: "30-45", label: "30~45세" },
  { value: "40-60", label: "40~60세" },
  { value: "all", label: "전 연령" },
];

const toneOptions = [
  { value: "trust-natural", label: "신뢰감/자연주의" },
  { value: "premium", label: "프리미엄/고급" },
  { value: "friendly", label: "친근함/생활감" },
  { value: "clinical", label: "전문가/성분 중심" },
  { value: "bold", label: "강한 후킹/이벤트" },
];

const visualOptions = [
  { value: "bright-studio", label: "밝은 스튜디오" },
  { value: "editorial", label: "매거진/에디토리얼" },
  { value: "clean-data", label: "정보/비교 중심" },
  { value: "lifestyle", label: "라이프스타일 컷" },
  { value: "ugc-review", label: "후기/UGC 느낌" },
];

const deliveryOptions = [
  { value: "html-prompt-report", label: "HTML + 프롬프트 + 검수 리포트" },
  { value: "png-pdf", label: "PNG/PDF 납품" },
  { value: "platform-upload", label: "플랫폼 등록용 구성" },
  { value: "source-package", label: "원본/소스 패키지" },
];

const defaultForm: BriefForm = {
  brandName: "숲결",
  productName: "강원도 정선 유기농 그래놀라",
  category: "food",
  subCategory: "그래놀라 / 시리얼",
  packageTier: "standard",
  targetChannel: "smartstore",
  deliveryFormat: "html-prompt-report",
  price: "18,900원",
  normalPrice: "25,000원",
  composition: "그래놀라 350g 1팩",
  volume: "350g / 1회 40g 기준",
  shipping: "평일 14시 이전 결제 시 당일 출고",
  certifications: "HACCP, 유기농 인증",
  cautions: "견과류 알레르기 주의, 직사광선 피해서 보관",
  targetAge: "30-45",
  targetPersona: "30~45세 워킹맘, 아침 5분 해결",
  customerProblem: "아침을 챙기고 싶지만 조리와 설거지가 부담스럽다.",
  customerDesire: "빠르지만 대충 먹는 느낌이 아닌 든든한 아침 루틴",
  objections: "그래놀라는 달기만 하거나 금방 질린다는 인식",
  usp1: "HACCP+유기농 인증",
  proof1: "인증서 이미지와 로고 사용 가능",
  usp2: "강원도 정선 6시간 직접 로스팅",
  proof2: "로스팅 공정 사진과 생산지 스토리 보유",
  usp3: "1봉 단백질 12g",
  proof3: "영양성분표 기준 수치",
  brandTone: "trust-natural",
  visualStyle: "bright-studio",
  mainColor: "#156BFF / #14A06F / #F2B84B",
  imageAssets: "인증서, 로스팅 공정 사진, 제품 패키지 컷",
  gifNeeds: "사용법 3컷, 짧은 섭취 루틴 GIF",
  references:
    "밝은 자연주의 톤, 과장 없는 건강식품 표현, 모바일에서 먼저 읽히는 구성",
  forbiddenWords: "최고, 완벽, 치료, 예방",
  notes: "동일 식품 카테고리 제작 시 인증/성분/원산지 섹션 성과를 DB에 남겨 다음 제작에 반영",
};

export function PageFactoryWorkspace() {
  const [form, setForm] = useState<BriefForm>(defaultForm);
  const [project, setProject] = useState<FactoryProject | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [finalApproved, setFinalApproved] = useState(false);

  const selectedTask = useMemo(() => {
    if (!project) return null;
    return project.tasks.find((task) => task.id === selectedTaskId) ?? project.tasks[0] ?? null;
  }, [project, selectedTaskId]);

  const comments = useMemo(() => {
    if (!project) return [];
    return project.tasks.flatMap((task) =>
      task.comments.map((comment) => ({
        ...comment,
        taskTitle: task.title,
      })),
    );
  }, [project]);

  const roleApprovalCount = project ? Object.values(project.rolesApproved).filter(Boolean).length : 0;
  const unresolvedCount = project
    ? project.tasks.reduce((sum, task) => sum + task.revisionRequests.length, 0)
    : 0;
  const exportReady = Boolean(project && roleApprovalCount === 4 && unresolvedCount === 0);

  async function runTeam() {
    setIsRunning(true);
    setError("");
    setFinalApproved(false);

    try {
      const response = await fetch("/api/page-factory/run", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(toFactoryPayload(form)),
      });
      const json = (await response.json()) as {
        success: boolean;
        error?: string;
        data?: FactoryProject;
      };

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "AI 제작팀 실행에 실패했습니다.");
      }

      setProject(json.data);
      setSelectedTaskId(json.data.tasks[0]?.id ?? null);
    } catch (runError) {
      setError(runError instanceof Error ? runError.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsRunning(false);
    }
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
  }

  return (
    <main className={styles.workspace}>
      <header className={styles.appHeader}>
        <div className={styles.brandLockup}>
          <span>AIO</span>
          <div>
            <strong>AI 상세페이지 제작팀</strong>
            <small>aio-make.com/page_factory</small>
          </div>
        </div>

        <div className={styles.headerStatus}>
          <StatusPill label="역할 승인" value={`${roleApprovalCount}/4`} ready={roleApprovalCount === 4} />
          <StatusPill label="수정요청" value={`${unresolvedCount}건`} ready={unresolvedCount === 0} />
          <StatusPill label="Export" value={exportReady ? "열림" : "대기"} ready={exportReady} />
        </div>

        <button className={styles.headerAction} disabled={isRunning} onClick={runTeam} type="button">
          {isRunning ? <Loader2 className={styles.spin} size={18} /> : project ? <RefreshCw size={18} /> : <Play size={18} />}
          {project ? "다시 제작" : "AI 제작팀 시작"}
        </button>
      </header>

      {!project ? (
        <LaunchDesk
          error={error}
          form={form}
          isRunning={isRunning}
          onChange={setForm}
          onRun={runTeam}
        />
      ) : (
        <section className={styles.workbench}>
          <aside className={styles.commandPanel}>
            <ProjectBrief project={project} />
            <RoleApprovals project={project} />
            <LearningMemory project={project} />
            <button
              className={finalApproved ? styles.approvedButton : styles.finalButton}
              disabled={!exportReady}
              onClick={() => setFinalApproved(true)}
              type="button"
            >
              <BadgeCheck size={18} />
              {finalApproved ? "최종 승인 완료" : "사용자 최종 승인"}
            </button>
          </aside>

          <section className={styles.flowPanel}>
            <Pipeline
              project={project}
              selectedTask={selectedTask}
              onSelectColumn={(columnId) => {
                const firstTask = project.tasks.find((task) => task.columnId === columnId);
                if (firstTask) setSelectedTaskId(firstTask.id);
              }}
            />
            <TaskBoard
              project={project}
              selectedTask={selectedTask}
              onSelectTask={setSelectedTaskId}
            />
            <FeedbackFeed comments={comments} />
          </section>

          <aside className={styles.inspectorPanel}>
            {selectedTask ? <TaskInspector task={selectedTask} /> : null}
            <DeliveryPanel
              disabled={!exportReady || !finalApproved}
              finalHtml={project.finalHtml}
              promptBoard={project.promptBoard}
              reviewReport={project.reviewReport}
              onCopy={copyText}
            />
          </aside>
        </section>
      )}
    </main>
  );
}

function LaunchDesk({
  form,
  error,
  isRunning,
  onChange,
  onRun,
}: {
  form: BriefForm;
  error: string;
  isRunning: boolean;
  onChange: (form: BriefForm) => void;
  onRun: () => void;
}) {
  return (
    <section className={styles.launchDesk}>
      <div className={styles.launchCopy}>
        <p className={styles.kicker}>시작은 사람, 제작은 AI 팀</p>
        <h1>브리프 하나로 상세페이지 제작 조직을 실행합니다.</h1>
        <p>
          입력값은 나중에 DB에 저장되어 카테고리별 포트폴리오, 검수 결과, 전환 포인트 학습에 쓰입니다.
          그래서 자유 입력과 선택값을 분리해 반복 제작할수록 기준이 쌓이게 만듭니다.
        </p>

        <div className={styles.learningPreview}>
          <article>
            <Database size={19} />
            <strong>DB 저장 단위</strong>
            <span>브랜드, 상품, 카테고리, 타겟, USP, 증빙, 결과물</span>
          </article>
          <article>
            <BrainCircuit size={19} />
            <strong>카테고리 학습</strong>
            <span>식품/뷰티/건기식별 성공 섹션과 금지 표현을 누적</span>
          </article>
        </div>

        <div className={styles.processPreview}>
          {(["planner", "designer", "copywriter", "reviewer"] as FactoryRole[]).map((role) => {
            const Icon = roleMeta[role].icon;
            return (
              <article key={role}>
                <Icon size={20} />
                <strong>{roleMeta[role].label}</strong>
                <span>{roleMeta[role].work}</span>
              </article>
            );
          })}
        </div>
      </div>

      <div className={styles.briefForm}>
        <div className={styles.formHeader}>
          <div>
            <h2>제작 요청서</h2>
            <p>선택값은 분류/학습용, 직접 입력값은 제작용으로 저장되도록 나눴습니다.</p>
          </div>
          <button className={styles.primaryButton} disabled={isRunning} onClick={onRun} type="button">
            {isRunning ? <Loader2 className={styles.spin} size={18} /> : <Play size={18} />}
            제작팀 실행
          </button>
        </div>

        <div className={styles.briefGrid}>
          <FormSection title="1. 브랜드/상품 기본 정보" help="DB에서 프로젝트와 포트폴리오를 묶는 핵심 값입니다.">
            <TextInput label="브랜드" value={form.brandName} onChange={(value) => onChange({ ...form, brandName: value })} />
            <TextInput label="상품명" value={form.productName} onChange={(value) => onChange({ ...form, productName: value })} />
            <SelectInput label="카테고리" value={form.category} options={categoryOptions} onChange={(value) => onChange({ ...form, category: value })} />
            <TextInput label="세부 카테고리" value={form.subCategory} onChange={(value) => onChange({ ...form, subCategory: value })} />
            <SelectInput label="제작 등급" value={form.packageTier} options={packageOptions} onChange={(value) => onChange({ ...form, packageTier: value })} />
            <TextInput label="메인 컬러/브랜드 색" value={form.mainColor} onChange={(value) => onChange({ ...form, mainColor: value })} />
          </FormSection>

          <FormSection title="2. 상품 판매 정보" help="상세페이지 하단 정보/비교/구매 판단 섹션에 들어갑니다.">
            <TextInput label="판매가" value={form.price} onChange={(value) => onChange({ ...form, price: value })} />
            <TextInput label="정상가" value={form.normalPrice} onChange={(value) => onChange({ ...form, normalPrice: value })} />
            <TextInput label="구성" value={form.composition} onChange={(value) => onChange({ ...form, composition: value })} />
            <TextInput label="용량/규격" value={form.volume} onChange={(value) => onChange({ ...form, volume: value })} />
            <TextInput label="배송" value={form.shipping} onChange={(value) => onChange({ ...form, shipping: value })} />
            <TextInput label="주의사항" value={form.cautions} onChange={(value) => onChange({ ...form, cautions: value })} />
          </FormSection>

          <FormSection title="3. 고객/소구/증빙" help="기획자와 카피라이터가 가장 먼저 보는 입력값입니다.">
            <SelectInput label="타겟 연령" value={form.targetAge} options={targetAgeOptions} onChange={(value) => onChange({ ...form, targetAge: value })} />
            <TextInput label="타겟층/상황" value={form.targetPersona} onChange={(value) => onChange({ ...form, targetPersona: value })} />
            <TextAreaInput label="구매 전 고민" value={form.customerProblem} onChange={(value) => onChange({ ...form, customerProblem: value })} />
            <TextAreaInput label="구매 욕구" value={form.customerDesire} onChange={(value) => onChange({ ...form, customerDesire: value })} />
            <TextAreaInput label="반박 포인트" value={form.objections} onChange={(value) => onChange({ ...form, objections: value })} />
            <TextInput label="인증/공식 근거" value={form.certifications} onChange={(value) => onChange({ ...form, certifications: value })} />
          </FormSection>

          <FormSection title="4. USP 3개와 근거" help="주장과 증빙을 짝으로 저장해야 과장 표현을 줄일 수 있습니다.">
            <TextInput label="USP 1" value={form.usp1} onChange={(value) => onChange({ ...form, usp1: value })} />
            <TextInput label="USP 1 근거" value={form.proof1} onChange={(value) => onChange({ ...form, proof1: value })} />
            <TextInput label="USP 2" value={form.usp2} onChange={(value) => onChange({ ...form, usp2: value })} />
            <TextInput label="USP 2 근거" value={form.proof2} onChange={(value) => onChange({ ...form, proof2: value })} />
            <TextInput label="USP 3" value={form.usp3} onChange={(value) => onChange({ ...form, usp3: value })} />
            <TextInput label="USP 3 근거" value={form.proof3} onChange={(value) => onChange({ ...form, proof3: value })} />
          </FormSection>

          <FormSection title="5. 디자인/이미지 자료" help="디자이너 AI가 레이아웃과 이미지/GIF 슬롯을 설계할 때 사용합니다.">
            <SelectInput label="브랜드 톤" value={form.brandTone} options={toneOptions} onChange={(value) => onChange({ ...form, brandTone: value })} />
            <SelectInput label="비주얼 스타일" value={form.visualStyle} options={visualOptions} onChange={(value) => onChange({ ...form, visualStyle: value })} />
            <TextAreaInput label="보유 이미지" value={form.imageAssets} onChange={(value) => onChange({ ...form, imageAssets: value })} />
            <TextAreaInput label="필요 GIF/연출" value={form.gifNeeds} onChange={(value) => onChange({ ...form, gifNeeds: value })} />
            <TextAreaInput label="참고자료/URL" value={form.references} onChange={(value) => onChange({ ...form, references: value })} />
            <TextAreaInput label="금지 표현/제약" value={form.forbiddenWords} onChange={(value) => onChange({ ...form, forbiddenWords: value })} />
          </FormSection>

          <FormSection title="6. 채널/납품/학습 메모" help="완성 후 포트폴리오와 카테고리 학습 데이터로 남길 기준입니다.">
            <SelectInput label="목표 채널" value={form.targetChannel} options={channelOptions} onChange={(value) => onChange({ ...form, targetChannel: value })} />
            <SelectInput label="납품 형식" value={form.deliveryFormat} options={deliveryOptions} onChange={(value) => onChange({ ...form, deliveryFormat: value })} />
            <TextAreaInput label="DB/학습 메모" value={form.notes} onChange={(value) => onChange({ ...form, notes: value })} wide />
          </FormSection>
        </div>

        {error ? <p className={styles.errorText}>{error}</p> : null}
      </div>
    </section>
  );
}

function FormSection({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <section className={styles.formSection}>
      <header>
        <strong>{title}</strong>
        <small>{help}</small>
      </header>
      <div className={styles.formSectionGrid}>{children}</div>
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextAreaInput({
  label,
  value,
  onChange,
  wide,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  wide?: boolean;
}) {
  return (
    <label className={wide ? styles.wideField : styles.field}>
      <span>{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ProjectBrief({ project }: { project: FactoryProject }) {
  return (
    <section className={styles.sideCard}>
      <span className={styles.sectionEyebrow}>PROJECT</span>
      <h2>{project.title}</h2>
      <dl className={styles.briefFacts}>
        <div>
          <dt>브랜드</dt>
          <dd>{project.brandName}</dd>
        </div>
        <div>
          <dt>상품</dt>
          <dd>{project.productName}</dd>
        </div>
        <div>
          <dt>채널</dt>
          <dd>{project.targetChannel}</dd>
        </div>
      </dl>
      <p className={styles.projectMode}>{project.usedFallback ? "로컬 샘플 제작팀" : "Claude 제작팀"}</p>
    </section>
  );
}

function RoleApprovals({ project }: { project: FactoryProject }) {
  return (
    <section className={styles.sideCard}>
      <span className={styles.sectionEyebrow}>TEAM APPROVAL</span>
      <div className={styles.roleList}>
        {(["planner", "designer", "copywriter", "reviewer"] as const).map((role) => {
          const Icon = roleMeta[role].icon;
          const approved = project.rolesApproved[role];
          return (
            <article className={approved ? styles.roleDone : styles.rolePending} key={role}>
              <Icon size={18} />
              <div>
                <strong>{roleMeta[role].label}</strong>
                <span>{roleMeta[role].work}</span>
              </div>
              {approved ? <CheckCircle2 size={18} /> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function LearningMemory({ project }: { project: FactoryProject }) {
  return (
    <section className={styles.sideCard}>
      <span className={styles.sectionEyebrow}>DB LEARNING</span>
      <h2>{project.learningMemory.categoryLabel} 학습 메모리</h2>
      <div className={styles.learningList}>
        <article>
          <Database size={16} />
          <span>저장 필드</span>
          <strong>{project.learningMemory.dbReadyFields.length}개</strong>
        </article>
        <article>
          <FileArchive size={16} />
          <span>포트폴리오 기록</span>
          <strong>{project.learningMemory.portfolioRecord.length}개</strong>
        </article>
        <article>
          <BrainCircuit size={16} />
          <span>다음 제작 신호</span>
          <strong>{project.learningMemory.nextRunSignals.length}개</strong>
        </article>
      </div>
    </section>
  );
}

function Pipeline({
  project,
  selectedTask,
  onSelectColumn,
}: {
  project: FactoryProject;
  selectedTask: FactoryTask | null;
  onSelectColumn: (columnId: FactoryColumnId) => void;
}) {
  return (
    <section className={styles.pipelineCard}>
      <div className={styles.panelTitle}>
        <div>
          <span className={styles.sectionEyebrow}>WORKFLOW</span>
          <h2>업무 전달 흐름</h2>
        </div>
        <span className={styles.pathBadge}>브리프에서 납품까지 자동 진행</span>
      </div>

      <div className={styles.pipeline}>
        {columns.map((column, index) => {
          const tasks = project.tasks.filter((task) => task.columnId === column.id);
          const active = selectedTask?.columnId === column.id;
          const done = tasks.length > 0 && tasks.every((task) => task.approved || task.status === "done");

          return (
            <button
              className={active ? styles.pipelineActive : done ? styles.pipelineDone : styles.pipelineStep}
              key={column.id}
              onClick={() => onSelectColumn(column.id)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{column.title}</strong>
              <small>{column.caption}</small>
              {index < columns.length - 1 ? <ChevronRight size={15} /> : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function TaskBoard({
  project,
  selectedTask,
  onSelectTask,
}: {
  project: FactoryProject;
  selectedTask: FactoryTask | null;
  onSelectTask: (taskId: string) => void;
}) {
  return (
    <section className={styles.boardCard}>
      <div className={styles.panelTitle}>
        <div>
          <span className={styles.sectionEyebrow}>TASK BOARD</span>
          <h2>역할별 업무 카드</h2>
        </div>
        <LayoutDashboard size={20} />
      </div>

      <div className={styles.taskBoard}>
        {project.tasks.map((task) => (
          <TaskCard
            active={selectedTask?.id === task.id}
            key={task.id}
            onSelect={() => onSelectTask(task.id)}
            task={task}
          />
        ))}
      </div>
    </section>
  );
}

function TaskCard({
  task,
  active,
  onSelect,
}: {
  task: FactoryTask;
  active: boolean;
  onSelect: () => void;
}) {
  const meta = roleMeta[task.ownerRole];
  const Icon = meta.icon;

  return (
    <button className={active ? styles.taskActive : styles.taskCard} onClick={onSelect} type="button">
      <div className={styles.taskTop}>
        <span className={styles.roleBadge}>
          <Icon size={14} />
          {meta.short}
        </span>
        <span className={styles.statusBadge}>{task.status}</span>
      </div>
      <strong>{task.title}</strong>
      <p>{task.summary}</p>
      <div className={styles.taskMeta}>
        <span>
          <MessageSquareText size={14} />
          {task.comments.length}
        </span>
        <span>
          <ClipboardCheck size={14} />
          {task.deliverables.length}
        </span>
        {task.approved ? (
          <span className={styles.approvedInline}>
            <CheckCircle2 size={14} />
            승인
          </span>
        ) : null}
      </div>
    </button>
  );
}

function FeedbackFeed({
  comments,
}: {
  comments: Array<FactoryComment & { taskTitle: string }>;
}) {
  return (
    <section className={styles.feedCard}>
      <div className={styles.panelTitle}>
        <div>
          <span className={styles.sectionEyebrow}>TEAM FEEDBACK</span>
          <h2>역할 간 피드백 로그</h2>
        </div>
        <MessageSquareText size={20} />
      </div>
      <div className={styles.feedList}>
        {comments.slice(0, 8).map((comment) => (
          <CommentItem comment={comment} key={comment.id} compact />
        ))}
      </div>
    </section>
  );
}

function TaskInspector({ task }: { task: FactoryTask }) {
  const meta = roleMeta[task.ownerRole];
  const Icon = meta.icon;

  return (
    <section className={styles.inspectorCard}>
      <header>
        <span className={styles.roleBadge}>
          <Icon size={15} />
          {meta.label}
        </span>
        <h2>{task.title}</h2>
        <p>{task.summary}</p>
      </header>

      <HandoffFlow task={task} />

      <div className={styles.deliverableStack}>
        {task.deliverables.map((deliverable) => (
          <article className={styles.deliverableCard} key={deliverable.title}>
            <strong>{deliverable.title}</strong>
            <ul>
              {deliverable.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className={styles.requestGrid}>
        <RequestList title="수정요청" items={task.revisionRequests} empty="미해결 수정요청 없음" />
        <RequestList title="해결 기록" items={task.resolvedRequests} empty="아직 해결 기록 없음" resolved />
      </div>

      <section className={styles.commentPanel}>
        <h3>카드 댓글</h3>
        {task.comments.map((comment) => (
          <CommentItem comment={comment} key={comment.id} />
        ))}
      </section>
    </section>
  );
}

function HandoffFlow({ task }: { task: FactoryTask }) {
  return (
    <section className={styles.handoffBox}>
      <div className={styles.handoffLine}>
        <article>
          <span>받은 작업</span>
          <strong>{roleName(task.receivedFrom)}</strong>
        </article>
        <ChevronRight size={18} />
        <article>
          <span>담당 작업</span>
          <strong>{roleMeta[task.ownerRole].label}</strong>
        </article>
        <ChevronRight size={18} />
        <article>
          <span>넘긴 작업</span>
          <strong>{roleName(task.handoffTo)}</strong>
        </article>
      </div>

      <div className={styles.handoffGrid}>
        <MiniList title="입력으로 받은 것" items={task.inputBrief} />
        <MiniList title="처리한 일" items={task.workLog} />
        <MiniList title="다음 담당자에게 넘긴 것" items={task.handoffOutput} />
      </div>
    </section>
  );
}

function MiniList({ title, items }: { title: string; items: string[] }) {
  return (
    <article>
      <strong>{title}</strong>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}

function roleName(role: FactoryRole | "start" | "finish") {
  if (role === "start") return "사용자 최초 입력";
  if (role === "finish") return "최종 납품";
  return roleMeta[role].label;
}

function RequestList({
  title,
  items,
  empty,
  resolved,
}: {
  title: string;
  items: string[];
  empty: string;
  resolved?: boolean;
}) {
  return (
    <article className={resolved ? styles.resolvedBox : styles.requestBox}>
      <strong>{title}</strong>
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{empty}</p>
      )}
    </article>
  );
}

function CommentItem({
  comment,
  compact,
}: {
  comment: FactoryComment & { taskTitle?: string };
  compact?: boolean;
}) {
  return (
    <article className={compact ? styles.commentCompact : styles.commentItem}>
      <div>
        <span className={styles.commentTone}>{comment.tone}</span>
        <strong>{comment.authorName}</strong>
        {comment.targetRole ? <small>→ {roleMeta[comment.targetRole].label}</small> : null}
      </div>
      {comment.taskTitle ? <em>{comment.taskTitle}</em> : null}
      <p>{comment.message}</p>
    </article>
  );
}

function DeliveryPanel({
  disabled,
  finalHtml,
  promptBoard,
  reviewReport,
  onCopy,
}: {
  disabled: boolean;
  finalHtml: string;
  promptBoard: string;
  reviewReport: string;
  onCopy: (value: string) => Promise<void>;
}) {
  return (
    <section className={styles.deliveryCard}>
      <header>
        <span className={disabled ? styles.lockedBadge : styles.openBadge}>
          {disabled ? "최종 승인 후 열림" : "Export 가능"}
        </span>
        <h2>납품 패키지</h2>
        <p>상세페이지 HTML, 이미지/GIF 프롬프트, 검수 리포트를 복사합니다.</p>
      </header>

      <div className={styles.exportActions}>
        <button disabled={disabled} onClick={() => onCopy(finalHtml)} type="button">
          <FileText size={18} />
          HTML
        </button>
        <button disabled={disabled} onClick={() => onCopy(promptBoard)} type="button">
          <ImageIcon size={18} />
          프롬프트
        </button>
        <button disabled={disabled} onClick={() => onCopy(reviewReport)} type="button">
          <FileArchive size={18} />
          검수
        </button>
      </div>

      <div className={styles.previewTabs}>
        <article>
          <strong>
            <MonitorSmartphone size={16} />
            최종 HTML
          </strong>
          <textarea readOnly value={finalHtml} />
        </article>
        <article>
          <strong>
            <Send size={16} />
            프롬프트 보드
          </strong>
          <textarea readOnly value={promptBoard} />
        </article>
      </div>
    </section>
  );
}

function StatusPill({ label, value, ready }: { label: string; value: string; ready: boolean }) {
  return (
    <span className={ready ? styles.statusReady : styles.statusPill}>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}

function optionLabel(options: Array<{ value: string; label: string }>, value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function toFactoryPayload(form: BriefForm) {
  return {
    ...form,
    brief: [
      `브랜드: ${form.brandName}`,
      `상품명: ${form.productName}`,
      `카테고리: ${optionLabel(categoryOptions, form.category)} / ${form.subCategory}`,
      `제작 등급: ${optionLabel(packageOptions, form.packageTier)}`,
      `가격: ${form.price} / 정상가 ${form.normalPrice}`,
      `구성: ${form.composition}`,
      `용량: ${form.volume}`,
      `브랜드 톤: ${optionLabel(toneOptions, form.brandTone)}`,
    ].join("\n"),
    productInfo: [
      `배송: ${form.shipping}`,
      `인증: ${form.certifications}`,
      `주의사항: ${form.cautions}`,
      `타겟: ${optionLabel(targetAgeOptions, form.targetAge)} / ${form.targetPersona}`,
      `구매 전 고민: ${form.customerProblem}`,
      `구매 욕구: ${form.customerDesire}`,
      `반박 포인트: ${form.objections}`,
      `USP: ${form.usp1}, ${form.usp2}, ${form.usp3}`,
      `근거: ${form.proof1}, ${form.proof2}, ${form.proof3}`,
    ].join("\n"),
    references: [
      `비주얼 스타일: ${optionLabel(visualOptions, form.visualStyle)}`,
      `메인 컬러: ${form.mainColor}`,
      `보유 이미지: ${form.imageAssets}`,
      `필요 GIF/연출: ${form.gifNeeds}`,
      `참고자료: ${form.references}`,
      `금지 표현: ${form.forbiddenWords}`,
      `DB/학습 메모: ${form.notes}`,
    ].join("\n"),
    targetChannel: optionLabel(channelOptions, form.targetChannel),
    deliveryFormatLabel: optionLabel(deliveryOptions, form.deliveryFormat),
    categoryLabel: optionLabel(categoryOptions, form.category),
  };
}
