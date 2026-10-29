// Rebuild HTML result screens from the checked-in source photos, without a server.
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { chromium } = require(
  process.env.PLAYWRIGHT_CORE_PATH ||
    "C:/AIO-PC2/00-admin/tools/rea-agents/6.7.0/node_modules/playwright-core",
);
const folder = path.resolve("public/marketing-renewal");
const photo = async (name) =>
  "data:image/webp;base64," +
  (await fs.readFile(path.join(folder, name + ".webp"))).toString("base64");
const materials = await Promise.all(
  [0, 1, 2, 3].map((i) => photo("material-" + i)),
);
const people = await Promise.all([0, 1, 2].map((i) => photo("persona-" + i)));
const roles = await Promise.all(
  [0, 1, 2].map((i) => photo("persona-role-" + i)),
);
const feedPhotos = await Promise.all(
  Array.from({ length: 9 }, (_, i) => photo("feed-" + i)),
);
const font = (
  await fs.readFile("public/fonts/PretendardVariable.woff2")
).toString("base64");
const css = `@font-face{font-family:p;src:url(data:font/woff2;base64,${font})}*{box-sizing:border-box}body{margin:0;background:#141414;font:22px/1.5 p,sans-serif;color:#282b25}main{width:100vw;height:100vh;padding:6%;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 100%,#6da98718,transparent 55%),#141414;box-shadow:inset 0 0 0 1px #6da98735;overflow:hidden}h1,h2,h3,p,figure{margin:0}h1{font-size:42px;line-height:1.25;letter-spacing:-.04em}h2{font-size:30px;line-height:1.4;letter-spacing:-.03em}h3{font-size:24px;line-height:1.4}small{font-size:16px;color:#77786f}img{display:block;object-fit:cover;width:100%;height:100%}.app{width:100%;background:#f9f8f3;border:1px solid #bcb8ad;border-radius:16px;overflow:hidden;box-shadow:0 30px 70px #302d2425}.bar{padding:18px 28px;border-bottom:1px solid #dbd9d0;display:flex;justify-content:space-between;align-items:center;font-size:18px;color:#76766d}.dots{letter-spacing:6px;color:#9a9a90}.body{padding:32px}.eyebrow{font-size:15px;letter-spacing:.15em;color:#687b57;margin-bottom:12px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.grid.three{grid-template-columns:repeat(3,1fr)}.panel{padding:24px;border:1px solid #dcd9d1;border-radius:10px;background:#fffefa}.panel p{margin-top:12px;font-size:20px;color:#696d61}.pill{display:inline-block;padding:6px 12px;background:#e7ecdf;color:#48583d;border-radius:6px;font-size:16px}.muted{color:#828579}.line{height:8px;background:#e5e4dd;border-radius:5px;margin-top:15px}.line.short{width:65%}.rule{height:1px;background:#d4d5ca;margin:22px 0}table{border-collapse:collapse;width:100%;font-size:20px}td,th{text-align:left;padding:13px 12px;border-bottom:1px solid #dfded7}th{font-size:16px;color:#777b70;font-weight:500}.phone{border:7px solid #2c2e28;border-radius:30px;background:#faf8f1;overflow:hidden;box-shadow:0 20px 30px #302d2420;min-width:0}.phone>header{padding:14px 20px;font-size:20px;border-bottom:1px solid #ddd}.phone .content{padding:20px}.feed{display:grid;grid-template-columns:repeat(3,1fr);gap:5px}.feed img{aspect-ratio:1}.postimage{height:320px}.phone small{font-size:15px}.phone h2{font-size:26px}.sheet{width:100%;height:100%;background:#faf8f0;padding:5%;border:1px solid #d1cbbf;display:flex;flex-direction:column;gap:24px}.shot{overflow:hidden;min-height:0;border-radius:6px}.shot img{object-position:center 30%}.hero-photo{height:100%;width:100%;position:relative}.hero-photo>.shot{position:absolute;inset:0 10% 0 0}.inset{position:absolute;right:0;bottom:0;width:27%;height:58%;border:8px solid #f8f3e9;box-shadow:0 10px 30px #0003}.calendar{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:20px}.calendar div{height:72px;background:#eeeee5;padding:10px;border-radius:5px;font-size:15px}.calendar span{display:block;height:7px;width:65%;background:#b9c8a6;margin-top:10px;border-radius:4px}.caption{font-size:15px;letter-spacing:.04em;color:#78796f}.flow{display:grid;grid-template-columns:1fr 40px 3fr;gap:20px;align-items:center;width:100%}.flow>.source{height:430px}.arrow{font-size:44px;color:#c0bbc9}.source small{color:#c0bbc9}main>.flow>.source small{color:#c0bbc9}.source-heading h1{color:#f7f5f2}.source-heading p{color:#c0bbc9}.flow>.grid{align-items:start}.ribbon{display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:32px;width:100%;align-items:center}.ribbon>.app,.ribbon>.phone{box-shadow:0 20px 45px #302d2425}.resulthead{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.check{font-size:20px;color:#526549;margin:14px 0}.page{padding:28px;background:white;border:1px solid #ddd;border-radius:8px}.page p{font-size:20px;margin:12px 0}.bento{display:grid;grid-template-columns:1fr 1fr;gap:24px}.scene4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.scene4 img{height:360px}.scene4 h3{font-size:20px;margin-top:12px}.scene4 p{font-size:16px}.cardscene{width:100%;height:100%;display:flex;align-items:center}body.mobile main{padding:5%}body.mobile .body{padding:22px}body.mobile .board{grid-template-columns:1fr}body.mobile .board>.panel{display:none}body.mobile .phoneshero{gap:16px}body.mobile .phoneshero .phone{width:48%}body.mobile h1{font-size:38px}body.mobile .hero-photo>.shot{inset:0 5% 0 0}body.mobile .inset{height:45%;width:34%}body.mobile .searchhero .panel{padding:20px}body.mobile .searchhero .body>div:last-child{display:none}`;
const img = (src, style = "") => `<img src="${src}" style="${style}">`;
const lines = (n = 3) =>
  Array.from(
    { length: n },
    (_, i) => `<div class="line ${i % 2 ? "short" : ""}"></div>`,
  ).join("");
