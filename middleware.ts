import { NextResponse, type NextRequest } from "next/server";
import { publicRedirect } from "@/lib/marketing/routes";
export default function middleware(request: NextRequest) {
  const target = publicRedirect(request.nextUrl.pathname);
  if (target) {
    const url = new URL(target.path, request.url);
    url.search = request.nextUrl.search;
    return NextResponse.redirect(url, target.permanent ? 308 : 307);
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/ko/:path*",
    "/en/:path*",
    "/services/:path*",
    "/portfolio/:path*",
    "/quote",
    "/resources",
    "/privacy",
    "/about",
    "/pricing",
    "/contact",
    "/make/:path*",
  ],
};
