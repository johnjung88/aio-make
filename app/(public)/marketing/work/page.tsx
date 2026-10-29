import Link from "next/link";
import { publicEntries } from "@/lib/db";
import { pageMetadata } from "@/lib/metadata";
import {
  MarketingHead,
  MarketingPicture,
  MarketingInquiry,
} from "@/components/marketing/blocks";
import {
  marketingIds,
  marketingNames,
  marketingCopy,
} from "@/lib/marketing-renewal";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata(
  "마케팅 제작 방향",
  "서비스별 결과물과 운영 방향을 살펴보세요",
  "/marketing/work",
);
export default async function MarketingWork() {
  const entries = (await publicEntries("reference", "marketing")).filter(
    (e) => e.kind !== "example",
  );
  return (
    <>
      <section className="mk-container mk-section">
        <div className="mk-page-title">
          <p className="mk-eyebrow">PRODUCTION DIRECTION</p>
          <h1>어떤 결과물을\n받게 될까요</h1>
          <p className="mk-lead">
            서비스별 결과물과 운영 방향을 먼저 살펴보세요
          </p>
        </div>
        <p className="mk-note">아래는 가상 브랜드의 제작 방향 예시입니다</p>
        <div className="mk-work-grid">
          {marketingIds.map((id) => (
            <Link
              className="mk-service-card"
              key={id}
              href={"/marketing/services/" + id}
            >
              <MarketingPicture
                name={id + "-result-1"}
                alt={marketingCopy[id].results[0][0] + " 예시"}
              />
              <div className="mk-card-body">
                <h2>{marketingNames[id]}</h2>
                <p>{marketingCopy[id].results[0][1]}</p>
                <span className="mk-card-link">
                  {marketingNames[id]} 자세히 보기 →
                </span>
              </div>
            </Link>
          ))}
        </div>
        {entries.length > 0 && (
          <>
            <MarketingHead
              id="published-work-title"
              eyebrow="PUBLISHED WORK"
              title="공개 운영 사례"
            />
            <div className="mk-work-grid">
              {entries.map((e) => (
                <Link
                  key={e.id}
                  className="mk-service-card mk-card-body"
                  href={"/marketing/work/" + e.slug}
                >
                  <h3>{e.title}</h3>
                  <p>{e.summary}</p>
                  <span>사례 보기 →</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
      <MarketingInquiry />
    </>
  );
}
