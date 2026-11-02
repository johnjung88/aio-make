# P6 폴더 정리 실행 계획 — `00_AIO 웹사이트`

작성 2026-10-14 · 상태 **계획만(읽기 전용 조사 결과). 아직 아무것도 옮기지 않았다.**
대상 `I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트` (이하 `R`) · 범위 `R` 내부만 · 상위 폴더 규칙(FOLDER_ORGANIZATION_RULES 상위 단계) 미적용 · 승인된 목표 구조(P6)를 실제 데이터로 보정함.
이 문서의 숫자는 2026-10-14 실측값이다. 실행 직전(Step 0)에 같은 값이 나오는지 먼저 확인한다.

---

## 0. 요약과 결정 사항

- 파일 1,132개 · 587,257,573 B(약 560 MiB) · 폴더 155개(`00_운영관리/database` 제외, 내부 미열람). 최대 경로 길이 159자(Windows 260자 한도 안).
- **삭제 0.** 모든 변경은 `Move-Item`(같은 볼륨 이름 변경, 해시 불변) 또는 수정 전 원본 사본 `Copy-Item`뿐이다. 빈 폴더도 지우지 않고 `empty-shells/`로 옮긴다.
- 이동은 가능한 한 **디렉터리 단위**로 한다. 파일 단위 이동은 증거 폴더 3곳의 `시안/캡처/보고서` 분류와 임시 로그 10개뿐이다.
- 실행 후 파일 수는 **1,157 = 1,132(기존) + 25(수정 전 원본 사본 10 + 신규 문서 15)**. 기존 1,132개는 전부 같은 SHA-256으로 새 위치에 존재해야 한다(수정 대상 10개는 `original/` 사본이 같은 SHA).
- 실행 도구(부록 A)는 **실제 파일이 아니라 같은 구조의 빈 뼈대 복제본**에서 정방향→검증→역방향까지 시험해 통과를 확인했다(1,132개 → 1,157개, `RESULT PASS`, 역방향 107행 오류 없음). 실제 폴더에서는 아직 실행하지 않았다.

### 실행 전에 확정해야 할 결정

| ID | 질문 | 권고 | 대안과 영향 |
|---|---|---|---|
| D1 | `개발표준_적용연결_v01.md`를 `01_기획/`으로 옮길까 | **루트에 둔다**(내용의 링크만 수정). `04_개발 대행/AGENTS.md` 18행이 이 파일을 루트 경로로 직접 링크한다(“제자리 유지·이동 금지”) | 옮기면 그 링크가 깨진다. 폴더 밖 수정 금지이므로 루트에 안내 스텁을 남겨야 해서 오히려 입구가 늘어난다 |
| D2 | `aio-make-simulation`과 `AIO_워크플로우검증_CURRENT_v01/v02.md`를 `03_검증기록/2026-10-07_워크플로우검증/`으로 옮길까 | **옮긴다**(승인된 구조대로). 폴더 밖 문서 6건이 옛 경로를 쓰므로 소유자가 나중에 갱신해야 한다(§2.2) | 옛 경로를 유지하려면 `01_자료·검증` 이름을 그대로 둬야 하므로 `03_검증기록` 개편 전체가 무산된다. 사실상 전부 아니면 전무 |
| D3 | 웹툰 폴더명 `AIO_웹툰레퍼런스_20s_v01` → `…_v02` 정정 | **정정한다.** 내부 현행 MP4·README가 v02, 구 v01 파일은 보관 묶음에 있다 | 안 하면 “v01 폴더에 v02”가 남는다. 외부 링크 1건(`WORK_PATH_BRIDGE_v01.md`)은 어차피 `02_포트폴리오` 이름 변경으로 깨지므로 추가 피해 없음 |
| D4 | 중복 파일(144그룹, 66.7 MB) 처리 | **옮기지 않는다.** 목록만 `DUPLICATES_v01.csv`로 기록 | 중복 대부분이 해시 매니페스트가 참조하는 증거(§1.3)라 이동 시 검증이 깨지고, 삭제는 금지 |

---

## 1. 현재 상태 (실측)

### 1.1 트리 요약과 크기

| 최상위 | 파일 | 크기 | 내용 |
|---|---:|---:|---|
| 루트 파일 10개 | 10 | 40.8 MB | 입구 문서 8 + `개발표준_적용연결_v01.md` + `AIO 웹사이트 전체 리뉴얼.zip`(40,773,061 B) |
| `00_운영관리/` | 2 + DB | — | `로컬관리자_실행.ps1`, `로컬관리자.url`, `database/`(PostgreSQL 데이터 디렉터리, **미열람·해시 제외**) |
| `01_자료·검증/` | 610 | 99.3 MB | 가이드 150 / 실제페이지적용 49 / 레퍼런스재구성 35 / 주소레퍼런스검색 21 / aio-make-simulation 353 / 루트 md 2 |
| `02_포트폴리오/` | 189 | 334.5 MB | 요프리 120(173 MB) / 웹툰 26(112 MB) / 브랜드인트로 17 / 힐러넷 v02 15 / `99_보관` 10 / README |
| `99_보관/` | 321 | 87.3 MB | 묶음 33개. `2026-10-12_포트폴리오중심개편` 하나가 221개·87 MB |

세부(깊이 2~3):

- `01_자료·검증/2026-10-01_리뉴얼가이드` 150: 루트 64개(`*.dc.html` 시안, `support.js`, `image-slot.js`, `.image-slots.state.json` 1.9 MB, `.thumbnail`, `CLAUDE.md`, `HANDOFF.md` 등) + `public/`(hero·images·portfolio) 31 + `screenshots/` 18 + `uploads/` 22 + `99_보관/`(1묶음) 15.
- `01_자료·검증/aio-make-simulation` 353: `.agents` 1 · `.playwright-cli` 4 · `00_접수` 14 · `01_기획` 28 · `02_미디어명세` 4 · `04_검증` 89(`models/` 51, 그중 `*.stderr.log` 10) · `05_비용` 4 · `06_근거` 130(`http-v01` 112, `input-snapshots-v01` 8) · `output/playwright` 52 · `scripts` 15 · 루트 12(`CURRENT*.json` 5, `README*.md` 5, `AGENTS.md`, `LATEST.json`).
- `02_포트폴리오` 작품 폴더는 모두 `source/` + 결과 MP4 + 썸네일 + README 구조. 교차 의존: 힐러넷 v02 README가 `../AIO_요프리브랜드소개_30s_v01/source/music_candidates/…`를 가리킨다(문장 속 경로).
- `99_보관` 묶음 33개 이름은 §4.4에 있다. 중첩 `99_보관`은 네 곳: 가이드 1묶음, 포트폴리오 1묶음, 웹툰 2묶음(루트 `99_보관`과 합쳐 보관 위치가 4곳).

### 1.2 알려진 문제와 실측 확인

| 문제 | 실측 | 해소 방법(§) |
|---|---|---|
| FOLDER_MAP 낡음 | 옛 이름 `00_자료·검증`/`01_포트폴리오`, 힐러넷 v01 항목, `../01_영업관리/CURRENT.md`(없음) 링크 | FOLDER_MAP 재작성(§5) |
| 입구 문서 중복 | README·AGENTS·CLAUDE·FOLDER_MAP·CURRENT·SESSION_PROMPT·FOLDER_ORGANIZATION_RULES 7개. 같은 “2026-10-08 현행 폴더 경로 v02” 배너가 6개 문서(CURRENT는 이력 내부)에 반복 | 7→5개(README, AGENTS, CLAUDE, CURRENT, FOLDER_MAP), 배너 제거(§5) |
| 깨진 링크 | md 링크 781개 중 418개 깨짐. **현행 문서 4건**(CURRENT 2, FOLDER_MAP 1, 개발표준 1)이고 나머지 414건은 수신·보관·동결 원문 안의 옛 링크(시뮬레이션 163, 가이드 27, 보관 묶음들) | 현행 4건 수정, 나머지는 원문이라 수정 금지(§6 링크 검증 규칙) |
| SESSION_PROMPT 경로 오류 | `I:\AIO_OS\01_WORK\00_공통운영\00_AIO 웹사이트`(존재하지 않음) | README로 흡수하며 정정 |
| aio-make-simulation v01~v05 난립 | `CURRENT*.json` 5, `README*.md` 5, 기획·점검 파일이 v01~v05로 병존 | **내부는 건드리지 않는다**(§1.3). 폴더 입구에 현행 지정 README 신설 |
| 웹툰 v01 폴더에 v02 mp4 | `AIO_웹툰레퍼런스_20s_v01/AIO_웹툰레퍼런스_20s_v02.mp4` | 폴더명 정정(D3) |
| 보관 4중 위치 | §1.1 | 루트 `99_보관`으로 병합 |
| manifest 이름 제각각 | `SHA256.json`(11), `MANIFEST.sha256`(9), `MANIFEST_SHA256_v03.csv`(5), `SHA256_MANIFEST.txt/json`, `manifest.json`, `CODE_MANIFEST*`, `ASSET_MANIFEST`, `*_SHA256_vNN.json` 등 | 이름을 바꾸지 않음(내부·외부가 이름으로 참조). `99_보관/INDEX.md`에 묶음별 이름을 정규화해 기록, 신규 묶음은 `MANIFEST.sha256` 사용 |
| 빈 폴더 | 4개: 요프리 `source/assets/video/frames`, `99_보관/2026-10-08_문의관리래퍼해소/empty/문의관리`, `…시험외부래퍼해소/empty/워크플로우 검증용 재기획`, `…완료검증이력/original/2026-10-03_폴더구조정비/99_보관` | 모두 의도적 보존(매니페스트 기록·재생성 입력). 그대로 둠 |
| `.playwright-cli`·`*.stderr.log`·`_to_delete`·중복 캡처 | 시뮬레이션 `.playwright-cli` 4, `*.stderr.log` 10(34,925 B), 보관 안 `_to_delete/input_jpg_copy.tar`(11 MB), 중복 144그룹 | 앞 두 가지만 임시 묶음으로 이동. `_to_delete`·중복은 §1.3 이유로 제자리 |
| ps1이 옛 작업트리 가리킴 | `$repo = …\WRK-20261002-WEBSITE-FIXES`, `LOCAL_DATA_DIR = $PSScriptRoot` | 파일 불변. CURRENT에 “옛 작업트리 참조, 실행 금지” 주의만 기록 |

### 1.3 실행 설계에 영향을 준 발견

1. **`aio-make-simulation` 내부는 해시로 고정**돼 있다. `04_검증/FILECHECK_v02~v05.json`, `PLAN_INPUT_SHA256_v02~v05.json`, `RECHECK_READ_SHA256_*`가 내부 상대 경로(`output/playwright/…`, `04_검증/models/…`)와 SHA를 담는다. 내부 파일을 옮기거나 이름을 바꾸면 검증이 깨진다. → 폴더째 이동만 한다. v01~v05 난립은 입구 README로 현행을 지정해 해소한다.
   - 예외로 옮기는 `.playwright-cli`(4)와 `*.stderr.log`(10)는 위 매니페스트 어디에도 없음을 확인했다(`stderr.log`는 `scripts/run_sol.py`만, `.playwright-cli`는 `06_근거/BROWSER_LIMITATION_v01.md` 본문 언급만).
2. **`99_보관` 묶음은 이름·위치 고정.** 묶음의 SHA 파일들이 `…\99_보관\<묶음>\original\…` 절대 경로를 적고(예 `2026-10-12_포트폴리오중심개편/SHA256.csv`), 이 폴더 밖 문서들도 묶음 경로를 인용한다. → 기존 33개는 제자리. 병합하는 4개는 묶음 이름 그대로 루트로 올린다(충돌 없음 확인).
3. **중복 캡처는 이동하지 않는다.** 144그룹 중 87그룹(40.8 MB)은 `포트폴리오중심개편`의 `rejected-review/evidence`와 `rollback-local-artifacts/output/playwright` 사이(이미 같은 보관 묶음 안, 해당 묶음 SHA/보고서가 참조), 8그룹(8.0 MB)은 시뮬레이션 `output/playwright` 루트 대 `v03`(위 1번 매니페스트가 참조), 39그룹(17.7 MB)은 작품 `source/`의 폰트·사이트 이미지(각 작품이 자립적으로 재제작되어야 함), 나머지 9그룹(0.3 MB). 삭제 금지라 줄일 수 없고 옮기면 증거가 깨진다. → `DUPLICATES_v01.csv`로 기록만.
4. **`대표시안_로컬검토_v02.html`에 이 폴더의 절대 경로가 박혀 있다.** `file:///I:/AIO_OS/01_WORK/01_에이전시/00_AIO 웹사이트/01_자료·검증/2026-10-12_레퍼런스재구성/posters/*`(16)와 `…/yofree-shop-cover.png`(1). 폴더를 옮기면 시안의 포스터·커버가 안 보인다. 사용자 디자인 검토 대기(USER_REVIEW_PENDING) 시안이므로 **경로 문자열만** 정확히 치환하고 원본을 `original/`에 보존한다. 이 폴더 자신의 절대 경로(`00_AIO 웹사이트`)를 담은 파일은 보관 묶음 밖에서 10개다. 그중 재작성 대상 입구 문서(`CURRENT`·`FOLDER_MAP`·`SESSION_PROMPT`·`개발표준_적용연결_v01`)를 빼면 **동작에 영향을 주는 것은 이 HTML뿐**이고, 나머지는 이미 존재하지 않는 경로를 적은 옛 기록이다(`AIO_워크플로우검증_CURRENT_v01.md`의 `워크플로우 검증용 재기획/…` 4건, `ASSET_MANIFEST.json`·`INPUT_MANIFEST_v01.json`·`collect_inputs.py`·웹툰 `MANIFEST_SHA256_v03.csv`의 기록용 경로).
5. **`00_운영관리/로컬관리자_실행.ps1`는 `$PSScriptRoot`(=`00_운영관리`)를 `LOCAL_DATA_DIR`로 쓴다.** `00_운영관리`는 이름·위치 불변이어야 한다. 이번 계획의 어떤 행도 `00_운영관리`를 건드리지 않는다(검증 항목에 포함).
6. 현재 `postgres` 프로세스는 실행 중이지 않다(`Get-Process postgres` 0개). 그래도 `database/`는 열람·해시·이동 대상에서 제외한다.

