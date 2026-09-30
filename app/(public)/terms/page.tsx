import { Eyebrow } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "이용 안내",
  "프로젝트 문의, 견적, 제작과 검수에 관한 AIO MAKE 이용 안내.",
  "/terms",
);
export default function Terms() {
  return (
    <>
      <div className="container page-intro">
        <Eyebrow>TERMS</Eyebrow>
        <h1>이용 안내</h1>
        <p>서비스 진행의 기본 사항을 확인해주세요.</p>
      </div>
      <article className="container prose">
        <h2>문의와 견적</h2>
        <p>
          사이트의 서비스 설명은 제공 가능한 작업의 안내입니다. 문의만으로
          계약이 체결되지 않으며, 작업 범위, 수량, 기능, 수정 횟수, 견적과
          일정은 별도 합의합니다.
        </p>
        <h2>자료와 권리</h2>
        <p>
          제작에 제공하는 이미지, 영상, 캐릭터, 음원, 상표와 기타 자료는 사용
          가능한 권리를 확인해주세요. AI 생성물의 사용 범위와 검수 조건도
          프로젝트별로 확인합니다. 결과물의 저작권, 라이선스와 원본 파일 제공
          범위는 계약에서 정합니다.
        </p>
        <h2>진행과 검수</h2>
        <p>
          자료 전달, 검토와 승인 시점에 따라 일정이 달라질 수 있습니다. 합의한
          범위를 벗어나는 추가 작업과 수정은 별도로 협의합니다. 운영 지원과 외부
          서비스 비용은 견적에서 구분합니다.
        </p>
        <h2>레퍼런스 공개</h2>
        <p>
          실제 고객 사례는 공개 가능한 권리와 내용이 확인된 경우에만 게시합니다.
          제작 예시는 해당 표시를 사용합니다. 공개 예시는 특정 성과를 보장하지
          않습니다.
        </p>
        <h2>사이트 이용</h2>
        <p>
          문의 양식을 통한 스팸, 타인의 개인정보 무단 제출과 부정 이용은 제한될
          수 있습니다. 서비스 관련 문의는 aiomake2023@gmail.com으로 보내주세요.
        </p>
      </article>
    </>
  );
}
