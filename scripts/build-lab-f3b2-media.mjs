// W-F3b2: designed example screens rendered from local HTML and existing photos.
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const {
  chromium,
} = require("C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright");
const out = "public/lab-renewal";
const photo = async (f) =>
  "data:image/webp;base64," + (await fs.readFile(f)).toString("base64");
const photos = await Promise.all(
  [
    "public/renewal/shop-products.webp",
    `${out}/shop-0-0.webp`,
    "public/lab-samples/forme-editorial.png",
  ].map(photo),
);
const font = pathToFileURL(
  path.resolve("public/fonts/PretendardVariable.woff2"),
).href;
const css = `@font-face{font-family:p;src:url('${font}')}*{box-sizing:border-box}body{margin:0;font-family:p,sans-serif;color:#292636;background:#f4f2f7}main{height:100vh;overflow:hidden;display:flex;flex-direction:column}header{height:94px;flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 48px;border-bottom:1px solid #dcd8e5;background:#fff}header b{letter-spacing:.12em;font-size:27px}header span{font-size:20px;color:#6b6379}h1,h2,p{margin:0}h1{font-size:44px;letter-spacing:-.04em;line-height:1.25}h2{font-size:27px}small{font-size:17px;color:#776e88}.tag{display:inline-block;padding:9px 16px;border-radius:24px;background:#ede7ff;color:#6746bd;font-size:18px}.layout{display:grid;grid-template-columns:228px 1fr;flex:1;min-height:0}aside{background:#24202f;color:#bbb3cf;padding:38px 25px;display:grid;align-content:start;gap:14px;font-size:20px}aside b{color:#f5f1ff;margin-bottom:34px;font-size:22px}aside span{padding:16px;border-radius:10px}aside .active{background:#6b4dff;color:#fff}.work{padding:40px;display:flex;flex-direction:column;gap:28px;min-width:0}.title{display:flex;align-items:center;justify-content:space-between;gap:20px}.sub{color:#776e88;font-size:20px;margin-top:10px}.tabs{display:flex;gap:26px;font-size:20px;border-bottom:1px solid #dcd8e5;padding-bottom:18px}.tabs b{color:#6b4dff}.panel{display:flex;flex-direction:column;background:white;border:1px solid #ded9e8;border-radius:16px;padding:28px;flex:1;min-height:0;overflow:hidden}.row{flex:1;display:grid;grid-template-columns:1.7fr 1fr 1fr;align-items:center;gap:20px;min-height:0;border-bottom:1px solid #e9e5ee;font-size:22px}.row.head{flex:0 0 56px;color:#82788f;font-size:18px;min-height:56px}.row strong{font-weight:600}.row span:last-child{color:#83798e;font-size:19px}.row .pill{color:#6848ad;font-size:18px;background:#f0ebfa;padding:7px 14px;border-radius:30px;justify-self:start}.progress{display:flex;gap:18px}.progress div{flex:1;border-radius:14px;background:#e8e1f8;padding:22px;font-size:21px;border:1px solid #d8cdf0}.progress b{display:block;margin-top:10px}.foot{font-size:17px;color:#8c809b;margin-top:auto}.timeline{display:flex;flex-direction:column;justify-content:space-between;flex:1;gap:24px;margin-top:30px}.event{border-left:3px solid #b9aeff;padding:3px 0 3px 24px}.event b{display:block;font-size:23px;margin-bottom:9px}.event p{font-size:20px;color:#80758e}.guide{display:grid;grid-template-columns:1fr 1fr;gap:24px;height:100%}.guide div{padding:26px;border:1px solid #e4deec;border-radius:12px;background:#fbf9ff;display:grid;gap:18px;align-content:center}.guide em{font-size:20px;font-style:normal;color:#8d78b8}.guide p{font-size:20px;color:#776c88;line-height:1.6}.permission{height:100%;display:flex;flex-direction:column}.permission .row{grid-template-columns:1.5fr repeat(3,1fr)}.yes{color:#6b4dff!important}.no{color:#a9a2b2!important}.shop{background:#f6f2eb}.shop header{background:#f9f6f0;color:#35302d}.shop header b{font-family:Georgia,serif;font-size:38px}.store{display:grid;grid-template-columns:1.05fr 1fr;flex:1;min-height:0}.store>img{width:100%;height:100%;object-fit:cover}.editorial{padding:64px;display:flex;flex-direction:column;justify-content:center;gap:28px}.editorial h1{font-size:65px;line-height:1.15;font-weight:500}.editorial p{font-size:23px;color:#786b62;line-height:1.7}.editorial .label{font-size:17px;letter-spacing:.2em;color:#8b7766}.cta{padding:19px 28px;background:#6b4dff;color:white;align-self:start;font-size:20px;border-radius:4px}.brandmark{font-family:Georgia,serif;font-size:112px;font-weight:400}.brandlogo{background:#eee6dc;display:grid;grid-template-columns:1.5fr 1fr;flex:1}.brandlogo>div{padding:65px;display:flex;flex-direction:column;justify-content:center;gap:32px}.brandlogo .monogram{background:#37322e;color:#f5efe4;align-items:center;font-family:Georgia,serif;font-size:200px}.brandlogo p{font-size:24px;line-height:1.7}.productInfo{display:flex;justify-content:space-between;border-bottom:1px solid #d5c9bd;padding:18px 0;font-size:20px}.mobile .layout{grid-template-columns:1fr}.mobile aside{display:none}.mobile header{padding:0 32px}.mobile header span{font-size:16px}.mobile .work{padding:30px;gap:24px}.mobile h1{font-size:40px}.mobile .panel{padding:24px}.mobile .row{font-size:21px;min-height:100px}.mobile .progress div{font-size:18px;padding:18px}.mobile .store{grid-template-columns:1fr;grid-template-rows:52% 48%}.mobile .editorial{padding:32px;gap:18px}.mobile .editorial h1{font-size:44px}.mobile .editorial p{font-size:20px}.mobile .foot{margin-top:15px}`;
const aside =
  '<aside><b>◈ &nbsp; ORBIT</b><span class="active">업무 공간</span><span>나의 요청</span><span>처리 내역</span><span>권한 설정</span><span>운영 안내</span></aside>';
