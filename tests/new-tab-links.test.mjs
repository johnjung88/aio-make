import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  NEW_TAB_HINT,
  contentLinkProps,
  isContentHref,
  isLabHref,
  isMarketingHref,
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
  // Lab links open from other areas, while internal lab navigation stays put.
  assert.deepEqual(contentLinkProps("/marketing", "/"), newTabProps);
  for (const href of [
    "/marketing",
    "/marketing/",
    "/marketing/services/sns",
    "/marketing?x=1",
    "/marketing#finder",
  ]) {
    assert.ok(isMarketingHref(href));
    assert.deepEqual(contentLinkProps(href, "/about"), newTabProps);
    assert.deepEqual(contentLinkProps(href, "/marketing/services/seo"), {});
  }
  for (const href of [
    "/marketings",
    "https://example.com/marketing",
    "#marketing",
  ]) {
    assert.ok(!isMarketingHref(href));
    assert.deepEqual(contentLinkProps(href, "/"), {});
  }
  for (const href of [
    "/lab",
    "/lab/",
    "/lab?x=1",
    "/lab#experience",
    "/lab/services/website",
  ]) {
    assert.ok(isLabHref(href));
    assert.deepEqual(contentLinkProps(href, "/"), newTabProps);
    assert.deepEqual(contentLinkProps(href, "/lab/services/automation"), {});
  }
  for (const href of [
    "/labs",
    "/laboratory",
    "https://example.com/lab",
    "#lab",
  ]) {
    assert.ok(!isLabHref(href));
    assert.deepEqual(contentLinkProps(href, "/"), {});
  }
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

test("RW1 marketing entry opens a safe new tab and internal navigation stays put", async () => {
for(const href of ['/marketing','/marketing/','/marketing?x=1','/marketing#services','/marketing/services/integrated']) {
 assert.deepEqual(contentLinkProps(href,'/'),newTabProps);assert.deepEqual(contentLinkProps(href,'/about'),newTabProps);assert.deepEqual(contentLinkProps(href,'/marketing/services/sns'),{});
 }
 for(const href of ['/marketings','https://example.com/marketing','#marketing']) assert.deepEqual(contentLinkProps(href,'/'),{});
 const primitives=await read('components/guide/primitives.tsx');assert.match(primitives,/newTab.target && !props.target && <NewTabHint/);
});

test("RW1 result cards share one responsive grid in main and about", async () => {
const css=await read('components/home/main-about-renewal.css');
 const compact=css.replace(/\s+/g,'');
 assert.ok(compact.includes('grid-template-columns:repeat(3,minmax(0,1fr))'));
 assert.ok(compact.includes('.rw-divisions,.rw-site.rw-team-roles{grid-template-columns:minmax(0,1fr)'));
 assert.ok(compact.includes('.rw-card-body.cs-link{margin-top:auto'));
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
