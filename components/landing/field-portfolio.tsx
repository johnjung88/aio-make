"use client";
import { useRef } from "react";
export { FIELD_CATEGORIES, FIELD_META } from "@/lib/fields";
import { DP_CSS, useDarkPremium } from "./dp-shell";
import { AioNav, AioFooter } from "./aio-nav";

const EXTRA = `
.aiodp .pfgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}
.aiodp .pfc{border:1px solid var(--line2);border-radius:14px;overflow:hidden;background:var(--bg2);transition:transform .35s,border-color .35s;display:block;text-align:left}
.aiodp .pfc:hover{transform:translateY(-6px);border-color:var(--gold)}
.aiodp .pfc-img{position:relative;aspect-ratio:16/10;overflow:hidden;background:linear-gradient(135deg,rgba(200,162,74,.12),rgba(239,233,221,.03))}
.aiodp .pfc-img img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.aiodp .pfc:hover .pfc-img img{transform:scale(1.05)}
.aiodp .pfc-img .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:38px;opacity:.4}
.aiodp .pfc-img::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(14,13,11,.65))}
.aiodp .pfc-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:16px 18px}
.aiodp .pfc-meta .nm{font-family:var(--frau);font-size:17px;font-weight:500;color:var(--fg)}
.aiodp .pfc-meta .cnt{font-family:var(--mono);font-size:11px;color:var(--fg3);border:1px solid var(--line2);border-radius:999px;padding:3px 10px;white-space:nowrap}
.aiodp .pfempty{text-align:center;color:var(--fg2);border:1px dashed var(--line2);border-radius:14px;padding:56px 24px;font-size:14px;line-height:1.8}
@media(max-width:820px){.aiodp .pfgrid{grid-template-columns:1fr}}
`;

export type FieldCard = { slug: string; label: string; icon: string; count: number; cover: string | null };

export function FieldPortfolio({
  locale, field, title, lead, cards,
}: { locale: string; field: "development" | "design" | "video" | "marketing"; title: string; lead: string; cards: FieldCard[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useDarkPremium(ref);
  const base = `/${locale}`;
  const has = cards.some((c) => c.count > 0) || cards.length > 0;
  return (
    <div className="aiodp" ref={ref}>
      <style dangerouslySetInnerHTML={{ __html: DP_CSS + EXTRA }} />
      <div className="prog" />
      <AioNav locale={locale} level="middle" cat={field} active="portfolio" />

      <header className="hero"><div className="wrap">
        <span className="kick">Portfolio · {title}</span>
        <h1>{title} <em>포트폴리오</em></h1>
        <p className="lead">{lead}</p>
      </div></header>

      <section className="sec wrap">
        {has ? (
          <div className="pfgrid">
            {cards.map((c) => (
              <a key={c.slug} className="pfc reveal" href={`${base}/portfolio/category/${c.slug}`}>
                <div className="pfc-img">
                  {c.cover
                    ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={c.cover} alt={c.label} loading="lazy" />
                    : <span className="ph">{c.icon}</span>}
                </div>
                <div className="pfc-meta">
                  <span className="nm">{c.icon} {c.label}</span>
                  <span className="cnt">{c.count > 0 ? `${c.count}개` : "준비 중"}</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="pfempty reveal">아직 공개된 작업물이 없습니다 — 곧 채워집니다<br />먼저 상담이 필요하시면 무료 상담을 이용해보세요</div>
        )}
      </section>

      <AioFooter locale={locale} />
    </div>
  );
}
