/* 섹션 머리: ≥1024 2열(왼쪽 7/12 eyebrow→h2, 오른쪽 4/12 lead 아래 정렬), <1024 세로.
 * h2에 id를 주고 섹션은 aria-labelledby로 이 id를 가리킨다. title 줄바꿈은 \n으로만. */
export function CsSectionHead({
  id,
  eyebrow,
  title,
  lead,
  aside,
}: {
  /** h2 id(섹션 aria-labelledby 대상) */
  id: string;
  /** 영문 대문자 3단어 이하 */
  eyebrow: string;
  title: string;
  lead?: string;
  aside?: React.ReactNode;
}) {
  const hasAside = Boolean(lead || aside);
  return (
    <header className="cs-grid cs-head">
      <div className="cs-head-main cs-col-7">
        <p className="cs-t-eyebrow">{eyebrow}</p>
        <h2 id={id} className="cs-t-h2">
          {title}
        </h2>
      </div>
      {hasAside ? (
        <div className="cs-head-aside cs-col-4 cs-col-start-9">
          {lead ? <p className="cs-t-lead">{lead}</p> : null}
          {aside}
        </div>
      ) : null}
    </header>
  );
}
