import test from "node:test";
import assert from "node:assert/strict";
import { displayCopy, withoutSentenceStops } from "../lib/display-copy.ts";

test("public prose removes full stops in Korean and English across line breaks", () => {
  assert.equal(withoutSentenceStops("함께 만드는 구성입니다.\nRead the story. 다음 장면입니다."), "함께 만드는 구성입니다\nRead the story 다음 장면입니다");
});
test("decimals, URLs, file paths and email remain exact", () => {
  const source = "17.5만 원 · 61.8초 · https://aio-make.com/content · /service-detail-v15/yofree-pose-02.mp4 · hello@aio-make.com";
  assert.equal(withoutSentenceStops(source), source);
});
test("public view formatting never mutates stored input or media identity", () => {
  const source = { title: "제작 시안입니다.", assets: [{ src: "/media/example.mp4", alt: "완성 이미지입니다." }], amount: 175000, revision: 2 };
  const view = displayCopy(source);
  assert.equal(view.title, "제작 시안입니다");
  assert.equal(view.assets[0].alt, "완성 이미지입니다");
  assert.equal(view.assets[0].src, source.assets[0].src);
  assert.equal(source.title, "제작 시안입니다.");
  assert.equal(source.assets[0].alt, "완성 이미지입니다.");
  assert.equal(view.amount, 175000);
  assert.equal(view.revision, 2);
});
