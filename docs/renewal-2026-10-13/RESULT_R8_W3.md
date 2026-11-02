판정: PASS
3215 PID: 22076

# RESULT R8 W3 — 영상 통합·최종 빌드·검토 서버 교체

버전: R8-W3 · 2026-10-16 KST · HEAD `03ce0e4297c8d2f857ef223aa672f0ba150e5cc6` · `codex/WRK-20261013-AIO-CONTENT-RENEWAL`.
요청 범위의 로컬 통합과 자체 검증을 완료했다. W2의 미완료 인계 이후 결과이며, 다른 AI의 독립 검토·사용자 디자인 승인·배포 판정은 아니다.

## 결과와 변경

- `RESULT_R8_W2.md`의 재개 실행본, `SPEC_R8_W2_VIDEO.md`, W2b·W2c의 PASS 보고와 최종 파일을 확인했다. `lib/content-site/r8-media.ts`의 웹툰·AI·모션그래픽·브랜드·SNS 히어로 5개에 최종 MP4·포스터를 연결하고 웹툰 치수를 720×1080으로 맞췄다.
- 전체 테스트에서 빠진 소재 등록 1건을 발견했다. `public/content-examples/MANIFEST.json`에 최종 영상·포스터 10개와 SHA-256, 제작 설정·원본 감사·최종 검증 근거를 추가했다. `tests/content-site-wps1.test.mjs`는 해당 근거 및 영상·포스터 해시를 검증하도록 보완했다. 기존 W1 출처 기록은 보존했다.
- 브라우저에서 브랜드 확대 효과로 버튼의 실제 크기가 44px 미만이 되는 문제를 발견했다. `brand-film.css`에서 해당 조작 버튼의 최소 크기를 51px로 보정해 축소 상태에서도 44px 이상을 확보했다.
- 직접 화면 확인에서 가로형 릴의 버튼이 자막을 가리는 문제를 발견했다. `service-editorial.css`에서 모션그래픽·브랜드 히어로의 조작부를 영상 아래로 옮겼다. 영상 자체의 16:9는 유지하며 자막과 조작부가 겹치지 않는지 실측했다.
- W2의 홈 캐러셀 크롭 보정을 최종 빌드에 포함했다. 360·390px에서 내부 이미지가 278×320px 슬롯을 채우며 일반 이미지 5종은 `cover`, 승인된 기존 AI 카드는 `contain`이다. 768·1440px에서도 여섯 카드 각각을 확인했다.
- 히어로·서비스 영상 파일은 재렌더하거나 덮어쓰지 않았다. R7 영상 두 파일도 보존했고 현재 앱·컴포넌트·라이브러리의 R7 영상 참조는 없다.

## 최종 영상 재측정

모두 H.264·30fps·AAC 1트랙이다. 음량은 완성 MP4를 다시 측정한 `input_i/input_tp`이며, AAC 인코더의 128k 목표와 실제 평균 비트레이트는 구분한다.

| 영상 | 길이 | 해상도 | bytes | 실측 AAC kbps | LUFS / dBTP |
|---|---:|---|---:|---:|---|
| 홈 | 68.000초 | 1920×1080 | 10,789,826 | 135.536 | -16.16 / -0.76 |
| 웹툰 | 29.800초 | 720×1080 | 4,975,464 | 128.259 | -16.03 / -4.67 |
| AI 인플루언서 | 29.633초 | 720×1280 | 2,642,726 | 129.438 | -16.05 / -2.02 |
| 모션그래픽 | 29.533초 | 1280×720 | 3,351,347 | 138.833 | -16.04 / -1.61 |
| 브랜드 홍보 | 30.000초 | 1280×720 | 4,382,523 | 127.959 | -16.16 / -1.41 |
| SNS 광고 | 29.533초 | 720×1280 | 2,960,956 | 141.505 | -16.02 / -3.70 |

6편의 길이·해상도·코덱·오디오·용량·음량 기준을 통과했다. 새로 추출한 44개 대표 프레임의 시트를 직접 보았고 자체 자막 고객명·제외 장면·자막 잘림을 발견하지 않았다. 로고·제품 라벨·승인된 원본 표기는 허용 범위를 따랐다. W2b·W2c의 더 촘촘한 컷별 검수와 원본·음악 근거는 해당 보고를 유지한다. 전체 프레임 OCR이나 사람의 음악 청취를 했다는 의미는 아니다.

음악·푸터 표기는 기존 승인대로 FreePD(CC0)의 Kevin MacLeod·Bryan Teoh·Rafael Krux다. 음원 사본 추가·유료 생성은 하지 않았다.

## 실행과 검증

