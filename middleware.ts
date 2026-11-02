import { NextResponse, type NextRequest } from "next/server";
import { legacyDestination } from "@/lib/redirects";
export function middleware(request: NextRequest) {
  const path = legacyDestination(request.nextUrl.pathname);
  if (!path || path === request.nextUrl.pathname) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url, 301);
}
export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
