# RESULT_R7_WP0 · 플랫폼 프레임·로고 (구현 담당 자체 검증, 2026-10-15)

빌드·서버·커밋·push는 하지 않았다. 독립 검수는 NOT_RUN(WP-V 대상).

## 변경 파일 (모두 WP-0 소유 범위)
- 신규 `components/platform-frame/platform-frame.tsx` — 서버 컴포넌트 `PlatformFrame`(props `platform: reels|shorts|tiktok|feed45|youtube169|fbvideo|webtoon`, `logo?: instagram|facebook|youtube|tiktok`, `tag?`, `children`, 추가로 `title?`(웹툰 바 제목)·`sponsored?`(피드 "광고")·`className`·`style`), `PlatformLogoMark`, `PLATFORM_FRAME_INFO`. 아이콘은 lucide 범용 8종만(Heart·MessageCircle·Send·Bookmark·Music2·Play·Share2·ThumbsUp).
- 신규 `components/platform-frame/platform-frame.css` — 외곽 `aspect-ratio: 9 / 19.5`, 베젤 3.4%, 반경 폭의 12%(`cqw`), 폭은 부모가 정한다(`width:100%`). 플랫폼별 틀: 릴스·쇼츠·틱톡(전체 화면 + 우측 액션 열 + 하단 캡션·재생 막대), 피드 4:5(계정 줄·반응 줄), 유튜브 16:9(재생 막대·제목·채널·다음 영상 3행), 페이스북 16:9(페이지 줄·반응 줄), 웹툰(상단 바 + 세로 스크롤 영역). `tag`는 콘텐츠 영역 안쪽 왼쪽 위에 12px.
- 신규 `components/platform-frame/logos.ts` — 4개 로고 목록(src·status·출처 URL·받은 날짜), `LOGO_SIZE_*`(16/24/기본 20), `PLATFORM_TRADEMARK_NOTICE`("Instagram, Facebook, YouTube, TikTok은 각 회사의 상표입니다", WP-2가 섹션 아래 1줄로 사용). `src: null`이면 UNKNOWN으로 보고 이름 글자(`.pf-logo-text`)로 대체.
- 신규 `public/platform-logos/{instagram,facebook,tiktok}.png`(256×256), `youtube.svg`
- 신규 `docs/renewal-2026-10-13/license-evidence-r7/logos/*`(원본·근거 페이지·스크린샷·`SOURCES.md`), `INDEX.sha256.txt`에 추가만
- 신규 `tests/platform-frame.test.mjs`

## 로고 출처 표 (상세 `license-evidence-r7/logos/SOURCES.md`)
| 플랫폼 | 상태 | 공식 출처(받은 곳) | 받은 날짜 | 서비스 파일 SHA-256 | 원본 SHA-256 |
|---|---|---|---|---|---|
| Instagram | OFFICIAL | meta.com/brand/resources/instagram/instagram-brand 의 IG_brand_asset_pack_2023.zip → Gradient Glyph PNG(5000px) | 2026-10-15 | `c4de39b3…e67e34`(256px 축소) | `21f86b55…956766` |
| Facebook | OFFICIAL | meta.com/brand/resources/facebook/logo 의 Facebook-Brand-Asset-Pack.zip → Primary Logo PNG(2084px) | 2026-10-15 | `dc7520ee…508622`(256px 축소) | `2adfd474…301308` |
| YouTube | OFFICIAL(파일 동일성 일부 UNKNOWN) | developers.google.com 공식 브랜딩 페이지의 로고 파일 `/static/site-assets/logo-youtube.svg` | 2026-10-15 | `20be5d0b…eab5`(원본 바이트 동일) | 동일 |
| TikTok | OFFICIAL(서면 허가는 사용자 책임) | developers.tiktok.com 가이드의 logo-pack.zip → Icons/TikTok_Icon_Black_Circle.png(1200px) | 2026-10-15 | `9840ed72…fc9035`(256px 축소) | `a21b43e3…2dc94e61` |

zip 3개(IG 34.6MB 등)는 용량 때문에 저장하지 않고 SHA-256만 INDEX에 기록했다. 근거 페이지 HTML·스크린샷·원본 PNG는 저장했다.

## 테스트
`node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/platform-frame.test.mjs` → **10 pass / 0 fail**. 내용: 로고 4개 출처·날짜·파일 존재, 근거 파일 SHA-256 ↔ INDEX 일치(public 서비스 파일 포함), SOURCES.md 4개 URL·UNKNOWN·"prior written permission" 기록, lucide-react 브랜드 아이콘(Instagram|Facebook|Youtube|Twitter|Linkedin) import 0건·simple-icons 의존성/import 0건(app·components·lib·tests 전체 검사), 외곽 비율 9:19.5(±0.5%), 로고 16~24px, 플랫폼 7종·콘텐츠 영역 화면비(4:5·16:9), 'AI 가상 예시' 문자열 0건·틀에 숫자 지표 0건, PNG 정사각·원본 이하 크기·YouTube 바이트 동일.
추가로 `tsc --noEmit`에서 platform-frame 관련 오류 0건 확인. 정적 HTML 목업(비빌드, 스크래치패드)으로 7종 렌더를 육안 확인했고 외곽 200×433.3(비율 0.4615), 로고 20×20 실측.

## 미해결 / UNKNOWN
1. **YouTube**: brand.youtube(공식 다운로드 사이트)는 JS 렌더링이라 Icon 팩을 자동으로 받지 못했다. 대신 YouTube 공식 브랜딩 페이지가 쓰는 공식 로고 파일을 사용했다. brand.youtube Icon 팩과의 파일 동일성은 UNKNOWN. 사용자가 `_소재_인박스_R7\logos\`에 받아 주면 교체한다. 같은 문서에 광고 노출 승인 조건이 있다(사용자 책임).
2. **Meta 2곳**: 다운로드 버튼 옆 약관 수락 체크를 누르지 않고 페이지의 zip 링크로 직접 받았다(사용자 수락으로 기록).
3. **TikTok**: 서면 허가("prior written permission") 없음 → 사용자 결정·책임. 아이콘 SVG는 팩에 없어 PNG 사용.
4. Facebook 프레임은 아래쪽이 비어 보인다(16:9 영상 + 반응 줄만). WP-3에서 필요하면 `className`으로 조정한다.
5. 컴포넌트 렌더 자체는 빌드 금지로 실제 Next 환경에서 확인하지 못했다(WP-V에서 확인).
