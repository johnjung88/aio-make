# 디자인 피드백 R2 독립 검증

2026-10-14 09:37 KST · 검증 담당 Codex 서브에이전트 `verify_renewal`

**검증 범위 PASS · 사용자 디자인 확인 대기**

구현 A/B와 분리된 담당자가 실제 Chrome 렌더·클릭·스크린샷을 확인했으며, 구현 담당의 자체 검수와 구분한다
사용자 승인·공개 권리 확인·push·배포·P6 폴더 정리는 수행하지 않았다

## 입력과 안전한 실행

- 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`
- 브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`, HEAD `9b3def8` 위 미커밋 후보
- 최신 지시: Opus/Sonnet 대신 사용 가능한 Codex 서브에이전트 승인, AI 계정은 확인된 **4개만** 반영
- HANDOFF_RESUME·COMMON·CODEX_ASTRA_HANDOFF·기존 VERIFY_FINAL_P2R_FIX·A/B RESULT를 읽고 검증
- I: `AIO_MAIN_2TB` 확인, Windows PowerShell 사용
- 원본 `.next`와 3213/3214를 보호하기 위해 `.qa/design-r2-independent/src`에 소스 복사, public/node_modules만 정션 연결
- `.env`는 복사하거나 읽지 않았으며 검토 플래그를 명시해 실행
- 빌드 2회는 직렬 실행, 두 번째는 실제 화면에서 발견한 3건 수정 후의 필요한 재검증
- Chrome은 한 번에 하나만 실행, 빌드와 브라우저를 동시에 실행하지 않음

## 실제 검증 결과

| 항목 | 판정 | 증거와 범위 |
|---|---|---|
| TypeScript | PASS | 초기 typecheck 0, 최종 빌드의 타입 검사 포함 |
| lint | PASS | 오류 0, 기존 `tests/local-admin.test.mjs:110` unused options 경고 1 |
| 직렬 테스트 | PASS / 기존 SKIP 1 | 전체 99개 최초 95 PASS·3 FAIL·1 SKIP → 구 디자인 계약을 검사하던 3건을 새 요구사항에 맞춰 수정 후 관련 10개 PASS, 최종 수정 영향 36개 PASS |
| 테스트 의미 유지 | PASS | 가격·권리 게이트·파일 SHA·접근성 계약 유지, 흰 배경/3D 캐러셀/모션 토글/옛 카피 마침표 등 폐기된 UI 기대만 교체 |
| 격리 프로덕션 빌드 | PASS | 최초·수정본 모두 exit 0, 30개 정적 페이지 생성, CPU worker 1 |
| PC/태블릿/모바일 | PASS | `/`, `/content`, 서비스 6종, 상담, 인사이트의 10경로 × 1440·768·390·360 = 40화면 |
| 응답·오류 | PASS | 40화면 status 200, 가로 넘침 0, 콘솔/페이지 오류 0, HTTP 오류 0 |
| 공통 배경·헤더 | PASS | 컨텐츠 canvas 모두 rgb(8,8,8), 홈·각 서비스·인사이트·상담 신청, 헤더 모션 토글 0 |
| 문장 끝 마침표 | PASS | main의 실제 보이는 텍스트 노드 40화면+상세25경로에서 말미 마침표 0, 이메일·URL·금액 소수점 보존 |
| 실제 작업 갤러리 | PASS | 메인과 컨텐츠 홈 각각 서비스 6탭에 실제 자료, 화살표 카드 내부, 다음 순환·Home/End 키 이동 |
| 제작사례 순서·정렬 | PASS | 모든 서비스 제작사례 바로 다음 FAQ, 같은 행 사례 CTA 하단좌표 차이 0px |
| 사례·인사이트 상세 | PASS | 서비스 query별 사례 22경로 + 인사이트 글 3경로의 25개 응답200, 컨텐츠 셸 유지·넘침0·noindex 유지 |
| 실제 메뉴/사례 클릭 | PASS | 1440·390에서 총 30회: 3메뉴 이동, 각 서비스6종 선택→첫 사례 상세→해당 서비스#works 복귀 |
| AI 인플루언서 | PASS | 기록하는87·옆집엄마·그레이스의정원·쌀만드는아저씨 4카드, 각 프로필·3장 피드, 확인된 핸들만 표시, 허구의 팔로워/성과 없음 |
| 이미지 | PASS | 서비스 주요 이미지 로드, 웹툰12컷은 실제 각컷 스크롤 후12/12 decode 성공, AI12피드 모두 decode 후 캡처 |
| 접근성 일부 | PASS | 메뉴 Escape 닫힘·포커스 복귀, 갤러리 키보드 이동, 페이지별 h1, 이미지 alt·표시 문구 확인 |
| reduced motion | PASS | 컨텐츠 홈+서비스6종에서 무한 애니메이션·자동재생 0 |
| 영상 기술 재생 | PASS | 애니메이션 사례1편의 native video play 후 currentTime 1.278초·readyState4, 이후 정지 |
| 원본 미리보기 보호 | PASS | 마지막 3213 PID41252·3214 PID41552 유지, 원본 BUILD_ID 해시 동일, QA3215 종료 |