---

## 2. 폴더 밖 참조 (이동하면 깨지는 것)

조사 범위(완료): `09_TRANSFER` 텍스트 파일 전수(519파일 일치), `01_WORK` 전체 ripgrep 검색(22파일), `00_공통운영`·`05_MCN`·`06_어필리에이트`·`04_외국인 관련 분야` 파이썬 스캔, `01_에이전시` 입구 문서와 각 대행 최상위 md/csv 및 1단계 하위 md, `06_GITHUB`의 현행 리뉴얼 작업트리 전체와 다른 3개 작업트리(`CONTENT-SHARE`, `REFERENCE-CONTENT`, `REFERENCE-INTEGRATION`)의 `scripts docs content tests lib app components`.
**전수 조사가 끝나지 못한 곳**(시간 초과로 중단): `01_영업관리`·`02_마케팅 대행`·`03_컨텐츠 대행` 본문 깊은 폴더, 나머지 작업트리 10개 전체, `05_MCN` 스캔은 중단 전까지만 확인. ripgrep은 무시 파일 규칙 때문에 일부를 건너뛸 수 있다(실제로 `05_MCN` 1건은 파이썬 스캔에서만 잡혔다). → Step 0-5에서 부록 A-7로 재스캔한다.

### 2.1 깨지지 않는 참조 (루트 이름·입구 문서명 유지로 보호)

| 참조하는 문서 | 참조 대상 |
|---|---|
| `01_WORK/FOLDER_MAP.md` | `00_AIO 웹사이트/FOLDER_MAP.md` |
| `01_에이전시/AGENTS.md`, `CURRENT.md`, `FOLDER_MAP.md` | 폴더 링크 |
| `00_공통운영/CURRENT.md`, `FOLDER_MAP.md`, `02_프로젝트·도구연결/PROJECT_CONNECTIONS_v02.csv`(CY-WEBSITE) | 폴더 경로 |
| `04_개발 대행/README.md`, `AGENTS.md`(18행·49행) | 폴더 + `개발표준_적용연결_v01.md`(루트 유지 D1) |
| 작업트리 `docs/renewal-2026-10-13/COMMON.md`, `HANDOFF_RESUME.md` | 폴더 루트만 언급 |
| `00_공통운영/02_프로젝트·도구연결/CURRENT_LOCATION_BRIDGE_v03.csv` 4번 행 | `00_운영관리\database` (불변) |
| `99_보관/<묶음>` 경로를 인용하는 모든 문서(`CURRENT_LINK_RESOLVER_v03.csv`의 다수 행 포함) | 묶음 이름 고정 |

### 2.2 깨지는 참조 (소유자가 후속 갱신해야 함 — 이번에 수정하지 않는다)

| # | 폴더 밖 파일 | 현재 참조 | 새 경로 |
|---|---|---|---|
| 1 | `01_에이전시/WEB_VIDEO_INTEGRATION_MAP_v01.md` | `…/00_AIO 웹사이트/01_자료·검증/AIO_워크플로우검증_CURRENT_v01.md` | `…/03_검증기록/2026-10-07_워크플로우검증/AIO_워크플로우검증_CURRENT_v01.md` |
| 2 | `01_에이전시/CURRENT_LINK_RESOLVER_v03.csv`(51건) | `01_자료·검증\aio-make-simulation\*` 행들 | `03_검증기록\2026-10-07_워크플로우검증\aio-make-simulation\*` |
| 3 | `00_공통운영/02_프로젝트·도구연결/WEB_VIDEO_PROJECT_CONNECTIONS_v03.csv`(INTERNAL_AIO) | `…\01_자료·검증\aio-make-simulation` | `…\03_검증기록\2026-10-07_워크플로우검증\aio-make-simulation` |
| 4 | `00_공통운영/02_프로젝트·도구연결/CURRENT_LOCATION_BRIDGE_v03.csv` 2·3행 | `01_자료·검증\aio-make-simulation`, `01_자료·검증\AIO_워크플로우검증_CURRENT_v02.md` | 위와 같은 `2026-10-07_워크플로우검증` 아래 |
| 5 | `01_WORK/WORK_PATH_BRIDGE_v01.md` | `02_포트폴리오/AIO_웹툰레퍼런스_20s_v01/README.md` | `02_레퍼런스/AIO_웹툰레퍼런스_20s_v02/README.md` |
| 6 | `05_MCN/01_대행사 SNS/02_컨텐츠대행/03_콘텐츠 제작/검증샘플/261004_AIO_7개서비스_시험_v01/docs/원고_출처_v01.md` | `01_자료·검증/2026-10-01_리뉴얼가이드/AIO 브랜드 가이드.dc.html` | `04_수신자료/2026-10-01_리뉴얼가이드/AIO 브랜드 가이드.dc.html` |

이 6건 외의 폴더 밖 참조는 모두 **과거 시점 기록**이다. 갱신하지 않고 `PATH_MAP_2026-10-14.csv`로 해석한다.

- `01_WORK/FOLDER_LEAF_MAP_v01.md`·`v02.md`(각 5.4 MB, 각 102건): 시점 스냅샷.
- `09_TRANSFER/02_인수인계`: 519개 파일 · 약 15,977건 · 15개 work-ID(`AGENCY-DEEP-CLEANUP` 7,952, `FOLDER-INTEGRATION` 5,789, `FOLDER-LEAF-AUDIT` 1,074, `WEB-VIDEO-INTEGRATION` 827 등). 이미 `00_공통운영`·`00_자료·검증` 같은 더 옛 경로를 쓰는 것이 많아 이번 이동 전부터 깨진 것도 많다. 사람이 읽는 최근 인수인계 중 새로 깨지는 것: `WRK-20261012-AIO-REFERENCE-CONTENT/HANDOFF_v01·v02.md`(→ `01_자료·검증/2026-10-12_주소레퍼런스검색`, `…레퍼런스재구성/INDEPENDENT_REVIEW_v02.md`), `WRK-20261012-AIO-REFERENCE-INTEGRATION/HANDOFF_v01.md`(→ `…레퍼런스실제페이지적용/REPORT.md`), `WRK-20261003-WEBSITE-FOLDER-GOVERNANCE/HANDOFF_v01.md`. `WRK-20261008-WEB-VIDEO-INTEGRATION-v01/PATH_MAPPING_v01.csv`는 “옛 경로 → 01_자료·검증” 대응표라 이후 한 단계(`PATH_MAP`)가 더 필요하다.
- 코드 작업트리 `WRK-20261013-AIO-CONTENT-RENEWAL`: `content/works/*.json` 18개에 `source` 필드 **0건**, `scripts/prepare-reference-media.mjs`에 이 폴더 하드코딩 **없음**(입력 경로를 인자·JSON `source`로 받음) → **영향 없음**. `scripts/start-local-admin.ps1`, `.env.example`, `.env.local.example`의 `LOCAL_DATA_DIR=…/00_공통운영/00_AIO 웹사이트/00_운영관리/문의관리`와 `docs/renewal/iteration-v12/README.md:28`은 **이번 정리 이전부터 존재하지 않는 경로**다(`00_운영관리`는 불변이므로 새로 생기는 문제 없음, 같은 3개 파일이 다른 작업트리 3곳에도 있음). 코드 수정은 이번 범위 밖이므로 후속 과제로만 기록.

### 2.3 대응 원칙

1. **유지**: 루트 이름·입구 문서명, `00_운영관리`, `99_보관` 기존 묶음, `개발표준_적용연결_v01.md`(루트).
2. **해석표**: 모든 이동은 `99_보관/PATH_MAP_2026-10-14.csv`(구→신)에 있다. 이 파일이 두 번째 hop이다.
3. **포인터 스텁은 만들지 않는다**(스텁은 옛 폴더 이름을 되살려야 하고 입구를 늘린다). 대신 §2.2 표 그대로 `99_보관/2026-10-14_폴더정비/README.md`에 “폴더 밖 갱신 요청 목록”으로 남겨 소유자가 처리하게 한다.
4. 앞으로 만드는 `content/works/*.json`의 `media.source`는 처음부터 새 경로(`…/02_레퍼런스/<작품>/…`, 고객 작품은 `01_영업관리` 원본)를 쓴다.

---

## 3. 목표 구조 (전체)

파일 수는 실행 후 기대값이다(합계 1,157).

```text
00_AIO 웹사이트/                                   6 파일
├─ README.md                  유일한 시작 문서(SESSION_PROMPT 흡수)
├─ AGENTS.md                  유일한 규칙 정본(FOLDER_ORGANIZATION_RULES 흡수, 배너 제거)
├─ CLAUDE.md                  AGENTS.md 를 가리키는 짧은 안내
├─ CURRENT.md                 최신 상태 1페이지(이력은 99_보관/CURRENT_HISTORY.md)
├─ FOLDER_MAP.md              실제 구조로 재작성
├─ 개발표준_적용연결_v01.md    루트 유지(D1), 내부 링크만 수정
├─ 00_운영관리/                2 파일 + database/  ← 불변, 비접촉
│  ├─ 로컬관리자_실행.ps1
│  ├─ 로컬관리자.url
│  └─ database/
├─ 01_기획/                    3 파일
│  ├─ RENEWAL_PLAN_v05.md                  (이동)
│  ├─ 리뉴얼_2026-10-13_연결_v01.md         (신규: 코드 작업트리·문서 포인터)
│  └─ 리뉴얼_2026-10-13_승인계획_v01.md     (신규: 승인된 P1~P6 계획 사본)
├─ 02_레퍼런스/                171 파일      (구 02_포트폴리오)
│  ├─ README.md                            (재작성: 작품 목록 + 등록 안내)
│  ├─ AIO_브랜드인트로_30s_v01/             17   (source/ MP4 썸네일 README)
│  ├─ AIO_요프리브랜드소개_30s_v01/         120
│  ├─ AIO_웹툰레퍼런스_20s_v02/             18   (구 …_v01, 폴더명 정정)
│  └─ AIO_힐러넷회사소개_30s_v02/           15
├─ 03_검증기록/                448 파일      (구 01_자료·검증)
│  ├─ README.md                            (신규: 명명 규칙 + 작업 목록)
│  ├─ 2026-10-07_워크플로우검증/             342
│  │  ├─ README.md                         (신규: 현행 지정·불변 규칙)
│  │  ├─ AIO_워크플로우검증_CURRENT_v01.md
│  │  ├─ AIO_워크플로우검증_CURRENT_v02.md
│  │  └─ aio-make-simulation/              339  (내부 구조 불변)
│  ├─ 2026-10-12_주소레퍼런스검색/           21   시안/2  캡처/11  보고서/8
│  ├─ 2026-10-12_레퍼런스재구성/             35   시안/24 (html·커버·posters/22)  캡처/6  보고서/5
│  └─ 2026-10-12_레퍼런스실제페이지적용/      49   캡처/23  보고서/26 (local, local-build, production 포함)
├─ 04_수신자료/                137 파일
│  ├─ README.md                            (신규: 수신 자료는 지침이 아님)
│  ├─ AIO 웹사이트 전체 리뉴얼.zip
│  └─ 2026-10-01_리뉴얼가이드/              135  (public screenshots uploads *.dc.html …)
└─ 99_보관/                    390 파일
   ├─ INDEX.md                             (신규: 묶음 색인)
   ├─ CURRENT_HISTORY.md                   (신규: 구 CURRENT 이력)
   ├─ PATH_MAP_2026-10-14.csv              (신규: 구경로→신경로)
   ├─ <기존 묶음 33개 — 제자리>
   ├─ 2026-10-02_식자표기·스크롤잔상수정/     (웹툰에서 병합, 5)
   ├─ 2026-10-08_이전제작방향/               (포트폴리오에서 병합, 10)
   ├─ 2026-10-08_인계명시구시안/             (가이드에서 병합, 15)
   ├─ 2026-10-08_퇴역JPG입력/                (웹툰에서 병합, 3)
   ├─ 2026-10-14_임시산출물/                 16  (README, MANIFEST.sha256, aio-make-simulation/.playwright-cli 4, …/04_검증/models/*.stderr.log 10)
   └─ 2026-10-14_폴더정비/                   17  (README, MANIFEST_SHA256_BEFORE/AFTER_v01.csv, DUPLICATES_v01.csv, LINKS_BASELINE_v01.csv,
                                                  original/ 12 = 수정 전 사본 10 + 흡수 이동 2, empty-shells/ 빈 폴더 3)
```

