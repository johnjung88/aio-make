import { ShieldCheck } from "lucide-react";

interface GuaranteeBadgeProps {
  label?: string;
  className?: string;
}

export function GuaranteeBadge({
  label = "5일 보장",
  className = "",
}: GuaranteeBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30 ${className}`}
    >
      <ShieldCheck className="size-3.5" />
      {label}
    </span>
  );
}