테스트 최초 실패 로그를 지우지 않았으며 전체99개를 수정 후 다시 실행했다고 주장하지 않는다
SKIP은 기존 `reference-release.test.mjs`의 `Local media excluded from release checkout` 조건이며, 로컬 이미지의 실제 브라우저 확인과 구분한다
최종 소스/스냅샷 해시 대조에서 실행 코드와 테스트 차이 0, B 결과문서 갱신만 차이로 남았다

## 실제 시각 검토와 수정

자동 구조 검사만으로 디자인을 통과시키지 않고 데스크톱·모바일 스크린샷을 직접 열었다

| 발견 문제 | 구현 담당 수정 | 실제 재확인 |
|---|---|---|
| 메인 마케팅 카드 하단 캡션이 마지막 운영 항목을 가림 | A: 운영 설계를 상단 정상 흐름으로 이동, 이미지 카드만 캡션 | 4폭 PASS, 마지막 행 가림 해소 |
| 컨텐츠 과정 소개의 두 문장이 한 줄에 붙음 | A: lead에 white-space pre-line | 4폭 PASS, 실제 두 줄 확인 |
| 브랜드필름1296px 프레임에서 이미지가1014px만 차고 오른쪽이 비어 있음 | B: width100%, max-height 해제,16:9 명시 | 4폭 PASS, 프레임·이미지 너비 일치 |

내용과 시각 구성은 다음 근거로 **사용자 확인 가능한 후보**로 판단한다

- 메인: 3분야 카드의 제목·설명·실제 컨텐츠/개발 자료가 구분되고, 마케팅은 실적으로 꾸민 그래프 대신 운영 항목을 제시함
- 메인 과정: 상담·브랜드 가이드·개발·컨텐츠·마케팅 5단계가 각각 자료와 결과물로 설명됨, 모든 중간 단계 화면도 별도 캡처해 읽음
- 컨텐츠 홈: 실제 작업물·한줄 설명·활용 범위·시작가·상세 이동을 같은 갤러리 안에서 비교할 수 있음, 과정4행에는 수정 횟수와 받는 결과물을 함께 표시함
- 웹툰: 실제12컷 리더, 컷별 납품 설명, 모션코믹 옵션과 제작사례 유지
- 애니메이션: 그림체3종과 줄거리·캐릭터·동작 확인 단계가 있어 장식 제거가 정보 삭제로 바뀌지 않음
- AI: 4계정 얼굴과 성격·콘셉트·3장 피드를 실제 채택 이미지로 제시함, 공개계정 운영 실적으로 오인할 지표를 추가하지 않음
- 모션그래픽: 단순형/맞춤형 범위와 프레임 구성을 설명하고 작업 사례로 연결함
- 브랜드필름:30초/60초 구성과 브랜드 질문, 사례가 유지되며 프레임 결함을 수정함
- SNS 광고: 첫 장면·제품·마무리의 역할과 납품 규격을 설명하고 실제 사례6개를 보여줌
- 공통: 검정색 바탕과 제목/본문 위계는 유지하면서 서비스별 그림체·리더·피드·장면 구성을 달리함

이는 독립 검증자의 구성·가독성 판단이며 사용자의 미적 만족이나 승인으로 대체하지 않는다
컨텐츠 쇼릴은 아직 제공 전이며 히어로 연출 예시를 실제 쇼릴이라고 평가하지 않았다

