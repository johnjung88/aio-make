import { EntryList } from "@/components/entries";
import { divisionByPath } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
export const dynamic = "force-dynamic";
export async function generateMetadata() {
  const d = divisionByPath("marketing");
  return d
    ? pageMetadata(
        d.label + " 인사이트",
        `${d.label} 프로젝트를 준비하는 방법과 의뢰 전 확인할 자료를 AIO MAKE 가이드에서 살펴보세요`,
        "/" + d.path + "/insights",
      )
    : {};
}
export default function Page() {
  return <EntryList division="marketing" type="insight" />;
}
