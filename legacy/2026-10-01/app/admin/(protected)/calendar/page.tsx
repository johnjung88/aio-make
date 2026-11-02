import Link from "next/link";
import { CheckSquare } from "lucide-react";
import { getCommandCenterData } from "@/lib/admin/command-center";
import { AdminCalendarClient } from "./calendar-client";

export const metadata = {
  title: "일정 캘린더 | AIO 관리자",
};

export default async function AdminCalendarPage() {
  const data = await getCommandCenterData();

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Calendar</p>
          <h2 className="mt-2 text-3xl font-semibold">일정 캘린더</h2>
          <p className="mt-2 text-sm text-muted-foreground">업무 일정은 업무 칸반과 같은 task 데이터입니다. 여기서는 달력 기준으로 입력/편집하고, 문의·납기·승인은 운영 일정으로 함께 확인합니다.</p>
        </div>
        <Link href="/admin/work" className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground">
          <CheckSquare className="size-4" />
          업무 칸반
        </Link>
      </div>

      <AdminCalendarClient initialEvents={data.calendarEvents} initialWarnings={data.warnings} />
    </div>
  );
}
