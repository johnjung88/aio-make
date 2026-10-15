import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { contentHomeCards } from "../lib/content-home-cards.ts";
import { contentHomeServices, contentHomeProcess } from "../lib/content-home.ts";

const read = path => readFileSync(path, "utf8");
test("R8 home: approved descriptions, six directory links and image sources", () => {
  assert.deepEqual(contentHomeServices.map(s => s.line), [
    "제품 이야기를 컷으로 그려 전합니다", "표정과 동작으로 말하는 브랜드 캐릭터", "정한 인물이 매번 같은 얼굴로 나옵니다",
    "읽는 순서에 맞춰 움직이는 로고와 문구", "홈페이지에 올릴 회사 소개 한 편", "제품 하나를 세로 화면에 담는 광고",
  ]);
  assert.deepEqual(contentHomeCards.map(s => s.id), contentHomeServices.map(s => s.id));
  for (const card of contentHomeCards) {
    assert.equal(card.href, `/content/services/${card.id}`);
    assert.ok(existsSync(`public${card.image}`));
    assert.doesNotMatch(JSON.stringify(card), /요프리|YoFree|yofree-|힐러넷|BWL|DR's Secret|닥터시크릿|맥스테크/i);
  }
  assert.match(contentHomeProcess[3].text, /최종 편집 후/);
});
test("R8 home: directory directly precedes CONTACT and has one link per card", () => {
  const home = read("components/content-home/content-home.tsx");
  assert.match(home, /<ServiceCards\s*\/>\s*<section\s+className="ch-cta"/);
  const cards = read("components/content-home/service-cards.tsx");
  assert.match(cards, /<CsSectionHead/); assert.match(cards, /<h3/);
  assert.equal((cards.match(/<Link /g) || []).length, 1);
  assert.match(cards, /aria-label=\{`\$\{card.label\} 서비스 보기`\}/);
  assert.doesNotMatch(cards, /guide-main|상담하기/);
});