const names = [
  "시설 점검 요청",
  "자료 확인 요청",
  "비품 교체 요청",
  "계정 변경 요청",
  "운영 자료 전달",
];
const rows = (auto = false) =>
  names
    .map(
      (n, i) =>
        `<div class="row"><strong>${auto ? "주문 " + (1021 + i) : n}</strong><span class="pill">${auto ? (i === 1 ? "확인 필요" : "일치") : ["접수", "진행 중", "확인 대기", "진행 중", "완료"][i]}</span><span>${auto ? ["형식 일치", "수량 누락", "형식 보정", "형식 일치", "중복 제외"][i] : "가상 " + (i % 2 ? "민서" : "하람")}</span></div>`,
    )
    .join("");
function body(service, v) {
  if (service === "shopping-mall") {
    const nav =
      "<header><b>mogrèbit</b><span>COLLECTION &nbsp; / &nbsp; OUR STORY</span></header>";
    if (v === "logo")
      return (
        nav +
        '<div class="brandlogo"><div><small>BRAND IDENTITY / 01</small><strong class="brandmark">mogrèbit</strong><p>일상에 남는 취향을 모아<br>가볍고 단정한 워드마크</p><small>가로 로고 · 브랜드 적용 예시</small></div><div class="monogram">m<small>SYMBOL / FAVICON</small></div></div>'
      );
    const idx = v === "banner" ? 1 : v === "check" ? 2 : 0;
    return (
      nav +
      `<div class="store"><img src="${photos[idx]}" alt=""><div class="editorial"><span class="label">${v === "check" ? "PRODUCT / DETAIL" : "THE EVERYDAY EDIT"}</span><h1>${v === "check" ? "차분하게 걸치는<br>하루의 실루엣" : v === "banner" ? "차분한 계절의<br>새로운 균형" : "작은 취향으로<br>채우는 일상"}</h1><p>${v === "check" ? "차콜 울 코트<br>단정한 형태와 여유로운 실루엣" : "작은 디테일부터 편안한 실루엣까지<br>매일 곁에 두는 컬렉션"}</p>${v === "check" ? '<div class="productInfo">COLOR<span>Charcoal</span></div><div class="productInfo">SIZE<span>Free</span></div>' : ""}<span class="cta">${v === "check" ? "상품 구성 살펴보기" : "컬렉션 둘러보기"} ↗</span><small>가상 브랜드 · 제작 방향 예시</small></div></div>`
    );
  }
  const auto = service === "automation";
  const title = auto
    ? {
        hero: "주문 자료에서 확인까지",
        result: "주문 대조 결과",
        error: "확인이 필요한 내역",
        guide: "실행과 재처리 안내",
      }[v]
    : {
        hero: "팀의 요청을 한곳에서",
        detail: "시설 점검 요청",
        permission: "역할에 맞는 접근 권한",
        mobile: "나에게 배정된 요청",
      }[v];
  const intro = auto ? "FLOW / ORDER RECONCILIATION" : "ORBIT / TEAM WORKSPACE";
  let panel = "";
  if (v === "guide")
    panel =
      '<div class="guide">' +
      [
        ["입력 확인", "파일 형식과 필수 항목을 확인합니다"],
        ["규칙 선택", "주문번호 형식과 중복 기준을 정합니다"],
        ["결과 확인", "일치 자료와 보류 내역을 따로 확인합니다"],
        ["수정 후 재실행", "보류 이유를 고친 뒤 다시 처리합니다"],
      ]
        .map(
          ([t, p], i) =>
            `<div><em>0${i + 1}</em><h2>${t}</h2><p>${p}</p></div>`,
        )
        .join("") +
      "</div>";
  else if (v === "detail")
    panel =
      '<h2>처리 내역</h2><div class="timeline">' +
      [
        ["요청 접수", "가상 민서 · 시설 점검을 요청했습니다"],
        ["담당 배정", "가상 하람 · 확인할 항목을 정리했습니다"],
        ["진행 중", "점검 자료와 처리 내용을 확인합니다"],
        ["다음 확인", "담당자 확인 후 완료로 변경합니다"],
      ]
        .map(([t, p]) => `<div class="event"><b>${t}</b><p>${p}</p></div>`)
        .join("") +
      "</div>";
  else if (v === "permission")
    panel =
      '<div class="permission"><div class="row head"><b>기능</b><span>요청자</span><span>담당자</span><span>관리자</span></div>' +
      ["요청 등록", "담당 업무 조회", "상태 변경", "담당 배정", "변경 내역"]
        .map(
          (n, i) =>
            `<div class="row"><strong>${n}</strong><span class="${i < 2 ? "yes" : "no"}">${i < 2 ? "허용" : "제한"}</span><span class="${i < 3 ? "yes" : "no"}">${i < 3 ? "허용" : "제한"}</span><span class="yes">허용</span></div>`,
        )
        .join("") +
      "</div>";
  else if (v === "error")
    panel =
      '<div class="row head"><b>확인 항목</b><span>보류 이유</span><span>다음 처리</span></div>' +
      [
        ["#1023", "형식 다름", "형식 맞추기"],
        ["1025", "수량 누락", "원본 확인"],
        ["1030", "중복 자료", "중복 제외"],
        ["1032", "필수 값 없음", "내용 보완"],
      ]
        .map(
          (r) =>
            `<div class="row"><strong>${r[0]}</strong><span class="pill">${r[1]}</span><span>${r[2]}</span></div>`,
        )
        .join("");
  else
    panel =
      '<div class="row head"><b>' +
      (auto ? "자료" : "요청 내용") +
      "</b><span>상태</span><span>담당 · 확인</span></div>" +
      rows(auto);
  return `<header><b>${auto ? "◈ FLOW" : "◈ ORBIT"}</b><span>가상 데이터 · 제작 방향 예시</span></header><div class="layout">${aside}<div class="work"><div><small>${intro}</small><div class="title"><h1>${title}</h1><span class="tag">${v === "mobile" ? "담당자" : "예시 화면"}</span></div><p class="sub">${auto ? "반복 자료는 정리하고 확인할 내역은 남깁니다" : "요청부터 배정과 변경 내역까지 이어지는 업무 공간"}</p></div>${auto && v === "hero" ? '<div class="progress"><div>01 INPUT<b>주문 자료</b></div><div>02 RULE<b>형식 · 수량 대조</b></div><div>03 OUTPUT<b>결과와 보류 내역</b></div></div>' : '<div class="tabs"><b>전체 보기</b><span>진행 중</span><span>확인 필요</span></div>'}<div class="panel">${panel}</div><p class="foot">${auto ? "입력 → 대조 → 결과 확인" : "요청 등록 → 담당 배정 → 처리 내역"} &nbsp; / &nbsp; 실제 운영 자료가 아닌 가상 예시</p></div></div>`;
}
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage();
  for (const [service, variants] of [
    ["shopping-mall", ["hero", "logo", "banner", "check"]],
    ["automation", ["hero", "result", "error", "guide"]],
    ["program", ["hero", "detail", "permission", "mobile"]],
  ]) {
    for (const v of variants) {
      for (const mobile of v === "hero" ? [false, true] : [false]) {
        const width = mobile ? 1000 : 1600,
          height = mobile ? 1250 : v === "hero" ? 1000 : 1200;
        await page.setViewportSize({ width, height });
        await page.setContent(
          `<style>${css}</style><body class="${mobile || v === "mobile" ? "mobile" : ""}"><main class="${service === "shopping-mall" ? "shop" : ""}">${body(service, v)}</main></body>`,
        );
        await page.evaluate(() => document.fonts.ready);
        await page
          .locator("img")
          .evaluateAll((imgs) => Promise.all(imgs.map((i) => i.decode())));
        await sharp(await page.screenshot())
          .webp({ quality: 86 })
          .toFile(`${out}/${service}-${v}${mobile ? "-mobile" : ""}.webp`);
      }
    }
    // Card-specific composition, no duplicated screenshot file in the page.
    await page.setViewportSize({ width: 1600, height: 1000 });
    await page.setContent(
      `<style>${css}</style><main class="${service === "shopping-mall" ? "shop" : ""}">${body(service, service === "shopping-mall" ? "check" : service === "automation" ? "error" : "permission")}</main>`,
    );
    await page.evaluate(() => document.fonts.ready);
    await page
      .locator("img")
      .evaluateAll((imgs) => Promise.all(imgs.map((i) => i.decode())));
    await sharp(await page.screenshot())
      .webp({ quality: 86 })
      .toFile(`${out}/card-${service}.webp`);
  }
} finally {
  await browser.close();
}
const nest = sharp(`${out}/nest-preview.webp`);
const meta = await nest.metadata();
await nest
  .extract({
    left: 0,
    top: 172,
    width: meta.width,
    height: 556,
  })
  .webp({ quality: 88 })
  .toFile(`${out}/nest-close.webp`);
await fs.writeFile(
  `${out}/sources-f3b2.json`,
  JSON.stringify(
    {
      method: "Local HTML example screens; existing photos; no new AI images",
      script: "scripts/build-lab-f3b2-media.mjs",
      home: {
        source: "local sample yeobakgyeol / pc-home capture",
        kind: "Existing local sample site execution capture; not a customer project or production validation",
      },
      photos: [
        "public/renewal/shop-products.webp",
        "public/lab-renewal/shop-0-0.webp",
        "public/lab-samples/forme-editorial.png",
      ],
      nest: "nest-preview.webp cropped to remove empty top and bottom bands",
    },
    null,
    2,
  ),
);
console.log("F3b2 screens rendered");
