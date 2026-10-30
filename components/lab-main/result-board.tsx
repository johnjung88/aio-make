import styles from "./renewal.module.css";

export function ResultBoard({
  service,
  compact = false,
}: {
  service: string;
  compact?: boolean;
}) {
  const automation = service === "automation";
  const rows = automation
    ? [
        ["주문 자료", "형식 확인", "대조 완료"],
        ["수량 누락", "담당자 검토", "확인 필요"],
        ["중복 주문", "원장과 비교", "분리 완료"],
      ]
    : [
        ["비품 교체", "가상 민서", "접수"],
        ["시설 점검", "가상 하람", "진행 중"],
        ["자료 확인", "가상 다온", "처리 완료"],
      ];
  return (
    <div className={styles.resultBoard} data-compact={compact}>
      <div className={styles.boardBar}>
        <b>{automation ? "FLOW" : "ORBIT"}</b>
        <span>가상 업무 화면</span>
      </div>
      <div className={styles.boardBody}>
        <p className={styles.boardLabel}>
          {automation ? "자료 대조 결과" : "요청 처리 현황"}
        </p>
        <strong>
          {automation ? "예외까지 한눈에" : "팀의 요청을 한곳에서"}
        </strong>
        <div className={styles.boardLegend}>
          {(automation
            ? ["입력", "처리", "결과"]
            : ["요청", "담당", "상태"]
          ).map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        {rows.map((row) => (
          <div className={styles.boardRow} key={row[0]}>
            {row.map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
        ))}
        <p className={styles.boardFoot}>
          {automation
            ? "확인이 필요한 자료는 따로 남깁니다"
            : "역할에 맞는 요청과 처리 기록을 봅니다"}
        </p>
      </div>
    </div>
  );
}
