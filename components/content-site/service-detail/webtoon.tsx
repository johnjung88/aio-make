"use client";
/* eslint-disable @next/next/no-img-element -- Preserve the supplied page ratio and source derivatives in the reader and original-page comparisons. */

import { useEffect, useState, useRef, type MouseEvent, type KeyboardEvent, type PointerEvent } from "react";
import { formatWon, pricingPlans, WEBTOON_PAGE_STANDARD } from "@/lib/content-pricing";
import { DetailHero, DetailSection, DetailImage, DetailVideo, CaseCta, ServiceOverview } from "./shared";
import { WebtoonDetailReader, type WebtoonViewerSelection } from "./webtoon-reader";
import "./webtoon-detail.css";

const A = "/service-detail-v14/";
const CASE_ID = "CASE-CLUBOWNER-EP01";
const CASE_TITLE = "《1억의 구단주》 1화";
const bundles = pricingPlans("webtoon").groups.find((group) => group.key === "bundle")?.plans ?? [];
const stages = ["script", "character", "finished"] as const;
type Stage = typeof stages[number];
const stageNames: Record<Stage, string> = { script: "원고", character: "캐릭터", finished: "완성본" };
const scenes = ["script", "layout", "finished"] as const;
type Scene = typeof scenes[number];
const sceneCopy: Record<Scene, { label: string; title: string; body: string; quote: string; note: string }> = {
  script: { label: "01 / 원고 요약", title: "인물의 행동과\n대사를 원고로 씁니다", body: "휴대전화를 보던 도현이 경기에 집중하다 골이 들어가자 일어납니다\n이 감정의 변화를 그릴 수 있도록 자세와 반응을 정했습니다", quote: "휴대전화 내려놓기 → 경기에 몰입 → 환호", note: "1화 시나리오 장면 3의 요약" },
  layout: { label: "02 / 장면 구성 요약", title: "행동을 나누고\n그릴 순서를 정합니다", body: "휴대전화, 경기에 몰입한 자세, 환호와 빈 옆자리를 차례로 배치했습니다\n인물의 시선과 대사 위치도 함께 정했습니다", quote: "휴대전화 → 경기 → 환호 → 빈자리", note: "실제 작화 지시를 요약했습니다\n별도로 그린 러프 콘티는 아닙니다" },
  finished: { label: "03 / 완성 페이지", title: "원고와 구성을 기준으로\n한 페이지를 완성합니다", body: "인물의 자세와 표정으로 행동을 그렸습니다\n대사와 말풍선을 넣고 장면이 자연스럽게 이어지는지 확인했습니다", quote: "원고 장면 3 → 완성 05P", note: "같은 장면의 실제 완성 페이지입니다\n눌러서 크게 읽어보세요" },
};

