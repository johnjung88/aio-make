"use client";

import { useState, type CSSProperties } from "react";
import seedData from "@/content/service-cases-v14.json";
import { CONTENT_SERVICES, isContentServiceId } from "@/lib/content-site/types";
import {
  CASE_BODY_PREFIX,
  encodeServiceCaseBody,
  serviceCaseSchema,
  type ServiceCase,
} from "@/lib/service-case-schema";
import type { EntryDraft } from "./types";

const groupStyle: CSSProperties = { border: "1px solid var(--darkline)", padding: "20px", display: "grid", gap: "18px", minWidth: 0 };
const rowStyle: CSSProperties = { borderTop: "1px solid var(--darkline)", paddingTop: "18px", display: "grid", gap: "14px", minWidth: 0 };

function readDraft(body: string): ServiceCase | null {
  if (!body.startsWith(CASE_BODY_PREFIX)) return null;
  try {
    const value = JSON.parse(body.slice(CASE_BODY_PREFIX.length));
    // Keep incomplete form fields editable while refusing a malformed saved body.
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;
    for (const key of ["caseId", "slug", "title", "brand", "summary", "scope", "publicLabel", "productionStatus", "publication", "brief"]) {
      if (typeof value[key] !== "string") return null;
    }
    if (typeof value.revision !== "number" || typeof value.order !== "number") return null;
    for (const key of ["services", "assets", "decisions", "stages", "sourceWorkIds", "featuredFor"]) {
      if (!Array.isArray(value[key])) return null;
    }
    if (!value.services.every((item: unknown) => item && typeof item === "object" && ["id", "relation", "description"].every((key) => typeof (item as Record<string, unknown>)[key] === "string"))) return null;
    if (!value.assets.every((item: unknown) => item && typeof item === "object" && ["kind", "src", "alt"].every((key) => typeof (item as Record<string, unknown>)[key] === "string"))) return null;
    for (const key of ["decisions", "stages"]) {
      if (!value[key].every((item: unknown) => item && typeof item === "object" && ["title", "description"].every((field) => typeof (item as Record<string, unknown>)[field] === "string"))) return null;
    }
    return value as ServiceCase;
  } catch { return null; }
}

function editableBody(record: ServiceCase): string {
  const checked = serviceCaseSchema.safeParse(record);
  // Only the API persists a body. While typing, retain incomplete fields in the
  // parent's draft so dirty tracking and failed-save recovery remain accurate.
  return checked.success ? encodeServiceCaseBody(checked.data) : CASE_BODY_PREFIX + JSON.stringify(record);
}

function blankRecord(entry: EntryDraft): ServiceCase {
  const service = isContentServiceId(entry.service) ? entry.service : "webtoon";
  const localVideo = entry.video_url.startsWith("/") ? entry.video_url : "";
  const localCover = entry.cover_url.startsWith("/") ? entry.cover_url : "";
  return {
    caseId: "", slug: entry.slug, revision: 1, title: entry.title, brand: "", summary: entry.summary,
    scope: "", publicLabel: "제작 시안", productionStatus: "draft", publication: "draft",
    sourceWorkIds: [], services: [{ id: service, relation: "direct", description: "" }],
    assets: [{ kind: localVideo ? "video" : "image", src: localVideo || localCover, ...(localVideo && localCover ? { poster: localCover } : {}), alt: entry.title }],
    brief: "", decisions: [], stages: [], featuredFor: [], order: entry.display_order,
  };
}

