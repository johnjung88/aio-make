"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { contentLinkProps, isLabHref } from "@/lib/new-tab";
import { NewTabHint } from "./new-tab-hint";

// Work cards and filtered lists can resolve their lab destination at runtime
export default function LabEntryLink({
  children,
  ...props
}: ComponentProps<typeof Link>) {
  const path = usePathname();
  const href =
    typeof props.href === "string" ? props.href : (props.href.pathname ?? "");
  const newTab = isLabHref(href) ? contentLinkProps(href, path) : {};
  return (
    <Link {...props} {...newTab}>
      {children}
      {newTab.target && <NewTabHint />}
    </Link>
  );
}
