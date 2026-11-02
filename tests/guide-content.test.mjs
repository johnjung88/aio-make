import test from "node:test";
import assert from "node:assert/strict";
import { guideEntries, mergeGuideEntries } from "../lib/guide-content.ts";
import { services } from "../lib/content.ts";
test("every offered service has an explicitly labelled example and a readable guide", () => {
  const examples = guideEntries("reference");
  assert.equal(examples.length, services.length);
  assert.equal(
    new Set(examples.map((entry) => `${entry.division}/${entry.slug}`)).size,
    examples.length,
  );
  for (const entry of examples) {
    assert.equal(entry.kind, "example");
    assert.ok(entry.body.length > 80);
    assert.ok(
      services.some(
        (service) =>
          service.division === entry.division && service.id === entry.service,
      ),
    );
  }
  assert.equal(guideEntries("insight").length, 9);
  assert.ok(guideEntries("insight").every((entry) => entry.body.length > 100));
});
test("a published CMS entry takes precedence without hiding other services", () => {
  const original = guideEntries("reference", "video")[0];
  const published = {
    ...original,
    id: "published-record",
    kind: "case",
    title: "공개를 확인한 실제 작업",
  };
  const merged = mergeGuideEntries([published], "reference", "video");
  assert.equal(merged[0], published);
  assert.equal(
    merged.filter((entry) => entry.slug === original.slug).length,
    1,
  );
  assert.equal(merged.length, guideEntries("reference", "video").length);
});
