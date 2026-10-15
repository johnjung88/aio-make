판정: PASS

# R8 W4 — 공개 매니페스트·클라이언트 소재 목록 노출 차단

버전: R8-W4 · 2026-10-16 KST · 기준 HEAD `ea165e8c41f3d94b0d9c9fee22c8238a8fc500ee` · `codex/WRK-20261013-AIO-CONTENT-RENEWAL`.
요청 범위의 수정과 로컬 자체 검증을 완료했다. 다른 AI의 독립 검토·커밋·push·배포 완료 판정은 아니다.

## 변경

- `git mv public/content-examples/MANIFEST.json content/media-manifest.json`으로 원본 출처 증거를 비공개 소스 영역에 보존했다. 이동 전후 SHA-256은 `354fd76535ce0b8ef8947ed79c5dfaa156a734b5a91f94cd7a191afc0800247c`로 동일하다. 매니페스트가 기록한 미디어 79개도 SHA 차이 0이다.
- `lib/content-site/example-media.ts`와 `tests/content-site{,-wpb,-wps1}.test.mjs`의 근거 경로를 갱신했다. 예시 소재 모듈에는 `server-only`를 적용했다.
- AI 카드의 `creator-experience.tsx`가 전체 `EXAMPLE_MEDIA`를 클라이언트로 가져오던 경로를 제거했다. 서버 `landing.tsx`가 카드 4개의 `kind/src/poster`만 선택해 전달한다. 카드 선택·이미지·앞뒤 전환 동작은 유지된다.
- `scripts/prepare-reference-media.mjs`에는 이동한 비공개 근거 위치를 명시하고 출처 보고서를 `public` 내부에 출력하지 못하도록 검사를 추가했다. 기존 스크립트에 옛 예시 매니페스트를 읽는 코드는 없었으며, 별도 `ASSET_MANIFEST.json` 출력 디렉터리가 공개 영역을 가리키는 재발 경로를 막았다. 상대 경로와 junction 별칭도 검사한다.
- 새 `tests/content-site-security.test.mjs`는 비공개 위치, 공개 메타데이터, 서버 전용 소재 경계, 공개 보고서 출력 거부와 junction 우회를 검증한다.

## public 전체 검사

`public/reference-review/`만 제외하고 숨김 파일을 포함한 전체 하위 경로의 `json/txt/md/html/vtt`를 검사했다. 최초 34개 중 고객명·로컬 경로를 포함한 파일은 이동한 매니페스트 1개였고, 남은 33개에서 같은 정보·이메일·전화번호는 0건이다. 실제 고객명은 로컬 작품 카탈로그의 BWL/DR's Secret·YoFree·힐러넷과 요청에 명시된 맥스테크의 한영 표기를 검사했다.

나머지 Markdown의 회사·발표자 이름은 각 파일에 `가상 회사/가상 발표자` 또는 fictional로 표시된 포트폴리오 예시임을 확인했다. 폰트 OFL 원문·검색 인증 파일·공개 데모는 유지했다. 승인된 미디어 파일 자체는 변경하지 않았다.

## 실행한 검증

아래 증거 경로는 `.qa/r8-w4/` 기준이다.

