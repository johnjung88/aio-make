"use client";
import { useState } from "react";
import type { ExampleSlot } from "@/lib/content-site/example-media";
import { ReelPlayer } from "../reel-player";

export function AnimationReferences({ items }: { items: { slot: string; media: ExampleSlot; caption?: string; length?: "30초" | "60초" }[] }) {
  const [expanded, setExpanded] = useState(false);
  return <><ul className="cs-svc-animation-refs">{(expanded ? items : items.slice(0, 6)).map(item => <li key={item.slot}><ReelPlayer slot={item.media} />{(item.caption || item.length) && <p className="cs-t-small">{[item.caption, item.length].filter(Boolean).join(" · ")}</p>}</li>)}</ul>{items.length > 6 && <button className="cs-btn" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? "접기" : "더 보기"}</button>}</>;
}
