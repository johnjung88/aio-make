"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, ExternalLink } from "lucide-react";
import { useLocale } from "next-intl";
import { formatProjectDuration, type PortfolioProject } from "@/lib/portfolio-data";
import { TypeBadge } from "@/components/ui/type-badge";

interface PortfolioCardProps {
  project: PortfolioProject;
  className?: string;
}

export function PortfolioCard({ project, className = "" }: PortfolioCardProps) {
  const locale = useLocale() as "ko" | "en";
  const isPrivateResult = project.visibility === "private-result";
  const isPublic = project.visibility === "public";
  const href = `/${locale}${project.links.case}`;
  const isSvgCover = project.cover.endsWith(".svg");
  const keyOutput =
    project.deliverables?.[0]?.[locale] ??
    project.resultSummary?.[locale] ??
    (locale === "ko" ? "결과물 중심 포트폴리오" : "Result-focused portfolio");

  return (
    <article
      className={`group/card relative flex flex-col overflow-hidden rounded-lg border border-white/8 bg-card transition-all duration-300 hover:border-white/16 hover:shadow-xl ${className}`}
    >
      <Link href={href} className="flex flex-1 flex-col">
        {/* Cover image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-secondary">
          {project.cover && project.cover !== "/portfolio/placeholder.svg" ? (
            <Image
              src={project.cover}
              alt={project.title[locale]}
              fill
              className={`${isSvgCover ? "object-contain p-2" : "object-cover"} transition-transform duration-500 group-hover/card:scale-[1.02]`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl opacity-20">
                {project.type === "web" ? "🌐" : project.type === "app" ? "📱" : project.type === "design" ? "🎨" : project.type === "video" ? "🎬" : "⚙️"}
              </span>
            </div>
          )}

          {isPublic && project.links.live && (
            <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
              <ExternalLink className="size-3.5 text-white/80" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-h-[190px] flex-1 flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <TypeBadge type={project.type} />
            <span className="text-xs text-muted-foreground">{formatProjectDuration(project.duration, locale)}</span>
          </div>

          {isPrivateResult && (
            <div className="inline-flex max-w-full items-center gap-1.5 rounded-md border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-[10px] font-semibold text-cyan-200">
              <CheckCircle2 className="size-3 shrink-0" />
              <span className="truncate">
                {locale === "ko" ? `핵심 결과 · ${keyOutput}` : `Key output · ${keyOutput}`}
              </span>
            </div>
          )}

          <div>
            <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
              {project.title[locale]}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
              {project.summary[locale]}
            </p>
          </div>

          {/* Stack tags */}
          <div className="mt-auto flex flex-wrap gap-1">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                +{project.stack.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>

      {isPublic && project.links.live && (
        <div className="flex flex-wrap gap-2 border-t border-white/8 px-4 py-3">
          <Link
            href={project.links.live}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/10 px-3 text-[11px] font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <ExternalLink className="size-3" />
            Live
          </Link>
        </div>
      )}

      {/* Hover arrow */}
      <div className="pointer-events-none absolute right-4 top-4 flex h-7 w-7 translate-y-1 items-center justify-center rounded-full bg-primary opacity-0 transition-all duration-200 group-hover/card:translate-y-0 group-hover/card:opacity-100">
        <ArrowUpRight className="size-3.5 text-primary-foreground" />
      </div>
    </article>
  );
}
