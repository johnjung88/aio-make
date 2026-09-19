export const metadata = { title: "개인정보 수집 안내" };
export default function Page() {
  return (
    <section className="m-section m-prose">
      <h1>상담 개인정보 수집 안내</h1>
      <p style={{ whiteSpace: "pre-wrap" }}>
        {process.env.MARKETING_CONSENT_NOTICE ||
          "상담 개인정보 수집 안내를 준비하고 있습니다."}
      </p>
      <p>안내 버전: {process.env.MARKETING_CONSENT_VERSION || "준비 중"}</p>
      <p>
        상담 신청 전 수집 항목·이용 목적·보유기간을 확인해 주세요. 실제 접수에
        적용되는 안내문은 상담 폼에 함께 표시됩니다.
      </p>
      <p>
        필수 수집 항목: 업체명, 담당자명, 이메일, 전화번호, 업종, 지역, 상담
        내용. 선택 입력 항목: 운영 채널·홈페이지, 목표, 예산, 희망 시작 시점,
        참고 링크. 문의와 함께 유입 콘텐츠·UTM·진입 페이지·참조 사례를
        기록합니다.
      </p>
      <p>
        이용 목적: 상담 내용 확인, 답변 및 후속 상담 관리. 동의를 거부할 수
        있으나 필수 정보 수집에 동의하지 않으면 온라인 상담 신청이 제한됩니다.
      </p>
    </section>
  );
}
