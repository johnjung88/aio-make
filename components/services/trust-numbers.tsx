// components/services/trust-numbers.tsx
"use client";

interface TrustItem {
  value: string;
  label: string;
  sub?: string;
}

interface Props {
  accentColor: string;
  items: TrustItem[];
}

export function TrustNumbers({ accentColor, items }: Props) {
  return (
    <section className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-10 py-10 md:py-14">
        <div
          className="grid text-center"
          style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="px-4"
              style={i < items.length - 1 ? { borderRight: "1px solid #E5E7EB" } : {}}
            >
              <div
                className="font-bold leading-none mb-1"
                style={{
                  fontSize: "clamp(28px,4vw,48px)",
                  color: accentColor,
                  fontFamily: "var(--font-jetbrains)",
                }}
              >
                {item.value}
              </div>
              <div className="text-[13px] font-semibold text-[#111] mb-0.5">{item.label}</div>
              {item.sub && <div className="text-[11px] text-[#9CA3AF]">{item.sub}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
