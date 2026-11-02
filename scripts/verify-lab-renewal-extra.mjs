import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const require=createRequire(import.meta.url),{chromium}=require('C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright');
const output='C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_RW3',base='http://127.0.0.1:3118';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--disable-gpu']});
const result={checks:[],errors:[]};
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>result.errors.push(e.message));
 await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:original.call(this,type,...args)}});await page.goto(base+'/lab');await page.getByRole('button',{name:'2층',exact:true}).click();await page.waitForTimeout(500);assert.match(await page.locator('main').innerText(),/2층/);assert.ok(await page.locator('main svg').count()>0);
 await page.getByRole('button',{name:'3층',exact:true}).click();await page.waitForTimeout(100);assert.match(await page.locator('main').innerText(),/3층/);result.checks.push('WebGL disabled: working floor-plan fallback and floor controls');
 await page.goto(base+'/lab/services/website');await page.getByRole('button',{name:'사무소·전문직',exact:true}).focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('button',{name:'병원·클리닉',exact:true}).getAttribute('aria-pressed'),'true');result.checks.push('arrow keys change and focus signature selections');
 await page.goto(base+'/lab/services/program');await page.getByRole('button',{name:'담당자',exact:true}).click();assert.equal(await page.locator('#signature article').count(),5);await page.getByLabel('처리 기록',{exact:true}).first().uncheck();assert.equal(await page.locator('#signature article input').count(),0);await page.locator('#signature').screenshot({path:`${output}/program_mobile_permissions.png`});result.checks.push('mobile role feature list hides record inputs');
 await page.goto(base+'/lab');const buttons=await page.locator('main section').first().locator('a').evaluateAll(nodes=>nodes.map(n=>({height:n.clientHeight,whiteSpace:getComputedStyle(n).whiteSpace})));assert.ok(buttons.every(b=>b.height<60&&b.whiteSpace==='nowrap'));result.checks.push('mobile hero buttons stay on a single line');
 await page.close();
 // Final images are fully loaded before the final complete-page capture.
 const visual=await browser.newPage({viewport:{width:1440,height:1000}});
 const preload=async()=>{await visual.evaluate(async()=>{await document.fonts.ready;for(const image of document.images)image.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))});};
 for(const width of [1440,390]){await visual.setViewportSize({width,height:width===1440?1000:844});for(const [slug,route] of [['lab','/lab'],...['website','shopping-mall','automation','program'].map(x=>[x,`/lab/services/${x}`])]){await visual.goto(base+route);await preload();await visual.screenshot({path:`${output}/${slug}_${width}_full.png`,fullPage:true});if(slug==='program')await visual.locator('#deliverables').screenshot({path:`${output}/program_${width}_deliverables.png`});}}
 for(const width of [1440,390])for(const slug of ['lab','website','shopping-mall','automation','program']){const reference=slug==='lab'?'content':'content-detail';const a=await sharp(`${output}/${reference}_${width}_full.png`).resize({width:440}).png().toBuffer(),b=await sharp(`${output}/${slug}_${width}_full.png`).resize({width:440}).png().toBuffer();const am=await sharp(a).metadata(),bm=await sharp(b).metadata();await sharp({create:{width:880,height:Math.max(am.height,bm.height),channels:3,background:'#07080c'}}).composite([{input:a,left:0,top:0},{input:b,left:440,top:0}]).png().toFile(`${output}/compare_full_${slug}_${width}.png`);}
 result.checks.push('10 final complete-page and 10 side-by-side full-page captures');
}catch(e){result.failure=e.stack;process.exitCode=1;console.error(e)}finally{await browser.close();await fs.writeFile(`${output}/verification-extra.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2))}
