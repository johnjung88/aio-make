"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { WEBTOON_PAGE_STANDARD } from "@/lib/content-pricing";
export function WebtoonScope() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(1);
  const source = (n: number) =>
    `/webtoon-v11/cut-${String(n).padStart(2, "0")}.webp`;
  function show(n: number) {
    setSelected(n);
    dialog.current?.showModal();
  }
  return (
    <section
      id="webtoon-scope"
      className="webtoon-scope"
      aria-labelledby="webtoon-scope-title"
    >
      <div className="review-container">
        <span className="review-eyebrow">웹툰 제작 기준</span>
        <h2 id="webtoon-scope-title">웹툰은 12P·24P로 제작합니다</h2>
        <p className="scope-intro">
          {`1P는 ${WEBTOON_PAGE_STANDARD.label}인 세로형 ${WEBTOON_PAGE_STANDARD.ratio} 페이지입니다 필요한 분량을 12P·24P 중에서 선택하세요`}
        </p>
        <div className="scope-layout">
          <figure className="one-cut-sample">
            <button
              className="one-cut-image"
              onClick={() => show(1)}
              aria-label="1P 예시 크게 보기"
            >
              <Image
                src={source(1)}
                width={800}
                height={1200}
                sizes="(max-width: 900px) 90vw, 620px"
                alt="1억의 구단주 완성 원고 1P"
              />
            </button>
            <figcaption>
              <strong>이 페이지 전체가 1P</strong>
              <span>
                {
                  "한 페이지 안에 여러 장면을 구성합니다\n아래 예시는 화면용 축소본입니다"
                }
              </span>
            </figcaption>
          </figure>
          <div className="episode-comparison">
            <h3>제작 사례 · 12P 미리보기</h3>
            <p className="episode-intro">《1억의 구단주》로 살펴보는 구성</p>
            <ol className="episode-cut-grid" aria-label="12P 구성">
              {Array.from({ length: 12 }, (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => show(i + 1)}
                    aria-label={`${i + 1}P 크게 보기`}
                  >
                    <Image
                      src={source(i + 1)}
                      width={160}
                      height={240}
                      sizes="(max-width: 900px) 28vw, 110px"
                      alt={`1억의 구단주 샘플 ${i + 1}P`}
                    />
                    <span>{String(i + 1).padStart(2, "0")}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="scope-note">각 이미지를 누르면 크게 볼 수 있습니다</p>
          </div>
        </div>
        <dialog
          ref={dialog}
          className="cut-dialog"
          aria-label={`1억의 구단주 ${selected}P 확대 보기`}
          onClick={(e) => {
            if (e.target === e.currentTarget) dialog.current?.close();
          }}
        >
          <form method="dialog">
            <button aria-label="확대 이미지 닫기">닫기 ×</button>
          </form>
          <Image
            src={source(selected)}
            width={800}
            height={1200}
            sizes="90vw"
            alt={`1억의 구단주 샘플 ${selected}P 확대`}
          />
        </dialog>
      </div>
    </section>
  );
}
