import test from "node:test";
import assert from "node:assert/strict";
import {
  parseGaDays,
  percentChange,
  reportRequests,
  normalizeReports,
} from "../lib/ga-data.ts";
const row = (values, dimension) => ({
  metricValues: values.map((value) => ({ value: String(value) })),
  ...(dimension ? { dimensionValues: [{ value: dimension }] } : {}),
});
const reports = () => [
  { rows: [row([9, 12, 23])], metadata: { timeZone: "Asia/Seoul" } },
  { rows: [row([5, 8, 16])] },
  { rows: [row([3])] },
  { rows: [row([0])] },
  { rows: [row([8], "Organic Search"), row([4], "Direct")] },
  { rows: [row([15], "/")] },
  { rows: [row([10], "mobile")] },
  { rows: [row([3, 6], "20260930"), row([9, 17], "20260929")] },
];
test("GA periods reject unsupported values and comparison handles an empty baseline", () => {
  assert.equal(parseGaDays(null), 28);
  for (const day of [7, 28, 90]) assert.equal(parseGaDays(String(day)), day);
  for (const day of ["", "0", "-7", "14", "NaN", "Infinity"])
    assert.equal(parseGaDays(day), null);
  assert.equal(percentChange(10, 0), null);
  assert.equal(percentChange(0, 0), 0);
  assert.equal(percentChange(3, 6), -50);
});
test("all query periods are equal length and do not overlap; leads count only generate_lead", () => {
  for (const days of [7, 28, 90]) {
    const req = reportRequests(days);
    assert.deepEqual(req[0].dateRanges, [
      { startDate: `${days}daysAgo`, endDate: "yesterday" },
    ]);
    assert.deepEqual(req[1].dateRanges, [
      { startDate: `${days * 2}daysAgo`, endDate: `${days + 1}daysAgo` },
    ]);
    assert.equal(req[2].metrics[0].name, "eventCount");
    assert.equal(
      req[2].dimensionFilter.filter.stringFilter.value,
      "generate_lead",
    );
    assert.equal(req[7].limit, String(days));
  }
});
test("aggregate users remain unique; daily data sorts and fills missing days in the property's timezone", () => {
  // UTC is still September 30; the property's local date is October 1.
  const out = normalizeReports(reports(), 7, new Date("2026-09-30T16:00:00Z"));
  assert.deepEqual(out.totals, {
    activeUsers: 9,
    sessions: 12,
    views: 23,
    leads: 3,
  });
  assert.deepEqual(out.dateRange, { start: "2026-09-24", end: "2026-09-30" });
  assert.equal(out.daily.length, 7);
  assert.equal(out.daily[0].sessions, 0);
  assert.equal(out.daily[5].sessions, 9);
  assert.equal(out.daily[6].views, 6);
  assert.equal(out.channels[0].name, "Organic Search");
  const empty = normalizeReports(
    Array.from({ length: 8 }, () => ({})),
    90,
    new Date("2026-03-01T12:00:00Z"),
  );
  assert.equal(empty.totals.activeUsers, 0);
  assert.equal(empty.daily.length, 90);
  assert.equal(empty.dateRange.end, "2026-02-28");
});
test("malformed reports fail, while threshold and sampling notes survive normalization", () => {
  assert.throws(() => normalizeReports([], 7));
  const invalid = reports();
  invalid[0].rows[0].metricValues[0].value = "NaN";
  assert.throws(() => normalizeReports(invalid, 7));
  const missing = reports();
  missing[0].rows[0].metricValues.pop();
  assert.throws(() => normalizeReports(missing, 7));
  const restricted = reports();
  restricted[0].metadata = {
    timeZone: "Asia/Seoul",
    subjectToThresholding: true,
    dataLossFromOtherRow: true,
    samplingMetadatas: [{}],
  };
  assert.equal(normalizeReports(restricted, 28).warnings.length, 3);
});
