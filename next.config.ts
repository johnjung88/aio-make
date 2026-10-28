import type { NextConfig } from "next";
if (
  process.env.VERCEL &&
  process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
) {
  throw new Error(
    "Customer reference review is local only. Confirm publication rights before release.",
  );
}
const config: NextConfig = {
  // Unset means off. Next inlines only NEXT_PUBLIC_ values that exist, so an
  // unset flag would leave `process.env…` in client code and keep review-only
  // literals in the bundle. Always inline "1" or "0" so every `=== "1"` gate
  // folds at build time.
  env: {
    NEXT_PUBLIC_AIO_REFERENCE_REVIEW:
      process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1" ? "1" : "0",
  },
  poweredByHeader: false,
  async redirects() {
    // Retire old lab pages while allowing the lab's own static image assets.
    return [
      {
        source: "/lab/:path((?!.*\\.(?:webp|png|jpe?g|svg|avif)$).+)",
        destination: "/lab",
        permanent: true,
      },
    ];
  },
  serverExternalPackages: ["@electric-sql/pglite"],
  devIndicators: false,
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rohodabwnabpqkxgxbft.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      ...["/admin/:path*", "/api/:path*"].map((source) => ({
        source,
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      })),
      {
        source: "/:path*",
        headers: [
          ...(process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1" ||
          process.env.VERCEL_ENV === "preview"
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
            : []),
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};
export default config;
