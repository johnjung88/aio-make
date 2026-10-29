import styles from "./renewal.module.css";
export function AutomationCardVisual() {
  return (
    <div
      className={styles.automationCardVisual}
      role="img"
      aria-label="가상 자동화 화면 예시: 자료 받기, 조건 대조, 결과 파일과 담당자 알림"
    >
      <div className={styles.automationCardBar}>
        <b>FLOW</b>
        <span>가상 흐름 예시</span>
      </div>
      <div className={styles.automationCardFlow}>
        <div>
          <span>입력</span>
          <b>주문 자료 받기</b>
          <small>엑셀 · CSV</small>
        </div>
        <span aria-hidden="true">↓</span>
        <div>
          <span>처리</span>
          <b>조건 대조</b>
          <small>중복 · 누락 분리</small>
        </div>
        <span aria-hidden="true">↓</span>
        <div>
          <span>결과</span>
          <b>파일 정리 · 담당자 알림</b>
        </div>
      </div>
    </div>
  );
}
