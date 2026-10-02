import { FloatingContact } from "@/components/floating-contact";
import { Suspense } from "react";
import { Header, Footer } from "@/components/site-shell";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/ui";
import { organizationSchema } from "@/lib/seo";
import { siteUrl } from "@/lib/metadata";
import "@/components/guide/guide.css";
import "@/components/guide/review.css";
import "@/components/guide/creative.css";
import "@/components/guide/fixes.css";
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
      <FloatingContact />
      <JsonLd data={organizationSchema} />
      <Suspense fallback={null}>
        <Analytics
          canonicalHost={new URL(siteUrl).hostname}
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
