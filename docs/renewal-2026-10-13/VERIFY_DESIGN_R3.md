# R3 독립 검증 결과

2026-10-14 · 담당 Codex 검증 서브에이전트 · 기준 R2 e53e108 → R3 미커밋 후보

## 판정

기능 검증 PASS, 실제 화면에서 R2 대비 개선 확인, 사용자 디자인 확인 전
구현 A/B의 자기 점검과 별개로 격리 production build 및 실제 Chrome 화면을 검증자가 확인했다
최상의 디자인이라는 확정이나 사용자 승인·배포 완료를 뜻하지 않는다

## 실제 실행

- 타입 검사 PASS, lint 0오류·기존 테스트 unused options 경고 1건
- 최초 전체 직렬 테스트 99개: 93 PASS / 5 FAIL / 기존 로컬 미디어 1 SKIP
- 실패 5개: 폐기된 UI 구조 기대·CSS 선택자 파싱·FAQ 문장 기대 3건을 행동 계약 보존하며 갱신, 구현의 미디어쿼리 폰트 크기·SEO 쉼표 2건은 B가 수정
- 영향 테스트와 새 장면 자산 SHA/디코드 테스트 합계 42 PASS / 0 FAIL, 전체 테스트를 다시 전부 실행했다고 보고하지 않음
- 공개 OFF 빌드 PASS, 8경로×1440/390=16화면 모두 200·넘침0·첫 미디어 로드 완료
- 공개 화면/성공적으로 읽은 JS·HTML·RSC 응답에서 검토용 고객 카탈로그/미디어 문자열 미노출, 검토용 상세 4경로404
- 404의 요청 slug 반영은 작품 노출과 구분해 별도 감사: 요청 slug 외 고객자료0
- OFF 응답 기록364개 중 이동 취소된 prefetch 응답22개는 body 읽기 불가로 제외, 모든 응답을 읽었다고 주장하지 않음
- 검토 ON 빌드 PASS, 10경로×1440/768/390/360=40화면: 200·가로 넘침0·콘솔/JS오류0·화면 텍스트 말미 마침표0·검사 이미지 모두 로드
- 상세25경로 PASS, 컨텐츠 내부 셸·정확한 서비스 복귀·noindex 유지
- PC/모바일 메뉴·사례 실제 클릭 왕복30회 PASS
- 서비스6종 사례가 FAQ 바로 앞, 검정 공통배경·헤더4메뉴·장식 재생/정지 토글 제거 유지
- PC/모바일 메인/컨텐츠 갤러리6탭, 카드 내부 화살표, 키보드 이동·상세 펼침 동작 PASS
- 모바일 서비스6종 하단 상담바: hero 상담 버튼/문의폼 보이면 숨김, 사례 구간에서 복귀 PASS
- reduced-motion 7경로에서 무한 실행 애니메이션·자동재생0
- 네이티브 영상4종 실제 재생시간 진행·readyState4·해상도 확인, 전편 감상/음성 청취 검수는 NOT_RUN
- 최종 시각 수정3파일 원본/스냅샷 SHA 일치 후 최종 build PASS, 수정 영향 PC/모바일만 재검증 PASS

## R2와 실제 화면 비교

| 항목 | R2 | R3 | 판단 |
|---|---:|---:|---|
| 메인 PC 본문 마지막 섹션 끝 y | 9,879 | 7,960 | 약19% 짧아져 서비스/작품 접근 개선 |
| 메인 PC 워크플로우 높이 | 4,960 | 4,150 | 상담부터 실행 흐름을 유지하며 반복 설명 압축 |
| 모바일 서비스 첫 작품 y | 약735~810 | 약304 | 제목 직후 작품을 바로 확인 가능 |
| 메인/컨텐츠 모바일 실제 작품 y | 첫 화면 작품 증거 부족 | 442 / 458 | 첫 화면 안 실제 작업물 확인 |
| 컨텐츠 웹툰 갤러리 | 좁은 한 페이지 | PC 두 페이지, 모바일 원비율 순서 | 읽을 수 있는 작품 비중 증가 |
| AI PC 첫 화면 | 얼굴4개 하단 잘림 | 얼굴4개·이름·제작정보 한 화면 | 최종 수정 후 위계 개선 |

