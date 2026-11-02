import {
  AbsoluteFill,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const proof = (name: string) => staticFile(`portfolio/blogautopilot-multinational/${name}`);
const demo = (name: string) => proof(`real-demo/${name}`);

const bg = "linear-gradient(135deg, #07111f 0%, #10213a 48%, #101522 100%)";

function fade(frame: number, duration: number) {
  return interpolate(frame, [0, 5, duration - 5, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function enter(frame: number, delay = 0, distance = 22) {
  return interpolate(frame, [delay, delay + 10], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function Stage({
  image,
  kicker,
  title,
  body,
  duration,
  imageSide = "left",
  crop = "cover",
}: {
  image: string;
  kicker: string;
  title: string;
  body: string;
  duration: number;
  imageSide?: "left" | "right";
  crop?: "cover" | "contain";
}) {
  const frame = useCurrentFrame();
  const opacity = fade(frame, duration);
  const imageLift = enter(frame, 0, 14);
  const textLift = enter(frame, 4, 18);
  const imageBox = {
    position: "absolute" as const,
    top: 44 + imageLift,
    left: imageSide === "left" ? 42 : 530,
    width: 708,
    height: 632,
    borderRadius: 18,
    overflow: "hidden",
    border: "1px solid rgba(220,235,255,0.18)",
    boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
    background: "#111827",
  };
  const textBox = {
    position: "absolute" as const,
    top: 70 + textLift,
    left: imageSide === "left" ? 790 : 58,
    width: 410,
    height: 580,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
  };

  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity }}>
      <div style={imageBox}>
        <Img src={image.startsWith("portfolio/") ? staticFile(image) : demo(image)} style={{ width: "100%", height: "100%", objectFit: crop }} />
      </div>
      <div style={textBox}>
        <div style={{ color: "#55d6be", fontSize: 22, fontWeight: 900, marginBottom: 18 }}>{kicker}</div>
        <div style={{ fontSize: 44, lineHeight: 1.12, fontWeight: 930, wordBreak: "keep-all" }}>{title}</div>
        <div style={{ color: "#c9d7eb", fontSize: 23, lineHeight: 1.46, marginTop: 24, wordBreak: "keep-all" }}>{body}</div>
      </div>
    </AbsoluteFill>
  );
}

function Intro() {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 90);
  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity }}>
      <Img src={proof("travel-category-map.svg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.42 }} />
      <div style={{ position: "absolute", left: 72, top: 94, width: 880 }}>
        <div style={{ color: "#55d6be", fontSize: 24, fontWeight: 900, marginBottom: 24 }}>TRAVEL BLOG AUTOPILOT</div>
        <div style={{ fontSize: 74, lineHeight: 1.02, fontWeight: 950, wordBreak: "keep-all" }}>
          여행 소재 확보부터
          <br />
          수익화 발행까지
        </div>
        <div style={{ marginTop: 32, color: "#d6e3f4", fontSize: 30, lineHeight: 1.34, width: 760 }}>
          API와 CSV로 콘텐츠를 모으고, 스케줄·제휴 링크·SEO 프롬프트·브라우저 발행기를 한 흐름으로 연결했습니다.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Matrix() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, opacity: fade(frame, 110) }}>
      <Img src={proof("travel-category-map.svg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
}

function BrowserWrite() {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 190);
  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity }}>
      <div style={{ position: "absolute", left: 38, top: 42, width: 780, height: 636, borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid rgba(220,235,255,0.2)" }}>
        <OffthreadVideo src={demo("browser-write-demo.webm")} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      <div style={{ position: "absolute", right: 58, top: 92, width: 365 }}>
        <div style={{ color: "#55d6be", fontSize: 22, fontWeight: 900, marginBottom: 18 }}>브라우저 발행기</div>
        <div style={{ fontSize: 47, lineHeight: 1.08, fontWeight: 950, wordBreak: "keep-all" }}>글 입력 과정까지 자동화</div>
        <div style={{ color: "#c9d7eb", fontSize: 23, lineHeight: 1.45, marginTop: 24, wordBreak: "keep-all" }}>
          발행기는 브라우저를 열고 제목, 본문, 태그 입력을 순서대로 처리합니다. 최종 발행 클릭은 촬영 안전을 위해 제외했습니다.
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Closing() {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 100);
  const items = [
    "콘텐츠 소스: API + CSV 업로드 + 월별 스케줄",
    "여행 아이템: 국가별 쇼핑 제휴 자동 매칭",
    "축제/이벤트: 투어·숙박 상품 연결",
    "계정별 프롬프트: 동일 주제도 다른 글로 생성",
  ];
  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity }}>
      <div style={{ position: "absolute", left: 80, top: 72 }}>
        <div style={{ color: "#55d6be", fontSize: 24, fontWeight: 900, marginBottom: 20 }}>PORTFOLIO POINT</div>
        <div style={{ fontSize: 58, lineHeight: 1.12, fontWeight: 950, wordBreak: "keep-all", width: 810 }}>
          여행 블로그 운영을 수익화 흐름으로 자동화
        </div>
      </div>
      <div style={{ position: "absolute", left: 82, top: 250, display: "grid", gap: 14, width: 780 }}>
        {items.map((item) => (
          <div key={item} style={{ padding: "17px 20px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", fontSize: 25, color: "#d9e6f7", wordBreak: "keep-all" }}>
            {item}
          </div>
        ))}
      </div>
      <Img src={demo("app-dashboard.png")} style={{ position: "absolute", right: 64, top: 128, width: 326, height: 464, objectFit: "cover", borderRadius: 16, border: "1px solid rgba(220,235,255,0.18)", boxShadow: "0 30px 90px rgba(0,0,0,0.42)" }} />
    </AbsoluteFill>
  );
}