| 검사 | 실제 결과·증거 (`.qa/r8-w2/` 기준) |
|---|---|
| `python .qa/r8-w2/final-media.py` | PASS, 6편 재측정·44프레임 추출, `final-media.json`, `frames/*-contact.jpg` |
| `npm run typecheck` | exit 0, `typecheck.log` |
| `npm run lint` | 오류 0·기존 `local-admin.test.mjs` 경고 1, `lint.log`; 변경 테스트 파일 추가 lint exit 0, `lint-w3.log` |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | 최종 182개 중 181 pass·0 fail·1 skip, `tests-final.log`; skip은 검토 플래그 없는 체크아웃의 로컬 파생 소재 검사 |
| 스냅샷 | `snapshot.cjs`, 소스 1,528개 복사, 비밀 환경 파일 제외, public/node_modules는 로컬 junction. QA 설정만 `cpus:1`, `webpackBuildWorker:false` |
| 검토판 `node ./node_modules/next/dist/bin/next build` | 포그라운드 exit 0, BUILD_ID `-Pmf-fWJ5BEoV4epo0ieI`, `build-review.log`, `build-review-exit.json` |
| 공개판 동일 명령 | 검토판 검증·서버 종료 후 단독 실행, exit 0, BUILD_ID `UyW5z4JF0XvCsuK7opo6b`, `build-public.log`, `build-public-exit.json` |
| 최종 브라우저 | 검토·공개판 각각 35항목 PASS·콘솔/pageerror 0, `browser-review.json`, `browser-public.json`, `shots/{review,public}/` |
| 캐러셀 | 각 판 4폭×6카드=24상태 PASS, 슬롯 채움·크롭 실측 및 캡처, 위 browser JSON의 `crop` |
| 공개판 금지 문자열 | 정적 JS/CSS 등 77파일·HTML 48페이지, 금지 문자열 0건·실패 0, `public-scan.json` |
| 상세 경로 게이트 | 지정 2경로는 검토판 200/noindex, 공개판 404/noindex. `review-gates.json`, `public-scan.json`; 기존 WORKS 권리·사이트맵 게이트 유지 |
| 소스·원본 보존 | 앱/컴포넌트/라이브러리/테스트 265파일의 현재 소스와 스냅샷 SHA 차이 0, 원본 88파일 SHA 차이 0, `source-fidelity-w3.json`, `original-integrity-w3.json` |
| 3215 교체 후 확인 | 홈·서비스 6종·검토 상세 2경로 총 9경로 200/noindex, 홈 실제 재생·키보드 소리 켜기·reduced-motion 정지 PASS·콘솔 오류 0, `smoke-3215-w3.json` |

브라우저 검사는 360·390·768·1440px의 홈+서비스 6종(총 7경로)을 대상으로 했다. 영상 6편은 무음 자동재생·키보드 소리 켜기(`muted=false`, `aria-pressed=true`)·끄기·다른 릴의 소리 우선권·재생/정지·44px 이상 버튼을 검사했다. 페이지 전체를 스크롤하며 가로 넘침 0을 확인했다. reduced-motion에서는 모든 경로의 자동재생이 없고 영상 6편의 수동 재생이 가능했다. 애니메이션은 승인된 이미지 히어로이며 새 서비스 영상 대상이 아니다. 최종 프레임 시트, 모바일 히어로·자막/조작부, 캐러셀 6장과 데스크톱 크롭을 직접 확인했다.

재개 절차는 `finish.ps1`에서 이어받았다. 매니페스트 실패를 수정한 뒤 `finish-w3.ps1`을 사용했고, 자막 가림을 직접 발견한 시점에 진행 중 검토 빌드 1회를 명시적으로 중단했다(exit -1, `build-review-w3-interrupted.log`, `src/.next-w3-before-widefix/` 보존). 이후 `preflight-w3.ps1`로 최종 소스·테스트·dev 검증을 마친 다음 `build-final-w3.ps1`로 최종 검토판·공개판을 각각 1회씩 순차 빌드했다. 불명확한 실행을 재시도하거나 빌드를 병렬 실행하지 않았다. 기존 실패 증거는 `tests-w3-first-failure.log`, `browser-w3-brand-control-failure.json`에 보존했다.

## 남겨 둔 검토 서버

- 주소: `http://localhost:3215/content` — **PID 22076**, 검토판 BUILD_ID `-Pmf-fWJ5BEoV4epo0ieI`.
- 실행 위치: `.qa/r8-w2/src`, 명령: `node ./node_modules/next/dist/bin/next start -p 3215`.
- 최종 빌드 위치: 검토판 `src/.next/`, 공개판 보존본 `src/.next-public/`. 공개판을 보존 이동한 뒤 검토판 `.next-review`를 `.next`로 복구했다. 기존 보호 미리보기의 빌드 파일은 보존했다.
- 최신 지시에 따라 기존 **PID 14204를 종료**했고 신규 listener가 22076인지 확인했다. 최종 3218 임시 서버는 종료됐다. 3215 교체 절차·소유 기록: `promote-review-w3.ps1`, `replaced-3215-w3.json`, `server-3215-owner-w3.json`, `server-3215-w3.log`.
- 새 서버와 빌드에 적용한 값: `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, 검토판 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, `NODE_OPTIONS=--max-old-space-size=1536`. 공개판 빌드·검증 때만 검토 플래그를 `0`으로 적용했다. 저장된 계정·자격 증명·운영 환경 파일은 바꾸지 않았다.
- 시작 로그의 중복 lockfile에 따른 작업 루트 추정 경고는 남아 있으나 빌드·HTTP·브라우저 검사 실패는 없다.

## 남은 일·NOT_RUN

이번 W3 필수 잔여는 없다. 다른 AI의 독립 검토와 사용자 최종 디자인 확인은 후속 단계다. 실제 휴대폰·Safari/Firefox·사람의 음악 청취·운영 문의 저장/메일/GA4·CI·실사용은 NOT_RUN이다. W1의 보조 샘플·훅·제품·AI 사례 빈 영상 슬롯은 이 영상 6편 명세 밖이며 기존 상태다.

커밋·push·배포·외부 게시·패키지 설치·결제·계정 변경을 하지 않았다. 기존 사용자/W1/W2/W2b/W2c 변경과 원본을 보존했으며 현재 전체 git diff를 이번 W3 변경으로 주장하지 않는다.
