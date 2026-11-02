# RESULT_R5_FIX1

2026-10-14 · VERIFY_R5 결함 1·2·3·5·6 수정 · 커밋 없음 · next build·서버 미실행(검증자 몫) · 결함 4·7은 지시대로 미변경

| 결함 | 수정 | 위치 |
| --- | --- | --- |
| 1 | 터치 시작 대상 제외를 `video`에서 `video[controls]`로 좁히고, 조작 막대 없는 자동 재생 영상은 `pointer-events:none`으로 터치가 카드로 가게 했다. `touch-action: pan-y`, 탭·클릭 선택(`ch-depth-select`), 44px 조작은 그대로. AI 덱·장면·웹툰은 대상 제외가 없어 같은 문제 없음 | `components/content-home/service-showcase.tsx:148`, `components/content-home/content-home.css:360` |
| 2 | 브랜드 영상 프레임이 `--cs-frame-progress`(프레임 상단이 화면 위쪽 절반으로 올라오는 만큼 0→1)를 따르고 scale .88→1, 모서리 28px→0 | `components/content-site/services/motion-runtime.tsx:87,92,110,123`(옵션·초기값·갱신), `service-motion.css:98` |
| 3 | 광고 공개판에 장면 전환 묶음 추가. `ad-scene-1..3` 슬롯(기존 광고 이미지 재사용, 파일·매니페스트 추가 없음)을 `WorkSequence service="ad"`로 렌더. 예시는 9:16이면 portrait. 고객 정보는 서버 분기 그대로 | `components/content-site/services/ad/landing.tsx:65`, `lib/content-site/example-media.ts:97-99`, `work-sequence.tsx:50`, `service-motion.css:62` |
| 5 | 광고 레일 태그 한 줄(nowrap, 말줄임) | `components/content-site/services/ad/ad.css:122-124` |
| 6 | 애니메이션 히어로 태그를 이미지 위쪽(top 12px)으로, 데스크톱은 이미지 폭을 `100svh` 기준으로 제한해 첫 화면 안에 들어오게 | `components/content-site/services/animation/animation.css:35-38` |

## 테스트

- 신규 `tests/content-r5-fix1.test.mjs` 4개(결함 1, 2, 3, 5·6). 수정: `content-site-wps2.test.mjs` S2-2 정규식(.92→.88 변수), `content-site-wps1.test.mjs` S1-2에 ad 장면 3컷 포함.
- `npx tsc --noEmit -p .`: 오류 0.
- 전체 직렬 테스트: tests 119, pass 118, fail 0, skipped 1(로컬 미디어 파생본, 기존과 동일). 이전 115에서 신규 4개 증가.

## 검증자 확인 필요

- 390에서 영상 위 가로 스와이프(검토판), 브랜드 영상 스크롤 시 scale 변화(.88→1)와 가로 넘침 없음.
- 광고 공개판 장면 전환(1440 고정 구간, 390 자동 순환·스와이프)과 이미지 9:16 잘림.
- 광고 레일 태그 한 줄, 애니메이션 히어로 태그가 1440·390에서 전부 보이는지.
