# 컨텐츠 서비스 6종 모션 R4 구현 결과

2026-10-14 · 구현 담당 B · 코드 동결 · 독립 실제 검증 대기 · 사용자 확인 전

## 결과

R3의 실제 작업물·카피·가격·권리 표기를 보존하고 6종 서비스의 탐색 동작을 React 상태와 CSS 전환으로 구현했다

motion·framer-motion·GSAP은 설치돼 있지 않아 기존 React와 브라우저 API만 사용했다

| 서비스 | 실제 구현 | 레퍼런스 동작 대응 | 주요 파일 |
| --- | --- | --- | --- |
| 웹툰 | 스크롤 컷 펼침, 12컷 스냅 리더와 진행선, 전체 이어 읽기 | 카드 깊이·개별 패널의 공간 변화 | `webtoon/webtoon-experience.tsx` |
| 애니메이션 | 실제 영상 미리보기, 3장면 깊이·회전 전환, 스크롤/탭/스와이프 | 카드 공간 전환과 제작 단계 미디어 교체 | `scene-sequence.tsx`, `animation/landing.tsx` |
| AI 인플루언서 | 4인 depth 카드, 계정 탭, 피드 썸네일 전환, 모두 펼침 | 캐러셀 x/z/회전/투명도와 선택 미디어 전환 | `ai-influencer/creator-experience.tsx` |
| 모션그래픽 | 실제 영상, 장면 타임라인, 3가지 문구 배치 모드 | 개별 글자의 시차·위치·규모 변화 | `motion-graphics/type-composition.tsx` |
| 브랜드 필름 | 실제 영상, 스크롤 화면 확장, 30/60초 구성 전환 | 영상 중심 화면과 단계 선택 | `brand-film/film-timeline.tsx` |
| SNS 광고 | 중앙 영상과 양옆 18초 왕복 레일, 세로 장면 선택 | 원본 광고 레일의 느린 기울기·왕복 리듬 | `ad/ad-reel.tsx` |

공통 런타임은 `motion-runtime.tsx`, 서비스 전용 모션 스타일은 `service-motion.css`다

## 콘텐츠와 접근성

- 제목 줄 장식은 aria-hidden, h1은 전체 원문 aria-label로 제공
- AI 4계정은 모두 렌더되며 선택 탭·키보드·전체 펼침으로 접근
- 피드는 기존 3컷과 검증된 캡션을 그대로 사용하고 게시 수치·게시 시각을 만들지 않음
- 웹툰 리더는 슬라이더 외에 12컷 전체 이어 읽기를 유지
- 장면 선택에는 실제 원본 발췌 시점만 표시
- 브랜드 30/60 구성은 장면 역할을 설명하는 구성 예시임을 명시하고 임의 초 배분을 실제 영상처럼 표시하지 않음
- 모션그래픽 글자 배치는 구성 예시로 표시하고 실제 제작 영상과 구분
- 포스터와 수동 영상 조작을 유지하며 헤더 재생 정지 토글을 복원하지 않음

## 영상과 스크롤 생명주기

가시 비율 35% 이상인 자동 미리보기 1개만 재생하며 다른 미리보기는 pause한다

이탈·숨김 탭·OS reduced motion에서 영상을 멈추고 자동재생 실패 시 포스터를 남긴다

사용자가 기본 영상 조작을 누른 뒤에는 자동 로직이 수동 정지를 덮어쓰지 않는다

광고 레일은 화면 이탈·숨김 탭·hover·focus-within에서 정지한다

독립 검증자의 정적 피드백을 반영해 visibilitychange가 data-in-view에도 반영되도록 수정했다

OS 설정 변경은 공통 frame의 matchMedia change → motion context → 각 effect 정리·재설정 경로로 연결된다

스크롤 진행은 rAF 한 개를 예약하고 CSS 변수로 기록하며 장면 인덱스가 달라질 때만 React 상태값이 달라진다

## 자산과 공개 게이트

새 생성·외부 다운로드·자산 교체 없음

R3의 9개 발췌 컷을 재사용하며 원본 경로·발췌 시점·해시는 `SCENE_ASSETS_R3.json` 그대로다

AI 4계정 원본·권리 구분은 `CREATOR_ASSETS_R2.json`과 `RESULT_DESIGN_R2_SERVICES.md`를 유지한다

FeaturedWork와 WorkSequence는 서버에서 선택된 work가 있을 때만 영상과 발췌 장면을 전달한다

SNS 레일도 해당 work 존재 여부로 서버에서 먼저 분기하며 raw review catalog를 클라이언트에 import하지 않는다

## 실제 점검 상태

| 구분 | 상태 | 근거 |
| --- | --- | --- |
| 구현자 scoped ESLint | PASS | `node node_modules/eslint/bin/eslint.js components/content-site/services lib/content-site/services` exit 0 |
| 변경 공백 검사 | PASS | 담당 경로 `git diff --check` 오류 없음, 기존 animation 파일 LF→CRLF 안내만 존재 |
| 레퍼런스 소스 읽기 | PASS | 계획 문서의 실제 경로·효과 대응 |
| 레퍼런스 시간차 관측 | 독립 검증자 수행 | `.qa/design-r4-independent/reference-motion/observed.json` 및 PNG |
| R4 구현 실제 브라우저 | NOT_RUN BY IMPLEMENTER | 검증자에게 코드 동결 전달, 별도 결과 필요 |
| R4 빌드·타입검증 | NOT_RUN BY IMPLEMENTER | 메모리 제약으로 독립 검증자 단독 실행 |
| 배포·push·원본 변경 | NOT_RUN | 승인 범위 제외 |

남은 일은 독립 PC·모바일 동작 검증과 발견 결함 수정, 사용자의 디자인 확인이다
