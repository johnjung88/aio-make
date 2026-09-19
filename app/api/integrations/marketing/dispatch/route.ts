import { NextResponse } from "next/server";
import { workerAllowed } from "@/lib/marketing/security";
import { runOne } from "@/lib/marketing/worker";
export async function POST(req: Request) {
  if (!workerAllowed(req))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { kind } = await req.json();
    if (kind !== "slack" && kind !== "email")
      return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
    return NextResponse.json(await runOne(kind));
  } catch {
    return NextResponse.json(
      { error: "연동 실행이 비활성화되어 있거나 연결 설정이 부족합니다." },
      { status: 503 },
    );
  }
}
