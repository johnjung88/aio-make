import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/admin-auth";
import { getServicePriceOverrides, saveServicePriceOverride } from "@/lib/admin/service-price-overrides";

const saveSchema = z.object({
  serviceId: z.string().trim().min(1).max(80),
  itemType: z.enum(["tier", "addon"]),
  itemIndex: z.number().int().min(0),
  itemName: z.string().trim().min(1).max(200),
  eventPrice: z.string().max(80).nullable().optional(),
  regularPrice: z.string().max(80).nullable().optional(),
  duration: z.string().max(80).nullable().optional(),
  addonPrice: z.string().max(80).nullable().optional(),
});

export async function GET() {
  await requireAdminSession();
  const overrides = await getServicePriceOverrides();
  return NextResponse.json({ overrides });
}

export async function POST(req: Request) {
  await requireAdminSession();

  const parsed = saveSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 });
  }

  try {
    const override = await saveServicePriceOverride(parsed.data);
    return NextResponse.json({ ok: true, override });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "저장 실패" }, { status: 500 });
  }
}
