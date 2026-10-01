"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { guideEntries } from "@/lib/guide-content";
import Image from "next/image";
import { CodeXml, Video, Square } from "lucide-react";
import suppliedSlots from "./supplied-slots.json";
import { isSafeImageUrl } from "@/lib/domain";
import { services } from "@/lib/content";
import {
  developmentOffer,
  developmentQuoteTerms,
} from "@/lib/development-offers";
export { developmentOffer };

export function GuideOffer({ service }: { service: string }) {
  const offer = developmentOffer(service);
  return (
    <div className="guide-offer">
      <strong style={{ fontSize: 18, lineHeight: 1.5 }}>{offer.title}</strong>
      {offer.lines.length > 0 && (
        <ul style={{ margin: "12px 0", paddingLeft: 20, lineHeight: 1.8 }}>
          {offer.lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      <p
        style={{
          margin: "8px 0",
          color: "#B5B5BD",
          fontSize: 14,
          lineHeight: 1.7,
        }}
      >
        {developmentQuoteTerms}
      </p>
    </div>
  );
}

export type GuideProps = { service?: string; entries?: GuideEntry[] };
export type GuideEntry = {
  id: string;
  title: string;
  summary: string;
  cover_url: string;
  slug: string;
  created_at: string;
  division: string;
  type: string;
  kind: string;
  is_featured?: boolean;
  service?: string;
};
export class GuideLogic extends React.Component<
  GuideProps,
  Record<string, unknown>
> {}

const roots: Record<string, string> = {
  Studio: "video",
  Marketing: "marketing",
  Lab: "lab",
};
const serviceKeys: Record<string, string> = {
  shop: "shopping-mall",
  program: "program",
  promo: "brand-film",
  ad: "ad",
  edit: "editing",
  ai: "ai-influencer",
  seo: "seo",
};
export function guideServiceHref(division: string, key: string) {
  return `/${division}/services/${serviceKeys[key] ?? key}`;
}
export function guideContactKey(key?: string, division?: string) {
  return key
    ? ({
        "shopping-mall": "shop",
        "brand-film": "promo",
        editing: "edit",
        "ai-influencer": division === "video" ? "ai-influencer" : "ai",
      }[key] ?? key)
    : "";
}
export function guideHref(href: string, context = "main") {
  if (href === "#") return context === "main" ? "/work" : `/${context}/work`;
  if (href === "AIO 메인 시안.dc.html") return "/";
  if (href.startsWith("AIO 메인 시안.dc.html#"))
    return "/" + href.slice(href.indexOf("#"));
  if (href.includes("회사소개")) return "/about";
  if (href.includes("팀원소개")) return "/about/team";
  const matched = Object.entries(roots).find(([brand]) =>
    href.startsWith(brand),
  );
  if (!matched)
    return href.startsWith("/") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
      ? href
      : "/contact";
  const division = matched[1],
    query = new URLSearchParams(href.split("?")[1] ?? ""),
    key = query.get("s");
  if (href.includes("서비스"))
    return guideServiceHref(
      division,
      key ??
        (division === "lab"
          ? "website"
          : division === "video"
            ? "webtoon"
            : "integrated"),
    );
  if (href.includes("문의"))
    return (
      `/${division}/contact` +
      (key ? "?service=" + (serviceKeys[key] ?? key) : "")
    );
  if (href.includes("인사이트") || href.includes("칼럼"))
    return `/${division}/insights`;
  if (href.includes("사례") || href.includes("레퍼런스"))
    return `/${division}/work`;
  return `/${division}`;
}
export function GuideLink({
  href = "/contact",
  context,
  children,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href?: string;
  context?: string;
}) {
  return (
    <Link href={guideHref(href, context)} {...props}>
      {children}
    </Link>
  );
}

const assetSlots: Record<string, string> = {
  "lead-ceo": "/images/guide/hero/team-meeting.jpg",
  "lead-video": "/renewal/animation-sample.webp",
  "lead-mkt": "/renewal/marketing-content-v03.webp",
  "lead-dev": "/images/guide/images/cards/card-lab.jpg",
  "aio-home-hero": "/images/guide/hero/hero-bg.jpg",
  "main-studio-big": "/renewal/animation-sample.webp",
  "main-studio-s1": "/renewal/influencer-sample.webp",
  "main-studio-s2": "/renewal/brand-film-v03.webp",
  "main-mkt-big": "/renewal/marketing-content-v03.webp",
  "main-mkt-s1": "/images/guide/images/cards/card-marketing.jpg",
  "main-mkt-s2": "/renewal/influencer-sample.webp",
  "main-lab-big": "/images/guide/public/portfolio/corp-novatek/live.png",
  "main-lab-s1": "/images/guide/images/portfolio/ws-shop-desktop.png",
  "main-lab-s2":
    "/images/guide/portfolio/blogautopilot-multinational/real-demo/app-schedule.png",
  "lab-works-website": "/images/guide/portfolio/corp-novatek/live.png",
  "lab-works-shop": "/images/guide/images/portfolio/ws-shop-desktop.png",
  "lab-works-automation":
    "/images/guide/portfolio/blogautopilot-multinational/real-demo/app-schedule.png",
  "lab-works-program": "/images/guide/portfolio/v-aio-admin/dashboard.png",
};
// All published imagery is supplied by the user or generated for this website.
// Stock URLs in the sketch are reference hints, not production dependencies.
export function guideAsset(value: string): string {
  if (!value) return "/images/guide/images/cards/card-lab.jpg";
  if (value.startsWith("https://") && isSafeImageUrl(value)) return value;
  if (value.startsWith("/"))
    return value.replace("/images/guide/public/", "/images/guide/");
  if (value.startsWith("public/")) return "/images/guide/" + value.slice(7);
  if (assetSlots[value])
    return assetSlots[value].replace("/images/guide/public/", "/images/guide/");
  const supplied = (suppliedSlots as Record<string, string>)[value];
  if (supplied) return supplied;
  if (/157471|153644/.test(value)) return "/renewal/animation-sample.webp";
  if (/149479|153174|143876/.test(value))
    return "/renewal/influencer-sample.webp";
  if (/154274|149736|154229|152617/.test(value))
    return "/renewal/brand-film-v03.webp";
  if (value.includes("webtoon")) return "/renewal/webtoon-sample.webp";
  if (value.includes("animation")) return "/renewal/animation-sample.webp";
  if (value.includes("influencer") || value.includes("svc-ai"))
    return "/renewal/influencer-sample.webp";
  if (
    value.includes("studio") ||
    value.includes("promo") ||
    value.includes("brand")
  )
    return "/renewal/brand-film-v03.webp";
  if (value.includes("shop") || value.includes("product"))
    return "/renewal/shop-products.webp";
  if (
    value.includes("mkt") ||
    value.includes("market") ||
    value.includes("food") ||
    value.includes("152")
  )
    return "/renewal/marketing-content-v03.webp";
  if (value.includes("hero") || value.includes("team"))
    return "/images/guide/hero/hero-bg.jpg";
  if (
    value.includes("143288") ||
    value.includes("161116") ||
    value.includes("155674")
  )
    return "/renewal/marketing-content-v03.webp";
  return "/images/guide/images/cards/card-lab.jpg";
}
export function GuideImage({
  id = "",
  src,
  placeholder,
  style,
  ...rest
}: {
  id?: string;
  src?: string;
  placeholder?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  const imageSrc = guideAsset(src || id);
  return (
    <span
      className="guide-image"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <Image
        src={imageSrc}
        alt={String(
          rest.alt ??
            (placeholder
              ? placeholder.replace(/\s*\([^)]*\)/g, "")
              : "제작 방향 예시"),
        )}
        fill
        sizes={
          id === "aio-home-hero" || id === "main-hero-bg"
            ? "(max-width: 768px) 1200px, 100vw"
            : "(max-width: 768px) 100vw, 70vw"
        }
        priority={id.includes("hero")}
        style={{ objectFit: "cover" }}
      />
    </span>
  );
}
export function GuideMedia({
  id = "",
  sample = "",
  style,
}: {
  id?: string;
  sample?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}) {
  const src = sample.includes("웹툰")
    ? "/renewal/webtoon-sample.webp"
    : sample.includes("애니")
      ? "/renewal/animation-sample.webp"
      : sample.includes("인플루")
        ? "/renewal/influencer-sample.webp"
        : "/renewal/brand-film-v03.webp";
  return (
    <span
      className="guide-media"
      style={{ position: "absolute", inset: 0, display: "block", ...style }}
    >
      <Image
        src={src}
        alt={
          sample
            ? sample + " 제작 방향 예시 이미지"
            : "브랜드 영상 제작 방향 예시 이미지"
        }
        fill
        sizes={
          sample === "reel"
            ? "(max-width:768px) 1200px,100vw"
            : "(max-width:768px) 100vw,60vw"
        }
        priority={
          id === "studio-reel" || id.includes("hero") || sample === "reel"
        }
        style={{ objectFit: "cover" }}
      />
      <span className="guide-media-caption">
        콘셉트 이미지 · 실제 영상은 등록 후 공개
      </span>
    </span>
  );
}

export function GuideNav({
  division,
  active = "home",
}: {
  division: string;
  active?: string;
}) {
  const dark = true,
    brand =
      division === "video" ? "영상" : division === "lab" ? "개발" : "마케팅";
  const first =
    division === "lab"
      ? "website"
      : division === "video"
        ? "webtoon"
        : "integrated";
  const items = [
    ["home", "홈", `/${division}`],
    ["services", "서비스", `/${division}/services/${first}`],
    [
      "cases",
      division === "marketing"
        ? "운영 사례"
        : division === "video"
          ? "작업 사례"
          : "레퍼런스",
      `/${division}/work`,
    ],
    ["insights", "인사이트", `/${division}/insights`],
  ];
  return (
    <nav
      className={"guide-subnav" + (dark ? " is-dark" : "")}
      aria-label={brand + " 메뉴"}
    >
      <div>
        <Link className="guide-subbrand" href={`/${division}`}>
          {division === "lab" ? (
            <CodeXml size={20} />
          ) : division === "video" ? (
            <Video size={20} />
          ) : (
            <Square size={10} fill="currentColor" />
          )}
          {brand}
        </Link>
        <div className="guide-sublinks">
          {items.map(([key, label, href]) => (
            <Link
              key={key}
              href={href}
              aria-current={active === key ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link className="guide-nav-cta" href={`/${division}/contact`}>
            {division === "marketing"
              ? "운영 문의"
              : division === "lab"
                ? "제작 문의"
                : "프로젝트 문의"}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export const marketingExamples = [
  {
    client: "홈리빙 콘텐츠 구성",
    ind: "홈리빙 · 운영 예시",
    type: "feed",
    img: "/renewal/marketing-content-v03.webp",
    handle: "콘텐츠 구성 예시",
    reel: "SHORTS",
    tiles: [
      "/renewal/marketing-content-v03.webp",
      "/renewal/brand-film-v03.webp",
      "/renewal/influencer-sample.webp",
    ],
    service: "SNS 운영",
    title: "제품의 쓰임을 고객의 질문으로",
    result: "제작 방향 예시",
    metric: "운영 설계",
    desc: "촬영 소재를 이미지와 짧은 영상으로 구성합니다",
    tags: ["소재 기획", "채널별 변형"],
  },
  {
    client: "검색 접점 구성",
    ind: "서비스 · 운영 예시",
    type: "search",
    img: "/images/guide/images/cards/card-marketing.jpg",
    query: "고객이 궁금한 서비스 질문",
    resultTitle: "질문에 답하는 서비스 안내",
    url: "설계 예시 · 검색 순위 보장 없음",
    service: "SEO·AEO·GEO",
    title: "검색에서 문의까지 연결",
    result: "설계 예시",
    metric: "접점 개선",
    desc: "서비스 설명과 문의 경로를 함께 정리합니다",
    tags: ["페이지 설계", "검색 기본 설정"],
  },
  {
    client: "브랜드 전용 인물",
    ind: "라이프스타일 · 제작 예시",
    type: "ai",
    img: "/renewal/influencer-sample.webp",
    q: "제품을 어떻게 사용하나요?",
    a1: "브랜드의 자료를 바탕으로 ",
    a2: "의 사용 장면을 콘텐츠로 기획합니다",
    service: "AI 인플루언서",
    title: "일관된 인물과 브랜드의 이야기",
    result: "AI 생성 이미지",
    metric: "콘텐츠 설계",
    desc: "전용 인물의 외형과 말투부터 정리합니다",
    tags: ["인물 설정", "권리 확인"],
  },
].map((item) => ({
  ...item,
  svc: item.service,
  m1v: "PLAN",
  m1l: "기획 방향 예시",
  m2v: "CONTENT",
  m2l: "제작 이미지 예시",
}));

type GuideValues = Record<string, unknown>;
export function adaptGuideValues(
  page: string,
  source: GuideValues,
  props: GuideProps,
): GuideValues {
  const values = { ...source };
  if (page === "team") {
    values.leaders = [
      {
        id: "lead-ceo",
        tag: "PLANNING",
        name: "기획 · 운영",
        role: "목적과 범위의 합의",
        desc: "요청을 정리하고 일정과 결과물의 기준을 맞춥니다",
        bg: "#0D0D12",
        fg: "#fff",
        accent: "#A99BFF",
      },
      {
        id: "lead-video",
        tag: "STUDIO · VIDEO",
        name: "영상",
        role: "장면 기획 · 제작 · 편집",
        desc: "콘셉트부터 채널별 최종 편집까지 구성합니다",
        bg: "#fff",
        fg: "#0D0D12",
        accent: "#6B4DFF",
      },
      {
        id: "lead-mkt",
        tag: "MARKETING",
        name: "마케팅",
        role: "콘텐츠 · 채널 · 분석",
        desc: "고객의 질문을 콘텐츠와 문의 경로로 연결합니다",
        bg: "#fff",
        fg: "#0D0D12",
        accent: "#6B4DFF",
      },
      {
        id: "lead-dev",
        tag: "LAB · DEVELOPMENT",
        name: "개발",
        role: "화면 · 구현 · 검증",
        desc: "실제 업무 흐름에 맞춰 웹사이트와 프로그램을 구현합니다",
        bg: "#fff",
        fg: "#0D0D12",
        accent: "#6B4DFF",
      },
    ];
  }
  if (page === "main") {
    const groups = values.workGroups as
      | {
          name: string;
          bigId: string;
          s1Id: string;
          s2Id: string;
          href: string;
        }[]
      | undefined;
    values.workGroups = groups?.map((group) => {
      const division =
        roots[group.name] === "lab" ? "development" : roots[group.name];
      const entries = (props.entries ?? []).filter(
        (e) =>
          e.type === "reference" && e.division === division && e.is_featured,
      );
      const samples: Record<string, string[]> = {
        Studio: ["animation", "ai-influencer", "brand-film"],
        Marketing: ["sns", "integrated", "ai-influencer"],
        Lab: ["website", "shopping-mall", "automation"],
      };
      const target = (n: number) =>
        `/${roots[group.name]}/work/${entries[n]?.slug || "example-" + samples[group.name][n]}`;
      const category = (n: number) =>
        services.find(
          (service) =>
            service.division === division &&
            service.id === (entries[n]?.service || samples[group.name][n]),
        )?.name || "작업 사례";
      return {
        ...group,
        cat1: category(0),
        cat2: category(1),
        cat3: category(2),
        bigId: entries[0]?.cover_url || group.bigId,
        s1Id: entries[1]?.cover_url || group.s1Id,
        s2Id: entries[2]?.cover_url || group.s2Id,
        href: group.href,
        bigHref: target(0),
        s1Href: target(1),
        s2Href: target(2),
        bigTitle: entries[0]?.title || "제작 방향 예시",
        s1Title: entries[1]?.title || "제작 방향 예시",
        s2Title: entries[2]?.title || "제작 방향 예시",
      };
    });
  }
  if (page.startsWith("marketing")) {
    values.reviews = [
      {
        text: "고객의 질문을 정리해 채널과 콘텐츠의 역할을 먼저 합의합니다",
        author: "01 · 기획 기준",
        service: "현황 분석 · 월간 플랜",
        date: "AIO MAKE",
      },
      {
        text: "독립 원본과 채널별 게시 수량을 구분하고, 진행 결과를 보고합니다",
        author: "02 · 운영 기준",
        service: "콘텐츠 · 채널 운영",
        date: "AIO MAKE",
      },
      {
        text: "콘텐츠와 검색 접점, 문의 경로를 함께 점검해 다음 운영에 반영합니다",
        author: "03 · 개선 기준",
        service: "검색 · 문의 · 다음 계획",
        date: "AIO MAKE",
      },
    ];
  }
  if (page.endsWith("home") || page.endsWith("services")) {
    const division = page.startsWith("studio") ? "video" : page.split("-")[0];
    const actualPosts = (props.entries ?? []).filter(
      (e) => e.type === "insight",
    );
    const posts = (
      actualPosts.length
        ? actualPosts
        : guideEntries("insight", division === "lab" ? "development" : division)
    )
      .slice(0, 3)
      .map((e) => ({
        id: e.cover_url,
        title: e.title,
        summary: e.summary,
        date: e.id.startsWith("guide-")
          ? "서비스 안내"
          : new Date(e.created_at).toLocaleDateString("ko-KR"),
        cat: "GUIDE",
        img: e.cover_url,
        href: `/${division}/insights/${e.slug}`,
      }));
    values.posts = posts;
    if (page === "marketing-services")
      values.s = { ...(values.s as object), posts };
  }

  return values;
}

// Natural Korean spacing; selected service remains visible in the mobile rail.
export function GuideEffects() {
  return null;
}
export function ServiceTabs({
  division,
  className = "",
}: {
  division: string;
  className?: string;
}) {
  const pathname = usePathname();
  const rail = useRef<HTMLElement>(null);
  useEffect(() => {
    const current = rail.current?.querySelector<HTMLElement>(
      '[aria-current="page"]',
    );
    if (current && rail.current)
      rail.current.scrollLeft = Math.max(
        0,
        current.offsetLeft - rail.current.offsetLeft - 20,
      );
  }, [pathname]);
  return (
    <nav
      ref={rail}
      className={`guide-service-tabs ${className}`}
      aria-label="서비스 선택"
    >
      {services
        .filter(
          (s) => s.division === (division === "lab" ? "development" : division),
        )
        .map((s, i) => {
          const href = `/${division}/services/${s.id}`;
          return (
            <Link
              key={s.id}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {s.name}
            </Link>
          );
        })}
    </nav>
  );
}

export function GuideCloud() {
  // The supplied cloud is an intentional animated point outline. Use its native
  // canvas medium rather than substituting a generic decorative illustration.
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const parent = canvas.closest(".guide-page");
    if (!parent) return;
    let raf = 0;
    function draw(time: number) {
      if (!canvas || !ctx || !parent) return;
      const w = parent.clientWidth,
        h = Math.min(parent.scrollHeight, 6000);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.clearRect(0, 0, w, h);
      const target = parent.querySelector<HTMLElement>(
        "[data-cloud='outline']",
      );
      if (target) {
        const a = target.getBoundingClientRect(),
          b = parent.getBoundingClientRect();
        ctx.fillStyle = "rgba(169,155,255,.5)";
        for (let n = 0; n < 100; n++) {
          const p = n / 100,
            phase = reduced ? 0 : Math.sin(time / 800 + n) * 2,
            x =
              p < 0.5
                ? a.left - b.left + p * 2 * a.width
                : a.right - b.left - (p - 0.5) * 2 * a.width,
            y =
              p < 0.5
                ? a.top - b.top - 4 + phase
                : a.bottom - b.top + 4 + phase;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    }
    draw(0);
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="guide-cloud" />;
}
