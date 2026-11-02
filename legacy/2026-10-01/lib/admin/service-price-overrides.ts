import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase";
import { servicesData, type ServiceDetail } from "@/lib/services-data";

export type ServicePriceOverrideRow = {
  id: string;
  service_id: string;
  item_type: "tier" | "addon";
  item_index: number;
  item_name: string;
  event_price: string | null;
  regular_price: string | null;
  duration: string | null;
  addon_price: string | null;
  is_active: boolean;
  updated_at: string;
};

export type ServicePriceOverrideInput = {
  serviceId: string;
  itemType: "tier" | "addon";
  itemIndex: number;
  itemName: string;
  eventPrice?: string | null;
  regularPrice?: string | null;
  duration?: string | null;
  addonPrice?: string | null;
};

function cloneServices(): ServiceDetail[] {
  return JSON.parse(JSON.stringify(servicesData)) as ServiceDetail[];
}

function clean(value?: string | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function applyServicePriceOverrides(
  services: ServiceDetail[],
  overrides: ServicePriceOverrideRow[],
): ServiceDetail[] {
  const active = overrides.filter((row) => row.is_active);

  for (const row of active) {
    const service = services.find((item) => item.id === row.service_id);
    if (!service) continue;

    if (row.item_type === "tier") {
      const tier = service.pricing[row.item_index];
      if (!tier) continue;
      if (row.event_price !== null) tier.eventPrice = row.event_price;
      if (row.regular_price !== null) tier.regularPrice = row.regular_price;
      if (row.duration !== null) tier.duration = row.duration;
      continue;
    }

    const addon = service.addons?.[row.item_index];
    if (!addon) continue;
    if (row.addon_price !== null) addon.price = row.addon_price;
  }

  return services;
}

export async function getServicePriceOverrides(): Promise<ServicePriceOverrideRow[]> {
  noStore();

  if (!hasSupabaseAdminConfig()) return [];

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("service_price_overrides")
    .select("id, service_id, item_type, item_index, item_name, event_price, regular_price, duration, addon_price, is_active, updated_at")
    .order("service_id", { ascending: true })
    .order("item_type", { ascending: true })
    .order("item_index", { ascending: true });

  if (error) return [];
  return (data ?? []) as ServicePriceOverrideRow[];
}

export async function getServicesWithPriceOverrides(): Promise<ServiceDetail[]> {
  const overrides = await getServicePriceOverrides();
  return applyServicePriceOverrides(cloneServices(), overrides);
}

export async function saveServicePriceOverride(input: ServicePriceOverrideInput): Promise<ServicePriceOverrideRow> {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase 관리자 환경변수가 없어 서비스 가격을 저장할 수 없습니다.");
  }

  const supabase = createSupabaseAdminClient();
  const row = {
    service_id: input.serviceId,
    item_type: input.itemType,
    item_index: input.itemIndex,
    item_name: input.itemName,
    event_price: clean(input.eventPrice),
    regular_price: clean(input.regularPrice),
    duration: clean(input.duration),
    addon_price: clean(input.addonPrice),
    is_active: true,
    updated_by: "admin",
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("service_price_overrides")
    .upsert(row, { onConflict: "service_id,item_type,item_index" })
    .select("id, service_id, item_type, item_index, item_name, event_price, regular_price, duration, addon_price, is_active, updated_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "서비스 가격 저장 실패");
  }

  await supabase.from("admin_audit_logs").insert({
    actor: "admin",
    action: "service_price.override",
    target_type: "service_price_override",
    target_id: null,
    after_json: data,
    summary: `${input.serviceId} ${input.itemType} #${input.itemIndex} 가격 수동 수정`,
  });

  return data as ServicePriceOverrideRow;
}
