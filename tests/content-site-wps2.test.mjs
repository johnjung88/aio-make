import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read=p=>readFileSync(p,"utf8");
test("R8 S2: player respects shared activity and holds user pause",()=>{
 const s=read("components/content-site/services/reel-player.tsx");
 for(const token of ["useInViewPlay","!held","!failed","node.pause()","useReelSound","setHeld(true)","onError"] )assert.ok(s.includes(token),token);
 assert.doesNotMatch(s,/autoPlay/);assert.match(s,/hero &&/);assert.match(s,/Boolean\(slot.src\)/);
});
test("R8 S2: cut board waits for metadata before seeking and keeps samples muted",()=>{
 const s=read("components/content-site/services/cut-board.tsx");
 for(const token of ["readyState >= 1","onLoadedMetadata","requested.current","currentTime","aria-pressed","onVolumeChange"])assert.ok(s.includes(token),token);
 assert.match(s,/sample.src \?/);assert.doesNotMatch(s,/autoPlay|소리 켜기/);
});
test("R8 S2: ad rail keeps only actual image/video cards and hides on narrow screens",()=>{
 const s=read("components/content-site/services/ad/ad-reel.tsx");assert.doesNotMatch(s,/kind: "type"|card.text/);
 const css=read("components/content-site/services/ad/ad.css");assert.match(css,/max-width:767px[^}]*cs-svc-ad-hero-rails\{display:none/s);
});
