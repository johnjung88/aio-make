"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from "./renewal.module.css";
const Experience = dynamic(
  () => import("./service-experience").then((m) => m.ServiceExperience),
  { loading: () => <p>작동 샘플을 준비하고 있습니다</p> },
);
export function LazySample({ service }: { service: string }) {
  const [open, setOpen] = useState(false);
  const sample = service as "website" | "shopping-mall" | "automation";
  return open ? (
    <div>
      <button className={styles.smallButton} onClick={() => setOpen(false)}>
        샘플 닫기
      </button>
      <Experience service={service} sample={sample} />
    </div>
  ) : (
    <div className={styles.sampleGate}>
      <Image
        src={
          service === "website"
            ? "/lab-renewal/nest-preview.webp"
            : service === "shopping-mall"
              ? "/lab-samples/forme-editorial.png"
              : "/lab/sample-automation.webp"
        }
        alt="작동 샘플 정지 화면"
        width={1200}
        height={700}
        loading="lazy"
      />
      <button className={styles.button} onClick={() => setOpen(true)}>
        샘플 열기 ↗
      </button>
      <p className={styles.note}>
        {service === "website"
          ? "가상 시안 · 실제 문의 전송 없음"
          : service === "shopping-mall"
            ? "가상 상품 · 실제 주문·결제 없음"
            : "가상 데이터 · 실제 외부 발송·저장 없음"}
      </p>
    </div>
  );
}
