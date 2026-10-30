import { PageBreadcrumb } from "@/components/page-breadcrumb";
import { LabReferenceLibrary } from "@/components/lab-main/reference-library";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "개발 레퍼런스",
  "업종별 웹사이트 샘플 12개를 직접 둘러보세요",
  "/lab/references",
);
export default function LabReferencesPage() {
  return <><PageBreadcrumb path="/lab/references" />{<LabReferenceLibrary />}</>;
}
