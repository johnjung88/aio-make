import "server-only";

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";

export type InboxItem = {
  requestId: string;
  responseId?: string;
  leadId?: string;
  channel: string;
  customerName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  rawText: string;
  category?: string;
  status: string;
  urgency?: string;
  budget?: number;
  deadlineText?: string;
  createdAt: string;
  source?: string;
  entryPath?: string;
  serviceKey?: string;
  assignedPmQueue?: string;
  handoffStatus?: string;
  handoffReason?: string;
  notificationStatus?: string;
  responseText?: string;
  sentAt?: string;
};

export type DashboardMetrics = {
  totalLeads: number;
  newRequests: number;
  sentQuotes: number;
  contracted: number;
  revenue: number;
  activeProjects: number;
  dueSoon: number;
  unpaidAmount: number;
};

const EMPTY_METRICS: DashboardMetrics = {
  totalLeads: 0,
  newRequests: 0,
  sentQuotes: 0,
  contracted: 0,
  revenue: 0,
  activeProjects: 0,
  dueSoon: 0,
  unpaidAmount: 0,
};

export type AdminContract = {
  projectId: string;
  invoiceId?: string;
  leadId?: string;
  customerName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  channel: string;
  category?: string;
  productName: string;
  contractedAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: string;
  projectStatus: string;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  notes?: string;
  createdAt: string;
};

export type AdminCustomer = {
  leadId: string;
  customerName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  channel: string;
  tags: string[];
  notes?: string;
  lastContactAt?: string;
  createdAt: string;
  quoteCount: number;
  projectCount: number;
  paidRevenue: number;
  latestCategory?: string;
  latestStatus?: string;
};

function getLeadField(lead: unknown, field: string): string | undefined {
  if (!lead || typeof lead !== "object") return undefined;
  const value = (lead as Record<string, unknown>)[field];
  return typeof value === "string" ? value : undefined;
}

function getLeadMetaField(lead: unknown, field: string): string | undefined {
  if (!lead || typeof lead !== "object") return undefined;
  const sourceMeta = (lead as Record<string, unknown>).source_meta;
  if (!sourceMeta || typeof sourceMeta !== "object") return undefined;
  const value = (sourceMeta as Record<string, unknown>)[field];
  return typeof value === "string" ? value : undefined;
}

function toInboxItem(row: Record<string, unknown>): InboxItem {
  const lead = Array.isArray(row.leads) ? row.leads[0] : row.leads;
  const responses = Array.isArray(row.quote_responses) ? row.quote_responses : [];
  const response = responses[0] as Record<string, unknown> | undefined;

  return {
    requestId: String(row.id),
    responseId: response?.id ? String(response.id) : undefined,
    leadId: row.lead_id ? String(row.lead_id) : undefined,
    channel: String(row.channel ?? row.source ?? "website"),
    customerName: getLeadField(lead, "customer_name") ?? "이름 미입력",
    companyName: getLeadField(lead, "company_name"),
    email: getLeadField(lead, "email"),
    phone: getLeadField(lead, "phone"),
    rawText: String(row.raw_text ?? ""),
    category: row.category ? String(row.category) : undefined,
    status: String(row.status ?? "new"),
    urgency: row.urgency ? String(row.urgency) : undefined,
    budget: typeof row.budget === "number" ? row.budget : undefined,
    deadlineText: row.deadline_text ? String(row.deadline_text) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    source: getLeadMetaField(lead, "source"),
    entryPath: getLeadMetaField(lead, "entry_path"),
    serviceKey: getLeadMetaField(lead, "service_key"),
    assignedPmQueue: getLeadMetaField(lead, "assigned_pm_queue"),
    handoffStatus: getLeadMetaField(lead, "handoff_status"),
    handoffReason: getLeadMetaField(lead, "handoff_reason"),
    notificationStatus: getLeadMetaField(lead, "notification_status"),
    responseText: response?.edited_text || response?.ai_generated_text ? String(response.edited_text || response.ai_generated_text) : undefined,
    sentAt: response?.sent_at ? String(response.sent_at) : undefined,
  };
}

