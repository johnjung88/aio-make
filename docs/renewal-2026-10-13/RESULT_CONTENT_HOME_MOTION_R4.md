# R4 컨텐츠 홈 공간 전환 구현

2026-10-14 · 메인기준복원과별도범위 · 구현자자체정적검사완료 · 독립동작검증대기

## 관측과 적용

원본 I:/00_AIO_CODEX/2026-10-14/new-chat/outputs/aio-content-v01/dist/app.js의 updateCarousel/selectStep/processArt 읽음
카드거리별 X365px(모바일212),Z170px(모바일95),rotateY42deg,scale1/.88/.72 적용원리확인
검증자 reference-motion/carousel-0.png 및 carousel-3.png 실제이미지에서 중간기울기와중앙안착확인
원본의배경색교체만제외하고컨텐츠바탕검정유지

## 6서비스 갤러리

- React current상태가카드6개의 data-pos를바꾸고CSS perspective/translateX/translateZ/rotateY/scale을650ms보간
- 카드순환·옆카드클릭·카드섹션내화살표·키보드좌우/Home/End·모바일가로swipe
- touch-action pan-y, 가로45px 및수평우세1.2배조건으로세로스크롤보존
- swipe후합성clickcapture차단으로의도치않은링크/카드이동방지
- 비활성카드aria-hidden, 비활성button tabIndex-1, 활성tab만roving포커스
- 실제작업물은server-selected journey만사용, OFF기본은기존공개fallback
- 웹툰원본2장/모바일1장, 세로·가로영상모두contain, 선택영상native controls
- 영상은사용자가재생하며선택변경·오프스크린·문서비활성·모션감소전환에서정지
- 시작가와상세CTA및접힌제작구성유지,가격정본수정없음

## 4단계 제작 과정

원본시안5단계를복제하지않고기존확정상담/기획/제작/납품4단계유지
- 상담: brief문서와메모가공간에놓이는동작
- 기획: gated작업물4장을콘티참고프레임으로교체, 순차rotateX/translate진입
- 제작: gated모션영상(OFF에서는정지이미지)+이동타임라인, 영상은muted/loop/nativecontrols
- 납품: MP4/IMG/규격파일구성예시카드가순차공간진입
- 탭선택React DOM상태교체, Up/Down/Home/End와aria연결
- 미디어패널에제작과정설명예시표기,파일구성예시와합의한납품범위명시
- 새원본프로젝트/안내문서제공보장추가없음,기획2회/최종1회정본유지
- 신규이미지생성/다운로드/패키지없음

## 움직임 제어

useStageActivity: stage당IntersectionObserver1개+document visibility+OS reduced-motion감지
스크롤/애니메이션프레임리스너없음
오프스크린/비활성탭에서는영상정지와CSS animation-play-state paused
모션감소에서는3D옆카드숨김/중앙transform없음/타임라인정지/영상자동재생없음
선택버튼/키보드/수동영상재생기능유지

## 정확한 이번 파일

- components/content-home/service-showcase.tsx
- components/content-home/process-tabs.tsx
- components/content-home/use-stage-activity.ts (신규)
- components/content-home/content-home.css
- components/content-home/content-home.tsx (ProcessTabs에gated선택전달)
- lib/content-home.ts (과정의붙은문장자연스러운연결/선택안내)
- docs/renewal-2026-10-13/BRIEF_CONTENT_HOME_MOTION_R4.md (홈전용계획)
- docs/renewal-2026-10-13/BRIEF_DESIGN_R3.md (최신동적요구추가기록)
- docs/renewal-2026-10-13/RESULT_CONTENT_HOME_MOTION_R4.md

## 자기검사와 인계

PASS: TypeScript transpileModule5파일문법오류0, git diff --check
PASS: 메인main.jsx는9b3def8바이트동일유지, workflow이외메인추가변경없음
NOT_RUN: 전체타입/lint/build/browser/실기기, 검증자직렬진행예정
검증요청: 3D전환중간/완료matrix,카드6종active·설명/가격/링크일치,모바일swipe후click차단/세로스크롤,비활성포커스,단계media DOM교체/시간진행,오프스크린정지,OS reducedmotion,4폭가로넘침0
기존3213/3214·폰3215/3216·터널미변경
메인복원결과는 RESULT_MAIN_SCOPE_RESTORE.md를별도로참조
