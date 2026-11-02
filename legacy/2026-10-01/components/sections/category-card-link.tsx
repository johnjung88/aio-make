"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/client";

export function CategoryCardLink({
  href,
  category,
  children,
  className,
}: {
  href: string;
  category: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => trackEvent("click_category_card", { category })}
    >
      {children}
    </Link>
  );
}
