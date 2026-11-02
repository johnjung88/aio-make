import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase";

export const channels = ["website", "soomgo", "kmong", "wishket", "elancer", "notefolio", "upwork", "contra", "cafe24", "referral", "other"] as const;
export const categories = ["website", "shop", "logo", "detail", "ppt", "automation", "video", "bundle", "other"] as const;
export const projectStatuses = ["in_progress", "blocked", "review", "completed", "canceled"] as const;

export type ContractChannel = (typeof channels)[number];
export type ContractCategory = (typeof categories)[number];
export type ProjectStatus = (typeof projectStatuses)[number];

export type CreateContractPayload = {
  customerName: string;
  companyName?: string;
  email?: string;
  phone?: string;
  channel: ContractChannel;
  category: ContractCategory;
  productName: string;
  contractedAmount: number;
  paidAmount?: number;
  startDate?: string;
  dueDate?: string;
  notes?: string;
  sourceMeta?: Record<string, unknown>;
};

export type UpdateContractPayload = {
  projectId: string;
  invoiceId?: string;
  status?: ProjectStatus;
  dueDate?: string;
  paidAmount?: number;
};

export type ContractMutationResult = {
  leadId: string;
  projectId: string;
  invoiceId: string;
};

export function paymentStatus(netAmount: number, paidAmount: number): "unpaid" | "partial" | "paid" {
  if (paidAmount <= 0) return "unpaid";
  if (paidAmount >= netAmount) return "paid";
  return "partial";
}

export async function createContractRecord(payload: CreateContractPayload): Promise<ContractMutationResult> {
  const supabase = createSupabaseAdminClient();
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .insert({
      channel: payload.channel,
      customer_name: payload.customerName,
      company_name: payload.companyName || null,
      email: payload.email || null,
      phone: payload.phone || null,
      last_contact_at: new Date().toISOString(),
      source_meta: payload.sourceMeta ?? { created_from: "admin_contract" },
    })
    .select("id")
    .single<{ id: string }>();

  if (leadError || !lead) {
    throw new Error(leadError?.message ?? "Lead was not saved");
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      lead_id: lead.id,
      channel: payload.channel,
      category: payload.category,
      product_name: payload.productName,
      contracted_amount: payload.contractedAmount,
      start_date: payload.startDate || null,
      due_date: payload.dueDate || null,
      status: "in_progress",
      notes: payload.notes || null,
    })
    .select("id")
    .single<{ id: string }>();

  if (projectError || !project) {
    throw new Error(projectError?.message ?? "Project was not saved");
  }

  const paidAmount = Math.min(payload.paidAmount ?? 0, payload.contractedAmount);
  const status = paymentStatus(payload.contractedAmount, paidAmount);
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      project_id: project.id,
      lead_id: lead.id,
      channel: payload.channel,
      gross_amount: payload.contractedAmount,
      net_amount: payload.contractedAmount,
      paid_amount: paidAmount,
      outstanding_amount: Math.max(payload.contractedAmount - paidAmount, 0),
      payment_status: status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
      due_date: payload.dueDate || null,
      contracted_at: new Date().toISOString(),
    })
    .select("id")
    .single<{ id: string }>();

  if (invoiceError || !invoice) {
    throw new Error(invoiceError?.message ?? "Invoice was not saved");
  }

  return { leadId: lead.id, projectId: project.id, invoiceId: invoice.id };
}

export async function updateContractRecord(payload: UpdateContractPayload): Promise<void> {
  const supabase = createSupabaseAdminClient();
  const projectUpdate: Record<string, string | null> = {};
  if (payload.status) {
    projectUpdate.status = payload.status;
    projectUpdate.completed_date = payload.status === "completed" ? new Date().toISOString().slice(0, 10) : null;
  }
  if (payload.dueDate !== undefined) projectUpdate.due_date = payload.dueDate || null;

  if (Object.keys(projectUpdate).length > 0) {
    const { error } = await supabase.from("projects").update(projectUpdate).eq("id", payload.projectId);
    if (error) throw new Error(error.message);
  }

  if (payload.status === "canceled") {
    await cancelProjectInvoices(payload.projectId, payload.invoiceId);
    return;
  }

  if (payload.status) {
    await restoreProjectInvoices(payload.projectId, payload.invoiceId);
  }

  if (payload.invoiceId && payload.paidAmount !== undefined) {
    await updateInvoicePayment(payload.invoiceId, payload.paidAmount);
  }
}

