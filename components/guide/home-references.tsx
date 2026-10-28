"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkCard } from "@/components/work-card";
import type { DivisionId } from "@/lib/content";
import type { WorkItem } from "@/lib/work-catalog";

const groups = [
  { id: "all", label: "전체" },
  { id: "video", label: "컨텐츠" },
  { id: "development", label: "개발" },
  { id: "marketing", label: "마케팅" },
];

// Works are selected on the server (lib/home-references-data.ts) and arrive
// as plain props; this client module imports only the WorkItem type.
export function HomeReferences({
  works = [],
  division: fixedDivision,
}: {
  works?: WorkItem[];
  division?: DivisionId;
}) {
  const [selected, setCategory] = useState("all");
  const category = fixedDivision ?? selected;
  const allHref =
    fixedDivision === "development"
      ? "/lab"
      : fixedDivision === "marketing"
        ? "/marketing/work"
        : null;
  const items = works
    .filter((work) => category === "all" || work.division === category)
    .slice(0, fixedDivision ? 4 : 6);
  return (
    <section id="work" className="home-references work-page work-home">
      <div className="review-container">
        <div className="reference-heading">
          <div>
            <span className="work-eyebrow">SELECTED WORK</span>
            <h2>
              브랜드의 이야기를
              <br />
              이렇게 만들었습니다
            </h2>
            <p>영상과 웹툰부터 웹사이트와 쇼핑몰까지, 실제 작업을 살펴보세요</p>
          </div>
          {allHref && (
            <Link href={allHref} className="reference-all">
              레퍼런스 전체 보기 <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
        {!fixedDivision && (
          <div
            className="reference-filters"
            role="group"
            aria-label="레퍼런스 분야"
          >
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                aria-pressed={category === group.id}
                onClick={() => setCategory(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}
        <div className="work-grid" aria-live="polite">
          {items.map((work) => (
            <WorkCard key={work.id} work={work} heading="h3" />
          ))}
        </div>
        {!items.length && <p>이 분야의 작업은 준비 중입니다</p>}
      </div>
    </section>
  );
}
