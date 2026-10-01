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
          테두리 안의 한 장면이 1컷입니다. 같은 1컷이어도 대사와 연출에 따라
          세로 길이가 달라집니다.
        </p>
        <div className="scope-layout">
          <div className="panel-comparison">
            <figure>
              <div className="webtoon-panel short-panel">
                <Image
                  src="/images/guide/webtoon-svc-webtoon-cut01.webp"
                  width={800}
                  height={1200}
                  sizes="(max-width: 620px) 43vw, 300px"
                  alt="축구단 창단식 장면 한 컷"
                />
              </div>
              <figcaption>
                <strong>짧은 장면도 1컷</strong>
                <span>상황을 한눈에 보여주는 장면</span>
              </figcaption>
            </figure>
            <figure>
              <div className="webtoon-panel tall-panel">
                <Image
                  src="/images/guide/webtoon-svc-webtoon-cut01.webp"
                  width={800}
                  height={1200}
                  sizes="(max-width: 620px) 43vw, 300px"
                  alt="축하 영상과 관객을 보여주는 장면 한 컷"
                />
              </div>
              <figcaption>
                <strong>긴 장면도 1컷</strong>
                <span>대사와 반응을 함께 담는 장면</span>
              </figcaption>
            </figure>
            <p>
              같은 너비로 비교한 가이드 발췌 예시입니다. 이미지 파일 수와 컷
              수는 다릅니다.
            </p>
          </div>
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
              <span>으로 구성한 1회분 예시</span>
            </p>
            <ol className="episode-cut-grid" aria-label={`${cuts}컷 구성도`}>
              {Array.from({ length: cuts }, (_, i) => (
                <li key={i}>
                  <span>{i + 1}</span>
                  <small>컷</small>
                </li>
              ))}
            </ol>
            <p className="scope-note">
              위 수량은 분량 비교용 예시입니다. 정해진 회차 상품이 아니며, 실제
              1회분의 컷 수·회차 수·수정 범위는 기획과 견적에서 함께 정합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
