import type { ReactNode } from "react";
import { CsSectionHead } from "../ui/section-head";

export function EditorialSection({ id, head, children, className = "", split = false }: { id: string; head: { eyebrow: string; title: string; lead?: string }; children: ReactNode; className?: string; split?: boolean }) {
  return <section id={id} className={`cs-section cs-r8-section ${className}`} data-cs-section="signature" aria-labelledby={`${id}-title`}>
    <div className={`cs-container${split ? " cs-r8-two" : ""}`}><CsSectionHead id={`${id}-title`} {...head} align={split ? "start" : "center"} />{children}</div>
  </section>;
}
