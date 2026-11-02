from __future__ import annotations

import asyncio
import os
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BLOG_APP = Path(r"C:\Users\PC\OneDrive\Desktop\BlogAutoPilot_travel")
OUT = ROOT / "public" / "portfolio" / "blogautopilot-multinational" / "real-demo"


def capture_app_tabs() -> None:
    os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")
    os.chdir(BLOG_APP)
    sys.path.insert(0, str(BLOG_APP))

    from PySide6.QtCore import QSize
    from PySide6.QtGui import QFont, QFontDatabase
    from PySide6.QtWidgets import QApplication
    from ui.main_window import MainWindow

    OUT.mkdir(parents=True, exist_ok=True)

    app = QApplication.instance() or QApplication([])
    QFontDatabase.addApplicationFont(r"C:\Windows\Fonts\malgun.ttf")
    QFontDatabase.addApplicationFont(r"C:\Windows\Fonts\malgunbd.ttf")
    app.setFont(QFont("Malgun Gothic", 10))
    window = MainWindow()
    window.resize(QSize(1440, 920))
    window.show()
    app.processEvents()

    tab_names = [
        ("dashboard", 0),
        ("schedule", 1),
        ("content-create", 2),
        ("project", 3),
        ("content-api", 4),
        ("content-extract", 5),
        ("content-source", 6),
        ("affiliate", 7),
        ("settings", 8),
    ]

    for name, idx in tab_names:
        window.tabs.setCurrentIndex(idx)
        app.processEvents()
        pixmap = window.grab()
        pixmap.save(str(OUT / f"app-{name}.png"))

    window.close()
    app.quit()


async def capture_browser_write_demo() -> None:
    from playwright.async_api import async_playwright

    OUT.mkdir(parents=True, exist_ok=True)
    editor = OUT / "browser-editor-demo.html"
    editor.write_text(
        """<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>BLOG_TRAVEL Browser Publishing Demo</title>
  <style>
    body { margin: 0; background: #edf2f7; color: #1f2937; font-family: "Segoe UI", "Malgun Gothic", sans-serif; }
    .top { height: 58px; background: #03c75a; color: white; display: flex; align-items: center; padding: 0 28px; font-size: 18px; font-weight: 700; }
    .wrap { display: grid; grid-template-columns: 270px 1fr; min-height: calc(100vh - 58px); }
    aside { background: #17202e; color: #cbd5e1; padding: 22px; }
    aside h2 { font-size: 15px; color: white; margin: 0 0 18px; }
    aside div { padding: 10px 12px; border-radius: 8px; margin: 8px 0; background: rgba(255,255,255,.06); }
    main { padding: 34px; }
    .bar { display: flex; gap: 10px; margin-bottom: 18px; }
    .badge { background: #dbeafe; color: #1d4ed8; border-radius: 999px; padding: 7px 12px; font-size: 13px; font-weight: 700; }
    .editor { background: white; border: 1px solid #d7dee8; border-radius: 14px; box-shadow: 0 20px 70px rgba(31,41,55,.13); padding: 30px; }
    input { width: 100%; border: none; border-bottom: 2px solid #e5e7eb; font-size: 34px; font-weight: 800; padding: 12px 0 18px; outline: none; }
    textarea { width: 100%; height: 410px; margin-top: 24px; border: none; resize: none; outline: none; font-size: 18px; line-height: 1.75; color: #374151; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; }
    .status { color: #059669; font-weight: 800; }
    button { border: 0; border-radius: 8px; background: #03c75a; color: white; font-weight: 800; font-size: 15px; padding: 12px 18px; }
  </style>
</head>
<body>
  <div class="top">NAVER Blog editor - safe portfolio demo</div>
  <div class="wrap">
    <aside>
      <h2>BLOG_TRAVEL 자동 발행 단계</h2>
      <div>1. 계정/카테고리 선택</div>
      <div>2. AI 제목/본문 생성</div>
      <div>3. 이미지/제휴 링크 삽입</div>
      <div>4. 브라우저 에디터 자동 입력</div>
      <div>5. 발행 전 최종 확인</div>
    </aside>
    <main>
      <div class="bar">
        <span class="badge">자동 브라우저 작성</span>
        <span class="badge">발행 직전 안전 모드</span>
        <span class="badge">Playwright 기반</span>
      </div>
      <section class="editor">
        <input id="title" placeholder="제목이 자동 입력됩니다" />
        <textarea id="body" placeholder="본문이 자동 입력됩니다"></textarea>
        <div class="footer">
          <div class="status" id="status">대기 중</div>
          <button>발행 전 검토</button>
        </div>
      </section>
    </main>
  </div>
</body>
</html>
""",
        encoding="utf-8",
    )

    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1440, "height": 920},
            record_video_dir=str(OUT),
            record_video_size={"width": 1440, "height": 920},
        )
        page = await context.new_page()
        await page.goto(editor.as_uri())
        await page.locator("#status").evaluate("(el) => el.textContent = '브라우저 연결 완료'")
        await page.screenshot(path=str(OUT / "browser-01-editor-open.png"), full_page=True)
        await page.locator("#title").click()
        await page.evaluate(
            """async (text) => {
              const input = document.querySelector('#title');
              input.focus();
              input.value = '';
              for (const ch of text) {
                input.value += ch;
                input.dispatchEvent(new Event('input', {bubbles: true}));
                await new Promise((resolve) => setTimeout(resolve, 45));
              }
            }""",
            "도쿄 3박4일 여행 준비물과 동선 자동 추천",
        )
        await page.screenshot(path=str(OUT / "browser-02-title-written.png"), full_page=True)
        await page.locator("#body").click()
        body = (
            "BLOG_TRAVEL이 여행 아이템 로테이션을 선택하고, AI 분석으로 제목과 섹션을 구성합니다.\n\n"
            "1. 국가별 계정과 카테고리를 자동 매칭합니다.\n"
            "2. 제휴 상품 후보를 선별하고 이미지 자산을 저장합니다.\n"
            "3. 품질 검사 후 브라우저 에디터에 제목, 본문, 해시태그를 순서대로 입력합니다.\n\n"
            "이 화면은 실제 자동 입력 흐름을 보여주는 포트폴리오 안전 모드입니다."
        )
        await page.evaluate(
            """async (text) => {
              const area = document.querySelector('#body');
              area.focus();
              area.value = '';
              for (const ch of text) {
                area.value += ch;
                area.dispatchEvent(new Event('input', {bubbles: true}));
                await new Promise((resolve) => setTimeout(resolve, 16));
              }
            }""",
            body,
        )
        await page.locator("#status").evaluate("(el) => el.textContent = '자동 입력 완료 - 발행 전 검토 단계'")
        await page.screenshot(path=str(OUT / "browser-03-body-written.png"), full_page=True)
        await page.wait_for_timeout(1200)
        await context.close()
        if page.video:
            video_path = Path(await page.video.path())
            target = OUT / "browser-write-demo.webm"
            if target.exists():
                target.unlink()
            video_path.replace(target)
        await browser.close()


def main() -> None:
    capture_app_tabs()
    asyncio.run(capture_browser_write_demo())


if __name__ == "__main__":
    main()
