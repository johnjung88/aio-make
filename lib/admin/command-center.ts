import "server-only";

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
import { getContracts, getInboxItems, type AdminContract, type InboxItem } from "@/lib/admin/data";
import { getRevenueReport } from "@/lib/admin/revenue";
import { kstToday, listMonthTasks, listTodayTasks, listWeekTasks, type TaskRow } from "@/lib/admin/tasks";

export type ApprovalType =
  | "customer_message"
  | "price_due_date"
  | "contract_payment"
  | "refund_settlement"
  | "portfolio_publish"
  | "tracking_live"
  | "risk_escalation";

export type ApprovalItem = {
  id: string;
  title: string;
  type: ApprovalType;
  status: "pending" | "approved" | "rejected" | "on_hold";
  priority: "P0" | "P1" | "P2";
  requestedBy: string;
  targetType?: string;
  targetId?: string;
  dueAt?: string;
  summary?: string;
  source: "approval_requests" | "virtual_gate";
  createdAt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  kind: "task" | "project_due" | "inquiry" | "approval" | "invoice";
  status?: string;
  owner?: string;
  sourceId?: string;
  priority?: "P0" | "P1" | "P2";
  scope?: "today" | "week" | "month";
  notes?: string | null;
  editable?: boolean;
  href: string;
};

export type WorkItem = {
  id: string;
  title: string;
  lane: "today" | "week" | "month" | "project" | "blocked";
  priority: "P0" | "P1" | "P2";
  status: string;
  owner: string;
  dueDate?: string;
  href: string;
};

export type RiskItem = {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  reason: string;
  href: string;
};

export type MarketingSnapshot = {
  activeCampaigns: number;
  activeTrackingLinks: number;
  sessions30d: number;
  conversions30d: number;
  events30d: number;
  topSources: Array<{ source: string; sessions: number }>;
};

export type CommandCenterData = {
  generatedAt: string;
  hasSupabaseAdminConfig: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    todayNewInquiries: number;
    pendingApprovals: number;
    todaySchedule: number;
    next7Schedule: number;
    dueSoonProjects: number;
    activeProjects: number;
    blockedWork: number;
    unpaidAmount: number;
    paidThisMonth: number;
    expenseThisMonth: number;
    netThisMonth: number;
    sessions30d: number;
    conversions30d: number;
  };
  recentInquiries: InboxItem[];
  contracts: AdminContract[];
  approvals: ApprovalItem[];
  calendarEvents: CalendarEvent[];
  workItems: WorkItem[];
  risks: RiskItem[];
  marketing: MarketingSnapshot;
};

type RawApproval = Record<string, unknown>;

const EMPTY_MARKETING: MarketingSnapshot = {
  activeCampaigns: 0,
  activeTrackingLinks: 0,
  sessions30d: 0,
  conversions30d: 0,
  events30d: 0,
  topSources: [],
};

function dateOnly(value?: string | null): string | undefined {
  if (!value) return undefined;
  return value.slice(0, 10);
}

function withinDays(date?: string, days = 7): boolean {
  if (!date) return false;
  const target = new Date(`${date.slice(0, 10)}T00:00:00+09:00`).getTime();
  const now = new Date(`${kstToday()}T00:00:00+09:00`).getTime();
  return target >= now && target <= now + days * 86_400_000;
}

function isToday(date?: string): boolean {
  return Boolean(date && date.slice(0, 10) === kstToday());
}

function normalizePriority(value: unknown): "P0" | "P1" | "P2" {
  return value === "P0" || value === "P1" || value === "P2" ? value : "P1";
}

function normalizeApprovalType(value: unknown): ApprovalType {
  const known: ApprovalType[] = [
    "customer_message",
    "price_due_date",
    "contract_payment",
    "refund_settlement",
    "portfolio_publish",
    "tracking_live",
    "risk_escalation",
  ];
  return typeof value === "string" && known.includes(value as ApprovalType) ? (value as ApprovalType) : "risk_escalation";
}

