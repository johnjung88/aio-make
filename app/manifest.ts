import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIO MAKE · 마케팅 개발 컨텐츠",
    short_name: "AIO MAKE",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "browser",
    background_color: "#F4F3EF",
    theme_color: "#6B4DFF",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
