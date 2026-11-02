import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TrackingLinkForm } from "@/components/admin/tracking-link-form";

export default function NewTrackingLinkPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/marketing/links"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          목록으로
        </Link>
        <p className="text-xs font-medium uppercase text-primary">Marketing</p>
        <h2 className="mt-2 text-3xl font-semibold">UTM 추적 링크 발급</h2>
      </div>
      <TrackingLinkForm />
    </div>
  );
}
