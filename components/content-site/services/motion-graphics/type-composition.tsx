"use client";

/* 모션그래픽 live 구성(R5, 이 서비스의 유일한 client 파일).
 * 도형 6개는 서로 다른 주기·지연의 루프로 계속 움직이고, 글자는 한 자씩 반복해서 올라온다.
 * 구성 버튼(또는 보이는 동안 자동 넘김)으로 배치가 바뀌면 도형과 글자가 함께 자리를 옮기고 글자 진입이 처음부터 다시 시작된다.
 * 화면 밖·숨김 탭·움직임 끔에서는 data-play="paused"로 루프가 멈춘다. reduced-motion이면 정지 배치와 버튼만 남는다. */
import Image from "next/image";
import { useRef } from "react";
import { CsTag } from "../../ui/tag";
import { useAutoCycle, useInViewPlay } from "../motion-runtime";

export type CompositionImage = { src: string; alt: string; width: number; height: number; "data-fx"?: string; "data-fy"?: string };

const MODES = ["문구 중심", "단어 강조", "이미지 조합"] as const;
const WORDS = ["읽고", "보고", "기억하다"] as const;
const SHAPES = ["ring", "disc", "square", "bar", "dot", "arc"] as const;
const AUTO_MS = 4200;

export function TypeComposition({ image, background, tag }: { image?: CompositionImage; background?: CompositionImage; tag: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const playing = useInViewPlay(stage, { threshold: .3, pauseOnInteract: true });
  const [mode, setMode, stopped] = useAutoCycle(MODES.length, AUTO_MS, playing);
  return <div className="cs-svc-motion-graphics-composition">
    <div className="cs-svc-motion-graphics-composition-copy">
      <p className="cs-t-eyebrow">TYPE IN MOTION</p>
      <h3 className="cs-t-h3">같은 문구도<br/>배치와 박자가 다르게</h3>
      <p className="cs-t-small">강조할 단어와 읽는 순서에 맞춰 화면을 구성합니다</p>
      <div className="cs-svc-motion-graphics-modes" role="group" aria-label="타이포 구성 선택">{MODES.map((label,index)=><button type="button" className="cs-btn cs-btn--ghost" key={label} aria-pressed={mode===index} onClick={()=>setMode(index)}>{label}</button>)}</div>
      <p className="cs-t-caption">{stopped ? "고른 구성으로 도형과 글자가 다시 배치됩니다" : "구성이 차례로 바뀝니다 · 버튼으로 직접 고를 수 있습니다"}</p>
    </div>
    <div ref={stage} className="cs-svc-motion-graphics-live" data-type-mode={mode}>
      <div className="cs-svc-motion-graphics-live-art" aria-hidden="true">
        {background && <div className="cs-svc-motion-graphics-live-bg"><Image src={background.src} alt="" width={background.width} height={background.height} sizes="(max-width:767px) 92vw, 60vw" data-fx={background["data-fx"]} data-fy={background["data-fy"]}/></div>}
        {SHAPES.map(shape=><span key={shape} className="cs-svc-motion-graphics-live-shape" data-shape={shape}/>)}
        {WORDS.map((word,w)=><div key={word} className="cs-svc-motion-graphics-live-word cs-t-h2" data-word={w}>{[...word].map((letter,l)=><span key={`${letter}-${l}`} className="cs-svc-motion-graphics-live-mask"><span className="cs-svc-motion-graphics-live-letter" data-l={l}>{letter}</span></span>)}</div>)}
        <i className="cs-svc-motion-graphics-live-rule"/>
        {image && <Image className="cs-svc-motion-graphics-live-image" src={image.src} alt="" width={image.width} height={image.height} sizes="(max-width:767px) 50vw, 24vw" data-fx={image["data-fx"]} data-fy={image["data-fy"]}/>}
        <span className="cs-svc-motion-graphics-live-mark cs-t-caption">AIO MAKE / MOTION STUDY</span>
      </div>
      <CsTag overlay>{tag}</CsTag>
    </div>
  </div>;
}
