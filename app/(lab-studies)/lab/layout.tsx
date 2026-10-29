import { Suspense } from "react";
import { Analytics } from "@/components/analytics";
import {
  LabHeader,
  LabFooter,
  LabMobileBar,
} from "@/components/lab-main/shell";
import { siteUrl } from "@/lib/metadata";
import styles from "@/components/lab-main/shell.module.css";

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className={styles.frame}>
        <a className={styles.skip} href="#main-content">
          본문으로 바로가기
        </a>
        <LabHeader />
        <div id="main-content">{children}</div>
        <LabFooter />
        <LabMobileBar />
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
