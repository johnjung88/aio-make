import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { getLocale } from "next-intl/server";
import { GoogleAnalytics } from "@next/third-parties/google";
import { SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

import "./globals.css";

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "45 920",
});

const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/aio-agency-logo-final/aio-agency-board-1800.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIO | 매장을 위한 통합 마케팅",
    template: "%s | AIO에이전시",
  },
  description:
    "재방문 준비·콘텐츠 운영·유입 측정을 하나의 월간 플랜으로 연결합니다.",
  keywords: ["소상공인 마케팅", "콘텐츠 운영", "재방문 준비", "유입 측정"],
  authors: [{ name: "AIO에이전시", url: "https://aio-make.com" }],
  creator: "AIO에이전시",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "AIO에이전시",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1800, height: 945, alt: "AIO 통합 마케팅" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIO | 매장을 위한 통합 마케팅",
    description: "재방문 준비·콘텐츠 운영·유입 측정을 하나의 월간 플랜으로 연결합니다.",
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
        className={pretendard.variable}
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
          description: "재방문 준비·콘텐츠 운영·유입 측정을 하나의 월간 플랜으로 연결합니다.",
          address: { "@type": "PostalAddress", addressCountry: "KR" },
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            url: `${SITE_URL}/ko/quote`,
            availableLanguage: "Korean",
          },
          areaServed: "KR",
          serviceType: ["통합 마케팅"],
          sameAs: [],
        }} />

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
      </body>
    </html>
  );
}
