import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";

export function BrandShortsProof() {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 150], [1, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 22], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#080d17",
        color: "#f8fafc",
        fontFamily: "Segoe UI, Malgun Gothic, Arial, sans-serif",
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile("portfolio/video-content-samples/brand-shorts.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
          filter: "saturate(1.05) contrast(1.04)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(5,10,18,0.72) 0%, rgba(5,10,18,0.22) 54%, rgba(5,10,18,0.6) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 76 + titleY,
          width: 520,
          opacity: titleOpacity,
        }}
      >
        <div style={{ color: "#67e8f9", fontSize: 22, fontWeight: 900, marginBottom: 16 }}>
          SHORT-FORM CONTENT
        </div>
        <div style={{ fontSize: 54, lineHeight: 1.06, fontWeight: 950, wordBreak: "keep-all" }}>
          첫 3초에 메시지가 보이는 브랜드 숏폼
        </div>
        <div style={{ marginTop: 24, fontSize: 24, lineHeight: 1.45, color: "#dbeafe", wordBreak: "keep-all" }}>
          인트로, 자막 흐름, 장면 전환, CTA까지 짧은 영상 안에서 바로 읽히도록 구성했습니다.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 58,
          bottom: 48,
          display: "flex",
          gap: 12,
          fontSize: 18,
          fontWeight: 800,
          color: "#e0f2fe",
        }}
      >
        <span>브랜드 홍보</span>
        <span>·</span>
        <span>숏폼 구성</span>
        <span>·</span>
        <span>자막/CTA</span>
      </div>
    </AbsoluteFill>
  );
}
