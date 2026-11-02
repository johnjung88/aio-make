import { NextResponse } from "next/server";
import { shortLinkDestination } from "@/lib/tracking-config";
export function GET(request: Request) {
  const url = new URL(request.url);
  let segments: string[] = [];
  try {
    segments = url.pathname.slice(4).split("/").map(decodeURIComponent);
  } catch {}
  // A relative Location preserves the requesting host, including loopback previews.
  return new NextResponse(null, {
    status: 307,
    headers: { Location: shortLinkDestination(segments, url.searchParams), "Cache-Control": "no-store" },
  });
}