- 컨텐츠 hero의 추상 배경을 실제 영상/웹툰 증거로 교체한 결과 상품 설명과 작품의 연결이 분명해짐
- 서비스별 웹툰 독서본, 애니메이션 장면, 모션 제품 구성, 세로 광고, 브랜드 가로 영상, AI 계정 소개로 시각 증거가 구분됨
- 가격/수정범위/납품물/과정/FAQ는 유지되며 상세 페이지에 목적·제작범위를 앞배치함
- AI 계정별 생활 컷과 기준 컷의 역할/주제를 설명해 단순 캐스팅 사진보다 내용이 구체화됨
- AI 전체 길이는 사진을 크게 보여 주며 늘어났고 모바일 컨텐츠 갤러리도 두 페이지를 읽도록 길어짐, 무조건 페이지가 짧아졌다고 주장하지 않음
- 이미지 선명도는 보존된 원본/영상 프레임의 품질 한계가 있으며 해상도 생성·새 이미지 제작을 한 것은 아님

## 발견 후 구현자에게 재지시한 시각 수정

1. 모션 hero 1440px에서 줄 첫머리로 분리된 ‘·60초’ → ‘30초 또는 60초’로 연결
2. AI PC hero 과대 4인 그리드 → 전체 약600px, 위 정렬로 얼굴4개와 이름을 첫 화면에 표시
3. 메인 개발 등 5단계 lead의 문장 붙음 → 의미를 연결한 각 한 문장으로 편집

최종 화면을 직접 열어 세 항목 해결을 확인했다
QA 복사 스크립트의 AI CSS 하위 경로 누락으로 변경 전 스냅샷 빌드가 한 차례 실행됨
해당 기록은 build-stale-attempt.log에 보존하고 이후 정확한 경로/양쪽 SHA를 대조한 최종 빌드를 검증 기준으로 삼음

## 근거와 최종 스크린샷

근거 루트: `.qa/design-r3-independent/`
`src-manifest.json`, `final-source-hashes.json`, `static-results.json`, `tests.log`, `tests-corrections.log`, `build-public-off.log`, `build-review-on.log`, `build-final.log`, `public-off-results.json`, `public-off-404-audit.json`, `browser-results.json`, `focused-results.json`, `final-results.json`, `final-protection.json`

아래는 실제 viewport 캡처이며 검증자가 이미지 파일을 열어 확인했다

- `shots/final-main-1440.png` — 메인 첫 화면
- `shots/final-content-1440.png` — 컨텐츠 첫 화면
- `shots/final-content-390.png` — 모바일 첫 화면
- `shots/final-ai-influencer-1440.png` — AI4계정 첫 화면
- `shots/final-animation-1440.png` — 애니메이션 첫 화면
- `shots/final-ai-profile-390.png` — 모바일 실제 계정 소개
- `shots/final-main-stage-2-1440.png` — 수정된 개발 소개 문장

## 실행 종료와 미리보기

2026-10-14 10:15 KST QA3215 PID9020 종료 확인
보호3213 PID41252·3214 PID41552 그대로 유지
원본 `.next/BUILD_ID` SHA256 동일: `54E8046B7D219AA9042B8AD1723ADA988C7F8AB5E12CDE8D2191176FB227503B`
3214는 기존 미리보기이며 R3를 반영하지 않았다

새 후보는 아래 PowerShell을 별도 터미널에서 실행한 뒤 http://127.0.0.1:3215 에서 볼 수 있다
3215가 비었는지 먼저 확인하고 다른 소유자의 서버가 있으면 종료하지 않는다

```powershell
Set-Location 'I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL/.qa/design-r3-independent/src'
$env:ENABLE_LEGACY_SUPABASE='false'
$env:AIO_LOCAL_ADMIN_ENABLED='false'
$env:NEXT_PUBLIC_AIO_REFERENCE_REVIEW='1'
$env:NODE_OPTIONS='--max-old-space-size=1536'
node ./node_modules/next/dist/bin/next start -p 3215
```

스냅샷은 원본 `.next`와 격리되어 있지만 `public`/`node_modules`는 원본 junction을 사용하므로 이 두 폴더의 이후 변경은 공유된다
`.env`는 읽거나 스냅샷에 복사하지 않았다
검토 ON에는 공개 권리 UNKNOWN/HOLD인 기존 고객자료가 포함되며 외부 공개 승인을 뜻하지 않는다
Image#1~5 원본 대조, 실제 휴대기기, 문의 저장/메일/GA4, push·배포·P6 폴더 정리 NOT_RUN
영상/장면 자산 권리 확대나 계정 게시·운영 실행 없음
남은 일은 사용자 R3 디자인 확인과 별도 공개/배포 결정
