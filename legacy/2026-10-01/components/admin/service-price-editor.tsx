"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

type TierEditorProps = {
  serviceId: string;
  itemIndex: number;
  itemName: string;
  eventPrice: string;
  regularPrice: string;
  duration: string;
};

type AddonEditorProps = {
  serviceId: string;
  itemIndex: number;
  itemName: string;
  price: string;
};

export function TierPriceEditor({
  serviceId,
  itemIndex,
  itemName,
  eventPrice,
  regularPrice,
  duration,
}: TierEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({ eventPrice, regularPrice, duration });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/service-prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        itemType: "tier",
        itemIndex,
        itemName,
        eventPrice: form.eventPrice,
        regularPrice: form.regularPrice,
        duration: form.duration,
      }),
    });
    const payload = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMessage(typeof payload.error === "string" ? payload.error : "저장 실패");
      return;
    }
    setMessage("저장됨");
    startTransition(() => router.refresh());
  }

  return (
    <div className="grid gap-2 lg:grid-cols-[1fr_1fr_1fr_34px]">
      <PriceInput
        label="이벤트가"
        value={form.eventPrice}
        onChange={(value) => setForm((prev) => ({ ...prev, eventPrice: value }))}
      />
      <PriceInput
        label="정상가"
        value={form.regularPrice}
        onChange={(value) => setForm((prev) => ({ ...prev, regularPrice: value }))}
      />
      <PriceInput
        label="기간"
        value={form.duration}
        onChange={(value) => setForm((prev) => ({ ...prev, duration: value }))}
      />
      <button
        type="button"
        onClick={save}
        disabled={saving || isPending}
        className="inline-grid h-9 place-items-center rounded-md border border-primary/30 text-primary transition hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60"
        title="가격 저장"
      >
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      </button>
      {message && <p className="text-xs text-muted-foreground lg:col-span-4">{message}</p>}
    </div>
  );
}

export function AddonPriceEditor({ serviceId, itemIndex, itemName, price }: AddonEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [addonPrice, setAddonPrice] = useState(price);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/admin/service-prices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId,
        itemType: "addon",
        itemIndex,
        itemName,
        addonPrice,
      }),
    });
    const payload = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setMessage(typeof payload.error === "string" ? payload.error : "저장 실패");
      return;
    }
    setMessage("저장됨");
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-[1fr_34px] gap-2">
        <PriceInput label="추가요금" value={addonPrice} onChange={setAddonPrice} />
        <button
          type="button"
          onClick={save}
          disabled={saving || isPending}
          className="inline-grid h-9 place-items-center rounded-md border border-primary/30 text-primary transition hover:bg-primary/10 disabled:cursor-wait disabled:opacity-60"
          title="가격 저장"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        </button>
      </div>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}

function PriceInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="h-9 w-full rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs outline-none focus:border-primary/60"
      />
    </label>
  );
}
