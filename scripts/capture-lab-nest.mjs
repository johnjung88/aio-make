import fs from 'node:fs/promises';
import {createRequire} from 'node:module';
import sharp from 'sharp';
const require=createRequire(import.meta.url),{chromium}=require('C:/AIO-PC2/50-scratch/codex/261025/01_browser-check/node_modules/playwright');
const file='C:/AIO-PC2/30-handoff/15_메인_리뉴얼/captures_RW3/nest-live.png';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try{const page=await browser.newPage({viewport:{width:1440,height:1100}});await page.goto('http://127.0.0.1:3118/lab');await page.locator('main canvas').waitFor();await page.waitForTimeout(500);await page.locator('[class*="homeScene"]').screenshot({path:file});await sharp(file).resize(1600,900,{fit:'contain',background:'#10131c'}).webp({quality:85}).toFile('public/lab-renewal/nest-preview.webp');const data=JSON.parse(await fs.readFile('public/lab-renewal/sources.json','utf8'));data.nestPreview={source:'live /lab Three.js scene',capture:file};await fs.writeFile('public/lab-renewal/sources.json',JSON.stringify(data,null,2));}finally{await browser.close()}
