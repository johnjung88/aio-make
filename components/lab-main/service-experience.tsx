"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SampleDialog } from "@/components/lab-samples/dialog";
import { labContactPath } from "@/lib/lab-services";
import sampleStyles from "@/components/lab-samples/samples.module.css";
import styles from "./service-detail.module.css";

const loading = () => (
  <p className={styles.loading}>작동 샘플을 준비하고 있습니다</p>
);
const Architecture = dynamic(
  () =>
    import("@/components/lab-samples/architecture").then(
      (m) => m.ArchitectureSample,
    ),
  { loading },
);
const Fashion = dynamic(
  () => import("@/components/lab-samples/fashion").then((m) => m.FashionSample),
  { loading },
);
const Leads = dynamic(
  () => import("@/components/lab-samples/leads").then((m) => m.LeadsSample),
  { loading },
);

export function ServiceExperience({
  service,
  sample,
}: {
  service: string;
  sample: "website" | "shopping-mall" | "automation";
}) {
  const [summary, setSummary] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const [active, setActive] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    if (host.current) observer.observe(host.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div ref={host} className={`${sampleStyles.shell} ${styles.choiceSamples}`}>
      {sample === "website" ? (
        <Architecture active={active} onConsult={setSummary} />
      ) : sample === "shopping-mall" ? (
        <Fashion onConsult={setSummary} />
      ) : (
        <Leads active={active} onConsult={setSummary} />
      )}
      <SampleDialog
        open={Boolean(summary)}
        title="선택한 구성으로 상담 준비"
        onClose={() => setSummary("")}
      >
        <div className={styles.summary}>
          <label htmlFor="lab-service-summary">
            상담에 남길 내용 · 자유롭게 수정하세요
          </label>
          <textarea
            id="lab-service-summary"
            rows={8}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
          <button
            className={styles.button}
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setCopyStatus(
                  "선택 내용을 복사했습니다\n문의 내용에 붙여넣어주세요",
                );
              } catch {
                setCopyStatus("위 내용을 직접 선택해 복사해주세요");
              }
            }}
          >
            선택 내용 복사
          </button>
          <p role="status">{copyStatus}</p>
          <Link
            className={styles.button}
            href={labContactPath(service, summary)}
          >
            기존 문의로 이동 ↗
          </Link>
        </div>
      </SampleDialog>
    </div>
  );
}
