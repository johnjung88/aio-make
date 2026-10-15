# RESULT R8 WP-A2: 컨텐츠 홈 `/content` 정렬·문구

상태: 구현 완료, 화면 검증 NOT_RUN. 커밋하지 않았다.

## 변경 파일
- `lib/content-home.ts`: SERVICES·PROCESS `lead` 삭제, `titleEm` 추가, 단계 데이터를 `{label, text, art}`로 단순화(`check`·`output`·`checkLabel`·`outputLabel` 삭제), 4단계 설명 교체.
- `components/content-site/ui/section-head.tsx`: `align?: "start" | "center"`(기본 start), `emphasis?: string` 추가.
- `components/content-site/theme.css`: `.cs-head--center .cs-head-main`(가운데), `.cs-head--center .cs-head-lead`, `.cs-head-em`(강조 색) 추가만.
- `components/content-home/service-showcase.tsx`: 섹션 머리 한 줄만(`lead` 제거, `emphasis`, `align="center"`).
- `components/content-home/content-home.tsx`: PROCESS 머리(`lead` 제거, `emphasis`, `align="center"`).
- `components/content-home/process-steps.tsx`: "받는 것" 줄과 sr-only "확인하는 것" 라벨 삭제, `<p className="ch-step-text cs-t-small">{step.text}</p>` 하나.
- `components/content-home/content-home.css`: `.ch-step-check`·`.ch-step-output*` 규칙 삭제, `.ch-step-text` 추가, 그리드 영역에서 output 삭제.
- `tests/content-home.test.mjs`: 새 기준으로 수정, 테스트 4-1 신설.
- `tests/content-site.test.mjs`(소유 목록 밖, 최소 수정): 11-8 "공통 CSS에 가운데 정렬 없음" 허용 목록에 `.cs-site .cs-head--center .cs-head-main` 한 줄 추가. 이 변경 없이는 새 가운데 규칙이 실패한다. B3a가 가격·과정·FAQ 가운데 정렬을 넣을 때 이 테스트를 다시 손봐야 한다.

## C번호별 처리
- C1/C2: 두 머리 모두 `align="center"`. 머리 `div`에서 `cs-col-7`을 빼 격자 전체 폭을 쓰고, `align-items:center; text-align:center`로 eyebrow·h2를 가운데 정렬한다. 7열 제한이 없어 PC·모바일 같은 규칙이다. 다른 페이지는 기본 start라 영향 없다.
- 강조: SERVICES "형식", PROCESS "네 단계".
- C3/C4: 두 부제를 데이터·렌더에서 삭제. 부제가 없으면 `lead` 요소가 렌더되지 않고, 머리 아래 간격은 기존 `--cs-head-gap` 하나만 남는다.
- C5: "받는 것 · …" 줄 4개와 라벨·output 데이터 삭제.
- C6: 4단계 설명을 지정 문구 그대로 교체(이름 상담·기획·제작·납품 유지).
- 단계 그리드: 행은 기존 왼쪽 정렬 유지. 모바일은 `"art name" / "text text"`(이름을 그림 옆 세로 가운데), 768 이상은 `art / name / text`. 4열·2×2 구성은 그대로다.

## 강조 방식
`CsSectionHead`가 `title` 문자열에서 `emphasis`의 첫 일치 위치를 찾아 그 구간만 `<em className="cs-head-em">`로 감싼다. 데이터는 `title`(그대로)과 `titleEm`(강조 글자) 두 필드다. 글자가 지워지지 않아 스크린리더 문장이 유지되고, 일치가 없으면 평문으로 렌더된다. 색은 `--cs-accent-text`(eyebrow와 같은 대비 토큰, 어두운 배경에서 `#b9aeff`)다. 이 사이트의 `--violet` 대응 토큰이며 `font-style: normal`이다.

## 실행한 명령과 결과
- `npm run typecheck`: PASS
- `npm run lint`: 오류 0, 기존 경고 1개(`tests/local-admin.test.mjs`)
- `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/content-home.test.mjs tests/content-site*.test.mjs`: 84개 중 pass 84, fail 0

## NOT_RUN
- 브라우저 화면 확인(1440/768/390/360 정렬, 가로 넘침, 강조 색 대비 육안), `npm run build`, 전체 직렬 테스트(`tests/*.test.mjs`).

## 남은 문제
- 공통 `.cs-head--center` 규칙이 `theme.css`에 있어 B3a가 공통 블록 정렬을 건드릴 때 겹칠 수 있다(같은 선택자를 다시 쓰지 말고 이 규칙을 재사용).
- 단계 설명 문구 "최종 편집후"는 지시 문구 그대로 두었다(띄어쓰기 "편집 후"가 맞춤법상 자연스러움).
- 가운데 정렬 머리 아래 4단계 행은 왼쪽 기준이라 PC 1440에서 머리와 행의 시각 대비가 어색한지 검증 담당이 확인해야 한다.
