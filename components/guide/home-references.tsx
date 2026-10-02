"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mergeGuideEntries } from "@/lib/guide-content";
import { divisions, services } from "@/lib/content";
import type { Entry } from "@/lib/db";

const groups = [
  { id: "all", label: "전체" },
  { id: "video", label: "컨텐츠" },
  { id: "marketing", label: "마케팅" },
  { id: "development", label: "개발" },
];

export function HomeReferences({
  entries = [],
  division: fixedDivision,
}: {
  entries?: Entry[];
  division?: "marketing" | "development";
}) {
  const [selected, setCategory] = useState("all");
  const category = fixedDivision ?? selected;
  const allHref = fixedDivision
    ? `/${fixedDivision === "development" ? "lab" : fixedDivision}/work`
    : "/work";
  const available = mergeGuideEntries(entries, "reference");
  const items =
    category === "all"
      ? groups
          .slice(1)
          .flatMap((group) =>
            available.filter((item) => item.division === group.id).slice(0, 2),
          )
      : available
          .filter((item) => item.division === category)
          .slice(0, fixedDivision ? 3 : 6);
  return (
    <section id="work" className="home-references">
      <div className="review-container">
        <div
          className={`reference-heading ${fixedDivision ? "" : "reference-heading-centered"}`}
        >
          <div>
            <span className="review-eyebrow">결과물 살펴보기</span>
            <h2>
              {fixedDivision
                ? "작업 방향을 예시로 살펴보세요"
                : "필요한 작업을 먼저 살펴보세요"}
            </h2>
            {fixedDivision && (
              <p>원하는 분위기와 구성을 찾고, 상담할 때 함께 알려주세요</p>
            )}
          </div>
          <Link href={allHref} className="reference-all">
            작업 전체 보기 <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {!fixedDivision && (
          <>
            <div
              className="reference-filters"
              role="group"
              aria-label="제작 예시 분야"
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
          </>
        )}
        <div className="reference-grid" aria-live="polite">
          {items.map((item) => {
            const division = divisions.find(
              (division) => division.id === item.division,
            );
            const service = services.find(
              (service) =>
                service.id === item.service &&
                service.division === item.division,
            );
            const prefix =
              item.division === "development" ? "lab" : item.division;
            return (
              <Link
                key={item.id}
                href={`/${prefix}/work/${item.slug}`}
                className="reference-card"
              >
                <div className="reference-image">
                  <Image
                    src={item.cover_url}
                    alt=""
                    fill
                    sizes="(max-width: 620px) 90vw, (max-width: 1000px) 44vw, 30vw"
                  />
                  <span>
                    {item.kind === "example" ? "제작 예시" : "작업 사례"}
                  </span>
                </div>
                <div className="reference-meta">
                  <span>
                    {division?.label ||
                      groups.find((g) => g.id === item.division)?.label}
                  </span>
                  <span aria-hidden="true">↗</span>
                </div>
                <h3>
                  {item.kind === "example"
                    ? service?.name || item.title
                    : item.title}
                </h3>
                <p>{item.summary}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
