import { ContactForm } from "@/components/contact-form";
import { Eyebrow } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "프로젝트 문의",
  "목표와 필요한 작업을 알려주세요. 범위를 확인한 뒤 견적과 일정을 안내합니다.",
  "/contact",
);
export default function Contact() {
  return (
    <div className="guide-page guide-utility">
      <div className="container page-intro">
        <Eyebrow>LET’S MAKE YOUR NEXT</Eyebrow>
        <h1>
          당신의 다음 일을
          <br />
          들려주세요.
        </h1>
        <p>마케팅, 개발, 영상 중 필요한 분야부터 시작합니다.</p>
      </div>
      <div className="container contact-layout">
        <aside className="contact-notes">
          <h3>
            정리되지 않은 아이디어도
            <br />
            괜찮습니다.
          </h3>
          <ul>
            <li>요청 내용과 현재 상황을 먼저 확인합니다.</li>
            <li>진행 범위, 결과물, 견적과 납기를 합의합니다.</li>
            <li>공개 가능한 원본과 참고 자료를 준비해주세요.</li>
          </ul>
          <p>
            이메일 문의
            <br />
            <a href="mailto:aiomake2023@gmail.com">aiomake2023@gmail.com</a>
          </p>
        </aside>
        <ContactForm />
      </div>
    </div>
  );
}
