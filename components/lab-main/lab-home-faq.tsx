import { SectionHead } from "./service-detail";
import { JsonLd } from "@/components/ui";
import { faqSchema } from "@/lib/seo";
import styles from "./renewal.module.css";
const items: [string, string][] = [
  [
    "어떤 개발을 맡길 수 있나요?",
    "웹사이트·쇼핑몰·업무 자동화·프로그램 개발을 맡길 수 있습니다\n가상 브랜드 샘플에서 화면과 이용 흐름을 먼저 확인할 수 있습니다",
  ],
  [
    "개발 견적은 어떻게 정해지나요?",
    "기능, 외부 서비스 연결, 데이터 처리와 접근 권한이 작업 범위를 결정합니다\n가격과 납기, 납품 후 지원 범위는 요구사항을 확인한 뒤 견적에서 정합니다",
  ],
  [
    "상담 전에 무엇을 준비하나요?",
    "현재 반복하는 업무와 불편한 점을 알려주세요\n웹사이트라면 필요한 페이지, 자동화라면 입력 자료와 최종 결과물을 함께 확인합니다",
  ],
];
export function LabHomeFaq() {
  return (
    <section
      className={styles.section}
      id="faq"
      aria-labelledby="home-faq-title"
    >
      <SectionHead
        id="home-faq-title"
        eyebrow="FAQ"
        title="의뢰 전에 자주 묻는 질문"
      />
      <div className={styles.faq}>
        {items.map(([q, a]) => (
          <details key={q}>
            <summary>
              <h3>{q}</h3>
            </summary>
            <p style={{ whiteSpace: "pre-line" }}>{a}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
