import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeDomain,
  processLeads,
  DEFAULT_LEADS,
  DEFAULT_MASTER,
  DEFAULT_RULES,
  addProspect,
  parseLeadCsv,
  leadsToCsv,
  csvCell,
  addCartLine,
  cartAmounts,
} from "../lib/lab-case-engine.ts";

test("master matching handles protocol, www, path, case and ports", () => {
  assert.equal(
    normalizeDomain(" HTTPS://WWW.BLOOM-STUDIO.EXAMPLE:443/a?x=1 "),
    "bloom-studio.example",
  );
  assert.equal(normalizeDomain("javascript:alert(1)"), "");
  assert.equal(normalizeDomain("not a domain"), "");
});
test("duplicates in both master and the same RAW never receive outreach drafts", () => {
  const result = processLeads(
    DEFAULT_LEADS,
    DEFAULT_MASTER,
    DEFAULT_RULES,
    "가이드",
  );
  assert.equal(result.filter((r) => r.status === "duplicate").length, 2);
  assert.equal(result[2].customerId, "DEMO-001");
  assert.equal(result[6].customerId, result[0].customerId);
  assert.equal(result[6].draft, "");
  assert.equal(result.filter((r) => r.status === "qualified").length, 3);
});
test("changing budget, service and contact changes both selection and explanations", () => {
  const result = processLeads(
    DEFAULT_LEADS,
    DEFAULT_MASTER,
    { minBudget: 800, minScore: 90, service: "쇼핑몰" },
    "새 가이드",
  );
  assert.deepEqual(
    result.filter((r) => r.status === "qualified").map((r) => r.company),
    ["온도 뷰티"],
  );
  assert.match(result[0].reasons.join(" "), /기준 800만원보다 낮/);
  assert.match(result[1].draft, /새 가이드/);
  assert.equal(result[5].draft, "");
});
test("prospect transitions are idempotent and preserve customer identity", () => {
  const lead = processLeads(
    DEFAULT_LEADS,
    DEFAULT_MASTER,
    DEFAULT_RULES,
    "가이드",
  )[0];
  const master = addProspect(DEFAULT_MASTER, lead);
  assert.equal(master.length, 3);
  assert.equal(master[2].customerId, lead.customerId);
  assert.equal(addProspect(master, lead).length, 3);
  assert.equal(addProspect(master, lead)[2].status, "잠재고객");
});
test("CSV preserves quoted commas and rejects invalid records without truncating", () => {
  const rows = [{ ...DEFAULT_LEADS[0], company: '샘플, "스튜디오"' }];
  assert.deepEqual(parseLeadCsv(leadsToCsv(rows))[0].company, rows[0].company);
  assert.throws(
    () =>
      parseLeadCsv(
        "회사,도메인,서비스,예산만원,이메일\n샘플,test.example,웹,NaN,a@b.example",
      ),
    /예산/,
  );
  assert.throws(
    () => parseLeadCsv('회사,도메인,서비스,예산만원,이메일\n"닫히지 않음'),
    /따옴표/,
  );
  assert.match(csvCell("=HYPERLINK(1)"), /^"'/);
});
test("bag merges only matching sizes, bounds quantities and calculates shipping/packaging", () => {
  const one = { productId: "knit", size: "S", quantity: 1, price: 128000 };
  const cart = addCartLine(addCartLine([], one), { ...one, quantity: 5 });
  assert.equal(cart[0].quantity, 5);
  assert.equal(addCartLine(cart, { ...one, size: "M" }).length, 2);
  assert.equal(addCartLine(cart, { ...one, size: "" }), cart);
  assert.deepEqual(cartAmounts([one], true), {
    subtotal: 128000,
    shipping: 3500,
    packaging: 5000,
    total: 136500,
  });
  assert.equal(cartAmounts([{ ...one, quantity: 2 }], false).shipping, 0);
  assert.equal(cartAmounts([], true).total, 0);
});
