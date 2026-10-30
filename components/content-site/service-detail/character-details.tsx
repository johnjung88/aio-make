"use client";

import { useEffect, useRef, useState } from "react";
import { useCsMotion } from "../shell/frame";
import {
  CaseCta,
  DetailHero,
  DetailImage,
  DetailSection,
  DetailVideo,
  ServiceOverview,
} from "./shared";
import "./character-details.css";

const media = "/service-detail-v14/";
const characterMedia = "/service-detail-v15/";

const poses = [
  { short: "걱정", name: "걱정하는 표정", purpose: "이야기 속 고민을 표현할 때 사용할 수 있는 표정입니다\n사용할 상황과 감정에 맞춰 포즈를 고릅니다" },
  { short: "윙크", name: "정제를 들고 윙크하기", purpose: "윙크하는 포즈를 마지막 제품 장면에 다시 등장시켜 캐릭터와 브랜드를 연결했습니다" },
  { short: "인사", name: "손 흔들며 인사하기", purpose: "손을 흔드는 포즈로 제품 설명에 앞서 캐릭터를 소개합니다" },
  { short: "점프", name: "가볍게 점프하기", purpose: "점프하는 포즈로 등장한 뒤 손을 흔드는 포즈로 바뀝니다\n실제 영상에서 포즈의 연결을 볼 수 있습니다" },
  { short: "수면", name: "베개에서 잠들기", purpose: "휴식하는 상황을 표현하도록 마련한 포즈입니다\n필요한 장면과 감정을 골라 캐릭터의 역할을 확장할 수 있습니다" },
  { short: "가리킴", name: "제품을 가리켜 설명하기", purpose: "옆을 가리키는 포즈를 제품과 문구 옆에 배치해 설명하는 역할을 맡겼습니다" },
] as const;

const scenes = [
  { title: "인사하는 장면", detail: "같은 포즈로 시작하기", pose: 2, time: 3.15, timeLabel: "00:03", image: "yofree-scene-greeting.webp" },
  { title: "설명하는 장면", detail: "제품 옆에서 가리키기", pose: 5, time: 6.2, timeLabel: "00:06", image: "yofree-scene-explain.webp" },
  { title: "마무리하는 장면", detail: "윙크와 함께 다시 등장", pose: 1, time: 24.8, timeLabel: "00:24", image: "yofree-scene-ending.webp" },
] as const;

const materialOptions = [
  { label: "캐릭터부터 필요해요", value: "undecided", note: "제품·서비스의 특징과 원하는 인상부터 함께 정합니다" },
  { label: "기존 캐릭터가 있어요", value: "ready", note: "캐릭터 이미지와 사용할 수 있는 원본·사용 조건을 확인합니다" },
  { label: "이미지·원고가 있어요", value: "partial", note: "보유 자료를 보고 필요한 캐릭터와 장면을 정합니다" },
] as const;

