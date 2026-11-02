import { notFound } from "next/navigation";

const tones = ["magazine", "ide", "lifestyle", "consultant"] as const;

export default function TonePreviewPage() {
  // 프로덕션에서는 공개 노출 차단 (개발 미리보기 전용)
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <div>
      {tones.map((tone) => (
        <main
          key={tone}
          data-tone={tone}
          className="bg-background text-foreground p-10 border-b border-border"
        >
          <h1
            className="text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--tone-display)" }}
          >
            Tone: {tone}
          </h1>
          <p
            className="text-muted-foreground mb-2 text-lg"
            style={{ fontFamily: "var(--tone-body)" }}
          >
            본문 미리보기 — Pretendard 한글 body. The quick brown fox.
          </p>
          <p
            className="text-sm mb-6 italic"
            style={{ fontFamily: "var(--tone-serif, var(--tone-body))" }}
          >
            Serif / italic fallback preview
          </p>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-primary text-primary-foreground px-5 py-2 rounded text-sm font-semibold">
              Primary
            </button>
            <button className="bg-secondary text-secondary-foreground px-5 py-2 rounded text-sm font-semibold">
              Secondary
            </button>
            <button className="bg-card text-card-foreground border border-border px-5 py-2 rounded text-sm">
              Card
            </button>
            <span className="bg-muted text-muted-foreground px-5 py-2 rounded text-sm">
              Muted
            </span>
          </div>
          <pre
            className="mt-4 text-xs text-muted-foreground"
            style={{ fontFamily: "var(--tone-mono)" }}
          >
            {`// mono preview\nconst tone = "${tone}";`}
          </pre>
        </main>
      ))}
    </div>
  );
}
