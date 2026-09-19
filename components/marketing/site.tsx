import Link from "next/link";
import { publicContent } from "@/lib/marketing/cms";
import { defaults } from "@/lib/marketing/cms-schema";
import { marketing } from "@/lib/marketing/content";
export function MarketingHeader() {
  return (
    <header className="m-header">
      <Link className="m-logo" href="/ko" aria-label="AIO 홈">
        aio<span>마케팅을 일상으로</span>
      </Link>
      <nav aria-label="주 메뉴">
        <Link href="/ko/services/marketing">마케팅</Link>
        <Link href="/ko/portfolio">자체 프로젝트</Link>
        <Link href="/ko/resources">자료실</Link>
        <Link className="m-button small" href="/ko/quote">
          상담 신청 ↗
        </Link>
      </nav>
    </header>
  );
}
export function MarketingFooter() {
  return (
    <footer className="m-footer">
      <div className="m-logo">aio</div>
      <p>재방문 준비 · 콘텐츠 운영 · 유입 측정</p>
      <div>
        <Link href="/ko/services/marketing">마케팅 안내</Link>
        <Link href="/ko/privacy">개인정보 수집 안내</Link>
        <Link href="/ko/quote">상담 신청</Link>
      </div>
      <small>© AIO · 영상·개발 서비스는 오픈 준비 중입니다.</small>
    </footer>
  );
}
export function CTA() {
  return (
    <section className="m-cta">
      <div>
        <p className="m-eyebrow">마케팅 상담</p>
        <h2>
          지금 매장에 필요한 일부터
          <br />
          함께 정리해요.
        </h2>
        <p>예산과 시작 시점이 정해지지 않아도 괜찮습니다.</p>
      </div>
      <Link className="m-button light" href="/ko/quote">
        우리 매장 상담하기 ↗
      </Link>
    </section>
  );
}
export async function Scope({
  preview,
}: { preview?: typeof defaults.marketing } = {}) {
  const services = preview ?? (await publicContent("marketing"));
  return (
    <section className="m-section" id="scope">
      <p className="m-eyebrow">한 매장, 하나의 월간 플랜</p>
      <h2>
        만들고 끝내지 않고,
        <br />
        운영하고 돌아봅니다.
      </h2>
      <div className="m-grid three">
        {services.map((s, i) => (
          <article className="m-card" key={s.tag}>
            <span className="m-number">0{i + 1}</span>
            <p className="m-tag">{s.tag}</p>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
export async function Projects({
  preview,
}: { preview?: typeof defaults.projects } = {}) {
  const projects = preview ?? (await publicContent("projects"));
  return (
    <section className="m-section" id="projects">
      <div className="m-section-head">
        <div>
          <p className="m-eyebrow">자체 운영 프로젝트</p>
          <h2>
            우리의 운영 경험을
            <br />
            구분해서 보여드립니다.
          </h2>
        </div>
        <p>
          아래는 AIO 자체 프로젝트입니다.
          <br />
          고객 실적이나 매출 개선 사례가 아닙니다.
        </p>
      </div>
      <div className="m-grid three">
        {projects.map((p, i) => (
          <article className="m-card project" key={p.name}>
            <div className={"m-project-art art-" + i} aria-hidden="true">
              <span>
                {["여행의 다음 질문", "오늘의 한 끼", "우리 집의 발견"][i]}
              </span>
            </div>
            <p className="m-tag">{p.kind}</p>
            <h3>{p.name}</h3>
            <p>{p.text}</p>
          </article>
        ))}
      </div>
      <p className="m-note">
        현재 공개된 안내는 프로젝트의 목적과 역할입니다. 개별 산출물·운영 수치는
        원자료와 공개 범위를 확인한 뒤 추가합니다.
      </p>
    </section>
  );
}
export function Process() {
  return (
    <section className="m-section">
      <p className="m-eyebrow">함께 일하는 방법</p>
      <h2>상담부터 다음 달의 개선까지.</h2>
      <ol className="m-steps">
        {[
          ["상담", "업종·지역·운영 채널과 지금의 고민을 확인합니다."],
          [
            "월간 플랜 합의",
            "제공 범위·소재 권리·플랫폼·측정 항목을 함께 정합니다.",
          ],
          ["운영", "합의한 플랜에 따라 제작과 내부 검수를 진행합니다."],
          [
            "보고와 개선",
            "운영 종료 후 5영업일 안에 보고하고 다음 행동을 정합니다.",
          ],
        ].map(([title, text], i) => (
          <li key={title}>
            <span>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
export async function Prices({
  preview,
}: { preview?: typeof defaults.pricing } = {}) {
  const prices = preview ?? (await publicContent("pricing"));
  return (
    <section className="m-section m-prices" id="pricing">
      <p className="m-eyebrow">가격과 이용 조건</p>
      <h2>
        같은 통합상품,
        <br />
        계약 순번에 따른 시작 가격.
      </h2>
      <p>매장 1곳 기준 월 공급가액 · VAT 별도 · 광고비 별도</p>
      <div className="m-table-wrap">
        <table>
          <caption className="sr-only">
            누적 신규 유료 계약 순번별 가격과 연속 가격 보장기간
          </caption>
          <thead>
            <tr>
              <th>누적 유료 계약 순번</th>
              <th>월 이용료</th>
              <th>시작일부터 연속 가격 보장</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((p) => (
              <tr key={p.order}>
                <td>{p.order}</td>
                <td>
                  <strong>{p.amount}만원</strong>
                </td>
                <td>{p.guarantee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="m-terms">
        <li>
          문의 접수만으로 할인 순번이 확정되지 않습니다. 계약·최초 결제 완료
          증거와 최종 가격을 확인한 뒤 대표가 순번을 확정합니다.
        </li>
        <li>
          보장기간 종료 뒤 다음 월 갱신부터 월 90만원입니다. 중도 해지하면 가격
          보장이 종료되며 재계약 당시의 현행 가격을 적용합니다.
        </li>
        <li>
          월 단위 갱신이며 최소 의무 계약기간은 없습니다. 가격 보장기간은 의무
          계약기간이 아닙니다.
        </li>
        <li>
          초기 설정은 통합 이용료에 포함됩니다. 광고 집행·광고비·맞춤 CRM·추가
          취재는 자동 포함되지 않습니다. 실제 재방문 메시지 발송과 이용 비용은
          고객 부담입니다.
        </li>
        <li>
          매월 1일 시작을 기준으로 상담에서 착수 가능 여부를 확인합니다.
          문의·매출·조회수 등 특정 성과를 보장하지 않습니다.
        </li>
      </ul>
    </section>
  );
}
export async function Resources({
  preview,
}: { preview?: typeof defaults.resources } = {}) {
  const resources = preview ?? (await publicContent("resources"));
  return (
    <section className="m-section" id="resources">
      <p className="m-eyebrow">자료실</p>
      <h2>상담 전에도 바로 쓸 수 있는 자료.</h2>
      <div className="m-grid two">
        {resources.map(({ slug, title, text }) => (
          <a
            className="m-card m-download"
            key={slug}
            href={"/resources/" + slug + ".txt"}
            download
          >
            <span className="m-tag">TXT · 무료 다운로드</span>
            <h3>{title} ↓</h3>
            <p>{text}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
export async function Home({
  preview,
}: { preview?: typeof defaults.home } = {}) {
  const home = preview ?? (await publicContent("home"));
  return (
    <>
      <section className="m-hero">
        <div>
          <p className="m-eyebrow">
            <span className="m-dot" /> AIO 마케팅 · 운영 중
          </p>
          <h1>{home.title}</h1>
          <p className="m-lead">{home.description}</p>
          <div className="m-actions">
            <Link href="/ko/services/marketing" className="m-button">
              마케팅 서비스 알아보기 ↗
            </Link>
            <Link href="/ko/quote" className="m-text-link">
              상담 신청 →
            </Link>
          </div>
        </div>
        <div className="m-hero-board">
          <div className="m-board-top">
            우리 매장의 월간 마케팅 <span>운영 흐름</span>
          </div>
          <div className="m-board-title">
            매달 쌓이는
            <br />
            <b>다음의 근거.</b>
          </div>
          {[
            "재방문할 이유 준비",
            "고객 질문으로 콘텐츠 제작",
            "확인 가능한 유입 기록",
          ].map((s, i) => (
            <div className="m-board-row" key={s}>
              <span>0{i + 1}</span>
              {s}
              <b>↗</b>
            </div>
          ))}
          <small>플랜 합의 → 운영 → 보고 → 다음 개선</small>
        </div>
      </section>
      <section className="m-business" id="business">
        <div>
          <span className="m-status">운영 중</span>
          <h2>마케팅</h2>
          <p>재방문 준비·콘텐츠·측정</p>
          <Link href="/ko/services/marketing">상세 보기 ↗</Link>
        </div>
        <div>
          <span className="m-status muted">오픈 예정</span>
          <h2>영상</h2>
          <p>서비스를 준비하고 있습니다.</p>
        </div>
        <div>
          <span className="m-status muted">오픈 예정</span>
          <h2>개발</h2>
          <p>서비스를 준비하고 있습니다.</p>
        </div>
      </section>
      <Scope />
      <Projects />
      <Process />
      <Resources />
      <CTA />
    </>
  );
}
export function MarketingPage() {
  return (
    <>
      <section className="m-hero detail">
        <div>
          <p className="m-eyebrow">
            한국어로 운영하는 국내 오프라인 매장을 위해
          </p>
          <h1>
            다시 찾을 이유부터,
            <br />
            <em>관심이 온 경로까지.</em>
          </h1>
          <p className="m-lead">{marketing.description}</p>
          <div className="m-actions">
            <Link className="m-button" href="/ko/quote">
              마케팅 상담 신청 ↗
            </Link>
            <a className="m-text-link" href="#pricing">
              가격·조건 확인 ↓
            </a>
          </div>
        </div>
        <aside className="m-card">
          <p className="m-tag">이런 고민이 있다면</p>
          <h3>
            “마케팅, 어디부터
            <br />
            챙겨야 할까요?”
          </h3>
          <ul className="m-terms">
            <li>기존 고객에게 다시 찾아올 이유를 전하고 싶어요.</li>
            <li>매장을 운영하다 보면 콘텐츠가 자꾸 멈춰요.</li>
            <li>어느 채널에서 문의가 오는지 알기 어려워요.</li>
          </ul>
        </aside>
      </section>
      <Scope />
      <Projects />
      <Process />
      <Prices />
      <Resources />
      <section className="m-section">
        <p className="m-eyebrow">자주 묻는 질문</p>
        <h2>시작 전에 확인하세요.</h2>
        {[
          [
            "모든 플랫폼을 운영해 주나요?",
            "매장에 필요한 플랫폼과 형식은 월간 플랜에서 합의합니다. 모든 채널의 무제한 운영을 의미하지 않습니다.",
          ],
          [
            "콘텐츠를 매번 확인해야 하나요?",
            "월간 플랜에서 사실·가격·혜택·권리·표현 범위를 합의하고, 이후 개별 콘텐츠는 AIO 내부 검수로 진행합니다.",
          ],
          [
            "매출이나 조회수를 보장하나요?",
            "특정 성과는 보장하지 않습니다. 확인 가능한 운영 결과와 유입 반응을 바탕으로 개선합니다.",
          ],
          [
            "예산이나 일정이 미정이어도 상담할 수 있나요?",
            "네. 상담 폼에서 미정을 선택하고 현재 고민을 남겨 주세요. 접수는 계약이나 할인 순번 확정이 아닙니다.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
      <CTA />
    </>
  );
}
