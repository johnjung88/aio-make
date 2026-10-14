# 디자인 R2 공통 셸·메인·컨텐츠 홈 구현

2026-10-14 · Codex 구현 서브에이전트 A · 기준 9b3def8 · 미커밋 후보

## 결과

- 컨텐츠 전체 바탕 #080808, 카드 #141414로 통일하고 서비스 차이는 미디어·작은 강조색으로 제한
- 헤더는 홈 / 각 서비스 / 인사이트 / 상담 신청으로 단순화, 재생·정지 토글 렌더 제거
- OS 모션 감소 변경을 실시간으로 따라가며 수동 갤러리 선택은 짧은 전환만 사용
- /content 홈은 검토 게이트를 거쳐 선택한 실제 6종 작업물 중심의 갤러리, 화살표는 카드 내부
- 서비스 설명·시작가·납품 범위를 같은 위치에서 읽고 제작 과정 4개는 모두 펼쳐 표시
- 메인 3분야 카드는 실제 컨텐츠·개발 작업물 우선 사용, 마케팅은 근거 없는 성과 대신 운영 구성 표시
- 메인 5단계의 좁은 sticky 레일을 해제하고 단계별 제목·설명과 결과물을 넓게 배치
- 메인 컨텐츠 카드 내부에 이전·다음 배치, 작업 상세는 새 컨텐츠 상세로 이동
- 서비스 제작 사례를 FAQ 바로 앞으로 이동, 카드 본문 높이와 CTA 하단 정렬
- /content/projects/[slug]는 작품 전체 미디어·목적·범위 제공, service 쿼리를 검증해 들어온 서비스 사례로 돌아감
- /content/insights와 글 상세가 컨텐츠 공통 셸에서 열림
- 공통 카피와 가격 설명의 문장 마침표 제거, URL·금액·소수점 보존
- 사용자 후속 결정에 따라 AI 소개는 확인된 4계정만 반영하도록 지시서 갱신 (구현 B 소유)

## 파일 경계

components/home/**, components/guide/main.jsx
components/content-home/**
components/content-site/theme.css, service-landing.tsx, shell/**, blocks/works.tsx, contact/copy.ts
lib/home-journey.ts, content-home.ts, content-pricing.ts
lib/content-site/copy.ts, theme-map.ts, works.server.ts, text.ts
app/(content-site)/content/layout.tsx, projects/[slug]/page.tsx, insights/page.tsx, insights/[slug]/page.tsx
BRIEF_DESIGN_R2.md, HANDOFF_RESUME.md

서비스별 6종 모듈·전용 CSS·서비스 데이터·FAQ·AI 소개 데이터/자산은 구현 B 소유

## 보존

고객 레퍼런스 visibility review / 정확히 1인 검토 게이트 / noindex / 사이트맵 제외 유지
옛 /work/[slug] 유지, 삭제된 /work·/content/work 목록은 복구하지 않음
3213·3214 서버와 기존 빌드 출력에는 접근·종료·재시작 없음
push·배포·설치·커밋 없음
가격 변경 없음

## 실제 자체 점검

- HANDOFF_RESUME 끝까지, COMMON, CODEX_ASTRA_HANDOFF 및 상위 공통 지침 읽음
- 현재 브랜치 codex/WRK-20261013-AIO-CONTENT-RENEWAL / HEAD 9b3def8 / 시작 시 clean 확인
- A 소유 파일 git diff --check 이상 없음
- A 카피 원본 한글 뒤 문장 마침표 검색·검토
- 정적 소스 확인: 서비스 사례 순서, 헤더 렌더, 내부 상세 href, noindex·게이트 보존, 카드 내부 제어 위치
- 이전 >=1180 메뉴 숨김 규칙과 모바일 두 줄 높이 충돌을 자체 확인하여 수정

## 검증 상태와 한계

타입·lint·직렬 테스트·build·브라우저·360/390/768/1440 렌더: NOT_RUN (독립 검증자 전용)
독립 검증: PENDING
사용자 디자인 승인: PENDING
push·배포: NOT_RUN
Image #1~5 실제 첨부는 없어 현재 구조에서 지적과 일치하는 부분 기준으로 반영
사용자가 쇼릴을 제공하기 전까지 기존 교체 슬롯과 정지 이미지를 유지

사용자가 Opus/Sonnet 대신 사용 가능한 Codex 서브에이전트 구현·독립 검증을 명시 승인한 범위로 진행
