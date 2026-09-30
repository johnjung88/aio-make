from __future__ import annotations

import asyncio
import sys
from pathlib import Path


BLOG_APP = Path(r"C:\Users\PC\OneDrive\Desktop\BlogAutoPilot_travel")
OUT = Path(r"C:\Users\PC\OneDrive\Desktop\ai-design-agency\public\portfolio\blogautopilot-multinational\real-demo")
ACCOUNT_ID = "41542b94-0c0a-4df6-ad39-937f81b3fe16"
BLOG_ID = "tae_nomad"


async def main() -> int:
    from playwright.async_api import async_playwright
    import os

    os.chdir(BLOG_APP)
    sys.path.insert(0, str(BLOG_APP))

    from db.manager import get_account_by_id
    from db.security import decrypt
    from core.login import find_chromium_executable

    chrome = find_chromium_executable()

    OUT.mkdir(parents=True, exist_ok=True)
    storage = BLOG_APP / "playwright" / "storage" / f"{ACCOUNT_ID}.json"
    if not storage.exists():
        storage = BLOG_APP / "playwright" / "storage" / "naver-session.json"

    async def ensure_login(pw) -> bool:
        account = get_account_by_id(ACCOUNT_ID)
        if not account:
            return False

        browser = await pw.chromium.launch(
            headless=False,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"],
            **({"executable_path": chrome} if chrome else {}),
        )
        context = await browser.new_context(
            storage_state=str(storage) if storage.exists() else None,
            locale="ko-KR",
            viewport={"width": 1440, "height": 920},
        )
        page = await context.new_page()
        await page.goto(f"https://blog.naver.com/{BLOG_ID}/postwrite", wait_until="domcontentloaded", timeout=60_000)
        await page.wait_for_timeout(2500)
        if "nidlogin" not in page.url and "nid.naver.com" not in page.url:
            await context.storage_state(path=str(storage))
            await context.close()
            await browser.close()
            return True

        naver_id = getattr(account, "naver_id", "") or BLOG_ID
        try:
            naver_pw = decrypt(getattr(account, "naver_pw_enc", ""), context="Naver password")
        except Exception:
            naver_pw = ""
        if not (naver_id and naver_pw):
            await context.close()
            await browser.close()
            return False

        await page.wait_for_selector("#id", timeout=20_000)
        await page.fill("#id", naver_id)
        await page.fill("#pw", naver_pw)
        await page.click("button[type='submit'], .btn_login")
        for _ in range(45):
            await page.wait_for_timeout(1000)
            if "nidlogin" not in page.url and "nid.naver.com" not in page.url:
                await context.storage_state(path=str(storage))
                await context.close()
                await browser.close()
                return True
        await context.close()
        await browser.close()
        return False

    async with async_playwright() as pw:
        logged_in = await ensure_login(pw)
        if not logged_in:
            return 2

        browser = await pw.chromium.launch(
            headless=False,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"],
            **({"executable_path": chrome} if chrome else {}),
        )
        context = await browser.new_context(
            storage_state=str(storage) if storage.exists() else None,
            locale="ko-KR",
            viewport={"width": 1440, "height": 920},
            record_video_dir=str(OUT),
            record_video_size={"width": 1440, "height": 920},
        )
        page = await context.new_page()
        await page.add_init_script(
            "Object.defineProperty(navigator, 'webdriver', {get: () => undefined});"
        )

        editor_url = f"https://blog.naver.com/{BLOG_ID}/postwrite"
        await page.goto(editor_url, wait_until="domcontentloaded", timeout=60_000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path=str(OUT / "naver-real-01-open.png"), full_page=True)

        if "nidlogin" in page.url or "nid.naver.com" in page.url:
            await context.close()
            await browser.close()
            return 2

        try:
            await page.evaluate(
                """() => {
                  document.querySelectorAll(
                    '.se-popup-button-confirm, .se-popup-button-cancel, .se-popup-alert button'
                  ).forEach((b) => b.click());
                  const help = document.querySelector('.se-help-panel-close-button');
                  if (help) help.click();
                  document.querySelectorAll('.se-popup-dim').forEach((d) => d.remove());
                }"""
            )
            await page.wait_for_selector(".se-documentTitle .se-text-paragraph", timeout=30_000)
            await page.click(".se-documentTitle .se-text-paragraph")
            await page.keyboard.type("도쿄 3박4일 여행 준비물 자동 추천", delay=45)
            await page.screenshot(path=str(OUT / "naver-real-02-title.png"), full_page=True)

            body = (
                "BLOG_TRAVEL이 여행 아이템 로테이션과 국가별 프롬프트를 기준으로 글을 생성합니다.\n\n"
                "콘텐츠 소스는 API와 CSV 캘린더로 관리하고, 여행 아이템·축제 이벤트·여행 종합 카테고리에 맞춰 "
                "투어, 숙박, 교통, 유심, 보험, 쇼핑 상품을 자동 매칭합니다.\n\n"
                "이 장면은 실제 네이버 에디터에 자동 입력되는 모습을 보여주며, 최종 발행 클릭은 포트폴리오 촬영 안전을 위해 제외합니다."
            )
            paragraphs = await page.query_selector_all(".se-component.se-text .se-text-paragraph")
            if paragraphs:
                await paragraphs[-1].click()
            else:
                await page.click(".se-component-content")
            await page.keyboard.type(body, delay=18)
            await page.screenshot(path=str(OUT / "naver-real-03-body.png"), full_page=True)
            await page.wait_for_timeout(2500)
            result = 0
        except Exception as exc:
            (OUT / "naver-real-error.txt").write_text(str(exc), encoding="utf-8")
            await page.screenshot(path=str(OUT / "naver-real-error.png"), full_page=True)
            result = 1

        await context.close()
        if page.video:
            video_path = Path(await page.video.path())
            target = OUT / "naver-real-editor.webm"
            if target.exists():
                target.unlink()
            video_path.replace(target)
        await browser.close()
        return result


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
