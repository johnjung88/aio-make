"use client";
import { useRef, useState } from "react";
import Image from "next/image";
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
        <h2 id="webtoon-scope-title">웹툰 1회분은 24컷으로 제작합니다</h2>
        <p className="scope-intro">
          완성 이미지 1장이 1컷이며 24장의 이미지로 한 회를 구성합니다
        </p>
        <div className="scope-layout">
          <figure className="one-cut-sample">
            <button
              className="one-cut-image"
              onClick={() => show(1)}
              aria-label="1컷 예시 크게 보기"
            >
              <Image
                src={source(1)}
                width={800}
                height={1200}
                sizes="(max-width: 900px) 90vw, 620px"
                alt="1억의 구단주 완성 이미지 1컷"
              />
            </button>
            <figcaption>
              <strong>이 이미지 전체가 1컷</strong>
              <span>이미지 안의 장면을 따로 나누어 세지 않습니다</span>
            </figcaption>
          </figure>
          <div className="episode-comparison">
            <h3>1회분 · 24컷</h3>
            <p className="episode-intro">《1억의 구단주》로 살펴보는 구성</p>
            <ol className="episode-cut-grid" aria-label="24컷 구성">
              {Array.from({ length: 24 }, (_, i) => (
                <li key={i}>
                  <button
                    onClick={() => show(i + 1)}
                    aria-label={`${i + 1}컷 크게 보기`}
                  >
                    <Image
                      src={source(i + 1)}
                      width={160}
                      height={240}
                      sizes="(max-width: 900px) 28vw, 110px"
                      alt={`1억의 구단주 샘플 ${i + 1}컷`}
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
            alt={`1억의 구단주 샘플 ${selected}컷 확대`}
          />
        </dialog>
      </div>
    </section>
  );
}