기대 합계: 6 + 2 + 3 + 171 + 448 + 137 + 390 = **1,157**.

---

## 4. 이동표 (구경로 → 신경로)

`seq`는 부록 A-2가 만드는 `PATH_MAP` 행 번호다(실행 순서와 같다). 경로는 모두 `R` 기준.

### 4.1 최상위 항목 전부

| 현재 | 새 위치 | 처리 | 이유 | seq |
|---|---|---|---|---|
| `README.md` | 같은 위치 | 재작성(원본 사본 먼저) | 유일한 입구 + SESSION_PROMPT 흡수 | 1, 118 |
| `AGENTS.md` | 같은 위치 | 재작성 | 규칙 1벌, 배너 제거, RULES 흡수 | 2, 119 |
| `CLAUDE.md` | 같은 위치 | 재작성 | AGENTS 가리키는 3줄 | 3, 120 |
| `CURRENT.md` | 같은 위치 | 재작성 | 1페이지 + 이력 분리 | 4, 121 |
| `FOLDER_MAP.md` | 같은 위치 | 재작성 | 실제 구조 반영, 깨진 링크 수정 | 5, 122 |
| `SESSION_PROMPT.md` | `99_보관/2026-10-14_폴더정비/original/SESSION_PROMPT.md` | 이동 | README로 흡수(경로 오류 정정) | 116 |
| `FOLDER_ORGANIZATION_RULES_v01.md` | `99_보관/2026-10-14_폴더정비/original/FOLDER_ORGANIZATION_RULES_v01.md` | 이동 | AGENTS §6으로 흡수 | 117 |
| `RENEWAL_PLAN_v05.md` | `01_기획/RENEWAL_PLAN_v05.md` | 이동 | 계획 문서는 기획 폴더 | 115 |
| `개발표준_적용연결_v01.md` | 같은 위치(D1) | 링크만 수정(원본 사본 먼저) | 폴더 밖 문서가 루트 경로로 링크 | 6, 123 |
| `AIO 웹사이트 전체 리뉴얼.zip` | `04_수신자료/` | 이동 | 수신 원본 | 111 |
| `00_운영관리/` | 그대로 | **불변** | DB·ps1·url, `$PSScriptRoot` 의존 | — |
| `01_자료·검증/` | `03_검증기록/` | 폴더명 변경 | 검증 기록 전용 | 11 |
| `02_포트폴리오/` | `02_레퍼런스/` | 폴더명 변경 | 레퍼런스 원본 | 12 |
| `99_보관/` | 그대로 | 제자리 | 묶음 경로가 SHA/외부 문서에 고정 | — |

### 4.2 깊이 2~3 항목 전부

**`00_운영관리/`** — 전부 불변. `로컬관리자_실행.ps1`(옛 작업트리 `WRK-20261002-WEBSITE-FIXES` 참조, 실행 금지), `로컬관리자.url`(`http://127.0.0.1:3111/admin`), `database/`(내용·메타 접근 금지).

**`01_자료·검증/` → `03_검증기록/`**

| 현재(깊이 2~3) | 새 위치 | 이유 | seq |
|---|---|---|---|
| `AIO_워크플로우검증_CURRENT_v01.md` | `03_검증기록/2026-10-07_워크플로우검증/` | v02가 같은 폴더의 시뮬레이션·v01을 상대 링크로 가리킴 | 113 |
| `AIO_워크플로우검증_CURRENT_v02.md` | 위와 같음 | 위와 같음 | 114 |
| `aio-make-simulation/` (353) | `03_검증기록/2026-10-07_워크플로우검증/aio-make-simulation/` (339) | 폴더째 이동, 내부 불변(§1.3-1) | 112 |
| ├ `.agents/` 1, `00_접수/` 14, `01_기획/` 28, `02_미디어명세/` 4, `04_검증/` 38(+`models/` 41), `05_비용/` 4, `06_근거/` 130, `output/` 52, `scripts/` 15, 루트 12 | 그대로(폴더째) | 해시 고정 | 112 |
| ├ `.playwright-cli/` 4 | `99_보관/2026-10-14_임시산출물/aio-make-simulation/.playwright-cli/` | 브라우저 도구 임시 로그(매니페스트에 없음) | 21 |
| └ `04_검증/models/*.stderr.log` 10 | `99_보관/2026-10-14_임시산출물/aio-make-simulation/04_검증/models/` | 모델 실행 stderr(매니페스트에 없음) | 22–31 |
| `2026-10-01_리뉴얼가이드/` (150) | `04_수신자료/2026-10-01_리뉴얼가이드/` (135) | 수신 자료, 폴더째 이동 | 110 |
| ├ `public/`(hero 2·images 9·portfolio 20), `screenshots/` 18, `uploads/` 22, 루트 64 | 그대로(폴더째) | 수신 원본 | 110 |
| └ `99_보관/2026-10-08_인계명시구시안/` 15 | `99_보관/2026-10-08_인계명시구시안/` | 보관 병합 | 13 |
| └ `99_보관/`(비게 된 껍데기) | `99_보관/2026-10-14_폴더정비/empty-shells/guide_99_보관/` | 삭제 대신 이동 | 17 |
| `2026-10-12_레퍼런스실제페이지적용/` (49) | `03_검증기록/2026-10-12_레퍼런스실제페이지적용/{캡처,보고서}/` | §4.3 | 67–109 |
| `2026-10-12_레퍼런스재구성/` (35) | `03_검증기록/2026-10-12_레퍼런스재구성/{시안,캡처,보고서}/` | §4.3 | 53–66 |
| `2026-10-12_주소레퍼런스검색/` (21) | `03_검증기록/2026-10-12_주소레퍼런스검색/{시안,캡처,보고서}/` | §4.3 | 32–52 |

**`02_포트폴리오/` → `02_레퍼런스/`**

| 현재(깊이 2~3) | 새 위치 | 이유 | seq |
|---|---|---|---|
| `README.md` | 같은 위치(`02_레퍼런스/README.md`) | 재작성(원본 사본 먼저) | 7, 124 |
| `AIO_브랜드인트로_30s_v01/`(`source/` 13, mp4, 썸네일 2, README) | 그대로(폴더째) | 작품 원본 | — |
| `AIO_요프리브랜드소개_30s_v01/`(`source/`: assets, fonts, music_candidates 등 116) | 그대로 | 다른 작품이 음원·소스를 참조 | — |
| `AIO_웹툰레퍼런스_20s_v01/` (26) | `AIO_웹툰레퍼런스_20s_v02/` (18) | 폴더명 정정(D3) | 20 |
| ├ `source/` 14, `AIO_웹툰레퍼런스_20s_v02.mp4`, 썸네일 2, README | 그대로 | | — |
| ├ `99_보관/2026-10-02_식자표기·스크롤잔상수정/` 5 | `99_보관/2026-10-02_식자표기·스크롤잔상수정/` | 병합 | 15 |
| ├ `99_보관/2026-10-08_퇴역JPG입력/` 3 (`original/source/_to_delete/input_jpg_copy.tar` 포함) | `99_보관/2026-10-08_퇴역JPG입력/` | 병합. 이름의 `_to_delete`는 **삭제 승인이 아님**(INDEX에 명시), 내부 변경 금지 | 16 |
| └ `99_보관/`(껍데기) | `…/empty-shells/webtoon_99_보관/` | | 19 |
| `AIO_힐러넷회사소개_30s_v02/`(`source/` 10, mp4, 썸네일 3, README) | 그대로 | | — |
| `99_보관/2026-10-08_이전제작방향/` 10 | `99_보관/2026-10-08_이전제작방향/` | 병합 | 14 |
| `99_보관/`(껍데기) | `…/empty-shells/portfolio_99_보관/` | | 18 |

**`99_보관/`** — 기존 묶음 33개 전부 제자리(이름 포함 불변):
`2026-10-01_`{가이드기준복원, 가이드복원v03완료, 검증루프v02반영, 실행계획v02반영, 웹사이트재검수v04, 웹사이트재검수v05, 웹사이트최종검수v07, 웹사이트피드백v08, 웹사이트화면개선v06} · `2026-10-02_`{분야메뉴고정_v16, 서비스전체정렬_v15, 운영도메인전환v10, 운영배포_v17, 웹사이트문구_v13, 웹사이트배포준비v09, 웹사이트수정v11, 웹사이트UX_v12, 웹툰첫화면_v14} · `2026-10-03_`{문의관리운영연결_v18, 컨텐츠공유관리자_v19, 폴더구조정비_v21, GA4운영연결_v20} · `2026-10-08_`{문의관리래퍼해소, 시험외부래퍼해소, 완료검증이력, 중복시험입구, 현행경로갱신} · `2026-10-09_링크갱신` · `2026-10-10_150004_영업관리단순화` · `2026-10-12_`{레퍼런스시안재작업_v23, 레퍼런스실제페이지적용_v24, 주소레퍼런스검색_v22, 포트폴리오중심개편}.
추가: 병합 4개(위 표) + 신규 `2026-10-14_임시산출물`, `2026-10-14_폴더정비`, `INDEX.md`, `CURRENT_HISTORY.md`, `PATH_MAP_2026-10-14.csv`. 묶음 내부(`original/`, `rejected-review/`, `rollback-local-artifacts/` 안의 `.playwright-cli`·중복 캡처 포함)는 변경 없음.

### 4.3 증거 폴더 3곳의 `시안/캡처/보고서` 분류 (부록 A-2가 자동 적용)

규칙은 위에서부터 첫 일치. 하위 폴더는 통째로 이동.

| 폴더 | 시안 | 캡처 | 보고서 |
|---|---|---|---|
| `2026-10-12_주소레퍼런스검색` (21) | `*.html` 2 | `*.png` 9(`목록_1440/390`, `상세_1440/390`, `instrument-*` 5) + `intake.yaml` + `instrument-observation.json` = 11 | 나머지 8: `CODE_MANIFEST_v01.csv`, `INDEPENDENT_REVIEW_v01.md`, `INPUT_LOCK_v01.json`, `QA_REPORT_v01.md`, `REFERENCE_COMPARISON_v01.md`, `SEARCH_PAGE_MATRIX_v01.csv`, `SEO_HTTP_v01.json`, `WORK_REGISTER_v01.csv` |
| `2026-10-12_레퍼런스재구성` (35) | `대표시안_로컬검토_v02.html` + `yofree-shop-cover.png` + `posters/`(22) = 24 | `*.png` 6(`목록`, `작품`, `상세` × 1440/390) | 5: `CODE_MANIFEST_v02.csv`, `INDEPENDENT_REVIEW_v02.md`, `REVIEW_ASSETS_v02.csv`, `REVIEW_CATALOG_v02.json`, `REVIEW_REPORT_v02.md` |
| `2026-10-12_레퍼런스실제페이지적용` (49) | 없음(폴더 만들지 않음) | `*.png` 23(`content-services-*` 5, `content`, `home-*` 4, `lab`, `lab-services-website`, `marketing`, `service-shop-*` 4, `webtoon-*` 4, `work-desktop`, `work-mobile-page2`) | 17(`REPORT.md`, `ASSET_MANIFEST.json`, `BROWSER_QA.json`, `CODE_MANIFEST.csv`, `GOOGLE_*.json` 9, `NAVER_SEARCH.json`, `ORIGINAL_PRESERVATION.json`, `VERCEL_DOMAINS.json`, `VERIFICATION.json`) + `local/` `local-build/` `production/`(각 3, 합 9) = 26 |

분류 이유: 재구성의 `yofree-shop-cover.png`는 시안 HTML이 직접 읽는 자산이므로 시안에 둔다. `intake.yaml`·`instrument-observation.json`은 캡처 5장의 출처·관측 기록이라 캡처와 같이 둔다.

### 4.4 하지 않는 것

