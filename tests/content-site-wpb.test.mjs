import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { creatorRoster } from "../lib/content-site/creator-roster.ts";
import { aiInfluencer } from "../lib/content-site/services/ai-influencer.ts";
import { motionGraphics } from "../lib/content-site/services/motion-graphics.ts";
import { r8Details } from "../lib/content-site/r8-details.ts";
const read=p=>readFileSync(p,"utf8");
test("R8 B: confirmed creator portraits exist, dynamic deck has no account feed",()=>{
 assert.ok(creatorRoster.length>0);for(const c of creatorRoster)assert.ok(existsSync(`public${c.portrait}`));
 const s=read("components/content-site/services/ai-influencer/creator-experience.tsx");
 assert.match(s,/creatorRoster.length/);assert.match(s,/COUNT < 3/);assert.match(s,/COUNT >= 3/);
 assert.doesNotMatch(s,/CreatorRoster|creator.account|네 개|네 계정|4계정|role="tab"/);
 assert.match(s,/creator.category/);assert.match(s,/creator.line/);
});
test("R8 B: AI dedicated character production, sheet and proposal labels",()=>{
 const s=read("components/content-site/services/ai-influencer/landing.tsx");
 const terms=["ai-package",'id="sheet"',"ai-products","ai-creators","ai-disclosure"].map(t=>s.indexOf(t));
 assert.ok(terms.every((n,i)=>n>=0&&(!i||n>terms[i-1])));
 assert.match(s,/계정 게시·운영/);assert.match(s,/제안용 시안이며 게시용이 아닙니다/);
 assert.equal(aiInfluencer.process.steps.length,6);assert.equal(aiInfluencer.faq.length,7);
 assert.match(aiInfluencer.process.steps[5].body,/따로 견적/);
});
test("R8 B: motion grammar, cut planning and factual character process",()=>{
 const s=read("components/content-site/services/motion-graphics/landing.tsx");
 assert.doesNotMatch(s,/SceneSequence|WorkSequence/);assert.match(s,/CutBoard/);assert.match(s,/CharacterCase/);
 assert.equal(r8Details["motion-graphics"]["MOTION GRAMMAR"].length,4);
 assert.doesNotMatch(JSON.stringify(motionGraphics.signature),/말투|성격/);
 assert.equal(motionGraphics.process.steps.length,6);assert.equal(motionGraphics.faq.length,7);
});
test("R8 B: asset manifest hashes preserve original evidence",()=>{
 const manifest=JSON.parse(read("public/content-examples/MANIFEST.json"));
 for(const f of manifest.files){assert.equal(createHash("sha256").update(readFileSync(f.path)).digest("hex"),f.sha256,f.path);}
});
