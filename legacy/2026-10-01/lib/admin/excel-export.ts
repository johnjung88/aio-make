import "server-only";
import ExcelJS from "exceljs";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
import { toKstDate } from "@/lib/admin/telegram-templates";
import {
  listTodayTasks,
  listWeekTasks,
  listMonthTasks,
  listTodayCompleted,
  kstToday,
  kstWeekStart,
  kstMonthStart,
} from "@/lib/admin/tasks";

// =====================================================
// 운영 데이터 → xlsx Buffer
// =====================================================
export type ExcelExportResult = {
  buffer: Buffer;
  filename: string;
  summary: {
    tasks: { today: number; week: number; month: number; completedToday: number };
    activeProjects: number;
    overdue: number;
    monthRevenue: number;
    monthPaid: number;
    monthExpense: number;
  };
};

export async function buildOperationsExcel(now: Date = new Date()): Promise<ExcelExportResult> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase admin 환경변수 미설정");
  }
  const supabase = createSupabaseAdminClient();
  const kstNow = toKstDate(now);
  const monthLabel = `${kstNow.getFullYear()}-${String(kstNow.getMonth() + 1).padStart(2, "0")}`;
  const monthStartISO = `${monthLabel}-01`;
  // 다음 달 1일 (월 누계 종료 경계)
  const nextMonth = new Date(Date.UTC(kstNow.getFullYear(), kstNow.getMonth() + 1, 1));
  const monthEndISO = `${nextMonth.getUTCFullYear()}-${String(nextMonth.getUTCMonth() + 1).padStart(2, "0")}-01`;

  // ── 데이터 fetch ──────────────────────────────────────
  const [
    todayTasks,
    weekTasks,
    monthTasks,
    todayCompleted,
    projectsRes,
    invoicesRes,
    expensesRes,
    leadsRes,
  ] = await Promise.all([
    listTodayTasks(now),
    listWeekTasks(now),
    listMonthTasks(now),
    listTodayCompleted(now),
    supabase
      .from("projects")
      .select("id, product_name, channel, category, contracted_amount, start_date, due_date, completed_date, status, five_day_kept, notes, lead_id")
      .order("created_at", { ascending: false }),
    supabase
      .from("invoices")
      .select("id, project_id, net_amount, paid_amount, outstanding_amount, payment_status, contracted_at, paid_at")
      .gte("contracted_at", `${monthStartISO}T00:00:00+09:00`)
      .lt("contracted_at", `${monthEndISO}T00:00:00+09:00`)
      .order("contracted_at", { ascending: false }),
    supabase
      .from("expenses")
      .select("id, date, category, vendor, item, amount, payment_method, vat_deductible")
      .gte("date", monthStartISO)
      .lt("date", monthEndISO)
      .order("date", { ascending: false }),
    supabase
      .from("leads")
      .select("id, channel, customer_name, company_name, notes, tags, created_at, last_contact_at, is_archived")
      .gte("created_at", `${monthStartISO}T00:00:00+09:00`)
      .order("created_at", { ascending: false }),
  ]);

  const projects = projectsRes.data ?? [];
  const invoices = invoicesRes.data ?? [];
  const expenses = expensesRes.data ?? [];
  const leads = leadsRes.data ?? [];

  // ── 워크북 생성 ──────────────────────────────────────
  const wb = new ExcelJS.Workbook();
  wb.creator = "AIO 봇";
  wb.created = now;
  wb.modified = now;
  wb.title = `AIO 운영관리 ${monthLabel}`;

  const HEADER_FILL: ExcelJS.Fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1F2A44" },
  };
  const HEADER_FONT: Partial<ExcelJS.Font> = {
    name: "맑은 고딕",
    bold: true,
    color: { argb: "FFFFFFFF" },
    size: 11,
  };
  const BORDER_THIN: Partial<ExcelJS.Borders> = {
    top: { style: "thin", color: { argb: "FFD0D7DE" } },
    left: { style: "thin", color: { argb: "FFD0D7DE" } },
    bottom: { style: "thin", color: { argb: "FFD0D7DE" } },
    right: { style: "thin", color: { argb: "FFD0D7DE" } },
  };

  const styleHeader = (row: ExcelJS.Row) => {
    row.eachCell((cell) => {
      cell.fill = HEADER_FILL;
      cell.font = HEADER_FONT;
      cell.alignment = { vertical: "middle", horizontal: "center" };
      cell.border = BORDER_THIN;
    });
    row.height = 22;
  };

  const styleBody = (ws: ExcelJS.Worksheet, startRow = 2) => {
    for (let r = startRow; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = BORDER_THIN;
        if (!cell.font) cell.font = { name: "맑은 고딕", size: 10 };
        else cell.font = { ...cell.font, name: cell.font.name ?? "맑은 고딕", size: cell.font.size ?? 10 };
        cell.alignment = cell.alignment ?? { vertical: "middle", wrapText: true };
      });
    }
  };

  // ── Sheet 1: 📋 할 일 ─────────────────────────────────
  const wsTasks = wb.addWorksheet("📋 할 일", {
    properties: { tabColor: { argb: "FF3B82F6" } },
    views: [{ state: "frozen", ySplit: 1 }],
  });
  wsTasks.columns = [
    { header: "번호", key: "num", width: 6 },
    { header: "스코프", key: "scope", width: 10 },
    { header: "우선순위", key: "priority", width: 10 },
    { header: "제목", key: "title", width: 60 },
    { header: "상태", key: "status", width: 10 },
    { header: "스코프 일자", key: "scope_date", width: 14 },
    { header: "마감", key: "due", width: 14 },
    { header: "완료일", key: "completed_at", width: 18 },
    { header: "출처", key: "source", width: 10 },
    { header: "메모", key: "notes", width: 40 },
    { header: "ID", key: "id_hint", width: 10 },
  ];
  styleHeader(wsTasks.getRow(1));

  let num = 1;
  for (const t of todayTasks) {
    wsTasks.addRow({
      num: num++,
      scope: "오늘",
      priority: t.priority,
      title: t.title,
      status: t.status,
      scope_date: t.scope_date,
      due: t.due_date ?? "",
      completed_at: t.completed_at ?? "",
      source: t.source,
      notes: t.notes ?? "",
      id_hint: t.id.slice(0, 6),
    });
  }
  for (const t of weekTasks) {
    wsTasks.addRow({
      num: num++,
      scope: "이 주",
      priority: t.priority,
      title: t.title,
      status: t.status,
      scope_date: t.scope_date,
      due: t.due_date ?? "",
      completed_at: t.completed_at ?? "",
      source: t.source,
      notes: t.notes ?? "",
      id_hint: t.id.slice(0, 6),
    });
  }
  for (const t of monthTasks) {
    wsTasks.addRow({
      num: num++,
      scope: "이 달",
      priority: t.priority,
      title: t.title,
      status: t.status,
      scope_date: t.scope_date,
      due: t.due_date ?? "",
      completed_at: t.completed_at ?? "",
      source: t.source,
      notes: t.notes ?? "",
      id_hint: t.id.slice(0, 6),
    });
  }
  for (const t of todayCompleted) {
    wsTasks.addRow({
      num: num++,
      scope: "✅ 완료",
      priority: t.priority,
      title: t.title,
      status: "completed",
      scope_date: t.scope_date,
      due: t.due_date ?? "",
      completed_at: t.completed_at ?? "",
      source: t.source,
      notes: t.notes ?? "",
      id_hint: t.id.slice(0, 6),
    });
  }
  // P0 행 강조 (filling color)
  for (let r = 2; r <= wsTasks.rowCount; r++) {
    const priorityCell = wsTasks.getRow(r).getCell("priority");
    if (priorityCell.value === "P0") {
      wsTasks.getRow(r).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF1F0" } };
      });
    }
  }
  styleBody(wsTasks);

  // ── Sheet 2: 🚀 진행 외주 ──────────────────────────────
  const wsProjects = wb.addWorksheet("🚀 진행 외주", {
    properties: { tabColor: { argb: "FFEF4444" } },
    views: [{ state: "frozen", ySplit: 1 }],
  });
  wsProjects.columns = [
    { header: "번호", key: "num", width: 6 },
    { header: "채널", key: "channel", width: 10 },
    { header: "카테고리", key: "category", width: 12 },
    { header: "상품명", key: "product_name", width: 50 },
    { header: "계약 금액", key: "amount", width: 14, style: { numFmt: "#,##0" } },
    { header: "상태", key: "status", width: 12 },
    { header: "시작일", key: "start_date", width: 12 },
    { header: "마감일", key: "due_date", width: 12 },
    { header: "완료일", key: "completed_date", width: 12 },
    { header: "지연(D+)", key: "overdue", width: 10 },
    { header: "5일 보장", key: "five_day", width: 10 },
    { header: "메모", key: "notes", width: 40 },
  ];
  styleHeader(wsProjects.getRow(1));

  const todayUtc = Date.UTC(kstNow.getFullYear(), kstNow.getMonth(), kstNow.getDate());
  let pnum = 1;
  for (const p of projects) {
    let overdue: number | "" = "";
    if (p.status === "in_progress" && p.due_date) {
      const due = toKstDate(p.due_date);
      const dueUtc = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
      const d = Math.round((todayUtc - dueUtc) / 86_400_000);
      if (d > 0) overdue = d;
    }
    wsProjects.addRow({
      num: pnum++,
      channel: p.channel ?? "",
      category: p.category ?? "",
      product_name: p.product_name ?? "",
      amount: p.contracted_amount ?? 0,
      status: p.status ?? "",
      start_date: p.start_date ?? "",
      due_date: p.due_date ?? "",
      completed_date: p.completed_date ?? "",
      overdue,
      five_day: p.five_day_kept === true ? "✅" : p.five_day_kept === false ? "❌" : "",
      notes: p.notes ?? "",
    });
  }
  // 지연 행 강조
  for (let r = 2; r <= wsProjects.rowCount; r++) {
    const ov = wsProjects.getRow(r).getCell("overdue").value;
    if (typeof ov === "number" && ov > 0) {
      wsProjects.getRow(r).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFE4E6" } };
      });
    }
  }
  styleBody(wsProjects);

  // ── Sheet 3: 💰 매출/입금 ──────────────────────────────
  const wsInv = wb.addWorksheet("💰 매출 입금", {
    properties: { tabColor: { argb: "FF10B981" } },
    views: [{ state: "frozen", ySplit: 1 }],
  });
  wsInv.columns = [
    { header: "번호", key: "num", width: 6 },
    { header: "상품명", key: "product", width: 50 },
    { header: "채널", key: "channel", width: 10 },
    { header: "계약 금액(net)", key: "net", width: 16, style: { numFmt: "#,##0" } },
    { header: "입금 금액", key: "paid", width: 16, style: { numFmt: "#,##0" } },
    { header: "미수 금액", key: "out", width: 16, style: { numFmt: "#,##0" } },
    { header: "결제 상태", key: "status", width: 12 },
    { header: "계약일", key: "contracted", width: 14 },
    { header: "입금일", key: "paid_at", width: 14 },
  ];
  styleHeader(wsInv.getRow(1));

  const projectMap = new Map(projects.map((p) => [p.id, p]));
  let inum = 1;
  for (const i of invoices) {
    const p = i.project_id ? projectMap.get(i.project_id) : undefined;
    wsInv.addRow({
      num: inum++,
      product: p?.product_name ?? "(외주 매출)",
      channel: p?.channel ?? "",
      net: i.net_amount ?? 0,
      paid: i.paid_amount ?? 0,
      out: i.outstanding_amount ?? Math.max((i.net_amount ?? 0) - (i.paid_amount ?? 0), 0),
      status: i.payment_status ?? "unpaid",
      contracted: i.contracted_at ? new Date(i.contracted_at).toISOString().slice(0, 10) : "",
      paid_at: i.paid_at ? new Date(i.paid_at).toISOString().slice(0, 10) : "",
    });
  }
  // 입금 완료 행 강조
  for (let r = 2; r <= wsInv.rowCount; r++) {
    const st = wsInv.getRow(r).getCell("status").value;
    if (st === "paid") {
      wsInv.getRow(r).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE7F8EE" } };
      });
    } else if (st === "canceled") {
      wsInv.getRow(r).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
        cell.font = { ...cell.font, color: { argb: "FF9CA3AF" } };
      });
    }
  }
  styleBody(wsInv);

  // ── Sheet 4: 💸 지출 ──────────────────────────────────
  const wsExp = wb.addWorksheet("💸 지출", {
    properties: { tabColor: { argb: "FFF59E0B" } },
    views: [{ state: "frozen", ySplit: 1 }],
  });
  wsExp.columns = [
    { header: "번호", key: "num", width: 6 },
    { header: "일자", key: "date", width: 12 },
    { header: "카테고리", key: "category", width: 14 },
    { header: "공급자", key: "vendor", width: 18 },
    { header: "항목", key: "item", width: 40 },
    { header: "금액", key: "amount", width: 14, style: { numFmt: "#,##0" } },
    { header: "결제 수단", key: "method", width: 14 },
    { header: "VAT 공제", key: "vat", width: 10 },
  ];
  styleHeader(wsExp.getRow(1));
  let enum_ = 1;
  for (const e of expenses) {
    wsExp.addRow({
      num: enum_++,
      date: e.date,
      category: e.category,
      vendor: e.vendor ?? "",
      item: e.item,
      amount: e.amount,
      method: e.payment_method ?? "",
      vat: e.vat_deductible ? "✓" : "",
    });
  }
  styleBody(wsExp);

  // ── Sheet 5: 📊 누계 ──────────────────────────────────
  const wsSum = wb.addWorksheet("📊 누계", {
    properties: { tabColor: { argb: "FF6366F1" } },
  });
  wsSum.columns = [
    { header: "항목", key: "label", width: 30 },
    { header: "값", key: "value", width: 24 },
    { header: "비고", key: "note", width: 50 },
  ];
  styleHeader(wsSum.getRow(1));

  const revenueConfirmed = invoices
    .filter((i) => i.payment_status !== "canceled")
    .reduce((s, i) => s + (i.net_amount ?? 0), 0);
  const paidIn = invoices.reduce((s, i) => s + (i.paid_amount ?? 0), 0);
  const outstanding = invoices
    .filter((i) => i.payment_status === "unpaid" || i.payment_status === "partial")
    .reduce((s, i) => s + (i.outstanding_amount ?? Math.max((i.net_amount ?? 0) - (i.paid_amount ?? 0), 0)), 0);
  const expenseTotal = expenses.reduce((s, e) => s + (e.amount ?? 0), 0);
  const profit = revenueConfirmed - expenseTotal;
  const activeProjects = projects.filter((p) => p.status === "in_progress").length;
  const overdueCount = projects.filter((p) => {
    if (p.status !== "in_progress" || !p.due_date) return false;
    const due = toKstDate(p.due_date);
    const dueUtc = Date.UTC(due.getFullYear(), due.getMonth(), due.getDate());
    return Math.round((todayUtc - dueUtc) / 86_400_000) > 0;
  }).length;

  wsSum.addRows([
    { label: `📅 기준 일자`, value: kstToday(now), note: `이 주 ${kstWeekStart(now)} / 이 달 ${kstMonthStart(now)}` },
    { label: `📊 ${monthLabel} 매출 확정`, value: revenueConfirmed, note: `취소 제외` },
    { label: `💰 ${monthLabel} 입금 완료`, value: paidIn, note: `누계` },
    { label: `🟡 ${monthLabel} 입금 대기`, value: outstanding, note: `unpaid + partial` },
    { label: `💸 ${monthLabel} 지출`, value: expenseTotal, note: `${expenses.length}건` },
    { label: `💎 ${monthLabel} 영업이익`, value: profit, note: profit < 0 ? `⚠️ 적자` : `흑자` },
    { label: `🚀 진행 중 외주`, value: activeProjects, note: `${overdueCount}건 지연` },
    { label: `📥 ${monthLabel} 신규 리드`, value: leads.length, note: `채널별: ${leads.map((l) => l.channel).join(", ") || "-"}` },
    { label: `📋 오늘 할 일 (활성)`, value: todayTasks.length, note: `완료 ${todayCompleted.length}` },
    { label: `📆 이 주 할 일`, value: weekTasks.length, note: kstWeekStart(now) },
    { label: `🗓 이 달 할 일`, value: monthTasks.length, note: monthLabel },
  ]);
  // 숫자 셀 포맷
  for (let r = 2; r <= wsSum.rowCount; r++) {
    const valCell = wsSum.getRow(r).getCell("value");
    if (typeof valCell.value === "number") valCell.numFmt = "#,##0";
  }
  // 적자 행 강조
  for (let r = 2; r <= wsSum.rowCount; r++) {
    const label = String(wsSum.getRow(r).getCell("label").value ?? "");
    if (label.includes("영업이익") && profit < 0) {
      wsSum.getRow(r).eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFE4E6" } };
        cell.font = { ...cell.font, bold: true, color: { argb: "FFB91C1C" } };
      });
    }
  }
  styleBody(wsSum);

  // ── 파일명 & 버퍼 출력 ─────────────────────────────────
  const ts = `${monthLabel}-${String(kstNow.getDate()).padStart(2, "0")}_${String(kstNow.getHours()).padStart(2, "0")}${String(kstNow.getMinutes()).padStart(2, "0")}`;
  const filename = `AIO_업무관리_${ts}.xlsx`;
  const arrayBuf = await wb.xlsx.writeBuffer();
  const buffer = Buffer.from(arrayBuf as ArrayBuffer);

  return {
    buffer,
    filename,
    summary: {
      tasks: {
        today: todayTasks.length,
        week: weekTasks.length,
        month: monthTasks.length,
        completedToday: todayCompleted.length,
      },
      activeProjects,
      overdue: overdueCount,
      monthRevenue: revenueConfirmed,
      monthPaid: paidIn,
      monthExpense: expenseTotal,
    },
  };
}