function WebtoonHeroPages({ onRead }: { onRead: (page: number, event: MouseEvent<HTMLButtonElement>) => void }) {
  const banner = useRef<HTMLDivElement>(null);
  const choices = useRef<Array<HTMLButtonElement | null>>([]);
  const frame = useRef(0);
  const [front, setFront] = useState<1 | 5>(1);
  const [entered, setEntered] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [finePointer, setFinePointer] = useState(false);
  const [replay, setReplay] = useState(0);

  function resetLook() {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    banner.current?.style.setProperty("--wt-look-x", "0px");
    banner.current?.style.setProperty("--wt-look-y", "0px");
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerPreference = window.matchMedia("(hover:hover) and (pointer:fine)");
    const sync = () => { setReduced(preference.matches); setFinePointer(pointerPreference.matches); resetLook(); };
    const stopWhenHidden = () => { if (document.hidden) resetLook(); };
    sync();
    preference.addEventListener("change", sync);
    pointerPreference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", stopWhenHidden);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setEntered(true);
      else resetLook();
    }, { threshold: 0.2 });
    if (banner.current) observer.observe(banner.current);
    return () => { observer.disconnect(); preference.removeEventListener("change", sync); pointerPreference.removeEventListener("change", sync); document.removeEventListener("visibilitychange", stopWhenHidden); resetLook(); };
  }, []);

  function look(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reduced || !finePointer || frame.current) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      const node = banner.current;
      if (node) {
        const rect = node.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (clientX - rect.left) / rect.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (clientY - rect.top) / rect.height * 2 - 1));
        node.style.setProperty("--wt-look-x", `${x * 7}px`);
        node.style.setProperty("--wt-look-y", `${y * 5}px`);
      }
      frame.current = 0;
    });
  }

  function selectWithKeys(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : index === 0 ? 1 : 0;
    setFront(next === 0 ? 1 : 5);
    choices.current[next]?.focus();
  }

  return <div className="wt-hero-presentation">
    <div className="wt-banner-toolbar">
      <div role="group" aria-label="배너에서 앞에 볼 완성 페이지 선택">
        {([1, 5] as const).map((page, index) => <button key={page} type="button" ref={(node) => { choices.current[index] = node; }} aria-pressed={front === page} onClick={() => setFront(page)} onKeyDown={(event) => selectWithKeys(event, index)}>{page === 1 ? "01 / 창단식" : "05 / 월드컵"}</button>)}
      </div>
      <button className="wt-banner-replay" type="button" disabled={reduced || !finePointer} onClick={() => setReplay((value) => value + 1)} aria-label={reduced ? "동작 줄이기 설정 사용 중" : !finePointer ? "페이지 선택 버튼으로 작품을 직접 선택하세요" : "페이지 펼침 동작 다시 보기"}>다시 펼치기 <span aria-hidden="true">↻</span></button>
    </div>
    <div ref={banner} className="wt-banner-pages" aria-label="같은 1화의 실제 완성 페이지" data-front={front} data-entered={entered} data-reduced={reduced} onPointerMove={look} onPointerLeave={resetLook}>
      <button key={`one-${replay}`} className="wt-banner-page wt-banner-page-one" type="button" onFocus={() => setFront(1)} onClick={(event) => onRead(1, event)} aria-label="1화 창단식 01페이지 크게 읽기">
        <img src={`${A}webtoon-01.webp`} alt="《1억의 구단주》 창단식 실제 완성 01페이지" fetchPriority="high" width={1024} height={1536} />
        <span>01 / 창단식 <b>크게 읽기 ↗</b></span>
      </button>
      <button key={`two-${replay}`} className="wt-banner-page wt-banner-page-two" type="button" onFocus={() => setFront(5)} onClick={(event) => onRead(5, event)} aria-label="같은 작품 월드컵 05페이지 크게 읽기">
        <img src={`${A}webtoon-05.webp`} alt="같은 작품의 월드컵 몰입 실제 완성 05페이지" width={1024} height={1536} />
        <span>05 / 월드컵 <b>크게 읽기 ↗</b></span>
      </button>
    </div>
    <p className="wt-banner-instruction" aria-live="polite">{front === 1 ? "창단식의 첫 장면" : "축구에 몰입하는 월드컵 장면"}<br />페이지를 눌러 완성본 25P를 읽어보세요</p>
  </div>;
}

function WebtoonBundles({ compact = false }: { compact?: boolean }) {
  return <div className={`wt-bundle-options${compact ? " wt-bundle-options--compact" : ""}`}>
    {bundles.map((plan) => <article key={plan.key}>
      <span className="wt-eyebrow">WEBTOON + MOTION COMIC</span>
      <h3>{plan.label}</h3>
      <p className="wt-bundle-price">{formatWon(plan.amount)} <small>부가세 별도</small></p>
      <CaseCta caseId={CASE_ID} caseTitle={CASE_TITLE} plan={plan.key} entryPoint={compact ? "webtoon-motion-bundle" : "webtoon-top-bundle"}>이 세트로 함께 제작 상담</CaseCta>
    </article>)}
  </div>;
}

