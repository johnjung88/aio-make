# R7 디자인 검토용 로컬 미리보기

2026-10-15 · 소스 미수정·커밋 없음 · HEAD `3650788`(R7 FIX1) · 터널/외부 URL 없음 · 검증 결과는 `VERIFY_R7.md`

## 현재 실행

| 항목 | 값 |
|---|---|
| 서버 | `next start -p 3215` (전체 인터페이스 0.0.0.0 바인딩) |
| PID | **15932** |
| 스냅샷 | `.qa/r7-verify/src` (BUILD_ID `kmBMVWATSdvXLYUtGKw3W`, `public`·`node_modules`는 junction) |
| 환경 | `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, `NODE_OPTIONS=--max-old-space-size=1536` |
| 응답 헤더 | `X-Robots-Tag: noindex, nofollow, noarchive` (검토판) |
| 로그 | `.qa/r7-verify/server-review3.out.log`, `server-review3.err.log` (빌드 로그 `build-review2.log`) |

- 메인: http://localhost:3215/ · 컨텐츠 홈: http://localhost:3215/content
- 같은 LAN(같은 Wi-Fi) 기기: http://192.168.45.103:3215/ , http://192.168.45.103:3215/content (인증 없음, 사설망 한정, 외부 노출 아님)
- 서비스: `/content/services/webtoon`, `animation`, `ai-influencer`, `motion-graphics`, `ad`, `brand-film`
- 3213(PID 41252), 3214(PID 41552) 무변경. 작업트리 `.next/BUILD_ID` = `VyJyJwD8zeEXO5IGPQ7ZO` 유지. R6 미리보기(PID 15816)는 종료됨.
- 이 판은 R7 FIX1(설명문 줄바꿈, 마케팅 번호·제목 정렬, 푸터 링크 간격·높이, 옆 카드 클릭)이 반영된 상태이며 재검증 결과는 `VERIFY_R7.md` 9장이다. 직전 판(HEAD `833210c`)은 `.qa/r7-verify/src-833210c`에 보관.

## 종료

```powershell
netstat -ano | findstr :3215   # PID 확인, 3213/3214는 건드리지 않는다
Stop-Process -Id 15932
```

## 시작(재시작)

```powershell
$s='I:\AIO_OS\06_GITHUB\worktrees\aio-make\codex\WRK-20261013-AIO-CONTENT-RENEWAL\.qa\r7-verify\src'
$env:ENABLE_LEGACY_SUPABASE='false'; $env:AIO_LOCAL_ADMIN_ENABLED='false'
$env:NEXT_PUBLIC_AIO_REFERENCE_REVIEW='1'; $env:NODE_OPTIONS='--max-old-space-size=1536'
Start-Process node -ArgumentList './node_modules/next/dist/bin/next','start','-p','3215' -WorkingDirectory $s -WindowStyle Hidden
```

## 주의
- 검토판이라 고객 자료(요프리·힐러넷·BWL DR's Secret 등)가 보인다. 공개 권리는 UNKNOWN/HOLD이므로 LAN 밖으로 공유하지 않는다.
- PC·프로세스 종료 시 접속 불가.
- 공개판 빌드(BUILD_ID `RobdbTvzwH9Gf7UPCfGCP`)는 `.qa/r7-verify/next-public-build`에 보관되어 있고, 필요하면 `src/.next`와 바꿔서 띄울 수 있다(검토판과 동시에 띄우지 않는다).
