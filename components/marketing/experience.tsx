"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  marketingContact,
  marketingNames,
  marketingCopy,
  monthlySteps,
  seoSteps,
  personaTopics,
  type MarketingId,
} from "@/lib/marketing-renewal";
import { MarketingHead } from "./blocks";

function Choices({
  label,
  items,
  value,
  onChange,
}: {
  label: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="mk-choices">
      <legend>{label}</legend>
      <div
        onKeyDown={(e) => {
          if (
            !["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(e.key)
          )
            return;
          e.preventDefault();
          const direction = ["ArrowRight", "ArrowDown"].includes(e.key)
            ? 1
            : -1;
          const index =
            (items.indexOf(value) + direction + items.length) % items.length;
          onChange(items[index]);
          e.currentTarget.querySelectorAll("button")[index]?.focus();
        }}
      >
        {items.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={value === item}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
export function MarketingFinder({
  onRecommend,
}: {
  onRecommend: (id: MarketingId | "") => void;
}) {
  const [industry, setIndustry] = useState("카페·음식점");
  const situations = [
    "사진과 자료는 있는데 올릴 내용이 없어요",
    "채널이 여러 개라 따로 놀아요",
    "설명해 줄 출연자가 없어요",
    "사이트가 있는데 검색과 AI 답변에서 잘 안 보여요",
  ];
  const [situation, setSituation] = useState(situations[0]);
  const [method, setMethod] = useState("매달 맡기고 싶어요");
  const index = situations.indexOf(situation);
  const id: MarketingId = (
    ["sns", "integrated", "ai-influencer", "seo"] as const
  )[index];
  const once = method === "한 번 제대로 고치고 싶어요";
  const content = index === 2 && once;
  const update = (s: string, m: string) => {
    setSituation(s);
    setMethod(m);
    onRecommend(
      s === situations[2] && m === "한 번 제대로 고치고 싶어요"
        ? ""
        : (["sns", "integrated", "ai-influencer", "seo"] as const)[
            situations.indexOf(s)
          ],
    );
  };
  return (
    <section className="mk-section mk-container" id="finder">
      <MarketingHead
        id="finder-title"
        eyebrow="FIND YOUR FIT"
        title={"지금 가장 막힌 곳을\n골라 보세요"}
        lead="세 가지를 고르면 맞는 운영 방식과 첫 달 흐름을 보여드립니다"
      />
      <div className="mk-interaction">
        <div className="mk-controls">
          <Choices
            label="01 업종"
            items={[
              "카페·음식점",
              "뷰티·헬스",
              "제품·쇼핑몰",
              "병원·교육 등 지역 서비스",
              "B2B·전문 서비스",
            ]}
            value={industry}
            onChange={setIndustry}
          />
          <Choices
            label="02 지금 상황"
            items={situations}
            value={situation}
            onChange={(v) => update(v, method)}
          />
          <Choices
            label="03 맡기는 방식"
            items={["매달 맡기고 싶어요", "한 번 제대로 고치고 싶어요"]}
            value={method}
            onChange={(v) => update(situation, v)}
          />
          <p className="mk-live-note">
            선택한 내용이 아래 결과에 바로 반영됩니다
          </p>
          <button
            className="mk-reset"
            onClick={() => {
              setIndustry("카페·음식점");
              update(situations[0], "매달 맡기고 싶어요");
            }}
          >
            처음으로
          </button>
        </div>
        <div className="mk-result" id="finder-result">
          <p className="mk-caption">
            추천은 선택한 내용에 따른 안내예요 · 상담에서 함께 확인합니다
          </p>
          <p className="mk-eyebrow">YOUR NEXT STEP</p>
          <h3 aria-live="polite">
            {content ? "AI 인플루언서 제작" : marketingNames[id]}
          </h3>
          <p>
            {industry}의{" "}
            {
              [
                "사진과 자료로 꾸준한 게시를 시작합니다",
                "흩어진 채널과 담당 업무를 함께 정리합니다",
                "브랜드를 설명할 인물과 말투를 만듭니다",
                "고객 질문에 답하는 사이트 구조를 정리합니다",
              ][index]
            }
          </p>
          <strong className="mk-price">
            {content ? "10만 원부터" : marketingCopy[id].price}
          </strong>
          <p>
            {content
              ? "캐릭터 1명 세팅 + 이미지 5장 · 게시와 운영 별도"
              : marketingCopy[id].term}
          </p>
          {once && index < 2 && (
            <p>
              {index === 0
                ? "월 갱신이라 한 달만 시작할 수 있어요"
                : "최소 3개월 운영 상품이에요"}
            </p>
          )}
          {index === 3 && !once && <p>구축 이후 월 유지관리 선택</p>}
          <p className="mk-check">
            첫 확인 ·{" "}
            {industry === "카페·음식점"
              ? "메뉴 사진과 매장 정보 확인"
              : `${industry}의 제품·서비스 자료 확인`}
          </p>
          <ol className="mk-mini-flow">
            {(id === "seo" ? seoSteps : monthlySteps).map(([title], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                {title}
              </li>
            ))}
          </ol>
          <Link
            className="mk-primary"
            href={
              content
                ? "/content/services/ai-influencer"
                : `/marketing/services/${id}`
            }
            {...(content
              ? {
                  target: "_blank",
                  rel: "noopener noreferrer",
                  "aria-label":
                    "AI 인플루언서 제작 자세히 보기 · 새 탭에서 열림",
                }
              : {})}
          >
            {content ? "AI 인플루언서 제작" : marketingNames[id]} 자세히 보기{" "}
            {content ? "↗ 새 탭" : "→"}
          </Link>
          <Link
            className="mk-secondary"
            href={marketingContact(
              id,
              "home-finder",
              {
                integrated: "channels",
                sns: "preview",
                "ai-influencer": "persona",
                seo: "checklist",
              }[id],
              `업종: ${industry}\n상황: ${situation}\n방식: ${method}`,
            )}
          >
            이 상황으로 상담하기 ↗
          </Link>
          {once && index === 1 && (
            <Link className="mk-secondary" href="/marketing/services/seo">
              한 번의 개선이 필요하다면 SEO·AEO·GEO →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
const channelNames = [
  "인스타그램",
  "네이버 블로그",
  "쇼츠",
  "스레드",
  "지도 정보",
  "검색 노출용 글",
];
const calendarMaterials = [
  ["f3a2-channel-class", "수업 장면"],
  ["f3a2-channel-prep", "수업 준비"],
  ["f3a2-channel-motion", "동작 안내"],
  ["preview-2-1", "이용 안내"],
];
type ResetProps = { onReset: () => void };
function ResetButton({ onReset }: ResetProps) {
  return (
    <button type="button" className="mk-reset" onClick={onReset}>
      처음으로
    </button>
  );
}
function ChannelPlanner({ onReset }: ResetProps) {
  const [selected, setSelected] = useState(channelNames.slice(0, 5));
  const [counts, setCounts] = useState<Record<string, number>>(
    Object.fromEntries(channelNames.map((c) => [c, 20])),
  );
  const [tile, setTile] = useState(0);
  const [showAllOriginals, setShowAllOriginals] = useState(false);
  const sum = selected.reduce((n, c) => n + counts[c], 0);
  const valid = selected.length === 5;
  const message = `선택 채널: ${selected.map((c) => `${c} ${counts[c]}건`).join(", ")}`;
  return (
    <>
      <div className="mk-controls">
        <fieldset className="mk-choices">
          <legend>01 채널 고르기 · {selected.length}/5개</legend>
          <div>
            {channelNames.map((c) => (
              <button
                key={c}
                aria-pressed={selected.includes(c)}
                onClick={() =>
                  setSelected(
                    selected.includes(c)
                      ? selected.filter((v) => v !== c)
                      : selected.length < 5
                        ? [...selected, c]
                        : selected,
                  )
                }
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset disabled={!valid} className="mk-allocation">
          <legend>02 게시 건수 나누기</legend>
          {selected.map((c) => (
            <label key={c}>
              <span>{c}</span>
              <input
                type="number"
                min={0}
                max={100}
                step={5}
                value={counts[c]}
                aria-label={`${c} 게시 건수`}
                onChange={(event) =>
                  setCounts({
                    ...counts,
                    [c]: Math.max(
                      0,
                      Math.min(
                        100,
                        Math.round(Number(event.target.value) / 5) * 5,
                      ),
                    ),
                  })
                }
              />
            </label>
          ))}
          <button
            onClick={() =>
              setCounts(Object.fromEntries(channelNames.map((c) => [c, 20])))
            }
          >
            고르게 나누기
          </button>
        </fieldset>
        <div className="mk-controls-footer">
          <p className="mk-live-note">
            선택한 내용이 아래 결과에 바로 반영됩니다
          </p>
          <ResetButton onReset={onReset} />
        </div>
      </div>
      <div className="mk-result" id="signature-result">
        <p className="mk-caption">편성 예시 · 실제 수량·형식은 협의합니다</p>
        <h3>한 달 게시 캘린더</h3>
        <p aria-live="polite">
          원본 20개 · 게시 {sum}건 · 채널 {selected.length}개
          {sum !== 100 &&
            ` · ${sum < 100 ? `${100 - sum}건 부족` : `${sum - 100}건 초과`}`}
        </p>
        <div className="mk-total" data-valid={sum === 100 && valid}>
          <span style={{ width: `${Math.min(sum, 100)}%` }} />
        </div>
        <div className="mk-calendar">
          {Array.from({ length: 4 }, (_, week) => (
            <div key={week}>
              <strong>{week + 1}주</strong>
              <Image
                className="mk-week-material"
                src={`/marketing-renewal/${calendarMaterials[week][0]}.webp`}
                width={400}
                height={240}
                sizes="(max-width:767px) 80vw, 25vw"
                alt={`${week + 1}주 ${calendarMaterials[week][1]} 게시 소재 예시`}
              />
              <p className="mk-week-topic">{calendarMaterials[week][1]}</p>
              <p className="mk-week-total">
                {selected.length}채널 합산{" "}
                {selected.reduce(
                  (n, c) =>
                    n +
                    Math.floor(counts[c] / 4) +
                    (week < counts[c] % 4 ? 1 : 0),
                  0,
                )}
                건
              </p>
            </div>
          ))}
        </div>
        <p className="mk-channel-summary">{selected.join(" · ")}</p>
        <details className="mk-source-details">
          <summary>03 원본을 눌러 채널별 재구성 보기</summary>
          <div className="mk-originals">
            {Array.from({ length: showAllOriginals ? 20 : 5 }, (_, i) => (
              <button
                key={i}
                aria-pressed={tile === i}
                onClick={() => setTile(i)}
              >
                <span>원본 {i + 1}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="mk-reset"
            aria-expanded={showAllOriginals}
            onClick={() => setShowAllOriginals(!showAllOriginals)}
          >
            {showAllOriginals ? "접기" : "원본 20개 모두 보기"}
          </button>
          <p aria-live="polite">
            원본 {tile + 1} →{" "}
            {selected
              .filter((c) => counts[c] >= 20 || tile < counts[c])
              .join(" · ") || "배치된 채널 없음"}
          </p>
        </details>
        <SignatureContact
          id="integrated"
          plan="channels"
          message={message}
          disabled={!valid || sum !== 100}
        />
      </div>
    </>
  );
}
const materials = [
  "카페 신메뉴",
  "스킨케어 제품",
  "필라테스 수업 공간",
  "반찬 세트",
];
function SnsPreview({ onReset }: ResetProps) {
  const [material, setMaterial] = useState(materials[0]);
  const [name, setName] = useState("");
  const [point, setPoint] = useState("");
  const [question, setQuestion] = useState("뭐가 달라요?");
  const index = materials.indexOf(material);
  const defaultNames = [
    "귀리 라떼",
    "데일리 세럼",
    "오후 필라테스",
    "오늘의 반찬",
  ];
  const defaultPoints = [
    "우유 대신 귀리로 만들어요",
    "제품 정보를 확인하고 사용해요",
    "수업 공간을 먼저 둘러보세요",
    "식탁에 바로 꺼내 놓으세요",
  ];
  const title = name || defaultNames[index];
  const detail = point || defaultPoints[index];
  const how =
    index === 0 || index === 3
      ? "어떻게 먹어요?"
      : index === 2
        ? "어떻게 이용해요?"
        : "어떻게 써요?";
  return (
    <>
      <div className="mk-controls">
        <Choices
          label="01 예시 소재"
          items={materials}
          value={material}
          onChange={(v) => {
            setMaterial(v);
            setQuestion("뭐가 달라요?");
          }}
        />
        <div className="mk-sns-fields">
          <label>
            02 이름
            <input
              maxLength={16}
              value={name}
              placeholder={defaultNames[index]}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            알리고 싶은 한 가지
            <input
              maxLength={30}
              value={point}
              placeholder={defaultPoints[index]}
              onChange={(e) => setPoint(e.target.value)}
            />
          </label>
        </div>
        <Choices
          label="03 고객 질문"
          items={[how, "뭐가 달라요?", "언제 좋아요?"]}
          value={question}
          onChange={setQuestion}
        />
        <p className="mk-live-note">
          선택한 내용이 아래 결과에 바로 반영됩니다
        </p>
        <ResetButton onReset={onReset} />
      </div>
      <div className="mk-result" id="signature-result">
        <p className="mk-caption">
          형식 예시예요 · 실제 문구와 디자인은 자료를 보고 함께 정합니다
        </p>
        <p className="mk-sr" aria-live="polite">
          {material} 소재로 {title}의 세 채널 미리보기
        </p>
        <div className="mk-phones">
          {["인스타그램", "네이버 블로그", "쇼츠"].map((channel, i) => (
            <article className={`mk-phone mk-phone-${i}`} key={channel}>
              <header>{channel}</header>
              <Image
                src={
                  index === 0
                    ? `/marketing-renewal/f3a2-${["sns-pour", "sns-beans", "sns-takeaway"][i]}.webp`
                    : `/marketing-renewal/${index === 1 ? ["preview-1-0", "f3a2-skin-texture", "f3a2-skin-routine"][i] : index === 2 ? ["preview-2-0", "f3a2-channel-prep", "f3a2-channel-motion"][i] : ["preview-3-0", "f3a2-food-prep", "f3a2-food-serve"][i]}.webp`
                }
                width={400}
                height={500}
                alt={material}
              />
              <div>
                <small>
                  {i === 1 ? "고객 질문에 답합니다" : "제작 방향 예시"}
                </small>
                <h4>
                  {
                    [
                      `${title} 한눈에 보기`,
                      `${title}, ${question}`,
                      `${title}, 짧게 만나요`,
                    ][i]
                  }
                </h4>
                <p>
                  {
                    [
                      detail,
                      `${detail}\n궁금한 점을 자세히 풀어드립니다`,
                      `질문 · ${question}\n장면 · ${detail}`,
                    ][i]
                  }
                </p>
                <p className="mk-channel-purpose">
                  {
                    [
                      "사진과 짧은 소개로 메뉴를 알립니다",
                      "확인한 자료로 궁금한 내용을 안내합니다",
                      "소재 소개에서 매장·구매 안내로 이어갑니다",
                    ][i]
                  }
                </p>
              </div>
            </article>
          ))}
        </div>
        <p>이렇게 바꾼 결과물이 한 달에 원본 16개만큼 쌓입니다</p>
        <SignatureContact
          id="sns"
          plan="preview"
          message={`소재: ${material}\n이름: ${title}\n알리고 싶은 점: ${detail}\n고객 질문: ${question}`}
        />
      </div>
    </>
  );
}
const roles = [
  "브랜드 안내자",
  "사용법을 알려주는 사람",
  "일상을 보여주는 크리에이터",
];
function PersonaPlanner({ onReset }: ResetProps) {
  const [product, setProduct] = useState("스킨케어");
  const [role, setRole] = useState(roles[0]);
  const [tone, setTone] = useState("친근하게");
  const index = roles.indexOf(role);
  return (
    <>
      <div className="mk-controls">
        <Choices
          label="01 제품 종류"
          items={Object.keys(personaTopics)}
          value={product}
          onChange={setProduct}
        />
        <Choices
          label="02 인물 역할"
          items={roles}
          value={role}
          onChange={setRole}
        />
        <Choices
          label="03 말투"
          items={["차분하게", "친근하게", "밝고 빠르게"]}
          value={tone}
          onChange={setTone}
        />
        <p className="mk-live-note">
          선택한 내용이 아래 결과에 바로 반영됩니다
        </p>
        <ResetButton onReset={onReset} />
      </div>
      <div className="mk-result" id="signature-result">
        <p className="mk-caption">
          편성 예시예요 · 실제 주제는 확인된 제품 정보로 함께 정합니다
        </p>
        <p className="mk-sr" aria-live="polite">
          {product} · {role} · {tone} 말투의 한 달 8편 편성
        </p>
        <div className="mk-persona">
          <Image
            src="/marketing-renewal/persona-role-0.webp"
            width={400}
            height={500}
            alt={`AIO 가상 인물 · ${role} 장면`}
          />
          <div>
            <p className="mk-eyebrow">PERSONA CARD</p>
            <h3>{role}</h3>
            <p className="mk-persona-quote">
              {tone === "친근하게"
                ? "오늘은 제가 쓰는 순서대로 보여드릴게요"
                : tone === "차분하게"
                  ? "먼저 제품 정보와 사용 순서를 살펴보겠습니다"
                  : "지금부터 하나씩 함께 살펴봐요"}
            </p>
            <dl className="mk-persona-guide">
              <div>
                <dt>인물 기준 시트</dt>
                <dd>같은 얼굴·헤어 유지</dd>
              </div>
              <div>
                <dt>말투</dt>
                <dd>{tone}</dd>
              </div>
              <div>
                <dt>금지 문구</dt>
                <dd>실제 후기처럼 말하지 않기</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mk-month">
          {Array.from({ length: 4 }, (_, w) => (
            <details key={w} open>
              <summary>{w + 1}주</summary>
              {personaTopics[product][index]
                .slice(w * 2, w * 2 + 2)
                .map((topic, i) => (
                  <div key={topic}>
                    <span>{topic}</span>
                    <small>{i ? "인스타그램" : "쇼츠 9:16"}</small>
                  </div>
                ))}
            </details>
          ))}
        </div>
        <SignatureContact
          id="ai-influencer"
          plan="persona"
          message={`제품 종류: ${product}\n역할: ${role}\n말투: ${tone}`}
        />
      </div>
    </>
  );
}
const pageItems = [
  "페이지 제목과 설명",
  "질문형 소제목과 첫 문장 답",
  "가격·범위 문단",
  "자주 묻는 질문 구조화 데이터",
  "사이트맵·색인 허용",
];
const industryQuestions: Record<string, string[]> = {
  카페: [
    "어떤 음료인가요?",
    "어떤 재료를 쓰나요?",
    "메뉴는 어디서 확인하나요?",
    "매장은 어디에 있나요?",
  ],
  "세무·법률": [
    "비용은 얼마인가요?",
    "누가 받을 수 있나요?",
    "얼마나 걸리나요?",
    "무엇을 준비하나요?",
  ],
  병원: [
    "어떤 진료를 하나요?",
    "예약이 필요한가요?",
    "무엇을 준비하나요?",
    "어디에 있나요?",
  ],
  "B2B 제조": [
    "어떤 규격이 있나요?",
    "어디에 사용하나요?",
    "견적은 어떻게 받나요?",
    "무엇을 준비하나요?",
  ],
  쇼핑몰: [
    "어떤 제품인가요?",
    "배송은 어떻게 되나요?",
    "어떻게 사용하나요?",
    "구성은 무엇인가요?",
  ],
  교육: [
    "누가 수강하나요?",
    "무엇을 배우나요?",
    "수업은 언제 하나요?",
    "무엇을 준비하나요?",
  ],
};
function SeoPreview({ onReset }: ResetProps) {
  const [industry, setIndustry] = useState("카페");
  const [name, setName] = useState("");
  const [region, setRegion] = useState("");
  const [question, setQuestion] = useState(industryQuestions[industry][0]);
  const [enabled, setEnabled] = useState(pageItems);
  const service =
    name ||
    {
      카페: "귀리 라떼",
      "세무·법률": "법인 기장 대행",
      병원: "진료 안내",
      "B2B 제조": "산업 부품",
      쇼핑몰: "제품 안내",
      교육: "수업 안내",
    }[industry];
  const has = (i: number) => enabled.includes(pageItems[i]);
  return (
    <>
      <div className="mk-controls">
        <Choices
          label="01 업종"
          items={Object.keys(industryQuestions)}
          value={industry}
          onChange={(v) => {
            setIndustry(v);
            setQuestion(industryQuestions[v][0]);
          }}
        />
        <label>
          02 서비스 이름
          <input
            maxLength={20}
            placeholder={service}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          지역 · 선택
          <input
            maxLength={10}
            placeholder="지역을 입력하세요"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </label>
        <Choices
          label="03 고객 질문"
          items={industryQuestions[industry]}
          value={question}
          onChange={setQuestion}
        />
        <fieldset className="mk-switches">
          <legend>04 페이지에 넣을 항목</legend>
          <div>
            {pageItems.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={enabled.includes(item)}
                onClick={() =>
                  setEnabled(
                    enabled.includes(item)
                      ? enabled.filter((v) => v !== item)
                      : [...enabled, item],
                  )
                }
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
        <p className="mk-live-note">
          선택한 내용이 아래 결과에 바로 반영됩니다
        </p>
        <ResetButton onReset={onReset} />
      </div>
      <div className="mk-result" id="signature-result">
        <p className="mk-caption">
          표시 방식 예시예요 · 실제 검색 결과와 AI 답변이 아니며 순위나 인용을
          보장하지 않습니다
        </p>
        <div className="mk-search-comparison">
          {["정리 전", "정리 후"].map((v, i) => (
            <article key={v} data-compare={v}>
              <p className="mk-eyebrow">{v}</p>
              <div className="mk-search-card">
                <small>서비스 페이지 · 검색 표시 예시</small>
                <h3>
                  {i === 1 && has(0)
                    ? `${region} ${service} | ${question}`
                    : "홈 | 회사소개 | 서비스"}
                </h3>
                <p>
                  {i === 1 && has(0)
                    ? industry === "카페"
                      ? `${service}의 재료와 메뉴 안내를 확인하세요`
                      : `${service}의 대상과 제공 범위, 상담에 필요한 자료를 확인하세요`
                    : "회사소개 · 서비스 · 문의 · 찾아오시는 길"}
                </p>
              </div>
              <div className="mk-answer-card">
                <strong>질문에 대한 답변 예시</strong>
                <p>
                  {i === 1 && has(1)
                    ? industry === "카페"
                      ? `${question}\n${service}의 재료와 매장 정보를 메뉴 페이지에서 안내합니다`
                      : `${question}\n${service}의 조건과 절차를 서비스 페이지에서 안내합니다`
                    : "이 사이트에서 확인할 수 있는 정보가 적습니다"}
                </p>
                {i === 1 && has(2) && (
                  <p>
                    {industry === "카페"
                      ? "메뉴 가격과 선택 가능한 구성은 메뉴 안내에서 확인하세요"
                      : "비용은 제공 범위와 준비 자료를 확인한 뒤 정합니다"}
                  </p>
                )}
                {i === 1 && has(1) && (
                  <small>
                    참고한 곳: {service}{" "}
                    {industry === "카페" ? "메뉴" : "서비스"} 페이지
                    {has(2) ? " · 가격 문단" : ""}
                  </small>
                )}
              </div>
            </article>
          ))}
        </div>
        <p aria-live="polite">
          적용 항목 {enabled.length}개 ·{" "}
          {has(3) ? "FAQ 구조화 데이터 포함" : "FAQ 구조화 데이터 미포함"} ·{" "}
          {has(4) ? "사이트맵·색인 허용 점검" : "색인 설정 점검 제외"}
        </p>
        <ul className="mk-applied-items" aria-label="적용 항목">
          {enabled.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <SignatureContact
          id="seo"
          plan="checklist"
          message={`업종: ${industry}\n서비스: ${service}\n지역: ${region}\n질문: ${question}\n관심 항목: ${enabled.join(", ")}`}
        />
      </div>
    </>
  );
}
function SignatureContact({
  id,
  plan,
  message,
  disabled,
}: {
  id: MarketingId;
  plan: string;
  message: string;
  disabled?: boolean;
}) {
  return disabled ? (
    <p className="mk-check">
      5개 채널과 합계 100건을 맞추면 상담으로 이어집니다
    </p>
  ) : (
    <Link
      className="mk-primary"
      href={marketingContact(id, "signature", plan, message)}
    >
      이 내용으로 상담하기 ↗
    </Link>
  );
}
export function ServiceExperience({ service }: { service: MarketingId }) {
  const [revision, setRevision] = useState(0);
  const reset = () => setRevision((v) => v + 1);
  return (
    <div>
      <div
        key={revision}
        className={`mk-interaction mk-interaction-${service}`}
      >
        {service === "integrated" ? (
          <ChannelPlanner onReset={reset} />
        ) : service === "sns" ? (
          <SnsPreview onReset={reset} />
        ) : service === "ai-influencer" ? (
          <PersonaPlanner onReset={reset} />
        ) : (
          <SeoPreview onReset={reset} />
        )}
      </div>
    </div>
  );
}
