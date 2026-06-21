import { hasSupabaseAdminConfig } from "@/lib/supabase";
import {
  listTodayTasks,
  listWeekTasks,
  listMonthTasks,
  kstToday,
  kstWeekStart,
  kstMonthStart,
} from "@/lib/admin/tasks";
import { KanbanBoard } from "@/components/admin/kanban-board";

export const metadata = {
  title: "업무 칸반 | AIO 관리자",
};

export default async function KanbanPage() {
  if (!hasSupabaseAdminConfig()) {
    return (
      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Kanban</p>
          <h2 className="mt-2 text-3xl font-semibold">업무 칸반</h2>
        </div>
        <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Supabase 관리자 환경변수가 없어 업무 데이터를 표시할 수 없습니다.
        </p>
      </div>
    );
  }

  const now = new Date();
  const [todayTasks, weekTasks, monthTasks] = await Promise.all([
    listTodayTasks(now),
    listWeekTasks(now),
    listMonthTasks(now),
  ]);

  const totalActive = todayTasks.length + weekTasks.length + monthTasks.length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-primary">Kanban</p>
          <h2 className="mt-2 text-3xl font-semibold">업무 칸반</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            활성 할 일 {totalActive}개 · PM 업무 현황은 요약/리스크 화면이고, 업무 칸반은 실제 task 생성·상태변경 화면입니다
          </p>
        </div>
      </div>

      <KanbanBoard
        todayTasks={todayTasks}
        weekTasks={weekTasks}
        monthTasks={monthTasks}
        today={kstToday(now)}
        weekStart={kstWeekStart(now)}
        monthStart={kstMonthStart(now)}
      />
    </div>
  );
}
