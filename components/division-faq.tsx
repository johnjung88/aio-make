import { JsonLd } from "@/components/ui";
import { faqSchema } from "@/lib/seo";
import styles from "./division-faq.module.css";

const questions: Record<string, [string, string][]> = {
  content: [
    [
      "어떤 컨텐츠를 제작하나요?",
      "웹툰·애니메이션·AI 인플루언서·모션그래픽·브랜드 홍보 영상·SNS 광고 영상을 기획하고 제작합니다",
    ],
    [
      "제작 비용과 규격은 어디서 확인하나요?",
      "서비스별 상세 페이지에서 규격과 공개 가격을 확인할 수 있습니다 길이와 화면 비율, 편수, 수정 범위와 사용할 소재의 권리를 먼저 합의합니다",
    ],
    [
      "어떤 자료를 준비하면 되나요?",
      "로고, 제품 이미지, 참고 컨텐츠와 꼭 넣어야 할 문구가 있으면 함께 준비합니다",
    ],
  ],
  lab: [
    [
      "어떤 개발을 맡길 수 있나요?",
      "웹사이트·쇼핑몰·업무 자동화·프로그램 개발을 맡길 수 있습니다 가상 브랜드 샘플에서 화면과 이용 흐름을 먼저 확인할 수 있습니다",
    ],
    [
      "개발 견적은 어떻게 정해지나요?",
      "기능, 외부 서비스 연결, 데이터 처리와 접근 권한이 작업 범위를 결정합니다 가격과 납기, 납품 후 지원 범위는 요구사항을 확인한 뒤 견적에서 정합니다",
    ],
    [
      "상담 전에 무엇을 준비하나요?",
      "현재 반복하는 업무와 불편한 점을 알려주세요 웹사이트라면 필요한 페이지, 자동화라면 입력 자료와 최종 결과물을 함께 확인합니다",
    ],
  ],
};
export function DivisionFaq({ division }: { division: "content" | "lab" }) {
  const items = questions[division];
  return (
    <section
      className={styles.section}
      id="faq"
      aria-labelledby="division-faq-title"
    >
      <h2 id="division-faq-title">의뢰 전에 자주 묻는 질문</h2>
      {items.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}