| 검사 | 실제 결과 | 증거 |
|---|---|---|
| `npm run typecheck` | exit 0 | `typecheck.log`, `typecheck-exit.json` |
| `npm run lint` | 오류 0, 기존 `local-admin.test.mjs:110` 경고 1 | `lint.log`, `lint-exit.json` |
| 변경 준비 스크립트 직접 eslint | exit 0 | `lint-script.log` |
| `node --conditions=react-server --experimental-strip-types --test --test-concurrency=1 tests/*.test.mjs` | 185개: 184 PASS / 0 FAIL / 기존 1 SKIP | `tests.log`, `tests-exit.json` |
| 새 스냅샷 공개판 포그라운드 빌드 | 1회, exit 0, BUILD_ID `xkvPyktnWoTk0fCNkzVlD` | `snapshot.json`, `build-started.json`, `build-public.log`, `build-exit.json` |
| 공개 메타데이터 33개와 실제 HTTP 파일 응답 33개 | 고객명·로컬 경로·출처 지문·이메일·전화번호 0건 | `audit.json` |
| `.next/static`의 JS/CSS 등 전체 텍스트 77개 | 금지 정보 0건, 매니페스트 파일시스템 경로·전체 소재 목록 지문 0건 | `audit.json` |
| 공개 정상 응답 51개 | sitemap의 전체 공개 페이지와 홈·서비스 6종·robots·웹매니페스트, 금지 정보 0건 | `audit.json` |
| 기존 `/content-examples/MANIFEST.json` | **404**, noindex, 매니페스트 본문·해시 없음 | `audit.json`의 `notFound` |
| 비공개 새 위치 추측 URL 3개 | `/content/media-manifest.json`, `/media-manifest.json`, `/docs/renewal-2026-10-13/media-manifest.json` 모두 404/noindex | `audit.json` |
| 기존 고객 상세 게이트 2개 | 공개판에서 모두 404/noindex | `audit.json` |
| 카드 변경 실브라우저 | Chrome 390/1440px, 카드 4개 각각 이미지 로드·한 바퀴 전환·앞뒤 전환 PASS, 가로 넘침 0, 콘솔/pageerror 0; 화면 직접 확인 | `browser.json`, `shots/creator-{390,1440}.png` |
| 원본·스냅샷 일치 | 매니페스트 동일, 미디어 79개 변경 0, 앱·컴포넌트·lib·scripts·tests·content의 스냅샷 이후 변경 0 | `before.json`, `audit.json`의 `integrity` |
| 보호 서버 | 3215/PID **22076** 유지, 기존 BUILD_ID SHA 동일 | `protected-final.json` |
| 검사 서버 정리 | 소유한 3218/PID 412만 종료, 해당 listener 없음 | `server-owner.json`, `server-stopped.json` |
| `git diff --check`, staged diff check | exit 0 | 실제 실행 |

스냅샷은 `src/`에 소스 1,532개를 복사하고 비밀 환경 파일을 제외했다. `public`·`node_modules`는 각각 로컬 junction이며 QA 설정만 `cpus:1`, `webpackBuildWorker:false`다. 공개판은 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=0`, `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NODE_OPTIONS=--max-old-space-size=1536`으로 빌드했다. 원 작업트리의 설정·실행 중인 3215 빌드는 교체하지 않았다.

감사는 매니페스트의 로컬 원본·QA 증거 경로와 SHA 등 비공개 문자열 144개도 대조했다. 화면 표시에 필요한 승인된 미디어 URL은 HTML/RSC와 기존 홈 카드 데이터에 남는다. 매니페스트의 로컬 경로·해시나 전체 예시 소재 목록을 클라이언트 번들에 넣지 않는 것이 이번 경계다. 고객명·매니페스트명이 포함된 404 요청에서는 Next가 요청 URL/세그먼트를 응답에 반사하므로 그 요청값만 제외하고 본문 유출을 검사했으며, 중립적인 없는 URL의 404 본문도 별도로 검사했다.

초기 보조 검사에서 RSC escape 토큰·404 요청값 반사를 유출로 오인했고, 카드의 지연 이미지 로드를 기다리지 않아 브라우저 검사가 한 차례 실패했다. 검사기를 수정해 동일 빌드에서 통과했으며 최초 증거는 `audit-first-false-positive.*`, `browser-first-failure.*`로 보존했다. 빌드는 추가 실행하지 않았다.

## 남은 일

W4 필수 잔여는 없다. 커밋·push·운영 반영은 조율자 후속 작업이다. `HANDOFF_RESUME.md`와 작업 중 조율자가 추가한 W5 명세 변경은 이번 워커 수정에 포함하지 않았다. 3215 서버·기존 자료·원본 미디어를 보존했고 외부 게시·패키지 설치·결제·계정 변경은 하지 않았다.
