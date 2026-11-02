판정: FAIL

# RESULT R8 W2 — 통합 미완료 인계

버전: R8-W2 · 2026-10-16. 히어로·UI 구현과 아래 자체 검증은 완료했지만 요청 범위 전체는 미완료다. 이 보고는 의존성 차단에 따른 실패 결과이며 배포·독립 검토·전체 완료 판정이 아니다.

## 최종 판정 사유와 의존성

- 조정자의 2026-10-16 병렬 분할 지시를 반영했다. W2 담당은 크롭·히어로·소리 UI·슬롯 연결·최종 빌드/검증이며 서비스 영상은 W2b(웹툰·AI)와 W2c(모션그래픽·브랜드·SNS)가 최종 검수한다.
- `RESULT_R8_W2c.md` 첫 줄 PASS를 읽었고 3편의 최종 360px 프레임 시트를 직접 확인했다. `RESULT_R8_W2b.md`는 아직 없어 서비스 슬롯 5개의 src/poster를 W1 대기 상태로 유지한다.
- 두 보고가 PASS가 된 뒤 연결·최종 빌드를 하라는 조정자 게이트 때문에 전체 직렬 테스트와 검토판/공개판 최종 빌드·6경로 브라우저 검증은 NOT_RUN이다. 이 때문에 전체 판정은 FAIL이다.
- 최종 읽기 확인에서도 W2b Dispatch `ctx_f0c03e4938c8`은 `start_unknown / pending / turn_start_unobserved`, liveness는 `unverifiable / missing_status`였다. 프로세스 종료나 실패로 단정하지 않았고 재시작·입력·타 워커 리소스 조치를 하지 않았다. 증거: `.qa/r8-w2/worker-state-final.json`.
- 조정자에게 진행·차단 상태를 여러 번 전달했고 질문 `msg_ad1d747707da`의 최초 10분 대기와 동일 ID 재개 10분 대기 모두 답변 없이 timeout됐다. 질문을 중복 생성하거나 두 PASS 게이트를 우회하지 않았다.
- 서비스 5종은 분할 지시 수신 전에 W2가 이미 후보를 렌더했다. 이후 해당 소유 범위를 넘겨 서비스 렌더/수정을 중단했고, W2c가 개선한 최종 파일을 정본으로 읽었다. W2b의 최종 채택/보정은 대기한다.

## 실제 영상 사양

표의 B2종은 검수 전 후보이며 아직 사이트에 연결하지 않았다. AAC 인코더 설정은 `-b:a 128k`이며 파일의 실제 평균 비트레이트와 구분한다.

| 영상 | 길이 | 해상도 / 30fps | 용량 | 오디오 / 최종 input_i | 상태 |
|---|---|---|---|---|---|
| 홈 히어로 | 68.000초 | 1920×1080 | 10,789,826 bytes | AAC / -16.16 LUFS | 히어로 자체 검사 PASS |
| 웹툰 | 29.800초 | 720×1080 | 4,957,272 bytes | AAC / -16.03 LUFS | W2b 검수 대기, 분할 전 후보 |
| AI 인플루언서 | 29.633초 | 720×1280 | 2,621,721 bytes | AAC / -16.05 LUFS | W2b 검수 대기, 분할 전 후보 |
| 모션그래픽 | 29.533초 | 1280×720 | 3,351,347 bytes | AAC / -16.04 LUFS | W2c PASS 보고 확인 |
| 브랜드 홍보 | 30.000초 | 1280×720 | 4,382,523 bytes | AAC / -16.16 LUFS | W2c PASS 보고 확인 |
| SNS 광고 | 29.533초 | 720×1280 | 2,960,956 bytes | AAC / -16.02 LUFS | W2c PASS 보고 확인 |

