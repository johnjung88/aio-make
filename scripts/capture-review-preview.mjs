// Capture exact CSS viewport screenshots via Chrome DevTools Protocol, locally.
import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [htmlFile, outputDir] = process.argv.slice(2);
if (!htmlFile || !outputDir) throw new Error("usage: node scripts/capture-review-preview.mjs <preview.html> <output>");
const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const profile = join(tmpdir(), `aio-reference-review-cdp-${process.pid}`);
const child = spawn(chrome, ["--headless=new", "--disable-gpu", "--no-first-run", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore", windowsHide: true });
const pause = (ms) => new Promise((done) => setTimeout(done, ms));
let port;
for (let attempt = 0; attempt < 100; attempt++) {
  try { port = Number((await readFile(join(profile, "DevToolsActivePort"), "utf8")).split("\n")[0]); break; }
  catch { await pause(100); }
}
if (!port) throw new Error("Chrome remote debugging did not start");
const pages = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = pages.find((entry) => entry.type === "page");
if (!page) throw new Error("No Chrome page");
const socket = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((done, fail) => { socket.onopen = done; socket.onerror = fail; });
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
    const timer = setTimeout(() => { pending.delete(id); fail(new Error(`CDP timeout: ${method}`)); }, 10000);
    pending.set(id, { done: (result) => { clearTimeout(timer); done(result); }, fail: (error) => { clearTimeout(timer); fail(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const base = pathToFileURL(resolve(htmlFile)).href;
const cases = [
  { file: "목록_1440_v02.png", width: 1440, height: 900, query: "" },
  { file: "목록_390_v02.png", width: 390, height: 844, query: "" },
  { file: "작품_1440_v02.png", width: 1440, height: 900, query: "", scrollY: 540 },
  { file: "작품_390_v02.png", width: 390, height: 844, query: "", scrollY: 460 },
  { file: "상세_1440_v02.png", width: 1440, height: 900, query: "?work=yofree-outing-webtoon" },
  { file: "상세_390_v02.png", width: 390, height: 844, query: "?work=yofree-outing-webtoon" },
];
const results = [];
try {
  await send("Page.enable");
  await send("Runtime.enable");
  for (const item of cases) {
    console.log(`capturing ${item.file}`);
    await send("Emulation.setDeviceMetricsOverride", { width: item.width, height: item.height, deviceScaleFactor: 1, mobile: item.width < 500 });
    await send("Page.navigate", { url: base + item.query });
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      await pause(100);
      try {
        ready = await evaluate(`document.readyState === "complete" && location.search === ${JSON.stringify(item.query)} && !!document.querySelector(".work-index,.work-detail")`);
        if (ready) break;
      } catch { /* execution context replaced during navigation */ }
    }
    if (!ready) throw new Error(`Page did not become ready: ${item.file}`);
    await evaluate("(async()=>{await Promise.race([document.fonts.ready,new Promise(done=>setTimeout(done,3000))]);await Promise.race([Promise.all([...document.images].filter(image=>image.getBoundingClientRect().top<innerHeight+100).map(image=>image.decode().catch(()=>{}))),new Promise(done=>setTimeout(done,3000))]);return true})()");
    const metrics = await evaluate("({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,broken:[...document.images].filter(image=>image.complete&&!image.naturalWidth).length})");
    if (metrics.width !== item.width || metrics.scrollWidth > item.width || metrics.broken) throw new Error(`Viewport/media failure: ${item.file} ${JSON.stringify(metrics)}`);
    if (item.scrollY) { await evaluate(`window.scrollTo(0,${item.scrollY});true`); await pause(200); }
    const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
    await writeFile(join(resolve(outputDir), item.file), Buffer.from(screenshot.data, "base64"));
    results.push({ file: item.file, ...metrics });
  }
  console.log(JSON.stringify(results));
} finally {
  socket.close();
  child.kill();
}
