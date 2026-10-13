/* 모션그래픽 서비스 모듈(WP-B). 서버 컴포넌트만(고유 client 섬 0개, 움직임은 CSS만).
 * 히어로: 기울어진 정사각 무대 + 키네틱 타이포 · 시그니처: 단순형과 맞춤형 비교, 스타일 프레임 → 모션.
 * 무대·일러스트는 모두 장식(aria-hidden)이고 근처에 `연출 예시` 태그를 둔다. 첫 프레임이 완성된 정지 구도이며
 * reduced-motion·움직임 토글이면 그 구도로 멈춘다. 고객 사례는 공통 CsWorks(서버 게이트)만 그린다.
 * 스타일은 ./motion-graphics.css(키프레임만 ./motion-graphics.keyframes.css), 선택자는 .cs-svc-motion-graphics로 시작. */
import { HERO_TITLE_ID, CsHeroCopy } from "../../blocks/hero";
import type { ServiceModule, ServiceSectionProps } from "../../module";
import { CsSectionHead } from "../../ui/section-head";
import { CsTag } from "../../ui/tag";
import { motionGraphicsSignature as sig } from "@/lib/content-site/services/motion-graphics";
import { MEDIA_TAGS } from "@/lib/content-site/types";
import "./motion-graphics.css";
import "./motion-graphics.keyframes.css";

/** 장식 무대: 글자 두 줄 + 원 + 사각 + 글자 막대. variant는 CSS가 움직임 여부를 정한다. */
function Composition({
  word,
  variant,
  character = false,
}: {
  word: string;
  variant: "stage" | "still" | "moving";
  character?: boolean;
}) {
  const [first, second] = word.split("\n");
  return (
    <div className="cs-svc-motion-graphics-comp" data-variant={variant} aria-hidden="true">
      <span className="cs-svc-motion-graphics-shape" data-shape="circle" />
      <span className="cs-svc-motion-graphics-shape" data-shape="square" />
      {character ? <span className="cs-svc-motion-graphics-character" /> : null}
      <span
        className={
          "cs-svc-motion-graphics-word " +
          (variant === "stage" ? "cs-t-display" : "cs-t-h2")
        }
      >
        <span className="cs-svc-motion-graphics-line" data-line="1">
          {first}
        </span>
        <span className="cs-svc-motion-graphics-line" data-line="2">
          {second}
        </span>
      </span>
      <span className="cs-svc-motion-graphics-bars">
        <span />
        <span />
      </span>
    </div>
  );
}

function Hero({ data }: ServiceSectionProps) {
  return (
    <section
      className="cs-hero cs-svc-motion-graphics-hero"
      data-cs-section="hero"
      aria-labelledby={HERO_TITLE_ID}
    >
      <div className="cs-svc-motion-graphics-glow" aria-hidden="true" />
      <div className="cs-container">
        <div className="cs-grid cs-hero-grid">
          <div className="cs-col-7">
            <CsHeroCopy id={data.id} hero={data.hero} />
          </div>
          <div className="cs-col-5 cs-svc-motion-graphics-stage-wrap">
            <div className="cs-svc-motion-graphics-stage">
              <Composition word={sig.stage.title} variant="stage" />
              <CsTag overlay>{MEDIA_TAGS.staged}</CsTag>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const c = sig.compare;
  return (
    <section
      className="cs-section cs-section--alt cs-svc-motion-graphics-compare"
      data-cs-section="signature"
      aria-labelledby="cs-mg-compare-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-mg-compare-title"
          eyebrow={c.eyebrow}
          title={c.title}
          lead={c.lead}
        />
        <ul className="cs-svc-motion-graphics-plans">
          {c.plans.map((plan) => (
            <li key={plan.id} className="cs-svc-motion-graphics-plan" data-plan-type={plan.id}>
              <div className="cs-svc-motion-graphics-plan-art">
                <Composition
                  word={sig.stage.title}
                  variant="still"
                  character={plan.id === "custom"}
                />
                <CsTag overlay>{MEDIA_TAGS.staged}</CsTag>
              </div>
              <div className="cs-svc-motion-graphics-plan-body">
                <h3 className="cs-t-h3">{plan.name}</h3>
                <p className="cs-t-body">{plan.body}</p>
                <p className="cs-t-label">{c.itemsLabel}</p>
                <ul className="cs-svc-motion-graphics-items">
                  {plan.items.map((item) => (
                    <li key={item} className="cs-t-chip">
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#pricing" className="cs-link">
                  {c.priceLink} <span aria-hidden="true">↓</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StyleFrame() {
  const f = sig.frame;
  const panes = [
    { key: "still", variant: "still" as const, ...f.still },
    { key: "moving", variant: "moving" as const, ...f.moving },
  ];
  return (
    <section
      className="cs-section cs-svc-motion-graphics-frame"
      data-cs-section="signature"
      aria-labelledby="cs-mg-frame-title"
    >
      <div className="cs-container">
        <CsSectionHead
          id="cs-mg-frame-title"
          eyebrow={f.eyebrow}
          title={f.title}
          lead={f.lead}
        />
        <ol className="cs-svc-motion-graphics-panes">
          {panes.map((pane) => (
            <li key={pane.key} className="cs-svc-motion-graphics-pane">
              <div className="cs-svc-motion-graphics-pane-art">
                <Composition word={f.word} variant={pane.variant} />
                <CsTag overlay>{MEDIA_TAGS.staged}</CsTag>
              </div>
              <p className="cs-t-label">{pane.label}</p>
              <p className="cs-t-small">{pane.caption}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Signature() {
  return (
    <>
      <Compare />
      <StyleFrame />
    </>
  );
}

export const motionGraphicsLanding: ServiceModule = {
  Hero,
  Signature,
  worksLayout: "wide",
};
