# R3 휴대폰 검토용 비공개 미리보기

2026-10-14 10:47 KST · 사용자 모바일데이터/다른 Wi-Fi 검토 요청으로 시작

- 컨텐츠: https://hotel-separated-wrist-acceptable.trycloudflare.com/content
- 메인: https://hotel-separated-wrist-acceptable.trycloudflare.com/
- 브라우저 인증창에 이번 대화에서 전달한 임시 자격 입력
- 비밀번호는 문서·파일·로그에 저장하지 않음, 서버에는 scrypt salt/hash만 보관
- R3 최종 격리 빌드, production 배포나 push 아님

## 현재 실행

| 역할 | 접근 | PID |
|---|---|---:|
| R3 Next 서버 | 127.0.0.1:3215 | 30244 |
| 암호보호 읽기 전용 프록시 | 127.0.0.1:3216 | 30780 |
| Cloudflare 임시 HTTPS 터널 | 위 URL → 3216 | 14380 |

기존3213 PID41252·3214 PID41552 유지, 방화벽/계정/도메인 변경 없음
이전 QA 종료 후 사용자 휴대폰 검수 요청으로 새로 시작했으며 검수를 위해 실행 유지
PC/프로세스 종료 시 접속 불가, 터널 재시작 시 임시 URL이 바뀔 수 있음

## 확인한 항목

- 구현 담당 프록시 builtin18검사 PASS, 인증 전에 upstream 호출 없음
- 독립 외부 HTTPS10검사 PASS: 무인증/오인증401, 정상인증 메인/컨텐츠/서비스/이미지/RSC200, POST405
- no-store/private/max-age0 및 noindex/nofollow/noarchive 확인
- 실제 Chrome390×844 외부URL 인증 후 이미지 로드·넘침0·JS오류0·서비스 메뉴 클릭 확인
- 캡처를 직접 열어 확인: `.qa/phone-preview-r3/https-mobile-content.png`
- 실물 휴대폰의 접속·브라우저 인증창은 사용자 확인 전
- 문의 제출은 읽기 전용 보호로 차단, 실제 문의/메일/GA4 검증 아님
- 고객자료 공개 권리 UNKNOWN/HOLD 유지, 익명 공개 접근 허용 아님

근거: `.qa/phone-preview-r3/https-checks.json`, `https-browser.json`, `runtime.json`, `tunnel.stderr.log`
프록시 자료는 Git 무시 `.qa/phone-preview-r3/`, backend 기록은 `.qa/design-r3-independent/phone-preview-server.json`

## 종료와 재시작

PID가 위 역할의 현재 프로세스인지 확인 후 터널14380, 프록시30780, backend30244 순으로 해당 PID만 Stop-Process로 종료
3213/3214는 종료하지 않음

작업트리: `I:/AIO_OS/06_GITHUB/worktrees/aio-make/codex/WRK-20261013-AIO-CONTENT-RENEWAL`
3215/3216이 비어 있는지 확인하고 중복 시작하지 않음

1. backend는 VERIFY_DESIGN_R3의 스냅샷 경로와 환경변수를 사용하고 `node ./node_modules/next/dist/bin/next start -H 127.0.0.1 -p 3215`
2. 기존 암호 해시를 유지하려면 작업트리에서 `node .qa/phone-preview-r3/proxy.mjs`
3. `cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3216 --protocol http2`
4. 새 HTTPS URL에서 무인증401/인증200 확인 후 사용자에게 새 URL 전달

백그라운드 실행은 Start-Process -WindowStyle Hidden 사용, stdout/stderr는 .qa/phone-preview-r3에 분리하고 새 PID를 runtime.json에 기록
비밀번호 분실 시 기존 프록시 종료 후 start-preview.ps1로 새 임시 접근정보를 발급하고 대화에만 전달