히어로 SHA256: `3c6b562ef0255775b8851b5acef1a01fa1241a90ee9a2a350fed5b66bb66b0eb`. 최종 완성 MP4의 loudnorm `input_i=-16.16`, `input_tp=-0.76`, `input_lra=3.00`이며 output_*를 실측값으로 바꾸어 쓰지 않았다. 포스터는 `public/content-home/hero-reel-r8.webp`다.

## 구현·검증 완료

- W1 잔여 크롭 후보를 `content-home.css`에 그대로 적용했다. 홈 선검증에서 390px 화면의 실제 이미지 278×320px, `object-fit:cover`를 확인했다(슬롯 테두리를 제외한 내부 폭).
- 히어로: 68초, 6장면×5단계, 승인 자막, L1 세로/ L2 가로 패널 이동·완성 패널 확대·실제 영상 발췌. R7과 같은 HTML `render(t)`/`renderAsync(t)`→Playwright JPEG→ffmpeg 방식이다. 이번 합성은 Canvas로 그리며 `window.ready`, 폰트 로드, 40장 이하 이미지 캐시, 600프레임 단위 소유 Chrome 재시작을 유지한다.
- 히어로 전용 2초 구간은 긴 서비스 소스와 별도로 추출했다. 원본 영상 소리는 `-an`으로 제거하고 지정 음악만 AAC로 넣었다. 별도 성우·기존 BGM·효과음은 없다.
- 합성본의 S1 고객명 소제목과 모션그래픽 CASE/고객명 제목을 정리했다. 제품 라벨·로고는 허용 범위로 유지했다. AI 장면과 SNS AI 인물, 여는 격자에 AI 고지를 넣었다. 원본 파일은 수정하지 않았다.
- 히어로 대표 프레임 9장 추출: `.qa/r8-w2/frames/hero/`. 30패널 전체의 중간 시점에서 자체 자막 금지 문자열·화면 밖 글자 0건, 이미지 캐시 40장 이하. 승인 최소 크기인 라벨 80px와 설명 56px를 유지했다(360px 축소 시 15px/10.5px).
- 소리 UI: 홈과 `ReelPlayer hero`에 재생/정지 옆 버튼, `aria-pressed`, 키보드 포커스, 기본 무음, 다른 릴이 소리를 켜면 이전 릴 음소거, 숨김 탭 음소거. 샘플·사례 영상에는 소리 버튼을 추가하지 않았다.
- 브랜드 검토판에서 기존 대표 작품이 새 릴을 가리는 경우를 정리했다. 최종 reel src가 있으면 R8 히어로를 우선하고 기존 검토 작품 분기/WORKS 게이트는 유지한다.
- 푸터: `음악: FreePD(CC0) · Kevin MacLeod · Bryan Teoh · Rafael Krux`.

## 명령과 실제 결과

| 명령 / 검사 | 결과 / 증거 |
|---|---|
| 순차 `build.py <id> prepare/shots/render/encode/verify`, 히어로 구간 보정 | 완료, `.qa/r8-w2/prepare.log`, `render-all.log`, `refine-hero.log`, `hero-caption-pass.log` |
| `python .qa/r8-w2/layout-check.py hero` | PASS, 30시점/실패 0, `layout-check.json` |
| ffprobe + 완성 MP4 loudnorm | 위 사양, `hero-spec.json`, `hero-final-loudnorm.log` |
| `npm run typecheck` | exit 0, `typecheck.log` |
| `npm run lint` | exit 0, 오류 0/기존 경고 1, `lint.log` |
| 격리 dev 홈 Playwright | 360·390·768·1440px: 기본 무음 자동재생, Enter 소리 전환, aria-pressed, 다른 릴 음소거, 소리 끄기, 정지/재개, 가로 넘침 0, 버튼 44px 이상, 콘솔 오류 0 |
| reduced-motion 홈 | 자동재생 없음(시간 0), 수동 재생 PASS |
| W1 크롭 | cover, 내부 이미지 278×320, `browser-dev-home.json` |
| 격리 환경 | `.qa/r8-w2/src`, public/node_modules junction, 비밀값 미복사, QA 전용 cpus=1/webpackBuildWorker=false |
| 종료 | 선검증용 3218 서버와 작업 Chrome/Playwright 종료, 3215 PID 14204 유지 |

