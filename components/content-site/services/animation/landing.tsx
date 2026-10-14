/* 애니메이션 서비스 모듈(R6, BRIEF_R6 6절).
 * 순서: 히어로(텍스트 + 대표 슬롯 1개) → 영상 레퍼런스 영역(16:9 슬롯 그리드) → (공통) 가격 → 진행 방식 → FAQ → 문의 → 다른 서비스.
 * 레퍼런스는 lib/content-site/services/animation.ts의 animationReferenceIds(슬롯 id 한 줄 = 한 칸)에서 온다.
 * 슬롯은 example-media의 영상(src) + poster 또는 이미지를 쓰고, src가 비어 있는 슬롯은 그리지 않는다. 고객 작품은 이 페이지가 아니라 CsWorks 목록으로만 보인다. */
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { getSlot } from "@/lib/content-site/example-media";
import { animationReferenceIds, animationSignature as sig } from "@/lib/content-site/services/animation";
import { ServiceHero, ExampleFigure } from "../service-hero";
import "./animation.css";

/** 채워진 슬롯만 남긴다. 슬롯을 새로 정의해 id를 목록에 더하면 그리드가 한 칸 늘어난다 */
const REFERENCES = animationReferenceIds.map((id) => getSlot(id)).filter((slot) => slot.src.trim() !== "");

function Hero({ data }: ServiceSectionProps) {
  return (
    <ServiceHero
      data={data}
      media={
        <ExampleFigure
          className="cs-svc-animation-hero-example"
          slot={getSlot("animation-hero-1")}
          sizes="(max-width:767px) 90vw, 50vw"
          priority
        />
      }
    />
  );
}

function Signature() {
  const r = sig.reference;
  return (
    <section className="cs-section" data-cs-section="signature" aria-labelledby="cs-animation-ref-title">
      <div className="cs-container">
        <CsSectionHead id="cs-animation-ref-title" eyebrow={r.eyebrow} title={r.title} />
        {REFERENCES.length > 0 ? (
          <ul className="cs-svc-animation-refs" aria-labelledby="cs-animation-ref-title">
            {REFERENCES.map((slot) => (
              <li key={slot.id}>
                <ExampleFigure className="cs-svc-animation-ref" slot={slot} sizes="(max-width:767px) 100vw, 50vw" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="cs-svc-animation-empty">
            <p className="cs-t-small">{r.empty}</p>
          </div>
        )}
      </div>
    </section>
  );
}

export const animationLanding: ServiceModule = { Hero, Signature, worksLayout: "vertical" };
