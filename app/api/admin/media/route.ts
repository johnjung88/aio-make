import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { hasAdmin } from "@/lib/auth";
import { sameOrigin } from "@/lib/http";
import { database, databaseReady } from "@/lib/db";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!(await hasAdmin()))
    return NextResponse.json(
      { error: "로그인이 필요합니다" },
      { status: 401 },
    );
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "허용되지 않은 요청입니다" },
      { status: 403 },
    );
  if (!databaseReady())
    return NextResponse.json(
      { error: "데이터베이스 연결이 필요합니다" },
      { status: 503 },
    );
  if (Number(request.headers.get("content-length") ?? 0) > 6 * 1024 * 1024)
    return NextResponse.json(
      { error: "이미지는 5MB 이하로 준비해주세요" },
      { status: 413 },
    );
  try {
    const form = await request.formData(),
      file = form.get("file");
    if (
      !(file instanceof File) ||
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 5 * 1024 * 1024
    )
      return NextResponse.json(
        { error: "5MB 이하의 PNG, JPEG, WebP 이미지를 선택해주세요" },
        { status: 400 },
      );
    const bytes = await sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 25000000,
    })
      .rotate()
      .resize({ width: 1800, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    const db = database(),
      path = randomUUID() + ".webp";
    const { error } = await db.storage
      .from("website-media")
      .upload(path, bytes, { contentType: "image/webp", upsert: false });
    if (error) throw error;
    return NextResponse.json({
      success: true,
      url: db.storage.from("website-media").getPublicUrl(path).data.publicUrl,
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "이미지 저장을 완료하지 못했습니다 연결과 파일 형식을 확인해주세요",
      },
      { status: 503 },
    );
  }
}
