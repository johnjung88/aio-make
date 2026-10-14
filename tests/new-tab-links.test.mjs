import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  NEW_TAB_HINT,
  contentLinkProps,
  isContentHref,
  newTabProps,
} from "../lib/new-tab.ts";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("content hrefs open in a new tab from the main site only", () => {
  assert.deepEqual(newTabProps, {
    target: "_blank",
    rel: "noopener noreferrer",
  });
  assert.equal(NEW_TAB_HINT, "새 탭에서 열림");
  for (const href of [
    "/content",
    "/content/",
    "/content/services/webtoon",
    "/content?x=1",
    "/content#services",
  ])
    assert.ok(isContentHref(href), href);
  for (const href of [
    "/",
    "/contents",
    "/marketing",
    "/lab",
    "#journey-content",
  ])
    assert.ok(!isContentHref(href), href);
  for (const page of ["/", "/about", "/marketing", "/lab/services/website"])
    assert.deepEqual(contentLinkProps("/content", page), newTabProps, page);
  assert.deepEqual(contentLinkProps("/content/services/ad", "/"), newTabProps);
  // Inside the content area, links stay in the same tab.
  assert.deepEqual(contentLinkProps("/content", "/content"), {});
  assert.deepEqual(
    contentLinkProps("/content/services/ad", "/content/services/webtoon"),
    {},
  );
  // Marketing and lab links are unchanged.
  assert.deepEqual(contentLinkProps("/marketing", "/"), {});
  assert.deepEqual(contentLinkProps("/lab", "/"), {});
});

test("header and footer 컨텐츠 links carry target=_blank, rel noopener and the hint", async () => {
  const shell = await read("components/site-shell.tsx");
  assert.ok(shell.includes('["컨텐츠", "/content"]'));
  const header = shell.slice(
    shell.indexOf("export function Header"),
    shell.indexOf("export function Footer"),
  );
  const footer = shell.slice(shell.indexOf("export function Footer"));
  for (const [name, part] of [
    ["header", header],
    ["footer", footer],
  ]) {
    assert.match(part, /contentLinkProps\(href, path\)/, name);
    assert.match(part, /\{\.\.\.newTab\}/, name);
    assert.match(part, /newTab\.target && <NewTabHint \/>/, name);
  }
});

test("main page content links open in a new tab; marketing and lab cards do not", async () => {
  const main = await read("components/guide/main.jsx");
  const card = (href) => {
    const start = main.indexOf(`href="${href}"`);
    assert.ok(start > 0, href);
    return main.slice(start, main.indexOf("</GuideLink>", start));
  };
  assert.match(card("/content"), /\{\.\.\.newTabProps\}/);
  assert.match(card("/content"), /<NewTabHint \/>/);
  for (const href of ["/marketing", "/lab"]) {
    assert.doesNotMatch(card(href), /newTabProps|NewTabHint|_blank/, href);
  }

  const content = await read("components/home/journey-content.tsx");
  const service = content.slice(
    content.indexOf("href={`/content/services/${tab.id}`}"),
  );
  const serviceLink = service.slice(0, service.indexOf("</Link>"));
  assert.match(serviceLink, /\{\.\.\.newTabProps\}/);
  assert.match(serviceLink, /<NewTabHint \/>/);

  // Step link "컨텐츠 서비스 전체 보기" (/content) goes through JourneyAnchor.
  const journey = await read("components/home/workflow-journey.tsx");
  const anchor = journey.slice(
    journey.indexOf("function JourneyAnchor"),
    journey.indexOf("function LinkRow"),
  );
  assert.match(anchor, /contentLinkProps\(href\)/);
  assert.match(anchor, /newTab\.target && <NewTabHint \/>/);

  const hint = await read("components/new-tab-hint.tsx");
  assert.match(hint, /className="new-tab-hint"/);
  const css = await read("components/new-tab-hint.css");
  assert.match(css, /\.new-tab-hint\s*\{[^}]*clip/);
});

test("workflow link arrows keep a gap and #divisions cards share one row layout", async () => {
  const css = await read("components/home/workflow-journey.css");
  const link = css.slice(css.indexOf(".guide-page .wj .wj-link {"));
  assert.match(link.slice(0, link.indexOf("}")), /gap: var\(--wj-s0\)/);
  assert.match(css, /--wj-s0: 4px;/);
  const main = await read("components/guide/main.jsx");
  const ux = await read("components/guide/ux.css");
  // Three cards, one class: number+name, one line, services (1fr), link.
  assert.equal(main.split('className="main-division"').length - 1, 3);
  assert.equal(main.split('className="main-division-body"').length - 1, 3);
  assert.match(
    ux,
    /\.main-division-body \{[^}]*grid-template-rows: auto auto 1fr auto;/,
  );
  assert.ok(!main.includes('gridTemplateRows: "auto auto auto auto 1fr auto"'));
  assert.ok(!main.includes('"auto 1fr auto auto auto auto"'));
});

test("unused workGroups and the old GuideMedia caption are gone", async () => {
  const main = await read("components/guide/main.jsx");
  const primitives = await read("components/guide/primitives.tsx");
  for (const source of [main, primitives]) {
    assert.ok(!source.includes("workGroups"));
    assert.ok(!source.includes("작업 사례.dc.html"));
  }
  assert.ok(!primitives.includes("실제 컨텐츠는 등록 후 공개"));
  assert.ok(!primitives.includes("guide-media-caption"));
});

test("HomeReferences gets server-selected works and imports no catalog values", async () => {
  const refs = await read("components/guide/home-references.tsx");
  assert.doesNotMatch(refs, /displayWorkCatalog|mergeGuideEntries/);
  assert.doesNotMatch(refs, /work-portfolio/);
  assert.match(refs, /import type \{ WorkItem \} from "@\/lib\/work-catalog"/);
  const card = await read("components/work-card.tsx");
  assert.match(card, /import type \{ WorkItem \} from "@\/lib\/work-catalog"/);
  assert.doesNotMatch(card, /import \{[^}]*\} from "@\/lib\/work-catalog"/);
  const data = await read("lib/home-references-data.ts");
  assert.match(data, /import "server-only"/);
  const overview = await read("components/guide/service-overview.tsx");
  assert.match(overview, /works=\{homeReferenceWorks\(entries, division\)\}/);

  // Same selection as before: the division's first four displayed works.
  const { homeReferenceWorks } = await import("../lib/home-references-data.ts");
  const { displayWorkCatalog } = await import("../lib/work-catalog.ts");
  const { mergeGuideEntries } = await import("../lib/guide-content.ts");
  for (const division of ["development", "marketing"]) {
    const expected = displayWorkCatalog(
      mergeGuideEntries([], "reference", division),
    )
      .filter((work) => work.division === division)
      .slice(0, 4)
      .map((work) => work.id);
    const works = homeReferenceWorks([], division);
    assert.deepEqual(
      works.map((work) => work.id),
      expected,
      division,
    );
  }
});
