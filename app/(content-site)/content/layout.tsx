/* 컨텐츠 사이트(AIO MAKE CONTENT STUDIO) 레이아웃. /content, 서비스, 문의, 인사이트와 사례 상세를 이 그룹이 처리한다.
 * /content/work 목록은 404 그대로, 사례 상세는 /content/projects/<slug>.
 * 메인 Header·Footer·FloatingContact·PageNavigation과 guide CSS 7종은 쓰지 않는다. robots는 루트 규칙을 따른다. */
import { Suspense } from "react";
import { Analytics } from "@/components/analytics";
import { ContentSiteFrame } from "@/components/content-site/shell/frame";
import { ContentSiteHeader } from "@/components/content-site/shell/header";
import { ContentSiteFooter } from "@/components/content-site/shell/footer";
import { ContentMobileBar } from "@/components/content-site/shell/mobile-bar";
import { CsReveal } from "@/components/content-site/ui/reveal";
import { JsonLd } from "@/components/ui";
import { CS_COPY } from "@/lib/content-site/copy";
import { siteUrl } from "@/lib/metadata";
import { organizationSchema } from "@/lib/seo";
import "@/components/content-site/theme.css";

export default function ContentSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ContentSiteFrame>
        <a href="#main-content" className="cs-skip cs-t-button">
          {CS_COPY.skip}
        </a>
        <ContentSiteHeader />
        <main id="main-content" className="cs-main">
          {children}
        </main>
        <ContentSiteFooter />
        <ContentMobileBar />
        <CsReveal />
      </ContentSiteFrame>
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
