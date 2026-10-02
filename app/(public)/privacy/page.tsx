import { Eyebrow } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "개인정보처리방침",
  "AIO MAKE 프로젝트 문의의 개인정보 수집과 이용 안내",
  "/privacy",
);
export default function Privacy() {
  return (
    <div className="guide-page guide-utility">
      <div className="container page-intro">
        <Eyebrow>PRIVACY</Eyebrow>
        <h1>개인정보처리방침</h1>
        <p>시행일: 2026년 10월 2일 · 문의: aiomake2023@gmail.com</p>
      </div>
      <article className="container prose">
        <h2>1. 수집하는 항목과 목적</h2>
        <p>
          에이아이오(AIO)는 프로젝트 문의의 접수, 요청 범위 확인과 상담 응대를
          위해 성함, 이메일 또는 전화번호, 요청 내용을 수집합니다
          회사·브랜드명은 선택 항목입니다 문의 유입 경로와 서비스 구분 정보는
          문의 운영과 경로 분석에 사용합니다
        </p>
        <h2>2. 보유 기간과 삭제</h2>
        <p>
          상담이 종료된 문의 정보는 종료 후 1년까지 보관한 뒤 삭제합니다 계약이
          체결된 경우에는 계약 및 관계 법령에 필요한 기간을 적용합니다 보관 중인
          개인정보의 열람, 정정, 삭제 또는 동의 철회는 위 이메일로 요청할 수
          있습니다
        </p>
        <h2>3. 동의 거부</h2>
        <p>
          개인정보 수집·이용에 동의하지 않을 수 있습니다 문의에 응대할 연락처와
          요청 내용이 없으면 문의 접수와 상담이 제한됩니다
        </p>
        <h2>4. 처리와 보호</h2>
        <p>
          문의 정보는 관리 권한이 있는 담당자만 확인합니다 사이트는 인증, 접근
          제한과 암호화 통신을 사용합니다 웹사이트는 Vercel에서 운영하며, 문의와
          상담 내역은 Neon의 싱가포르 리전 데이터베이스에 저장합니다 담당자는
          인증된 관리자 화면에서 조회합니다 문의 이메일 알림은 Resend를 통해
          담당자의 Google Gmail로 전달합니다 기존 관리용 PC의 상담 자료와 백업은
          별도로 보관합니다 개인정보를 고객 사례로 공개하려면 별도의 공개 확인을
          진행합니다
        </p>
        <h2>5. 방문 통계와 쿠키</h2>
        <p>
          사이트의 방문과 문의 경로를 이해하기 위해 Google Analytics를
          사용합니다 통계 이벤트에 성함, 이메일, 전화번호, 문의 내용은 전송하지
          않습니다 브라우저 설정을 통해 쿠키 저장을 제한할 수 있습니다 관리자
          화면과 개발 환경의 방문은 공개 사이트의 통계 이벤트에서 제외합니다
        </p>
        <h2>6. 연락 창구</h2>
        <p>개인정보 관련 문의: 에이아이오(AIO) · aiomake2023@gmail.com</p>
      </article>
    </div>
  );
}
