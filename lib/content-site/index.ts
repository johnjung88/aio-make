/* 서비스 6종 랜딩 데이터 집계(WP0 작성 후 수정 금지). 순서는 CONTENT_SERVICES와 같다. */
import { ad } from "./services/ad.ts";
import { aiInfluencer } from "./services/ai-influencer.ts";
import { animation } from "./services/animation.ts";
import { brandFilm } from "./services/brand-film.ts";
import { motionGraphics } from "./services/motion-graphics.ts";
import { webtoon } from "./services/webtoon.ts";
import type { ContentServiceId, ServiceLandingData } from "./types.ts";

export const contentLandings: Record<ContentServiceId, ServiceLandingData> = {
  webtoon,
  animation,
  "ai-influencer": aiInfluencer,
  "motion-graphics": motionGraphics,
  "brand-film": brandFilm,
  ad,
};

export {
  CONTENT_SERVICES,
  CONTENT_SERVICE_IDS,
  CONTENT_SITE_ASSETS,
  MEDIA_TAGS,
  contentServicePath,
  isContentServiceId,
} from "./types.ts";
export type {
  ContentServiceId,
  CsWorkCard,
  CsWorkMedia,
  CsWorksLayout,
  MediaTag,
  ServiceLandingData,
} from "./types.ts";
