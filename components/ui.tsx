import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { safeJsonLd } from "@/lib/domain";
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }}
    />
  );
}
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Action({
  href,
  children,
  light = false,
}: {
  href: string;
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <Link href={href} className={"button" + (light ? " button-light" : "")}>
      {children}
      <ArrowUpRight size={18} />
    </Link>
  );
}
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((item, i) => (
        <details key={item.q}>
          <summary>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            {item.q}
            <span aria-hidden="true">+</span>
          </summary>
          <p>{item.a}</p>
        </details>
      ))}
    </div>
  );
}
export function ContactCTA({ path = "/contact" }: { path?: string }) {
  return (
    <section className="contact-cta">
      <div className="container">
        <Eyebrow>LET’S MAKE IT HAPPEN</Eyebrow>
        <div className="split">
          <h2>
            필요한 작업,
            <br />
            함께 정리해볼까요?
          </h2>
          <div>
            <p>
              아이디어가 아직 정리되지 않아도 괜찮습니다.
              <br />
              목표와 상황을 들려주세요.
            </p>
            <Action href={path} light>
              프로젝트 문의
            </Action>
          </div>
        </div>
      </div>
    </section>
  );
}
