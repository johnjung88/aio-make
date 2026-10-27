export type StudyStatus =
  | "idle"
  | "running"
  | "paused"
  | "error"
  | "complete"
  | "manual";
export type StudyState = {
  status: StudyStatus;
  step: number;
  failureConsumed: boolean;
};
export type StudyAction =
  | { type: "start" | "pause" | "resume" | "reset" | "retry" | "manual" }
  | { type: "tick"; injectFailure: boolean };
export const initialStudyState: StudyState = {
  status: "idle",
  step: -1,
  failureConsumed: false,
};

export function studyReducer(
  state: StudyState,
  action: StudyAction,
): StudyState {
  switch (action.type) {
    case "reset":
      return initialStudyState;
    case "start":
      return { status: "running", step: 0, failureConsumed: false };
    case "pause":
      return state.status === "running"
        ? { ...state, status: "paused" }
        : state;
    case "resume":
      return state.status === "paused"
        ? { ...state, status: "running" }
        : state;
    case "retry":
      return state.status === "error"
        ? { ...state, status: "running", failureConsumed: true }
        : state;
    case "manual":
      return state.status === "error"
        ? { ...state, status: "manual", step: 4 }
        : state;
    case "tick": {
      if (state.status !== "running") return state;
      if (state.step === 3 && action.injectFailure && !state.failureConsumed)
        return { ...state, status: "error" };
      if (state.step >= 4) return { ...state, status: "complete" };
      return { ...state, step: state.step + 1 };
    }
  }
}

export function studyOutput(
  required: boolean,
  count: number,
  state: StudyState,
) {
  const items = Array.from({ length: count }, (_, i) => {
    const contactMissing = i % 3 === 0;
    const manual = state.status === "manual" || (required && contactMissing);
    return {
      id: `REQ-${String(101 + i).padStart(3, "0")}`,
      contactMissing,
      route: manual ? "수동 확인" : "초안 작성",
      result: manual
        ? contactMissing
          ? "연락처·요청 내용을 확인해 주세요"
          : "실행 결과를 사람이 확인해 주세요"
        : "웹사이트 구축 범위 제안 초안",
    };
  });
  return {
    items,
    review: items.filter((item) => item.route === "수동 확인").length,
    draft: items.filter((item) => item.route === "초안 작성").length,
  };
}
