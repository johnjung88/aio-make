import Link from "next/link";
import { AlertTriangle, ArrowRight, BarChart3, CheckSquare, Clock3 } from "lucide-react";
import { getCommandCenterData, type WorkItem } from "@/lib/admin/command-center";

export const metadata = {
  title: "PM 업무 현황 | AIO 관리자",
};

const LANE_LABELS: Record<WorkItem["lane"], string> = {
  today: "오늘",
  week: "이번 주",
  month: "이번 달",
  project: "진행 프로젝트",
  blocked: "Blocked",
};

function laneItems(items: WorkItem[], lane: WorkItem["lane"]) {
  return items.filter((item) => item.lane === lane).slice(0, 12);
}

export default async function WorkPage() {
  const data = await getCommandCenterData();
  const lanes: WorkItem["lane"][] = ["today", "week", "month", "project", "blocked"];

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Work Board</p>
          <h2 className="mt-2 text-3xl font-semibold">PM 업무 현황</h2>
          <p className="mt-2 text-sm text-muted-foreground">텔레그램 할 일과 진행 프로젝트를 같은 운영 보드에서 확인합니다.</p>
        </div>
        <Link href="/admin/kanban" className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground">
          <BarChart3 className="size-4" />
          Kanban 열기
        </Link>
      </div>

      {data.risks.length > 0 && (
        <section className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-rose-200">
            <AlertTriangle className="size-4" />
            위험/병목 {data.risks.length}건
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {data.risks.slice(0, 6).map((risk) => (
              <Link key={risk.id} href={risk.href} className="rounded-lg border border-white/10 bg-background/30 px-3 py-2 text-sm hover:bg-white/5">
                <p className="font-medium">{risk.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{risk.reason}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-5">
        {lanes.map((lane) => (
          <div key={lane} className="rounded-lg border border-white/10 bg-card">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold">{LANE_LABELS[lane]}</h3>
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-muted-foreground">{laneItems(data.workItems, lane).length}</span>
            </div>
            <div className="space-y-2 p-3">
              {laneItems(data.workItems, lane).length === 0 ? (
                <p className="py-8 text-center text-xs text-muted-foreground">비어 있음</p>
              ) : (
                laneItems(data.workItems, lane).map((item) => (
                  <Link key={`${lane}-${item.id}`} href={item.href} className="block rounded-lg border border-white/10 bg-white/[0.03] p-3 text-sm hover:bg-white/[0.06]">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] ${item.priority === "P0" ? "bg-rose-400/15 text-rose-200" : "bg-white/10 text-muted-foreground"}`}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.status}</span>
                    </div>
                    <p className="mt-2 line-clamp-2 font-medium">{item.title}</p>
                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CheckSquare className="size-3" />
                        {item.owner}
                      </span>
                      {item.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock3 className="size-3" />
                          {item.dueDate}
                        </span>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ))}
      </section>

      <Link href="/admin/calendar" className="inline-flex items-center gap-2 text-sm text-primary">
        일정 캘린더에서 보기
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
