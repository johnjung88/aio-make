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
import Script from "next/script";
import { getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

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

const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/aio-agency-logo-final/aio-agency-board-1800.png`;

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
    images: [{ url: DEFAULT_OG_IMAGE, width: 1800, height: 945, alt: "AIO에이전시 — 5일 결과물 보장" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIO에이전시 | 5일 결과물 보장",
    description: "최대 5일 결과물 보장. 합리적 가격에 속도 최우선. 웹사이트·앱·디자인·영상·자동화.",
    images: [DEFAULT_OG_IMAGE],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      "naver-site-verification": "6d45b448d955147e866cdf7d77a00cc31a78e173",
    },
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
      <head>
        {/* 네이버 서치어드바이저 소유 확인 */}
        <meta name="naver-site-verification" content="6d45b448d955147e866cdf7d77a00cc31a78e173" />
      </head>
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
        {/* JSON-LD — Organization / ProfessionalService (AEO: 지식패널·답변엔진 엔티티 인식) */}
        <JsonLd data={{
          "@context": "https://schema.org",
          "@type": ["Organization", "ProfessionalService"],
          "@id": `${SITE_URL}/#organization`,
          name: "AIO에이전시",
          alternateName: "에이아이오 에이전시",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/brand/aio-agency-logo-final/aio-agency-board-1800.png`,
          },
          description: "최대 5일 결과물 보장. 합리적 가격에 속도 최우선. 웹사이트·앱·디자인·영상·자동화.",
          address: { "@type": "PostalAddress", addressCountry: "KR" },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: `${SITE_URL}/ko/quote`,
            availableLanguage: "Korean",
          },
          areaServed: "KR",
          serviceType: [
            "홈페이지 제작", "랜딩페이지 제작", "쇼핑몰 제작", "앱 개발",
            "업무 자동화", "로고 디자인", "상세페이지 제작", "PPT 디자인", "마케팅 영상 제작",
          ],
          sameAs: [],
        }} />
      </body>

      <Script id="ga-datalayer-init" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];`}
      </Script>

      {/* GA4 */}
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}

      {/* Meta 픽셀 (NEXT_PUBLIC_META_PIXEL_ID 환경변수 설정 시 활성화) */}
      {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${process.env.NEXT_PUBLIC_META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}

      {/* 카카오 픽셀 (NEXT_PUBLIC_KAKAO_PIXEL_ID 환경변수 설정 시 활성화) */}
      {process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID && (
        <Script id="kakao-pixel" strategy="afterInteractive">
          {`var _kaq=window._kaq||[];_kaq.push(['_setTarget','${process.env.NEXT_PUBLIC_KAKAO_PIXEL_ID}']);(function(){var ka=document.createElement('script');ka.async=true;ka.src='//t1.kakaocdn.net/kakao_ad_sa/kakao_ad_sa.js';var sc=document.getElementsByTagName('script')[0];sc.parentNode.insertBefore(ka,sc);})();`}
        </Script>
      )}

      {/* 네이버 공통 로그 분석 (NEXT_PUBLIC_NAVER_AD_ID 환경변수 설정 시 활성화) */}
      {process.env.NEXT_PUBLIC_NAVER_AD_ID && (
        <Script id="naver-ad" src="//wcs.naver.net/wcslog.js" strategy="afterInteractive" />
      )}
      {process.env.NEXT_PUBLIC_NAVER_AD_ID && (
        <Script id="naver-ad-init" strategy="afterInteractive">
          {`var _nasa={};if(window.wcs)_nasa["cnv"]=wcs.cnv("4","0");wcs_do(_nasa);`}
        </Script>
      )}
    </html>
  );
}