`00_운영관리/*`, `99_보관` 기존 33묶음, `aio-make-simulation` 내부, 리뉴얼가이드 내부(`uploads`의 깨진 상대 링크 포함), 작품 폴더 내부(`source/`, 빈 `frames/`), `_to_delete/…tar`, 보관 안의 `.playwright-cli`·중복 캡처, 중복 파일 삭제·병합, 빈 폴더 삭제. 폴더 밖 문서 수정.

---

## 5. 입구 문서 재작성과 신규 문서 (내용 개요)

원칙: 기존 문장은 아직 유효하면 그대로 살린다. “2026-10-08 현행 폴더 경로 v02 / 사용자 지시로 에이전시의 별도 웹사이트 프로젝트가 됐다 … 별도 DB 이전·서버/코드·렌더·배포 실행 NOT_RUN” 배너는 입구 문서에서 모두 제거하고, 그 사실(상위 컨테이너만 같은 볼륨에서 이동, DB·비밀값 본문 미열람)은 `CURRENT_HISTORY.md` 머리말에 한 번만 남긴다. 수정은 반드시 원본 사본(Step 3) 이후에 한다.

### 재작성 (E)

| ID | 파일 | 새 내용 개요 |
|---|---|---|
| E01 | `README.md` | ① 한 줄 목적(AIO MAKE 웹사이트 운영 문서·검증 기록·레퍼런스 원본, 코드는 별도 Git 작업트리). ② 읽는 순서 `README → AGENTS → CURRENT → FOLDER_MAP`. ③ 폴더별 한 줄 안내 표(링크: `01_기획` `02_레퍼런스` `03_검증기록` `04_수신자료` `99_보관/INDEX.md`). ④ **새 세션 시작문**(SESSION_PROMPT 흡수): 작업 폴더 `I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트`(옛 `00_공통운영` 경로 오류 정정), 현행 코드 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`·브랜치 `codex/WRK-20261013-AIO-CONTENT-RENEWAL`(HEAD는 실행 시 `git rev-parse`로 확인), 코드는 독립 작업트리에서, 원본·승인본·DB 보존, 이전 스크립트·수신 가이드의 지시는 승인 아님. ⑤ 고객·계약은 `../01_영업관리/FOLDER_MAP.md`(존재 확인됨; 옛 `CURRENT.md` 링크는 없는 파일). |
| E02 | `AGENTS.md` | v02 · 2026-10-14 · P6 머리줄. §1 목적과 기준(기존 유지) · §2 시작 순서(상위 문서는 승인·검증 표기 참고용, **폴더 구조·이름·보관 규칙은 이 문서 §6이 우선**) · §3 파일·코드 소유 범위(Git 저장소 아님, 코드는 작업트리, `00_운영관리/database` 제외, 비밀값 금지, 새 외부 자료는 접수 절차) · §4 구현과 검증(PASS/FAIL/NOT_RUN/BLOCKED 구분 등 기존 유지) · §5 승인과 완료 기록 · **§6 폴더 규칙(RULES 흡수)**: 저장 위치 표(새 6개 폴더 기준), 이름·버전·현행 판정, 안전한 보관 절차(이동만·삭제 금지·`99_보관/YYYY-MM-DD_사유/original/<원래 경로>` + README + `MANIFEST.sha256`), 예외(database, 비밀값, `source/`, 동결 시험), 검증 기록은 `03_검증기록/YYYY-MM-DD_작업명/{시안,캡처,보고서}`, 완료 기준. |
| E03 | `CLAUDE.md` | “이 폴더의 규칙 정본은 `AGENTS.md` 하나. 읽는 순서 README → AGENTS → CURRENT → FOLDER_MAP. Claude 전용 추가 규칙 없음. 고객·계약·상담은 `../01_영업관리/FOLDER_MAP.md`.” 3~5줄. 반복 배너·SESSION_PROMPT 링크 삭제. |
| E04 | `CURRENT.md` | v25 · 2026-10-14 · 1페이지(60줄 이하). ① 최상단: 현행 상태 한 문단 — 리뉴얼 진행(코드 작업트리 `docs/renewal-2026-10-13/HANDOFF_RESUME.md`의 P1~P6 진행 표를 요약·링크; 실행 시점 값을 쓴다). ② 기존 v24 블록(레퍼런스 실제 페이지 적용·검색 점검)을 압축 유지: 18작품 공개 권리 UNKNOWN/HOLD, 배포 NOT_RUN, 검색 상태, `www` DNS 문제. ③ 운영 기준(원 CURRENT “현재 운영” 블록): `aio-make.com`, 관리자 `/admin`, Vercel `aio-make-src`, 운영 소스 커밋 `3c84bb4…`, Neon→관리자→Resend 구조 — **2026-10-03 기록이며 재검증하지 않음** 표기. ④ 로컬 관리자/DB: 위치 `00_운영관리`, ps1이 옛 작업트리 참조, 실행 금지. ⑤ 다음 행동·미해결. ⑥ 링크: `99_보관/CURRENT_HISTORY.md`, `99_보관/2026-10-14_폴더정비/README.md`, 인수인계 폴더. 깨진 링크 2건(`../01_영업관리/CURRENT.md`, `01_자료·검증/2026-10-03_폴더구조정비/QA_REPORT_v01.md`) 정정: 후자는 `99_보관/2026-10-08_완료검증이력/original/2026-10-03_폴더구조정비/QA_REPORT_v01.md`. |
| E05 | `FOLDER_MAP.md` | §3 트리를 실제 구조로(파일 수 제외), 위치·용도 표, 폴더 밖 연결 표(코드 작업트리, `09_TRANSFER/02_인수인계`, `../01_영업관리/FOLDER_MAP.md`), “구 이름 → 새 이름” 4줄(`01_자료·검증→03_검증기록`, `02_포트폴리오→02_레퍼런스`, `웹툰 v01→v02`, `SESSION_PROMPT→README`)과 `PATH_MAP` 링크. 옛 `00_자료·검증`·`01_포트폴리오`·힐러넷 v01 서술 삭제. |
| E06 | `개발표준_적용연결_v01.md` | 링크만 수정: `01_자료·검증/AIO_워크플로우검증_CURRENT_v01.md` → `03_검증기록/2026-10-07_워크플로우검증/…`, 실행기록 위치 제안 `03_검증기록/{YYYY-MM-DD_주제}/보고서/실행기록_{수행ID}.md`. 존재하지 않는 `개발_단계계약·승인루프_v01.md` 링크는 링크를 풀어 코드 표기(`…` + “외부 이동 확인 필요”)로 바꾸고, 존재 확인된 `04_개발 대행/AGENTS.md`, `02_웹사이트/AGENTS.md`, `02_웹사이트/워크플로우_웹사이트.md`만 링크로 둔다. 머리줄에 `v01-r01 · 2026-10-14 · 링크만 수정(원본 사본 99_보관/2026-10-14_폴더정비/original/)`. |
| E07 | `…/레퍼런스재구성/보고서/REVIEW_REPORT_v02.md` | 링크 7곳만: `<대표시안_로컬검토_v02.html>` → `<../시안/대표시안_로컬검토_v02.html>`, `<목록_1440_v02.png>` `<목록_390_v02.png>` `<작품_1440_v02.png>` `<작품_390_v02.png>` `<상세_1440_v02.png>` `<상세_390_v02.png>` → `<../캡처/…>`. 나머지 상대 링크(CODE_MANIFEST, REVIEW_CATALOG, REVIEW_ASSETS, INDEPENDENT_REVIEW)는 같은 폴더라 그대로. |
| E08 | `…/레퍼런스실제페이지적용/보고서/REPORT.md` | 13행의 4개 링크 `](home-1440.png)` `](home-390.png)` `](service-shop-1440.png)` `](service-shop-390.png` → `](../캡처/…)`. |
| E09 | `…/레퍼런스재구성/시안/대표시안_로컬검토_v02.html` | 문자열 치환 2종만(부록 A-8): 퍼센트 인코딩된 `01_자료·검증/2026-10-12_레퍼런스재구성/posters/` → `03_검증기록/2026-10-12_레퍼런스재구성/시안/posters/`(16곳), `…/yofree-shop-cover.png` → `…/시안/yofree-shop-cover.png`(1곳). `newline=''`으로 읽고 써서 줄바꿈을 보존한다. |
| E10 | `02_레퍼런스/README.md` | ① 현행 작품 4종 표(폴더, 규격, 현행 MP4, 썸네일, 소스 위치) — 기존 README 내용 승계, 공개 승인 추가 없음. ② 교차 의존: 힐러넷 v02 → 요프리 `source/music_candidates`. ③ 보관 위치: 힐러넷 v01·MP4 → `99_보관/2026-10-08_이전제작방향`, 웹툰 구판 → `99_보관/2026-10-02_식자표기·스크롤잔상수정`·`99_보관/2026-10-08_퇴역JPG입력`. ④ 웹툰 폴더명 정정 설명(내용 불변, 구 이름은 PATH_MAP). ⑤ **레퍼런스 등록 안내**: 고객 18작품의 원본은 각 고객 폴더(`01_영업관리/…/261010_BWL`, `…/261010_힐러넷`)에 두고 여기로 복사하지 않는다. 등록은 코드 저장소 `content/works/<slug>.json` + `docs/REFERENCES.md`(작업트리 `WRK-20261013-AIO-CONTENT-RENEWAL`, 커밋 `4c62a58` 이후)의 5단계 — 파일 준비 → JSON 작성(처음엔 `visibility:"review"`, `rightsConfirmed:false`) → `npm run works:build -- --media` → `npm test` → 권리 확인 후 `public`/`true`. `media.source`에는 원본 절대 경로를 적는다(AIO 자체 제작 작품은 이 폴더의 새 경로). 공개 권리는 확인 전까지 UNKNOWN/HOLD. |

### 신규 (N)

| 파일 | 내용 |
|---|---|
| `99_보관/INDEX.md` | 부록 A-9로 만든 묶음 표(묶음·파일·크기·무결성 기록 파일명·설명) + 병합된 4묶음의 출처 + “이름이 `_to_delete`여도 삭제 승인 아님” + 중복 안내(`DUPLICATES_v01.csv`) + manifest 이름 변형 표. |
| `99_보관/CURRENT_HISTORY.md` | 원 `CURRENT.md`(125줄, SHA-256 `d6c877d0…`)의 **v24 블록(1~12행)을 제외한 전부**(v23 15~25행, v22 28~38행, 워크플로우 연결 40행~, v21·v20 운영 기록)를 원문 그대로 옮긴 사본 + 머리말(2026-10-08 이동 사실 1회). |
| `99_보관/PATH_MAP_2026-10-14.csv` | Step 8에서 완성한 PATH_MAP(EDIT 행 note에 before/after SHA 12자). |
| `99_보관/2026-10-14_폴더정비/README.md` | 목적, 입력(이 계획서), 결과 수치(1,132→1,157), 구성, **폴더 밖 갱신 요청 목록(§2.2)**, 복구 절차(역방향 + `original/` 복원), 검증 결과 요약. |
| 같은 폴더 `MANIFEST_SHA256_BEFORE_v01.csv` / `_AFTER_v01.csv` / `DUPLICATES_v01.csv` / `LINKS_BASELINE_v01.csv` | 기준선·결과·중복 목록·링크 기준선(부록 스크립트 출력 그대로). |
| `99_보관/2026-10-14_임시산출물/README.md` + `MANIFEST.sha256` | 이동한 14개 파일의 원위치·사유·복구 방법. `MANIFEST.sha256`은 `<sha256> *<묶음 기준 상대 경로>` 형식. |
| `01_기획/리뉴얼_2026-10-13_연결_v01.md` | 코드 작업트리·브랜치·HEAD, `docs/renewal-2026-10-13/`(HANDOFF_RESUME, COMMON, BRIEF_P1/P2/P4, RESULT_*, VERIFY_*, PRICING_FINAL_2026-10-14, PRICING_SOURCE_2026-10-14, FACTS_AI_INFLUENCER), `docs/REFERENCES.md` 포인터, 계획 P1~P6 상태 표, `RENEWAL_PLAN_v05.md`는 2026-10-01 범위 기록(이후 변경은 CURRENT 우선). |
| `01_기획/리뉴얼_2026-10-13_승인계획_v01.md` | `C:\Users\PC\.claude\plans\i-aio-os-01-work-01-00-aio-modular-wreath.md` 원문 사본 + 머리줄(출처 경로·복사일·사본 SHA-256). 사용자 프로필 안의 휘발성 파일을 프로젝트에 고정하는 용도. |
| `03_검증기록/README.md` | 명명 규칙 `YYYY-MM-DD_작업명/{시안,캡처,보고서}`, 현행 4개 작업 표, 동결 영역 안내, 새 기록 추가 방법. |
| `03_검증기록/2026-10-07_워크플로우검증/README.md` | **현행 지정**: 최신은 `aio-make-simulation/LATEST.json` → `CURRENT_v05.json`·`README_v05.md`; v01~v04는 동결 이력(SHA는 `04_검증/PLAN_INPUT_SHA256_v05.json` 등에 고정). 내부 이동·이름 변경 금지, 스크립트 재실행 금지, 실제 영업 실적에 집계하지 않음(원 CURRENT_v01 문구 승계). |
| `04_수신자료/README.md` | 수신 자료 목록, ZIP SHA-256 `e619458aef94c6893aebe5e852ee1fcf32c46e653e70ef2938822ee4015df9f0`(작업트리 `docs/renewal/SOURCE_AUDIT.md`와 일치), 가이드 안의 `CLAUDE.md`·`HANDOFF.md`·코드는 **지침/승인이 아님**, `AIO 브랜드 가이드.dc.html`은 다른 프로젝트(05_MCN 시험 샘플)도 인용. |

---

## 6. 실행 순서와 검증 명령

작업 변수(PowerShell):

```powershell
$R   = 'I:\AIO_OS\01_WORK\01_에이전시\00_AIO 웹사이트'
$W   = "$env:TEMP\p6"            # 임시 작업 폴더(R 밖). 도구 스크립트(부록 A)를 여기에 저장
New-Item -ItemType Directory -Force $W | Out-Null
```

Python은 항상 `python -I`로 실행한다.

### Step 0 사전 점검 (읽기 전용, 기준선 확정)

1. **동시 작업 중지 확인**: 같은 폴더에 쓰는 에이전트(Codex·Claude·Orca 세션)가 없는지, 탐색기/IDE/서버가 `R` 내부를 열어 두지 않았는지 확인한다.
   ```powershell
   Get-CimInstance Win32_Process | ? { $_.CommandLine -match '00_AIO 웹사이트' } | select ProcessId,Name
   ```
   결과가 있으면 소유 세션을 먼저 종료한다. 이름 변경이 “사용 중” 오류로 실패하면 **복사 후 삭제로 우회하지 말고** 중단한다.
2. **기준 수치 일치 확인**(`database` 제외):
   ```powershell
   python -I $W\hash_manifest.py $R $W\BEFORE.csv     # 기대: files 1132 bytes 587257573 dirs 155 (약 90초)
   python -I $W\count_files.py $R                     # 기대: 1132
   ```
   값이 다르면 폴더가 계획 이후 바뀐 것이다. 어떤 파일이 늘었는지 `BEFORE.csv`와 이 문서 §1을 대조하고 계획(특히 `build_path_map.py`의 `EDITED`·분류 규칙·`NEW` 목록·기대 파일 수)을 먼저 갱신한다. 바뀔 가능성이 높은 파일은 `CURRENT.md`(SHA `d6c877d0…`), `AGENTS.md`(`e6060ac2…`), `README.md`(`82960764…`), `FOLDER_MAP.md`(`1d5b32b3…`), `AIO 웹사이트 전체 리뉴얼.zip`(`e619458a…`).
3. **링크 기준선**: `python -I $W\linkcheck.py baseline $R $W\LINKS_BASELINE.csv` → 기대 `links 781 broken 418`.
4. **PATH_MAP 생성과 사전 검증**:
   ```powershell
   python -I $W\build_path_map.py $R $W\PATH_MAP.csv   # 기대: COPY_ORIGINAL 10, RENAME 3, MOVE 104, EDIT 10, NEW 15
   python -I $W\verify_after.py plan $W\BEFORE.csv $W\PATH_MAP.csv   # 기대: expected after files 1157, RESULT PASS (충돌 0)
   Select-String -Path $W\PATH_MAP.csv -Pattern '00_운영관리' | measure   # 기대: Count 0
   ```
5. **폴더 밖 참조 재스캔**: `python -I $W\scan_external_refs.py "I:/AIO_OS/01_WORK" "I:/AIO_OS/09_TRANSFER" "I:/AIO_OS/06_GITHUB" > $W\EXTERNAL_REFS.txt` (오래 걸리면 루트별로 나눠 실행). §2.2 표에 없는 **현행 문서**(`99_보관`·`09_TRANSFER`·`FOLDER_LEAF_MAP` 제외)가 나오면 §2.2에 추가하고 `README`의 갱신 요청 목록에도 넣는다.
6. 결정 D1~D4가 확정됐는지 확인한다. D1을 “이동”으로 바꾸면 `build_path_map.py`에 `개발표준_적용연결_v01.md → 01_기획/` MOVE 행을 추가하고 기대 수치를 바꾼다.

### Step 1 원본 사본 (seq 1–10)

```powershell
& $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -From 1 -To 10
```
수정 대상 10개를 `99_보관/2026-10-14_폴더정비/original/<원래 경로>`로 복사하고 원본과 SHA를 비교한다(스크립트가 불일치 시 중단). 이 시점에 `BEFORE.csv`와 `PATH_MAP.csv`를 `$W`에 보관한 채 계속한다(최종 위치는 Step 8).

### Step 2 최상위 폴더 이름 변경 (seq 11–12)

```powershell
& $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -From 11 -To 12
```
확인: `Test-Path "$R\03_검증기록","$R\02_레퍼런스"` 둘 다 True, `01_자료·검증`·`02_포트폴리오` 없음.

### Step 3 보관 병합·웹툰 폴더명 정정 (seq 13–20)

```powershell
& $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -From 13 -To 20
```
4개 묶음을 `99_보관`으로 올리고, 껍데기 3개(파일 0개 확인 후)를 `empty-shells`로 옮기고, 웹툰 폴더명을 `…_v02`로 바꾼다. 확인: `99_보관` 하위 폴더 수 33 + 4 + `2026-10-14_폴더정비`(1) = 38.

### Step 4 임시 산출물 이동 (seq 21–31)

```powershell
& $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -From 21 -To 31
```

### Step 5 증거 폴더 3곳 분류 (seq 32–109)

```powershell
& $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -From 32 -To 109
```
확인(파일 수): 주소레퍼런스검색 시안 2·캡처 11·보고서 8 / 레퍼런스재구성 시안 24·캡처 6·보고서 5 / 레퍼런스실제페이지적용 캡처 23·보고서 26. 각 날짜 폴더 루트에 파일이 남지 않아야 한다.
```powershell
foreach($d in '2026-10-12_주소레퍼런스검색','2026-10-12_레퍼런스재구성','2026-10-12_레퍼런스실제페이지적용'){
  "$d : 루트 파일 " + @(Get-ChildItem -LiteralPath "$R\03_검증기록\$d" -File -Force).Count   # 기대 0
}
```

### Step 6 나머지 디렉터리·파일 이동 (seq 110–117)

```powershell
& $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -From 110 -To 117
```
가이드 → `04_수신자료`, ZIP, 시뮬레이션 + CURRENT_v01/v02 → `03_검증기록/2026-10-07_워크플로우검증`, `RENEWAL_PLAN_v05.md` → `01_기획`, `SESSION_PROMPT.md`·`FOLDER_ORGANIZATION_RULES_v01.md` → `original/`.
이 시점의 기대 파일 수 `1132 + 10 = 1142`: `python -I $W\count_files.py $R`. 이동만 했으므로 중간 검증을 하려면 `hash_manifest.py`를 `AFTER_MID.csv`로 돌려 `verify_after.py after`를 부분 실행해도 된다(수정·신규 15행이 MISSING으로 나오는 것은 정상).

### Step 7 내용 수정 (E07·E08 → E09 → E06 → E10 → E01~E05, 모두 원본 사본 확보 후)

1. E07·E08: 해당 md의 링크 문자열만 치환(§5 표).
2. E09: 부록 A-8 `patch_html.py`를 새 위치의 HTML에 실행하고 `html_urlcheck.py`로 17개 `file:///` URL이 모두 존재하는지 확인(기대 `self-folder file:/// urls 17 missing 0`). 가능하면 브라우저에서 시안을 열어 포스터 16 + 커버 1이 보이는지 눈으로 확인한다.
3. E06, E10, 그다음 E01~E05를 §5 개요대로 작성한다. 이 단계에서 **링크는 새 구조 기준 상대 경로**로 쓴다.

