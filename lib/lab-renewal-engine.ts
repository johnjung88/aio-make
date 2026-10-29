export const pageBand = (count: number) =>
  count <= 9
    ? "10만 원 구간"
    : count <= 20
      ? "20만 원 구간"
      : "30만 원부터 · 별도 문의";
export function contactSelection(
  service: string,
  entry: string,
  plan = "",
  message = "",
) {
  return `/contact?${new URLSearchParams({ service, source: "lab", entry, ...(plan ? { plan } : {}), ...(message ? { message: message.slice(0, 400) } : {}) })}`;
}
export type Order = { id: string; quantity: number | null };
export const orders = (): Order[] =>
  Array.from({ length: 12 }, (_, i) => ({
    id: String(1021 + i),
    quantity: (i % 3) + 1,
  }));
export function reconcileOrders(options: {
  format: boolean;
  empty: boolean;
  duplicate: boolean;
  normalize: boolean;
}) {
  const a = orders(),
    b = orders();
  if (options.format) b[2].id = "#" + b[2].id;
  if (options.empty) b[4].quantity = null;
  if (options.duplicate) b[10] = { ...b[9] };
  const key = (id: string) => (options.normalize ? id.replace(/^#/, "") : id);
  const seen = new Set<string>();
  return b.map((row) => {
    const id = key(row.id);
    const duplicate = seen.has(id);
    seen.add(id);
    const source = a.find((r) => r.id === id);
    const reason = duplicate
      ? "중복"
      : row.quantity === null
        ? "수량 없음"
        : !source
          ? "형식 다름"
          : source.quantity !== row.quantity
            ? "수량 다름"
            : "";
    return { ...row, reason, match: !reason, normalized: row.id !== id };
  });
}
export const roleNames = ["요청자", "담당자", "관리자"] as const;
export const featureNames = [
  "요청 등록",
  "목록 조회",
  "상태 변경",
  "처리 기록",
  "담당자 배정",
  "첨부 파일",
  "변경 내역 보기",
  "외부 알림",
] as const;
export const defaultPermissions = () => [
  [true, true, false, false, false, false, false, false],
  [false, true, true, true, false, false, false, false],
  [true, true, true, true, true, true, true, false],
];
export const initialRequests = () =>
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    title: ["비품 교체", "자료 확인", "시설 점검", "계정 변경"][i % 4],
    owner: ["가상 민서", "가상 지우"][i % 2],
    assignee: i % 3 === 0 ? "가상 다온" : "가상 하람",
    status: "접수",
    note: "",
  }));
