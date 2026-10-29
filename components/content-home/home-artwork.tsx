import Image from "next/image";
import { homeCardMedia } from "@/lib/content-home";
import type { ContentServiceId } from "@/lib/content-site/types";

/** Compose original images inside existing media slots, without editing source bitmaps. */
export function HomeArtwork({ id, alt = true, placement = "showcase" }: { id: ContentServiceId; alt?: boolean; placement?: "showcase" | "services" }) {
  const source = homeCardMedia[id];
  const media = placement === "services" ? {
    ...source,
    ...serviceArtwork[id],
  } : id === "webtoon" ? {
    ...source,
    images: ["/service-detail-v14/webtoon-06.webp", "/service-detail-v14/webtoon-07.webp"],
    alt: "《1억의 구단주》 완성 페이지 06과 07",
  } : source;
  if (media.images?.length) {
    return <div className={`ch-content-art ch-content-art--${media.layout}`}>
      {media.images.map((src, index) => <Image key={src} src={src} alt={alt && index === 0 ? media.alt : ""} fill={false} width={640} height={960} sizes="(min-width:768px) 260px, 280px" />)}
    </div>;
  }
  return <Image src={media.poster} alt={alt ? media.alt : ""} fill sizes="(min-width:1024px) 33vw, 100vw" />;
}

// Each home section shows another approved cut of the same work.
const serviceArtwork: Partial<Record<ContentServiceId, { images?: string[]; poster?: string; alt: string }>> = {
  webtoon: { images: ["/service-detail-v14/webtoon-08.webp", "/service-detail-v14/webtoon-09.webp"], alt: "《1억의 구단주》 완성 페이지 08과 09" },
  animation: { images: ["/service-detail-v14/yofree-character-01.webp", "/service-detail-v14/yofree-character-04.webp", "/service-detail-v14/yofree-character-05.webp"], alt: "요프리 캐릭터의 다른 표정과 포즈" },
  "ai-influencer": { images: ["/service-detail-v14/ai-selected.webp"], alt: "87언니 AI 가상인물의 보완 후 채택 장면" },
  "motion-graphics": { poster: "/service-detail-v14/bwl-motion-frame-10.webp", alt: "DR’s Secret 모션 본편 10초의 손과 제형 장면" },
  "brand-film": { poster: "/content-fb3/healernet-08.webp", alt: "힐러넷 회사 소개 영상 8초의 원료 연구 장면" },
  ad: { poster: "/service-detail-v14/sns-cplus-middle.webp", alt: "C Plus 광고의 손과 제품 사용 장면" },
};
