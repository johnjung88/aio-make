import "@/components/local-admin.css";
import { adminRequest } from "@/lib/auth";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "@/components/admin/admin.css";
export const metadata: Metadata = {
  title: "AIO MAKE 관리자",
  robots: { index: false, follow: false },
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await adminRequest())) notFound();
  return <div className="admin-body">{children}</div>;
}