function toApproval(row: RawApproval): ApprovalItem {
  return {
    id: String(row.id),
    title: String(row.title ?? "승인 요청"),
    type: normalizeApprovalType(row.approval_type ?? row.type),
    status:
      row.status === "approved" || row.status === "rejected" || row.status === "on_hold"
        ? row.status
        : "pending",
    priority: normalizePriority(row.priority),
    requestedBy: String(row.requested_by ?? "admin"),
    targetType: row.target_type ? String(row.target_type) : undefined,
    targetId: row.target_id ? String(row.target_id) : undefined,
    dueAt: row.due_at ? String(row.due_at) : undefined,
    summary: row.summary ? String(row.summary) : undefined,
    source: "approval_requests",
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

function virtualApprovals(inquiries: InboxItem[], contracts: AdminContract[]): ApprovalItem[] {
  const inquiryApprovals = inquiries
    .filter((item) => ["new", "draft", "replied"].includes(item.status))
    .slice(0, 8)
    .map((item): ApprovalItem => ({
      id: `virtual-inquiry-${item.requestId}`,
      title: `${item.customerName} 문의 응답 검토`,
      type: "customer_message",
      status: "pending",
      priority: item.urgency === "very_urgent" || item.urgency === "urgent" ? "P0" : "P1",
      requestedBy: "aio_pm_insales",
      targetType: "quote_request",
      targetId: item.requestId,
      summary: item.rawText.slice(0, 140),
      source: "virtual_gate",
      createdAt: item.createdAt,
    }));

  const contractApprovals = contracts
    .filter((contract) => contract.projectStatus === "blocked" || contract.outstandingAmount > 0 || withinDays(contract.dueDate, 7))
    .slice(0, 8)
    .map((contract): ApprovalItem => ({
      id: `virtual-contract-${contract.projectId}`,
      title: `${contract.customerName} ${contract.projectStatus === "blocked" ? "blocked" : "납기/미수"} 검토`,
      type: contract.outstandingAmount > 0 ? "contract_payment" : "risk_escalation",
      status: "pending",
      priority: contract.projectStatus === "blocked" || withinDays(contract.dueDate, 3) ? "P0" : "P1",
      requestedBy: contract.outstandingAmount > 0 ? "aio_director_finance" : "aio_pm_insales",
      targetType: "project",
      targetId: contract.projectId,
      dueAt: contract.dueDate,
      summary: `${contract.productName} · ${contract.paymentStatus} · 미수 ${contract.outstandingAmount.toLocaleString("ko-KR")}원`,
      source: "virtual_gate",
      createdAt: contract.createdAt,
    }));

  return [...inquiryApprovals, ...contractApprovals];
}

function taskToWorkItem(task: TaskRow, lane: "today" | "week" | "month"): WorkItem {
  return {
    id: task.id,
    title: task.title,
    lane,
    priority: task.priority,
    status: task.status,
    owner: "aio_staff_secretary",
    dueDate: task.due_date ?? task.scope_date,
    href: "/admin/work",
  };
}

function contractToWorkItem(contract: AdminContract): WorkItem {
  return {
    id: contract.projectId,
    title: contract.productName,
    lane: contract.projectStatus === "blocked" ? "blocked" : "project",
    priority: contract.projectStatus === "blocked" || withinDays(contract.dueDate, 3) ? "P0" : "P1",
    status: contract.projectStatus,
    owner: "aio_pm_insales",
    dueDate: contract.dueDate,
    href: "/admin/contracts",
  };
}

function buildCalendarEvents(
  tasks: TaskRow[],
  inquiries: InboxItem[],
  contracts: AdminContract[],
  approvals: ApprovalItem[],
): CalendarEvent[] {
  const taskEvents = tasks
    .filter((task) => task.due_date || task.scope_date)
    .map((task): CalendarEvent => ({
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
    }));

  const inquiryEvents = inquiries.slice(0, 20).map((item): CalendarEvent => ({
    id: `inquiry-${item.requestId}`,
    title: `${item.customerName} 문의`,
    date: item.createdAt.slice(0, 10),
    kind: "inquiry",
    status: item.status,
    owner: item.assignedPmQueue ?? "aio_pm_insales",
    href: "/admin/inbox",
  }));

  const contractEvents = contracts
    .filter((contract) => contract.dueDate)
    .map((contract): CalendarEvent => ({
      id: `project-${contract.projectId}`,
      title: `${contract.customerName} 납기`,
      date: contract.dueDate as string,
      kind: "project_due",
      status: contract.projectStatus,
      owner: "service_pm",
      href: "/admin/contracts",
    }));

  const approvalEvents = approvals
    .filter((approval) => approval.dueAt)
    .map((approval): CalendarEvent => ({
      id: `approval-${approval.id}`,
      title: approval.title,
      date: dateOnly(approval.dueAt) as string,
      kind: "approval",
      status: approval.status,
      owner: approval.requestedBy,
      href: "/admin/approvals",
    }));

  return [...taskEvents, ...inquiryEvents, ...contractEvents, ...approvalEvents].sort((a, b) => a.date.localeCompare(b.date));
}

function buildRisks(contracts: AdminContract[], approvals: ApprovalItem[], workItems: WorkItem[]): RiskItem[] {
  const blockedProjects = contracts
    .filter((contract) => contract.projectStatus === "blocked")
    .map((contract): RiskItem => ({
      id: `blocked-${contract.projectId}`,
      title: `${contract.customerName} 프로젝트 blocked`,
      severity: "high",
      reason: contract.notes ?? "프로젝트 상태가 blocked입니다.",
      href: "/admin/contracts",
    }));

  const dueSoon = contracts
    .filter((contract) => contract.projectStatus !== "completed" && withinDays(contract.dueDate, 3))
    .map((contract): RiskItem => ({
      id: `due-${contract.projectId}`,
      title: `${contract.customerName} 3일 내 납기`,
      severity: "medium",
      reason: `${contract.dueDate}까지 ${contract.productName} 확인 필요`,
      href: "/admin/contracts",
    }));

  const p0Approvals = approvals
    .filter((approval) => approval.status === "pending" && approval.priority === "P0")
    .map((approval): RiskItem => ({
      id: `approval-${approval.id}`,
      title: approval.title,
      severity: "high",
      reason: "의장님 승인 전 실행 금지 항목입니다.",
      href: "/admin/approvals",
    }));

  const p0Work = workItems
    .filter((item) => item.priority === "P0" && item.status !== "completed")
    .slice(0, 4)
    .map((item): RiskItem => ({
      id: `work-${item.id}`,
      title: item.title,
      severity: item.lane === "blocked" ? "high" : "medium",
      reason: `${item.owner} · ${item.status}`,
      href: item.href,
    }));

  return [...blockedProjects, ...dueSoon, ...p0Approvals, ...p0Work].slice(0, 12);
}

async function getStoredApprovals(): Promise<{ approvals: ApprovalItem[]; warning?: string }> {
  if (!hasSupabaseAdminConfig()) return { approvals: [] };

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("approval_requests")
    .select("id, title, approval_type, status, priority, requested_by, target_type, target_id, due_at, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return {
      approvals: [],
      warning: "approval_requests 테이블이 아직 적용되지 않아 기존 운영 데이터로 승인대기를 가상 구성했습니다.",
    };
  }

  return { approvals: ((data ?? []) as RawApproval[]).map(toApproval) };
}

async function getMarketingSnapshot(): Promise<{ marketing: MarketingSnapshot; errors: string[] }> {
  if (!hasSupabaseAdminConfig()) return { marketing: EMPTY_MARKETING, errors: [] };

  const errors: string[] = [];
  const supabase = createSupabaseAdminClient();
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [campaigns, links, sessions, conversions, events, sourceRows] = await Promise.all([
    supabase.from("marketing_campaigns").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("tracking_links").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("visitor_sessions").select("id", { count: "exact", head: true }).gte("first_seen_at", since30),
    supabase.from("visitor_sessions").select("id", { count: "exact", head: true }).gte("first_seen_at", since30).eq("has_converted", true),
    supabase.from("visitor_events").select("id", { count: "exact", head: true }).gte("occurred_at", since30),
    supabase.from("visitor_sessions").select("first_utm_source").gte("first_seen_at", since30).not("first_utm_source", "is", null).limit(500),
  ]);

  for (const result of [campaigns, links, sessions, conversions, events, sourceRows]) {
    if (result.error) errors.push(result.error.message);
  }

  const sourceMap = new Map<string, number>();
  for (const row of (sourceRows.data ?? []) as Array<{ first_utm_source?: string | null }>) {
    const source = row.first_utm_source ?? "direct";
    sourceMap.set(source, (sourceMap.get(source) ?? 0) + 1);
  }

  return {
    marketing: {
      activeCampaigns: campaigns.count ?? 0,
      activeTrackingLinks: links.count ?? 0,
      sessions30d: sessions.count ?? 0,
      conversions30d: conversions.count ?? 0,
      events30d: events.count ?? 0,
      topSources: [...sourceMap.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([source, sessionCount]) => ({ source, sessions: sessionCount })),
    },
    errors,
  };
}

export async function getCommandCenterData(): Promise<CommandCenterData> {
  const generatedAt = new Date().toISOString();
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!hasSupabaseAdminConfig()) {
    warnings.push("Supabase 관리자 환경변수가 없어 로컬 빈 Command Center를 표시합니다.");
    return {
      generatedAt,
      hasSupabaseAdminConfig: false,
      errors,
      warnings,
      metrics: {
        todayNewInquiries: 0,
        pendingApprovals: 0,
        todaySchedule: 0,
        next7Schedule: 0,
        dueSoonProjects: 0,
        activeProjects: 0,
        blockedWork: 0,
        unpaidAmount: 0,
        paidThisMonth: 0,
        expenseThisMonth: 0,
        netThisMonth: 0,
        sessions30d: 0,
        conversions30d: 0,
      },
      recentInquiries: [],
      contracts: [],
      approvals: [],
      calendarEvents: [],
      workItems: [],
      risks: [],
      marketing: EMPTY_MARKETING,
    };
  }

  const [
    inboxResult,
    contractResult,
    revenue,
    approvalResult,
    todayTasks,
    weekTasks,
    monthTasks,
    marketingResult,
  ] = await Promise.all([
    getInboxItems(40),
    getContracts(80),
    getRevenueReport(),
    getStoredApprovals(),
    listTodayTasks(),
    listWeekTasks(),
    listMonthTasks(),
    getMarketingSnapshot(),
  ]);

  if (inboxResult.error) errors.push(inboxResult.error);
  if (contractResult.error) errors.push(contractResult.error);
  if (revenue?.dbError) warnings.push(revenue.dbError);
  if (approvalResult.warning) warnings.push(approvalResult.warning);
  errors.push(...marketingResult.errors.slice(0, 2));

  const virtual = virtualApprovals(inboxResult.items, contractResult.contracts);
  const materializedTargets = new Set(
    approvalResult.approvals
      .filter((item) => item.targetType && item.targetId)
      .map((item) => `${item.targetType}:${item.targetId}:${item.type}`),
  );
  const unresolvedVirtual = virtual.filter((item) => {
    if (!item.targetType || !item.targetId) return true;
    return !materializedTargets.has(`${item.targetType}:${item.targetId}:${item.type}`);
  });
  const approvals = [...approvalResult.approvals, ...unresolvedVirtual].sort((a, b) => {
    const priorityOrder = { P0: 0, P1: 1, P2: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority] || b.createdAt.localeCompare(a.createdAt);
  });
  const tasks = [...todayTasks, ...weekTasks, ...monthTasks];
  const workItems = [
    ...todayTasks.map((task) => taskToWorkItem(task, "today")),
    ...weekTasks.map((task) => taskToWorkItem(task, "week")),
    ...monthTasks.map((task) => taskToWorkItem(task, "month")),
    ...contractResult.contracts
      .filter((contract) => ["in_progress", "blocked", "review"].includes(contract.projectStatus))
      .map(contractToWorkItem),
  ];
  const calendarEvents = buildCalendarEvents(tasks, inboxResult.items, contractResult.contracts, approvals);
  const risks = buildRisks(contractResult.contracts, approvals, workItems);
  const activeProjects = contractResult.contracts.filter((contract) =>
    ["in_progress", "blocked", "review"].includes(contract.projectStatus),
  );

  return {
    generatedAt,
    hasSupabaseAdminConfig: true,
    errors: [...new Set(errors)],
    warnings: [...new Set(warnings)],
    metrics: {
      todayNewInquiries: inboxResult.items.filter((item) => isToday(item.createdAt) && item.status === "new").length,
      pendingApprovals: approvals.filter((approval) => approval.status === "pending").length,
      todaySchedule: calendarEvents.filter((event) => isToday(event.date)).length,
      next7Schedule: calendarEvents.filter((event) => withinDays(event.date, 7)).length,
      dueSoonProjects: contractResult.contracts.filter((contract) => withinDays(contract.dueDate, 7)).length,
      activeProjects: activeProjects.length,
      blockedWork: workItems.filter((item) => item.lane === "blocked" || item.status === "blocked").length,
      unpaidAmount: contractResult.contracts.reduce((sum, contract) => sum + contract.outstandingAmount, 0),
      paidThisMonth: revenue?.kpi.thisMonthRevenue ?? 0,
      expenseThisMonth: revenue?.kpi.thisMonthExpense ?? 0,
      netThisMonth: revenue?.kpi.thisMonthProfit ?? 0,
      sessions30d: marketingResult.marketing.sessions30d,
      conversions30d: marketingResult.marketing.conversions30d,
    },
    recentInquiries: inboxResult.items.slice(0, 10),
    contracts: contractResult.contracts,
    approvals: approvals.slice(0, 30),
    calendarEvents: calendarEvents.slice(0, 80),
    workItems: workItems.slice(0, 80),
    risks,
    marketing: marketingResult.marketing,
  };
}

export async function getAdminAuditLog(limit = 50): Promise<{ rows: RawApproval[]; error?: string }> {
  if (!hasSupabaseAdminConfig()) return { rows: [], error: "Supabase 관리자 환경변수가 없습니다." };
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .select("id, actor, action, target_type, target_id, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return { rows: [], error: error.message };
  return { rows: (data ?? []) as RawApproval[] };
}
