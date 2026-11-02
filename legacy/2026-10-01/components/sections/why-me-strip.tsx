interface Props {
  locale: string;
}

const STATS = [
  {
    value: "₩29,000~",
    labelKo: "업계 최저 시작가",
    labelEn: "Industry-low starting price",
    descKo: "로고·명함부터 웹사이트까지 낮은 진입장벽",
    descEn: "Low barrier to entry across all services",
  },
  {
    value: "1일~",
    labelKo: "최단 납기",
    labelEn: "Fastest delivery",
    descKo: "당일·익일 납품 가능 서비스 다수 보유",
    descEn: "Same-day or next-day delivery available",
  },
  {
    value: "1시간",
    labelKo: "평균 첫 답변",
    labelEn: "Avg. first reply",
    descKo: "영업시간 내 1시간 이내 빠른 소통 보장",
    descEn: "Within 1 hour during business hours",
  },
];

export function WhyMeStrip({ locale }: Props) {
  const lang = locale === "ko" ? "ko" : "en";

  return (
    <section className="border-y border-white/8 bg-[#0d0d0d]">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STATS.map((stat) => (
            <div key={stat.value} className="flex flex-col gap-1 px-4 py-6 sm:px-8 sm:py-8 lg:px-12">
              <span className="text-3xl font-black text-primary sm:text-4xl lg:text-5xl">
                {stat.value}
              </span>
              <span className="text-sm font-semibold text-foreground sm:text-base">
                {lang === "ko" ? stat.labelKo : stat.labelEn}
              </span>
              <span className="text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6">
                {lang === "ko" ? stat.descKo : stat.descEn}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