### Step 8 신규 문서와 기록 (N)

1. `99_보관/CURRENT_HISTORY.md`는 `99_보관/2026-10-14_폴더정비/original/CURRENT.md`에서 만든다(§5).
2. `python -I $W\make_index.py "$R\99_보관" $W\idx.md`로 표 초안을 만들고 `INDEX.md`를 작성한다. `2026-10-14_폴더정비`·`2026-10-14_임시산출물` 두 행은 마지막에 파일이 더 생기므로 수치 대신 “이번 정리(P6)”로 적는다.
3. `python -I $W\dups_csv.py $W\BEFORE.csv "$R\99_보관\2026-10-14_폴더정비\DUPLICATES_v01.csv"`.
4. `LINKS_BASELINE.csv`, `BEFORE.csv`를 `…/2026-10-14_폴더정비/LINKS_BASELINE_v01.csv`, `MANIFEST_SHA256_BEFORE_v01.csv`로 복사(`BEFORE.csv.dirs.txt`는 `$W`에만 둔다). 같은 폴더에 **`MANIFEST_SHA256_AFTER_v01.csv`를 0바이트 자리표시 파일로 먼저 만들어 둔다**(Step 9에서 내용을 채움).
5. 임시산출물 `MANIFEST.sha256` 생성, 두 bundle `README.md`, 나머지 N 문서 작성.
6. `PATH_MAP`의 EDIT 행 note 갱신 후 `99_보관/PATH_MAP_2026-10-14.csv`로 저장:
   ```powershell
   python -I $W\fill_edit_sha.py $R $W\PATH_MAP.csv $W\BEFORE.csv
   Copy-Item $W\PATH_MAP.csv "$R\99_보관\PATH_MAP_2026-10-14.csv"
   ```

### Step 9 최종 검증 (전부 PASS여야 완료)

```powershell
# 9-1 해시 매니페스트(이후)와 대조: 파일 수·내용·폴더
python -I $W\hash_manifest.py $R $W\AFTER.csv
python -I $W\verify_after.py after $W\BEFORE.csv $W\AFTER.csv "$R\99_보관\PATH_MAP_2026-10-14.csv" $W\BEFORE.csv.dirs.txt $W\AFTER.csv.dirs.txt
#   기대: after files 1157 | file count check: OK | RESULT PASS
#   (기존 1132개 전부 같은 SHA로 존재, 수정 10개는 original/ 사본이 원본 SHA, 신규 15개 외 예상 밖 파일 0, 기존 155개 폴더 전부 대응)
# 검증이 PASS 한 뒤에만 결과 매니페스트를 자리표시 파일 위에 덮어쓴다(새 파일을 추가하는 것이 아니므로 파일 수는 그대로 1157)
Copy-Item -LiteralPath $W\AFTER.csv -Destination "$R\99_보관\2026-10-14_폴더정비\MANIFEST_SHA256_AFTER_v01.csv" -Force

# 9-2 링크 검증: ① 이동 전 정상 링크의 대상이 그대로인지 ② 현행 범위 깨진 링크 0
python -I $W\linkcheck.py verify $R $W\LINKS_BASELINE.csv "$R\99_보관\PATH_MAP_2026-10-14.csv"
#   기대: regressions 0 | live broken 0   (보관·수신·동결 시험 범위의 옛 깨진 링크 414건은 원문이므로 제외)

# 9-3 최상위별 파일 수
python -I $W\count_by_top.py $R
#   기대: (루트) 6 · 00_운영관리 2 · 01_기획 3 · 02_레퍼런스 171 · 03_검증기록 448 · 04_수신자료 137 · 99_보관 390 = 1157

# 9-4 비접촉 확인
#   PATH_MAP 에 00_운영관리 행 0건(Step 0 4번), 00_운영관리 하위가 ps1·url·database 3개 그대로
Get-ChildItem -LiteralPath "$R\00_운영관리" -Name       # 기대: database, 로컬관리자.url, 로컬관리자_실행.ps1

# 9-5 시안 HTML 경로
python -I $W\html_urlcheck.py "$R\03_검증기록\2026-10-12_레퍼런스재구성\시안\대표시안_로컬검토_v02.html"   # 기대 17개 모두 존재, missing 0

# 9-6 경로 길이(Windows 260자 한도): R 접두 38자 포함
python -I -c "import csv,sys;print(max(len(r['path'])+38 for r in csv.DictReader(open(sys.argv[1],encoding='utf-8-sig'))))" $W\AFTER.csv   # 기대 260 미만(이동 전 159)

# 9-7 불변 영역: 시뮬레이션의 해시 고정 파일이 그대로인지는 9-1 이 전수 대조한다(예: 04_검증/PLAN_INPUT_SHA256_v05.json)
```

