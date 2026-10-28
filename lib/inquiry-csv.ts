import type { Attribution } from "./attribution.ts";
import { utmKeys, clickIdKeys } from "./attribution.ts";
export type ExportInquiry = {
  id: string;
  created_at: string;
  status: string;
  raw_text: string;
  leads: {
    customer_name: string;
    company_name: string;
    email: string;
    phone: string;
    source_meta?: {
      division?: string;
      service?: string;
      purpose?: string;
      found_via?: string;
      attribution?: Partial<Attribution>;
    };
  } | null;
};
export const inquiryCsvHeaders = [
  "inquiry_id",
  "created_at",
  "status",
  "name",
  "company",
  "email",
  "phone",
  "division",
  "service",
  "message",
  "purpose",
  "found_via",
  ...utmKeys,
  ...utmKeys.map((key) => "first_" + key),
  "landing_path",
  "first_landing_path",
  "first_touch_date",
  ...clickIdKeys.map((key) => "has_" + key),
];
export function csvLine(values: unknown[]) {
  return (
    values
      .map((value) => {
        let text = String(value ?? "");
        if (/^[\s]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text))
          text = "'" + text;
        return '"' + text.replace(/"/g, '""') + '"';
      })
      .join(",") + "\r\n"
  );
}
export function inquiryCsvRow(item: ExportInquiry) {
  const lead = item.leads,
    meta = lead?.source_meta,
    source = meta?.attribution;
  return csvLine([
    item.id,
    item.created_at,
    item.status,
    lead?.customer_name,
    lead?.company_name,
    lead?.email,
    lead?.phone,
    meta?.division,
    meta?.service,
    item.raw_text,
    meta?.purpose,
    meta?.found_via,
    ...utmKeys.map((key) => source?.utm?.[key]),
    ...utmKeys.map((key) => source?.firstTouch?.utm?.[key]),
    source?.landingPath,
    source?.firstTouch?.landingPath,
    source?.firstTouch?.date,
    ...clickIdKeys.map((key) => (source?.clickIds?.[key] ? "yes" : "no")),
  ]);
}
