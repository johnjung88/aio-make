import Image from "next/image";
import type { WorkMedia as Media } from "@/lib/work-catalog";

export function WorkMedia({
  media,
  priority = false,
}: {
  media: Media;
  priority?: boolean;
}) {
  return (
    <div
      className={`content-service-media content-service-media-${media.presentation ?? "wide"}`}
    >
      {media.presentation === "site" && (
        <span className="content-service-browser" aria-hidden="true">
          ● ● ●
        </span>
      )}
      {media.kind === "video" ? (
        <video
          controls
          playsInline
          preload="none"
          poster={media.poster}
          width={media.width ?? 1080}
          height={
            media.height ?? (media.presentation === "portrait" ? 1920 : 608)
          }
          aria-label={media.alt}
        >
          <source src={media.src} type="video/mp4" />
          <a href={media.src}>영상 파일 보기</a>
        </video>
      ) : (
        <picture>
          {media.mobileSrc && (
            <source media="(max-width: 767px)" srcSet={media.mobileSrc} />
          )}
          <Image
            src={media.src}
            alt={media.alt}
            width={media.width ?? 1440}
            height={media.height ?? 900}
            priority={priority}
            sizes="(max-width: 767px) 90vw, 560px"
          />
        </picture>
      )}
    </div>
  );
}
