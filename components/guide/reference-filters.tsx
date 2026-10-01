"use client";
import { Children, useState } from "react";
import { divisionServices, type DivisionId } from "@/lib/content";
export function ReferenceFilters({
  division,
  services,
  children,
}: {
  division: DivisionId;
  services: string[];
  children: React.ReactNode;
}) {
  const [active, setActive] = useState("");
  const cards = Children.toArray(children);
  const count = services.filter(
    (service) => !active || active === service,
  ).length;
  return (
    <>
      <div className="guide-work-filters">
        <div role="group" aria-label="작업 종류">
          <button
            type="button"
            aria-pressed={!active}
            onClick={() => setActive("")}
          >
            전체
          </button>
          {divisionServices(division).map((service) => (
            <button
              key={service.id}
              type="button"
              aria-pressed={active === service.id}
              onClick={() => setActive(service.id)}
            >
              {service.name}
            </button>
          ))}
        </div>
        <span>{count}개 작업</span>
      </div>
      <div className="guide-work-grid">
        {cards.filter((_, index) => !active || services[index] === active)}
      </div>
    </>
  );
}