`MANIFEST_SHA256_AFTER_v01.csv`는 자기 자신의 SHA를 담을 수 없다. 그래서 Step 8-4에서 0바이트 자리표시 파일로 먼저 만들어 `NEW` 15개에 포함시키고(그래야 `hash_manifest.py`가 보는 파일 수가 1157), 검증 PASS 후 내용을 덮어쓴다. `verify_after.py`는 `NEW` 행의 내용을 비교하지 않으므로 이 덮어쓰기와 충돌하지 않는다. 이 매니페스트 안의 자기 항목은 빈 파일 SHA(`e3b0c442…`)로 남는다. `PATH_MAP_2026-10-14.csv`, `INDEX.md`, 각 README는 Step 9 시작 전에 **내용이 확정**돼 있어야 한다(확정 후 수정하면 AFTER 기준과 어긋나므로, 수정이 생기면 9-1을 다시 돌린다).

### Step 10 보고

- `CURRENT.md`(새)와 인수인계 문서에 결과 한 줄: “삭제 0, 이동 N건, 파일 1132→1157(기존 1132 SHA 전수 일치), 링크 회귀 0, 현행 깨진 링크 0, `00_운영관리` 비접촉”.
- 사용자(또는 코디네이터)에게 §2.2 폴더 밖 갱신 요청 6건을 전달한다.

### 롤백

- 이름 변경·이동 단계 실패 시: 스크립트가 해당 행에서 즉시 중단하므로, 같은 `PATH_MAP`으로 `-Reverse`를 돌린다. 되돌릴 구간만 `-From a -To b`로 지정한다.
  ```powershell
  & $W\apply_pathmap.ps1 -Root $R -Map $W\PATH_MAP.csv -Reverse -From 11 -To 117
  ```
- 문서 수정을 되돌릴 때는 `99_보관/2026-10-14_폴더정비/original/<원래 경로>`를 원위치로 복사하고 SHA를 `BEFORE.csv`와 비교한다.
- 역방향 후 남는 것: 빈 `시안/캡처/보고서`·`01_기획`·`04_수신자료` 폴더와 `original/` 사본(삭제하지 않고 남긴다).

---

## 7. 위험과 대응

| # | 위험 | 대응 |
|---|---|---|
| 1 | 다른 프로세스가 폴더를 잡고 있어 이름 변경 실패 | Step 0-1에서 확인. 실패 시 복사+삭제로 우회하지 않고 중단·재시도 |
| 2 | **폴더 밖 문서 6건이 깨진다**(§2.2) | 이번 범위에서 수정 불가. `PATH_MAP` + 갱신 요청 목록. 특히 `WEB_VIDEO_PROJECT_CONNECTIONS_v03.csv`·`CURRENT_LINK_RESOLVER_v03.csv`는 현행 레지스트리라 소유자 조치를 권고 |
| 3 | 동결 영역(시뮬레이션·보관·수신 가이드) 변조 | 디렉터리 단위 이동만, 내부 파일 변경 0, Step 9-1이 전수 SHA 대조 |
| 4 | 시안 HTML 수정이 사용자 검토 중인 산출물을 건드림 | 경로 문자열 2종만 치환, 원본 사본 보존, URL 17개 존재 확인 + 눈으로 확인. 문제 시 `original/` 사본으로 즉시 복원 |
| 5 | `AIO_워크플로우검증_CURRENT_v02.md`가 “v01은 SHA `2A1802A5…` 그대로”라고 쓰지만 현재 v01(`bf8e344b…`)은 2026-10-09 링크 수정본(수정 전 사본은 `99_보관/2026-10-09_링크갱신`) | 기존 모순. 동결 문서이므로 고치지 않고 `2026-10-07_워크플로우검증/README.md`에 한 줄로 설명 |
| 6 | 웹툰 폴더명 정정이 혼동 유발(보관 묶음 안 `AIO_웹툰레퍼런스_20s_v01.mp4`는 구 버전) | `02_레퍼런스/README.md`와 `INDEX.md`에 명시 |
| 7 | 작업 중 다른 에이전트가 `CURRENT.md` 등을 갱신 | Step 0-2의 SHA 확인 + 동시 작업 중지. 기준이 바뀌면 계획 먼저 갱신 |
| 8 | 경로 길이 | 현재 최대 159자. 가장 긴 항목은 `99_보관` 내부(변화 없음)이고 가이드·시뮬레이션·증거 폴더는 +20자 안쪽. Step 9-6에서 `AFTER.csv` 최대 길이 확인 — 260 미만이어야 함 |
| 9 | `·`(U+00B7)가 들어간 이름(`01_자료·검증`, `…식자표기·스크롤잔상수정`) | PATH_MAP은 UTF-8(BOM)로 저장하고 PowerShell은 `Import-Csv -Encoding UTF8`로 읽는다(시험 완료) |
| 10 | 외부 참조 전수 조사 미완료(§2) | Step 0-5 재스캔 결과로 §2.2 보강 |
| 11 | 상위 규칙과 충돌 | 사용자 지시로 이 폴더 정리에는 상위 규칙을 적용하지 않는다. AGENTS는 상위 문서를 “승인·검증 표기 참고용”으로만 링크 |
| 12 | `00_운영관리/로컬관리자_실행.ps1`·작업트리 `scripts/start-local-admin.ps1`의 옛 경로 | 이번 범위 밖(코드·실행 파일 수정 금지). CURRENT에 주의만 기록, 후속 과제로 전달 |

---

## 부록 A. 실행 도구 (시험 완료: 빈 뼈대 복제본에서 정방향·검증·역방향 PASS)

저장 위치는 `$W`(= `$env:TEMP\p6`, 프로젝트 밖). 파일명은 본문과 같다.

### A-1 `hash_manifest.py` — SHA-256 매니페스트 + 폴더 목록 (database는 내려가지도 않음)

```python
# hash_manifest.py <ROOT> <OUT.csv>   -> OUT.csv (path,bytes,sha256) + OUT.csv.dirs.txt (모든 폴더, 빈 폴더 포함)
import os, sys, hashlib, csv

root, out = sys.argv[1], sys.argv[2]
rows, dirs = [], []
for dp, dn, fn in os.walk(root):
    ndp = os.path.normpath(dp)
    rel = os.path.relpath(ndp, root).replace('\\', '/')
    if rel == '00_운영관리' and 'database' in dn:   # database 는 내려가지도(목록 조회도) 않는다
        dn.remove('database')
        dirs.append('00_운영관리/database')
    if rel != '.':
        dirs.append(rel)
    for f in fn:
        p = os.path.join(dp, f)
        h = hashlib.sha256()
        with open(p, 'rb') as fh:
            for chunk in iter(lambda: fh.read(1 << 20), b''):
                h.update(chunk)
        rows.append((os.path.relpath(p, root).replace('\\', '/'), os.path.getsize(p), h.hexdigest()))
rows.sort()
with open(out, 'w', encoding='utf-8-sig', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['path', 'bytes', 'sha256'])
    w.writerows(rows)
with open(out + '.dirs.txt', 'w', encoding='utf-8', newline='') as fh:
    fh.write('\n'.join(sorted(dirs)) + '\n')
print('files', len(rows), 'bytes', sum(r[1] for r in rows), 'dirs', len(dirs))
```

보조 3종:

```python
# count_files.py <ROOT>  (database 제외 파일 수)
import os, sys
r = sys.argv[1]; n = 0
for dp, dn, fn in os.walk(r):
    if os.path.relpath(dp, r).replace('\\', '/') == '00_운영관리' and 'database' in dn:
        dn.remove('database')
    n += len(fn)
print(n)
```

```python
# count_by_top.py <ROOT>  (최상위별 파일 수, 루트 직속은 "(루트)")
import os, sys, collections
r = sys.argv[1]; c = collections.Counter()
for dp, dn, fn in os.walk(r):
    rel = os.path.relpath(dp, r).replace('\\', '/')
    if rel == '00_운영관리' and 'database' in dn:
        dn.remove('database')
    c['(루트)' if rel == '.' else rel.split('/')[0]] += len(fn)
for k in sorted(c): print(k, c[k])
print('합계', sum(c.values()))
```

### A-2 `build_path_map.py` — PATH_MAP(구경로→신경로) 생성 (읽기 전용)

