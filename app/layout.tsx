import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-body",
  weight: "45 920",
});
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aio-make.com",
  ),
  title: { default: "AIO MAKE · 마케팅 개발 영상", template: "%s | AIO MAKE" },
  description:
    "마케팅·개발·영상의 필요한 일을 연결합니다. 사업의 목적에 맞는 기획, 제작, 운영.",
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
    <html lang="ko">
      <body className={pretendard.variable}>{children}</body>
    </html>
  );
}
