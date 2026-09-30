"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section">
      <h2>화면을 불러오지 못했습니다.</h2>
      <p>잠시 뒤 다시 시도해주세요.</p>
      <button className="button" onClick={reset}>
        다시 시도
      </button>
    </div>
  );
}