```python
# build_path_map.py  <ROOT> <OUT_CSV>
# ROOT 의 "이동 전" 실제 구조를 읽어 PATH_MAP(구경로 -> 신경로) CSV 를 만든다. 읽기 전용(ROOT 를 바꾸지 않는다).
# 실행 날짜가 2026-10-14 가 아니면 B, T 와 NEW 목록의 날짜를 바꾼다.
import csv, fnmatch, os, sys

root, out = sys.argv[1], sys.argv[2]
B = '99_보관/2026-10-14_폴더정비'
T = '99_보관/2026-10-14_임시산출물'
rows = []


def add(action, old, new, kind, note=''):
    rows.append([len(rows) + 1, action, old, new, kind, note])


def exists(p):
    return os.path.exists(os.path.join(root, p))


# ---- P-1 COPY_ORIGINAL : 내용을 고치는 파일의 원본 사본 ---------------------------------
EDITED = [
    'README.md', 'AGENTS.md', 'CLAUDE.md', 'CURRENT.md', 'FOLDER_MAP.md', '개발표준_적용연결_v01.md',
    '02_포트폴리오/README.md',
    '01_자료·검증/2026-10-12_레퍼런스재구성/REVIEW_REPORT_v02.md',
    '01_자료·검증/2026-10-12_레퍼런스재구성/대표시안_로컬검토_v02.html',
    '01_자료·검증/2026-10-12_레퍼런스실제페이지적용/REPORT.md',
]
for p in EDITED:
    assert exists(p), p
    add('COPY_ORIGINAL', p, f'{B}/original/{p}', 'file', '수정 전 원본 사본(SHA 동일 확인 후 수정)')

# ---- P0 최상위 폴더 이름 변경 -----------------------------------------------------------
add('RENAME', '01_자료·검증', '03_검증기록', 'dir', '검증·시안·캡처 기록. 하위는 아래 규칙으로 재배치')
add('RENAME', '02_포트폴리오', '02_레퍼런스', 'dir', '작품별 원본·영상. 등록 안내는 코드 저장소 content/works 로 연결')

# ---- P1 중첩 99_보관 병합 / 빈 껍데기 이동 / 웹툰 폴더명 정정 -------------------------------
nested = [
    ('01_자료·검증/2026-10-01_리뉴얼가이드/99_보관/2026-10-08_인계명시구시안', '99_보관/2026-10-08_인계명시구시안'),
    ('02_포트폴리오/99_보관/2026-10-08_이전제작방향', '99_보관/2026-10-08_이전제작방향'),
    ('02_포트폴리오/AIO_웹툰레퍼런스_20s_v01/99_보관/2026-10-02_식자표기·스크롤잔상수정', '99_보관/2026-10-02_식자표기·스크롤잔상수정'),
    ('02_포트폴리오/AIO_웹툰레퍼런스_20s_v01/99_보관/2026-10-08_퇴역JPG입력', '99_보관/2026-10-08_퇴역JPG입력'),
]
for o, n in nested:
    assert exists(o), o
    assert not exists(n), n
    add('MOVE', o, n, 'dir', '중첩 99_보관 묶음을 루트 99_보관으로 병합(내부 구조 불변)')
shells = [
    ('01_자료·검증/2026-10-01_리뉴얼가이드/99_보관', f'{B}/empty-shells/guide_99_보관'),
    ('02_포트폴리오/99_보관', f'{B}/empty-shells/portfolio_99_보관'),
    ('02_포트폴리오/AIO_웹툰레퍼런스_20s_v01/99_보관', f'{B}/empty-shells/webtoon_99_보관'),
]
for o, n in shells:
    add('MOVE', o, n, 'dir', '병합 후 비게 되는 껍데기 폴더(삭제 대신 이동, 실행 시 파일 0개 확인)')
add('RENAME', '02_포트폴리오/AIO_웹툰레퍼런스_20s_v01', '02_레퍼런스/AIO_웹툰레퍼런스_20s_v02',
    'dir', '내부 현행 MP4·README 가 v02 이므로 폴더명 정정')

# ---- P2 임시 산출물(시뮬레이션 내부, 어떤 매니페스트에도 없음 확인됨) ----------------------------
sim = '01_자료·검증/aio-make-simulation'
add('MOVE', f'{sim}/.playwright-cli', f'{T}/aio-make-simulation/.playwright-cli', 'dir', '브라우저 도구 임시 로그·스냅샷')
models = os.path.join(root, sim, '04_검증', 'models')
for f in sorted(os.listdir(models)):
    if f.endswith('.stderr.log'):
        add('MOVE', f'{sim}/04_검증/models/{f}', f'{T}/aio-make-simulation/04_검증/models/{f}', 'file', '모델 실행 stderr 로그')

# ---- P3 증거 폴더 3곳: 시안 / 캡처 / 보고서 --------------------------------------------------
RULES = {
    '2026-10-12_주소레퍼런스검색': [('시안', ['*.html']), ('캡처', ['*.png', 'intake.yaml', 'instrument-observation.json']), ('보고서', ['*'])],
    '2026-10-12_레퍼런스재구성': [('시안', ['*.html', 'yofree-shop-cover.png']), ('캡처', ['*.png']), ('보고서', ['*'])],
    '2026-10-12_레퍼런스실제페이지적용': [('캡처', ['*.png']), ('보고서', ['*'])],
}
DIR_RULES = {  # 하위 폴더는 통째로 이동
    '2026-10-12_레퍼런스재구성': {'posters': '시안'},
    '2026-10-12_레퍼런스실제페이지적용': {'local': '보고서', 'local-build': '보고서', 'production': '보고서'},
}
for d, rules in RULES.items():
    base = f'01_자료·검증/{d}'
    for name in sorted(os.listdir(os.path.join(root, base))):
        full = os.path.join(root, base, name)
        if os.path.isdir(full):
            cls = DIR_RULES[d][name]
            add('MOVE', f'{base}/{name}', f'03_검증기록/{d}/{cls}/{name}', 'dir', f'{cls}')
            continue
        for cls, pats in rules:
            if any(fnmatch.fnmatch(name, p) for p in pats):
                add('MOVE', f'{base}/{name}', f'03_검증기록/{d}/{cls}/{name}', 'file', cls)
                break

# ---- P4 나머지 디렉터리/파일 이동 -----------------------------------------------------------
add('MOVE', '01_자료·검증/2026-10-01_리뉴얼가이드', '04_수신자료/2026-10-01_리뉴얼가이드', 'dir', '수신 가이드 묶음(지침 아님)')
add('MOVE', 'AIO 웹사이트 전체 리뉴얼.zip', '04_수신자료/AIO 웹사이트 전체 리뉴얼.zip', 'file', '수신 원본 ZIP')
add('MOVE', sim, '03_검증기록/2026-10-07_워크플로우검증/aio-make-simulation', 'dir', '동결 시험 입력. 내부 구조·해시 불변')
add('MOVE', '01_자료·검증/AIO_워크플로우검증_CURRENT_v01.md', '03_검증기록/2026-10-07_워크플로우검증/AIO_워크플로우검증_CURRENT_v01.md', 'file', '시뮬레이션과 같은 폴더(상대 링크 유지)')
add('MOVE', '01_자료·검증/AIO_워크플로우검증_CURRENT_v02.md', '03_검증기록/2026-10-07_워크플로우검증/AIO_워크플로우검증_CURRENT_v02.md', 'file', '시뮬레이션과 같은 폴더(상대 링크 유지)')
add('MOVE', 'RENEWAL_PLAN_v05.md', '01_기획/RENEWAL_PLAN_v05.md', 'file', '리뉴얼 범위 기록')
add('MOVE', 'SESSION_PROMPT.md', f'{B}/original/SESSION_PROMPT.md', 'file', 'README.md 로 흡수')
add('MOVE', 'FOLDER_ORGANIZATION_RULES_v01.md', f'{B}/original/FOLDER_ORGANIZATION_RULES_v01.md', 'file', 'AGENTS.md §6 으로 흡수')

# ---- EDIT / NEW (정보용 행: 실행기가 건너뜀) ------------------------------------------------
final_edit = {
    '02_포트폴리오/README.md': '02_레퍼런스/README.md',
    '01_자료·검증/2026-10-12_레퍼런스재구성/REVIEW_REPORT_v02.md': '03_검증기록/2026-10-12_레퍼런스재구성/보고서/REVIEW_REPORT_v02.md',
    '01_자료·검증/2026-10-12_레퍼런스재구성/대표시안_로컬검토_v02.html': '03_검증기록/2026-10-12_레퍼런스재구성/시안/대표시안_로컬검토_v02.html',
    '01_자료·검증/2026-10-12_레퍼런스실제페이지적용/REPORT.md': '03_검증기록/2026-10-12_레퍼런스실제페이지적용/보고서/REPORT.md',
}
for p in EDITED:
    add('EDIT', p, final_edit.get(p, p), 'file', '내용 수정(수정 후 SHA 를 note 에 기록)')
NEW = [
    '99_보관/INDEX.md', '99_보관/CURRENT_HISTORY.md', '99_보관/PATH_MAP_2026-10-14.csv',
    f'{B}/README.md', f'{B}/MANIFEST_SHA256_BEFORE_v01.csv', f'{B}/MANIFEST_SHA256_AFTER_v01.csv',
    f'{B}/DUPLICATES_v01.csv', f'{B}/LINKS_BASELINE_v01.csv',
    f'{T}/README.md', f'{T}/MANIFEST.sha256',
    '01_기획/리뉴얼_2026-10-13_연결_v01.md', '01_기획/리뉴얼_2026-10-13_승인계획_v01.md',
    '03_검증기록/README.md', '03_검증기록/2026-10-07_워크플로우검증/README.md', '04_수신자료/README.md',
]
for p in NEW:
    add('NEW', '', p, 'file', '신규 작성')

with open(out, 'w', encoding='utf-8-sig', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['seq', 'action', 'old', 'new', 'kind', 'note'])
    w.writerows(rows)
import collections
print(dict(collections.Counter(r[1] for r in rows)))
```

### A-3 `apply_pathmap.ps1` — PATH_MAP 실행·역실행 (삭제 명령 없음)

```powershell
# apply_pathmap.ps1 -Root <00_AIO 웹사이트> -Map <PATH_MAP.csv> [-Reverse] [-From n] [-To m]
# PATH_MAP 의 COPY_ORIGINAL / RENAME / MOVE 행을 seq 순서대로 실행한다. 삭제 명령은 없다(Move-Item / Copy-Item 만 사용).
# 한 행이라도 실패하면 즉시 중단한다. -Reverse 는 MOVE/RENAME 만 역순으로 되돌린다(COPY_ORIGINAL 사본은 남긴다).
param(
  [Parameter(Mandatory)][string]$Root,
  [Parameter(Mandatory)][string]$Map,
  [switch]$Reverse,
  [int]$From = 1,
  [int]$To = 9999
)
$ErrorActionPreference = 'Stop'
$Root = (Resolve-Path -LiteralPath $Root).Path
function Abs([string]$rel) { Join-Path $Root ($rel -replace '/', '\') }
$rows = Import-Csv -LiteralPath $Map -Encoding UTF8 | Where-Object { $_.action -in 'COPY_ORIGINAL', 'RENAME', 'MOVE' }

# 1차: 각 행이 실행되는 시점의 실제 출발 경로(Cur) 계산 — 앞선 RENAME(최상위 폴더 이름 변경)을 반영
$ren = [ordered]@{}
$plan = foreach ($r in $rows) {
  $src = $r.old
  foreach ($k in $ren.Keys) { if ($src -eq $k -or $src.StartsWith("$k/")) { $src = $ren[$k] + $src.Substring($k.Length); break } }
  [pscustomobject]@{ seq = [int]$r.seq; action = $r.action; kind = $r.kind; old = $r.old; src = $src; dst = $r.new }
  if ($r.action -eq 'RENAME' -and $r.old -notmatch '/') { $ren[$r.old] = $r.new }
}

$plan = @($plan | Where-Object { $_.seq -ge $From -and $_.seq -le $To })
if (-not $Reverse) {
  foreach ($p in $plan) {
    $s = Abs $p.src; $d = Abs $p.dst
    if (-not (Test-Path -LiteralPath $s)) { throw "[$($p.seq)] 출발 경로 없음: $($p.src)" }
    if (Test-Path -LiteralPath $d) { throw "[$($p.seq)] 도착 경로가 이미 있음(덮어쓰기 금지): $($p.dst)" }
    if ($p.dst -like '99_보관/2026-10-14_폴더정비/empty-shells/*') {
      $n = @(Get-ChildItem -LiteralPath $s -Recurse -File -Force).Count
      if ($n -ne 0) { throw "[$($p.seq)] 빈 껍데기가 아님(파일 $n 개): $($p.src)" }
    }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $d) | Out-Null
    if ($p.action -eq 'COPY_ORIGINAL') {
      Copy-Item -LiteralPath $s -Destination $d
      if ((Get-FileHash -LiteralPath $s).Hash -ne (Get-FileHash -LiteralPath $d).Hash) { throw "[$($p.seq)] 사본 해시 불일치: $($p.src)" }
    } else {
      Move-Item -LiteralPath $s -Destination $d
    }
    '{0:D3} {1} {2} -> {3}' -f $p.seq, $p.action, $p.src, $p.dst
  }
} else {
  foreach ($p in ($plan | Where-Object { $_.action -ne 'COPY_ORIGINAL' } | Sort-Object seq -Descending)) {
    $s = Abs $p.dst; $d = Abs $p.src
    if (-not (Test-Path -LiteralPath $s)) { throw "[$($p.seq)] 되돌릴 대상 없음: $($p.dst)" }
    if (Test-Path -LiteralPath $d) { throw "[$($p.seq)] 원위치가 이미 있음: $($p.src)" }
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $d) | Out-Null
    Move-Item -LiteralPath $s -Destination $d
    '{0:D3} REVERSE {1} -> {2}' -f $p.seq, $p.dst, $p.src
  }
}
```

주의: 출력에 `| Select-Object -First n`을 붙이지 않는다(파이프가 실행을 중간에 끊는다). 로그가 필요하면 `> $W\apply.log 2>&1`.

### A-4 `verify_after.py` — 이동 전후 전수 대조

```python
# verify_after.py plan  <BEFORE.csv> <PATH_MAP.csv>
# verify_after.py after <BEFORE.csv> <AFTER.csv> <PATH_MAP.csv> [BEFORE_DIRS.txt AFTER_DIRS.txt]
# BEFORE/AFTER.csv: path,bytes,sha256  (hash_manifest.py 출력).  종료코드 0=PASS, 1=FAIL
import csv, sys, collections


def load(p):
    return {r['path']: (int(r['bytes']), r['sha256']) for r in csv.DictReader(open(p, encoding='utf-8-sig'))}


def load_map(p):
    return list(csv.DictReader(open(p, encoding='utf-8-sig')))


mode = sys.argv[1]
before = load(sys.argv[2])
if mode == 'plan':
    pm = load_map(sys.argv[3])
else:
    after = load(sys.argv[3])
    pm = load_map(sys.argv[4])

moves = sorted([(r['old'], r['new'], r['kind']) for r in pm if r['action'] in ('RENAME', 'MOVE')], key=lambda x: -len(x[0]))
edited = {r['old'] for r in pm if r['action'] == 'EDIT'}
copies = {r['new']: r['old'] for r in pm if r['action'] == 'COPY_ORIGINAL'}
news = {r['new'] for r in pm if r['action'] == 'NEW'}


def newpath(p):
    for o, n, k in moves:
        if p == o:
            return n
        if p.startswith(o + '/'):
            return n + p[len(o):]
    return p


fail = []
expected = {}
for p in before:
    q = newpath(p)
    if q in expected:
        fail.append(('COLLISION', p, q, expected[q]))
    expected[q] = p
for c in copies:
    if c in expected:
        fail.append(('COLLISION', c, c, expected[c]))
    expected[c] = '(copy)' + copies[c]
for n in news:
    if n in expected:
        fail.append(('COLLISION', n, n, expected[n]))
    expected[n] = '(new)'
print('before files', len(before), '| expected after files', len(expected), '| copies', len(copies), '| new', len(news))

if mode == 'after':
    a, e = set(after), set(expected)
    for p in sorted(e - a):
        fail.append(('MISSING_AFTER', p, expected[p]))
    for p in sorted(a - e):
        fail.append(('UNEXPECTED_AFTER', p))
    for q, src in expected.items():
        if q not in after or src in ('(new)',):
            continue
        if src.startswith('(copy)'):
            o = src[6:]
            if after[q][1] != before[o][1]:
                fail.append(('ORIGINAL_COPY_SHA_DIFF', q))
            continue
        if src in edited:
            continue  # 수정 대상: 원본은 copies 로 보존 확인
        if after[q] != before[src]:
            fail.append(('CONTENT_DIFF', src, q))
    print('after files', len(after), '| file count check:', 'OK' if len(after) == len(expected) else 'NG')
    if len(sys.argv) >= 7:
        bd = [l.rstrip('\n') for l in open(sys.argv[5], encoding='utf-8')]
        ad = {l.rstrip('\n') for l in open(sys.argv[6], encoding='utf-8')}
        for d in bd:
            if newpath(d) not in ad:
                fail.append(('DIR_MISSING', d, newpath(d)))
        print('dirs before', len(bd), '| after', len(ad))

for f in fail[:60]:
    sys.stdout.buffer.write((' '.join(map(str, f)) + '\n').encode('utf-8'))
print('RESULT', 'PASS' if not fail else 'FAIL (%d)' % len(fail))
sys.exit(1 if fail else 0)
```

