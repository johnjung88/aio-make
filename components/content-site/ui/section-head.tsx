/* 섹션 머리. 기본(start)은 왼쪽 7/12에 eyebrow→h2→lead를 같은 왼쪽 선으로 쌓는다(SHARED-3: lead left = 로고 left).
 * aside(버튼 등 보조 요소)는 ≥1024에서 오른쪽 4/12 아래 정렬, <1024 세로.
 * align="center"는 머리 블록 전체를 컨테이너 가운데에 놓고 eyebrow·h2·lead를 가운데 정렬한다(PC·모바일 같음). aside는 쓰지 않는다.
 * emphasis는 title 안에서 메인 키워드로 색을 줄 부분 문자열이다. 글자는 title 그대로 <em> 안에 남아 스크린리더 문장이 같다.
 * h2에 id를 주고 섹션은 aria-labelledby로 이 id를 가리킨다. title 줄바꿈은 \n으로만. */
function Title({ title, emphasis }: { title: string; emphasis?: string }) {
  const at = emphasis ? title.indexOf(emphasis) : -1;
  if (!emphasis || at < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, at)}
      <em className="cs-head-em">{emphasis}</em>
      {title.slice(at + emphasis.length)}
    </>
  );
}

export function CsSectionHead({
  id,
  eyebrow,
  title,
  lead,
  aside,
  align = "start",
  emphasis,
}: {
  /** h2 id(섹션 aria-labelledby 대상) */
  id: string;
  /** 영문 대문자 3단어 이하 */
  eyebrow: string;
  title: string;
  lead?: string;
  aside?: React.ReactNode;
  /** 기본 start(왼쪽 7/12). center는 머리 전체 가운데 */
  align?: "start" | "center";
  /** title 안에서 색을 줄 메인 키워드(첫 일치 한 곳) */
  emphasis?: string;
}) {
  const center = align === "center";
  return (
    <header className={center ? "cs-grid cs-head cs-head--center" : "cs-grid cs-head"}>
      <div className={center ? "cs-head-main" : "cs-head-main cs-col-7"}>
        <p className="cs-t-eyebrow">{eyebrow}</p>
        <h2 id={id} className="cs-t-h2">
          <Title title={title} emphasis={emphasis} />
        </h2>
        {lead ? <p className="cs-head-lead cs-t-lead">{lead}</p> : null}
      </div>
      {aside && !center ? (
        <div className="cs-head-aside cs-col-4 cs-col-start-9">{aside}</div>
      ) : null}
    </header>
  );
}
