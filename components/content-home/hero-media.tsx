/* 히어로 영상 층(서버). contentHomeHero.video가 있을 때만 쓰인다(없으면 content-home.tsx가 placeholder를 그린다).
 * 포스터는 영상이 재생되기 전까지 보이는 같은 영상의 첫 장면이며, 연출 예시 이미지가 아니다. */
import Image from "next/image";
import { contentHomeHero } from "@/lib/content-home";
import { HeroVideoLayer } from "./hero-video";

export function HeroMedia() {
  const { video } = contentHomeHero;
  if (!video) return null;
  return (
    <>
      <Image
        src={video.poster}
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="(min-width:1440px) 1328px, 100vw"
        className="ch-hero-img"
      />
      <HeroVideoLayer video={video} />
    </>
  );
}