const app = (title, body, cls = "") =>
  `<div class="app ${cls}"><div class="bar"><span class="dots">●●●</span><span>${title}</span><span>↗</span></div><div class="body">${body}</div></div>`;
const phone = (src, title = "귀리 라떼", kind = "FEED") =>
  `<div class="phone"><header>LEAF <small> ${kind}</small></header><div class="postimage">${img(src)}</div><div class="content"><small>CAFE LEAF · 메뉴 이야기</small><h2>${title}</h2><p style="font-size:18px;margin-top:8px">오늘의 메뉴를 소개합니다</p></div></div>`;
const search = (before = false) =>
  `<div class="panel"><small>cafe-leaf.example / menu</small><h2 style="color:#5d6284;margin:14px 0">${before ? "홈 | 회사소개 | 메뉴" : "귀리 라떼는 어떻게 만들까요?"}</h2><p>${before ? "소개 · 메뉴 · 위치 · 문의" : "귀리로 만드는 라떼의 재료와 메뉴 구성을 확인하세요"}</p></div>`;
const answer = `<div class="panel"><p class="eyebrow">질문에 바로 답하는 정보</p><h2>귀리 라떼, 무엇이 다른가요?</h2><p>사용하는 재료와 메뉴의 특징을<br>페이지 첫 문단에서 안내합니다</p><div class="rule"></div><small>참고한 곳 · 카페 리프 메뉴 안내</small></div>`;
const planRows = Array.from(
  { length: 20 },
  (_, i) =>
    `<tr><td>${String(i + 1).padStart(2, "0")}</td><td>${["신메뉴 소개", "재료 이야기", "매장 이용 안내", "고객 질문", "제품 사용 장면"][i % 5]}</td><td>${["피드", "블로그", "쇼츠"][i % 3]}</td><td><span class="pill">검토 예정</span></td></tr>`,
).join("");
const calendar = `<div class="calendar">${Array.from({ length: 20 }, (_, i) => `<div>${String(i + 1).padStart(2, "0")}<span></span></div>`).join("")}</div>`;
const board = () =>
  app(
    "LEAF / MONTHLY PLAN",
    `<div class="resulthead"><div><p class="eyebrow">MONTHLY OPERATIONS</p><h1>한 달의 이야기를<br>하나의 방향으로</h1></div><span class="pill">월간 계획</span></div><div class="grid board"><div><h3>이번 달 컨텐츠 캘린더</h3>${calendar}<div class="rule"></div><small>계획 → 초안 확인 → 게시 → 다음 계획</small></div><div class="panel">${img(materials[0], "height:180px;border-radius:6px;margin-bottom:16px")}<h3>같은 메뉴, 다른 채널</h3><p>인스타그램 · 블로그 · 지도 정보</p>${lines(2)}</div></div>`,
  );
