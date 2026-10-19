import Image from "next/image";
import { homeCardMedia } from "@/lib/content-home";
import type { ContentServiceId } from "@/lib/content-site/types";

/** Compose original images inside existing media slots, without editing source bitmaps. */
export function HomeArtwork({ id, alt = true }: { id: ContentServiceId; alt?: boolean }) {
  const media = homeCardMedia[id];
  if (media.images?.length) {
    return <div className={`ch-content-art ch-content-art--${media.layout}`}>
      {media.images.map((src, index) => <Image key={src} src={src} alt={alt && index === 0 ? media.alt : ""} fill={false} width={640} height={960} sizes="(min-width:768px) 260px, 280px" />)}
    </div>;
  }
  return <Image src={media.poster} alt={alt ? media.alt : ""} fill sizes="(min-width:1024px) 33vw, 100vw" />;
}
