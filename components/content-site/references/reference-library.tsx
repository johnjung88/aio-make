"use client";
import { displayCopy } from "@/lib/display-copy";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { CONTENT_SERVICES, contentServicePath, type ContentServiceId } from "@/lib/content-site/types";
import type { ServiceCase } from "@/lib/service-case-schema";
import "./references.css";

export type ReferenceCase = Pick<ServiceCase, "caseId" | "title" | "brand" | "summary" | "scope" | "publicLabel" | "productionStatus" | "services" | "assets">;
type Filter = ContentServiceId | "all";
const relationLabels = { direct: "제작 사례", related: "관련 역량 사례", usage: "활용 사례" };
const serviceName = (id: ContentServiceId) => CONTENT_SERVICES.find((service) => service.id === id)?.label ?? id;
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase("ko").replace(/[’'·]/g, " ").replace(/\s+/g, " ").trim();
const coverSrc = (asset: ReferenceCase["assets"][number]) => asset.kind === "video" ? asset.poster! : asset.src;

function primaryService(record: ReferenceCase) {
  return record.services.find((service) => service.relation === "direct") ?? record.services[0];
}

function assetLabel(record: ReferenceCase) {
  const films = record.assets.filter((asset) => asset.kind === "video").length;
  const images = record.assets.length - films;
  return [images ? `이미지 ${images}장` : "", films ? `영상 ${films}편` : ""].filter(Boolean).join(" · ");
}

export function ContentReferenceLibrary({ cases }: { cases: ReferenceCase[] }) {
  cases = displayCopy(cases);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(9);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assetIndex, setAssetIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const searchId = useId();
  const titleId = useId();
  const selected = cases.find((record) => record.caseId === selectedId);
  const current = selected?.assets[assetIndex];
  const terms = normalize(query).split(" ").filter(Boolean);
  const filtered = cases.filter((record) => {
    if (filter !== "all" && !record.services.some((service) => service.id === filter)) return false;
    const haystack = normalize([record.title, record.brand, record.summary, record.scope, record.publicLabel, ...record.services.map((service) => serviceName(service.id))].join(" "));
    return terms.every((term) => haystack.includes(term));
  });

  useEffect(() => {
    const node = dialog.current;
    if (!selectedId || !node) return;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    const trigger = opener.current;
    document.querySelectorAll<HTMLVideoElement>("video").forEach((element) => element.pause());
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    node.showModal();
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      if (node.open) node.close();
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [selectedId]);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const pauseWhenHidden = () => { if (document.hidden) node.pause(); };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => { document.removeEventListener("visibilitychange", pauseWhenHidden); node.pause(); };
  }, [selectedId, assetIndex]);

  function openCase(record: ReferenceCase, event: MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setAssetIndex(0);
    setSelectedId(record.caseId);
  }

  function closeCase() {
    video.current?.pause();
    setSelectedId(null);
  }

  function handleKeys(event: KeyboardEvent<HTMLDialogElement>) {
    if (!selected || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target instanceof HTMLVideoElement) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setAssetIndex((index) => Math.max(0, index - 1));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setAssetIndex((index) => Math.min(selected.assets.length - 1, index + 1));
    }
  }

  function chooseFilter(value: Filter) {
    setFilter(value);
    setLimit(9);
  }

  return <div className="cr-page">
    <header className="cr-heading cr-container">
      <p className="cr-eyebrow">AIO MAKE · REFERENCES</p>
      <div className="cr-heading-grid"><h1>실제로 만든 컨텐츠를<br />한곳에서 살펴보세요</h1><p>웹툰부터 SNS 광고까지, 작품의 기획과 표현을 비교해 보세요<br />각 사례의 실제 결과물과 제작 범위, 시안 상태를 함께 보여드립니다</p></div>
    </header>

    <section className="cr-container cr-library" aria-label="서비스별 제작 사례">
      <div className="cr-toolbar">
        <div className="cr-filters" role="group" aria-label="제작 서비스로 사례 찾기">
          <button type="button" aria-pressed={filter === "all"} onClick={() => chooseFilter("all")}>전체 <span>{cases.length}</span></button>
          {CONTENT_SERVICES.map((service) => <button key={service.id} type="button" aria-pressed={filter === service.id} onClick={() => chooseFilter(service.id)}>{service.label}</button>)}
        </div>
        <div className="cr-search"><label htmlFor={searchId}>제작 사례 검색</label><div><input id={searchId} type="search" value={query} onChange={(event) => { setQuery(event.target.value); setLimit(9); }} placeholder="작품·브랜드·제작 방식" autoComplete="off" />{query ? <button type="button" onClick={() => { setQuery(""); setLimit(9); }} aria-label="검색어 지우기">지우기</button> : <span aria-hidden="true">⌕</span>}</div></div>
      </div>
      <div className="cr-result-line"><p role="status" aria-live="polite">{filter === "all" ? "전체" : serviceName(filter)} · {filtered.length}개 사례{query.trim() ? ` · “${query.trim()}”` : ""}</p><p>같은 작품은 여러 서비스에 활용되어도 한 번만 표시합니다</p></div>

      {filtered.length ? <div className="cr-grid">{filtered.slice(0, limit).map((record) => {
        const cover = record.assets[0];
        const relation = filter === "all" ? primaryService(record) : record.services.find((service) => service.id === filter)!;
        const href = `${contentServicePath(relation.id)}?caseId=${encodeURIComponent(record.caseId)}`;
        return <article className="cr-card" key={record.caseId} data-reference-case={record.caseId}>
          <button className="cr-cover" type="button" onClick={(event) => openCase(record, event)} aria-label={`${record.title} 이미지와 영상 보기`} aria-haspopup="dialog">
            <Image src={coverSrc(cover)} alt={cover.alt} width={cover.width ?? 1200} height={cover.height ?? 900} loading="lazy" unoptimized />
            <span className="cr-cover-count">{assetLabel(record)}</span><span className="cr-cover-action">작품 보기 <i aria-hidden="true">↗</i></span>
          </button>
          <div className="cr-card-body"><p className="cr-card-kind">{serviceName(relation.id)} <span>· {relationLabels[relation.relation]}</span></p><h2>{record.title}</h2><p className="cr-card-summary">{record.summary}</p><p className="cr-status">{record.productionStatus === "draft" && !/시안|제작 중/.test(record.publicLabel) ? <span>제작 시안</span> : null}{record.publicLabel}</p><div className="cr-card-links"><button type="button" onClick={(event) => openCase(record, event)} aria-haspopup="dialog">결과물 보기 <span aria-hidden="true">↗</span></button><Link href={href}>{serviceName(relation.id)} 보기 <span aria-hidden="true">→</span></Link></div></div>
        </article>;
      })}</div> : <div className="cr-empty"><h2>검색한 사례가 없습니다</h2><p>검색어를 바꾸거나 전체 제작 사례를 살펴보세요</p><button type="button" onClick={() => { setQuery(""); chooseFilter("all"); }}>전체 사례 보기</button></div>}

      {limit < filtered.length ? <div className="cr-more"><button type="button" onClick={() => setLimit((value) => value + 9)}>제작 사례 더 보기 <span aria-hidden="true">＋</span></button><span>{Math.min(limit, filtered.length)} / {filtered.length}</span></div> : null}
      <div className="cr-bottom-note"><p>자체 IP, 제안용 시안, 제작 완료와 실제 고객의 채택·게시 상태는 작품별로 구분해 표시합니다</p><Link href="/content/contact">우리 브랜드의 제작 방식 상담 <span aria-hidden="true">↗</span></Link></div>
    </section>

    <dialog ref={dialog} className="cr-dialog" aria-labelledby={titleId} onCancel={(event) => { event.preventDefault(); closeCase(); }} onClose={() => { if (selectedId) closeCase(); }} onKeyDown={handleKeys} onClick={(event) => { if (event.target !== dialog.current) return; const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeCase(); }}>
      {selected && current ? <>
        <div className="cr-dialog-top"><div><p>{selected.brand}</p><h2 id={titleId}>{selected.title}</h2></div><button ref={closeButton} type="button" className="cr-close" onClick={closeCase} aria-label="제작 사례 닫기">닫기 <span aria-hidden="true">×</span></button></div>
        <div className="cr-dialog-scroll">
          <p className="cr-dialog-status">{selected.publicLabel}</p>
          <div className={`cr-viewer${current.kind === "video" ? " cr-viewer--video" : ""}`}>
            {current.kind === "video" ? <video key={current.src} ref={video} src={current.src} poster={current.poster} controls playsInline muted preload="metadata" aria-label={`${selected.title} · ${current.alt} · ${selected.publicLabel}`} onPlay={(event) => document.querySelectorAll<HTMLVideoElement>("video").forEach((element) => { if (element !== event.currentTarget) element.pause(); })}>이 브라우저에서는 영상을 재생할 수 없습니다</video> : <Image key={current.src} src={current.src} alt={current.alt} width={current.width ?? 1200} height={current.height ?? 900} unoptimized />}
          </div>
          <div className="cr-viewer-caption"><p aria-live="polite">{current.alt}</p><span>{current.width && current.height ? `출력 ${current.width}×${current.height}` : ""}</span></div>
          {selected.assets.length > 1 ? <>
            <div className="cr-viewer-controls"><button type="button" onClick={() => setAssetIndex((index) => Math.max(0, index - 1))} disabled={assetIndex === 0} aria-label="이전 결과물">←</button><p aria-live="polite">{String(assetIndex + 1).padStart(2, "0")} / {selected.assets.length}</p><button type="button" onClick={() => setAssetIndex((index) => Math.min(selected.assets.length - 1, index + 1))} disabled={assetIndex === selected.assets.length - 1} aria-label="다음 결과물">→</button></div>
            <div className="cr-thumbnails" role="group" aria-label="같은 작품의 이미지와 영상 선택">{selected.assets.map((asset, index) => <button key={`${asset.src}-${index}`} type="button" aria-pressed={assetIndex === index} onClick={() => setAssetIndex(index)} aria-label={`${index + 1}번째 결과물 · ${asset.kind === "video" ? "영상" : "이미지"} · ${asset.alt}`}><Image src={coverSrc(asset)} alt="" width={100} height={80} loading="lazy" unoptimized /><span>{asset.kind === "video" ? "영상" : String(index + 1).padStart(2, "0")}</span></button>)}</div>
          </> : null}
          <div className="cr-case-description"><p>{selected.summary}</p><dl><div><dt>맡은 범위</dt><dd>{selected.scope}</dd></div></dl></div>
          <div className="cr-service-connections"><h3>이 사례와 연결된 서비스</h3>{selected.services.map((service) => <Link key={service.id} href={`${contentServicePath(service.id)}?caseId=${encodeURIComponent(selected.caseId)}`}><span><strong>{serviceName(service.id)}</strong><small>{relationLabels[service.relation]} · {service.description}</small></span><i aria-hidden="true">↗</i></Link>)}</div>
        </div>
      </> : null}
    </dialog>
  </div>;
}
