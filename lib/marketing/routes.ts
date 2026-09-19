export const publicPaths = [
  "",
  "/services/marketing",
  "/portfolio",
  "/resources",
  "/quote",
  "/privacy",
];
export function publicRedirect(
  path: string,
): { path: string; permanent: boolean } | null {
  if (path === "/") return { path: "/ko", permanent: true };
  if (path === "/en" || path.startsWith("/en/")) {
    const rest = path.slice(3).replace(/\/$/, "");
    return {
      path: publicPaths.includes(rest) ? "/ko" + rest : "/ko",
      permanent: true,
    };
  }
  if (path.startsWith("/make/"))
    return { path: "/ko#business", permanent: false };
  if (publicPaths.includes(path))
    return { path: "/ko" + path, permanent: true };
  if (path.startsWith("/services/") || path === "/services")
    return { path: "/ko#business", permanent: false };
  if (path === "/contact") return { path: "/ko/quote", permanent: false };
  if (
    path === "/about" ||
    path === "/pricing" ||
    path.startsWith("/portfolio/")
  )
    return { path: "/ko", permanent: false };
  if (path === "/ko" || path === "/ko/") return null;
  if (path.startsWith("/ko/")) {
    const rest = path.slice(3).replace(/\/$/, "");
    if (!publicPaths.includes(rest))
      return {
        path: rest.startsWith("/services/") ? "/ko#business" : "/ko",
        permanent: false,
      };
  }
  return null;
}
