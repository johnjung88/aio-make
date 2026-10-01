import type { Metadata } from "next";
import "@/components/admin/admin.css";
export const metadata: Metadata = {
  title: "AIO MAKE 관리자",
  robots: { index: false, follow: false },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="admin-body">{children}</div>;
}
