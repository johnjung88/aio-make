/* 히어로 미디어(서버). 정지 이미지는 항상 아래층(LCP)이다.
 * contentHomeHero.video가 있을 때만 영상 층과 재생 버튼(client 섬)을 더한다. 지금은 비어 있어 이미지만 렌더한다. */
import Image from "next/image";
import { contentHomeHero } from "@/lib/content-home";
import { HeroVideoLayer } from "./hero-video";

export function HeroMedia() {
  const { image, video } = contentHomeHero;
  return (
    <>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        sizes="100vw"
        className="ch-hero-img"
      />
      {video ? <HeroVideoLayer video={video} /> : null}
    </>
  );
}
