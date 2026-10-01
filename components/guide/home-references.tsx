"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mergeGuideEntries } from "@/lib/guide-content";
import { divisions, services } from "@/lib/content";
import type { Entry } from "@/lib/db";

const groups = [
  { id: "all", label: "전체" },
  { id: "video", label: "영상" },
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
        <div className="reference-heading">
          <div>
            <span className="review-eyebrow">결과물 살펴보기</span>
            <h2>
              {fixedDivision
                ? "작업 방향을 예시로 살펴보세요"
                : "필요한 작업을 먼저 살펴보세요"}
            </h2>
            <p>
              {fixedDivision
                ? "원하는 분위기와 구성을 찾고, 상담할 때 함께 알려주세요."
                : "영상의 분위기부터 운영 방식과 개발 기능까지, 원하는 방향을 찾아보세요."}
            </p>
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
                  {item.kind === "example" &&
                  item.division === "marketing" &&
                  ["integrated", "sns", "seo"].includes(item.service) ? (
                    <div
                      className={`reference-preview preview-${item.service}`}
                      aria-hidden="true"
                    >
                      <small>
                        {item.service === "sns"
                          ? "월간 콘텐츠 계획"
                          : item.service === "seo"
                            ? "질문에서 문의까지"
                            : "콘텐츠 운영의 흐름"}
                      </small>
                      <div>
                        {(item.service === "sns"
                          ? [
                              ["01", "제품 소개"],
                              ["02", "사용 장면"],
                              ["03", "고객 질문"],
                            ]
                          : item.service === "seo"
                            ? [
                                ["검색", "고객의 질문"],
                                ["페이지", "구체적인 답변"],
                                ["문의", "다음 행동"],
                              ]
                            : [
                                ["기획", "고객 질문 정리"],
                                ["제작", "채널별 콘텐츠"],
                                ["운영", "게시와 개선"],
                              ]
                        ).map(([tag, label]) => (
                          <span key={tag}>
                            <b>{tag}</b>
                            <strong>{label}</strong>
                            <i />
                            <i />
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={item.cover_url}
                      alt=""
                      fill
                      sizes="(max-width: 620px) 90vw, (max-width: 1000px) 44vw, 30vw"
                      style={
                        item.division === "development"
                          ? { objectPosition: "top" }
                          : undefined
                      }
                    />
                  )}
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
        <p className="reference-disclosure">
          ‘제작 예시’는 작업 방향을 설명하기 위한 이미지와 구성입니다. 공개가
          확인된 고객 작업은 ‘작업 사례’로 표시합니다.
        </p>
      </div>
    </section>
  );
}
