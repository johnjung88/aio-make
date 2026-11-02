"use client";

import Link from "next/link";
import { Handshake, Mail, ShoppingBag } from "lucide-react";
import { useLocale } from "next-intl";
import { trackContactClick } from "@/lib/analytics/client";

interface ChannelBadgesProps {
  className?: string;
  size?: "sm" | "md";
}

export function ChannelBadges({ className = "", size = "md" }: ChannelBadgesProps) {
  const locale = useLocale();
  const base = `/${locale}`;
  const height = size === "sm" ? "h-9 px-4 text-xs" : "h-11 px-5 text-sm";

  const channels = [
    {
      id: "soomgo",
      label: "숨고",
      href: `${base}/quote?source=soomgo`,
      icon: <Handshake className="size-4" />,
      bg: "bg-[#ff5b35]/15 text-[#ff7a5a] hover:bg-[#ff5b35]/25 border border-[#ff5b35]/30",
      onClick: undefined,
    },
    {
      id: "kmong",
      label: "크몽",
      href: `${base}/quote?source=kmong`,
      icon: <ShoppingBag className="size-4" />,
      bg: "bg-[#00b3b4]/15 text-[#00d0d1] hover:bg-[#00b3b4]/25 border border-[#00b3b4]/30",
      onClick: undefined,
    },
    {
      id: "email",
      label: "이메일",
      href: "mailto:aiomake2023@gmail.com",
      icon: <Mail className="size-4" />,
      bg: "bg-white/8 text-foreground/80 hover:bg-white/12 border border-white/10",
      onClick: () => trackContactClick("email"),
    },
  ] as const;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {channels.map((ch) => (
        <Link
          key={ch.id}
          href={ch.href}
          onClick={ch.onClick}
          className={`inline-flex items-center gap-2 rounded-full font-semibold transition-colors ${height} ${ch.bg}`}
        >
          {ch.icon}
          {ch.label}
        </Link>
      ))}
    </div>
  );
}
