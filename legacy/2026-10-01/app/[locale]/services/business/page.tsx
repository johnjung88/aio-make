import { redirect } from "next/navigation";

// 비즈니스 분야는 4분야 체계로 통합되며 제거됨.
// PPT는 디자인 분야로 이동 → 디자인 페이지로 리다이렉트.
export default async function BusinessRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/services/design`);
}
