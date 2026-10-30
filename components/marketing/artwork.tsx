import Image from "next/image";
import { CampaignScene, SearchScene } from "./result-scenes";

function Photo({
  file,
  alt,
  priority = false,
}: {
  file: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/marketing-renewal/${file}.webp`}
      alt={alt}
      width={900}
      height={1100}
      sizes="(max-width:767px) 90vw, 50vw"
      priority={priority}
    />
  );
}

function Publication({
  file,
  title,
  channel,
  priority = false,
}: {
  file: string;
  title: string;
  channel: string;
  priority?: boolean;
}) {
  return (
    <div className="mk-publication">
      <div className="mk-publication-label">{channel}</div>
      <Photo file={file} alt={title} priority={priority} />
      <div className="mk-publication-copy">
        <strong>{title}</strong>
        <span>가상 브랜드 · 제작 방향 예시</span>
      </div>
    </div>
  );
}

const documents = {
  plan: {
    eyebrow: "MONTHLY PLAN",
    title: "이번 달, 고객에게 전할 이야기",
    rows: [
      ["주제", "채널", "확인할 내용"],
      ["브랜드 소개", "인스타그램", "사진과 소개 문구"],
      ["제품 이야기", "블로그", "재료와 사용 방법"],
      ["자주 묻는 질문", "쇼츠", "장면과 안내 문구"],
    ],
    foot: "자료 확인 → 월간 계획 → 제작과 게시",
  },
  report: {
    eyebrow: "MONTHLY REPORT",
    title: "운영 내역과 다음 계획",
    rows: [
      ["주제", "게시 내역", "다음 계획"],
      ["브랜드 소개", "채널별 링크 정리", "소개 문구 보완"],
      ["사용 안내", "게시물 목록 확인", "다음 질문 선정"],
      ["고객 질문", "확인 가능한 반응", "답변 자료 준비"],
    ],
    foot: "게시 내역 · 확인한 반응 · 다음 달 방향",
  },
  search: {
    eyebrow: "SEARCH & ANSWER",
    title: "고객의 질문에 바로 답하는 페이지",
    rows: [
      ["질문", "페이지에 담을 정보"],
      ["어떤 서비스인가요?", "대상과 제공 범위"],
      ["어떻게 시작하나요?", "준비 자료와 진행 과정"],
      ["어디로 문의하나요?", "상담 경로와 연락 방법"],
    ],
    foot: "검색 결과와 답변을 위한 정보 구성 예시",
  },
  audit: {
    eyebrow: "SITE REVIEW",
    title: "읽을 수 있는 정보부터 점검합니다",
    rows: [
      ["점검 항목", "확인할 내용"],
      ["검색 접근성", "페이지 제목과 설명"],
      ["정보 구조", "소제목과 답변 문단"],
      ["사실 정보", "서비스 범위와 연락처"],
    ],
    foot: "진단 항목과 적용 범위를 함께 정리합니다",
  },
  page: {
    eyebrow: "PAGE STRUCTURE",
    title: "서비스 소개에서 상담까지",
    rows: [
      ["페이지 구성", "전할 내용"],
      ["서비스 소개", "누구에게 필요한가요?"],
      ["제공 범위", "어떤 결과물을 받나요?"],
      ["진행 안내", "무엇을 준비하면 되나요?"],
      ["상담", "어떻게 문의하나요?"],
    ],
    foot: "질문형 소제목 + 바로 답하는 문단",
  },
  handoff: {
    eyebrow: "HANDOFF GUIDE",
    title: "운영자가 유지할 설정",
    rows: [
      ["유지할 정보", "수정할 때 확인"],
      ["페이지 제목", "서비스와 주제가 드러나게"],
      ["설명 문단", "확인된 정보로 작성"],
      ["연락처", "실제 상담 경로 확인"],
    ],
    foot: "변경한 항목과 유지 방법을 인계합니다",
  },
  persona: {
    eyebrow: "MONTHLY CONTENT",
    title: "같은 인물로 이어가는 브랜드 이야기",
    rows: [
      ["주제", "채널", "구성"],
      ["제품 소개", "인스타그램", "확인된 제품 정보"],
      ["사용 안내", "쇼츠", "순서와 사용 장면"],
      ["고객 질문", "인스타그램", "질문에 맞춘 설명"],
      ["제품 구성", "쇼츠", "구성과 이용 안내"],
      ["다음 이야기", "인스타그램", "이어갈 주제 안내"],
    ],
    foot: "AI 가상인물 · 월간 게시 구성 예시",
  },
};

function Document({ kind }: { kind: keyof typeof documents }) {
  const doc = documents[kind];
  return (
    <div className={`mk-output-document mk-output-document-${kind}`}>
      <span className="mk-output-kicker">{doc.eyebrow}</span>
      <strong className="mk-output-title">{doc.title}</strong>
      <div className="mk-output-rows">
        {doc.rows.map((row, i) => (
          <div
            key={row[0]}
            className={i === 0 ? "mk-output-row-head" : ""}
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
            }}
          >
            {row.map((cell) => (
              <span key={cell}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
      <span className="mk-output-foot">{doc.foot}</span>
    </div>
  );
}

function Feed({ compact = false }: { compact?: boolean }) {
  const photos = compact ? [3, 4, 5] : [0, 1, 2, 3, 4, 5, 6, 7, 8];
  return (
    <div
      className={`mk-output-feed${compact ? " mk-output-feed-compact" : ""}`}
    >
      <div className="mk-publication-label">CAFE LEAF · FEED</div>
      <div>
        {photos.map((n) => (
          <Photo
            key={n}
            file={`feed-${n}`}
            alt={
              [
                "아이스 커피",
                "라떼 만드는 장면",
                "크루아상",
                "카페 입구",
                "말차",
                "원두",
                "과일 페이스트리",
                "카페 좌석",
                "테이크아웃 컵",
              ][n]
            }
          />
        ))}
      </div>
    </div>
  );
}

/** Result surfaces fill their frame; photos keep their own ratio and document text stays native. */
export function MarketingArtwork({
  name,
  alt,
  hero = false,
  stage = 0,
}: {
  name: string;
  alt: string;
  hero?: boolean;
  stage?: number;
}) {
  let content: React.ReactNode;
  if (name === "home-ribbon") {
    content = (
      <div className="mk-output-ribbon" data-active={stage}>
        <Publication
          file="material-0"
          title="오늘의 메뉴를 만나는 순간"
          channel="INSTAGRAM"
          priority
        />
        <Publication
          file="preview-3-1"
          title="재료와 구성을 자세히 읽고"
          channel="BLOG"
        />
        <SearchScene variant="answer" />
      </div>
    );
  } else if (name === "home-touchpoints") {
    content = (
      <div className="mk-output-flow">
        <Publication
          file="f3a2-source-studio"
          title="원본 · 수업 공간"
          channel="SOURCE"
        />
        <div className="mk-output-channels">
          {["INSTAGRAM", "BLOG", "SHORTS"].map((channel, i) => (
            <Publication
              key={channel}
              file={`f3a2-${["channel-class", "channel-prep", "channel-motion"][i]}`}
              title={
                [
                  "수업 장면을 먼저 보여주고",
                  "수업 준비를 설명하고",
                  "이용 장면을 짧게 전합니다",
                ][i]
              }
              channel={channel}
            />
          ))}
        </div>
      </div>
    );
  } else if (name === "sns-card") {
    content = <Feed compact />;
  } else if (name === "sns-hero") {
    content = (
      <Publication
        file="material-3"
        title="오늘의 식탁을 소개합니다"
        channel="SNS · 제작 방향 예시"
        priority={hero}
      />
    );
  } else if (name === "sns-result-1") {
    content = <Feed />;
  } else if (name === "sns-result-2") {
    content = (
      <Publication
        file="material-1"
        title="제품을 쓰기 전에 궁금한 것들"
        channel="BLOG"
      />
    );
  } else if (name === "sns-result-3") {
    content = (
      <Publication
        file="preview-2-2"
        title="수업 공간을 짧게 둘러보세요"
        channel="SHORTS"
      />
    );
  } else if (name === "integrated-hero") {
    content = (
      <Publication
        file="f3a2-source-studio"
        title="수업 공간에서 시작하는 브랜드 이야기"
        channel="BRAND CONTENT · 월간 운영 예시"
        priority={hero}
      />
    );
  } else if (name === "integrated-result-2") {
    content = (
      <Publication
        file="f3a2-food-serve"
        title="오늘의 식탁에 담은 제철 재료"
        channel="BLOG · 채널별 형식 예시"
      />
    );
  } else if (name.startsWith("integrated-")) {
    content = (
      <CampaignScene
        report={name.endsWith("3")}
        compact={name.endsWith("card")}
      />
    );
  } else if (name === "ai-influencer-card") {
    content = (
      <Publication
        file="persona-2"
        title="브랜드를 전하는 한 사람"
        channel="AI 가상인물"
      />
    );
  } else if (name === "ai-influencer-hero") {
    content = (
      <Publication
        file="persona-role-2"
        title="한 인물로 이어지는 브랜드 이야기"
        channel="AI 가상인물 · 제작 방향 예시"
        priority={hero}
      />
    );
  } else if (name === "ai-influencer-result-1") {
    content = (
      <div className="mk-output-personas">
        {[0, 1, 2].map((n) => (
          <Photo
            key={n}
            file={`persona-${n}`}
            alt={
              [
                "가상인물 얼굴 기준",
                "가상인물 전신 기준",
                "가상인물 측면 기준",
              ][n]
            }
          />
        ))}
      </div>
    );
  } else if (name === "ai-influencer-result-2") {
    content = (
      <div className="mk-output-storyboard">
        <Photo
          file="persona-role-1"
          alt="가상인물이 제품을 소개하는 장면 예시"
        />
        <ol aria-label="30초 컨텐츠의 네 장면 구성 예시">
          {["제품 소개", "사용 순서", "확인할 정보", "다음 행동 안내"].map(
            (scene, i) => (
              <li key={scene}>
                <span>0{i + 1}</span>
                {scene}
              </li>
            ),
          )}
        </ol>
      </div>
    );
  } else if (name === "ai-influencer-result-3") {
    content = <Document kind="persona" />;
  } else if (name === "seo-result-3") {
    content = <Document kind="handoff" />;
  } else if (name === "seo-hero") {
    content = (
      <div className="mk-seo-hero-result">
        <Photo
          file="f3a2-process-brief"
          alt="가상 브랜드의 메뉴와 소개 자료를 정리하는 장면"
          priority={hero}
        />
        <SearchScene variant="answer" />
      </div>
    );
  } else if (name === "seo-card") {
    content = (
      <Publication
        file="f3a2-process-plan"
        title="고객의 질문을 페이지로"
        channel="SEARCH & ANSWER"
      />
    );
  } else if (name.startsWith("seo-")) {
    content = (
      <SearchScene
        compact={name.endsWith("card")}
        variant={
          name.endsWith("2")
            ? "site"
            : name.endsWith("3") || name.endsWith("hero")
              ? "answer"
              : "search"
        }
      />
    );
  } else {
    return null;
  }
  return (
    <div
      className={`mk-artwork mk-artwork-${name}${hero ? " mk-artwork-hero" : ""}`}
      role="group"
      aria-label={alt}
    >
      {content}
    </div>
  );
}
