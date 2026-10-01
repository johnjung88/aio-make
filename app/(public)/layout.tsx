import { Suspense } from "react";
import { Header, Footer } from "@/components/site-shell";
import { Analytics } from "@/components/analytics";
import "@/components/guide/guide.css";
import "@/components/guide/review.css";
import "@/components/guide/creative.css";
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        본문 바로가기
      </a>
      <Header />
      <main id="main-content" className="guide-public">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <Analytics
          measurementId={
            process.env.NODE_ENV === "production"
              ? (process.env.NEXT_PUBLIC_GA_ID ?? "")
              : ""
          }
        />
      </Suspense>
    </>
  );
}
