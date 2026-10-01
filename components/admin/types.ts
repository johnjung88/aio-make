import type { Entry } from "@/lib/db";
export type Lead = {
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  source_meta?: {
    division?: string;
    service?: string;
    attribution?: { landingPath?: string; utm?: Record<string, string> };
  };
};
export type Inquiry = {
  id: string;
  lead_id: string;
  raw_text: string;
  status: string;
  created_at: string;
  leads: Lead | null;
};
export type Note = {
  id: string;
  role: string;
  content: string;
  created_at: string;
  metadata?: { from?: string; to?: string };
};
export type InquiryData = {
  connected: boolean;
  items: Inquiry[];
  total: number | null;
  globalTotal?: number | null;
  newCount?: number;
  page?: number;
  error?: string;
};
export type EntryData = {
  connected: boolean;
  items: Entry[];
  total?: number | null;
  publishedCount?: number | null;
  page?: number;
  error?: string;
};

export type EntryDraft = Omit<Entry, "id" | "created_at" | "updated_at"> & {
  id?: string;
};
