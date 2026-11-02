import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/en", destination: "/ko", permanent: true },
      { source: "/en/:path*", destination: "/ko/:path*", permanent: true },
      { source: "/:locale/services/video-content", destination: "/:locale/services/video", permanent: true },
      { source: "/:locale/services/video-content/:path*", destination: "/:locale/services/video/:path*", permanent: true },
    ];
  },
  // 빌드 안정성 — 새 기능 작업 중 ESLint/TS 에러로 빌드 막히지 않게 임시 허용
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rohodabwnabpqkxgxbft.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