export function ServiceCaseEditor({ entry, onChange }: { entry: EntryDraft; onChange: (value: EntryDraft) => void }) {
  const record = readDraft(entry.body);
  const structured = entry.body.startsWith(CASE_BODY_PREFIX);
  const [lockedIdentity] = useState(!!entry.id && structured);
  const [original, setOriginal] = useState<EntryDraft | null>(null);
  const [caseBackup, setCaseBackup] = useState<string | null>(null);
  const [seedId, setSeedId] = useState("");
  const [sourceText, setSourceText] = useState(record?.sourceWorkIds.join(", ") ?? "");
  const [notice, setNotice] = useState("");

  function write(next: ServiceCase, entryPatch: Partial<EntryDraft> = {}) {
    const updated = { ...entry, ...entryPatch };
    const synchronized = {
      ...next, title: updated.title, slug: updated.slug, summary: updated.summary || next.scope,
      order: updated.display_order,
      services: next.services.map((service) => ({ ...service, description: service.description || next.scope })),
      assets: next.assets.map((asset) => {
        const { poster, ...rest } = asset;
        return { ...rest, alt: asset.alt || updated.title, ...(asset.kind === "video" && poster ? { poster } : {}) };
      }),
      publication: updated.is_published ? "published" as const : next.publication === "published" ? "ready" as const : next.publication,
    };
    onChange({ ...updated, body: editableBody(synchronized) });
  }

  function beginCase() {
    if (!original) setOriginal({ ...entry });
    setSourceText("");
    setNotice("이전 본문을 편집창에 보존했습니다. 저장 전에는 아래 버튼으로 복원할 수 있습니다.");
    const next = blankRecord(entry);
    onChange({ ...entry, body: editableBody(next), is_published: false, rights_confirmed: false });
  }

  function loadSeed() {
    const checked = serviceCaseSchema.safeParse(seedData.find((item) => item.caseId === seedId));
    if (!checked.success) return;
    if (!original) setOriginal({ ...entry });
    const next = checked.data;
    const first = next.assets[0];
    const firstVideo = next.assets.find((asset) => asset.kind === "video");
    setSourceText(next.sourceWorkIds.join(", "));
    setNotice("기존 정본 사례를 불러왔습니다. 같은 사례ID로 보완하며 공개 권리는 다시 확인합니다.");
    onChange({ ...entry, type: "reference", division: "video", service: next.services[0].id,
      title: next.title, slug: next.slug, summary: next.summary, body: encodeServiceCaseBody(next),
      cover_url: first.poster ?? (first.kind !== "video" ? first.src : ""), video_url: firstVideo?.src ?? "",
      display_order: next.order, kind: "example", is_published: false, rights_confirmed: false,
    });
  }

  function plainBody() {
    if (!record) return;
    setCaseBackup(entry.body);
    const body = original && !original.body.startsWith(CASE_BODY_PREFIX)
      ? original.body
      : [entry.title, entry.summary, record.scope, record.brief].filter(Boolean).join("\n\n");
    onChange({ ...entry, body, is_published: false });
    setNotice("사례 입력은 편집창에 보존했습니다. '작성하던 사례 복원'으로 돌아갈 수 있습니다.");
  }

  const seedPicker = !entry.id || !structured ? <div style={groupStyle}>
    <label>기존 정본 사례 불러오기<select value={seedId} onChange={(event) => setSeedId(event.target.value)}><option value="">새 사례를 작성하거나 정본을 선택하세요</option>{seedData.map((item) => <option key={item.caseId} value={item.caseId}>{item.title} · {item.caseId}</option>)}</select></label>
    <p>같은 작품의 기획·과정을 보강할 때 정본을 불러오세요. 관련 서비스를 추가해도 같은 사례 한 건으로 관리합니다.</p>
    <button type="button" className="secondary-button" disabled={!seedId} onClick={loadSeed}>선택한 정본 사례 불러오기</button>
  </div> : null;

  if (!structured) return <div style={{ display: "grid", gap: "18px" }}>
    <div style={groupStyle}><h3>본문 작성 방식</h3><p>일반 글은 본문에 작성합니다. 실제 제작 결과를 서비스 상세에 연결하려면 서비스 제작 사례를 선택하세요.</p><button type="button" className="secondary-button" onClick={beginCase}>현재 본문을 보존하고 서비스 제작 사례 작성</button>{caseBackup ? <button type="button" className="secondary-button" onClick={() => { onChange({ ...entry, body: caseBackup, is_published: false }); setSourceText(readDraft(caseBackup)?.sourceWorkIds.join(", ") ?? ""); }}>작성하던 사례 복원</button> : null}</div>
    {seedPicker}
    <label>본문<textarea rows={10} maxLength={30000} value={entry.body} onChange={(event) => onChange({ ...entry, body: event.target.value })} placeholder="본문을 입력하세요. 일반 텍스트로 표시됩니다." /></label>
    {notice ? <p role="status">{notice}</p> : null}
  </div>;

  if (!record) return <div role="alert" style={groupStyle}><h3>보존된 서비스 사례를 확인해주세요</h3><p>사례 구조를 읽지 못해 원문을 유지하고 있습니다. 원문을 보관한 채 새 입력을 시작하거나 이전 상태로 복원할 수 있습니다.</p><button type="button" className="secondary-button" onClick={beginCase}>원문을 보존하고 다시 작성</button>{original ? <button type="button" className="secondary-button" onClick={() => onChange(original)}>보존한 이전 내용 복원</button> : null}</div>;

  return <div className="service-case-editor" style={{ display: "grid", gap: "22px", minWidth: 0 }}>
    <div style={groupStyle}><h3>서비스 제작 사례</h3><p>결과물과 맡은 범위만 먼저 등록할 수 있습니다. 기획·판단·과정은 자료가 있을 때 추가하세요. 신규 사례를 추가해도 대표작은 유지됩니다.</p><small>사례 버전 {record.revision} · 제목·주소·요약·표시 순서는 위아래의 기존 콘텐츠 필드와 함께 저장합니다.</small><button type="button" className="secondary-button" onClick={plainBody}>일반 본문으로 전환 · 작성 중 사례 보존</button>{original ? <button type="button" className="secondary-button" onClick={() => { onChange(original); setSourceText(readDraft(original.body)?.sourceWorkIds.join(", ") ?? ""); setNotice("보존한 입력 내용으로 복원했습니다."); }}>전환 전 입력 전체 복원</button> : null}</div>
    {notice ? <p role="status">{notice}</p> : null}
    {seedPicker}
    <fieldset style={groupStyle}><legend>사례 기본 정보</legend>
      <div className="form-row"><label>사례ID<input required readOnly={lockedIdentity} maxLength={120} pattern="CASE-[A-Z0-9]+(-[A-Z0-9]+)*" value={record.caseId} onChange={(event) => write({ ...record, caseId: event.target.value })} placeholder="CASE-BRAND-PROJECT" /></label><label>브랜드·작품명<input required maxLength={1200} value={record.brand} onChange={(event) => write({ ...record, brand: event.target.value })} placeholder="브랜드명 또는 자체 IP" /></label></div>
      <label>실제 맡은 제작 범위<textarea required maxLength={1200} value={record.scope} onChange={(event) => write({ ...record, scope: event.target.value })} placeholder="예: 제품 이미지 정리·타이포 디자인·30초 모션 편집" /></label>
      <p>요약이 비어 있으면 위 제작 범위를 요약으로 사용합니다.</p>
      <div className="form-row"><label>실제 제작 상태<select value={record.productionStatus} onChange={(event) => write({ ...record, productionStatus: event.target.value as ServiceCase["productionStatus"] })}><option value="draft">제작 중·시안</option><option value="completed">제작 완료</option><option value="in-use">실제 사용 확인</option></select></label><label>화면에 표시할 상태·성격<input required maxLength={1200} value={record.publicLabel} onChange={(event) => write({ ...record, publicLabel: event.target.value })} placeholder="예: 제안용 제작 시안 · 고객 최종 확인 대기" /></label></div>
      <label>공개 준비 상태<select value={record.publication === "published" ? "ready" : record.publication} onChange={(event) => write({ ...record, publication: event.target.value as ServiceCase["publication"] }, { is_published: false })}><option value="draft">작성 중 · 비공개</option><option value="review">내용·자료 확인 중 · 비공개</option><option value="ready">공개 준비 완료 · 권리 확인 후 게시 선택</option></select></label>
      <p>공개 준비 완료와 실제 제작 완료는 서로 다른 상태입니다. 제작 시안은 실제 성격을 표시한 뒤 공개할 수 있습니다.</p>
    </fieldset>

    <fieldset style={groupStyle}><legend>관련 서비스와 연결 종류</legend>
      {CONTENT_SERVICES.map((service) => {
        const relation = record.services.find((item) => item.id === service.id);
        return <div key={service.id} style={rowStyle}><label className="check-label"><input type="checkbox" checked={!!relation} onChange={(event) => write({ ...record, services: event.target.checked ? [...record.services, { id: service.id, relation: "related", description: "" }] : record.services.filter((item) => item.id !== service.id) })} />{service.label}</label>{relation ? <div className="form-row"><label>연결 종류<select value={relation.relation} onChange={(event) => write({ ...record, services: record.services.map((item) => item.id === service.id ? { ...item, relation: event.target.value as "direct" | "related" | "usage" } : item) })}><option value="direct">직접 제작한 서비스</option><option value="related">관련 제작 역량</option><option value="usage">같은 작품의 활용</option></select></label><label>이 서비스에서 보여줄 범위<input maxLength={1200} value={relation.description} onChange={(event) => write({ ...record, services: record.services.map((item) => item.id === service.id ? { ...item, description: event.target.value } : item) })} placeholder="비워두면 맡은 제작 범위를 사용합니다" /></label></div> : null}</div>;
      })}
    </fieldset>

    <fieldset style={groupStyle}><legend>완성 결과물 · 최소 한 건</legend>
      <p>사이트에 준비한 공개 자료 경로를 입력하세요. 영상은 본편과 포스터를 함께 연결합니다. 저장 시 파일 존재를 확인합니다.</p>
      {record.assets.map((asset, index) => <div key={index} style={rowStyle}>
        <div className="form-row"><label>결과물 {index + 1} 종류<select value={asset.kind} onChange={(event) => write({ ...record, assets: record.assets.map((item, itemIndex) => itemIndex === index ? { ...item, kind: event.target.value as "image" | "video" | "webtoon", ...(event.target.value === "video" ? { poster: item.poster ?? "" } : {}) } : item) })}><option value="image">이미지</option><option value="video">영상</option><option value="webtoon">웹툰 이미지</option></select></label><label>결과물 경로<input required maxLength={1500} value={asset.src} onChange={(event) => { const src = event.target.value; write({ ...record, assets: record.assets.map((item, itemIndex) => itemIndex === index ? { ...item, src } : item) }, index === 0 ? asset.kind === "video" ? { video_url: src } : { cover_url: src } : {}); }} placeholder="/service-detail-v14/result.webp" /></label></div>
        {asset.kind === "video" ? <label>영상 포스터 경로<input required maxLength={1500} value={asset.poster ?? ""} onChange={(event) => { const poster = event.target.value; write({ ...record, assets: record.assets.map((item, itemIndex) => itemIndex === index ? { ...item, poster } : item) }, index === 0 ? { cover_url: poster } : {}); }} placeholder="/service-detail-v14/poster-result.webp" /></label> : null}
        <label>이미지·영상 설명<input maxLength={1200} value={asset.alt} onChange={(event) => write({ ...record, assets: record.assets.map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item) })} placeholder="비워두면 사례 제목을 사용합니다" /></label>
        {record.assets.length > 1 ? <button type="button" className="secondary-button" onClick={() => write({ ...record, assets: record.assets.filter((_, itemIndex) => itemIndex !== index) })}>결과물 {index + 1} 입력 행 제거</button> : null}
      </div>)}
      <button type="button" className="secondary-button" onClick={() => write({ ...record, assets: [...record.assets, { kind: "image", src: "", alt: entry.title }] })}>결과물 추가</button>
    </fieldset>

    <fieldset style={groupStyle}><legend>기획과 제작 판단 · 선택 입력</legend>
      <label>작업의 출발점·기획<textarea rows={4} maxLength={3000} value={record.brief} onChange={(event) => write({ ...record, brief: event.target.value })} placeholder="실제 의뢰 목적이나 받은 자료가 있을 때 작성하세요" /></label>
      {record.decisions.map((decision, index) => <div key={index} style={rowStyle}><label>제작 판단 {index + 1}<input required maxLength={1200} value={decision.title} onChange={(event) => write({ ...record, decisions: record.decisions.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} placeholder="예: 제품의 형태를 캐릭터에 반영" /></label><label>선택 이유<textarea required maxLength={1200} value={decision.description} onChange={(event) => write({ ...record, decisions: record.decisions.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} /></label><button type="button" className="secondary-button" onClick={() => write({ ...record, decisions: record.decisions.filter((_, itemIndex) => itemIndex !== index) })}>판단 {index + 1} 입력 행 제거</button></div>)}
      <button type="button" className="secondary-button" onClick={() => write({ ...record, decisions: [...record.decisions, { title: "", description: "" }] })}>제작 판단 추가</button>
    </fieldset>

    <fieldset style={groupStyle}><legend>실제 제작 과정 · 선택 입력</legend>
      <p>실제 자료가 있는 단계만 추가하세요. 비워둔 과정은 상세페이지에 표시하지 않습니다.</p>
      {record.stages.map((stage, index) => <div key={index} style={rowStyle}><label>과정 {index + 1} 제목<input required maxLength={1200} value={stage.title} onChange={(event) => write({ ...record, stages: record.stages.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item) })} /></label><label>실제 진행 내용<textarea required maxLength={1200} value={stage.description} onChange={(event) => write({ ...record, stages: record.stages.map((item, itemIndex) => itemIndex === index ? { ...item, description: event.target.value } : item) })} /></label><label>과정 이미지 경로 · 선택<input maxLength={1500} value={stage.asset ?? ""} onChange={(event) => write({ ...record, stages: record.stages.map((item, itemIndex) => { if (itemIndex !== index) return item; const { asset: unused, ...rest } = item; void unused; return event.target.value ? { ...rest, asset: event.target.value } : rest; }) })} placeholder="/service-detail-v14/process.webp" /></label><button type="button" className="secondary-button" onClick={() => write({ ...record, stages: record.stages.filter((_, itemIndex) => itemIndex !== index) })}>과정 {index + 1} 입력 행 제거</button></div>)}
      <button type="button" className="secondary-button" onClick={() => write({ ...record, stages: [...record.stages, { title: "", description: "" }] })}>제작 과정 추가</button>
    </fieldset>

    <fieldset style={groupStyle}><legend>기존 작품 정본 연결 · 선택 입력</legend><label>기존 작품ID<textarea rows={2} value={sourceText} onChange={(event) => { setSourceText(event.target.value); write({ ...record, sourceWorkIds: event.target.value.split(/[\s,]+/).map((value) => value.trim()).filter(Boolean) }); }} placeholder="AIO-WORK-... · 여러 건은 쉼표 또는 줄바꿈" /></label><p>같은 작품을 다른 사례ID로 중복 등록하지 않습니다. 기존 작품ID를 모르면 비워두고 정본 사례 불러오기를 사용하세요.</p><small>서비스 대표 연결: {record.featuredFor.length ? record.featuredFor.map((id) => CONTENT_SERVICES.find((item) => item.id === id)?.label ?? id).join(", ") : "별도 지정 없음 · 기존 대표 유지"}</small></fieldset>
  </div>;
}
