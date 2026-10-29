"use client";

import { useState } from "react";
import type { ServiceCase } from "@/lib/service-case-schema";
import type { ContentServiceId } from "@/lib/content-site/types";
import { CaseCta, DetailImage, DetailSection, DetailVideo } from "./shared";

export type PublicServiceCase = Pick<ServiceCase, "caseId" | "title" | "summary" | "scope" | "publicLabel" | "assets" | "services" | "brief" | "decisions" | "stages">;

export function AdditionalCases({ cases, service }: { cases: PublicServiceCase[]; service: ContentServiceId }) {
  const [count, setCount] = useState(3);
  if (!cases.length) return null;
  return <DetailSection id="additional-cases" eyebrow="MORE WORK" title="더 다양한 제작 사례" lead={"같은 작업의 화면비·수정판은 하나의 사례로 연결합니다\n관심 있는 방식으로 제작을 상담해 보세요"}>
    <div className="sd-case-list">{cases.slice(0, count).map((record) => {
      const cover = record.assets.find((a) => a.kind !== "video") ?? record.assets[0];
      const movie = record.assets.find((a) => a.kind === "video");
      return <article id={`case-${record.caseId}`} key={record.caseId} data-case-card={record.caseId}>
        {movie ? <DetailVideo src={movie.src} poster={movie.poster!} label={record.publicLabel} portrait={Boolean(movie.height && movie.width && movie.height > movie.width)} /> : <DetailImage src={cover.src} alt={cover.alt} caption={record.publicLabel} />}
        <h3>{record.title}</h3><p>{record.summary}</p><p>{record.services.find((s) => s.id === service)?.description}</p>
        <div className="sd-case-actions">{(record.brief || record.stages.length || record.decisions.length) ? <details className="sd-case-process"><summary>기획과 제작 과정 보기</summary>
          {record.brief ? <p>{record.brief}</p> : null}
          {record.decisions.map((d) => <div key={d.title}><h4>{d.title}</h4><p>{d.description}</p></div>)}
          {record.stages.map((stage) => <div key={stage.title}><h4>{stage.title}</h4><p>{stage.description}</p>{stage.asset ? <DetailImage src={stage.asset} alt={stage.title} /> : null}</div>)}
        </details> : null}
        <CaseCta caseId={record.caseId} caseTitle={record.title} entryPoint="additional-case">이런 방식으로 제작 상담</CaseCta></div>
      </article>;
    })}</div>
    {count < cases.length ? <button className="sd-button sd-more-cases" onClick={() => setCount((value) => value + 6)} type="button">제작 사례 더 보기<span aria-hidden="true">↓</span></button> : null}
  </DetailSection>;
}
