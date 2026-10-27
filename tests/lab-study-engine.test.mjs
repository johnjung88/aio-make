import test from "node:test";
import assert from "node:assert/strict";
import {
  initialStudyState,
  studyOutput,
  studyReducer,
} from "../lib/lab-study-engine.ts";

const tick = (state, injectFailure = false) =>
  studyReducer(state, { type: "tick", injectFailure });
const start = () => studyReducer(initialStudyState, { type: "start" });

test("contact policy changes actual routes and outputs for the same requests", () => {
  const checked = studyOutput(true, 3, initialStudyState);
  const unchecked = studyOutput(false, 3, initialStudyState);
  assert.deepEqual([checked.draft, checked.review], [2, 1]);
  assert.deepEqual([unchecked.draft, unchecked.review], [3, 0]);
  assert.equal(checked.items[0].route, "수동 확인");
  assert.equal(unchecked.items[0].route, "초안 작성");
  assert.notEqual(checked.items[0].result, unchecked.items[0].result);
  assert.deepEqual(
    studyOutput(true, 9, initialStudyState).items.map((item) => item.id),
    Array.from({ length: 9 }, (_, i) => `REQ-${101 + i}`),
  );
});

test("pause holds the current step and reset prevents a pending tick advancing a new run", () => {
  const paused = studyReducer(tick(start()), { type: "pause" });
  assert.deepEqual(tick(paused), paused);
  const resumed = studyReducer(paused, { type: "resume" });
  assert.equal(tick(resumed).step, 2);
  assert.deepEqual(
    tick(studyReducer(resumed, { type: "reset" })),
    initialStudyState,
  );
});

test("injected timeout occurs at execution and retry resumes once without looping into the error", () => {
  let state = start();
  for (let i = 0; i < 3; i++) state = tick(state, true);
  assert.deepEqual([state.status, state.step], ["running", 3]);
  state = tick(state, true);
  assert.deepEqual([state.status, state.step], ["error", 3]);
  assert.deepEqual(tick(state, true), state);
  state = studyReducer(state, { type: "retry" });
  state = tick(tick(state, true), true);
  assert.equal(state.status, "complete");
  assert.equal(state.failureConsumed, true);
});

test("manual recovery sends every request to review and preserves the reason", () => {
  const manual = studyReducer(
    { status: "error", step: 3, failureConsumed: false },
    { type: "manual" },
  );
  const output = studyOutput(true, 3, manual);
  assert.deepEqual(
    [manual.status, output.draft, output.review],
    ["manual", 0, 3],
  );
  assert.match(output.items[0].result, /연락처/);
  assert.match(output.items[1].result, /실행 결과/);
  assert.deepEqual(
    studyReducer(initialStudyState, { type: "retry" }),
    initialStudyState,
  );
});
