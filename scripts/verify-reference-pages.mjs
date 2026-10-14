// Capture exact CSS viewport screenshots via Chrome DevTools Protocol, locally.
import { spawn } from "node:child_process";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [htmlFile, outputDir] = process.argv.slice(2);
const navigationOnly = process.argv.includes("--navigation-only");
if (!htmlFile || !outputDir)
  throw new Error(
    "usage: node scripts/verify-reference-pages.mjs <preview-label> <output> [--navigation-only]",
  );
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = join(tmpdir(), `aio-reference-review-cdp-${process.pid}`);
const child = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--remote-debugging-port=0",
    `--user-data-dir=${profile}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true },
);
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
let port;
for (let attempt = 0; attempt < 100; attempt++) {
  try {
    port = Number(
      (await readFile(join(profile, "DevToolsActivePort"), "utf8")).split(
        "\n",
      )[0],
    );
    break;
  } catch {
    await pause(100);
  }
}
if (!port) throw new Error("Chrome remote debugging did not start");
const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = pages.find((entry) => entry.type === "page");
if (!page) throw new Error("No Chrome page");
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((done, fail) => {
  socket.onopen = done;
  socket.onerror = fail;
});
let nextId = 1;
const pending = new Map();
socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (!message.id || !pending.has(message.id)) return;
  const { done, fail } = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) fail(new Error(message.error.message));
  else done(message.result);
};
function send(method, params = {}) {
  const id = nextId++;
  return new Promise((done, fail) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      fail(new Error(`CDP timeout: ${method}`));
    }, 120000);
    pending.set(id, {
      done: (result) => {
        clearTimeout(timer);
        done(result);
      },
      fail: (error) => {
        clearTimeout(timer);
        fail(error);
      },
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const base = process.env.AIO_QA_BASE || "http://127.0.0.1:3215";
const output = resolve(outputDir);
await mkdir(output, { recursive: true });
const results = [];
const customerSlugs = [
  "bwl-store",
  "healernet-website",
  "bwl-brand-motion",
  "healernet-motion",
  "bwl-brand-webtoon",
  "yofree-outing-webtoon",
  "bwl-aqua-webtoon",
  "yofree-night-webtoon",
  "bwl-aqua-ad",
  "bwl-cplus-ad",
  "bwl-cleanser-ad",
  // R6: 브랜드 광고 30초 시안의 소속은 브랜드 홍보 영상(brand-film)
  "bwl-brand-ad",
  "bwl-editorial",
  "yofree-outing-motion",
  "yofree-night-motion",
  "yofree-mg-short",
  "yofree-mg30",
  "yofree-shop",
];
async function visit(path, width, selector, filename) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 500,
  });
  await send("Page.navigate", { url: base + path });
  let ready = false;
  for (let i = 0; i < 240; i++) {
    await pause(250);
    try {
      ready = await evaluate(
        `location.pathname===${JSON.stringify(path.split("?")[0])} && document.readyState==='complete' && !!document.querySelector(${JSON.stringify(selector)})`,
      );
      if (ready) break;
    } catch {}
  }
  if (!ready) throw new Error("page not ready " + path);
  await evaluate(
    `(async()=>{await document.fonts.ready;const el=document.querySelector(${JSON.stringify(selector)});el.scrollIntoView({behavior:'instant',block:'start'});document.querySelectorAll('img').forEach(x=>x.loading='eager');await Promise.all([...document.images].map(x=>x.decode().catch(()=>{})));return true})()`,
  );
  await pause(400);
  const metrics = await evaluate(
    `({path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(x=>!x.naturalWidth).map(x=>x.currentSrc),cards:[...document.querySelectorAll('.work-card')].map(x=>x.getAttribute('href')),robots:document.querySelector('meta[name="robots"]')?.content})`,
  );
  if (metrics.scrollWidth > width || metrics.broken.length || metrics.h1 !== 1)
    throw new Error(JSON.stringify(metrics));
  if (filename) {
    const shot = await send("Page.captureScreenshot", {
      format: "png",
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(join(output, filename), Buffer.from(shot.data, "base64"));
  }
  results.push(metrics);
}
async function navigation(path, width) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height: 900,
    deviceScaleFactor: 1,
    mobile: width < 500,
  });
  await send("Page.navigate", { url: base + path });
  let ready = false;
  for (let i = 0; i < 160; i++) {
    await pause(250);
    try {
      ready = await evaluate(
        `location.pathname===${JSON.stringify(path)} && document.readyState==='complete' && !!document.querySelector('.guide-subnav')`,
      );
      if (ready) break;
    } catch {}
  }
  if (!ready) throw new Error("navigation not ready " + path);
  await evaluate(
    "(async()=>{await document.fonts.ready;scrollTo(0,0);return true})()",
  );
  const row = await evaluate(`(() => {
  const nav=document.querySelector('.guide-subnav'), shell=nav.firstElementChild, brand=nav.querySelector('.guide-subbrand'), menu=nav.querySelector('.guide-sublinks'), cta=nav.querySelector('.guide-nav-cta');
  function measure(el) {
   const s=getComputedStyle(el), box=el.getBoundingClientRect(), range=document.createRange();
   const text=[...el.childNodes].find(n=>n.nodeType===Node.TEXT_NODE && n.textContent.trim());
   let textBox;
   if(text){range.selectNodeContents(text);const r=range.getBoundingClientRect();textBox={top:r.top,bottom:r.bottom,height:r.height};}
   let baseline=null;
   if(text){
    const wrapper=document.createElement('span'), marker=document.createElement('span');
    marker.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';
    text.replaceWith(wrapper);wrapper.append(text,marker);
    baseline=marker.getBoundingClientRect().bottom;
    wrapper.replaceWith(text);
   }
   return {text:el.textContent.trim(),fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,gap:s.gap,padding:s.padding,borderBottom:s.borderBottomWidth,top:box.top,bottom:box.bottom,height:box.height,baseline,textBox};
  }
  const links=[...menu.children].map(measure), icon=brand.querySelector('svg').getBoundingClientRect(), active=menu.querySelector('[aria-current]');
  return {path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,containerGap:getComputedStyle(shell).columnGap,menuGap:getComputedStyle(menu).gap,brand:measure(brand),links,cta:measure(cta),icon:{width:icon.width,height:icon.height},navHeight:nav.getBoundingClientRect().height,activeColor:active?getComputedStyle(active,'::after').backgroundColor:null,tabs:[...document.querySelectorAll('.guide-service-tabs a')].map(measure),anchors:document.querySelectorAll('.content-service-anchors').length,hrefs:[...document.querySelectorAll('a')].map(a=>a.getAttribute('href'))};
 })()`);
  if (
    row.scrollWidth > width ||
    row.anchors ||
    row.containerGap !== "24px" ||
    row.menuGap !== "24px"
  )
    throw new Error(JSON.stringify(row));
  if (
    row.brand.fontSize !== "15px" ||
    row.brand.fontWeight !== "600" ||
    !row.brand.fontFamily.includes(row.links[0].fontFamily.split(",")[0]) ||
    row.cta.height !== 36
  )
    throw new Error("brand/CTA typography " + JSON.stringify(row));
  for (const link of [...row.links, row.cta, ...row.tabs])
    if (link.fontSize !== "14px" || link.lineHeight !== "20px")
      throw new Error("link typography " + JSON.stringify(link));
  if (row.links.some((link) => link.borderBottom !== "0px"))
    throw new Error("link border shifts baseline");
  if (Math.abs(row.brand.baseline - row.cta.baseline) > 1)
    throw new Error("brand/CTA baseline mismatch");
  if (
    Math.max(...row.links.map((x) => x.baseline)) -
      Math.min(...row.links.map((x) => x.baseline)) >
    0.1
  )
    throw new Error("menu baseline mismatch");
  if (
    width > 720 &&
    row.links.some((link) => Math.abs(link.baseline - row.cta.baseline) > 1)
  )
    throw new Error("desktop baseline mismatch");
  if (
    row.hrefs.some(
      (h) =>
        h &&
        (h.split("?")[0] === "/work" || /^\/content\/work(?:\/|$)/.test(h)),
    )
  )
    throw new Error("retired link on " + path);
  if (path.startsWith("/content/") && row.hrefs.includes("/content/work"))
    throw new Error("content work tab remains");
  const shot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false,
    clip: { x: 0, y: 0, width, height: 280, scale: 1 },
  });
  await writeFile(
    join(output, `nav-${path.split("/")[1]}-${width}.png`),
    Buffer.from(shot.data, "base64"),
  );
  results.push(row);
  // Unload the current page before the next check to keep renderer memory low.
  await send("Page.navigate", { url: "about:blank" });
}
try {
  await send("Page.enable");
  await send("Runtime.enable");
  for (const division of ["content", "marketing", "lab"])
    for (const width of [1440, 900, 768, 390, 360])
      await navigation(
        "/" +
          division +
          "/services/" +
          (division === "content"
            ? "webtoon"
            : division === "marketing"
              ? "integrated"
              : "website"),
        width,
      );
  if (!navigationOnly) {
    for (const width of [1440, 768, 390, 360]) {
      await visit("/", width, "#work", `home-${width}.png`);
      if (!results.at(-1).cards.some((x) => x.startsWith("/work/bwl-")))
        throw new Error("home missing customer references");
      await visit(
        "/lab/services/shopping-mall",
        width,
        ".work-service-strip",
        `service-shop-${width}.png`,
      );
      await visit(
        "/work/yofree-outing-webtoon",
        width,
        ".work-detail-heading",
        `webtoon-${width}.png`,
      );
    }
    for (const path of [
      "/content",
      "/lab",
      "/marketing",
      "/content/services/brand-film",
      "/content/services/ad",
      "/content/services/webtoon",
      "/content/services/animation",
      "/content/services/ai-influencer",
      "/lab/services/website",
    ]) {
      await visit(
        path,
        390,
        path === "/content"
          ? "#services"
          : path.split("/").length === 2
          ? "#work"
          : path.startsWith("/content/")
            ? '[data-cs-section="hero"]'
            : ".work-service-strip",
        path.replaceAll("/", "-").slice(1) + ".png",
      );
    }
    await visit(
      "/marketing/work",
      1440,
      ".work-grid",
      "marketing-work-desktop.png",
    );
    await visit("/lab/work", 390, ".work-grid", "lab-work-mobile.png");
    for (const slug of customerSlugs) {
      await visit("/work/" + slug, 390, ".work-detail-heading", null);
      const videos = await evaluate(
        `(async()=>{const rows=[];for(const v of document.querySelectorAll('video')){v.muted=true;v.preload='auto';v.load();await new Promise((ok,fail)=>{if(v.readyState>=1)return ok();v.onloadedmetadata=ok;v.onerror=()=>fail(new Error('video error'));setTimeout(()=>fail(new Error('video timeout')),10000)});await v.play();await new Promise(ok=>setTimeout(ok,350));v.pause();rows.push({src:v.currentSrc,duration:v.duration,width:v.videoWidth,height:v.videoHeight,time:v.currentTime,poster:v.poster});}return rows})()`,
      );
      results.at(-1).videos = videos;
      if (videos.some((x) => !x.duration || !x.width || x.time <= 0))
        throw new Error("video playback failed " + slug);
    }
    await visit("/", 390, "#work", null);
    await evaluate(
      `[...document.querySelectorAll('.reference-filters button')].find(x=>x.textContent==='개발').click();true`,
    );
    await pause(350);
    const filtered = await evaluate(
      `[...document.querySelectorAll('#work .work-card')].map(x=>x.getAttribute('href'))`,
    );
    if (
      !filtered.includes("/work/bwl-store") ||
      filtered.some((x) => x.includes("webtoon"))
    )
      throw new Error("home filter failed");
    results.push({ homeDevelopmentFilter: filtered });
  }
  for (const path of [
    "/work",
    "/content/work",
    "/content/work/example-webtoon",
    "/content/work/yofree-outing-webtoon",
  ]) {
    const response = await fetch(base + path, { redirect: "manual" });
    if (response.status !== 404 || response.headers.has("location"))
      throw new Error("retired path " + path + " " + response.status);
    results.push({ path, status: response.status });
  }
  for (const path of ["/marketing/work", "/lab/work"]) {
    const response = await fetch(base + path);
    if (response.status !== 200)
      throw new Error("retained path " + path + " " + response.status);
    results.push({ path, status: response.status });
  }
  for (const slug of customerSlugs) {
    const response = await fetch(base + "/work/" + slug);
    const html = await response.text();
    if (
      response.status !== 200 ||
      !html.includes("noindex") ||
      !/class="work-back"[^>]*href="\/(?:content|lab|marketing)\/services\//.test(
        html,
      )
    )
      throw new Error("registered detail/back link " + slug);
    if (/href="\/work(?:[?#"]|$)|href="\/content\/work(?:[/?#"]|$)/.test(html))
      throw new Error("retired detail link " + slug);
    results.push({
      path: "/work/" + slug,
      status: response.status,
      reviewNoindex: true,
    });
  }
  await writeFile(
    join(output, "BROWSER_QA.json"),
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify({
      checks: results.length,
      videoPlayback: results.flatMap((x) => x.videos || []).length,
      result: "PASS",
    }),
  );
} finally {
  try {
    await send("Browser.close");
  } catch {}
  socket.close();
  child.kill();
}