async function cancelProjectInvoices(projectId: string, invoiceId?: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("invoices")
    .update({
      outstanding_amount: 0,
      payment_status: "canceled",
      paid_at: null,
    })
    .eq("project_id", projectId);

  if (invoiceId) query = query.eq("id", invoiceId);
  const { error } = await query;
  if (error) throw new Error(error.message);
}

async function restoreProjectInvoices(projectId: string, invoiceId?: string): Promise<void> {
  const supabase = createSupabaseAdminClient();
  let readQuery = supabase
    .from("invoices")
    .select("id, net_amount, paid_amount, payment_status")
    .eq("project_id", projectId)
    .eq("payment_status", "canceled");

  if (invoiceId) readQuery = readQuery.eq("id", invoiceId);
  const { data, error } = await readQuery;
  if (error) throw new Error(error.message);

  for (const invoice of data ?? []) {
    const paidAmount = Math.min(invoice.paid_amount ?? 0, invoice.net_amount ?? 0);
    const status = paymentStatus(invoice.net_amount ?? 0, paidAmount);
    const { error: updateError } = await supabase
      .from("invoices")
      .update({
        paid_amount: paidAmount,
        outstanding_amount: Math.max((invoice.net_amount ?? 0) - paidAmount, 0),
        payment_status: status,
        paid_at: status === "paid" ? new Date().toISOString() : null,
      })
      .eq("id", invoice.id);
    if (updateError) throw new Error(updateError.message);
  }
}

export async function updateInvoicePayment(invoiceId: string, paidAmountInput: number): Promise<{
  paidAmount: number;
  outstandingAmount: number;
  paymentStatus: "unpaid" | "partial" | "paid";
}> {
  const supabase = createSupabaseAdminClient();
  const { data: invoice, error: readError } = await supabase
    .from("invoices")
    .select("net_amount")
    .eq("id", invoiceId)
    .single<{ net_amount: number }>();

  if (readError || !invoice) {
    throw new Error(readError?.message ?? "Invoice not found");
  }

  const paidAmount = Math.min(paidAmountInput, invoice.net_amount);
  const status = paymentStatus(invoice.net_amount, paidAmount);
  const outstandingAmount = Math.max(invoice.net_amount - paidAmount, 0);
  const { error } = await supabase
    .from("invoices")
    .update({
      paid_amount: paidAmount,
      outstanding_amount: outstandingAmount,
      payment_status: status,
      paid_at: status === "paid" ? new Date().toISOString() : null,
    })
    .eq("id", invoiceId);

  if (error) throw new Error(error.message);
  return { paidAmount, outstandingAmount, paymentStatus: status };
}

export async function findLatestInvoiceForCustomer(payload: {
  projectId?: string;
  customerName?: string;
  email?: string;
  phone?: string;
}): Promise<{ projectId: string; invoiceId: string } | null> {
  const supabase = createSupabaseAdminClient();

  if (payload.projectId) {
    const { data } = await supabase
      .from("invoices")
      .select("id, project_id")
      .eq("project_id", payload.projectId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ id: string; project_id: string }>();
    return data ? { projectId: data.project_id, invoiceId: data.id } : null;
  }

  let leadQuery = supabase.from("leads").select("id");
  if (payload.email) {
    leadQuery = leadQuery.eq("email", payload.email);
  } else if (payload.phone) {
    leadQuery = leadQuery.eq("phone", payload.phone);
  } else if (payload.customerName) {
    leadQuery = leadQuery.ilike("customer_name", `%${payload.customerName}%`);
  } else {
    return null;
  }

  const { data: lead } = await leadQuery.order("created_at", { ascending: false }).limit(1).maybeSingle<{ id: string }>();
  if (!lead) return null;

  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("lead_id", lead.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (!project) return null;

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id")
    .eq("project_id", project.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ id: string }>();
  if (!invoice) return null;

  return { projectId: project.id, invoiceId: invoice.id };
}
