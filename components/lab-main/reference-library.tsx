"use client";
import Image from "next/image";
import { useState } from "react";
import { labReferences } from "@/lib/lab-resources";
import styles from "./resources.module.css";

const categories = [
  "전체",
  ...new Set(labReferences.map((sample) => sample.category)),
];
export function LabReferenceLibrary() {
  const [category, setCategory] = useState("전체");
  const samples = labReferences.filter(
    (sample) => category === "전체" || sample.category === category,
  );
  return (
    <main className={`cs-site ${styles.page}`}>
      <section className="cs-container cs-article">
        <header className="cs-article-header">
          <p className="cs-t-eyebrow">REFERENCES</p>
          <h1 className="cs-t-display">업종에 맞는 화면을 찾아보세요</h1>
          <p className="cs-t-lead">
            직접 둘러보는 12개의 웹사이트 샘플
            <br />
            모두 포트폴리오용 가상 브랜드입니다
          </p>
        </header>
        <div className={styles.filters} role="group" aria-label="샘플 업종">
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <p className={styles.count} role="status">
          {category} · {samples.length}개 샘플
        </p>
        <div className={styles.grid}>
          {samples.map((sample) => (
            <article className={styles.card} key={sample.id}>
              <a
                href={sample.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${sample.name} 샘플 새 탭에서 보기`}
              >
                <div className={styles.media}>
                  <Image
                    src={`/lab-references/${sample.id}.webp`}
                    alt={`${sample.name} ${sample.industry} 웹사이트 화면`}
                    width={1200}
                    height={800}
                    sizes="(max-width: 600px) 90vw, (max-width: 1023px) 45vw, 30vw"
                  />
                </div>
              </a>
              <small>{sample.industry}</small>
              <h2 className="cs-t-h3">{sample.name}</h2>
              <p className="cs-t-body">{sample.summary}</p>
              <small>
                포트폴리오용 가상 브랜드{sample.note ? ` · ${sample.note}` : ""}
              </small>
              <a
                className={styles.visit}
                href={sample.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                운영 샘플 보기 ↗<span className="sr-only"> 새 탭</span>
              </a>
            </article>
          ))}
        </div>
        <p className={styles.count} style={{ marginTop: 48 }}>
          샘플의 문의·주문·예약은 시연용이며 실제로 접수되지 않습니다
        </p>
      </section>
    </main>
  );
}
