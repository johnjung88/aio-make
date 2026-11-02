import { NextResponse } from "next/server";
import { z } from "zod";

import { runFactoryTeam } from "@/lib/page-factory/team";

const requestSchema = z.object({
  brief: z.string().trim().min(20).max(12000),
  productInfo: z.string().trim().max(8000).optional().default(""),
  references: z.string().trim().max(8000).optional().default(""),
  targetChannel: z.string().trim().max(120).optional().default("스마트스토어 / 카페24"),
}).passthrough();

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 },
    );
  }

  const project = await runFactoryTeam(parsed.data);
  return NextResponse.json({ success: true, data: project });
}