export function WebtoonDetail() {
  const [viewer, setViewer] = useState<WebtoonViewerSelection | null>(null);
  const [stage, setStage] = useState<Stage>("finished");
  const [scene, setScene] = useState<Scene>("script");
  const stageRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const sceneRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const detail = sceneCopy[scene];

  function openPage(page: number, event: MouseEvent<HTMLButtonElement>) {
    setViewer({ kind: "pages", page, trigger: event.currentTarget });
  }
  function openImage(file: string, alt: string, event: MouseEvent<HTMLButtonElement>) {
    setViewer({ kind: "image", src: `${A}${file}`, alt, trigger: event.currentTarget });
  }
  function selectTab<T extends string>(event: KeyboardEvent<HTMLButtonElement>, options: readonly T[], index: number, select: (value: T) => void, refs: Array<HTMLButtonElement | null>) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % options.length;
    else if (event.key === "ArrowLeft") next = (index + options.length - 1) % options.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = options.length - 1;
    else return;
    event.preventDefault();
    select(options[next]);
    refs[next]?.focus();
  }

  return <div className="sd-webtoon">
    <DetailHero eyebrow="AIO MAKE / 웹툰 · 모션코믹 제작" title={"이야기는 웹툰으로\n같은 그림은 영상으로"} description={"캐릭터와 원고를 정해 웹툰을 만듭니다\n같은 그림을 모션코믹으로 편집해 영상으로도 활용하세요"} variant="webtoon" label="AIO 자체 IP · 《1억의 구단주》 · 실제 완성 페이지" caseHref="#webtoon-bundles" primaryLabel="웹툰+영상 세트 보기">
      <WebtoonHeroPages onRead={openPage} />
    </DetailHero>

    <DetailSection id="webtoon-bundles" className="wt-bundle-section" eyebrow="웹툰 + 모션코믹 함께 제작" title={"한 이야기를\n웹툰과 영상으로"} lead={"웹툰 12P·24P와 모션코믹을 함께 만드는 구성입니다\n알릴 내용과 사용할 채널에 맞춰 선택하세요"}>
      <WebtoonBundles />
      <p className="wt-note">웹툰 1P 규격: {WEBTOON_PAGE_STANDARD.label} ({WEBTOON_PAGE_STANDARD.ratio})<br /><a href="#webtoon-cut-unit">페이지 규격 자세히 보기 ↓</a></p>
      <p className="wt-bundle-note">웹툰 단독 제작과 기존 웹툰의 영상화도 가능합니다<br />구성별 포함 범위는 아래 가격표에서 확인하세요</p>
      <a className="wt-text-button" href="#webtoon-case">실제 웹툰과 영상 제작 사례 보기 ↓</a>
    </DetailSection>

    <ServiceOverview service="webtoon" items={["이야기 기획·원고와 컷 구성", "캐릭터 설정·작화와 대사", "같은 웹툰의 모션코믹 제작"]} />

    <DetailSection id="webtoon-cut-unit" eyebrow="분량을 고르는 기준" title={"웹툰은 페이지 수로\n분량을 정합니다"} lead={`웹툰 가격은 완성 페이지 수를 기준으로 정합니다\n1P 규격은 ${WEBTOON_PAGE_STANDARD.label} (${WEBTOON_PAGE_STANDARD.ratio})입니다`}>
      <div className="wt-unit-grid">
        <figure className="wt-unit-whole">
          <div className="wt-unit-heading"><strong>1P</strong><span>완성 페이지 한 장</span></div>
          <div className="wt-unit-measure">
            <span className="wt-unit-width" aria-hidden="true">가로 {WEBTOON_PAGE_STANDARD.width.toLocaleString("ko-KR")}px</span>
            <span className="wt-unit-height" aria-hidden="true">세로 {WEBTOON_PAGE_STANDARD.height.toLocaleString("ko-KR")}px</span>
            <button type="button" className="wt-unit-page" onClick={(event) => openPage(5, event)} aria-label={`${WEBTOON_PAGE_STANDARD.label}, ${WEBTOON_PAGE_STANDARD.ratio} 비율의 실제 완성 05P 크게 읽기`}><img src={`${A}webtoon-05.webp`} alt="여러 컷으로 구성된 실제 완성 05P 전체" loading="lazy" width={WEBTOON_PAGE_STANDARD.width} height={WEBTOON_PAGE_STANDARD.height} /></button>
          </div>
          <figcaption>실제 완성 05P · 원본 비율 그대로<br />페이지를 눌러 크게 읽기 ↗</figcaption>
        </figure>
        <div className="wt-unit-copy">
          <dl className="wt-unit-specs"><div><dt>1P 크기</dt><dd>{WEBTOON_PAGE_STANDARD.width.toLocaleString("ko-KR")} × {WEBTOON_PAGE_STANDARD.height.toLocaleString("ko-KR")}px</dd></div><div><dt>가로 : 세로</dt><dd>{WEBTOON_PAGE_STANDARD.ratio}</dd></div><div><dt>상품 분량</dt><dd>12P 또는 24P</dd></div></dl>
          <h3>한 페이지의 컷 수는<br />이야기에 맞춰 구성합니다</h3>
          <p>컷은 테두리로 나뉜 장면을 말합니다<br />1P 안에 들어갈 컷 수는 이야기와 대사 분량에 맞춰 정합니다</p>
          <a className="wt-text-button" href="#webtoon-bundles">페이지 수와 영상 길이로 세트 고르기 ↑</a>
        </div>
      </div>
    </DetailSection>

    <DetailSection id="webtoon-case" eyebrow="01 / 실제 제작 사례" title="《1억의 구단주》" lead={"자체 기획한 축구 웹툰입니다\n같은 1화의 기획부터 작화와 수정까지 살펴보세요"}>
      <div className="wt-case-grid">
        <div className="wt-case-copy">
          <span className="wt-tag">AIO 자체 IP</span>
          <p className="wt-large-copy">구단의 성장과<br />사람의 변화를 함께 그립니다</p>
          <dl className="wt-facts">
            <div><dt>담당 범위</dt><dd>이야기 기획 · 캐릭터 설정 · 원고와 장면 구성 · 작화 · 모션 하이라이트</dd></div>
            <div><dt>완성 결과</dt><dd>1화 《새 게임》 완성본 25P<br />같은 웹툰으로 편집한 40초 세로 영상</dd></div>
          </dl>
          <button type="button" className="wt-text-button" onClick={(event) => openPage(1, event)}>완성 웹툰 25P 읽기 <span aria-hidden="true">↗</span></button>
        </div>
        <button type="button" className="wt-case-cover" onClick={(event) => openPage(2, event)} aria-label="1화 새 게임 실제 표지인 02페이지 크게 읽기">
          <img src={`${A}webtoon-cover.webp`} alt="1화 《새 게임》 창단식과 타이틀 실제 02페이지" loading="lazy" width={1024} height={1536} />
          <span>EP.01 / 새 게임 <b>READ ↗</b></span>
        </button>
      </div>
      <nav className="wt-process-links" aria-label="웹툰 제작 과정 바로가기">
        {[["webtoon-planning", "이야기 기획"], ["webtoon-characters", "캐릭터 설정"], ["webtoon-scene", "원고·장면 구성"], ["webtoon-revision", "작화·검수"], ["webtoon-motion", "영상으로 활용"]].map(([id, label], index) => <a key={id} href={`#${id}`}><small>0{index + 1}</small><span>{label}</span><span aria-hidden="true">↓</span></a>)}
      </nav>
    </DetailSection>

    <DetailSection id="webtoon-planning" eyebrow="02 / 이야기 기획" title={"소재를 정리하고\n첫 화의 흐름을 설계합니다"}>
      <div className="wt-planning-grid">
        <p className="wt-large-copy">구단 창단이라는 소재를<br />인물의 동기와 회차별 이야기로 풀었습니다</p>
        <div>
          <div className="wt-decision"><span>이야기의 중심</span><strong>구단의 성장과 사람의 변화</strong></div>
          <div className="wt-decision"><span>1화에서 보여줄 내용</span><strong>축구에 대한 관심이 구단 운영에 대한 관심으로 이어지는 과정</strong></div>
          <p className="wt-note">의뢰할 때도 알릴 내용과 읽을 사람부터 정리합니다 그 목적에 필요한 이야기와 분량을 제안합니다</p>
        </div>
      </div>
    </DetailSection>

    <DetailSection id="webtoon-characters" eyebrow="03 / 캐릭터 설정" title={"인물의 역할과\n외형 기준을 정합니다"} lead={"캐릭터마다 이야기에서 맡을 역할을 정했습니다\n얼굴·의상·표정은 제작 참조 자료로 정리했습니다"}>
      <div className="wt-character-pair">
        <button type="button" className="wt-sheet-button" onClick={(event) => openImage("webtoon-characters.webp", "도현·정훈·지호·재훈 실제 캐릭터 제작 참조 시트", event)} aria-label="같은 작품 캐릭터 제작 참조 시트 확대">
          <img src={`${A}webtoon-characters.webp`} alt="도현·정훈·지호·재훈 실제 제작 참조 시트" loading="lazy" />
          <span>실제 캐릭터 제작 참조 자료 <b>확대해서 보기 ↗</b></span>
        </button>
        <button type="button" className="wt-character-result" onClick={(event) => openPage(1, event)} aria-label="같은 인물들이 등장하는 완성 01페이지 크게 읽기">
          <img src={`${A}webtoon-01.webp`} alt="참조 인물들이 함께 등장하는 창단식 실제 완성 장면" loading="lazy" width={1024} height={1536} />
          <span>같은 인물의 실제 등장 장면 · 01 / 25 ↗</span>
        </button>
      </div>
      <div className="wt-roles">
        <article><small>주인공</small><h3>도현</h3><p>구단을 시작하는 주인공<br />이야기를 이끌 동기와 행동을 설정했습니다</p></article>
        <article><small>축구·지도</small><h3>정훈</h3><p>축구와 지도를 맡는 인물<br />도현과 구분되는 안경·의상을 정했습니다</p></article>
        <article><small>운영·조직</small><h3>지호</h3><p>운영과 조직을 맡는 인물<br />인물 관계와 함께 외형을 구분했습니다</p></article>
      </div>
      <p className="wt-note">기존 캐릭터가 있다면 그 자료를 기준으로, 새로 만든다면 역할과 외형부터 함께 정합니다</p>
    </DetailSection>

    <DetailSection id="webtoon-materials" eyebrow="04 / 실제 제작 자료" title={"같은 작품을\n세 가지 자료로 살펴보세요"} lead={"원고·캐릭터·완성본을 선택해 살펴보세요\n아래에서는 한 장면이 완성되는 과정을 확인할 수 있습니다"}>
      <div className="wt-workbench">
        <div className="wt-tabs" role="tablist" aria-label="웹툰 실제 제작 자료 선택">
          {stages.map((item, index) => <button key={item} type="button" ref={(element) => { stageRefs.current[index] = element; }} role="tab" id={`wt-stage-tab-${item}`} aria-controls={`wt-stage-panel-${item}`} aria-selected={stage === item} tabIndex={stage === item ? 0 : -1} onClick={() => setStage(item)} onKeyDown={(event) => selectTab(event, stages, index, setStage, stageRefs.current)}><small>0{index + 1}</small>{stageNames[item]}</button>)}
        </div>
        <div id="wt-stage-panel-script" className="wt-stage-panel" role="tabpanel" tabIndex={0} aria-labelledby="wt-stage-tab-script" hidden={stage !== "script"}>
          <article className="wt-manuscript"><span>EP.01 / 장면 03 · 원고 요약</span><h3>도현의 방,<br />월드컵 경기</h3><ol><li>휴대전화를 내려놓는다</li><li>경기에 몸을 기울인다</li><li>골이 들어가자 일어난다</li></ol><p>실제 시나리오를 요약한 제작 설명</p></article>
          <button type="button" className="wt-stage-page" onClick={(event) => openPage(5, event)} aria-label="원고와 같은 완성 05페이지 크게 읽기"><img src={`${A}webtoon-05.webp`} alt="원고 장면03과 연결되는 실제 완성05페이지" loading="lazy" width={1024} height={1536} /><span>같은 장면의 완성 · 05 / 25 ↗</span></button>
        </div>
        <div id="wt-stage-panel-character" className="wt-stage-panel" role="tabpanel" tabIndex={0} aria-labelledby="wt-stage-tab-character" hidden={stage !== "character"}>
          <button type="button" className="wt-stage-sheet" onClick={(event) => openImage("webtoon-characters.webp", "같은 작품의 캐릭터 제작 참조 시트", event)} aria-label="같은 작품 캐릭터 참조 시트 확대"><img src={`${A}webtoon-characters.webp`} alt="《1억의 구단주》 실제 캐릭터 제작 참조 시트" loading="lazy" /><span>인물의 기준을 정한 실제 제작 참조 자료 ↗</span></button>
          <button type="button" className="wt-stage-page" onClick={(event) => openPage(1, event)} aria-label="참조 인물이 등장하는 완성01페이지 읽기"><img src={`${A}webtoon-01.webp`} alt="같은 캐릭터들이 등장하는 창단식 완성 장면" loading="lazy" width={1024} height={1536} /><span>같은 작품의 실제 등장 장면 · 01 / 25 ↗</span></button>
        </div>
        <div id="wt-stage-panel-finished" className="wt-stage-panel" role="tabpanel" tabIndex={0} aria-labelledby="wt-stage-tab-finished" hidden={stage !== "finished"}>
          {[1, 5].map((page) => <button key={page} type="button" className="wt-stage-page" onClick={(event) => openPage(page, event)} aria-label={`실제 완성 ${page}페이지 크게 읽기`}><img src={`${A}webtoon-${String(page).padStart(2, "0")}.webp`} alt={`같은 1화의 ${page === 1 ? "창단식" : "월드컵 경기"} 실제 완성 페이지`} loading="lazy" width={1024} height={1536} /><span>{String(page).padStart(2, "0")} / {page === 1 ? "창단식" : "월드컵"} · 크게 읽기 ↗</span></button>)}
        </div>
        <p className="wt-workbench-caption">《1억의 구단주》 1화 《새 게임》 · 완성본 25P <button type="button" onClick={(event) => openPage(1, event)}>처음부터 읽기 ↗</button></p>
      </div>
    </DetailSection>

    <DetailSection id="webtoon-scene" eyebrow="05 / 원고와 장면 구성" title={"원고를 장면으로 나눠\n작화할 내용을 정합니다"} lead={"1화 원고의 장면 3을 그린 완성본 05P입니다\n원고의 행동이 그림으로 이어지는 과정을 비교해보세요"}>
      <div className="wt-scene-grid">
        <div>
          <div className="wt-tabs wt-scene-tabs" role="tablist" aria-label="같은 장면의 제작 단계 선택">
            {scenes.map((item, index) => <button key={item} type="button" ref={(element) => { sceneRefs.current[index] = element; }} role="tab" id={`wt-scene-tab-${item}`} aria-controls="wt-scene-description" aria-selected={scene === item} tabIndex={scene === item ? 0 : -1} onClick={() => setScene(item)} onKeyDown={(event) => selectTab(event, scenes, index, setScene, sceneRefs.current)}>{item === "script" ? "원고" : item === "layout" ? "장면 구성" : "완성"}</button>)}
          </div>
          <article id="wt-scene-description" className="wt-scene-description" role="tabpanel" tabIndex={0} aria-labelledby={`wt-scene-tab-${scene}`}>
            <span className="wt-eyebrow">{detail.label}</span><h3>{detail.title}</h3><p>{detail.body}</p><blockquote>{detail.quote}</blockquote><p className="wt-small">{detail.note}</p>
          </article>
        </div>
        <button type="button" className="wt-scene-result" onClick={(event) => openPage(5, event)} aria-label="시나리오 장면3과 같은 완성05페이지 크게 읽기"><img src={`${A}webtoon-05.webp`} alt="휴대전화를 내려놓고 경기에 몰입하는 같은 장면의 완성05페이지" loading="lazy" width={1024} height={1536} /><span>같은 장면의 완성 페이지 · 05 / 25 <b>크게 읽기 ↗</b></span></button>
      </div>
    </DetailSection>

    <DetailSection id="webtoon-revision" eyebrow="06 / 작화와 검수" title={"대사와 말풍선을 살펴\n읽는 흐름을 다듬습니다"} lead={"첫 컷의 말풍선 위치를 옮기고\n꼬리 길이를 줄였습니다"}>
      <div className="wt-revision-grid">
        {[["webtoon-before.webp", "수정 전", "첫 컷의 긴 말풍선 꼬리"], ["webtoon-after.webp", "수정 후", "말풍선 위치와 꼬리 길이 조정"]].map(([file, label, caption]) => <figure key={file}><button type="button" onClick={(event) => openImage(file, `${label} 같은 장면의 말풍선`, event)} aria-label={`${label} 페이지 확대`}><img src={`${A}${file}`} alt={`${label} · ${caption}`} loading="lazy" /></button><figcaption><strong>{label}</strong><span>{caption}</span></figcaption></figure>)}
      </div>
      <p className="wt-note">1화 12번째 페이지의 실제 수정 전후입니다</p>
    </DetailSection>

    <DetailSection id="webtoon-reading" eyebrow="07 / 완성 웹툰" title={"실제 완성본을\n전체 흐름으로 확인하세요"} lead={"1화 《새 게임》 완성본 25P입니다\n장면을 고르거나 처음부터 읽어보세요"}>
      <div className="wt-reading-three">
        {[[1, "창단식 프롤로그"], [5, "월드컵 경기 장면"], [21, "도현과 정훈의 첫 만남"]].map(([number, label]) => <button key={number} type="button" onClick={(event) => openPage(Number(number), event)} aria-label={`${label} ${number}페이지부터 크게 읽기`}><img src={`${A}webtoon-${String(number).padStart(2, "0")}.webp`} alt={`1화 실제 ${label}`} loading="lazy" width={1024} height={1536} /><span><b>{String(number).padStart(2, "0")}</b>{label} ↗</span></button>)}
      </div>
      <div className="wt-reading-end"><div><button type="button" className="wt-text-button" onClick={(event) => openPage(1, event)}>1화 25P 전체 읽기 ↗</button><p>한 화의 흐름을 확인한 뒤<br />필요한 이야기와 페이지 수를 상담해보세요</p></div><CaseCta caseId={CASE_ID} caseTitle={CASE_TITLE} entryPoint="finished-case">이 사례로 웹툰 제작 상담</CaseCta></div>
    </DetailSection>

    <DetailSection id="webtoon-motion" eyebrow="08 / 같은 웹툰의 영상화" title={"완성 웹툰을\n모션코믹 영상으로"} lead={"같은 1화의 장면을 골라\n40초 세로 모션코믹으로 편집했습니다"}>
      <div className="wt-motion-grid"><div className="wt-motion-copy"><p className="wt-large-copy">웹툰 그림에 움직임과<br />소리를 더합니다</p><p>줌과 장면 전환으로 화면을 구성하고<br />자막과 AI 음성 내레이션을 넣었습니다</p><p>완성된 웹툰을 영상화하거나<br />웹툰과 모션코믹을 함께 제작할 수 있습니다</p><p className="wt-small">이 사례의 영상은 40초입니다<br />상품 영상은 30초 또는 60초로 제작합니다</p><CaseCta caseId={CASE_ID} caseTitle={CASE_TITLE} material="완성 웹툰 있음" entryPoint="motion">기존 웹툰 영상화 상담</CaseCta><a className="wt-text-button" href="#pricing">웹툰·영상화 구성과 가격 보기 ↓</a></div><DetailVideo src={`${A}clubowner-highlight.mp4`} poster={`${A}poster-clubowner-highlight.webp`} label="《1억의 구단주》 1화 · 같은 웹툰의 모션 하이라이트 · 40초" portrait /></div>
      <div className="wt-motion-bundle"><h3>웹툰과 영상이 함께 필요하다면</h3><p>웹툰 12P·24P에 모션코믹을 더하는<br />함께 제작 세트를 선택하세요</p><WebtoonBundles compact /></div>
    </DetailSection>

    <DetailSection id="webtoon-apply" eyebrow="09 / 우리 브랜드에 적용하기" title={"전할 내용을 정리해\n우리 브랜드의 웹툰으로"} lead="알릴 내용과 사용처를 확인한 뒤 캐릭터·대사·장면을 제안합니다">
      <div className="wt-application-flow">
        <article><span>01</span><h3>알릴 내용 정리</h3><p>제품 정보와 브랜드 자료에서 웹툰으로 전할 내용을 고릅니다</p></article>
        <article><span>02</span><h3>인물과 상황 기획</h3><p>내용을 전달할 캐릭터와 이야기가 벌어질 장면을 정합니다</p></article>
        <article><span>03</span><h3>원고와 컷 구성</h3><p>사용처와 분량에 맞춰 대사와 장면 순서를 구체화합니다</p></article>
      </div>
      <div className="wt-brand-example"><DetailImage src={`${A}yofree-outing-01.webp`} alt="요프리 제품의 사용 상황을 이야기로 풀어낸 별도 브랜드 웹툰 시안" caption="YoFree 브랜드 웹툰 · 고객 제안용 제작 시안" zoom /><div><span className="wt-tag">브랜드 웹툰 제작 시안</span><h3>YoFree<br />제품의 사용 상황을 이야기로</h3><p>제품과 사용 장면을 웹툰으로 풀어낸 별도 제작 예시입니다 고객 제안용 시안으로, 채택·납품·게시를 의미하지 않습니다</p><CaseCta caseId="CASE-YOFREE-OUTING" caseTitle="YoFree 브랜드 웹툰 시안" entryPoint="brand-example">브랜드 웹툰으로 상담</CaseCta></div></div>
    </DetailSection>
    <WebtoonDetailReader selection={viewer} onClose={() => setViewer(null)} />
  </div>;
}
