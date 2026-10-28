"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Code2,
  Layers3,
  Monitor,
  ShoppingBag,
  Zap,
} from "lucide-react";
import {
  ArchitectureSample,
  FLOOR_INFO,
  FloorPlan,
} from "@/components/lab-samples/architecture";
import { SampleDialog } from "@/components/lab-samples/dialog";
import sampleStyles from "@/components/lab-samples/samples.module.css";
import styles from "./lab-main.module.css";
import { Prism } from "./prism";
const BuildingScene = dynamic(
  () => import("@/components/lab-samples/building-scene"),
  {
    ssr: false,
    loading: () => <p className={styles.loading}>공간을 준비하고 있습니다</p>,
  },
);
const FashionSample = dynamic(
  () => import("@/components/lab-samples/fashion").then((m) => m.FashionSample),
  {
    loading: () => (
      <p className={styles.loading}>상품 체험을 준비하고 있습니다</p>
    ),
  },
);
const LeadsSample = dynamic(
  () => import("@/components/lab-samples/leads").then((m) => m.LeadsSample),
  {
    loading: () => (
      <p className={styles.loading}>업무 체험을 준비하고 있습니다</p>
    ),
  },
);
const services = [
  {
    id: "website",
    label: "웹사이트",
    industry: "architecture",
    title: "공간을 탐색하는 웹사이트",
    description: "층을 고르면 공간 정보가 바뀌어요",
    icon: Monitor,
  },
  {
    id: "shopping-mall",
    label: "쇼핑몰",
    industry: "fashion",
    title: "스타일을 선택하는 쇼핑몰",
    description: "착용 컷을 보고 옵션을 골라보세요",
    icon: ShoppingBag,
  },
  {
    id: "automation",
    label: "자동화",
    industry: "sales-leads",
    title: "입력이 연결되는 자동화",
    description: "샘플을 실행하고 처리 결과를 확인하세요",
    icon: Zap,
  },
] as const;
type Service = (typeof services)[number]["id"];
const gallery = [
  {
    id: "clinic",
    name: "서리온결",
    industry: "병원",
    detail: "차분한 색과 인물 중심의 진료 안내",
    note: "AI 생성 인물 포함",
  },
  {
    id: "space",
    name: "여백결",
    industry: "건축",
    detail: "빛과 재료, 공간을 따라가는 편집",
    note: "콘셉트 공간 이미지",
  },
  {
    id: "stay",
    name: "활판재",
    industry: "숙박",
    detail: "마당과 객실을 둘러보는 숙소 안내",
    note: "가상 숙소 이미지",
  },
  {
    id: "food",
    name: "모그레빗",
    industry: "음식점",
    detail: "곡물과 커피의 질감을 담은 메뉴 소개",
    note: "가상 메뉴 이미지",
  },
] as const;
const industryFeatures = [
  ["진료 안내", "시설 소개", "상담 분기"],
  ["공간 탐색", "층별 보기", "상담 요약"],
  ["객실 비교", "시설 안내", "예약 문의"],
  ["메뉴 탐색", "매장 안내", "방문 문의"],
];
const process = [
  [
    "의뢰",
    "목적과 자료 정리",
    "Opus 기획",
    "사업과 방문자의 목적, 필요한 자료와 운영 조건을 정리합니다",
  ],
  [
    "벤치마크",
    "참고 흐름 분석",
    "Opus 기획",
    "업종에 맞는 탐색과 입력 흐름을 비교하고 적용할 이유를 남깁니다",
  ],
  [
    "시안",
    "PC·모바일 방향",
    "Opus 기획",
    "카피와 소재를 담은 화면을 제안하고 사용자가 방향을 고릅니다",
  ],
  [
    "작동 원형",
    "핵심 기능 체험",
    "Codex 구현",
    "가장 중요한 선택과 반응을 먼저 만들어 실제로 확인합니다",
  ],
  [
    "구현",
    "화면과 상태 연결",
    "Codex 구현",
    "선택값과 결과 화면을 연결하고 작은 화면에도 맞춰 만듭니다",
  ],
  [
    "검수",
    "정상·실패 확인",
    "Sonnet 검수",
    "입력과 결과, 접근성, 실패와 대체 화면을 확인하고 수정합니다",
  ],
  [
    "인계",
    "운영 자료 전달",
    "Codex 정리",
    "사용 방법과 복구 위치, 남은 확인을 정리해 운영 담당에게 연결합니다",
  ],
];
export function LabMain() {
  const [selected, setSelected] = useState<Service>("website");
  const [visited, setVisited] = useState<Service[]>(["website"]);
  const [phase, setPhase] = useState(0);
  const [floor, setFloor] = useState(-1);
  const [room, setRoom] = useState(0);
  const [exploded, setExploded] = useState(false);
  const [plan, setPlan] = useState(false);
  const [replay, setReplay] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(true);
  const [sceneStatus, setSceneStatus] = useState<
    "loading" | "ready" | "failed"
  >("loading");
  const [detail, setDetail] = useState(false);
  const [industry, setIndustry] = useState(1);
  const [features, setFeatures] = useState<string[]>(["공간 탐색"]);
  const [summary, setSummary] = useState("");
  const [summaryIndustry, setSummaryIndustry] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [imageOpen, setImageOpen] = useState<number | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [changed, setChanged] = useState("서비스");
  const current = services.find((s) => s.id === selected)!;
  const info = FLOOR_INFO[Math.max(0, floor)];
  const contactHref = `/content/contact?${new URLSearchParams({ service: selected, industry: current.industry, source: "lab" })}`;
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (stageRef.current) observer.observe(stageRef.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  useEffect(() => {
    if (phase !== 1 || !active) return;
    const timer = setTimeout(() => setPhase(2), reduced ? 0 : 700);
    return () => clearTimeout(timer);
  }, [phase, replay, reduced, active]);
  const choose = (service: Service) => {
    setSelected(service);
    setVisited((items) =>
      items.includes(service) ? items : [...items, service],
    );
    setPhase(1);
    setChanged("서비스");
    setReplay((n) => n + 1);
  };
  const consult = (value: string) => {
    setSummary(value);
    setSummaryIndustry(null);
    setCopyStatus("");
  };
  const makeSummary = () => {
    consult(
      `관심 서비스: ${current.label}\n시연 업종: ${current.industry}\n관심 업종: ${gallery[industry].industry}\n관심 기능: ${features.join(", ") || "상담하며 정리"}\n공간 선택: ${floor < 0 ? "전체" : `${floor + 1}층 · ${info.spaces[room].name}`}\n가상 브랜드 기능 시연에서 선택한 구성`,
    );
    setSummaryIndustry(
      ["clinic", "architecture", "hospitality", "restaurant"][industry],
    );
  };
  return (
    <div
      className={styles.page}
      data-service={selected}
      data-phase={phase}
      data-change={changed}
    >
      <a className={styles.skip} href="#experience">
        체험으로 바로가기
      </a>
      <header className={styles.header}>
        <Link href="/" aria-label="AIO 메인" className={styles.brand}>
          <Image
            className={styles.brandMark}
            src="/brand/aio-logo.png"
            width={64}
            height={64}
            alt=""
            priority
          />
          <Image
            src="/brand/aio-agency-logo-final/aio-agency-site-lockup-dark.svg"
            width={160}
            height={68}
            alt="AIO"
            priority
          />
        </Link>
        <nav aria-label="랩 탐색">
          <a href="#services">서비스</a>
          <a href="#gallery">샘플 갤러리</a>
          <a href="#process">제작 과정</a>
          <Link href={contactHref}>
            제작 상담 <ArrowUpRight size={16} />
          </Link>
        </nav>
      </header>
      <noscript>
        <section className={styles.noScript}>
          <p>JavaScript가 꺼져 있어 체험 대신 제작 상담으로 안내합니다</p>
          <a
            className={styles.cta}
            href="/content/contact?service=website&industry=architecture&source=lab"
          >
            웹사이트 제작 상담하기
          </a>
        </section>
      </noscript>
      <main>
        <section className={styles.hero} aria-labelledby="lab-title">
          <div className={styles.prism} aria-hidden="true">
            <Prism />
          </div>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>
              A PRISM TO PRODUCT / AIO DEVELOPMENT
            </p>
            <h1 id="lab-title">
              생각한 기능이
              <br />
              <span>작동하는 화면으로</span>
            </h1>
            <p className={styles.lead}>
              웹사이트·쇼핑몰·자동화를
              <br className={styles.mobileBreak} /> 직접 체험하세요
            </p>
            <a
              className={styles.cta}
              href="#experience"
              onClick={() => {
                setPhase(1);
                setReplay((n) => n + 1);
              }}
            >
              사례 직접 체험하기 <ArrowUpRight size={20} />
            </a>
          </div>
          <fieldset className={styles.selector} id="services">
            <legend className={styles.srOnly}>체험할 서비스 선택</legend>
            {services.map((s) => (
              <label key={s.id}>
                <input
                  type="radio"
                  name="lab-service"
                  checked={selected === s.id}
                  onChange={() => choose(s.id)}
                />
                <span>
                  <s.icon size={21} />
                  {s.label}
                  <ArrowUpRight size={16} />
                </span>
              </label>
            ))}
          </fieldset>
          <div className={styles.codePanel}>
            <div className={styles.panelTitle}>
              <Code2 size={18} />
              <strong>코드에서 화면으로</strong>
              <span>LIVE CONFIG</span>
            </div>
            <div className={styles.steps} aria-label="조립 단계">
              {["선택", "연결", "체험"].map((s, i) => (
                <button
                  type="button"
                  key={s}
                  aria-pressed={phase === i}
                  onClick={() => {
                    setPhase(i);
                    setReplay((n) => n + 1);
                  }}
                >
                  0{i + 1} {s}
                </button>
              ))}
            </div>
            <pre aria-label="선택한 화면 설정" data-highlight={phase === 1}>
              <span>const</span> experience = {"{"}
              <br /> service: <b>&apos;{selected}&apos;</b>,<br /> view:{" "}
              <b>
                &apos;
                {selected === "website"
                  ? plan || reduced || sceneStatus === "failed"
                    ? "plan"
                    : "space"
                  : current.industry}
                &apos;
              </b>
              ,<br /> floor: <b>{floor < 0 ? "'all'" : floor + 1}</b>,<br />{" "}
              ready:{" "}
              <b>
                {phase === 2 &&
                (selected !== "website" ||
                  plan ||
                  reduced ||
                  sceneStatus === "ready")
                  ? "true"
                  : "false"}
              </b>
              <br />
              {"}"}
            </pre>
            {selected === "website" ? (
              <div className={styles.config}>
                <label>
                  층 선택
                  <select
                    aria-label="설정 층 선택"
                    value={floor}
                    onChange={(e) => {
                      setFloor(Number(e.target.value));
                      setRoom(0);
                      setPhase(1);
                      setChanged("층");
                    }}
                  >
                    <option value={-1}>전체</option>
                    <option value={0}>1F</option>
                    <option value={1}>2F</option>
                    <option value={2}>3F</option>
                  </select>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={exploded}
                    onChange={(e) => {
                      setExploded(e.target.checked);
                      setPhase(1);
                      setChanged("층 분리");
                    }}
                  />
                  층 분리
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={plan}
                    onChange={(e) => {
                      setPlan(e.target.checked);
                      setPhase(1);
                      setChanged("평면");
                    }}
                  />
                  평면으로 보기
                </label>
              </div>
            ) : (
              <p className={styles.hint}>
                {current.description}
                <br />
                아래 작동 화면의 입력을 바꿔보세요
              </p>
            )}
            <button
              className={styles.textButton}
              onClick={() => {
                setPhase(1);
                setReplay((n) => n + 1);
              }}
              type="button"
            >
              연결 연출 다시 보기 ↗
            </button>
            <p className={styles.status} role="status">
              {selected === "website" &&
              !plan &&
              !reduced &&
              sceneStatus === "failed"
                ? "로드 실패 · 같은 층을 평면으로 탐색하거나 다시 시도하세요"
                : !active
                  ? "정지 · 화면으로 돌아오면 이어집니다"
                  : phase === 0
                    ? "준비 · 구성을 선택하세요"
                    : phase === 1
                      ? "연결 중 · 선택한 구성을 반영합니다"
                      : "체험 가능 · 직접 조작해보세요"}
            </p>
          </div>
          <div
            id="experience"
            ref={stageRef}
            className={styles.stage}
            data-phase={phase}
            data-active={active}
            data-change={changed}
          >
            <div className={styles.browserBar}>
              <i />
              <i />
              <i />
              <span>
                {current.label} / {current.industry}
              </span>
              <Monitor size={15} />
            </div>
            <div
              className={styles.connection}
              key={replay}
              aria-hidden="true"
            />
            <ol className={styles.assembly} aria-label="화면 조립 순서">
              <li data-complete={phase > 0}>설정 입력</li>
              <li data-complete={phase > 0}>화면 연결</li>
              <li data-complete={phase === 2}>선택 영역 반영</li>
            </ol>
            <div hidden={selected !== "website"}>
              <div className={styles.spaceHeading}>
                <p>CONCEPT SPACE / 가상 건축</p>
                <h2>
                  공간의 안쪽까지
                  <br />
                  직접 살펴보세요
                </h2>
                <span>층을 고르면 공간 정보가 바뀌어요</span>
              </div>
              <div className={`${sampleStyles.shell} ${styles.scene}`}>
                {plan || reduced ? (
                  <div className={styles.planView}>
                    <FloorPlan
                      floor={Math.max(0, floor)}
                      room={room}
                      onRoom={setRoom}
                    />
                    <p>
                      {reduced
                        ? "감소 모션 · 평면으로 같은 공간을 탐색합니다"
                        : "공간을 눌러 설명을 확인하세요"}
                    </p>
                  </div>
                ) : (
                  <BuildingScene
                    onStatus={setSceneStatus}
                    floor={floor}
                    room={room}
                    stage={3}
                    exploded={exploded}
                    night={false}
                    resetToken={0}
                    active={active && selected === "website"}
                    brandLighting
                    assemblyPhase={phase}
                    onFloor={setFloor}
                    onRoom={setRoom}
                  />
                )}
              </div>
              <div className={styles.floorButtons}>
                {["전체", "1F", "2F", "3F"].map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={floor === i - 1}
                    onClick={() => {
                      setFloor(i - 1);
                      setRoom(0);
                      setPhase(2);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className={styles.spaceInfo}>
                <Layers3 size={22} />
                <div aria-live="polite">
                  <h3>
                    {floor < 0
                      ? "층과 공간이 연결된 하나의 건물"
                      : `${floor + 1}F · ${info.spaces[room].name}`}
                  </h3>
                  <p>
                    {floor < 0
                      ? "층 버튼이나 건물을 눌러 공간의 쓰임을 확인하세요"
                      : info.spaces[room].detail}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={makeSummary}
                  aria-label="선택한 공간 상담 준비"
                >
                  <ArrowUpRight />
                </button>
              </div>
              {floor >= 0 && (
                <div className={styles.roomButtons}>
                  {info.spaces.map((s, i) => (
                    <button
                      key={s.name}
                      type="button"
                      aria-pressed={room === i}
                      onClick={() => setRoom(i)}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {visited.includes("shopping-mall") && (
              <div
                hidden={selected !== "shopping-mall"}
                className={`${sampleStyles.shell} ${styles.sample}`}
              >
                <FashionSample onConsult={consult} />
              </div>
            )}
            {visited.includes("automation") && (
              <div
                hidden={selected !== "automation"}
                className={`${sampleStyles.shell} ${styles.sample}`}
              >
                <LeadsSample
                  active={active && selected === "automation"}
                  onConsult={consult}
                />
              </div>
            )}
          </div>
          <p className={styles.sampleNote}>
            가상 브랜드 기능 시연{" "}
            <span>실제 주문·결제·외부 발송은 이루어지지 않습니다</span>
          </p>
        </section>
        <section className={styles.section} aria-labelledby="results-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>02 / WORKING SAMPLES</p>
              <h2 id="results-title">직접 써보는 결과물</h2>
            </div>
            <p>
              선택하고 입력해보세요
              <br />
              기능과 화면이 함께 바뀝니다
            </p>
          </div>
          <div className={styles.serviceCards}>
            {services.map((s, i) => (
              <a
                href="#experience"
                key={s.id}
                data-card-service={s.id}
                onClick={() => choose(s.id)}
              >
                <div className={`${styles.serviceArt} ${styles[`art${i}`]}`}>
                  <Image
                    src={`/lab/sample-${s.id}.webp`}
                    alt={`${s.title} 작동 화면`}
                    width={720}
                    height={450}
                  />
                  <span>
                    {
                      [
                        "SPACE / FLOOR / STORY",
                        "PRODUCT / FIT / ORDER",
                        "INPUT → MATCH → RESULT",
                      ][i]
                    }
                  </span>
                </div>
                <h3>
                  {s.title} <ArrowUpRight size={20} />
                </h3>
                <p>{s.description}</p>
                <small>가상 브랜드 기능 시연</small>
              </a>
            ))}
          </div>
          <details
            className={styles.detail}
            onToggle={(e) => setDetail(e.currentTarget.open)}
          >
            <summary>건축 샘플 상세 체험 열기 · 공간과 공정 살펴보기</summary>
            {detail && (
              <div className={sampleStyles.shell}>
                <ArchitectureSample active={detail} onConsult={consult} />
              </div>
            )}
          </details>
        </section>
        <section
          id="gallery"
          className={styles.section}
          aria-labelledby="gallery-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>03 / OTHER PERSPECTIVES</p>
              <h2 id="gallery-title">다른 업종의 화면</h2>
            </div>
            <p>
              포트폴리오용 가상 브랜드 · 이미지 시안
              <br />
              가상 브랜드 기능 시연과 구분한 디자인 자료
            </p>
          </div>
          <div className={styles.gallery}>
            {gallery.map((g, i) => (
              <button
                type="button"
                key={g.id}
                onClick={() => setImageOpen(i)}
                aria-label={`${g.name} 이미지 시안 크게 보기`}
              >
                <div className={styles.devicePair}>
                  <div className={styles.desktopFrame}>
                    <div className={styles.miniBar}>● ● ●</div>
                    <Image
                      src={`/lab/${g.id}-pc.webp`}
                      alt={`${g.name} PC 홈 이미지 시안`}
                      width={720}
                      height={900}
                    />
                  </div>
                  <div className={styles.phoneFrame}>
                    <Image
                      src={`/lab/${g.id}-mobile.webp`}
                      alt={`${g.name} 모바일 이미지 시안`}
                      width={240}
                      height={520}
                    />
                  </div>
                </div>
                <h3>
                  {g.name}
                  <ArrowUpRight size={18} />
                </h3>
                <p>
                  {g.industry} · {g.detail}
                </p>
                <small>{g.note}</small>
              </button>
            ))}
          </div>
        </section>
        <section
          id="your-business"
          className={styles.section}
          aria-labelledby="business-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>04 / YOUR BUSINESS</p>
              <h2 id="business-title">내 업종에 맞는 기능</h2>
            </div>
            <p>
              관심 있는 기능을 골라
              <br />
              상담할 내용을 정리해보세요
            </p>
          </div>
          <div className={styles.industryButtons}>
            {gallery.map((g, i) => (
              <button
                type="button"
                key={g.id}
                aria-pressed={industry === i}
                onClick={() => {
                  setIndustry(i);
                  setFeatures([]);
                }}
              >
                {g.industry}
              </button>
            ))}
          </div>
          <div className={styles.businessGrid}>
            <div className={styles.businessImage}>
              <Image
                src={`/lab/${gallery[industry].id}-pc.webp`}
                alt={`${gallery[industry].name} ${gallery[industry].industry} 화면 시안`}
                width={720}
                height={900}
              />
              <span>포트폴리오용 가상 브랜드 · 이미지 시안</span>
            </div>
            <div className={styles.featurePanel}>
              <h3>{gallery[industry].industry}에서 살펴볼 기능</h3>
              <p>제작 범위를 논의하기 위한 구성 예시</p>
              {industryFeatures[industry].map((f, i) => (
                <label key={f}>
                  <input
                    type="checkbox"
                    checked={features.includes(f)}
                    onChange={(e) =>
                      setFeatures((list) =>
                        e.target.checked
                          ? [...list, f]
                          : list.filter((v) => v !== f),
                      )
                    }
                  />
                  <span>
                    <small>0{i + 1}</small>
                    {f}
                  </span>
                </label>
              ))}
              <p aria-live="polite">선택한 기능 {features.length}개</p>
              <button
                className={styles.cta}
                type="button"
                onClick={makeSummary}
              >
                선택한 구성으로 상담하기 <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
        </section>
        <section
          id="process"
          className={styles.section}
          aria-labelledby="process-title"
        >
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>05 / TOGETHER, STEP BY STEP</p>
              <h2 id="process-title">함께 만드는 과정</h2>
            </div>
            <p>
              각 단계를 열어 제공물과 AI 역할을 확인하세요
              <br />
              시안과 완성 화면은 사용자가 확인합니다
            </p>
          </div>
          <div className={styles.process}>
            {process.map(([name, result, role, description], i) => (
              <details key={name}>
                <summary>
                  <span>0{i + 1}</span>
                  <h3>{name}</h3>
                  <p>{result}</p>
                  <b>+</b>
                </summary>
                <div>
                  <strong>{role}</strong>
                  <p>{description}</p>
                  <small>
                    확인 기준 · 목적과 선택한 구성에 맞는지 사용자와 점검
                  </small>
                </div>
              </details>
            ))}
          </div>
          <div className={styles.aiRoles}>
            <div>
              <Code2 />
              <h3>Opus 기획</h3>
              <p>요청과 참고 자료를 화면의 흐름으로 정리</p>
            </div>
            <div>
              <Monitor />
              <h3>Codex 구현</h3>
              <p>입력과 상태를 실제 작동 화면으로 연결</p>
            </div>
            <div>
              <Layers3 />
              <h3>Sonnet 검수</h3>
              <p>다른 관점으로 화면과 예외 흐름 확인</p>
            </div>
          </div>
        </section>
        <section className={styles.section} aria-labelledby="stack-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>06 / FROM SCREEN TO OPERATIONS</p>
              <h2 id="stack-title">화면부터 운영까지</h2>
            </div>
            <p>
              기능의 목적에 맞춰 기술을 고릅니다
              <br />
              실제 운영 연동 범위는 상담에서 정합니다
            </p>
          </div>
          <div className={styles.stack}>
            {[
              ["Next.js", "화면과 입력", "페이지와 선택값을 연결하는 기반"],
              ["GSAP", "전환과 흐름", "장면과 요소의 움직임을 구성하는 도구"],
              [
                "Three.js",
                "공간과 탐색",
                "층과 공간을 직접 선택하는 입체 화면",
              ],
            ].map(([name, title, description]) => (
              <article key={name}>
                <Code2 size={32} />
                <h3>{name}</h3>
                <strong>{title}</strong>
                <p>{description}</p>
              </article>
            ))}
            <div className={styles.finalCta}>
              <p>지금, 당신의 아이디어를</p>
              <h3>작동하는 화면으로</h3>
              <button type="button" onClick={makeSummary}>
                선택한 구성으로 상담하기 <ArrowUpRight />
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <Link href="/">AIO / A PRISM TO PRODUCT</Link>
        <p>웹사이트 · 쇼핑몰 · 자동화</p>
        <Link href={contactHref}>제작 상담 ↗</Link>
      </footer>
      <div className={`${sampleStyles.shell} ${styles.dialogHost}`}>
        <SampleDialog
          open={Boolean(summary)}
          title="선택한 구성으로 상담 준비"
          onClose={() => setSummary("")}
        >
          <div className={styles.summary}>
            <label htmlFor="lab-summary">
              상담에 남길 내용 · 자유롭게 수정하세요
            </label>
            <textarea
              id="lab-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={9}
            />
            <button
              type="button"
              className={styles.cta}
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(summary);
                  setCopyStatus("선택 내용을 복사했습니다");
                } catch {
                  setCopyStatus(
                    "복사하지 못했습니다 위 내용을 직접 선택해 복사해주세요",
                  );
                }
              }}
            >
              선택 내용 복사
            </button>
            <p role="status">{copyStatus}</p>
            <Link
              href={`/content/contact?${new URLSearchParams({ service: selected, industry: summaryIndustry ?? current.industry, source: "lab", message: summary })}`}
              className={styles.cta}
            >
              기존 문의로 이동 <ArrowUpRight size={18} />
            </Link>
          </div>
        </SampleDialog>
        <SampleDialog
          open={imageOpen !== null}
          title={
            imageOpen === null
              ? "이미지 시안"
              : `${gallery[imageOpen].name} · 이미지 시안`
          }
          onClose={() => setImageOpen(null)}
        >
          {imageOpen !== null && (
            <div className={styles.lightbox}>
              <p>포트폴리오용 가상 브랜드 · 이미지 시안</p>
              <Image
                src={`/lab/${gallery[imageOpen].id}-pc.webp`}
                width={1200}
                height={1500}
                alt={`${gallery[imageOpen].name} 전체 이미지 시안`}
              />
            </div>
          )}
        </SampleDialog>
      </div>
    </div>
  );
}
