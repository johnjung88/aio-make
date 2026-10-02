"use client";

import { useEffect, useRef } from "react";
import { GuideNav, ServiceTabs } from "./primitives";

export function ServiceNavigation({ division }: { division: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        "--service-nav-height",
        `${element.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    measure();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--service-nav-height");
    };
  }, []);
  return (
    <div ref={ref} className="service-navigation">
      <GuideNav division={division} active="services" />
      <div className="service-navigation-rail">
        <ServiceTabs division={division} />
      </div>
    </div>
  );
}
