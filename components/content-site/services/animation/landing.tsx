import type { ServiceModule, ServiceSectionProps } from "../../module";
import { getSlot } from "@/lib/content-site/example-media";
import { animationReferences } from "@/lib/content-site/services/animation";
import { r8Sections } from "@/lib/content-site/r8-sections";
import { r8Details } from "@/lib/content-site/r8-details";
import { ServiceHero } from "../service-hero";
import { ReelPlayer } from "../reel-player";
import { FigureRow } from "../figure-row";
import { EditorialSection } from "../editorial-section";
import { AnimationReferences } from "./references";
import "./animation.css";

const head = r8Sections.animation;
function Hero({ data }: ServiceSectionProps) {
  return <ServiceHero data={data} wide media={<ReelPlayer slot={getSlot("animation-hero-1")} hero />} />;
}
function Signature() {
  const references = animationReferences.map(item => ({ ...item, media: getSlot(item.slot) })).filter(item => item.media.src.trim());
  return <>
    <EditorialSection id="animation-forms" head={head.FORMS}>
      <FigureRow items={r8Details.animation.FORMS.map((item, i) => ({ ...item, slot: `animation-form-${i + 1}` }))} />
      <dl className="cs-svc-animation-lengths"><dt className="cs-t-label">길이</dt><dd className="cs-t-body">30초 · 한 가지 메시지를 한 흐름으로 전합니다</dd><dd className="cs-t-body">60초 · 도입과 전개와 마무리를 나누어 이야기합니다</dd></dl>
    </EditorialSection>
    <EditorialSection id="animation-character" head={head.CHARACTER}>
      <div className="cs-r8-two"><ReelPlayer slot={getSlot("animation-character-sheet")} /><div><h3 className="cs-t-h3">설정서에 담기는 것</h3><ul className="cs-r8-list">{[
        ["역할과 성격", "브랜드와 이야기에서 맡는 역할을 정합니다"], ["외형", "정면과 측면의 비율과 색과 소품을 정리합니다"], ["표정", "기쁨과 놀람 같은 기본 표정을 미리 정합니다"], ["동작", "걷기와 손짓처럼 자주 쓰는 움직임을 정합니다"], ["기존 캐릭터", "이미 있는 캐릭터는 원본 파일에 맞춰 설정서를 만듭니다"],
      ].map(([title, body]) => <li key={title}><h4 className="cs-t-label">{title}</h4><p className="cs-t-body">{body}</p></li>)}</ul></div></div>
    </EditorialSection>
    <EditorialSection id="animation-storyboard" head={head.STORYBOARD}>
      <FigureRow items={r8Details.animation.STORYBOARD} />
      <h3 className="cs-t-label">30초 구성 예시</h3>
      <ol className="cs-svc-animation-scene-timeline" role="list">{["캐릭터 등장", "상황 제시", "제품 소개", "행동 전개", "변화", "마무리"].map((title, i) => <li key={title} aria-label={`${i * 5}초부터 ${(i + 1) * 5}초 ${title}`}><ReelPlayer slot={getSlot(`animation-form-${i % 3 + 1}`)} /><span className="cs-t-caption">{i * 5}–{(i + 1) * 5}초</span><p className="cs-t-label">{title}</p></li>)}</ol>
      <p className="cs-t-small cs-r8-note">실제 구성은 영상마다 다르며 기획안에서 확정합니다</p>
    </EditorialSection>
    {references.length > 0 && <EditorialSection id="animation-references" head={head.REFERENCE}><AnimationReferences items={references} /></EditorialSection>}
  </>;
}
export const animationLanding: ServiceModule = { Hero, Signature, worksLayout: "vertical" };