선검증 초기에 서버 준비 전 접속/첫 dev 컴파일 타임아웃과 이름이 바뀐 토글 버튼을 찾는 검사 스크립트 문제가 있었다. 서버 준비 및 DOM/영상 준비 조건을 확인하고 버튼의 바뀐 이름을 반영한 뒤 재실행한 최종 `browser-dev-home.json`은 5검사 PASS/오류 0이다. 이 결과는 최종 프로덕션 빌드 검증을 대신하지 않는다.

## 음악·크레딧

- m01 Arpent — Kevin MacLeod(히어로), m02 Slice of Life — Bryan Teoh(웹툰), m03 Patron Saint of Heists — Bryan Teoh(AI), m04 Goodnightmare — Kevin MacLeod(모션그래픽), m05 Motions — Rafael Krux(브랜드), m06 Backbeat — Kevin MacLeod(SNS).
- `.qa/r8-music/` 제공 원본을 직접 디코딩해 STFT flux/자기상관과 위상 격자로 재측정했다. 60~200 BPM 재검색에서도 120/145/85/130/120/130 격자가 확인된다. 웹툰 72.5/145, AI 85/170, Goodnightmare 65/130 및 86.66의 분할 후보도 기록했다. 선택 격자는 승인안의 마디 해석을 따른다.
- `music-analysis.json`, `music-crosscheck.json`에 곡 SHA256·BPM·위상·관련 피크가 있다. 사람의 청취를 했다는 뜻은 아니다.
- 근거는 승인된 기존 `license-evidence-r8/` FreePD CC0 자료다. 음악 파일 사본을 저장소에 넣지 않았다. 80ms 페이드 인/마지막 3초 페이드 아웃 후 2-pass -16 LUFS 정규화를 사용했다.

## 보존·제한

- 기존 W1 및 사용자 변경을 보존했다. `public/reference-review/`와 고객 폴더는 읽기만 했다. 사용 원본 SHA는 `.qa/r8-w2/source-manifest.json`, 최종 88개 원본 재검사는 `original-integrity-final.json`에 있으며 변경 0건이다. 추가 히어로 소스도 추출 전후 SHA 일치를 검사했다.
- `public/content-home/hero-reel-r7.*`는 삭제/덮어쓰기하지 않았으며 홈 영상 경로는 R8이다.
- 3215 PID14204 보호, 기준 BUILD_ID SHA는 `2F0AD084451C9C505F426B7CAA7D37E0E19C7D4F904DF2491F25363D7A3BB4C5`다.
- 볼륨 I는 사전 확인에서 Warning/Scan Needed였다. 미사용 보관 디렉터리 2곳 열거 시 error1392가 있었으나 선택한 렌더 입력은 읽기/해시 검사를 통과했다. 디스크 수정·복구는 실행하지 않았다.
- 커밋·push·배포·패키지 설치·유료 생성·계정 변경·외부 게시를 하지 않았다.

## NOT_RUN와 다음 행동

1. 조정자가 W2b 실제 시작 상태를 확인하고 최종 검수/PASS를 확보한 뒤 서비스 5종 src/poster 연결. AI 기존 후보의 일정표/프로필 하단이 설명 자막과 가까운 구간은 보정이 필요하다. 공통 renderer의 diagram 높이 640 보정 후보는 준비됐지만 분할 지시 이후 AI 재렌더는 실행하지 않았다. `.qa/r8-w2/fix-ai.py`는 미실행 후보이므로 새 담당이 소유 범위와 최종 제작 코드를 확인한 뒤 사용한다.
2. 최종 실제 6편 재측정·프레임 확인·전체 직렬 테스트.
3. `.qa/r8-w2/src` 최종 스냅샷에서 검토판/공개판을 각 1회 포그라운드 빌드, 6경로 재생/소리/reduced-motion, 공개 HTML·클라이언트 정적 청크 금지 문자열 0건 확인.
4. 새 담당이 실제 결과에 따라 이 첫 줄을 갱신한다. 조정자가 새 Dispatch로 재개할 경우 완료 보고에는 새 Task/Dispatch ID를 쓰며 이번 종료된 ID를 재사용하지 않는다.

