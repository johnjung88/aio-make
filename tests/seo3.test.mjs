import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import path from "node:path";
import ts from "typescript";
import {
  kakaoChatUrl,
  contactDivision,
  KAKAO_CHANNEL_URL,
} from "../lib/contact-channels.ts";
import { track } from "../lib/tracking-events.ts";
import { seoDescriptions } from "../lib/seo-descriptions.ts";
import { developmentSchemaOffers } from "../lib/development-offers.ts";
import { marketingFaq } from "../lib/marketing-faq.ts";
import { faqSchema } from "../lib/seo.ts";

test("Kakao component renders no links when empty and secure chat links when configured", () => {
  const require = createRequire(import.meta.url);
  let source = readFileSync(
    new URL("../components/kakao-contact.tsx", import.meta.url),
    "utf8",
  )
    .replace(
      'import { usePathname } from "next/navigation";',
      'const usePathname = () => "/content/services/webtoon";',
    )
    .replace(
      'import styles from "./kakao-contact.module.css";',
      'const styles = { header:"header", footer:"footer", button:"button" };',
    );
  source = source
    .replaceAll(
      '"@/lib/contact-channels"',
      JSON.stringify(
        new URL("../lib/contact-channels.ts", import.meta.url).href,
      ),
    )
    .replaceAll(
      '"@/lib/tracking-events"',
      JSON.stringify(
        new URL("../lib/tracking-events.ts", import.meta.url).href,
      ),
    );
  let code = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  code = code.replaceAll(
    '"react/jsx-runtime"',
    JSON.stringify(
      pathToFileURL(
        path.join(
          path.dirname(require.resolve("react/package.json")),
          "jsx-runtime.js",
        ),
      ).href,
    ),
  );
  const component =
    "data:text/javascript;base64," + Buffer.from(code).toString("base64");
  const script = `import assert from 'node:assert/strict'; import { renderToStaticMarkup } from ${JSON.stringify(pathToFileURL(path.join(path.dirname(require.resolve("react-dom/package.json")), "server.node.js")).href)}; import { KakaoContact } from ${JSON.stringify(component)};
    assert.equal(renderToStaticMarkup(KakaoContact({channelUrl:""})), "");
    const html=renderToStaticMarkup(KakaoContact({channelUrl:"https://pf.kakao.com/_localtest/"}));
    assert.ok(html.includes('href="https://pf.kakao.com/_localtest/chat"')); assert.ok(html.includes('target="_blank"')); assert.ok(html.includes('rel="noopener"'));`;
  execFileSync(
    process.execPath,
    ["--experimental-strip-types", "--input-type=module", "-e", script],
    { stdio: "pipe" },
  );
  assert.equal(KAKAO_CHANNEL_URL, "");
  assert.equal(
    kakaoChatUrl("https://pf.kakao.com/_localtest/chat/"),
    "https://pf.kakao.com/_localtest/chat",
  );
});

test("Kakao click sends page and division to dataLayer and gtag", () => {
  const previous = globalThis.window,
    calls = [];
  globalThis.window = { dataLayer: [], gtag: (...args) => calls.push(args) };
  try {
    track("kakao_chat_click", {
      page: "/lab/services/website",
      division: contactDivision("/lab/services/website"),
    });
    assert.deepEqual(window.dataLayer, [
      {
        event: "kakao_chat_click",
        page: "/lab/services/website",
        division: "development",
      },
    ]);
    assert.deepEqual(calls, [
      [
        "event",
        "kakao_chat_click",
        { page: "/lab/services/website", division: "development" },
      ],
    ]);
    assert.equal(contactDivision("/about"), "main");
    assert.equal(contactDivision("/content"), "video");
  } finally {
    globalThis.window = previous;
  }
});

test("Audited descriptions meet the public length and punctuation contract", () => {
  assert.equal(Object.keys(seoDescriptions).length, 39);
  for (const [path, description] of Object.entries(seoDescriptions)) {
    assert.ok(
      description.length >= 70 && description.length <= 160,
      `${path}: ${description.length}`,
    );
    assert.doesNotMatch(description, /[\r\n]|[.。]$/);
    assert.doesNotMatch(description, /마케팅 가이드 마케팅/);
  }
});

test("FAQs serialize the same source and development offers preserve current prices without VAT assumptions", () => {
  for (const id of ["integrated", "sns", "ai-influencer", "seo"]) {
    const items = marketingFaq(id),
      schema = faqSchema(items);
    assert.deepEqual(
      schema.mainEntity.map((q) => [q.name, q.acceptedAnswer.text]),
      items,
    );
    assert.equal(new Set(items.map(([q]) => q)).size, items.length);
  }
  assert.deepEqual(
    developmentSchemaOffers("website").map(
      (o) => o.price ?? o.priceSpecification.minPrice,
    ),
    [100000, 200000, 300000, 30000],
  );
  assert.deepEqual(
    developmentSchemaOffers("shopping-mall").map((o) => o.price),
    [150000, 300000],
  );
  assert.equal(developmentSchemaOffers("automation"), undefined);
  assert.equal(developmentSchemaOffers("program"), undefined);
  assert.ok(
    !JSON.stringify(developmentSchemaOffers("website")).includes(
      "valueAddedTaxIncluded",
    ),
  );
});
