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
    const timer = setTimeout(() => { pending.delete(id); fail(new Error(`CDP timeout: ${method}`)); }, 120000);
    pending.set(id, { done: (result) => { clearTimeout(timer); done(result); }, fail: (error) => { clearTimeout(timer); fail(error); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result.value;
}
const base = process.env.AIO_QA_BASE || "http://127.0.0.1:3212";
const output = resolve(outputDir);
const results = [];
const customerSlugs = ["bwl-store","healernet-website","bwl-brand-motion","healernet-motion","bwl-brand-webtoon","yofree-outing-webtoon","bwl-aqua-webtoon","yofree-night-webtoon","bwl-brand-ad","bwl-aqua-ad","bwl-cplus-ad","bwl-cleanser-ad","bwl-editorial","yofree-outing-motion","yofree-night-motion","yofree-mg-short","yofree-mg30","yofree-shop"];
async function visit(path,width,selector,filename) {
 await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:width<500});
 await send("Page.navigate",{url:base+path});
 let ready=false;
 for(let i=0;i<240;i++) {
  await pause(250);
  try { ready=await evaluate(`location.pathname===${JSON.stringify(path.split('?')[0])} && document.readyState==='complete' && !!document.querySelector(${JSON.stringify(selector)})`); if(ready)break; }catch{}
 }
 if(!ready)throw new Error('page not ready '+path);
 await evaluate(`(async()=>{await document.fonts.ready;const el=document.querySelector(${JSON.stringify(selector)});el.scrollIntoView({behavior:'instant',block:'start'});document.querySelectorAll('img').forEach(x=>x.loading='eager');await Promise.all([...document.images].map(x=>x.decode().catch(()=>{})));return true})()`);
 await pause(400);
 const metrics=await evaluate(`({path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(x=>!x.naturalWidth).map(x=>x.currentSrc),cards:[...document.querySelectorAll('.work-card')].map(x=>x.getAttribute('href')),robots:document.querySelector('meta[name="robots"]')?.content})`);
 if(metrics.scrollWidth>width || metrics.broken.length || metrics.h1!==1)throw new Error(JSON.stringify(metrics));
 if(filename) {const shot=await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});await writeFile(join(output,filename),Buffer.from(shot.data,'base64'));}
 results.push(metrics);
}
try {
 await send('Page.enable'); await send('Runtime.enable');
 for(const width of [1440,768,390,360]) {
  await visit('/',width,'#work',`home-${width}.png`);
  if(!results.at(-1).cards.some(x=>x.startsWith('/work/bwl-')))throw new Error('home missing customer references');
  await visit('/lab/services/shopping-mall',width,'.work-service-strip',`service-shop-${width}.png`);
  await visit('/work/yofree-outing-webtoon',width,'.work-detail-heading',`webtoon-${width}.png`);
 }
 for(const path of ['/content','/lab','/marketing','/content/services/brand-film','/content/services/ad','/content/services/webtoon','/content/services/animation','/content/services/ai-influencer','/lab/services/website']) {
  await visit(path,390,path.split('/').length===2?'#work':'.work-service-strip',path.replaceAll('/','-').slice(1)+'.png');
 }
 await visit('/work',1440,'.work-grid','work-desktop.png');
 await visit('/work?page=2',390,'.work-grid','work-mobile-page2.png');
 for(const slug of customerSlugs) {
  await visit('/work/'+slug,390,'.work-detail-heading',null);
  const videos=await evaluate(`(async()=>{const rows=[];for(const v of document.querySelectorAll('video')){v.muted=true;v.preload='auto';v.load();await new Promise((ok,fail)=>{if(v.readyState>=1)return ok();v.onloadedmetadata=ok;v.onerror=()=>fail(new Error('video error'));setTimeout(()=>fail(new Error('video timeout')),10000)});await v.play();await new Promise(ok=>setTimeout(ok,350));v.pause();rows.push({src:v.currentSrc,duration:v.duration,width:v.videoWidth,height:v.videoHeight,time:v.currentTime,poster:v.poster});}return rows})()`);
  results.at(-1).videos=videos;
  if(videos.some(x=>!x.duration||!x.width||x.time<=0))throw new Error('video playback failed '+slug);
 }
 await visit('/',390,'#work',null);
 await evaluate(`[...document.querySelectorAll('.reference-filters button')].find(x=>x.textContent==='개발').click();true`);await pause(350);
 const filtered=await evaluate(`[...document.querySelectorAll('#work .work-card')].map(x=>x.getAttribute('href'))`);
 if(!filtered.includes('/work/bwl-store')||filtered.some(x=>x.includes('webtoon')))throw new Error('home filter failed');
 results.push({homeDevelopmentFilter:filtered});
 await writeFile(join(output,'BROWSER_QA.json'),JSON.stringify(results,null,2));
 console.log(JSON.stringify({checks:results.length,videoPlayback:results.flatMap(x=>x.videos||[]).length,result:'PASS'}));
} finally {socket.close();child.kill();}