const report = () =>
  app(
    "LEAF / OPERATIONS REPORT",
    `<p class="eyebrow">MONTHLY REPORT</p><h1>운영 내역과 다음 계획</h1><div class="rule"></div><table><tr><th>게시 컨텐츠</th><th>확인한 반응</th><th>다음에 반영할 것</th></tr>${["신메뉴 소개", "재료 이야기", "매장 이용 안내", "고객 질문 답변"].map((t, i) => `<tr><td>${t}</td><td>${["재료에 관한 질문", "이용 방법 문의", "위치 정보 확인", "다음 주제 검토"][i]}</td><td>${["재료 설명 보완", "사용 장면 추가", "안내 페이지 연결", "다음 계획에 반영"][i]}</td></tr>`).join("")}</table><div class="grid three" style="margin-top:24px">${["고객 질문 정리", "다음 달 주제", "채널별 형식"].map((t) => `<div class="panel"><h3>${t}</h3>${lines(2)}</div>`).join("")}</div>`,
  );
const channelSet = (withSource = false) =>
  `<div class="${withSource ? "flow" : "cardscene"}">${withSource ? `<div class="source">${img(materials[0], "border-radius:12px")}<small>원본 한 장</small></div><div class="arrow">→</div>` : ""}<div class="grid three" style="width:100%">${phone(materials[0])}${app("LEAF JOURNAL", `<small>메뉴 이야기</small><h2>우유 대신 귀리로 만드는<br>오늘의 라떼</h2><div style="height:210px;margin-top:20px">${img(materials[0])}</div>${lines(4)}`)}${app("SEARCH & ANSWER", `${answer}<div style="margin-top:20px">${search()}</div>`)}</div></div>`;
const feed = () =>
  app(
    "LEAF / SOCIAL FEED",
    `<div style="display:flex;gap:20px;align-items:center;margin-bottom:24px"><div style="background:#7a8969;border-radius:100%;width:70px;height:70px;color:#fff;display:grid;place-items:center;font-size:24px">L</div><div><h2>카페 리프</h2><small>메뉴와 공간에 담긴 이야기</small></div></div><div class="feed">${Array.from({ length: 9 }, (_, i) => img(feedPhotos[i], `object-position:${20 + i * 8}% ${30 + i * 6}%;filter:${i % 2 ? "brightness(.92)" : "none"}`)).join("")}</div>`,
  );
const personaSheet = () =>
  `<div class="sheet"><p class="eyebrow">CHARACTER REFERENCE</p><h1>AIO 가상 인물</h1><div class="grid three" style="flex:1;min-height:0">${people.map((p, i) => `<div class="shot">${img(p, "object-position:center " + (i === 1 ? "center" : "top"))}</div>`).join("")}</div><div class="caption">정면 · 전신 · 측면 / 같은 인물의 얼굴과 헤어 기준</div></div>`;
const storyboard = () =>
  `<div class="sheet"><p class="eyebrow">30 SECOND STORYBOARD</p><h1>한 인물이 이어가는 제품 이야기</h1><div class="scene4">${[people[0], roles[1], roles[2], people[1]].map((p, i) => `<div><div class="shot">${img(p)}</div><h3>0${i + 1} ${["제품 소개", "사용 순서", "생활 속 배치", "제품 정보 안내"][i]}</h3><p>${["확인된 정보로 시작", "순서대로 보여주기", "같은 말투 유지", "자세한 정보로 연결"][i]}</p></div>`).join("")}</div></div>`;
const aiReport = () =>
  app(
    "BRAND / PUBLISHING LOG",
    `<p class="eyebrow">MONTHLY CONTENT LOG</p><h1>한 달의 게시 내역</h1><table style="margin-top:24px"><tr><th>주제</th><th>채널</th><th>게시일</th></tr>${["제품 소개", "사용 순서", "재료 정보", "보관 방법", "구성품 안내", "고객 질문", "브랜드 이야기", "다음 주제"].map((t, i) => `<tr><td>${t}</td><td>${i % 2 ? "인스타그램" : "쇼츠"}</td><td>—</td></tr>`).join("")}</table>`,
  );
const seoHero = () =>
  app(
    "SEARCH / CUSTOMER QUESTION",
    `<div class="searchhero"><div style="background:#eeeae1;border-radius:50px;padding:18px 28px;margin-bottom:24px;color:#6a6c62">⌕ 귀리 라떼는 어떻게 만들까요?</div>${answer}<div style="margin-top:20px">${search()}</div><div style="margin-top:20px">${search(true)}</div></div>`,
  );
