/* pathname → 컨텐츠 사이트 테마. 순수 데이터 맵(서버·클라이언트가 같은 값을 낸다).
 * 색 토큰은 components/content-site/theme.css가 data-cs-theme·data-cs-service 속성으로 바꾼다. */
import {
  isContentServiceId,
  type ContentServiceId,
} from "./types.ts";

export type CsTheme = "ink" | "paper";
export type CsServiceKey = ContentServiceId | "home" | "contact";
export type CsPage = "home" | "service" | "contact";

export const CS_THEME: Record<CsServiceKey, CsTheme> = {
  webtoon: "ink",
  animation: "ink",
  "ai-influencer": "ink",
  "motion-graphics": "ink",
  "brand-film": "ink",
  ad: "ink",
  home: "ink",
  contact: "ink",
};

export type CsRoute = {
  theme: CsTheme;
  service: CsServiceKey;
  page: CsPage;
  /** 서비스 페이지일 때만 */
  serviceId?: ContentServiceId;
};

/** /content → home, /content/contact → contact, /content/services/<id> → 서비스. 그 밖은 home 테마. */
export function csRoute(pathname: string | null | undefined): CsRoute {
  const parts = (pathname ?? "").split("?")[0].split("/").filter(Boolean);
  if (parts[0] === "content" && parts[1] === "services") {
    const id = parts[2];
    if (isContentServiceId(id))
      return { theme: CS_THEME[id], service: id, page: "service", serviceId: id };
  }
  if (parts[0] === "content" && parts[1] === "contact")
    return { theme: CS_THEME.contact, service: "contact", page: "contact" };
  return { theme: CS_THEME.home, service: "home", page: "home" };
}
