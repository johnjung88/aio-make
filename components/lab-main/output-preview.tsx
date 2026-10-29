import styles from "./renewal.module.css";

/** Readable, responsive examples rather than scaled dashboard screenshots. */
export function OutputPreview({ variant }: { variant: string }) {
  return (
    <div className={styles.outputPreview} data-kind={variant}>
      <small>가상 데이터 · 제작 방향 예시</small>
      {variant === "result" ? (
        <>
          <strong>대조 결과 시트</strong>
          <table>
            <thead>
              <tr>
                <th>자료</th>
                <th>결과</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>주문 A</td>
                <td>일치</td>
              </tr>
              <tr>
                <td>주문 B</td>
                <td>수량 확인</td>
              </tr>
              <tr>
                <td>주문 C</td>
                <td>중복 제외</td>
              </tr>
            </tbody>
          </table>
          <p>일치 자료와 보류 자료를 시트로 분리</p>
        </>
      ) : variant === "error" ? (
        <>
          <strong>보류 항목 확인</strong>
          <div className={styles.outputIssue}>
            <b>주문 B · 수량 누락</b>
            <p>입력 자료의 수량 칸이 비어 있습니다</p>
          </div>
          <dl>
            <dt>원인</dt>
            <dd>필수 값 없음</dd>
            <dt>다음 처리</dt>
            <dd>원본 보완 후 재대조</dd>
          </dl>
        </>
      ) : variant === "guide" ? (
        <>
          <strong>실행 안내서</strong>
          <ol>
            <li>입력 파일과 규칙 확인</li>
            <li>대조 실행 후 보류 확인</li>
            <li>원본 수정 후 다시 실행</li>
          </ol>
          <p>수동 확인이 필요한 자료는 따로 보관</p>
        </>
      ) : variant === "detail" ? (
        <>
          <strong>시설 점검 요청</strong>
          <span className={styles.outputBadge}>진행 중</span>
          <ol>
            <li>요청자 · 점검 요청 등록</li>
            <li>관리자 · 담당자 배정</li>
            <li>담당자 · 점검 자료 첨부</li>
          </ol>
          <p>요청 상세와 변경 내역을 함께 확인</p>
        </>
      ) : variant === "permission" ? (
        <>
          <strong>역할별 권한</strong>
          <table>
            <thead>
              <tr>
                <th>기능</th>
                <th>담당자</th>
                <th>관리자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>조회</th>
                <td>허용</td>
                <td>허용</td>
              </tr>
              <tr>
                <th>상태 변경</th>
                <td>허용</td>
                <td>허용</td>
              </tr>
              <tr>
                <th>담당 배정</th>
                <td>제한</td>
                <td>허용</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <div className={styles.outputPhone}>
          <b>나의 업무</b>
          <span>배정된 요청</span>
          <strong>시설 점검</strong>
          <p>
            첨부 자료를 확인하고
            <br />
            진행 상태를 남겨 주세요
          </p>
          <span className={styles.outputBadge}>자료 확인 → 처리 기록</span>
        </div>
      )}
    </div>
  );
}
