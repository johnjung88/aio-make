# 플랫폼 로고 출처 기록 (R7 WP-0)

받은 날짜 2026-10-15 · 사용자 결정으로 Instagram·Facebook·YouTube·TikTok 공식 로고를 모두 쓴다(책임은 사용자). 이 문서는 법률 자문이 아니다.
운용: 색·모양을 바꾸지 않는다(PNG는 비율 유지 축소만). 화면 크기 20px. "공식 파트너·인증·제휴" 문구를 쓰지 않는다. 섹션 아래 상표 고지 1줄만 둔다.

| 플랫폼 | 상태 | 서비스 파일 | 공식 출처 URL(받은 곳) | 받은 파일 | 근거 페이지(저장본) |
|---|---|---|---|---|---|
| Instagram | OFFICIAL | `public/platform-logos/instagram.png` (256×256, 원본 5000×5000 `Instagram_Glyph_Gradient.png`의 축소) | https://www.meta.com/brand/resources/instagram/instagram-brand/ 의 "IG_brand_asset_pack_2023.zip" 링크 | `01 Static Glyph/01 Gradient Glyph/Instagram_Glyph_Gradient.png` (zip SHA-256 `a9e5cbe6…7060e82`, 34,644,696 B. zip 자체는 용량 때문에 저장하지 않음) | `instagram_meta_brand_page.html/.txt/_screenshot.png` |
| Facebook | OFFICIAL | `public/platform-logos/facebook.png` (256×256, 원본 2084×2084 `Facebook_Logo_Primary.png`의 축소) | https://www.meta.com/brand/resources/facebook/logo/ 의 "Facebook-Brand-Asset-Pack.zip" 링크 | `Facebook Brand Asset Pack/Logo/Primary Logo/Facebook_Logo_Primary.png` (zip SHA-256 `5c51e2c9…ffc97f3a`, 336,747 B) | `facebook_meta_brand_page.html/.txt/_screenshot.png` |
| YouTube | OFFICIAL(아래 주의) | `public/platform-logos/youtube.svg` (원본 그대로, 바이트 동일) | https://developers.google.com/static/site-assets/logo-youtube.svg (YouTube 공식 브랜딩 안내 https://developers.google.com/youtube/branding 의 사이트 로고 파일) | `youtube_official_original.svg` | `youtube_developers_branding_page.html`, `youtube_brand_site_home_page.html` |
| TikTok | OFFICIAL | `public/platform-logos/tiktok.png` (256×256, 원본 1200×1200 `TikTok_Icon_Black_Circle.png`의 축소) | https://developers.tiktok.com/doc/getting-started-design-guidelines 에 연결된 https://sf16-va.tiktokcdn.com/obj/eden-va2/uvzhqeh7nuhd/tt4d/logo-pack.zip | `TikTok Logo Pack/TikTok – Icons/TikTok_Icon_Black_Circle.png` (zip SHA-256 `b3f31728…085cd`, 6,588,461 B) | `tiktok_developers_design_guidelines_page.html`, `tiktok_brandbook_home_page.html` |

## 주의·UNKNOWN
- **Meta 두 곳**: 다운로드 버튼 옆에 "I have read and accept the applicable guidelines and other terms for use." 체크 문구가 있다. 자동 수집 중 체크박스를 누르지 않고 페이지의 zip 링크로 직접 받았다. 사용자가 조건(공식 자산만 사용·변형 금지·제휴 암시 금지·로고가 가장 눈에 띄는 요소가 되지 않을 것)을 수락하는 것으로 기록한다. Facebook 페이지 원문: "It's important you use the current version of the logo" / 최신판 사용.
- **YouTube**: 공식 다운로드 사이트 https://brand.youtube (Icon full color)는 JS 렌더링이라 파일 링크를 자동으로 받지 못했다(홈 HTML에 파일 링크 없음, /downloads 404). 대신 YouTube 공식 브랜딩 페이지(developers.google.com/youtube/branding)가 자기 로고로 쓰는 공식 파일을 받았다. 색(#f00)과 삼각형이 공식 아이콘과 같지만 **brand.youtube 다운로드 팩과의 파일 동일성은 UNKNOWN**이다. 사용자가 brand.youtube에서 Icon 파일을 직접 받아 `_소재_인박스_R7\logos\`에 두면 교체한다. 같은 문서에 "광고 노출 승인" 조건이 있다.
- **TikTok**: 개발자 가이드에 "You may not use TikTok logos, icons, symbols, or designs, without our prior written permission." 문구가 있다. 서면 허가는 받지 않았고 **사용자 결정·책임**으로 기록한다. 로고 팩의 아이콘은 AI(벡터)와 PNG만 있고 SVG 아이콘은 없어 PNG를 썼다.
- 대체 금지: lucide-react 브랜드 아이콘, Simple Icons, 직접 그린 모사 로고는 쓰지 않는다(`tests/platform-frame.test.mjs`가 막는다).
