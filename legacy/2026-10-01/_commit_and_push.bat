@echo off
chcp 65001 >nul
setlocal

REM ============================================
REM  4_AIO_SITE — 1회용 커밋 + 푸시 스크립트
REM  실행 후 자동으로 자기 자신을 삭제합니다.
REM ============================================

cd /d "%~dp0"

echo.
echo ====================================================
echo  AIO_SITE  -  GitHub Commit and Push
echo ====================================================
echo.

REM 0) 죽은 락 파일 정리
if exist ".git\index.lock" (
    echo [0/4] stale .git\index.lock 제거 중...
    del /F /Q ".git\index.lock" >nul 2>&1
)

REM 1) 변경사항 확인
echo [1/4] 변경사항 확인...
git status --short
echo.

REM 2) 모든 변경사항 스테이징
echo [2/4] 전체 변경사항 스테이징...
git add -A
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] git add 실패
    pause
    exit /b 1
)
echo.

REM 3) 커밋
echo [3/4] 커밋 작성...
git commit -m "feat(site): v2 디자인 시스템 + admin/analytics/page-factory + 꿀팁받기 섹션" -m "" -m "디자인 시안 (4_AIO_SITE/_design_mockups/):" -m "- 메인 v5 (매거진 톤) + 01 웹/02 상세/03 PPT 신 디자인 시스템" -m "- 각 카테고리별 services/portfolio/resources 3-탭 구조" -m "- 꿀팁받기 별도 카테고리 페이지 3개 (IDE/라이프스타일/컨설턴트 톤)" -m "" -m "기능 추가:" -m "- admin: analytics/marketing/portfolios 페이지" -m "- API: page-factory, tracking-links, analytics" -m "- 페이지: services/[design|development] subcategory" -m "- 컴포넌트: portfolio-form, tracking-link-manager, analytics-init 외" -m "- DB: 005_portfolios_and_categories, 006_analytics_and_tracking 마이그레이션" -m "" -m "기존 파일 갱신:" -m "- locale layout/page, portfolio routes, services [category] 라우트" -m "- chatbot/quote-form/hero/faq/testimonials 섹션 다듬기" -m "- briefing.ts/telegram-templates.ts 보강" -m "- middleware/next.config/sitemap 설정 동기화"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] git commit 실패  -  변경 사항이 없거나 커밋 실패했습니다.
    pause
    exit /b 1
)
echo.

REM 4) 푸시
echo [4/4] origin/main 푸시...
git push origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARN] push 실패  -  원격 변경사항이 있을 수 있습니다.
    echo        git pull --rebase origin main 후 다시 시도해주세요.
    pause
    exit /b 1
)

echo.
echo ====================================================
echo  완료! GitHub에 푸시되었습니다.
echo ====================================================
echo.
echo 최근 커밋:
git log --oneline -3
echo.

REM 자기 자신 삭제
echo (이 스크립트는 자동 삭제됩니다)
timeout /t 3 >nul
del "%~f0"

endlocal