const diagnosis = () =>
  app(
    "SITE / DIAGNOSIS",
    `<p class="eyebrow">SITE REVIEW</p><h1>읽을 수 있는 정보부터 점검합니다</h1><table style="margin-top:28px"><tr><th>진단 항목</th><th>현재 상태</th><th>고칠 곳</th></tr>${["페이지 제목과 설명", "질문형 소제목", "가격·범위 문단", "FAQ 구조화 데이터", "사이트맵·색인 허용"].map((t, i) => `<tr><td>${t}</td><td><span class="pill">${["있음", "부분", "없음"][i % 3]}</span></td><td>${["페이지별 설명 구분", "고객 질문을 제목으로", "확인된 조건 정리", "질문과 답의 연결 확인", "접근 가능한 주소 확인"][i]}</td></tr>`).join("")}</table>`,
  );
const beforeAfter = () =>
  app(
    "PAGE / BEFORE & AFTER",
    `<div class="grid"><div><p class="eyebrow">정리 전</p><div class="page"><h2>서비스 소개</h2>${lines(5)}<div style="height:220px;background:#e5e2d9;margin-top:24px"></div></div></div><div><p class="eyebrow">정리 후</p><div class="page"><h2>어떤 서비스인가요?</h2><p>대상과 제공 범위를 첫 문장에 안내합니다</p><div class="rule"></div><h3>비용과 범위</h3><p>자료와 작업 범위를 확인한 뒤 견적을 정합니다</p><div class="rule"></div><h3>무엇을 준비하나요?</h3><p>사이트 주소와 접근 권한, 제품 정보를 준비합니다</p></div></div></div>`,
  );
const handoff = () =>
  app(
    "SITE / HANDOVER",
    `<p class="eyebrow">OPERATING GUIDE</p><h1>운영자가 유지할 설정</h1><div class="rule"></div>${["페이지 제목과 설명 관리", "사이트맵 갱신 위치", "질문과 답변 구조화 데이터", "확인된 가격·범위 정보", "설정 담당자와 인계 항목"].map((t) => `<div class="check">□ ${t}</div>`).join("")}<div class="panel" style="margin-top:24px"><h3>변경 후 확인</h3><p>접근 · 링크 · 정보 표시 · 분석 수집 여부</p></div>`,
  );
const extraCss =
  "<style>.ribbon .searchhero>div:last-child{display:none}table:has(tr:nth-child(20)) td{padding:5px 10px}table:has(tr:nth-child(20)) .pill{padding:2px 8px;font-size:13px}</style>";
