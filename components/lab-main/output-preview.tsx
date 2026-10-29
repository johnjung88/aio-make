import styles from "./renewal.module.css";

const titles: Record<string, string> = {
  result: "대조 결과 시트",
  error: "보류 항목 확인",
  guide: "실행 안내서",
  detail: "시설 점검 요청",
  permission: "역할별 권한",
  mobile: "나의 업무",
};

/** Screen examples rendered as text so the UI remains legible on mobile. */
export function OutputPreview({ variant }: { variant: string }) {
  return (
    <div className={styles.outputPreview} data-kind={variant}>
      <div className={styles.outputChrome}>
        <span aria-hidden="true">◆</span>
        <b>
          {["result", "error", "guide"].includes(variant) ? "FLOW" : "ORBIT"}
        </b>
        <small>가상 화면</small>
      </div>
      <div className={styles.outputWorkspace}>
        <div className={styles.outputToolbar}>
          <span>작업 공간 / {variant === "permission" ? "설정" : "자료"}</span>
          <span className={styles.outputBadge}>예시</span>
        </div>
        <strong>{titles[variant] || titles.mobile}</strong>
        <div className={styles.outputSurface}>
          {variant === "result" ? (
            <>
              <div className={styles.outputTabs}>
                <b>전체 자료</b>
                <span>확인 필요</span>
              </div>
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
                    <td>
                      <span className={styles.outputBadge}>일치</span>
                    </td>
                  </tr>
                  <tr>
                    <td>주문 B</td>
                    <td>
                      <span className={styles.outputBadge}>수량 확인</span>
                    </td>
                  </tr>
                  <tr>
                    <td>주문 C</td>
                    <td>
                      <span className={styles.outputBadge}>중복 제외</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          ) : variant === "error" ? (
            <>
              <span className={styles.outputBadge}>원본 보완 필요</span>
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
              <ol className={styles.outputChecklist}>
                <li>
                  <span>01</span>
                  <div>
                    <b>입력 준비</b>
                    <p>파일과 대조 규칙 확인</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <b>결과 검토</b>
                    <p>실행 후 보류 내역 확인</p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <b>수정 후 재실행</b>
                    <p>원본 보완 후 다시 대조</p>
                  </div>
                </li>
              </ol>
            </>
          ) : variant === "detail" ? (
            <>
              <span className={styles.outputBadge}>진행 중</span>
              <ol className={styles.outputTimeline}>
                <li>
                  <b>점검 요청 등록</b>
                  <p>요청자 · 시설 점검</p>
                </li>
                <li>
                  <b>담당자 배정</b>
                  <p>관리자 · 점검 담당 지정</p>
                </li>
                <li>
                  <b>점검 자료 첨부</b>
                  <p>담당자 · 처리 내역 작성</p>
                </li>
              </ol>
            </>
          ) : variant === "permission" ? (
            <>
              <div className={styles.outputTabs}>
                <b>역할 설정</b>
                <span>변경 내역</span>
              </div>
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
              <div className={styles.outputPhoneTop}>
                <b>ORBIT</b>
                <span>담당자</span>
              </div>
              <span className={styles.outputBadge}>배정된 요청</span>
              <b>시설 점검</b>
              <p>
                첨부 자료를 확인하고
                <br />
                진행 상태를 남겨 주세요
              </p>
              <div className={styles.outputPhoneAction}>
                처리 기록 남기기 ↗
              </div>
            </div>
          )}
        </div>
        <p className={styles.outputFoot}>가상 데이터 · 제작 방향 예시</p>
      </div>
    </div>
  );
}
