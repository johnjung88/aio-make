import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { getCommandCenterData, type CalendarEvent } from "@/lib/admin/command-center";
import { listCalendarTasks, type TaskRow } from "@/lib/admin/tasks";

function taskToCalendarEvent(task: TaskRow): CalendarEvent {
  return {
    id: `task-${task.id}`,
    title: task.title,
    date: task.due_date ?? task.scope_date,
    kind: "task",
    status: task.status,
    owner: "secretary",
    sourceId: task.id,
    priority: task.priority,
    scope: task.scope,
    notes: task.notes,
    editable: true,
    href: "/admin/work",
  };
}

function isValidDate(value: string | null): value is string {
  return Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
}

export async function GET(request: Request) {
  await requireAdminSession();
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const data = await getCommandCenterData();
  let events = data.calendarEvents;

  if (isValidDate(start) && isValidDate(end)) {
    const taskEvents = (await listCalendarTasks(start, end)).map(taskToCalendarEvent);
    const byId = new Map<string, CalendarEvent>();
    for (const event of [...events, ...taskEvents]) {
      if (event.date >= start && event.date <= end) byId.set(event.id, event);
    }
    events = [...byId.values()].sort((a, b) => a.date.localeCompare(b.date));
  }

  return NextResponse.json({ generatedAt: data.generatedAt, events, warnings: data.warnings });
}
