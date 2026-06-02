import "server-only";

import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
export { EXPENSE_CATEGORIES, RECURRING_CYCLES, PAYMENT_METHODS } from "@/lib/admin/expenses-config";

export type Expense = {
  id: string;
  date: string;
  category: string;
  vendor?: string;
  item: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  vatDeductible: boolean;
  recurring: boolean;
  notes?: string;
  createdAt: string;
};

export type RecurringExpense = {
  id: string;
  vendor: string;
  item: string;
  category: string;
  amount?: number;
  currency: string;
  cycle: string;
  nextCharge?: string;
  active: boolean;
  vatDeductible: boolean;
  notes?: string;
  createdAt: string;
};


function toExpense(row: Record<string, unknown>): Expense {
  return {
    id: String(row.id),
    date: String(row.date),
    category: String(row.category ?? "other"),
    vendor: row.vendor ? String(row.vendor) : undefined,
    item: String(row.item ?? ""),
    amount: typeof row.amount === "number" ? row.amount : 0,
    currency: String(row.currency ?? "KRW"),
    paymentMethod: row.payment_method ? String(row.payment_method) : undefined,
    vatDeductible: Boolean(row.vat_deductible),
    recurring: Boolean(row.recurring),
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: String(row.created_at ?? ""),
  };
}

function toRecurring(row: Record<string, unknown>): RecurringExpense {
  return {
    id: String(row.id),
    vendor: String(row.vendor ?? ""),
    item: String(row.item ?? ""),
    category: String(row.category ?? "other"),
    amount: typeof row.amount === "number" ? row.amount : undefined,
    currency: String(row.currency ?? "KRW"),
    cycle: String(row.cycle ?? "monthly"),
    nextCharge: row.next_charge ? String(row.next_charge) : undefined,
    active: Boolean(row.active),
    vatDeductible: Boolean(row.vat_deductible),
    notes: row.notes ? String(row.notes) : undefined,
    createdAt: String(row.created_at ?? ""),
  };
}

export async function getExpenses(limit = 100): Promise<{ expenses: Expense[]; error?: string }> {
  if (!hasSupabaseAdminConfig()) return { expenses: [], error: "Supabase 관리자 환경변수 없음" };
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("expenses")
      .select("id, date, category, vendor, item, amount, currency, payment_method, vat_deductible, recurring, notes, created_at")
      .order("date", { ascending: false })
      .limit(limit);
    if (error) return { expenses: [], error: error.message };
    return { expenses: ((data ?? []) as Record<string, unknown>[]).map(toExpense) };
  } catch (err) {
    return { expenses: [], error: err instanceof Error ? err.message : "지출 데이터를 불러오지 못했습니다." };
  }
}

export async function getRecurringExpenses(): Promise<{ recurring: RecurringExpense[]; error?: string }> {
  if (!hasSupabaseAdminConfig()) return { recurring: [], error: "Supabase 관리자 환경변수 없음" };
  try {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("recurring_expenses")
      .select("id, vendor, item, category, amount, currency, cycle, next_charge, active, vat_deductible, notes, created_at")
      .order("active", { ascending: false })
      .order("next_charge", { ascending: true, nullsFirst: false });
    if (error) return { recurring: [], error: error.message };
    return { recurring: ((data ?? []) as Record<string, unknown>[]).map(toRecurring) };
  } catch (err) {
    return { recurring: [], error: err instanceof Error ? err.message : "정기구독 데이터를 불러오지 못했습니다." };
  }
}
