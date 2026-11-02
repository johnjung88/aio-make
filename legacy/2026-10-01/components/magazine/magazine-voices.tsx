"use client";
import { useState, useEffect } from "react";
import { MagazineEyebrow } from "./magazine-eyebrow";

type Testimonial = {
  pre: string;
  em: string;
  post: string;
  name: string;
  role: string;
  stat: string;
  statCap: string;
};

const testimonials: Testimonial[] = [
  {
    pre: "빠른 제작이라 ",
    em: "퀄리티가 걱정됐는데",
    post: ", 첫 화면 카피와 버튼 위치까지 영업에 바로 쓸 수 있게 다듬어주셨어요",
    name: "김 대표",
    role: "교육 컨설팅 · 랜딩 3일",
    stat: "+42%",
    statCap: "문의 전환",
  },
  {
    pre: "기존 쇼핑몰을 새로 만든 게 아니라 ",
    em: "첫 화면·배너·동선을",
    post: " 함께 개선해주신 작업이었어요",
    name: "박 사장",
    role: "식품몰 · 카페24 메인 5일",
    stat: "+28%",
    statCap: "매출",
  },
  {
    pre: "시드 라운드 IR Deck을 ",
    em: "5일 만에",
    post: ", 임원진이 만족하는 수준으로 완성해주셨습니다",
    name: "이 대표",
    role: "스타트업 · IR Deck 5일",
    stat: "$2M",
    statCap: "시드 통과",
  },
  {
    pre: "단순히 예쁜 게 아니라 ",
    em: "실제 구매 결정에 영향을 미치도록",
    post: " 설계되어 있습니다",
    name: "정 마케터",
    role: "뷰티 브랜드 · 상세 2일",
    stat: "+52%",
    statCap: "전환율",
  },
  {
    pre: "자사몰을 7일 안에 ",
    em: "결제·배송·알림까지",
    post: " 운영 가능한 수준으로 구축해주셨어요",
    name: "최 대표",
    role: "피트니스 · 자사몰 7일",
    stat: "×1.2",
    statCap: "월 매출",
  },
];

export function MagazineVoices() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(timer);
  }, []);

  const t = testimonials[active];

  return (
    <section
      className="max-w-[1200px] mx-auto relative text-center"
      style={{ padding: "var(--space-section) var(--space-edge)" }}
    >
      {/* Eyebrow */}
      <MagazineEyebrow className="mb-3 md:mb-6">Voices from the Field</MagazineEyebrow>

      <h2
        className="font-normal mx-auto mb-4 md:mb-14"
        style={{ fontFamily: "var(--font-marcellus)", fontSize: "var(--text-h1)", lineHeight: "var(--leading-display)", letterSpacing: "-0.014em", color: "var(--tone-magazine-ink)" }}
      >
        의뢰인의{" "}
        <em style={{ fontFamily: "var(--font-fraunces)", fontStyle: "normal", fontWeight: 500 }}>편지</em>
      </h2>

      {/* Slide area */}
      <div className="relative min-h-[160px] sm:min-h-[360px] max-w-[880px] mx-auto py-1 md:py-[60px] flex flex-col justify-center items-center gap-1 md:gap-8">
        <div
          style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(44px, 9vw, 132px)", color: "var(--tone-magazine-ink-faint)", lineHeight: 0.5, fontWeight: 400, userSelect: "none" }}
        >
          &ldquo;
        </div>

        <blockquote
          key={active}
          className="mx-auto max-w-[720px] animate-fade-in"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(18px,2.8vw,38px)",
            lineHeight: 1.45,
            letterSpacing: "-0.01em",
            color: "var(--tone-magazine-ink)",
          }}
        >
          {t.pre}
          <em style={{ fontStyle: "normal", fontWeight: 500 }}>{t.em}</em>
          {t.post}
        </blockquote>

        <div className="flex items-baseline justify-center gap-3 md:gap-5 flex-wrap mt-1 md:mt-2">
          {/* Name + Role */}
          <div className="inline-flex items-baseline gap-3">
            <span
              style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "clamp(18px, 1.7vw, 22px)",
                color: "var(--tone-magazine-ink)",
                letterSpacing: "-0.01em",
                lineHeight: 1,
              }}
            >
              {t.name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: "clamp(12px, 1vw, 13.5px)",
                color: "var(--tone-magazine-ink-3)",
                fontWeight: 400,
                letterSpacing: "-0.003em",
              }}
            >
              {t.role}
            </span>
          </div>

          {/* divider */}
          <span
            className="hidden sm:inline-block"
            style={{ width: 1, height: 22, background: "var(--tone-magazine-line-2)" }}
          />

          {/* Stat (큰 숫자) + StatCap */}
          <div className="inline-flex items-baseline gap-2">
            <span
              style={{
                fontFamily: "var(--font-marcellus)",
                fontSize: "clamp(26px, 2.6vw, 36px)",
                color: "var(--tone-magazine-red)",
                letterSpacing: "-0.018em",
                lineHeight: 1,
              }}
            >
              {t.stat}
            </span>
            <span
              style={{
                fontFamily: "var(--font-pretendard)",
                fontSize: "clamp(11.5px, 1vw, 13px)",
                color: "var(--tone-magazine-ink-2)",
                fontWeight: 500,
                letterSpacing: "-0.003em",
              }}
            >
              {t.statCap}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation dots */}
      <div
        className="inline-flex gap-[10px] mt-2 md:mt-8 items-center px-[18px] py-2 md:py-3 rounded-full"
        style={{ border: "1px solid var(--tone-magazine-line-2)", background: "var(--tone-magazine-paper-2)" }}
      >
        {testimonials.map((_, i) => (
          <button
            key={i}
            aria-label={`${i + 1}번 후기`}
            onClick={() => setActive(i)}
            style={{
              width: 22,
              height: 1.5,
              background: i === active ? "var(--tone-magazine-ink)" : "var(--tone-magazine-ink-faint)",
              border: 0,
              cursor: "pointer",
              transition: "background 0.3s",
              padding: 0,
            }}
          />
        ))}
        <span
          className="ml-3 pl-[14px]"
          style={{
            borderLeft: "1px solid var(--tone-magazine-line-2)",
            fontFamily: "var(--font-jetbrains)",
            fontSize: 11,
            color: "var(--tone-magazine-ink-2)",
            letterSpacing: "0.16em",
          }}
        >
          {String(active + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