const scenes = {
  "home-ribbon": `<div class="ribbon">${phone(materials[0])}${app("LEAF JOURNAL", `<p class="eyebrow">FROM OUR KITCHEN</p><h1>매일의 라떼에<br>새로운 선택을</h1><div style="height:220px;margin:24px 0">${img(materials[3])}</div>${lines(3)}`)}${seoHero()}</div>`,
  "home-touchpoints": channelSet(true),
  "integrated-card": report(),
  "sns-card": feed(),
  "ai-influencer-card": personaSheet(),
  "seo-card": seoHero(),
  "integrated-hero": board(),
  "sns-hero": `<div class="grid phoneshero" style="width:90%;align-items:center;gap:40px">${phone(materials[0])}${phone(materials[3], "오늘의 식탁", "SHORTS")}</div>`,
  "ai-influencer-hero": `<div class="hero-photo"><div class="shot">${img(people[0])}</div><div class="inset">${img(people[1])}</div></div>`,
  "seo-hero": seoHero(),
  "integrated-result-1": app(
    "LEAF / CONTENT PLAN",
    `<p class="eyebrow">MONTHLY EDITORIAL</p><h1>월간 운영 계획</h1><table style="margin-top:20px;font-size:14px"><tr><th>원본</th><th>주제</th><th>채널</th><th>검토</th></tr>${planRows}</table>`,
  ),
  "integrated-result-2": channelSet(),
  "integrated-result-3": report(),
  "sns-result-1": feed(),
  "sns-result-2": app(
    "LEAF JOURNAL",
    `<p class="eyebrow">메뉴 이야기</p><h1>귀리 라떼,<br>무엇이 다른가요?</h1><div style="height:260px;margin:24px 0">${img(materials[0])}</div><p>우유 대신 귀리로 만듭니다</p>${lines(3)}<div style="height:140px;margin-top:24px">${img(materials[3])}</div>`,
  ),
  "sns-result-3": `<div class="sheet"><p class="eyebrow">SHORTS / SCENE PLAN</p><h1>한 메뉴를 세 장면으로</h1><div class="grid three" style="flex:1;min-height:0">${[0, 3, 0].map((n, i) => `<div class="shot" style="position:relative">${img(materials[n])}<h2 style="position:absolute;bottom:30px;left:20px;color:white;text-shadow:0 1px 5px #0008">${["메뉴를 소개해요", "재료를 살펴봐요", "매장에서 만나요"][i]}</h2></div>`).join("")}</div></div>`,
  "ai-influencer-result-1": personaSheet(),
  "ai-influencer-result-2": storyboard(),
  "ai-influencer-result-3": aiReport(),
  "seo-result-1": diagnosis(),
  "seo-result-2": beforeAfter(),
  "seo-result-3": handoff(),
};
async function fit(page) {
  await page.evaluate(() => {
    const main = document.querySelector("main");
    const el = main.firstElementChild;
    const style = getComputedStyle(main);
    const availableW =
      main.clientWidth -
      parseFloat(style.paddingLeft) -
      parseFloat(style.paddingRight);
    const availableH =
      main.clientHeight -
      parseFloat(style.paddingTop) -
      parseFloat(style.paddingBottom);
    const box = el.getBoundingClientRect();
    const scale = Math.min(
      1,
      availableW / box.width,
      availableH / Math.max(box.height, el.scrollHeight),
    );
    el.style.flexShrink = "0";
    el.style.transform = "scale(" + scale + ")";
    el.style.transformOrigin = "center";
  });
}
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.CHROMIUM_PATH ||
    "C:/Users/aioma/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe",
});
try {
  const page = await browser.newPage();
  for (const [name, scene] of Object.entries(scenes)) {
    const hero = name.endsWith("-hero"),
      ribbon = name === "home-ribbon",
      sns = name.startsWith("sns-result");
    if (process.env.ASSET_FILTER && !name.includes(process.env.ASSET_FILTER))
      continue;
    const flow = name === "home-touchpoints";
    const width = ribbon ? 2000 : flow ? 1600 : hero ? 1600 : 1200,
      height = ribbon ? 760 : flow ? 686 : hero ? 1000 : sns ? 1500 : 900;
    await page.setViewportSize({ width, height });
    await page.setContent(
      `<style>${css}</style>${extraCss}<main>${scene}</main>`,
    );
    await page.evaluate(() => document.fonts.ready);
    await fit(page);
    await sharp(await page.screenshot())
      .webp({ quality: 88 })
      .toFile(path.join(folder, name + ".webp"));
    if (flow) {
      await page.setViewportSize({ width: 800, height: 1600 });
      const rows = ["인스타그램 피드", "블로그 글", "검색·답변"]
        .map((title, i) =>
          app(
            title,
            '<div style="display:grid;grid-template-columns:190px 1fr;gap:24px;align-items:center"><div style="height:200px">' +
              img(materials[0]) +
              "</div><div><h2>" +
              [
                "귀리로 만드는 오늘의 라떼",
                "귀리 라떼는 무엇이 다른가요?",
                "메뉴 정보를 먼저 확인하세요",
              ][i] +
              '</h2><p style="font-size:26px;margin-top:16px">같은 소재를 채널에 맞는 이야기로</p>' +
              lines(2) +
              "</div></div>",
          ),
        )
        .join("");
      await page.setContent(
        "<style>" +
          css +
          '</style><main><div style="display:flex;flex-direction:column;gap:20px;width:100%"><div style="display:flex;align-items:center;gap:24px"><div style="height:200px;width:200px">' +
          img(materials[0]) +
          '</div><div class="source-heading"><p class="eyebrow">ONE SOURCE</p><h1>원본 한 장</h1><p>↓ 세 채널로</p></div></div>' +
          rows +
          "</div></main>",
      );
      await page.evaluate(() => document.fonts.ready);
      await fit(page);
      await sharp(await page.screenshot())
        .webp({ quality: 90 })
        .toFile(path.join(folder, name + "-mobile.webp"));
    }
    if (hero) {
      await page.setViewportSize({ width: 1000, height: 1250 });
      await page.setContent(
        `<style>${css}</style>${extraCss}<body class="mobile"><main>${scene}</main></body>`,
      );
      await page.evaluate(() => document.fonts.ready);
      await fit(page);
      await sharp(await page.screenshot())
        .webp({ quality: 88 })
        .toFile(path.join(folder, name + "-mobile.webp"));
    }
    console.log(name);
  }
} finally {
  await browser.close();
}
