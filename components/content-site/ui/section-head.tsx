/* 섹션 머리: 왼쪽 7/12에 eyebrow→h2→lead를 같은 왼쪽 선으로 쌓는다(SHARED-3: lead left = 로고 left).
 * aside(버튼 등 보조 요소)는 ≥1024에서 오른쪽 4/12 아래 정렬, <1024 세로. API(props)는 그대로다.
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
  return (
    <header className="cs-grid cs-head">
      <div className="cs-head-main cs-col-7">
        <p className="cs-t-eyebrow">{eyebrow}</p>
        <h2 id={id} className="cs-t-h2">
          {title}
        </h2>
        {lead ? <p className="cs-head-lead cs-t-lead">{lead}</p> : null}
      </div>
      {aside ? (
        <div className="cs-head-aside cs-col-4 cs-col-start-9">{aside}</div>
      ) : null}
    </header>
  );
}
