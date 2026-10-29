import { JsonLd } from "@/components/ui";
import { breadcrumbSchema, organizationSchema } from "@/lib/seo";
import { siteUrl } from "@/lib/metadata";
import { LabMain } from "@/components/lab-main/lab-main";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "생각한 기능이 작동하는 화면으로 | AIO 랩",
  "웹사이트·쇼핑몰·자동화를 직접 체험하세요\n가상 브랜드의 공간 탐색과 상품 선택, 업무 처리 흐름을 확인하고 필요한 구성으로 상담하세요",
  "/lab",
);

export default function LabPage() {
  return (
    <>
      <LabMain />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: "개발",
          url: siteUrl + "/lab",
          provider: { "@id": organizationSchema["@id"] },
          serviceType: "웹사이트·쇼핑몰·업무 자동화·프로그램 개발",
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "AIO MAKE", path: "/" },
          { name: "개발", path: "/lab" },
        ])}
      />
    </>
  );
}
