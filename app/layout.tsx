import type { Metadata } from "next";
import localFont from "next/font/local";
import { indexable, siteDescription, siteName, siteUrl } from "@/lib/metadata";

import "./globals.css";
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-body",
  weight: "45 920",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AIO MAKE · 마케팅 개발 영상", template: "%s | AIO MAKE" },
  description: siteDescription,
  applicationName: siteName,
  category: "business",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { url: "/favicon-96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: indexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      "naver-site-verification":
        process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION ??
        "6d45b448d955147e866cdf7d77a00cc31a78e173",
    },
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <body className={pretendard.variable}>{children}</body>
    </html>
  );
}
