"use client";

import { useState } from "react";
import Image from "next/image";

export function WebtoonScope() {
  const [cuts, setCuts] = useState(20);
  return (
    <section
      id="webtoon-scope"
      className="webtoon-scope"
      aria-labelledby="webtoon-scope-title"
    >
      <div className="review-container">
        <span className="review-eyebrow">웹툰 분량 가이드</span>
        <h2 id="webtoon-scope-title">1컷부터 1회분까지, 이렇게 셉니다</h2>
        <p className="scope-intro">
          이 서비스의 컷 수는 《1억의 구단주》의 이미지 단위로 셉니다. 여러
          장면이 담겨 있어도 완성된 이미지 1장이 1컷입니다.
        </p>
        <div className="scope-layout">
          <figure className="one-cut-sample">
            <div>
              <Image
                src="/images/guide/webtoon-svc-webtoon-cut01.webp"
                width={800}
                height={1200}
                sizes="(max-width: 620px) 70vw, 300px"
                alt="여러 장면이 담긴 1억의 구단주 이미지 한 장 전체가 1컷"
              />
            </div>
            <figcaption>
              <strong>이 이미지 전체가 1컷</strong>
              <span>안쪽 장면을 따로 나누어 계산하지 않습니다.</span>
            </figcaption>
          </figure>
          <div className="episode-comparison">
            <h3>1회분 구성을 비교해보세요</h3>
            <div
              className="scope-choices"
              role="group"
              aria-label="회차 구성 예시 컷 수"
            >
              {[10, 20, 30].map((count) => (
                <button
                  key={count}
                  type="button"
                  aria-pressed={cuts === count}
                  onClick={() => setCuts(count)}
                >
                  {count}컷
                </button>
              ))}
            </div>
            <p className="episode-total" aria-live="polite">
              <strong>{cuts}컷</strong>
              <span>· 이미지 {cuts}장으로 구성한 1회분 예시</span>
            </p>
            <ol className="episode-cut-grid" aria-label={`${cuts}컷 구성도`}>
              {Array.from({ length: cuts }, (_, i) => (
                <li key={i}>
                  <span>{i + 1}</span>
                  <small>이미지 1장</small>
                </li>
              ))}
            </ol>
            <p className="scope-note">
              1컷은 위 예시와 같은 완성 이미지 1장입니다. 수량은 분량
              비교용이며, 실제 1회분의 컷 수·회차 수·수정 범위는 기획과 견적에서
              함께 정합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
