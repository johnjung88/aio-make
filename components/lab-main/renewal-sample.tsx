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
    <div className={styles.sampleGate} data-sample={service}>
      {service === "automation" ? (
        <div
          className={styles.leadPreview}
          aria-label="영업 리드 처리 흐름 예시"
        >
          <p className={styles.eyebrow}>LEAD WORKFLOW</p>
          <h3>수집에서 후속 관리까지</h3>
          <ol>
            {[
              ["입력 자료", "CSV에서 고객 정보를 확인"],
              ["중복 대조", "고객 원장과 같은 기록을 찾기"],
              ["조건 선별", "기준에 맞는 고객과 판단 이유 확인"],
              ["컨택 초안", "검토할 연락 내용을 준비"],
              ["후속 관리", "고객별 기록과 다음 일정 정리"],
            ].map(([title, body], i) => (
              <li key={title}>
                <span>0{i + 1}</span>
                <strong>{title}</strong>
                <p>{body}</p>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <Image
          src={
            service === "website"
              ? "/lab-renewal/nest-close.webp"
              : service === "shopping-mall"
                ? "/lab-samples/forme-editorial.png"
                : "/lab/sample-automation.webp"
          }
          alt="작동 샘플 정지 화면"
          width={1200}
          height={700}
          loading="lazy"
        />
      )}
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
