import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { webtoon, webtoonSignature } from "../lib/content-site/services/webtoon.ts";
import { animation, animationReferences } from "../lib/content-site/services/animation.ts";
import { getExampleMedia, getSlot } from "../lib/content-site/example-media.ts";
import { pricingPlans } from "../lib/content-pricing.ts";
const read = p => readFileSync(p,"utf8");
test("R8 A: webtoon bundles equal production plus motion comic, 12 reader cuts only",()=>{
 const [webtoon,motion,bundle]=pricingPlans("webtoon").groups;
 bundle.plans.forEach((p,i)=>assert.equal(p.amount,webtoon.plans[i].amount+motion.plans[i].amount));
 assert.equal(getExampleMedia("webtoon","cut").length,12);
 assert.equal(webtoonSignature.types.length,3);
 assert.match(read("components/content-site/services/webtoon/landing.tsx"),/href="#pricing"/);
});
test("R8 A: webtoon types, reader, craft, motion comic precede shared pricing",()=>{
 const s=read("components/content-site/services/webtoon/landing.tsx");const body=s.slice(s.indexOf("function Signature"));
 for(const term of ["webtoon-types","<Reader","webtoon-craft","<MotionComic"]) assert.ok(body.includes(term));
 assert.ok(body.indexOf("webtoon-types")<body.indexOf("<Reader"));assert.ok(body.indexOf("webtoon-craft")<body.indexOf("<MotionComic"));
 assert.equal(webtoon.process.steps.length,6);assert.equal(webtoon.faq.length,7);
});
test("R8 A: animation forms, character, storyboard, references with empty and expansion guards",()=>{
 const s=read("components/content-site/services/animation/landing.tsx");
 const order=["animation-forms","animation-character","animation-storyboard","animation-references"].map(x=>s.indexOf(x));
 assert.ok(order.every((n,i)=>n>=0&&(!i||n>order[i-1])));
 assert.match(s,/references.length > 0/);assert.match(s,/role="list"/);
 assert.equal(animationReferences.length,2);assert.equal(animation.process.steps.length,6);assert.equal(animation.faq.length,7);
 const ref=read("components/content-site/services/animation/references.tsx");assert.match(ref,/items.length > 6/);assert.match(ref,/aria-expanded/);
 assert.equal(getSlot("animation-hero-1").aspect,"16x9");
});
