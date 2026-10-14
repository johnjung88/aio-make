# 서비스 디자인 R3 자체 결과

- 담당: audit_services, Codex 서브에이전트
- 기준: R2 checkpoint e53e108, BRIEF_DESIGN_R3, 사용자 최상의 사이트 개선 요청
- 상태: 구현 및 자체 정적 검수 완료 / 독립 브라우저 검수 대기 / 사용자 확인 전
- 코드 동결: 2026-10-14

## 진단과 반영

| 페이지 | R2에서 확인한 문제 | R3 반영 |
|---|---|---|
| 공통 | 모바일에서 긴 설명과 가격 아래 작품이 나타남 | 서비스 전용 히어로의 실제 DOM 순서를 제목 → 대표 작품 → 설명/가격으로 변경, PC는 편집형 2열 |
| 웹툰 | 대표 컷 크기와 텍스트 위계, 모바일 진입이 약함 | 실제 자체 웹툰 첫 컷을 제목 바로 뒤, 컷의 너비 확보, 12컷 리더와 영상화 정보 유지 |
| 애니메이션 | 보라 캐릭터 그림만 보여주고 실제 제작품과 연결이 약함 | 검토 빌드에 실제 밤편 웹툰 기반 영상을 대표로 배치, 실제 장면 3개와 캐릭터 기준 → 장면 → 움직임 설명, 그림체 3카드와 별도 소개 반복 통합 |
| 모션그래픽 | 정적 CSS 원·사각형이 제작 역량을 대신함 | 실제 BWL 모션그래픽 영상과 장면 3개 배치, 단순형/맞춤형은 고객 제공 자료와 전용 캐릭터 포함 차이로 짧게 비교 |
| 브랜드 홍보 영상 | 대형 추상 이미지와 긴 설명으로 실제 필름 확인이 늦음 | 실제 브랜드 광고 영상을 가로 전체 너비에 배치, 소개 자료에서 장면을 고르는 설명, 30초/60초 차이는 가격 중복 없이 정리 |
| SNS 광고 | 16:10 이미지를 9:16으로 확대해 흐림, 같은 향수 이미지 3회 반복 | 기존 9:16 실제 광고 영상으로 교체, 같은 영상에서 뽑은 도입·사용법·마무리 3장으로 장면 구성 설명 |
| AI 인플루언서 | 3개 작은 정면/전신 컷이 캐스팅 목록처럼 보임 | 네 계정을 한 행씩 펼치고 생활/스타일 큰 이미지와 인물 기준 두 컷으로 재편, 이미지에서 확인한 의상·배경·장면을 캡션으로 설명 |

- 공통 검정 바탕, 카드/구분선 토큰 유지
- 가격 데이터 파일 미수정, 수정 횟수·수량·부가세·범위 보존
- 제작 사례 FAQ 직전 배치와 상세 CTA는 A 구현 유지
- 새 페이지, 외부 업로드, 신규 이미지 생성, 계정 게시 없음
- 페이지 자동재생을 새로 추가하지 않았으며 영상은 사용자가 기본 재생 컨트롤로 조작

## 사용한 실제 시각자료

기존 `.qa/design-r2-independent/shots`의 6종 PC 첫화면, 서비스 중간 섹션, 최종 AI roster PC/모바일 이미지를 열어 확인
로컬 벤치마크 `I:/00_AIO_CODEX/2026-10-14/aio-make-1-aio-make-https/outputs/service-benchmark-v01/captures` 중 Ordinary Folk, Sandbox creator, Shuttlerock 사례 이미지를 비교
현재 R3 브라우저 검증으로 표시하지 않음

## 장면 파생 자산과 권리

정본 목록: [SCENE_ASSETS_R3.json](SCENE_ASSETS_R3.json)

| 소스 영상 | 추출 시점(초) | 출력 | 사용 위치 | 권리·게이트 |
|---|---|---|---|---|
| public/reference-review/bwl-brand-motion/hero.mp4 | 2 / 12.5 / 22 | r3-scenes/bwl-brand-motion/scene-1..3.webp | 모션그래픽 장면 순서 | 기존 검토용 상태 상속, selected works 존재시에만 렌더 |
| public/reference-review/bwl-aqua-ad/hero.mp4 | 2 / 8 / 14 | r3-scenes/bwl-aqua-ad/scene-1..3.webp | SNS 광고 장면 순서 | 87언니 AI 가상인물 출연·제안용 라벨 유지, 동일 게이트 |
| public/reference-review/yofree-night-motion/hero.mp4 | 3 / 22 / 42 | r3-scenes/yofree-night-motion/scene-1..3.webp | 웹툰 기반 영상의 장면 순서 | 제작 후보·내부 검토 상태와 기존 표시 유지, 동일 게이트 |

