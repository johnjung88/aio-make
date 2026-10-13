/* 미디어 박스(서버). 이미지는 next/image fill + 비율 박스(aspect-ratio로 자리를 먼저 잡아 CLS 0),
 * 영상은 <video muted loop playsInline>. 자동재생은 서버 HTML에 autoplay 속성 없이 data-cs-autoplay만 두고
 * frame.tsx가 마운트 후 움직임 상태·reduced-motion을 보고 play()/pause()한다. 태그는 왼쪽 아래 12px. */
import Image from "next/image";
import { CsTag } from "./tag";

export type CsRatio = "16x9" | "9x16" | "2x3" | "3x4" | "4x5" | "1x1" | "3x2";

type Common = {
  ratio: CsRatio;
  /** 상태 태그(MEDIA_TAGS 또는 서버 사례 라벨). 장식이 아닌 미디어에는 필수 */
  tag?: string;
  className?: string;
  contain?: boolean;
};

type ImageProps = Common & {
  kind?: "image";
  src: string;
  alt: string;
  /** next/image sizes(필수) */
  sizes: string;
  /** 페이지당 히어로 1개만 */
  priority?: boolean;
};

type VideoProps = Common & {
  kind: "video";
  src: string;
  /** 영상 설명(aria-label) */
  alt: string;
  poster?: string;
  /** 무음 반복 배경 영상: 마운트 후 frame.tsx가 재생 */
  autoplay?: boolean;
  controls?: boolean;
  /** 히어로 metadata, 그 밖은 none */
  preload?: "metadata" | "none";
  /** 영상 아래층 이미지(LCP·재생 전 화면) */
  under?: { src: string; sizes: string; priority?: boolean };
};

export function CsMedia(props: ImageProps | VideoProps) {
  const box =
    "cs-media cs-ratio-" +
    props.ratio +
    (props.contain ? " cs-media--contain" : "") +
    (props.className ? " " + props.className : "");
  if (props.kind === "video") {
    return (
      <div className={box}>
        {props.under ? (
          <Image
            src={props.under.src}
            alt=""
            fill
            sizes={props.under.sizes}
            priority={props.under.priority ?? false}
          />
        ) : null}
        <video
          muted={props.autoplay ? true : undefined}
          loop={props.autoplay ? true : undefined}
          playsInline
          controls={props.controls ?? !props.autoplay}
          preload={props.preload ?? "none"}
          poster={props.poster}
          aria-label={props.alt}
          data-cs-autoplay={props.autoplay ? "" : undefined}
        >
          <source src={props.src} type="video/mp4" />
        </video>
        {props.tag ? <CsTag>{props.tag}</CsTag> : null}
      </div>
    );
  }
  return (
    <div className={box}>
      <Image
        src={props.src}
        alt={props.alt}
        fill
        sizes={props.sizes}
        priority={props.priority ?? false}
      />
      {props.tag ? <CsTag>{props.tag}</CsTag> : null}
    </div>
  );
}