export async function getInboxItems(limit = 50): Promise<{ items: InboxItem[]; error?: string }> {
  if (!hasSupabaseAdminConfig()) {
    return { items: [], error: "Supabase 관리자 환경변수가 없어 로컬 빈 인박스로 표시합니다." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("quote_requests")
      .select(
        "id, lead_id, channel, raw_text, category, status, urgency, budget, deadline_text, created_at, leads(customer_name, company_name, email, phone, source_meta), quote_responses(id, edited_text, ai_generated_text, sent_at)",
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { items: [], error: error.message };
    return { items: ((data ?? []) as Record<string, unknown>[]).map(toInboxItem) };
  } catch (error) {
    return {
      items: [],
      error: error instanceof Error ? error.message : "인박스를 불러오지 못했습니다.",
    };
  }
}

export async function getDashboardMetrics(): Promise<{ metrics: DashboardMetrics; recentItems: InboxItem[]; error?: string }> {
  const { items, error } = await getInboxItems(8);
  if (!hasSupabaseAdminConfig()) {
    return { metrics: EMPTY_METRICS, recentItems: items, error };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const today = new Date();
    const soon = new Date(today);
    soon.setDate(today.getDate() + 7);
    const [leadsCount, newCount, sentCount, contractedCount, activeProjects, dueSoonProjects, invoiceRows] = await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "sent"),
      supabase.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "contracted"),
      supabase.from("projects").select("id", { count: "exact", head: true }).in("status", ["in_progress", "blocked", "review"]),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .in("status", ["in_progress", "blocked", "review"])
        .lte("due_date", soon.toISOString().slice(0, 10)),
      supabase.from("invoices").select("net_amount, paid_amount, outstanding_amount, paid_at, payment_status"),
    ]);

    const invoices = (invoiceRows.data ?? []) as Array<{
      net_amount?: number;
      paid_amount?: number;
      outstanding_amount?: number;
      paid_at?: string | null;
      payment_status?: string | null;
    }>;
    const revenue = invoices.reduce((sum, row) => sum + (row.paid_amount ?? (row.paid_at ? row.net_amount ?? 0 : 0)), 0);
    const unpaidAmount = invoices.reduce(
      (sum, row) => sum + (row.outstanding_amount ?? Math.max((row.net_amount ?? 0) - (row.paid_amount ?? (row.paid_at ? row.net_amount ?? 0 : 0)), 0)),
      0,
    );
    return {
      metrics: {
        totalLeads: leadsCount.count ?? 0,
        newRequests: newCount.count ?? 0,
        sentQuotes: sentCount.count ?? 0,
        contracted: contractedCount.count ?? 0,
        revenue,
        activeProjects: activeProjects.count ?? 0,
        dueSoon: dueSoonProjects.count ?? 0,
        unpaidAmount,
      },
      recentItems: items,
      error,
    };
  } catch (metricsError) {
    return {
      metrics: EMPTY_METRICS,
      recentItems: items,
      error: metricsError instanceof Error ? metricsError.message : error,
    };
  }
}

