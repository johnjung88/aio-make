import { notFound } from "next/navigation";
import { ContactForm } from "@/components/contact-form";
import { Eyebrow } from "@/components/ui";
import { divisionByPath, serviceById } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>;
}) {
  const d = divisionByPath((await params).division);
  return d
    ? pageMetadata(d.label + " 문의", d.summary, "/" + d.path + "/contact")
    : {};
}
export default async function Contact({
  params,
  searchParams,
}: {
  params: Promise<{ division: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const d = divisionByPath((await params).division);
  if (!d) notFound();
  const s = (await searchParams).service,
    service = s && serviceById(d.id, s);
  return (
    <>
      <div className="container page-intro">
        <Eyebrow>AIO MAKE / {d.brand}</Eyebrow>
        <h1>
          {d.label},<br />
          어떤 일이 필요한가요?
        </h1>
        <p>목표와 준비된 자료, 희망 일정을 알려주세요.</p>
      </div>
      <div className="container contact-layout">
        <aside className="contact-notes">
          <h3>
            범위를 확인한 뒤<br />
            견적을 안내합니다.
          </h3>
          <ul>
            <li>분야별 서비스 또는 여러 분야의 협업을 요청할 수 있습니다.</li>
            <li>사용 목적과 필요한 결과물을 알려주세요.</li>
            <li>확정되지 않은 내용은 문의 때 함께 정리합니다.</li>
          </ul>
          <a href="mailto:aiomake2023@gmail.com">aiomake2023@gmail.com</a>
        </aside>
        <ContactForm
          initialDivision={d.id}
          initialService={service ? service.id : undefined}
        />
      </div>
    </>
  );
}