`MANIFEST_SHA256_AFTER_v01.csv`는 자기 자신의 SHA를 담을 수 없으므로 Step 9에서 0바이트 자리표시 파일로 먼저 만들고, `verify_after.py`가 `NEW` 행은 내용 비교를 하지 않는 성질(위 코드의 `src in ('(new)',)` 건너뜀)로 통과시킨다.

### A-5 `linkcheck.py` — md 링크 기준선과 회귀 검증

```python
# linkcheck.py baseline <ROOT> <OUT_LINKS.csv>
# linkcheck.py verify   <ROOT> <LINKS_BASELINE.csv> <PATH_MAP.csv>
#   verify = (1) 이동 전 정상이던 md 링크가 이동 후에도 같은 대상을 가리키는지 (수정 대상 파일 제외)
#            (2) LIVE 범위(보관·수신·동결 시험 제외) 의 모든 md 링크가 깨지지 않았는지
import csv, os, re, sys, urllib.parse

PAT = re.compile(r'\]\((<[^>]+>|[^)\s]+)\)')
DRIVE = re.compile(r'^[A-Za-z]:[/\\]')
FROZEN = ('99_보관/', '04_수신자료/', '03_검증기록/2026-10-07_워크플로우검증/')


def links(root):
    for dp, dn, fn in os.walk(root):
        if os.path.relpath(dp, root).replace('\\', '/') == '00_운영관리' and 'database' in dn:
            dn.remove('database')   # database 는 열지 않는다
        for f in fn:
            if not f.lower().endswith('.md'):
                continue
            p = os.path.join(dp, f)
            rel = os.path.relpath(p, root).replace('\\', '/')
            try:
                t = open(p, encoding='utf-8').read()
            except Exception:
                continue
            for m in PAT.finditer(t):
                raw = m.group(1).strip('<>')
                if re.match(r'^(https?:|mailto:|#)', raw):
                    continue
                l = raw.split('#')[0]
                if not l:
                    continue
                if '%' in l:
                    l = urllib.parse.unquote(l)
                tgt = l if DRIVE.match(l) else os.path.join(dp, l)
                tgt = os.path.normpath(tgt)
                yield rel, l, tgt, os.path.exists(tgt)


mode, root = sys.argv[1], os.path.normpath(sys.argv[2])
if mode == 'baseline':
    n = bad = 0
    with open(sys.argv[3], 'w', encoding='utf-8-sig', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['src', 'link', 'target_abs', 'ok'])
        for rel, l, tgt, ok in links(root):
            w.writerow([rel, l, tgt, int(ok)])
            n += 1
            bad += (not ok)
    print('links', n, 'broken', bad)
    sys.exit(0)

base = list(csv.DictReader(open(sys.argv[3], encoding='utf-8-sig')))
pm = list(csv.DictReader(open(sys.argv[4], encoding='utf-8-sig')))
moves = sorted([(r['old'], r['new']) for r in pm if r['action'] in ('RENAME', 'MOVE')], key=lambda x: -len(x[0]))
edited = {r['old'] for r in pm if r['action'] == 'EDIT'}


def newpath(p):
    for o, n in moves:
        if p == o:
            return n
        if p.startswith(o + '/'):
            return n + p[len(o):]
    return p


fail = []
for r in base:
    if r['ok'] != '1' or r['src'] in edited:
        continue
    src_new = newpath(r['src'])
    l = r['link']
    old_t = os.path.normpath(r['target_abs'])
    inside = os.path.normpath(old_t).startswith(root + os.sep)
    exp = os.path.join(root, newpath(os.path.relpath(old_t, root).replace('\\', '/'))) if inside else old_t
    exp = os.path.normpath(exp)
    new_t = os.path.normpath(l if DRIVE.match(l) else os.path.join(root, os.path.dirname(src_new), l))
    if new_t != exp or not os.path.exists(new_t):
        fail.append(('REGRESSION', src_new, l, new_t))
live_bad = [(rel, l) for rel, l, tgt, ok in links(root) if not ok and not rel.startswith(FROZEN)]
for f in fail[:50]:
    sys.stdout.buffer.write((' | '.join(f) + '\n').encode('utf-8'))
for f in live_bad[:50]:
    sys.stdout.buffer.write(('LIVE_BROKEN | ' + ' | '.join(f) + '\n').encode('utf-8'))
print('regressions', len(fail), '| live broken', len(live_bad))
sys.exit(1 if (fail or live_bad) else 0)
```

현재(이동 전) 트리에서 `baseline`을 돌리면 `links 781 broken 418`이 나온다. `verify`의 “현행 범위” 판정은 이동 **후** 경로 접두(`99_보관/`, `04_수신자료/`, `03_검증기록/2026-10-07_워크플로우검증/`)를 기준으로 하므로 이동 전 트리에는 쓰지 않는다. 이 범위 밖에서 이동 전 깨져 있던 링크는 현행 4건뿐이고 모두 E04·E05·E06에서 고친다. E07·E08(수정 파일)은 `edited`로 회귀 비교에서 빠지고 대신 “현행 깨진 링크 0”으로 점검된다.

### A-6 보조: `fill_edit_sha.py`, `dups_csv.py`, `html_urlcheck.py`

```python
# fill_edit_sha.py <ROOT> <PATH_MAP.csv> <BEFORE.csv> : EDIT 행 note 에 before/after SHA(앞 12자) 기록
import csv, hashlib, sys
root, pmf, bf = sys.argv[1:4]
b = {r['path']: r['sha256'] for r in csv.DictReader(open(bf, encoding='utf-8-sig'))}
rows = list(csv.DictReader(open(pmf, encoding='utf-8-sig')))
for r in rows:
    if r['action'] == 'EDIT':
        h = hashlib.sha256(open(root + '/' + r['new'], 'rb').read()).hexdigest()
        r['note'] = 'before=%s after=%s' % (b[r['old']][:12], h[:12])
with open(pmf, 'w', encoding='utf-8-sig', newline='') as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)
```

```python
# dups_csv.py <BEFORE.csv> <OUT.csv> : 같은 SHA 를 가진 파일 묶음 목록(기록용, 이동·삭제 없음)
import csv, sys, collections
rows = list(csv.DictReader(open(sys.argv[1], encoding='utf-8-sig')))
g = collections.defaultdict(list)
for r in rows:
    g[r['sha256']].append(r)
with open(sys.argv[2], 'w', encoding='utf-8-sig', newline='') as fh:
    w = csv.writer(fh)
    w.writerow(['sha256', 'bytes', 'copies', 'paths'])
    for h, it in g.items():
        if len(it) > 1 and int(it[0]['bytes']) > 0:
            w.writerow([h, it[0]['bytes'], len(it), ' | '.join(i['path'] for i in it)])
```

```python
# html_urlcheck.py <HTML> : HTML 안의 file:/// URL 중 이 폴더를 가리키는 것이 모두 존재하는지
import os, re, sys, urllib.parse
t = open(sys.argv[1], encoding='utf-8').read()
n = bad = 0
for u in sorted(set(re.findall(r'file:///[^"\'\) <>]+', t))):
    p = urllib.parse.unquote(u[8:])
    if '00_AIO' in p:
        n += 1
        if not os.path.exists(p):
            bad += 1
            sys.stdout.buffer.write(('MISSING ' + p + '\n').encode('utf-8'))
print('self-folder file:/// urls', n, 'missing', bad)
```

### A-7 `scan_external_refs.py` — 폴더 밖 참조 재스캔

```python
# scan_external_refs.py <루트>...  : 이 폴더 이름·내부 이름을 인용하는 텍스트 파일을 폴더 밖에서 찾는다(결과: 건수<TAB>경로)
import os, re, sys
pat = re.compile(r'00_AIO 웹사이트|aio-make-simulation|AIO_워크플로우검증_CURRENT|AIO_웹툰레퍼런스_20s|AIO_요프리브랜드소개|AIO_힐러넷회사소개|AIO_브랜드인트로')
exts = ('.md', '.csv', '.json', '.txt', '.yaml', '.yml', '.ps1', '.py', '.mjs', '.js', '.ts', '.tsx', '.url', '.html')
skipdirs = {'node_modules', '.git', '.next', '.next-dev'}
me = os.path.normpath('I:/AIO_OS/01_WORK/01_에이전시/00_AIO 웹사이트')
for root in sys.argv[1:]:
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if d not in skipdirs]
        if os.path.normpath(dp).startswith(me):
            dn[:] = []
            continue
        for f in fn:
            if not f.lower().endswith(exts):
                continue
            p = os.path.join(dp, f)
            try:
                if os.path.getsize(p) > 8 * 1024 * 1024:
                    continue
                n = len(pat.findall(open(p, encoding='utf-8', errors='ignore').read()))
            except Exception:
                continue
            if n:
                sys.stdout.buffer.write(('%d\t%s\n' % (n, p)).encode('utf-8')); sys.stdout.flush()
```

### A-8 E09 시안 HTML 경로 치환

```python
# patch_html.py <HTML 의 새 위치>  : 퍼센트 인코딩된 옛 경로 2종만 새 경로로 바꾼다(줄바꿈 보존)
import urllib.parse, sys
p = sys.argv[1]
t = open(p, encoding='utf-8', newline='').read()
q = lambda s: urllib.parse.quote(s, safe='/')
pairs = [
    (q('01_자료·검증/2026-10-12_레퍼런스재구성/posters/'), q('03_검증기록/2026-10-12_레퍼런스재구성/시안/posters/'), 16),
    (q('01_자료·검증/2026-10-12_레퍼런스재구성/yofree-shop-cover.png'), q('03_검증기록/2026-10-12_레퍼런스재구성/시안/yofree-shop-cover.png'), 1),
]
for a, b, n in pairs:
    assert t.count(a) == n, (a, t.count(a))      # 기대 개수가 아니면 중단(HTML 이 바뀐 것)
    t = t.replace(a, b)
open(p, 'w', encoding='utf-8', newline='').write(t)
print('patched')
```
(이동 전 HTML에서 `16`과 `1`이 정확히 나오는 것을 확인했고, 치환 후 옛 문자열 0·새 문자열 16/1이 되는 것을 시험했다.)

### A-9 `make_index.py` — `99_보관/INDEX.md` 표 초안

```python
# make_index.py <99_보관 폴더> <OUT.md>  : 묶음 표(INDEX.md 본문 초안)를 만든다. 읽기 전용.
import os, re, sys

root, out = sys.argv[1], sys.argv[2]
rows = []
for name in sorted(os.listdir(root)):
    p = os.path.join(root, name)
    if not os.path.isdir(p):
        continue
    n = size = 0
    manifests = []
    for dp, dn, fn in os.walk(p):
        for f in fn:
            n += 1
            size += os.path.getsize(os.path.join(dp, f))
            if re.search(r'sha256|manifest', f, re.I) and dp == p:
                manifests.append(f)
    first = ''
    rp = os.path.join(p, 'README.md')
    if os.path.exists(rp):
        for line in open(rp, encoding='utf-8', errors='ignore'):
            line = line.strip()
            if line and not line.startswith('#'):
                first = line[:120]
                break
    rows.append('| %s | %d | %.1f MB | %s | %s |' % (name, n, size / 1048576, ', '.join(manifests) or '-', first.replace('|', '/')))
head = '| 묶음 | 파일 | 크기 | 무결성 기록(묶음 최상위) | 설명(README 첫 줄) |\n|---|---:|---:|---|---|\n'
open(out, 'w', encoding='utf-8', newline='\n').write(head + '\n'.join(rows) + '\n')
print(len(rows))
```

---

## 부록 B. 이 계획의 근거 수치 (2026-10-14 실측)

- 파일 1,132 / 587,257,573 B / 폴더 155 (`00_운영관리/database` 제외). 확장자 상위: png 385, md 192, html 133, json 101, jpg 73, txt 62, csv 34, woff2 28, log 25.
- md 링크 781, 깨짐 418(현행 4 · 시뮬레이션 163 · 가이드 27 · `99_보관` 묶음들 나머지).
- 중복 SHA 144그룹, 낭비 66,737,829 B(§1.3-3 분류).
- 외부 참조: `01_WORK` 현행 문서 17건(§2), `09_TRANSFER` 519파일·약 15,977건, 코드 작업트리 영향 없음(§2.2).
- 뼈대 복제본 시험: 1,132개 → 정방향 117행(복사 10 + 이름변경 3 + 이동 104) 오류 없음 → 수정·신규 모사 후 `verify_after.py after` PASS(1,157개, 폴더 155→177) → 역방향 107행 오류 없음.
- 아직 실제 폴더에 한 일: **없음**(해시·링크·참조 조사는 모두 읽기 전용).
