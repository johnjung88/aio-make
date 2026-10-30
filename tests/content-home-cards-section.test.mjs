import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { contentHomeCards } from "../lib/content-home-cards.ts";
import { contentHomeServices, contentHomeProcess, homeCardMedia } from "../lib/content-home.ts";

const read = path => readFileSync(path, "utf8");
test("v10 home: approved v07 copy, six directory links and actual image sources", () => {
  assert.deepEqual(contentHomeServices.map(s => s.line), [
    "이야기를 컷으로 완성합니다", "캐릭터의 표정과 동작을 설계합니다", "브랜드에 맞는 가상인물의 기준을 만듭니다",
    "제품과 문구를 움직임으로 전합니다", "회사와 브랜드의 이야기를 담습니다", "제품의 핵심을 짧고 선명하게 전합니다",
  ]);
  assert.deepEqual(contentHomeCards.map(s => s.id), contentHomeServices.map(s => s.id));
  for (const card of contentHomeCards) {
    assert.equal(card.href, `/content/services/${card.id}`);
    assert.ok(existsSync(`public${card.image}`));
    assert.equal(card.image, homeCardMedia[card.id].poster, `${card.id} uses the same actual work as the showcase`);
    assert.ok(card.alt && card.line && card.details, `${card.id} has text alternatives and a useful service description`);
  }
  assert.match(contentHomeProcess[3].text, /최종 검수 후.*합의한 형식/);
});
test("v10 home: approved section order with FAQ before CONTACT", () => {
  const home = read("components/content-home/content-home.tsx");
  assert.match(home, /<ServiceCards\s*\/>\s*<DivisionFaq division="content"\s*\/>\s*<section\s+className="ch-cta"/);
  const sectionOrder = ['data-cs-section="hero"', '<ServiceShowcase', 'data-cs-section="process"', '<ServiceCards', 'data-cs-section="cta"'];
  for (let index = 1; index < sectionOrder.length; index++)
    assert.ok(home.indexOf(sectionOrder[index - 1]) < home.indexOf(sectionOrder[index]), sectionOrder[index]);
  const cards = read("components/content-home/service-cards.tsx");
  assert.match(cards, /<CsSectionHead/); assert.match(cards, /<h3/);
  assert.equal((cards.match(/<Link /g) || []).length, 1);
  assert.match(cards, /aria-label=\{`\$\{card.label\} 서비스 보기`\}/);
  assert.match(cards, /align="center"/);
  assert.match(cards, /HomeArtwork/);
  const css = read("components/content-home/content-home.css").replace(/\s+/g, "");
  assert.match(css, /\.ch-service-cards\{display:grid;grid-template-columns:minmax\(0,1fr\)/);
  assert.match(css, /@media\(min-width:768px\)\{\.cs-site\.cs-home\.ch-service-cards\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css, /@media\(min-width:1024px\)\{\.cs-site\.cs-home\.ch-service-cards\{grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(cards, /guide-main|상담하기/);
});
