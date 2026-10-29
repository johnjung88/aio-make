"use client";

import { useState } from "react";
import "./monthly-marketing-board.css";

const steps = [
  "목표와 채널 설정",
  "컨텐츠 기획",
  "발행과 운영",
  "데이터 확인·개선",
];
const weeks = [
  ["첫째 주", "브랜드 이야기", "블로그 초안 준비"],
  ["둘째 주", "제품을 쓰는 장면", "소셜 게시물 검토"],
  ["셋째 주", "자주 묻는 질문", "블로그 발행 예정"],
  ["넷째 주", "계절에 맞는 제안", "소셜 게시물 예약"],
];
const channels = [
  ["블로그", "이야기와 사용법", "초안 검토"],
  ["소셜 채널", "사진과 짧은 글", "발행 준비"],
  ["소식지", "이번 달 이야기 모음", "기획 중"],
];

export function MonthlyMarketingBoard({
  compact = false,
}: {
  compact?: boolean;
}) {
  const [stage, setStage] = useState(0);
  if (compact) {
    return (
      <div
        className="monthly-board monthly-board--compact"
        aria-label="가상 브랜드 달빛정원 월간 운영 보드 화면 구성 예시"
      >
        <div className="monthly-board-heading">
          <strong>월간 운영 보드</strong>
          <span>화면 구성 예시</span>
        </div>
        <p>달빛정원 · 가상 브랜드</p>
        <div className="monthly-board-mini-weeks">
          {weeks.map(([week, title]) => (
            <div key={week}>
              <span>{week}</span>
              <strong>{title}</strong>
            </div>
          ))}
        </div>
        <p className="monthly-board-mini-channels">
          블로그 · 소셜 채널 · 소식지
        </p>
      </div>
    );
  }
  return (
    <div className="monthly-marketing">
      <ol className="monthly-board-steps" aria-label="마케팅 운영 단계">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              aria-pressed={stage === index}
              aria-controls="monthly-board"
              onClick={() => setStage(index)}
            >
              {label}
            </button>
          </li>
        ))}
      </ol>
      <p className="monthly-board-status" role="status">
        {steps[stage]} 영역을 살펴보세요
      </p>
      <div id="monthly-board" className="monthly-board">
        <div className="monthly-board-heading">
          <h3>월간 운영 보드</h3>
          <span>화면 구성 예시</span>
        </div>
        <p className="monthly-board-brand">달빛정원 · 가상 브랜드</p>
        <section
          className="monthly-board-area"
          data-highlight={stage === 0}
          aria-label="목표와 채널"
        >
          <h4>이번 달 방향</h4>
          <p>일상 속 식물 돌봄을 알기 쉽게 전합니다</p>
          <p>블로그 · 소셜 채널 · 소식지</p>
        </section>
        <section
          className="monthly-board-area"
          data-highlight={stage === 1}
          aria-label="게시 일정"
        >
          <h4>주간 게시 일정</h4>
          <div className="monthly-board-weeks">
            {weeks.map(([week, title, state]) => (
              <div key={week}>
                <span>{week}</span>
                <strong>{title}</strong>
                <p>{state}</p>
              </div>
            ))}
          </div>
        </section>
        <section
          className="monthly-board-area"
          data-highlight={stage === 2}
          aria-label="채널별 발행 준비"
        >
          <h4>채널별 발행 준비</h4>
          <div className="monthly-board-channels">
            {channels.map(([name, topic, state]) => (
              <div key={name}>
                <strong>{name}</strong>
                <p>{topic}</p>
                <span>{state}</span>
              </div>
            ))}
          </div>
        </section>
        <section
          className="monthly-board-area"
          data-highlight={stage === 3}
          aria-label="다음 달 계획"
        >
          <h4>다음 달 계획</h4>
          <ul>
            <li>댓글과 문의에서 반복된 질문을 모읍니다</li>
            <li>관심을 보인 주제를 다음 게시물로 이어갑니다</li>
            <li>채널별 반응을 살펴 게시 순서를 조정합니다</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
