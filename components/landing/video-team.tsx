"use client";
import { useRef } from "react";
import { DP_CSS, useDarkPremium, OrgStructure } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

type M = { av: string; role: string; nm: string; career: string; duties: string[] };
const TEAM: M[] = [
  { av: "민", role: "Director · 연출", nm: "민재", career: "11년차 · CF·브랜드필름 연출", duties: ["브랜드·홍보 영상 기획·연출", "스토리보드·촬영 디렉션", "메시지·톤·레퍼런스 설계"] },
  { av: "정", role: "Editor · 편집", nm: "정우", career: "8년차 · 유튜브·숏폼 에디터", duties: ["컷·리듬·자막·컬러 편집", "숏폼·릴스 포맷·후킹 최적화", "썸네일·인트로 설계"] },
  { av: "수", role: "Motion · 모션", nm: "수진", career: "6년차 · 모션그래픽 디자이너", duties: ["인트로·자막·인포그래픽 모션", "브랜드 모션 시스템·트랜지션", "그래픽 에셋 제작"] },
];

export function VideoTeam({ locale }: { locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat="video" active="team" />

      <header className="hero"><div className="wrap">
        <span className="kick">Video · 팀원 소개</span>
        <h1>영상을 만드는<br /><em>사람들</em></h1>
        <p className="lead">연출·편집·컬러·믹스까지 — 영상 한 편을 처음부터 끝까지 함께합니다</p>
      </div></header>

      <OrgStructure svc="영상" />

      <section className="sec wrap">
        <div className="shead reveal"><span className="kick">Team · 실무팀</span><h2>이 서비스를 <em>만드는 사람들</em></h2></div>
        <div className="team">
          {TEAM.map((m, i) => (
            <div key={i} className={"mem reveal d" + ((i % 4) + 1)}>
              <div className="av">{m.av}</div>
              <div className="role">{m.role}</div>
              <div className="nm">{m.nm}</div>
              <div className="career">{m.career}</div>
              <ul className="duties">{m.duties.map((d, j) => <li key={j}>{d}</li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="ctaS"><div className="wrap reveal">
        <h2>함께 만들어<br /><em>볼까요?</em></h2>
        <p>지금 문의하면 24시간 안에 견적 · 5일 안에 시안 컷</p>
        <a className="cta-pill" href={`${base}/quote`}>제작 문의 →</a>
      </div></section>

      <AioFooter locale={locale} />
    </div>
  );
}
