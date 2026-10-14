# R3 메인·컨텐츠 편집 구현 결과

2026-10-14 · 기준 e53e108 · 구현 Codex 서브에이전트 A · 독립검증 대기

## 반영

- R2 실화면에서 추상 장식만 보이던 컨텐츠 첫 화면과 가상 사무실 중심 메인 첫 화면을 서버 선택 작업물 중심으로 교체
- 메인: 제품 모션 영상 포스터를 주인공으로, 개발 화면을 보조 작업으로 배치하고 카피·상담을 연결
- 컨텐츠: 짧은 두 줄 제목, 제품 모션 포스터, 웹툰 보조카드, 6형식 링크를 검정 바탕 위 편집
- 모바일은 제목/설명/CTA 다음 바로 작품, 첫 작품 시작700px 전 목표는 실제 화면 검증 필요
- 컨텐츠 서비스 갤러리: 웹툰2페이지 펼침, 세로영상/가로영상 원비율, 이름→용도→가격→CTA, 활용처와 제작구성은 펼침에 보존
- 카드 안 좌우 화살표·키보드 선택·영상 전환시 정지 유지, 선택 등장220ms/8px와 reduced-motion 대응
- 메인 5단계 순서는 보존, 상담/브랜드 준비정보를 좁은 제목+실무정보로 압축하고 빈 장식 제거
- 기존 소개영상과 일반적인 OUR STANDARD 문구 영역을 실제 인계기준3줄+영상2열로 통합
- /content/projects/[slug] 목적·범위를 제목 바로 아래 배치, 상세/돌아가기/게이트 유지
- / 및 /content에서만 인라인 상담이나 상담영역이 보이면 FloatingContact 숨김
- 독립 정적리뷰 후 서비스 모바일 하단바에도 .cs-hero-actions/#inquiry 감지 추가, 단일 IntersectionObserver와 기존 키보드/모션감소 규칙 유지
- B 서비스별 모바일 hero가 gated works를 받도록 공통 ServiceSectionProps 및 registry 전달 수정

## 자료·권리

대표 선택은 고객 slug 하드코딩 없이 journey.contentSelections의 motion-graphics
검토 플래그가 켜지면 기존 서버등록 실제 작업, 기본 플래그는 기존 공개 연출예시
공개 fallback /renewal/video.webp, /webtoon-v11/cut-01.webp, /creative-v08/development-website.webp 존재 확인
가격 정본/작업 게이트/noindex/사이트맵 제외/AI4계정 결정 불변
새 라이브러리·새 생성·외부 이미지·고객정보 클라이언트 정적 상수 추가 없음
쇼릴 데이터 한 줄 교체 슬롯과 정지 이미지 대체 유지
Image #1~5 실물 미첨부, R2 검증 스크린샷과 기존 벤치마킹 시안 실제 이미지로 비교

## 구현자 자기 점검

- TypeScript transpileModule12파일 문법진단0: PASS, 전체 타입검사를 대신하지 않음
- git diff --check: PASS (서비스 작업 LF/CRLF 경고만, 구현자 수정없음)
- 신규 참조 공개 자산3개 존재: PASS
- 타이포는 기존 역할클래스/토큰, 컨텐츠 CSS색은 토큰 사용, 신규 radius 미정의 참조 자기점검에서 수정
- 실제 PC/모바일·700px작품목표·R2/R3높이·영상재생·키보드·reduced-motion·문의실행: NOT_RUN, 독립검증 담당 예정
- build/browser/server/packageinstall/commit/push/deploy: NOT_RUN
- 3213/3214 미접근

## A 변경 파일

- app/(content-site)/content/projects/[slug]/page.tsx
- components/content-home/content-home.css
- components/content-home/content-home.tsx
- components/content-home/service-detail.tsx
- components/content-home/service-showcase.tsx
- components/content-site/module.ts
- components/content-site/service-landing.tsx
- components/content-site/theme.css
- components/content-site/shell/mobile-bar.tsx
- components/floating-contact.tsx
- components/guide/main.jsx
- components/home/home-hero.tsx (신규)
- components/home/home-hero.css (신규)
- components/home/home-services.tsx
- components/home/workflow-journey.css
- components/home/workflow-journey.tsx
- lib/content-home.ts
- lib/home-journey.ts
- docs/renewal-2026-10-13/BRIEF_DESIGN_R3.md (신규)
- docs/renewal-2026-10-13/RESULT_DESIGN_R3_SHELL.md (신규)
- docs/renewal-2026-10-13/HANDOFF_RESUME.md

독립 시각검증 main-stage-2-1440.png에서 확인한 문장 연결 오류를 수정
메인5단계 lead를 각각 자연스러운 한 문장으로 연결해 마침표 삭제 뒤 붙었던 문장을 해결
lib/home-journey.ts만 카피 수정, 추가 줄바꿈/CSS 변경 없음

코드 동결 후 독립 검증자의 실제 화면 비교에서 발견한 결함만 추가 수정
사용자 디자인 승인 및 push·배포는 별도
