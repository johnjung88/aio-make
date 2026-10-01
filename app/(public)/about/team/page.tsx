import TeamGuide from "@/components/guide/team";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "팀과 작업 역할",
  "마케팅·개발·영상의 기획, 제작, 검수 역할을 소개합니다.",
  "/about/team",
);
export default function TeamPage() {
  return <TeamGuide />;
}
