"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  contactSelection,
  pageBand,
  reconcileOrders,
  roleNames,
  featureNames,
  defaultPermissions,
  initialRequests,
} from "@/lib/lab-renewal-engine";
import styles from "./renewal.module.css";

function Choices({
  label,
  values,
  value,
  onChange,
}: {
  label: string;
  values: readonly string[];
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <div
        className={styles.choices}
        onKeyDown={(event) => {
          if (
            !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(
              event.key,
            )
          )
            return;
          event.preventDefault();
          const next =
            (values.indexOf(value) +
              (event.key === "ArrowRight" || event.key === "ArrowDown"
                ? 1
                : -1) +
              values.length) %
            values.length;
          onChange(values[next]);
          event.currentTarget.querySelectorAll("button")[next]?.focus();
        }}
      >
        {values.map((s) => (
          <button
            type="button"
            key={s}
            aria-pressed={value === s}
            onClick={() => onChange(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Consult({
  service,
  plan,
  message,
}: {
  service: string;
  plan: string;
  message: string;
}) {
  return (
    <Link
      className={`${styles.button} ${styles.consultButton}`}
      href={contactSelection(service, "signature", plan, message)}
    >
      이 내용으로 상담하기 ↗
    </Link>
  );
}
function Reset({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.smallButton} onClick={onClick}>
      처음으로
    </button>
  );
}
const fixed = [
  "홈",
  "소개",
  "서비스",
  "사례",
  "자주 묻는 질문",
  "오시는 길",
  "문의",
];
const industries = [
  "사무소·전문직",
  "병원·클리닉",
  "학원·교육",
  "매장·음식점",
  "제조·B2B",
];
export function PagePlanner() {
  const [industry, setIndustry] = useState(industries[0]),
    [pages, setPages] = useState(["홈", "소개", "서비스", "문의"]),
    [count, setCount] = useState(0),
    [extra, setExtra] = useState<string[]>([]),
    [name, setName] = useState(""),
    [flags, setFlags] = useState([false, false, false]);
  const total = pages.length + count + extra.length;
  const preview =
    industry === "병원·클리닉"
      ? { name: "seoriongyeol", brand: "서리온결" }
      : industry === "학원·교육"
        ? { name: "tiumpath", brand: "틔움패스" }
        : industry === "매장·음식점"
          ? { name: "mogrevit", brand: "모그레빗" }
          : industry === "제조·B2B"
            ? { name: "tilsak", brand: "틸삭" }
            : { name: "munseodam", brand: "문서담" };
  const list = [
    ...pages,
    ...(count ? [`서비스 상세 ×${count}`] : []),
    ...extra,
  ];
  const reset = () => {
    setIndustry(industries[0]);
    setPages(["홈", "소개", "서비스", "문의"]);
    setCount(0);
    setExtra([]);
    setName("");
    setFlags([false, false, false]);
  };
  const message = `업종: ${industry}\n페이지 ${total}개: ${list.join(", ")}\n대시보드: ${flags[0] ? "필요" : "불필요"}\n이미지 자료: ${flags[1] ? "없음" : "있음"}\n회원·결제·예약: ${flags[2] ? "필요" : "불필요"}`;
  return (
    <div className={styles.signature}>
      <div className={`${styles.signatureGrid} ${styles.plannerGrid}`}>
        <div className={styles.controls}>
          <Choices
            label="업종"
            values={industries}
            value={industry}
            onChange={(s) => {
              setIndustry(s);
              setPages(
                s === industries[1]
                  ? ["홈", "소개", "서비스", "오시는 길", "문의"]
                  : ["홈", "소개", "서비스", "문의"],
              );
              setCount(s === industries[1] ? 3 : s === industries[4] ? 2 : 0);
              setExtra([]);
            }}
          />
          <fieldset>
            <legend>필요한 페이지 · 여러 개 선택</legend>
            <div className={styles.checks}>
              {fixed.map((s) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={pages.includes(s)}
                    disabled={s === "홈"}
                    onChange={() =>
                      setPages((p) =>
                        p.includes(s) ? p.filter((x) => x !== s) : [...p, s],
                      )
                    }
                  />
                  <span>{s === "홈" ? "홈 · 필수" : s}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <details className={styles.plannerExtras}>
            <summary>상세 페이지·추가 기능 설정</summary>
            <div>
              <p>서비스 상세 개수</p>
              <div className={styles.counter}>
                <button
                  className={styles.smallButton}
                  aria-label="서비스 상세 줄이기"
                  onClick={() => setCount(Math.max(0, count - 1))}
                >
                  −
                </button>
                <output aria-label="서비스 상세 개수">{count}</output>
                <button
                  className={styles.smallButton}
                  aria-label="서비스 상세 늘리기"
                  onClick={() => setCount(Math.min(15, count + 1))}
                >
                  +
                </button>
              </div>
            </div>
            <label>
              직접 추가할 페이지
              <input
                className={styles.input}
                value={name}
                maxLength={30}
                placeholder="예: 이용 안내"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button
              className={styles.smallButton}
              disabled={!name.trim() || extra.length >= 5}
              onClick={() => {
                setExtra([...extra, name.trim()]);
                setName("");
              }}
            >
              페이지 추가 ({extra.length}/5)
            </button>
            {extra.map((s, i) => (
              <button
                className={styles.smallButton}
                key={i}
                onClick={() => setExtra(extra.filter((_, at) => at !== i))}
              >
                {s} 삭제 ×
              </button>
            ))}
            <div className={styles.checks}>
              {[
                "대시보드 필요",
                "사진·이미지 자료가 없어요",
                "회원·결제·예약이 필요해요",
              ].map((s, i) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={flags[i]}
                    onChange={() =>
                      setFlags(flags.map((v, j) => (i === j ? !v : v)))
                    }
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </details>
          <a className={styles.mobileResult} href="#planner-result">
            결과 보기 ↓
          </a>
          <Reset onClick={reset} />
        </div>
        <div className={styles.result} id="planner-result">
          <p className={styles.status}>
            공개 가격 구간 안내예요
            <br />
            페이지 산정과 기능 범위, VAT는 견적에서 확인합니다
          </p>
          <p className={styles.resultTitle} aria-live="polite">
            {total}페이지 · {pageBand(total)}
          </p>
          {flags[0] && <p>대시보드 +3만 원 · 기능 범위 사전 합의</p>}
          {flags[1] && (
            <p>
              AI 이미지 제작·적용 포함
              <br />
              실제 제품·실적·인증 자료는 직접 준비
            </p>
          )}
          {flags[2] && <p>추가 기능은 별도 견적</p>}
          <div className={styles.sitemap} aria-label="선택한 사이트 지도">
            {list.map((s, i) => (
              <span key={i}>↳ {s}</span>
            ))}
          </div>
          <div
            className={styles.sitePreview}
            aria-label="선택한 페이지를 반영한 모바일 웹사이트 예시"
          >
            <div className={styles.previewHeader}>
              <strong>{preview.brand}</strong>
              <span>{industry}</span>
            </div>
            <div className={styles.previewNav}>
              {list.map((s) => (
                <span key={s}>{s}</span>
              ))}
            </div>
            <div className={styles.previewHero}>
              <Image
                src={`/lab-references/${preview.name}-mobile.webp`}
                width={480}
                height={844}
                sizes="360px"
                alt={`${preview.brand} 가상 브랜드 모바일 화면 전체 예시`}
              />
            </div>
          </div>
          <p className={styles.note}>
            고른 항목 1개를 1페이지로 계산한 안내입니다
            <br />
            가상 브랜드 화면 예시 · 서리온결은 AI 생성 인물 포함
          </p>
        </div>
      </div>
      <div className={styles.signatureConsult}>
        <Consult service="website" plan={`pages-${total}`} message={message} />
      </div>
    </div>
  );
}
function ShopPreview({
  full,
  brand,
  mood,
  category,
}: {
  full: boolean;
  brand: string;
  mood: string;
  category: string;
}) {
  const image = full
    ? `/lab-renewal/shop-${["내추럴", "모던 블랙", "파스텔"].indexOf(mood)}-${["의류", "식품", "생활용품"].indexOf(category)}.webp`
    : "/lab-renewal/shop-0-2.webp";
  return (
    <div className={styles.shopScreen} data-mood={full ? mood : ""}>
      <div className={styles.shopNav}>
        <strong>{full ? brand || "모그레빗" : "LIVING EDIT"}</strong>
        <span>COLLECTION / STORY</span>
      </div>
      <div className={styles.shopPhoto}>
        <Image
          src={image}
          width={1600}
          height={600}
          sizes="(max-width: 900px) 90vw, 45vw"
          alt={
            full
              ? `${mood} ${category} 컬렉션 사진`
              : "기본 템플릿의 생활 소품 컬렉션 사진"
          }
        />
      </div>
      <div className={styles.shopEditorial}>
        <small>
          {full ? "YOUR BRAND COLLECTION" : "THE EVERYDAY COLLECTION"}
        </small>
        <strong>
          {full
            ? `${brand || "모그레빗"}의 ${category} 컬렉션`
            : "취향이 머무는 일상"}
        </strong>
        <p>
          {full
            ? "브랜드에 맞춘 로고와 배너를 적용한 화면"
            : "완성된 템플릿의 사진과 구성을 그대로 옮기는 화면"}
        </p>
        <div className={styles.shopMenu}>
          <span>컬렉션 살펴보기 ↗</span>
          <span>브랜드 이야기 ↗</span>
        </div>
      </div>
    </div>
  );
}
export function ShopComparison() {
  const [plan, setPlan] = useState("단순 복사"),
    [brand, setBrand] = useState("모그레빗"),
    [mood, setMood] = useState("내추럴"),
    [category, setCategory] = useState("의류"),
    [view, setView] = useState("PC"),
    [split, setSplit] = useState(50);
  const full = plan === "풀 세팅";
  return (
    <div className={styles.signature}>
      <div className={styles.signatureGrid}>
        <div className={styles.controls}>
          <Choices
            label="상품"
            values={["단순 복사", "풀 세팅"]}
            value={plan}
            onChange={setPlan}
          />
          {full && (
            <>
              <label>
                브랜드 이름
                <input
                  className={styles.input}
                  maxLength={12}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </label>
              <Choices
                label="분위기"
                values={["내추럴", "모던 블랙", "파스텔"]}
                value={mood}
                onChange={setMood}
              />
              <Choices
                label="대표 상품군"
                values={["의류", "식품", "생활용품"]}
                value={category}
                onChange={setCategory}
              />
            </>
          )}
          <Choices
            label="보기"
            values={["PC", "모바일"]}
            value={view}
            onChange={setView}
          />
          <p className={styles.resultTitle} aria-live="polite">
            {plan} · 총 {full ? "30" : "15"}만 원
          </p>
          <p>두 상품의 가격은 합산하지 않습니다</p>
          <Reset
            onClick={() => {
              setPlan("단순 복사");
              setBrand("모그레빗");
              setMood("내추럴");
              setCategory("의류");
              setView("PC");
              setSplit(50);
            }}
          />
        </div>
        <div className={styles.result}>
          <p className={styles.status}>
            가상 템플릿 예시예요
            <br />
            실제 적용은 고른 템플릿의 이용권과 지원 범위를 확인한 뒤 진행합니다
          </p>
          {!full && (
            <div
              style={{
                maxWidth: view === "모바일" ? 280 : undefined,
                width: "100%",
                margin: "auto",
              }}
            >
              <ShopPreview
                full={full}
                brand={brand}
                mood={mood}
                category={category}
              />
            </div>
          )}
          {full && (
            <>
              <label htmlFor="shop-split">
                복사 ↔ 풀 세팅 비교 · {split}%
              </label>
              <input
                id="shop-split"
                className={styles.range}
                type="range"
                min={0}
                max={100}
                value={split}
                onChange={(e) => setSplit(Number(e.target.value))}
              />
              <div
                className={styles.compare}
                style={{
                  maxWidth: view === "모바일" ? 280 : undefined,
                  width: "100%",
                  margin: "auto",
                }}
              >
                <ShopPreview
                  full={false}
                  brand={brand}
                  mood={mood}
                  category={category}
                />
                <div
                  className={styles.compareOverlay}
                  style={{ clipPath: `inset(0 0 0 ${split}%)` }}
                >
                  <ShopPreview
                    full
                    brand={brand}
                    mood={mood}
                    category={category}
                  />
                </div>
              </div>
            </>
          )}
          <div className={styles.scope}>
            <div>
              <h3>AIO가 하는 일</h3>
              <p>
                {full
                  ? "디자인 복사 + 기본 로고·배너 제작·적용"
                  : "완성 템플릿 디자인 복사"}
              </p>
            </div>
            <div>
              <h3>고객이 따로 정하는 일</h3>
              <p>상품 등록 · PG · 배송 · 오픈 설정</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.signatureConsult}>
        <Consult
          service="shopping-mall"
          plan={full ? "full" : "copy"}
          message={`상품: ${plan}\n브랜드: ${brand}\n분위기: ${mood}\n상품군: ${category}`}
        />
      </div>
    </div>
  );
}
export function CsvRunner() {
  const [problems, setProblems] = useState([true, true, true]),
    [normalize, setNormalize] = useState(false),
    [result, setResult] = useState<ReturnType<typeof reconcileOrders> | null>(
      null,
    ),
    [tab, setTab] = useState("일치"),
    [phase, setPhase] = useState(0),
    [input, setInput] = useState("CSV"),
    [process, setProcess] = useState("대조"),
    [output, setOutput] = useState("파일");
  useEffect(() => {
    if (phase < 1 || phase >= 4) return;
    const timer = setTimeout(() => setPhase((p) => p + 1), 220);
    return () => clearTimeout(timer);
  }, [phase]);
  const run = () => {
    setResult(
      reconcileOrders({
        format: problems[0],
        empty: problems[1],
        duplicate: problems[2],
        normalize,
      }),
    );
    setPhase(matchMedia("(prefers-reduced-motion: reduce)").matches ? 4 : 1);
  };
  return (
    <div className={styles.signature}>
      <div className={styles.signatureGrid}>
        <div className={styles.controls}>
          <fieldset>
            <legend>문제 섞기</legend>
            <div className={styles.checks}>
              {[
                "주문번호 형식 다름 (#1023 / 1023)",
                "빈 값 (수량 누락)",
                "같은 주문 두 번",
              ].map((s, i) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={problems[i]}
                    onChange={() => {
                      setProblems(problems.map((v, j) => (i === j ? !v : v)));
                      setResult(null);
                      setPhase(0);
                    }}
                  />
                  <span>{s}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className={styles.checkChip}>
            <input
              type="checkbox"
              checked={normalize}
              onChange={(e) => {
                setNormalize(e.target.checked);
                setResult(null);
                setPhase(0);
              }}
            />
            <span>규칙 바꾸기 · 주문번호 앞 # 자동 제거</span>
          </label>
          <button
            className={styles.button}
            onClick={run}
            disabled={phase > 0 && phase < 4}
          >
            대조 실행
          </button>
          <div className={styles.mock}>
            <strong>판매처 A 주문.csv / 판매처 B 주문.csv</strong>
            <p>각 12줄의 가상 주문 자료</p>
            <div className={styles.mockRow}>
              1023 / #1023<span>수량 3</span>
            </div>
            <div className={styles.mockRow}>
              1025 / 1025<span>수량 누락</span>
            </div>
          </div>
          <Choices
            label="내 업무로 바꿔 보기 · 입력"
            values={["엑셀", "CSV", "연결 서비스", "폼 문의"]}
            value={input}
            onChange={setInput}
          />
          <Choices
            label="처리"
            values={["정리", "대조", "조건 판단"]}
            value={process}
            onChange={setProcess}
          />
          <Choices
            label="결과"
            values={["파일", "기록", "알림"]}
            value={output}
            onChange={setOutput}
          />
          <p>실제 자료는 상담에서 개인정보를 가린 형태로 확인합니다</p>
          <Reset
            onClick={() => {
              setProblems([true, true, true]);
              setNormalize(false);
              setResult(null);
              setPhase(0);
              setTab("일치");
              setInput("CSV");
              setProcess("대조");
              setOutput("파일");
            }}
          />
        </div>
        <div className={styles.result}>
          <p className={styles.status}>
            가상 데이터 시연이에요
            <br />
            실제 연결과 실행 환경은 상담에서 정합니다
          </p>
          <div className={styles.flow}>
            {["받기", "맞추기", "비교하기", "확인하기"].map((s, i) => (
              <span key={s} data-complete={phase > i}>
                {s}
              </span>
            ))}
          </div>
          <p aria-live="polite">
            {result
              ? `대조 완료 · 일치 ${result.filter((r) => r.match).length} · 확인 필요 ${result.filter((r) => !r.match).length}`
              : "문제를 고르고 대조를 실행해 보세요"}
          </p>
          <Choices
            label="결과 보기"
            values={["일치", "확인 필요"]}
            value={tab}
            onChange={setTab}
          />
          <div className={styles.dataRows}>
            {result
              ?.filter((r) => r.match === (tab === "일치"))
              .map((r, i) => (
                <div className={styles.dataRow} key={i}>
                  <b>
                    {r.id} · 수량 {r.quantity ?? "—"}
                  </b>
                  <span>
                    {r.reason || (r.normalized ? "형식 맞춤 후 일치" : "일치")}
                  </span>
                </div>
              ))}
          </div>
          <div className={styles.flow}>
            <span>{input}</span>→<span>{process}</span>→<span>{output}</span>
          </div>
        </div>
      </div>
      <div className={styles.signatureConsult}>
        <Consult
          service="automation"
          plan="flow"
          message={`입력: ${input}\n처리: ${process}\n결과: ${output}\n자주 생기는 문제: ${["주문번호 형식 다름", "빈 값", "중복"].filter((_, i) => problems[i]).join(", ") || "없음"}`}
        />
      </div>
    </div>
  );
}
export function RolePreview() {
  const [role, setRole] = useState("요청자"),
    [permissions, setPermissions] = useState(defaultPermissions),
    [env, setEnv] = useState("웹"),
    [requests, setRequests] = useState(initialRequests),
    [history, setHistory] = useState<string[]>([]),
    [showHistory, setShowHistory] = useState(false),
    [newTitle, setNewTitle] = useState("");
  const ri = roleNames.indexOf(role as (typeof roleNames)[number]),
    perm = permissions[ri];
  const rows = requests.filter((r) =>
    ri === 2 || ri === 0
      ? r.owner === "가상 민서" || ri === 2
      : r.assignee === "가상 하람",
  );
  const change = (
    id: number,
    key: "status" | "assignee" | "note",
    value: string,
  ) => {
    setRequests(
      requests.map((r) => (r.id === id ? { ...r, [key]: value } : r)),
    );
    setHistory((h) => [`${role} · 요청 ${id} · ${value}`, ...h]);
  };
  const enabled = featureNames.filter((_, i) => permissions.some((p) => p[i]));
  return (
    <div className={styles.signature}>
      <div className={styles.signatureGrid}>
        <div className={styles.controls}>
          <Choices
            label="역할"
            values={roleNames}
            value={role}
            onChange={setRole}
          />
          <fieldset className={styles.mobilePermissions}>
            <legend>{role} 기능 선택</legend>
            <div className={styles.checks}>
              {featureNames.map((s, i) => (
                <label key={s}>
                  <input
                    type="checkbox"
                    checked={perm[i]}
                    onChange={() =>
                      setPermissions(
                        permissions.map((p, j) =>
                          j === ri ? p.map((v, k) => (k === i ? !v : v)) : p,
                        ),
                      )
                    }
                  />
                  <span>
                    {s}
                    {i === 7 ? " · 별도 협의" : ""}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={styles.desktopPermissions}>
            <table className={styles.table}>
              <caption>역할별 기능 설정</caption>
              <thead>
                <tr>
                  <th scope="col">기능</th>
                  {roleNames.map((r) => (
                    <th scope="col" key={r}>
                      {r}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureNames.map((name, i) => (
                  <tr key={name}>
                    <th scope="row">
                      {name}
                      {i === 7 ? " · 별도 협의" : ""}
                    </th>
                    {roleNames.map((r, j) => (
                      <td key={r}>
                        <label className={styles.permissionChip}>
                          <input
                            type="checkbox"
                            aria-label={r + " " + name}
                            checked={permissions[j][i]}
                            onChange={() =>
                              setPermissions(
                                permissions.map((p, n) =>
                                  n === j
                                    ? p.map((v, k) => (k === i ? !v : v))
                                    : p,
                                ),
                              )
                            }
                          />
                          <span aria-hidden="true">
                            {permissions[j][i] ? "허용" : "제한"}
                          </span>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Choices
            label="실행 환경"
            values={["웹", "설치형", "아직 모르겠어요"]}
            value={env}
            onChange={setEnv}
          />
          <p>
            {env === "웹"
              ? "브라우저에서 접속하는 구성을 협의합니다"
              : env === "설치형"
                ? "운영체제와 설치·업데이트 조건을 확인합니다"
                : "사용 장소와 네트워크부터 함께 확인합니다"}
          </p>
          <Reset
            onClick={() => {
              setRole("요청자");
              setPermissions(defaultPermissions());
              setEnv("웹");
              setRequests(initialRequests());
              setHistory([]);
              setShowHistory(false);
              setNewTitle("");
            }}
          />
        </div>
        <div className={styles.result}>
          <p className={styles.status}>
            가상 관리 화면 예시예요
            <br />
            실제 로그인·권한·외부 연동은 상담에서 정합니다
          </p>
          <p className={styles.resultTitle} aria-live="polite">
            역할 3 · 기능 {enabled.length} · {env}
          </p>
          {perm[0] && (
            <div>
              <label>
                새 요청
                <input
                  className={styles.input}
                  value={newTitle}
                  maxLength={30}
                  placeholder="요청 제목"
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </label>
              <button
                className={styles.smallButton}
                disabled={!newTitle.trim()}
                onClick={() => {
                  setRequests([
                    ...requests,
                    {
                      id: requests.length + 1,
                      title: newTitle,
                      owner: "가상 민서",
                      assignee: "가상 하람",
                      status: "접수",
                      note: "",
                    },
                  ]);
                  setHistory([`요청자 · ${newTitle} 등록`, ...history]);
                  setNewTitle("");
                }}
              >
                요청 등록
              </button>
            </div>
          )}
          {perm[1] ? (
            <div className={styles.dataRows}>
              {rows.map((r) => (
                <article className={styles.dataRow} key={r.id}>
                  <strong>
                    #{r.id} {r.title}
                  </strong>
                  <span>{r.owner}</span>
                  {perm[2] ? (
                    <label>
                      상태
                      <select
                        className={styles.input}
                        value={r.status}
                        onChange={(e) => change(r.id, "status", e.target.value)}
                      >
                        {["접수", "진행 중", "처리 완료"].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <p>상태 · {r.status}</p>
                  )}
                  {perm[4] && (
                    <label>
                      담당자 배정
                      <select
                        className={styles.input}
                        value={r.assignee}
                        onChange={(e) =>
                          change(r.id, "assignee", e.target.value)
                        }
                      >
                        <option>가상 하람</option>
                        <option>가상 다온</option>
                      </select>
                    </label>
                  )}
                  {perm[3] && (
                    <label>
                      처리 기록
                      <input
                        className={styles.input}
                        maxLength={30}
                        value={r.note}
                        onChange={(e) => change(r.id, "note", e.target.value)}
                      />
                    </label>
                  )}
                  {perm[5] && <p>첨부 자료 · 요청 안내.pdf (예시)</p>}
                </article>
              ))}
            </div>
          ) : (
            <p>목록 조회 기능이 꺼져 있습니다</p>
          )}
          {perm[6] && (
            <>
              <button
                className={styles.smallButton}
                onClick={() => setShowHistory(!showHistory)}
              >
                변경 내역 보기
              </button>
              {showHistory && (
                <div>
                  {history.length ? (
                    history.map((x, i) => <p key={i}>{x}</p>)
                  ) : (
                    <p>변경된 내역이 없습니다</p>
                  )}
                </div>
              )}
            </>
          )}
          {perm[7] && <p>외부 알림 · 별도 협의</p>}
        </div>
      </div>
      <div className={styles.signatureConsult}>
        <Consult
          service="program"
          plan="roles"
          message={`역할: ${roleNames.join(", ")}\n기능: ${enabled.join(", ")}\n환경: ${env}\n${roleNames.map((r, i) => `${r}: ${featureNames.filter((_, j) => permissions[i][j]).join(", ")}`).join("\n")}`}
        />
      </div>
    </div>
  );
}
export function RenewalSignature({ service }: { service: string }) {
  return service === "website" ? (
    <PagePlanner />
  ) : service === "shopping-mall" ? (
    <ShopComparison />
  ) : service === "automation" ? (
    <CsvRunner />
  ) : (
    <RolePreview />
  );
}
