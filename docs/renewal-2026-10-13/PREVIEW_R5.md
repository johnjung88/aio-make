# R5 디자인 검토용 로컬 미리보기

2026-10-14 · 소스 미수정·커밋 없음 · HEAD `35ac724` · 터널/외부 URL 없음

## 현재 실행

| 항목 | 값 |
|---|---|
| 서버 | `next start -p 3215` (전체 인터페이스 0.0.0.0 바인딩) |
| PID | 32552 |
| 스냅샷 | `.qa/r5-preview/src` (BUILD_ID `w8dzyuaH1R1HJfkrXHtLP`, `public`·`node_modules`는 junction) |
| 환경 | `ENABLE_LEGACY_SUPABASE=false`, `AIO_LOCAL_ADMIN_ENABLED=false`, `NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`, `NODE_OPTIONS=--max-old-space-size=1536` |
| 로그 | `.qa/r5-preview/build.log`, `server.out.log`, `server.err.log` |

- 로컬: http://localhost:3215/content
- 같은 LAN(같은 Wi-Fi) 기기: http://192.168.45.103:3215/content (인증 없음, 사설망 한정, 외부 노출 아님)
- 서비스 경로: `/content/services/webtoon`, `/animation`, `/ad` 등 (`/content/services/<id>`)
- 확인: `/`, `/content`, `/content/services/webtoon|animation|ad` 모두 HTTP 200
- 3213(PID 41252), 3214(PID 41552) 무변경, 작업트리 `.next/BUILD_ID` = `VyJyJwD8zeEXO5IGPQ7ZO` 유지

## 종료

```powershell
Stop-Process -Id 32552   # 먼저 netstat -ano | findstr :3215 로 PID 확인. 3213/3214는 건드리지 않는다
```

## 시작(재시작)

3215가 비어 있는지 확인한 뒤 PowerShell에서:

```powershell
$s='I:\AIO_OS\06_GITHUB\worktrees\aio-make\codex\WRK-20261013-AIO-CONTENT-RENEWAL\.qa\r5-preview\src'
$env:ENABLE_LEGACY_SUPABASE='false'; $env:AIO_LOCAL_ADMIN_ENABLED='false'
$env:NEXT_PUBLIC_AIO_REFERENCE_REVIEW='1'; $env:NODE_OPTIONS='--max-old-space-size=1536'
Start-Process node -ArgumentList './node_modules/next/dist/bin/next','start','-p','3215' -WorkingDirectory $s -WindowStyle Hidden
```

로컬 전용으로 제한하려면 `-H 127.0.0.1`을 추가한다. 새 빌드가 필요하면 같은 환경변수로 `$s`에서 `next build` 후 시작한다(소스 변경 시 스냅샷 재복사).

## 주의
- 검토판(`NEXT_PUBLIC_AIO_REFERENCE_REVIEW=1`)이라 고객 자료가 보인다. 공개 권리는 UNKNOWN/HOLD이므로 LAN 밖으로 공유하지 않는다.
- PC·프로세스 종료 시 접속 불가.
