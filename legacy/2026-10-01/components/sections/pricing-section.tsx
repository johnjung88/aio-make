"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Plan {
  name: "Basic" | "Pro" | "Enterprise";
  price: string;
  desc: string;
  features: string[];
  highlight?: boolean;
}

type ServiceTab = "branding" | "web" | "motion";

const plansByTab: Record<ServiceTab, Plan[]> = {
  branding: [
    {
      name: "Basic",
      price: "₩29,000",
      desc: "입문형 로고·명함",
      features: ["로고 1안", "명함 1안", "수정 1회", "PNG/JPG/PDF"],
    },
    {
      name: "Pro",
      price: "₩49,000",
      desc: "실속형 로고 3안·명함",
      features: ["로고 3안", "최종 1안 선택", "명함 1안", "수정 2회"],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "₩99,000",
      desc: "창업형 브랜드 키트",
      features: ["로고 3안", "명함 1안", "SNS 프로필", "실사 목업 3컷", "미니 가이드"],
    },
  ],
  web: [
    {
      name: "Basic",
      price: "₩99,000",
      desc: "라이트 원페이지 랜딩형",
      features: ["회사소개/서비스소개", "문의유도 1페이지", "수정 1회"],
    },
    {
      name: "Pro",
      price: "₩199,000",
      desc: "스탠다드 3페이지",
      features: ["메인/소개/서비스·문의", "3페이지 사이트", "SEO 기본 세팅"],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "₩349,000",
      desc: "프리미엄 5페이지",
      features: ["메인/회사소개/서비스", "포트폴리오·사례", "문의 페이지"],
    },
  ],
  motion: [
    {
      name: "Basic",
      price: "₩100,000~",
      desc: "30초 숏폼 1개",
      features: ["30초 영상", "자막/BGM", "수정 1회"],
    },
    {
      name: "Pro",
      price: "₩250,000~",
      desc: "60초 또는 숏폼 3개",
      features: ["60초 홍보 영상", "또는 숏폼 3개", "플랫폼별 내보내기"],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "₩600,000~",
      desc: "브랜드 영상 세트",
      features: ["브랜드 영상 세트", "구성안 포함", "수정 2회"],
    },
  ],
};

const serviceTabs: { label: string; value: ServiceTab }[] = [
  { label: "브랜딩", value: "branding" },
  { label: "웹", value: "web" },
  { label: "모션", value: "motion" },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-lime">Pricing</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          서비스별 요금제
        </h2>

        <Tabs defaultValue="branding" className="mt-8">
          <TabsList className="bg-muted/40">
            {serviceTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="px-3 text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {serviceTabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-6">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {plansByTab[tab.value].map((plan) => (
                  <article
                    key={`${tab.value}-${plan.name}`}
                    className={`rounded-2xl border p-6 transition-all duration-200 ${
                      plan.highlight
                        ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border/80 bg-card/70 hover:border-border hover:bg-card"
                    }`}
                  >
                    <p className="text-sm font-medium text-muted-foreground">{plan.name}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">{plan.price}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
                    <ul className="mt-5 space-y-2 text-sm text-foreground/85">
                      {plan.features.map((feature) => (
                        <li key={feature} className="rounded-md border border-border/60 bg-background/55 px-3 py-2">
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
