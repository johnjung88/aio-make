import "@/components/shared-detail-tokens.css";
import "@/components/content-site/theme.css";
import "@/components/content-site/content-renewal.css";
import "@/components/content-site/shell/header-v15.css";
import { JsonLd } from "@/components/ui";
import { organizationSchema } from "@/lib/seo";
import { Suspense } from "react";
import { Analytics } from "@/components/analytics";
import { LabHeader, LabFooter } from "@/components/lab-main/shell";
import { siteUrl } from "@/lib/metadata";
import styles from "@/components/lab-main/shell.module.css";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={`sd-site ${styles.frame}`}>
        <a className={styles.skip} href="#main-content">
          본문으로 바로가기
        </a>
        <JsonLd data={organizationSchema} />
        <LabHeader />
        <div id="main-content">{children}</div>
        <LabFooter />
      </div>
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