다른 AI의 독립 검토, 사람의 음악 청취·실제 휴대폰·Safari/Firefox, CI·문의 저장·메일·GA4, 배포·실사용은 NOT_RUN이다. W1의 추가 샘플/훅/제품/AI 사례 3편 등 보조 영상 빈 슬롯은 이번 6편 생성 명세 범위 밖이며 그대로다.


## 재개 실행본 (실행 NOT_RUN)

`.qa/r8-w2/finish.ps1`을 준비했고 PowerShell 파서 문법 검사만 PASS했다. 실행은 NOT_RUN이다. 두 서비스 RESULT 첫 줄이 PASS인지 먼저 검사하고, 기존 `.next`/`.next-review`가 있으면 중복 빌드를 막는다. 그 뒤 다섯 슬롯 연결·완성 파일 재측정·typecheck/lint/직렬 테스트·격리 dev 선검증·검토/공개 각각 1회 포그라운드 빌드와 브라우저/누수 검사를 순서대로 수행하도록 작성했다. 기존 코드나 사용자의 미리보기를 지우는 정리는 하지 않는다. 실제 실행이 끝나도 담당자가 최종 프레임/화면을 직접 확인하고 결과 문서를 갱신해야 한다.

보호 범위 최종 읽기 확인: `.qa/r8-w2/protected-final.json`에서 3215 PID14204·BUILD_ID SHA 동일, 3218 작업 서버 종료, app/components/lib의 R7 영상 참조 0건과 기존 R7 파일 2개 보존을 확인했다.


## W2 변경 파일과 소유권 인계

- 히어로: `docs/renewal-2026-10-13/hero-reel-r8/`의 `build.py`, `sources.py`, `timeline.py`, `music.py`, `renderer.js`, `assets.js`, `config.js`, `index.html`, `.gitignore`; `public/content-home/hero-reel-r8.mp4`, `hero-reel-r8.webp`.
- UI/데이터: `components/content-home/hero-video.tsx`, `content-home.css`; `components/content-site/services/reel-player.tsx`, `reel-sound.ts`, `service-editorial.css`, `brand-film/landing.tsx`; `components/content-site/shell/footer.tsx`; `lib/content-home.ts`.
- 테스트: `tests/reel-sound.test.mjs`, `content-home.test.mjs`, `content-site-wps2.test.mjs`.
- 서비스 5종 초기 후보의 각 `service-reels-r8/<id>/{build.py,index.html,config.js}`와 MP4/WebP는 분할 지시 수신 전에 만들었다. 분할 이후 서비스 수정/렌더를 멈췄으며, 최종 C3종은 W2c 보고와 해시가 정본이다. 웹툰·AI 두 후보는 미검수 상태다. 슬롯 데이터 `lib/content-site/r8-media.ts`의 5개 src/poster는 지시대로 W1 대기 상태로 되돌렸다.
- 기존 W1·사용자 변경은 보존했으며 현재 전체 git diff를 전부 이번 W2 변경으로 주장하지 않는다. 작업/검증 재개 상태와 실행 스크립트는 `.qa/r8-w2/state.json`, `finish.ps1`, `browser.cjs`, `final-media.py`, `snapshot.cjs`, `scan-{review,public}.cjs`, `server.ps1`에 있다. `finish.ps1`은 문법 검사만 PASS이며 실행 NOT_RUN이다.
