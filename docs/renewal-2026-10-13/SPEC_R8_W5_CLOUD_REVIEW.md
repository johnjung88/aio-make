# SPEC R8 W5: 외부 확인용 클라우드 검토본 (Codex)

[Target]
- 사용자가 외부(다른 네트워크·휴대폰)에서 R8 결과를 볼 수 있도록 Vercel Hobby(계정 koreabencb-5027, 맥스테크 검토본과 같은 계정)에 **별도 검토 프로젝트**로 올린다. 사용자가 2026-10-16에 직접 요청했다.
- 기준은 작업트리 `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`의 최신 커밋에 W4 수정을 더한 상태다.

[Change]
0. **시작 조건**: `docs/renewal-2026-10-13/RESULT_R8_W4.md`의 첫 줄이 `판정: PASS`가 될 때까지 2분 간격으로 확인하며 기다린다. 이유는 공개 매니페스트 유출 수정(W4)이 끝나기 전에는 올리면 안 되기 때문이다. FAIL이면 올리지 말고 결과를 보고한다.
1. **배포 대상**: 공개판으로 올린다. `NEXT_PUBLIC_AIO_REFERENCE_REVIEW`는 설정하지 않는다.
   - 18개 레퍼런스 검토판은 공개 권리가 HOLD라서 올리지 않는다.
   - 환경은 `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`다. 비밀값이 필요한 기능(문의 저장·메일 등)은 꺼진 상태로 둔다. 비밀값은 읽거나 출력하지 않는다.
2. **프로젝트**: Vercel 프로젝트 이름은 `aio-make-r8-review`(새 프로젝트)다.
   - 운영 사이트 aio-make.com의 기존 Vercel 프로젝트, 도메인, 환경변수는 절대 건드리지 않는다. 링크·배포 전에 `vercel project ls`로 이름이 겹치지 않는지 확인한다.
   - 작업트리의 `.vercel` 링크가 운영 프로젝트를 가리키면 쓰지 않는다. 대신 `.qa/r8-cloud/src` 스냅샷(public 실파일 복사, node_modules 제외)에서 새로 링크한다.
3. **검색 노출 차단**: 모든 응답에 `X-Robots-Tag: noindex, nofollow`를 붙인다. 이 설정은 스냅샷 쪽 `vercel.json` headers에만 두고 저장소 파일에는 넣지 않는다. `robots.txt`는 Disallow 전체로 바꿔 스냅샷에만 둔다.
4. `vercel deploy --prod --yes`로 이 검토 프로젝트에 배포한다. 원격 빌드든 prebuilt든 상관없다. 메모리 부족 PC이므로 로컬 빌드는 한 번만 한다.
5. **배포 후 확인**: 외부 URL에서 다음을 확인한다.
   - `/`, `/content`, 서비스 6종이 200
   - 영상 6편 재생(Range 요청 206)
   - 소리 켜기 버튼 동작
   - `/content-examples/MANIFEST.json`이 404
   - 응답 HTML에 고객명 문자열 0건
   - 모든 응답에 noindex 헤더
   - Playwright 390·1440 스크린샷

[Constraints]
- 금지: git commit, git push, 운영 도메인·운영 프로젝트 변경, 유료 플랜·결제, 커스텀 도메인 연결, 새 외부 서비스 가입.
- 3215 검토 서버(PID 22076)는 건드리지 않는다.
- Vercel 로그인이 안 되어 있거나 인증이 필요하면 멈추고 보고한다. 사용자가 터미널에서 `! vercel login`을 하도록 안내한다.

[Acceptance]
- `docs/renewal-2026-10-13/RESULT_R8_W5.md`
  - 첫 줄: `판정: PASS|FAIL`
  - 둘째 줄: 검토 URL
  - 그 아래: 확인 표, 갱신 방법(재배포 명령), 내리는 방법(`vercel remove aio-make-r8-review`)

[추가 지시 2026-10-16 사용자] 컨텐츠 페이지만 올린다. 외부에서 보이는 페이지는 /content와 /content/** (서비스 6종, insights 등)만 둔다. 그 외 페이지 경로(/, /marketing, /lab, /about, /contact 등)는 스냅샷 vercel.json에서 /content로 리다이렉트한다(정적 자산 /_next, 이미지·영상·폰트 경로는 그대로 허용). 확인 항목에 "/ → /content 리다이렉트"와 "/marketing 리다이렉트"를 추가한다.

[추가 지시 2 · 2026-10-16 사용자 결정, 위 1번 대체] 고객 레퍼런스 18개까지 모두 올린다: 검토판 빌드(NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1)로 배포한다. 권리 책임은 사용자. noindex 헤더·robots Disallow·컨텐츠 페이지만(/content/** 와 /content/projects/** 포함) 규칙은 유지. 검토판이므로 "고객명 문자열 0건" 확인은 빼고, 대신 /content/projects/<slug> 몇 개가 200으로 열리는지 확인한다. MANIFEST.json 404 확인은 유지.