function toContract(row: Record<string, unknown>): AdminContract {
  const lead = Array.isArray(row.leads) ? row.leads[0] : row.leads;
  const invoices = Array.isArray(row.invoices) ? row.invoices : [];
  const invoice = invoices[0] as Record<string, unknown> | undefined;
  const amount = typeof row.contracted_amount === "number" ? row.contracted_amount : 0;
  const netAmount = typeof invoice?.net_amount === "number" ? invoice.net_amount : amount;
  const paidAmount =
    typeof invoice?.paid_amount === "number"
      ? invoice.paid_amount
      : invoice?.paid_at
        ? netAmount
        : 0;

  return {
    projectId: String(row.id),
    invoiceId: invoice?.id ? String(invoice.id) : undefined,
    leadId: row.lead_id ? String(row.lead_id) : undefined,
    customerName: getLeadField(lead, "customer_name") ?? "이름 미입력",
    companyName: getLeadField(lead, "company_name"),
    email: getLeadField(lead, "email"),
    phone: getLeadField(lead, "phone"),
    channel: String(row.channel ?? "other"),
    category: row.category ? String(row.category) : undefined,
    productName: String(row.product_name ?? "계약명 미입력"),
    contractedAmount: amount,
    paidAmount,
    outstandingAmount:
      typeof invoice?.outstanding_amount === "number" ? invoice.outstanding_amount : Math.max(netAmount - paidAmount, 0),
    paymentStatus: String(invoice?.payment_status ?? (invoice?.paid_at ? "paid" : "unpaid")),
    projectStatus: String(row.status ?? "in_progress"),
    startDate: row.start_date ? String(row.start_date) : undefined,
    dueDate: row.due_date ? String(row.due_date) : undefined,
    completedDate: row.completed_date ? String(row.completed_date) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

export async function getContracts(limit = 100): Promise<{ contracts: AdminContract[]; error?: string }> {
  if (!hasSupabaseAdminConfig()) {
    return { contracts: [], error: "Supabase 관리자 환경변수가 없어 계약 데이터를 표시할 수 없습니다." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, lead_id, channel, category, product_name, contracted_amount, start_date, due_date, completed_date, status, notes, created_at, leads(customer_name, company_name, email, phone), invoices(id, net_amount, paid_amount, outstanding_amount, payment_status, paid_at)",
      )
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { contracts: [], error: error.message };
    return { contracts: ((data ?? []) as Record<string, unknown>[]).map(toContract) };
  } catch (error) {
    return { contracts: [], error: error instanceof Error ? error.message : "계약 데이터를 불러오지 못했습니다." };
  }
}

function toCustomer(row: Record<string, unknown>): AdminCustomer {
  const quoteRequests = Array.isArray(row.quote_requests) ? (row.quote_requests as Record<string, unknown>[]) : [];
  const projects = Array.isArray(row.projects) ? (row.projects as Record<string, unknown>[]) : [];
  const invoices = Array.isArray(row.invoices) ? (row.invoices as Record<string, unknown>[]) : [];
  const latestQuote = quoteRequests[0];

  return {
    leadId: String(row.id),
    customerName: String(row.customer_name ?? "이름 미입력"),
    companyName: row.company_name ? String(row.company_name) : undefined,
    email: row.email ? String(row.email) : undefined,
    phone: row.phone ? String(row.phone) : undefined,
    channel: String(row.channel ?? "other"),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    notes: row.notes ? String(row.notes) : undefined,
    lastContactAt: row.last_contact_at ? String(row.last_contact_at) : undefined,
    createdAt: String(row.created_at ?? new Date().toISOString()),
    quoteCount: quoteRequests.length,
    projectCount: projects.length,
    paidRevenue: invoices.reduce((sum, invoice) => sum + (typeof invoice.paid_amount === "number" ? invoice.paid_amount : invoice.paid_at ? Number(invoice.net_amount ?? 0) : 0), 0),
    latestCategory: latestQuote?.category ? String(latestQuote.category) : undefined,
    latestStatus: latestQuote?.status ? String(latestQuote.status) : undefined,
  };
}

export async function getCustomers(limit = 200): Promise<{ customers: AdminCustomer[]; error?: string }> {
  if (!hasSupabaseAdminConfig()) {
    return { customers: [], error: "Supabase 관리자 환경변수가 없어 고객 DB를 표시할 수 없습니다." };
  }

  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("leads")
      .select(
        "id, channel, customer_name, company_name, email, phone, tags, notes, last_contact_at, created_at, quote_requests(id, category, status, created_at), projects(id, status, contracted_amount), invoices(id, net_amount, paid_amount, paid_at)",
      )
      .order("last_contact_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) return { customers: [], error: error.message };
    return { customers: ((data ?? []) as Record<string, unknown>[]).map(toCustomer) };
  } catch (error) {
    return { customers: [], error: error instanceof Error ? error.message : "고객 DB를 불러오지 못했습니다." };
  }
}

/**
 * 폼 저장 실패 시 fallback 테이블(ada_inquiries)에 쌓인 미연동 문의 수를 반환합니다.
 * 테이블이 없는 환경(로컬)에서는 0을 반환합니다.
 */
export async function getAdaInquiriesCount(): Promise<number> {
  if (!hasSupabaseAdminConfig()) return 0;
  try {
    const supabase = createSupabaseAdminClient();
    const { count, error } = await supabase
      .from("ada_inquiries")
      .select("id", { count: "exact", head: true });
    if (error) return 0; // 테이블 미존재 또는 접근 불가 시 조용히 0
    return count ?? 0;
  } catch {
    return 0;
  }
}