export function BlogAutoPilotProof() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={90}>
        <Intro />
      </Sequence>
      <Sequence from={82} durationInFrames={100}>
        <Stage
          image="app-content-api.png"
          kicker="01 콘텐츠 소스"
          title="여행 소재를 먼저 확보합니다"
          body="축제, 도시, 투어, 일정 데이터를 API와 엑셀 CSV로 등록하고 운영자가 월별 콘텐츠 풀을 관리합니다."
          duration={100}
        />
      </Sequence>
      <Sequence from={174} durationInFrames={96}>
        <Stage
          image="app-content-source.png"
          kicker="02 스케줄 운영"
          title="계정과 국가별로 발행을 나눕니다"
          body="여러 국가와 블로그 계정에 콘텐츠 소스를 배정해 한 화면에서 일정, 상태, 발행 흐름을 확인합니다."
          duration={96}
          imageSide="right"
        />
      </Sequence>
      <Sequence from={262} durationInFrames={110}>
        <Matrix />
      </Sequence>
      <Sequence from={364} durationInFrames={100}>
        <Stage
          image="app-affiliate.png"
          kicker="03 제휴 수익화"
          title="카테고리별 상품을 붙입니다"
          body="여행 아이템은 쇼핑 제휴, 축제는 투어와 숙박, 여행 종합은 교통·유심·보험까지 확장해 매칭합니다."
          duration={100}
        />
      </Sequence>
      <Sequence from={456} durationInFrames={96}>
        <Stage
          image="app-project.png"
          kicker="04 중복 방지"
          title="같은 주제도 다른 글로 만듭니다"
          body="계정별 페르소나와 국가별 프롬프트를 따로 관리해 다수 계정 운영에서 반복 문장을 줄입니다."
          duration={96}
          imageSide="right"
        />
      </Sequence>
      <Sequence from={544} durationInFrames={96}>
        <Stage
          image="app-settings.png"
          kicker="05 SEO 운영"
          title="여행 검색 노출에 맞춰 세팅합니다"
          body="글 구조, 이미지 소스, 모델 설정, API 키를 분리해 여행 전문 블로그에 맞는 작성 규칙을 유지합니다."
          duration={96}
        />
      </Sequence>
      <Sequence from={632} durationInFrames={190}>
        <BrowserWrite />
      </Sequence>
      <Sequence from={812} durationInFrames={108}>
        <Stage
          image="portfolio/blogautopilot-multinational/published-post-ko.png"
          kicker="06 발행 결과"
          title="생성된 글은 운영 이력으로 남습니다"
          body="작성 결과와 발행 링크는 대시보드에 누적되어 어떤 계정에서 어떤 주제가 처리됐는지 추적할 수 있습니다."
          duration={108}
          imageSide="right"
          crop="cover"
        />
      </Sequence>
      <Sequence from={912} durationInFrames={168}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
}
