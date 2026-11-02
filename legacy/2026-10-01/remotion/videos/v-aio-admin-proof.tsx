import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

const asset = (name: string) => staticFile(`portfolio/v-aio-admin/${name}`);
const bg = "linear-gradient(135deg, #07111f 0%, #10213a 52%, #111827 100%)";

function fade(frame: number, duration: number) {
  return interpolate(frame, [0, 5, duration - 5, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function rise(frame: number, delay = 0, distance = 18) {
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
  side = "left",
  contain = false,
}: {
  image: string;
  kicker: string;
  title: string;
  body: string;
  duration: number;
  side?: "left" | "right";
  contain?: boolean;
}) {
  const frame = useCurrentFrame();
  const opacity = fade(frame, duration);
  const imageX = side === "left" ? 42 : 514;
  const textX = side === "left" ? 810 : 58;

  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity }}>
      <div
        style={{
          position: "absolute",
          left: imageX,
          top: 46 + rise(frame, 0, 12),
          width: 728,
          height: 628,
          borderRadius: 20,
          overflow: "hidden",
          background: "#f8fafc",
          border: "1px solid rgba(220,235,255,0.2)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.4)",
        }}
      >
        <Img src={asset(image)} style={{ width: "100%", height: "100%", objectFit: contain ? "contain" : "cover" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: textX,
          top: 82 + rise(frame, 4, 18),
          width: 390,
          height: 556,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "#7dd3fc", fontSize: 21, fontWeight: 900, marginBottom: 18 }}>{kicker}</div>
        <div style={{ fontSize: 45, lineHeight: 1.1, fontWeight: 950, wordBreak: "keep-all" }}>{title}</div>
        <div style={{ color: "#cbd7ea", fontSize: 23, lineHeight: 1.46, marginTop: 24, wordBreak: "keep-all" }}>{body}</div>
      </div>
    </AbsoluteFill>
  );
}

function Intro() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity: fade(frame, 86) }}>
      <Img src={asset("admin-module-map.svg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
      <div style={{ position: "absolute", left: 72, top: 96, width: 900 }}>
        <div style={{ color: "#7dd3fc", fontSize: 24, fontWeight: 900, marginBottom: 24 }}>V-AIO ADMIN AUTOMATION</div>
        <div style={{ fontSize: 74, lineHeight: 1.02, fontWeight: 950, wordBreak: "keep-all" }}>
          비자 상담 운영을
          <br />
          관리자 화면으로 통합
        </div>
        <div style={{ marginTop: 32, width: 780, color: "#d8e4f5", fontSize: 29, lineHeight: 1.36, wordBreak: "keep-all" }}>
          상담, 챗봇, 비자 로직, API, DB, 카테고리별 관리 흐름을 한 포트폴리오 영상으로 정리했습니다.
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, bottom: 58, color: "#9fb3cb", fontSize: 20 }}>개인정보는 블럭 마스킹 처리</div>
    </AbsoluteFill>
  );
}

function CategoryScene() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, opacity: fade(frame, 122) }}>
      <Img src={asset("admin-module-map.svg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
}

function ApiDbScene() {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: bg, opacity: fade(frame, 122) }}>
      <Img src={asset("logic-api-db.svg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  );
}

function Closing() {
  const frame = useCurrentFrame();
  const items = [
    "관리자: 상담 문의, 기업 진단, 비자 신청, 서류 상태 통합",
    "챗봇: E-7/E-9 질문 분기와 요건 안내",
    "로직/API: OpenAI, Supabase, n8n 흐름으로 업무 자동화",
    "보안: 실명, 연락처, 이메일은 포트폴리오에서 블럭 처리",
  ];

  return (
    <AbsoluteFill style={{ background: bg, color: "#eef5ff", fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif", opacity: fade(frame, 116) }}>
      <div style={{ position: "absolute", left: 76, top: 74 }}>
        <div style={{ color: "#7dd3fc", fontSize: 24, fontWeight: 900, marginBottom: 20 }}>PORTFOLIO POINT</div>
        <div style={{ fontSize: 58, lineHeight: 1.1, fontWeight: 950, wordBreak: "keep-all", width: 820 }}>
          비자 상담 자동화의 운영 화면을 보여주는 증거 자료
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 262, width: 780, display: "grid", gap: 14 }}>
        {items.map((item) => (
          <div key={item} style={{ padding: "17px 20px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.13)", fontSize: 24, color: "#d9e6f7", wordBreak: "keep-all" }}>
            {item}
          </div>
        ))}
      </div>
      <Img src={asset("dashboard.png")} style={{ position: "absolute", right: 62, top: 132, width: 336, height: 456, objectFit: "cover", borderRadius: 16, border: "1px solid rgba(220,235,255,0.18)", boxShadow: "0 30px 90px rgba(0,0,0,0.42)" }} />
    </AbsoluteFill>
  );
}

export function VAioAdminProof() {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={86}>
        <Intro />
      </Sequence>
      <Sequence from={78} durationInFrames={100}>
        <Stage
          image="dashboard.png"
          kicker="01 관리자 대시보드"
          title="운영 상태를 먼저 파악합니다"
          body="E-7/E-9 신청, 상담 문의, 기업과 근로자 상태를 대시보드에서 숫자와 단계로 확인합니다."
          duration={100}
          contain
        />
      </Sequence>
      <Sequence from={170} durationInFrames={122}>
        <CategoryScene />
      </Sequence>
      <Sequence from={284} durationInFrames={104}>
        <Stage
          image="chatbot.png"
          kicker="02 VisaBot 챗봇"
          title="상담 질문을 비자 유형별로 분기"
          body="챗봇은 E-7/E-9 유형 선택, 요건 요약, 관련 질문 추천으로 반복 상담을 줄이는 역할을 합니다."
          duration={104}
          side="right"
          contain
        />
      </Sequence>
      <Sequence from={380} durationInFrames={122}>
        <ApiDbScene />
      </Sequence>
      <Sequence from={494} durationInFrames={108}>
        <Stage
          image="masked-db-table.svg"
          kicker="03 DB 관리"
          title="실명 없이 상태값만 보여줍니다"
          body="DB 화면은 이름, 연락처, 이메일을 블럭 처리하고 상담 단계, 비자 타입, 서류 상태만 포트폴리오에 노출합니다."
          duration={108}
          contain
        />
      </Sequence>
      <Sequence from={594} durationInFrames={110}>
        <Stage
          image="admin-module-map.svg"
          kicker="04 카테고리 연동"
          title="관리 메뉴가 업무 흐름과 연결됩니다"
          body="상담 문의에서 기업 진단, 비자 신청, 서류 관리까지 이어지도록 메뉴와 DB 상태를 맞춰 설계했습니다."
          duration={110}
          side="right"
          contain
        />
      </Sequence>
      <Sequence from={696} durationInFrames={116}>
        <Closing />
      </Sequence>
    </AbsoluteFill>
  );
}