- ffmpeg로 원본에서 한 프레임을 추출하고 가로 900 비율 유지 WebP로 저장한 파생본 9장
- 원본 3개와 출력 9개의 SHA-256, 시점, 크기를 매니페스트에 기록
- 출력 9장을 직접 열어 확인, 모션 10초 지점은 전환 중 문구가 희미해 12.5초 제품 배열 장면으로 교체
- 원본 파일 수정 없음, 새 권리 승인이나 공개 승인으로 해석하지 않음
- `public/reference-review`는 기존 gitignore 대상이므로 검증 격리본 복사 시 신규 r3-scenes 포함 필요
- 기본 공개 빌드에는 selected works가 없으므로 파생 프레임과 검토작품 DOM이 생성되지 않음
- 기본 공개 fallback은 기존 허용된 자체/연출 예시 자산만 사용하고 연출 예시 라벨 보존

## AI 네 계정

R2 [CREATOR_ASSETS_R2.json](CREATOR_ASSETS_R2.json)의 자산·출처·SHA 그대로 사용, R3 신규 계정 자산 생성/교체 없음

| 계정 | 큰 피드 이미지 | 보조 컷 | 카피 근거와 한계 |
|---|---|---|---|
| 기록하는87 | 기존 거리 장면 | 정면, 전신 | 뷰티·자기관리 기획과 실제 거리/의상 이미지, 기존 확인 핸들만 표시 |
| 옆집엄마 | 기존 니트 전신 | 정면, 측면 | 신혼·리빙 계정 기획, 실제 실내 일상 게시물로 꾸미지 않고 의상/표정 기준으로 설명 |
| 그레이스의정원 | 기존 트렌치코트 외출 | 정면, 스카프 전신 | 시니어 라이프스타일 기획, 기존 확인 유튜브 핸들만 표시 |
| 쌀만드는아저씨 | 기존 들판 농사 장면 | 얼굴, 일상 차림 전신 | 농업·귀농 계정 기획, 실제 수확·성과·게시일 주장 없음 |

큰 피드와 전신 보조컷은 contain으로 원본을 보존하며 UI에 계정 소개·피드 구성 예시 및 AI 가상인물 표시 유지
실제 소셜 피드·팔로워·조회 수·미확인 계정 링크를 만들지 않음

## 카피 자체 감사

`C:/Users/PC/.codex/skills/korean-humanizer/SKILL.md`를 읽고 설치 대신 스킬에 적힌 [공식 원문](https://github.com/NomaDamas/k-skill/blob/main/korean-humanizer/instruction.md)을 읽어 적용
적용 대상은 붙은 문장, 추상 표현, 불필요한 강조이며 서비스 재기획 자체는 사용자 R3 범위를 따름

- 잔존 문제: R2 문장 끝 점 삭제 후 두 문장이 한 호흡으로 붙은 FAQ·SEO, 반복되는 추상 소개
- 반영: FAQ를 한 문장으로 재작성하거나 명확한 조건으로 연결, 수치·가격·수량·부가세·권리 범위 보존
- 사용자 마침표 금지가 우선, 핸들과 소수점·경로의 점은 유지
- 신규 캡션은 사진에서 확인한 내용과 현행 계정 기획만 사용
- 새 카피의 창작품질 판단은 독립 실화면 검토와 사용자 확인에서 이어짐

## 자체 검증

| 항목 | 결과 |
|---|---|
| scoped ESLint services + lib/services + roster + FAQ | PASS, 경고 0 |
| TypeScript transpileModule 구문검사 18파일 | PASS, 오류 0 (전체 typecheck 아님) |
| 신규 프레임 sharp 디코드 9개 | PASS |
| 파생 프레임 9개 직접 이미지 확인 | PASS, 원본 장면과 비율 확인 |
| 붙은 종결 `니다 + 다음문장`, 줄표 검색 | 남은 대상 없음 |
| git diff --check | PASS, LF→CRLF 안내만 존재 |
| 실제 R3 PC/모바일 브라우저·재생·모션 | NOT_RUN, 독립 검증 담당 |
| 빌드·서버·배포·push·커밋·설치 | NOT_RUN |

## 소유 파일

- `components/content-site/services/service-hero.tsx`, `service-editorial.css`, `work-sequence.tsx` 신규
- `components/content-site/services/{webtoon,animation,motion-graphics,brand-film,ad,ai-influencer}/landing.tsx`
- `components/content-site/services/ai-influencer/ai-influencer.css`
- `lib/content-site/services/*.ts`, `lib/content-site/faq.ts`, `lib/content-site/creator-roster.ts`
- `public/reference-review/r3-scenes/**` 로컬 파생본, `SCENE_ASSETS_R3.json`

A 협의 반영: ServiceSectionProps works 전달과 공통 서비스 제목 토큰 추가는 A 소유 파일에서 수행
