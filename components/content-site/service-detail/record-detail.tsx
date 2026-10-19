"use client";

import { useState } from "react";
import type { ContentServiceId } from "@/lib/content-site/types";
import type { PublicServiceCase } from "./additional-cases";
import { CaseCta, DetailHero, DetailImage, DetailSection, DetailVideo, ServiceOverview } from "./shared";
import { WebtoonDetailReader, type WebtoonViewerSelection } from "./webtoon-reader";

const hero: Record<ContentServiceId, [string, string, string]> = {
  webtoon: ["WEBTOON", "생각 속 이야기를\n한 편의 웹툰으로", "기획과 캐릭터 설정부터 장면 구성, 작화와 대사까지 함께 만듭니다"],
  animation: ["ANIMATION", "캐릭터가 전하는\n브랜드의 이야기", "필요한 행동과 장면을 설계하고 캐릭터 영상으로 만듭니다"],
  "ai-influencer": ["AI INFLUENCER", "브랜드의 얼굴이 될\nAI 모델을 만듭니다", "인물의 기준을 정하고 이미지와 제품영상에 활용합니다"],
  "motion-graphics": ["MOTION GRAPHICS", "브랜드의 메시지에\n움직임을 더합니다", "로고와 제품 이미지에 타이포·그래픽·캐릭터를 더해 모션으로 만듭니다"],
  "brand-film": ["BRAND FILM", "브랜드의 이야기를\n한 편의 영상으로", "전할 메시지를 정리하고 인물·제품·장면을 하나의 흐름으로 엮습니다"],
  ad: ["SOCIAL AD", "제품의 매력을\n짧고 선명하게", "제품 하나의 메시지를 세로 화면에 맞는 장면과 자막으로 구성합니다"],
};

function Media({ asset, label }: { asset: PublicServiceCase["assets"][number]; label: string }) {
  return asset.kind === "video" ? <DetailVideo src={asset.src} poster={asset.poster!} label={label} portrait={Boolean(asset.width && asset.height && asset.height > asset.width)} /> : <DetailImage src={asset.src} alt={asset.alt} caption={label} />;
}

/** Used after an admin changes a published case, so old hard-coded case facts never coexist with its new version. */
export function RecordDetail({ service, record }: { service: ContentServiceId; record: PublicServiceCase | null }) {
  const [viewer, setViewer] = useState<WebtoonViewerSelection | null>(null);
  const [eyebrow, title, description] = hero[service];
  const first = record?.assets[0];
  const originalPages = record?.caseId === "CASE-CLUBOWNER-EP01" && record.assets.filter((a) => a.kind === "webtoon").length === 25 && record.assets.filter((a) => a.kind === "webtoon").every((a, i) => a.src === `/service-detail-v14/webtoon-${String(i + 1).padStart(2, "0")}.webp`);
  return <div className={`sd-record-detail${service === "webtoon" ? " sd-webtoon" : ""}`}>
    <DetailHero eyebrow={eyebrow} title={title} description={description} variant={service} caseHref={record ? "#selected-case" : "#service-overview"} label={record?.publicLabel}>
      {first && record ? <Media asset={first} label={record.title} /> : <div className="sd-service-art" aria-hidden="true"><span>{eyebrow}</span><span>STORY<br />TO<br />CONTENT</span></div>}
    </DetailHero>
    <ServiceOverview service={service} items={["필요한 결과와 사용처 확인", "실제 자료로 기획·제작", "선택한 구성으로 상담"]} />
    {record ? <>
      <DetailSection id="selected-case" eyebrow="CASE STUDY" title={record.title} lead={record.summary}>
        <span id={`case-${record.caseId}`} />
        <p className="sd-lead">{record.scope}</p>{record.brief ? <p>{record.brief}</p> : null}
        <CaseCta caseId={record.caseId} caseTitle={record.title}>이 사례로 제작 상담</CaseCta>
      </DetailSection>
      {record.decisions.length ? <DetailSection eyebrow="PLANNING" title="이렇게 기획했습니다"><div className="sd-record-stages">{record.decisions.map((d) => <article key={d.title}><h3>{d.title}</h3><p>{d.description}</p></article>)}</div></DetailSection> : null}
      {record.stages.length ? <DetailSection eyebrow="MAKING" title="같은 작업의 제작 과정"><div className="sd-record-stages">{record.stages.map((stage) => <article key={stage.title}><h3>{stage.title}</h3><p>{stage.description}</p>{stage.asset ? <DetailImage src={stage.asset} alt={stage.title} /> : null}</article>)}</div></DetailSection> : null}
      <DetailSection eyebrow="RESULT" title="실제 작업 결과를 살펴보세요" lead={record.publicLabel}>
        {originalPages ? <button className="sd-button" type="button" onClick={(event) => setViewer({ kind: "pages", page: 1, trigger: event.currentTarget })}>1화25장 전체 읽기 ↗</button> : null}
        <div className="sd-record-results">{record.assets.filter((a) => !originalPages || a.kind !== "webtoon").map((asset) => <Media key={asset.src} asset={asset} label={asset.alt} />)}</div>
      </DetailSection>
    </> : null}
    <WebtoonDetailReader selection={viewer} onClose={() => setViewer(null)} />
  </div>;
}
