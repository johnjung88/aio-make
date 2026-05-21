import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Cormorant_Garamond,
  Marcellus,
  JetBrains_Mono,
  Fraunces,
  Plus_Jakarta_Sans,
  Inter,
  IBM_Plex_Mono,
} from "next/font/google";
import localFont from "next/font/local";
import { getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const marcellus = Marcellus({
  variable: "--font-marcellus",
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIO에이전시 | 5일 결과물 보장",
    template: "%s | AIO에이전시",
  },
  description:
    "최대 5일 결과물 보장. 협의 시 긴급 1일 가능. 합리적 가격에 속도 최우선. 웹사이트·앱·디자인·영상·자동화.",
  keywords: [
    "랜딩페이지 제작",
    "홈페이지 제작",
    "앱 개발 MVP",
    "상세페이지 제작",
    "로고 디자인",
    "마케팅 영상 제작",
    "업무 자동화",
    "5일 완성",
    "긴급 당일 작업",
    "가성비",
  ],
  authors: [{ name: "AIO에이전시", url: "https://aio-make.com" }],
  creator: "AIO에이전시",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "AIO에이전시",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          pretendard.variable,
          cormorant.variable,
          marcellus.variable,
          jetbrains.variable,
          fraunces.variable,
          jakarta.variable,
          inter.variable,
          ibmPlexMono.variable,
        ].join(" ")}
      >
        {children}
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
