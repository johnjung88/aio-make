"use client";

interface Step {
  step: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
}

interface Props {
  steps: Step[];
  accentColor: string;
  isKo: boolean;
}

export function ProcessSteps({ steps, accentColor, isKo }: Props) {
  return (
    <section className="bg-[#F9FAFB]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-16 md:py-24">
        <div className="text-center mb-12">
          <p
            className="text-[11px] font-semibold tracking-[0.22em] uppercase mb-3"
            style={{ color: accentColor, fontFamily: "var(--font-jetbrains)" }}
          >
            Process
          </p>
          <h2 className="font-bold text-[#111]" style={{ fontSize: "clamp(24px,3.5vw,38px)" }}>
            {isKo ? "제작 프로세스" : "How We Work"}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="text-center">
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-[13px] font-bold mb-4"
                style={{ background: accentColor }}
              >
                {s.step}
              </div>
              <h3 className="text-[14px] font-bold text-[#111] mb-2">
                {isKo ? s.title.ko : s.title.en}
              </h3>
              <p className="text-[12px] text-[#6B7280] leading-[1.7]">
                {isKo ? s.description.ko : s.description.en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
