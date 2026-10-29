import { Eyebrow } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import styles from "./privacy.module.css";

// Update these three entries when the final publication wording is approved.
const PRIVACY_EFFECTIVE_DATE = "2026년 10월 28일";
const PRIVACY_OFFICER = "대표";
const PRIVACY_PROCESSORS = [
  [
    "Vercel Inc.",
    "미국",
    "문의 정보, 방문 경로 정보, 접속 기록",
    "웹사이트 운영",
    "vercel.com/legal/privacy-policy",
  ],
  [
    "Neon",
    "싱가포르",
    "문의 정보, 방문 경로 정보, 상담 기록",
    "문의·상담 내역 저장",
    "neon.com/privacy-policy",
  ],
  [
    "Resend, Inc.",
    "미국",
    "성함, 연락처, 요청 내용",
    "문의 알림 이메일 발송",
    "resend.com/legal/privacy-policy",
  ],
  [
    "Google LLC",
    "미국",
    "문의 알림 이메일, 5의 방문·클릭 기록",
    "이메일 수신(Gmail), 방문 통계, 광고 성과 측정",
    "policies.google.com/privacy",
  ],
  [
    "Meta Platforms, Inc.",
    "미국",
    "5의 방문·클릭 기록, 문의 완료 여부, IP 주소, 브라우저 종류, 메타 쿠키값",
    "광고 성과 측정, 맞춤형 광고",
    "facebook.com/privacy/policy",
  ],
];

export const metadata = pageMetadata(
  "개인정보처리방침",
  "AIO MAKE 프로젝트 문의의 개인정보 수집과 이용 안내",
  "/privacy",
);

function PrivacyTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((text) => (
            <th scope="col" key={text}>
              {text}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row[0]}>
            {row.map((text, index) => (
              <td key={index}>{text}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Privacy() {
  return (
    <div className="guide-page guide-utility">
      <div className="container page-intro">
        <Eyebrow>PRIVACY</Eyebrow>
        <h1>개인정보처리방침</h1>
        <p>시행일: {PRIVACY_EFFECTIVE_DATE} · 문의: aiomake2023@gmail.com</p>
      </div>
      <article className={"container prose " + styles.policy}>
        <h2>1 수집하는 항목과 목적</h2>
        <p>
          {
            "에이아이오(AIO)는 프로젝트 문의의 접수, 요청 범위 확인과 상담 응대를 위해 성함, 이메일 또는 전화번호, 요청 내용을 수집합니다\n회사·브랜드명은 선택 항목입니다"
          }
        </p>
        <p>
          {
            "문의를 보낼 때 방문 경로 정보를 함께 수집합니다\n방문 경로 정보는 처음과 이번에 들어온 경로(유입 채널·캠페인 이름 같은 링크 꼬리표), 광고 클릭 번호, 방문한 페이지와 문의를 보낸 페이지, 문의 폼에서 고른 사용 목적과 알게 된 경로입니다\n이 정보는 문의 응대와 어떤 컨텐츠·채널이 문의로 이어졌는지 분석하는 데 사용합니다"
          }
        </p>
        <h2>2 보유 기간과 파기</h2>
        <PrivacyTable
          headers={["정보", "보관 기간"]}
          rows={[
            [
              "문의 정보·방문 경로 정보·상담 기록",
              "상담 종료 후 1년, 계약이 체결되면 계약 및 관계 법령에 필요한 기간",
            ],
            ["사이트 자체 쿠키(5의 표)", "저장일로부터 90일 뒤 자동 만료"],
            ["Google 애널리틱스 방문 통계", "14개월"],
            [
              "광고 사업자(Google·Meta·카카오·네이버)가 받은 정보",
              "각 사업자 정책에 따름",
            ],
          ]}
        />
        <p>
          {
            "기간이 지난 정보는 데이터베이스와 관리 자료에서 복구할 수 없게 삭제합니다\n보관 중인 개인정보의 열람, 정정, 삭제, 처리 정지 또는 동의 철회는 6의 창구로 요청할 수 있으며 10일 안에 처리합니다"
          }
        </p>
        <h2>3 동의 거부</h2>
        <p>
          {
            "개인정보 수집·이용에 동의하지 않을 수 있습니다\n문의에 응대할 연락처와 요청 내용이 없으면 문의 접수와 상담이 제한됩니다\n5의 방문·클릭 기록 수집을 거부해도 문의할 수 있습니다"
          }
        </p>
        <h2>4 처리 위탁과 국외 이전</h2>
        <p>
          {
            "문의 정보는 관리 권한이 있는 담당자만 인증된 관리자 화면에서 확인합니다\n사이트는 인증, 접근 제한과 암호화 통신을 사용합니다\n기존 관리용 PC의 상담 자료와 백업은 별도로 보관합니다\n개인정보를 고객 사례로 공개하려면 별도의 공개 확인을 진행합니다"
          }
        </p>
        <p>
          {
            "서비스 운영을 위해 아래 업체에 처리를 맡기거나 정보를 보내며, 이 과정에서 개인정보가 국외로 이전됩니다\n이전은 사이트를 방문하거나 문의를 보낼 때 즉시 암호화 통신으로 이루어집니다\n보관 기간은 2의 표와 같습니다\nGoogle·Meta는 받은 정보를 각자의 정책에 따라 광고·통계에 처리합니다"
          }
        </p>
        <PrivacyTable
          headers={[
            "이전받는 자",
            "국가",
            "이전 항목",
            "목적",
            "개인정보 연락처",
          ]}
          rows={PRIVACY_PROCESSORS}
        />
        <p>
          {
            "국외 이전을 원하지 않으면 거부할 수 있습니다\n이 경우 사이트 문의 폼은 이용할 수 없고, 5의 방법으로 광고 사업자 전송을 막거나 6의 창구로 연락해 다른 방법을 정할 수 있습니다"
          }
        </p>
        <h2>5 방문·클릭 기록(행태정보)의 수집·이용과 거부</h2>
        <p>
          {
            "사이트는 방문 통계와 광고 성과 측정, 맞춤형 광고를 위해 쿠키·스크립트로 방문·클릭 기록을 수집합니다\n이 기록에 성함, 이메일, 전화번호, 문의 내용은 넣지 않으며 이름 등과 결합해 개인을 알아보는 데 쓰지 않습니다\n14세 미만을 대상으로 한 맞춤형 광고와 민감정보 이용은 하지 않습니다\n관리자 화면과 개발 환경의 방문은 수집하지 않습니다"
          }
        </p>
        <p>
          {
            "1. 수집 항목: 방문한 페이지, 서비스·컨텐츠 조회, 버튼 클릭, 문의 완료 여부, 링크 꼬리표와 광고 클릭 번호, 브라우저·기기 정보"
          }
        </p>
        <p>
          {
            "2. 수집 방법: 사이트 방문 시 쿠키·스크립트(Google 태그 관리자로 설치)로 자동 수집 문의 완료는 브라우저와 함께 우리 서버에서도 Meta로 보내며, 서버 전송에는 IP 주소, 브라우저 종류, 메타 쿠키값이 들어갑니다\n브라우저에 메타 쿠키가 없으면 서버 전송도 하지 않습니다"
          }
        </p>
        <p>3. 목적: 이용 통계 분석, 서비스 개선, 광고 성과 측정, 맞춤형 광고</p>
        <p>4. 보관 기간: 2의 표</p>
        <p>5. 사이트 자체 쿠키</p>
        <PrivacyTable
          headers={["이름", "내용", "기간"]}
          rows={[
            [
              "aio_first_touch",
              "처음 들어온 경로(링크 꼬리표·첫 페이지·날짜)",
              "90일",
            ],
            [
              "광고 클릭 번호 쿠키",
              "최근 광고 클릭 번호(Google·Meta·네이버)",
              "90일",
            ],
          ]}
        />
        <p>6. 방문·클릭 기록을 처리하는 사업자</p>
        <PrivacyTable
          headers={["사업자", "도구"]}
          rows={[
            ["Google LLC", "Google 애널리틱스, Google 태그 관리자, Google Ads"],
            ["Meta Platforms, Inc.", "메타 광고(픽셀·전환 API)"],
            ["(주)카카오", "카카오 픽셀"],
            ["네이버(주)", "네이버 프리미엄 로그분석·전환추적(도입 시 적용)"],
          ]}
        />
        <p>7. 거부 방법</p>
        <ul>
          <li>브라우저 설정에서 쿠키 저장을 거부할 수 있습니다</li>
          <li>
            맞춤형 광고는 각 사업자 설정에서 끌 수 있습니다: Google 광고
            설정(adssettings.google.com), Meta 광고 기본
            설정(accountscenter.meta.com), 카카오 맞춤형 광고 설정, 네이버
            맞춤형 광고 설정
          </li>
          <li>
            휴대폰은 기기 설정에서 광고 ID를 재설정하거나 맞춤형 광고를 끌 수
            있습니다
          </li>
        </ul>
        <h2>6 개인정보 보호책임자와 권리 행사</h2>
        <ul>
          <li>
            개인정보 보호책임자·열람 청구 접수: {PRIVACY_OFFICER} ·
            aiomake2023@gmail.com
          </li>
          <li>
            개인정보 침해 신고·상담: 개인정보침해신고센터(privacy.kisa.or.kr,
            국번 없이 118), 개인정보 분쟁조정위원회(kopico.go.kr, 1833-6972),
            대검찰청(spo.go.kr, 국번 없이 1301), 경찰청(ecrm.police.go.kr, 국번
            없이 182)
          </li>
        </ul>
        <h2>7 방침 변경</h2>
        <p>
          {
            "방침을 바꾸면 이 페이지에 시행일과 바뀐 내용을 알립니다\n이용자에게 불리한 변경은 시행 7일 전부터 알립니다\n이전 방침은 6의 창구로 요청하면 보내 드립니다"
          }
        </p>
        <ul>
          <li>
            {PRIVACY_EFFECTIVE_DATE} 방문 경로 정보 구체화, 처리 위탁·국외 이전,
            방문·클릭 기록 수집 사업자 추가(태그 설치와 같은 날 시행)
          </li>
          <li>2026년 10월 2일 최초 시행</li>
        </ul>
      </article>
    </div>
  );
}