export function AnimationDetail() {
  const { motion } = useCsMotion();
  const [poseIndex, setPoseIndex] = useState(2);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [materialIndex, setMaterialIndex] = useState(0);
  const [playRequest, setPlayRequest] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [motionError, setMotionError] = useState(false);
  const poseVideo = useRef<HTMLVideoElement>(null);
  const pose = poses[poseIndex];
  const scene = scenes[sceneIndex];
  const material = materialOptions[materialIndex];
  const poseNumber = String(poseIndex + 1).padStart(2, "0");

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(preference.matches);
    sync(); preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = poseVideo.current;
    if (!node) return;
    node.pause();
    const bounds = node.getBoundingClientRect();
    const visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
    if (playRequest > 0 && !reduceMotion && motion !== "paused" && visible && !document.hidden) {
      node.currentTime = 0;
      node.play().catch(() => { /* Native controls remain available. */ });
    }
  }, [poseIndex, playRequest, reduceMotion, motion]);

  useEffect(() => {
    const node = poseVideo.current;
    if (!node) return;
    const stopWhenHidden = () => { if (document.hidden) node.pause(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) node.pause();
    }, { threshold: 0.1 });
    observer.observe(node); document.addEventListener("visibilitychange", stopWhenHidden);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", stopWhenHidden); node.pause(); };
  }, []);

  function selectPose(index: number) {
    setMotionError(false);
    setPoseIndex(index);
    setPlayRequest((value) => value + 1);
  }

  function selectScene(index: number) {
    setPlayRequest(0);
    setMotionError(false);
    setSceneIndex(index);
    setPoseIndex(scenes[index].pose);
  }

  return (
    <div className="sd-animation">
      <DetailHero
        eyebrow="ANIMATION"
        title={<>캐릭터가 전하는<br />브랜드의 이야기</>}
        description="필요한 행동과 장면을 설계하고 캐릭터 영상으로 만듭니다"
        variant="animation"
        label="YoFree · 캐릭터 구축·모션 활용 제작 시안"
        caseHref="#animation-case"
        primaryLabel="캐릭터 활용 사례 보기"
      >
        <div className="sd-character-banner">
          <span className="sd-character-banner-orbit" aria-hidden="true" />
          <span className="sd-character-banner-word" aria-hidden="true">HELLO!</span>
          <DetailImage src={`${characterMedia}yofree-character-04.webp`} alt="투명한 캡과 노란 몸체의 점프하는 요프리 브랜드 캐릭터" eager zoom={false} />
          <span className="sd-character-banner-caption">ONE CHARACTER<br />MANY STORIES</span>
        </div>
      </DetailHero>

      <ServiceOverview
        service="animation"
        items={["기존 캐릭터 활용 또는 신규 캐릭터 방향 협의", "전할 내용에 맞는 행동·대사·장면 구성", "사용처에 맞는 길이·화면비와 제작 범위 확인"]}
      />

      <DetailSection
        eyebrow="START WITH YOUR MATERIALS"
        title="지금 가진 자료에서 시작합니다"
        lead={"캐릭터가 준비된 정도에 맞춰 시작점을 정합니다\n선택한 자료 상태는 아래 상담에 함께 남습니다"}
      >
        <div className="sd-character-materials" role="group" aria-label="애니메이션 제작 자료 상태">
          {materialOptions.map((option, index) => (
            <button type="button" key={option.value} aria-pressed={materialIndex === index} onClick={() => setMaterialIndex(index)}>
              <span className="sd-character-number">0{index + 1}</span>
              <strong>{option.label}</strong>
              <span>{option.note}</span>
              <i aria-hidden="true">{materialIndex === index ? "✓" : "↗"}</i>
            </button>
          ))}
        </div>
        <div className="sd-character-inline-cta">
          <p>원하는 행동과 장면을 함께 알려주세요</p>
          <CaseCta caseId="CASE-YOFREE-CHARACTER" caseTitle="요프리 캐릭터·모션 활용" material={material.value} entryPoint="animation-materials">이 자료 상태로 상담하기</CaseCta>
        </div>
      </DetailSection>

      <DetailSection
        id="animation-case"
        eyebrow="YOFREE · CHARACTER STUDY"
        title={<>제품의 특징을,<br />캐릭터의 인상으로</>}
        lead={"제품 병의 형태와 노란 브랜드 색을 캐릭터에 담았습니다\n투명한 캡과 둥근 손발, 표정이 브랜드를 설명하는 자산으로 이어집니다"}
      >
        <div className="sd-character-origin">
          <DetailImage src={`${media}yofree-character-sheet.webp`} alt="병 모양 몸체와 투명 캡, 노란 라벨을 유지하며 표정과 행동이 달라지는 요프리 캐릭터 6포즈" caption="YoFree · 실제 캐릭터 6포즈 자산" />
          <div className="sd-character-origin-copy">
            <span className="sd-character-tag">브랜드 캐릭터 구축·모션 활용 시안</span>
            <h3>같은 캐릭터가<br />여러 역할을 맡도록</h3>
            <p>고민을 표현하고, 인사하고, 제품을 가리키는 포즈를 마련했습니다<br />장면마다 필요한 감정과 역할을 골라 화면에 배치합니다</p>
            <dl>
              <div><dt>형태</dt><dd>제품 병과 투명 캡의 특징</dd></div>
              <div><dt>색과 질감</dt><dd>노란 라벨과 부드러운 클레이 표현</dd></div>
              <div><dt>활용</dt><dd>표정·포즈 선택, 장면 배치와 전환</dd></div>
            </dl>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="SIX POSES, DIFFERENT ROLES"
        title="표정을 고르면, 캐릭터가 움직입니다"
        lead={"같은 캐릭터의 이미지 6종을 바탕으로 짧은 동작 영상을 만들었습니다\n표정을 선택해 재생하고 원본 이미지를 확대해 비교할 수 있습니다"}
      >
        <div className="sd-character-pose-layout">
          <div className="sd-character-pose-stage">
            <span className="sd-character-tag">캐릭터 동작 제작 시안</span>
            <div className="sd-character-motion-frame">
              <video
                ref={poseVideo}
                src={`${characterMedia}yofree-pose-${poseNumber}.mp4`}
                poster={poseIndex === 3 ? "/content-f5/yofree-jump.webp" : `${characterMedia}yofree-character-${poseNumber}.webp`}
                aria-label={`${pose.name} · 4초 캐릭터 동작 제작 시안`}
                aria-describedby="character-motion-note"
                controls playsInline muted loop preload="none"
                onError={() => setMotionError(true)}
                onPlay={(event) => {
                  document.querySelectorAll<HTMLVideoElement>("video").forEach((other) => {
                    if (other !== event.currentTarget) other.pause();
                  });
                }}
              >영상을 재생할 수 없습니다</video>
              <DetailImage className="sd-character-original-zoom" src={poseIndex === 3 ? "/content-f5/yofree-jump.webp" : `${characterMedia}yofree-character-${poseNumber}.webp`} alt={`${pose.name} 캐릭터 ${poseIndex === 3 ? "동작 프레임" : "원본 이미지"}`} caption={poseIndex === 3 ? "동작 프레임" : "원본 이미지"} />
            </div>
            <div className="sd-character-pose-caption" aria-live="polite"><span>0{poseIndex + 1} / 06</span><strong>{pose.name}</strong></div>
            <p className="sd-character-motion-note" id="character-motion-note" aria-live="polite">{motionError ? "동작 영상을 불러오지 못했습니다\n원본 이미지를 확대해 볼 수 있습니다" : reduceMotion || motion === "paused" ? "4초 · 동작 제작 시안 · 재생 버튼으로 확인하세요" : "4초 · 동작 제작 시안 · 표정을 선택하면 재생합니다"}</p>
          </div>
          <div className="sd-character-pose-controls">
            <div className="sd-character-pose-options" role="group" aria-label="캐릭터 여섯 포즈 선택">
              {poses.map((item, index) => (
                <button type="button" key={item.short} aria-pressed={poseIndex === index} onClick={() => selectPose(index)} aria-label={`${item.short} 캐릭터 동작 선택`}>
                  {/* The full asset is available immediately above through the image viewer. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={index === 3 ? "/content-f5/yofree-jump.webp" : `${characterMedia}yofree-character-${String(index + 1).padStart(2, "0")}.webp`} alt="" loading="lazy" />
                  <span>{item.short}</span>
                </button>
              ))}
            </div>
            <div className="sd-character-pose-reading" aria-live="polite">
              <p className="sd-character-eyebrow">A ROLE FOR EACH POSE</p>
              <h3>{pose.name}</h3>
              <p>{pose.purpose}</p>
            </div>
          </div>
        </div>
      </DetailSection>

      <DetailSection
        id="animation-motion"
        eyebrow="SAME CHARACTER IN MOTION"
        title={<>고른 포즈가,<br />영상 속 장면으로</>}
        lead={"같은 캐릭터를 인사·설명·엔딩에 사용한 실제 키네틱 모션그래픽입니다\n장면을 고른 뒤 영상의 재생 버튼을 누르면 그 구간부터 볼 수 있습니다"}
      >
        <div className="sd-character-motion-layout">
          <div className="sd-character-scenes" role="group" aria-label="같은 캐릭터가 사용된 영상 구간 선택">
            {scenes.map((item, index) => (
              <button type="button" key={item.title} aria-pressed={sceneIndex === index} onClick={() => selectScene(index)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${media}${item.image}`} alt="" loading="lazy" />
                <span><small>0{index + 1} · {item.timeLabel}</small><strong>{item.title}</strong><span>{item.detail}</span><i>이 구간 선택 ↗</i></span>
              </button>
            ))}
          </div>
          <div className="sd-character-film">
            <DetailVideo src={`${media}yofree-kinetic.mp4`} poster={`${media}yofree-scene-greeting.webp`} label="YoFree · 「하루 한 병」 · 30초 · 9:16 · 캐릭터 포즈 전환·키네틱 모션그래픽 제작 시안" portrait startAt={scene.time} />
            <p className="sd-character-video-status" aria-live="polite">선택한 장면 · {scene.title} ({scene.timeLabel})</p>
          </div>
        </div>
        <div className="sd-character-scope-note">
          <strong>캐릭터 포즈와 타이포를 연결한 모션 활용 사례입니다</strong>
          <p>위 영상은 등장·포즈 교체·제품 설명을 편집한 키네틱 모션그래픽입니다<br />새 애니메이션에서 필요한 동작과 연기는 의뢰 내용에 맞춰 범위를 정합니다</p>
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="YOUR NEXT CHARACTER"
        title="우리 캐릭터는 어떤 장면에서 움직일까요"
        lead={"원하는 행동과 전할 말부터 알려주세요\n캐릭터 구축과 영상 제작에 필요한 범위를 함께 확인합니다"}
      >
        <div className="sd-character-request-grid">
          <article><span>01 · 행동</span><h3>어떤 동작을 하나요</h3><p>손을 흔들기, 제품 가리키기처럼 꼭 필요한 행동과 캐릭터의 감정을 정합니다</p></article>
          <article><span>02 · 장면과 대사</span><h3>어떤 이야기를 하나요</h3><p>등장할 공간과 장면, 전달할 문구·대사를 정하고 음성이 필요한지 확인합니다</p></article>
          <article><span>03 · 길이와 사용처</span><h3>어디에서 보게 되나요</h3><p>영상의 길이와 게시 매체를 기준으로 화면비와 필요한 결과물을 정합니다</p></article>
        </div>
        <CaseCta caseId="CASE-YOFREE-CHARACTER" caseTitle="요프리 캐릭터·모션 활용" material={material.value} entryPoint="animation-request">만들고 싶은 캐릭터 영상 상담</CaseCta>
      </DetailSection>
    </div>
  );
}

const aiStages = [
  { label: "01 · 기준 전신", short: "기준을 정하다", asset: "ai-full.webp", alt: "87언니의 채택 기준 전신과 니트 의상", title: "유지할 인상을 먼저 정합니다", copy: "앞에서 확인한 얼굴과 함께 전신의 비례·의상을 기준으로 남깁니다\n다음 장면의 인상과 스타일을 비교합니다", checks: ["전신의 비례", "헤어와 의상", "피부 표현과 조명"] },
  { label: "02 · 보완 전 장면 시험", short: "달라진 부분을 찾다", asset: "ai-t2.webp", alt: "얼굴 인상과 의상 변화, 잘못 생성된 제품 글자를 확인한 보완 전 장면 시험", title: "달라진 인상과 표기를 찾았습니다", copy: "어두운 조명에서 얼굴 인상과 의상이 기준과 달라졌습니다\n잘못 생성된 제품 글자도 확인해 얼굴·의상·조명과 제품 표기를 보완 항목으로 정했습니다", checks: ["달라진 얼굴 인상", "의상과 조명 변화", "잘못 생성된 제품 글자"] },
  { label: "03 · 보완 후 채택", short: "다시 맞추고 채택하다", asset: "ai-t3.webp", alt: "얼굴과 의상, 조명 조건을 보완한 뒤 채택한 87언니 세면대 장면", title: "조건을 보완하고 비교해 채택했습니다", copy: "밝은 조명과 니트 의상, 얼굴 유지 조건을 보완했습니다\n기준 얼굴과 다시 비교한 뒤 세면대 장면을 채택했습니다\n후속 장면도 얼굴·손·제품을 확인합니다", checks: ["밝은 조명", "기준에 맞춘 니트 의상", "기준 얼굴과 재비교"] },
] as const;

export function AiInfluencerDetail() {
  const [stageIndex, setStageIndex] = useState(0);
  const stage = aiStages[stageIndex];

  return (
    <div className="sd-ai">
      <DetailHero
        eyebrow="AI INFLUENCER"
        title={<>브랜드의 얼굴이 될<br />AI 모델을 만듭니다</>}
        description="인물의 기준을 정하고 이미지와 제품영상에 활용합니다"
        variant="ai-influencer"
        label="87언니 · AIO 자체 AI 가상인물"
        caseHref="#ai-case"
        primaryLabel="AI 모델 제작 사례 보기"
      >
        <div className="sd-ai-banner">
          <DetailImage className="sd-ai-banner-face" src="/content-fb3/ai-cplus-12.webp" alt="87언니 AI 가상인물의 C Plus 제품 활용 장면" eager zoom={false} />
          <DetailImage className="sd-ai-banner-full" src="/content-fb3/ai-cleanser-16.webp" alt="같은 가상인물이 클렌저를 활용하는 다른 장면" eager zoom={false} />
          <span className="sd-ai-banner-caption">87 UNNIE<br /><small>AIO VIRTUAL MODEL</small></span>
        </div>
      </DetailHero>

      <ServiceOverview
        service="ai-influencer"
        items={["브랜드에 맞는 인물의 인상·역할과 기준 설정", "기준 얼굴·전신 확인과 장면별 이미지 제작", "제품영상 활용 및 필요한 수량·사용 범위 협의"]}
      />

      <DetailSection
        id="ai-case"
        eyebrow="87 UNNIE · AIO VIRTUAL PERSON"
        title={<>한 장의 얼굴에서,<br />계속 만날 모델로</>}
        lead={"87언니는 AIO가 자체 제작한 AI 가상인물입니다\n역할과 인상을 정한 뒤, 채택한 얼굴·전신을 제작 기준으로 남겼습니다"}
      >
        <div className="sd-ai-definition">
          <div className="sd-ai-definition-intro"><span className="sd-character-tag">AIO 자체 가상인물 구축 사례</span><h3>얼굴을 고르기 전에,<br />인물의 역할부터</h3><p>{"브랜드와 시청자에 맞는 분위기를 정합니다\n헤어·의상·피부 표현·말투를 다음 장면의 기준으로 남깁니다"}</p></div>
          <dl>
            <div><dt>시청자와 역할</dt><dd>누구에게 무엇을 소개할 인물인지</dd></div>
            <div><dt>외형의 인상</dt><dd>연령대의 인상·헤어·의상·피부 표현</dd></div>
            <div><dt>컨텐츠의 톤</dt><dd>이미지의 분위기·말투·피해야 할 표현</dd></div>
            <div><dt>사용할 장면</dt><dd>제품 소개·브랜드 이미지·SNS 컨텐츠</dd></div>
          </dl>
        </div>
      </DetailSection>

      <DetailSection
        eyebrow="A PERSON, WITH A REFERENCE"
        title="얼굴과 손, 다음 장면에서 확인할 기준"
        lead={"기준 얼굴의 인상·헤어·피부 표현과 영상 속 손·제품을 확인합니다\n전신과 장면별 이미지는 아래 보완 과정에서 비교합니다"}
      >
        <div className="sd-ai-baseline">
          <DetailImage src={`${media}ai-face.webp`} alt="부드러운 정면광과 니트 의상의 87언니 채택 기준 얼굴" caption="채택 기준 얼굴 · 인상·헤어·피부 표현" />
          <DetailImage src="/content-f5/ai-cleanser-07.webp" alt="클렌저 영상의 손과 제품 형태를 확인하는 별도 근접 컷" caption="영상 확인 컷 · 손·제품 형태와 표기" />
        </div>
        <div className="sd-ai-review-criteria"><h3>각도와 환경을 바꿔 확인합니다</h3><p>{"정면·측면·표정·전신과 장소·조명을 바꾼 자료를 비교했습니다\n장면마다 얼굴·손·피부 톤·의상을 확인합니다"}</p><p className="sd-character-fineprint">{"상품의 ‘이미지 총 20장’은 고객에게 전달할 수량입니다\n원하는 장면과 활용처에 맞춰 제작합니다"}</p></div>
      </DetailSection>

      <DetailSection
        eyebrow="COMPARE, REFINE, SELECT"
        title={<>달라진 부분을 찾고,<br />조건을 보완합니다</>}
        lead={"기준 얼굴과 장면 시험을 비교한 실제 과정입니다\n단계별 보완 내용을 살펴보고, 이미지를 눌러 확대해 보세요"}
      >
        <div className="sd-ai-stage-options" role="group" aria-label="AI 모델 기준과 보완 과정 선택">
          {aiStages.map((item, index) => <button type="button" key={item.asset} aria-pressed={stageIndex === index} onClick={() => setStageIndex(index)}><small>0{index + 1}</small><strong>{item.short}</strong><span>{index === 0 ? "채택 기준 전신" : index === 1 ? "보완 전" : "보완 후 채택"}</span></button>)}
        </div>
        <div className="sd-ai-comparison">
          {aiStages.map((item, index) => <div className="sd-ai-comparison-item" key={item.asset} data-selected={stageIndex === index}><DetailImage src={`${media}${item.asset}`} alt={item.alt} caption={item.label} /></div>)}
        </div>
        <div className="sd-ai-stage-reading" aria-live="polite"><div><p className="sd-character-eyebrow">{stage.label}</p><h3>{stage.title}</h3></div><div><p>{stage.copy}</p><ul>{stage.checks.map((check) => <li key={check}>{check}</li>)}</ul></div></div>
      </DetailSection>

      <DetailSection
        eyebrow="FROM IDENTITY TO CONTENT"
        title={<>같은 인물의 기준을,<br />브랜드 컨텐츠에 연결합니다</>}
        lead={"DR’s Secret 제품 소개와 사용 장면에 AI 인물을 활용한 제안 시안입니다\n얼굴과 손, 제품의 형태·라벨·표기를 함께 확인합니다"}
      >
        <div className="sd-ai-product-films">
          <article><DetailVideo src={`${media}bwl-cplus-ad.mp4`} poster={`${media}poster-bwl-cplus-ad.webp`} label="DR’s Secret · C Plus 세럼 · 20초 · 9:16 · AI 인물 제품영상 제안용 시안" portrait /><h3>C Plus 세럼</h3><p>인물·제품 소개 · 20초 · 제안용 시안</p><CaseCta caseId="CASE-BWL-CPLUS-AD" caseTitle="DR’s Secret C Plus 제품영상 제안 시안" entryPoint="ai-product-cplus">이런 제품영상 상담</CaseCta></article>
          <article><DetailVideo src={`${media}bwl-cleanser-ad.mp4`} poster={`${media}poster-bwl-cleanser-ad.webp`} label="DR’s Secret · 클렌저 1 · 20초 · 9:16 · AI 인물 제품 사용 장면 제안용 시안" portrait /><h3>클렌저 1</h3><p>인물·사용 장면 · 20초 · 제안용 시안</p><CaseCta caseId="CASE-BWL-CLEANSER-AD" caseTitle="DR’s Secret 클렌저 제품영상 제안 시안" entryPoint="ai-product-cleanser">이런 활용 장면 상담</CaseCta></article>
        </div>
        <p className="sd-character-fineprint">{"위 제품영상은 활용을 제안한 시안입니다\n자체 모델의 기준 이미지 채택과 고객의 영상 최종 채택·게시는 구분합니다"}</p>
      </DetailSection>

      <DetailSection
        eyebrow="THE NEXT USE OF YOUR MODEL"
        title="다음 컨텐츠도 같은 기준에서 이어갑니다"
        lead={"채택한 인물 설정과 기준 이미지를 다음 제작에도 활용합니다\n필요한 이미지·영상 수량과 사용 매체·기간·범위를 함께 정합니다"}
      >
        <div className="sd-ai-next-grid">
          <article><span>01 · 만들 컨텐츠</span><h3>이미지와 영상</h3><p>상품 상세·배너·SNS 이미지·제품영상 등 필요한 형식과 수량을 정합니다</p></article>
          <article><span>02 · 쓰일 곳</span><h3>매체와 사용 범위</h3><p>홈페이지·SNS·광고 중 사용할 매체와 기간, 브랜드의 활용 범위를 확인합니다</p></article>
          <article><span>03 · 이어갈 제작</span><h3>기준과 추가 작업</h3><p>{"얼굴·의상·스타일을 기준으로 후속 장면을 만듭니다\n외형 변경·음성·독점 사용은 별도로 협의합니다"}</p></article>
        </div>
        <CaseCta caseId="CASE-UNNIE87-MODEL" caseTitle="87언니 자체 AI 모델 구축" entryPoint="ai-followup">브랜드에 맞는 AI 모델 상담</CaseCta>
      </DetailSection>
    </div>
  );
}
