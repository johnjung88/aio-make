import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/admin-auth";
import {
  createTask,
  updateTaskStatus,
  deferTask,
  deleteTask,
  type TaskScope,
  type TaskStatus,
} from "@/lib/admin/tasks";

function authError() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

// ── POST: 새 할 일 생성 ───────────────────────────
const createSchema = z.object({
  title:            z.string().trim().min(1).max(300),
  scope:            z.enum(["today", "week", "month"]),
  scopeDate:        z.string().optional(),
  priority:         z.enum(["P0", "P1", "P2"]).default("P1"),
  dueDate:          z.string().optional(),
  notes:            z.string().max(1000).optional(),
  relatedProjectId: z.string().uuid().optional(),
});

export async function POST(req: Request) {
  if (!(await getAdminSession())) return authError();

  const parsed = createSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    const task = await createTask({ ...parsed.data, source: "admin" });
    return NextResponse.json(task, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "실패" }, { status: 500 });
  }
}

// ── PATCH: 상태 변경 또는 이월 ───────────────────
const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("status"),
    id:     z.string().uuid(),
    status: z.enum(["pending", "in_progress", "completed", "canceled", "deferred"]),
  }),
  z.object({
    action:    z.literal("defer"),
    id:        z.string().uuid(),
    scope:     z.enum(["today", "week", "month"]),
    scopeDate: z.string().optional(),
  }),
]);

export async function PATCH(req: Request) {
  if (!(await getAdminSession())) return authError();

  const parsed = patchSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  try {
    if (parsed.data.action === "status") {
      const task = await updateTaskStatus(parsed.data.id, parsed.data.status as TaskStatus);
      return NextResponse.json(task);
    } else {
      const task = await deferTask(parsed.data.id, parsed.data.scope as TaskScope, parsed.data.scopeDate);
      return NextResponse.json(task);
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "실패" }, { status: 500 });
  }
}

// ── DELETE: 삭제 ─────────────────────────────────
export async function DELETE(req: Request) {
  if (!(await getAdminSession())) return authError();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await deleteTask(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "실패" }, { status: 500 });
  }
}

