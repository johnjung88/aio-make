"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { defaults, type ContentSlug } from "@/lib/marketing/cms-schema";

type Fields = Record<string, string>;
type Version = {
  id: string;
  slug: ContentSlug;
  title: string;
  body: string;
  version: number;
  state: string;
};
const names: Record<ContentSlug, string> = {
  home: "메인 소개",
  marketing: "마케팅 제공 범위",
  pricing: "가격표",
  projects: "자체 프로젝트",
  resources: "자료실",
};
const labels: Record<string, string> = {
  title: "제목",
  description: "소개 문구",
  tag: "구분",
  text: "설명",
  order: "누적 유료 계약 순번",
  amount: "월 이용료 (만원·VAT 별도)",
  guarantee: "연속 가격 보장기간",
  name: "프로젝트 이름",
  kind: "프로젝트 유형",
  slug: "다운로드 자료",
};
const stateNames: Record<string, string> = {
  draft: "초안",
  published: "공개",
  retired: "이전 공개본",
};
function rowsFor(slug: ContentSlug): Fields[] {
  const v = defaults[slug];
  return (Array.isArray(v) ? v : [v]).map((x) => ({ ...x }));
}
export function ContentAdmin() {
  const [slug, setSlug] = useState<ContentSlug>("home"),
    [rows, setRows] = useState<Fields[]>(rowsFor("home")),
    [items, setItems] = useState<Version[]>([]),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      const r = await fetch("/api/admin/marketing-content");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setItems(d);
    } catch {
      setMessage(
        "콘텐츠 이력을 불러오지 못했습니다. 연결 상태를 확인해 주세요.",
      );
    }
  }
  useEffect(() => {
    void load();
  }, []);
  function change(index: number, key: string, value: string) {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  }
  async function save(version?: Version) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const r = await fetch("/api/admin/marketing-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: version?.slug || slug,
          title: version?.title || names[slug],
          body:
            version?.body || JSON.stringify(slug === "home" ? rows[0] : rows),
          publish: !!version,
          version: version?.id,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessage(
        version
          ? "선택한 버전을 공개했습니다."
          : "새 초안을 저장했습니다. 아래 이력에서 미리보기를 확인하세요.",
      );
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "저장하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="m-site">
      <section className="m-section">
        <h1>공개 콘텐츠 관리</h1>
        <p>
          기존 내용을 보존하면서 새 버전으로 저장합니다. 미리보기로 확인한
          버전만 공개하세요.
        </p>
        <Link href="/admin/marketing-preview">디자인 A/B 비교 →</Link>
        <form
          className="m-form"
          style={{ padding: 0 }}
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
        >
          <label>
            관리 영역
            <select
              value={slug}
              onChange={(e) => {
                const s = e.target.value as ContentSlug;
                setSlug(s);
                setRows(rowsFor(s));
              }}
            >
              {Object.entries(names).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {slug === "pricing" && (
            <p>
              가격표 수정은 계약 순번·가격 보장·갱신 조건과 함께 검토해야
              합니다. 공개 전에 확정 사업 기준과 대조하세요.
            </p>
          )}
          {slug === "projects" && (
            <p>
              자체 프로젝트와 고객 실적을 구분하고 확인된 사실만 작성하세요.
            </p>
          )}
          {rows.map((row, index) => (
            <fieldset
              className="m-card"
              key={index}
              style={{ marginBottom: 20 }}
            >
              <legend>
                {slug === "home" ? "메인 문구" : `항목 ${index + 1}`}
              </legend>
              {Object.entries(row).map(([key, value]) => (
                <label key={key}>
                  {labels[key] || key}
                  {key === "slug" ? (
                    <select
                      value={value}
                      onChange={(e) => change(index, key, e.target.value)}
                    >
                      <option value="marketing-checklist">
                        마케팅 운영 점검표
                      </option>
                      <option value="consultation-prep">상담 준비자료</option>
                    </select>
                  ) : ["text", "description"].includes(key) ? (
                    <textarea
                      required
                      value={value}
                      maxLength={3000}
                      onChange={(e) => change(index, key, e.target.value)}
                    />
                  ) : (
                    <input
                      required
                      value={value}
                      maxLength={3000}
                      inputMode={key === "amount" ? "decimal" : undefined}
                      onChange={(e) => change(index, key, e.target.value)}
                    />
                  )}
                </label>
              ))}
              {slug !== "home" && (
                <button
                  type="button"
                  onClick={() => setRows(rows.filter((_, i) => i !== index))}
                >
                  이 항목을 초안에서 제외
                </button>
              )}
            </fieldset>
          ))}
          {slug !== "home" && (
            <button
              type="button"
              className="m-text-link"
              onClick={() =>
                setRows([
                  ...rows,
                  Object.fromEntries(
                    Object.keys(rowsFor(slug)[0]).map((k) => [
                      k,
                      k === "slug" ? "marketing-checklist" : "",
                    ]),
                  ),
                ])
              }
            >
              + 항목 추가
            </button>
          )}
          <div className="m-actions">
            <button className="m-button" disabled={busy}>
              새 초안 버전 저장
            </button>
            <button type="button" onClick={() => setRows(rowsFor(slug))}>
              기준 문구 불러오기
            </button>
          </div>
        </form>
        {message && (
          <p role="status" style={{ marginTop: 20 }}>
            {message}
          </p>
        )}
        <h2 style={{ marginTop: 50 }}>변경 이력</h2>
        {items.map((v) => (
          <article className="m-card" key={v.id} style={{ marginBottom: 15 }}>
            <h3>
              {names[v.slug]} v{v.version} · {stateNames[v.state] || v.state}
            </h3>
            <Link href={"/admin/marketing-preview?content=" + v.id}>
              이 버전 미리보기 →
            </Link>
            <div className="m-actions">
              <button
                onClick={() => {
                  const parsed = JSON.parse(v.body);
                  setSlug(v.slug);
                  setRows(Array.isArray(parsed) ? parsed : [parsed]);
                  setMessage(
                    `${names[v.slug]} v${v.version}을 편집에 불러왔습니다. 저장하면 새 버전이 됩니다.`,
                  );
                }}
              >
                이 버전으로 새 초안 작성
              </button>
              {v.state === "draft" && (
                <button
                  className="m-button"
                  disabled={busy}
                  onClick={() => {
                    if (confirm(`${names[v.slug]} v${v.version}을 공개할까요?`))
                      void save(v);
                  }}
                >
                  이 버전 공개
                </button>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
