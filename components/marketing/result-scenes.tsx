import Image from "next/image";
import "./result-scenes.css";

/** Fictional customer-facing examples, never analytics or live search evidence. */
export function SearchScene({
  variant = "search",
  compact = false,
}: {
  variant?: "search" | "answer" | "site";
  compact?: boolean;
}) {
  return (
    <div
      className={`mk-search-scene mk-search-scene-${variant}${compact ? " mk-scene-compact" : ""}`}
    >
      <div className="mk-scene-bar">
        <span>LEAF</span>
        <span>가상 브랜드 · 화면 예시</span>
      </div>
      {variant === "site" ? (
        <>
          <Image
            src="/marketing-renewal/feed-7.webp"
            alt="가상 카페 공간 사진"
            width={900}
            height={600}
          />
          <div className="mk-scene-body">
            <span className="mk-scene-tag">CAFE GUIDE</span>
            <strong>
              취향에 맞는 한 잔을
              <br />
              천천히 골라보세요
            </strong>
            <p>메뉴와 재료부터 공간 안내까지</p>
            <div className="mk-scene-links">
              <span>메뉴 소개</span>
              <span>이용 안내</span>
              <span>문의 방법</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mk-scene-body">
          <div className="mk-search-query">
            ⌕ &nbsp; 귀리 라떼는 어떤 음료인가요?
          </div>
          {variant !== "answer" && (
            <div className="mk-scene-tabs">
              <span>전체</span>
              <span>이미지</span>
              <span>질문과 답변</span>
            </div>
          )}
          {variant === "answer" ? (
            <div className="mk-answer-card">
              <span className="mk-scene-tag">답변 구성 예시</span>
              <strong>귀리의 고소함을 담은 라떼</strong>
              <p>
                재료 안내에서 원재료와 알레르기 정보를 확인하고 취향에 맞게
                선택하세요
              </p>
              <div className="mk-answer-source">
                참고 페이지 &nbsp;↗<b>LEAF · 메뉴와 재료 안내</b>
              </div>
            </div>
          ) : (
            <>
              <div className="mk-search-hit">
                <span>LEAF &nbsp; › &nbsp; 메뉴 이야기</span>
                <strong>귀리 라떼 · 재료와 메뉴 안내</strong>
                <p>커피와 귀리가 만나는 고소한 한 잔</p>
                {!compact && (
                  <div className="mk-search-photos">
                    {["sns-pour", "sns-beans", "sns-takeaway"].map((n, i) => (
                      <Image
                        key={n}
                        src={`/marketing-renewal/f3a2-${n}.webp`}
                        alt={["라떼 제조", "라떼 재료", "테이크아웃"][i]}
                        width={240}
                        height={160}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="mk-search-hit mk-search-secondary">
                <span>LEAF &nbsp; › &nbsp; 방문 안내</span>
                <strong>공간과 이용 방법 살펴보기</strong>
                <p>방문 전 궁금한 내용을 모았어요</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export function CampaignScene({
  report = false,
  compact = false,
  hero = false,
}: {
  report?: boolean;
  compact?: boolean;
  hero?: boolean;
}) {
  return (
    <div className={`mk-campaign-scene${compact ? " mk-scene-compact" : ""}`}>
      <div className="mk-scene-bar">
        <span>LEAF JOURNAL</span>
        <span>가상 브랜드 · 제작 방향 예시</span>
      </div>
      <div className="mk-campaign-feature">
        <Image
          src={`/marketing-renewal/${compact ? "f3a2-process-make" : hero ? "feed-7" : report ? "feed-8" : "feed-6"}.webp`}
          alt={
            compact
              ? "제품 촬영을 준비하는 브랜드 게시 소재"
              : hero
                ? "카페 공간 게시 소재"
                : report
                  ? "테이크아웃 게시 소재"
                  : "제철 디저트 게시 소재"
          }
          width={900}
          height={600}
        />
        <div>
          <span className="mk-scene-tag">
            {compact
              ? "BRAND STORIES"
              : report
                ? "CHANNEL REVIEW"
                : "MONTHLY STORIES"}
          </span>
          <strong>
            {compact
              ? "재료에서 시작하는\n브랜드 이야기"
              : report
                ? "전한 이야기에서\n다음 이야기로"
                : "계절을 담아\n하나의 이야기로"}
          </strong>
        </div>
      </div>
      {!compact && (
        <div className="mk-campaign-list">
          {(report
            ? [
                ["게시물 모음", "채널별 완성 소재 확인"],
                ["고객 질문", "답변할 내용을 정리"],
                ["다음 이야기", "메뉴와 공간 안내 보완"],
              ]
            : [
                ["메뉴 소개", "사진 · 인스타그램"],
                ["재료 이야기", "상세 안내 · 블로그"],
                ["만드는 순간", "장면 구성 · 쇼츠"],
              ]
          ).map(([a, b]) => (
            <div key={a}>
              <b>{a}</b>
              <span>{b}</span>
              <span aria-hidden="true">↗</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