## 대표 화면

아래 `final-` 파일은 수정 후 실제 viewport 캡처이며 직접 열어 확인했다
초기 section/element 캡처 일부는 긴 영역을 캡처하는 과정에서 fixed header/CTA가 중간에 보일 수 있으므로 최종 비교에는 아래 파일을 우선 사용한다

- [컨텐츠 홈 데스크톱](../../.qa/design-r2-independent/shots/final-content-top-1440.png)
- [실제 작업 갤러리](../../.qa/design-r2-independent/shots/final-content-gallery-1440.png)
- [AI 4계정 한 화면](../../.qa/design-r2-independent/shots/final-ai-roster-1440.png) —1440×1650 viewport
- [메인 서비스 카드](../../.qa/design-r2-independent/shots/final-main-services-1440.png)
- [컨텐츠 홈 모바일](../../.qa/design-r2-independent/shots/final-content-top-390.png)
- [모바일 AI 카드](../../.qa/design-r2-independent/shots/final-ai-account-3-390.png)
- [과정4행](../../.qa/design-r2-independent/shots/final-content-process-1440.png)
- [브랜드필름 프레임 수정](../../.qa/design-r2-independent/shots/final-brand-film-1440.png)

## 실행 증거

루트 `.qa/design-r2-independent/` 안에 보존

- `typecheck.log`, `lint.log`, `tests.log`, `tests-contract-corrections.log`, `final-targeted-tests.log`
- `build.log`, `build-result.json`, `build-fixes.log`, `build-fixes-result.json`
- `browser-results.json`:40화면·25상세·7 reduced-motion 결과
- `focused-results.json`:30회 클릭·웹툰12컷 decode
- `fixes-browser-results.json`:수정 영향4폭·영상재생
- `src-manifest.json`, `final-source-manifest.json`, `fix-files.json`
- `final-protection.json`:보호포트·BUILD_ID·QA 종료, 마지막 여유 RAM3523MB

원본 `.next/BUILD_ID` SHA256 `54E8046B7D219AA9042B8AD1723ADA988C7F8AB5E12CDE8D2191176FB227503B`

## 새 후보 재실행 방법

**3214는 기존 사용자 미리보기이며 R2 변경이 반영된 주소가 아니다**
검증 완료 후3215는 종료했다
아래 격리 빌드가 남아 있으므로 재빌드 없이 새 후보를 다시 띄울 수 있다
3215가 비어 있는지 확인하고 사용하며3213/3214의 프로세스는 종료하지 않는다

```powershell
$candidate = 'I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL/.qa/design-r2-independent/src'
if (Get-NetTCPConnection -State Listen -LocalPort 3215 -ErrorAction SilentlyContinue) { throw '3215 사용 중' }
$env:ENABLE_LEGACY_SUPABASE = 'false'
$env:AIO_LOCAL_ADMIN_ENABLED = 'false'
$env:NEXT_PUBLIC_AIO_REFERENCE_REVIEW = '1'
$env:NODE_OPTIONS = '--max-old-space-size=1536'
Set-Location -LiteralPath $candidate
node ./node_modules/next/dist/bin/next start -p 3215
```

접속 `http://127.0.0.1:3215` · `/content` · `/content/services/ai-influencer`
종료는 이 명령을 실행한 터미널에서 Ctrl+C
숨김 프로세스로 재실행할 때는 Start-Process -WindowStyle Hidden과 별도 PID·로그를 기록하고 종료 시 해당 PID의3215 소유권을 확인한다
원본 소스가 추가 변경되면 이 스냅샷은 자동 갱신되지 않는다

## 한계와 남은 일

- NOT_RUN: Image #1~5 원본이 미첨부되어 해당 이미지와의 직접 대조
- NOT_RUN: 실물 iOS/Android·Safari·음성 스크린리더·모든 WCAG 항목 감사
- NOT_RUN: 문의 전송/DB 저장/메일/GA4, 모든 동영상의 연속 시청·음성 청취
- NOT_RUN: 사용자 디자인 승인·공개 권리 승인·push·배포·P6 정리
- 고객 자료의 review 게이트·noindex·사이트맵 제외는 유지, 공개 승인을 이번 QA로 대체하지 않음
- 사용자에게 새 후보 화면을 보여주고 피드백을 받는 단계
