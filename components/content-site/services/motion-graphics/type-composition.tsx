"use client";
import Image from "next/image";
import { useState } from "react";
import { MotionCanvas } from "../motion-runtime";

export function TypeComposition({poster}:{poster?:string}) {
  const [mode,setMode]=useState(0);
  return <MotionCanvas variant="typography" className="cs-type-composition">
    <div className="cs-type-composition-copy"><p className="cs-t-eyebrow">TYPE IN MOTION</p><h3 className="cs-t-h3">같은 문구도<br/>배치와 박자가 다르게</h3><p className="cs-t-small">강조할 단어와 읽는 순서에 맞춰 화면을 구성합니다</p><div className="cs-type-modes" role="group" aria-label="타이포 구성 선택">{["문구 중심","단어 강조","이미지 조합"].map((label,index)=><button className="cs-btn cs-btn--ghost" key={label} aria-pressed={mode===index} onClick={()=>setMode(index)}>{label}</button>)}</div><p className="cs-t-caption">글자 배치와 전환을 보여주는 구성 예시</p></div>
    <div className="cs-type-stage" data-type-mode={mode} aria-hidden="true"><div className="cs-type-word cs-type-word--one">읽고</div><div className="cs-type-word cs-type-word--two">보고</div><div className="cs-type-word cs-type-word--three">기억하다</div><div className="cs-type-rule"/>{poster&&<Image className="cs-type-image" src={poster} alt="" width={900} height={506} sizes="(max-width:767px) 55vw, 24vw"/>}<span className="cs-type-stage-mark cs-t-caption">AIO MAKE / MOTION STUDY</span></div>
  </MotionCanvas>;
}
