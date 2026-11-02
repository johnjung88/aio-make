import { useLocale } from "next-intl";

const colorMap: Record<string, string> = {
  web: "bg-[#7c3aed]/15 text-[#a78bfa] border-[#7c3aed]/30",
  app: "bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30",
  design: "bg-[#f43f5e]/15 text-[#fb7185] border-[#f43f5e]/30",
  video: "bg-[#06b6d4]/15 text-[#22d3ee] border-[#06b6d4]/30",
  automation: "bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30",
  website: "bg-[#7c3aed]/15 text-[#a78bfa] border-[#7c3aed]/30",
  "shopping-mall": "bg-[#14b8a6]/15 text-[#2dd4bf] border-[#14b8a6]/30",
  "logo-business-card": "bg-[#f43f5e]/15 text-[#fb7185] border-[#f43f5e]/30",
  "detail-page": "bg-[#fb923c]/15 text-[#fdba74] border-[#fb923c]/30",
  "ppt-design": "bg-[#38bdf8]/15 text-[#7dd3fc] border-[#38bdf8]/30",
  "automation-app": "bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30",
  "video-content": "bg-[#06b6d4]/15 text-[#22d3ee] border-[#06b6d4]/30",
};

const labelMap: Record<string, { ko: string; en: string }> = {
  web: { ko: "웹", en: "Web" },
  app: { ko: "앱", en: "App" },
  design: { ko: "디자인", en: "Design" },
  video: { ko: "영상", en: "Video" },
  automation: { ko: "자동화", en: "Automation" },
  website: { ko: "웹사이트", en: "Website" },
  "shopping-mall": { ko: "쇼핑몰", en: "Store" },
  "logo-business-card": { ko: "로고·명함", en: "Brand" },
  "detail-page": { ko: "상세페이지", en: "Detail" },
  "ppt-design": { ko: "PPT", en: "Deck" },
  "automation-app": { ko: "자동화·앱", en: "Automation" },
  "video-content": { ko: "영상", en: "Video" },
};

interface TypeBadgeProps {
  type: string;
  className?: string;
}

export function TypeBadge({ type, className = "" }: TypeBadgeProps) {
  const locale = useLocale() as "ko" | "en";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${colorMap[type] ?? colorMap.website} ${className}`}
    >
      {(labelMap[type] ?? labelMap.website)[locale]}
    </span>
  );
}
