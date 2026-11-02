import "server-only";
/* 장면 전환 묶음의 서버 분기(R5).
 * - 검토판: works.server.ts가 고른 실제 작업물(work)이 있을 때만 그 작품의 발췌 장면 경로·시점·제목을 만든다.
 * - 공개판: work가 없으므로 고객 정보는 한 글자도 만들지 않고 연출 예시 슬롯(lib/content-site/example-media.ts)만 넘긴다.
 * 고객 slug·발췌 시점 표는 이 서버 파일에만 있고 client 섬(scene-sequence.tsx)에는 계산된 장면 목록만 간다. */
import type { CsWorkCard } from "@/lib/content-site/types";
import { focusData, getExampleMedia, type ExampleService } from "@/lib/content-site/example-media";
import { SceneSequence, type SceneFrame, type SceneSequenceProps } from "./scene-sequence";

/** 검토 작품별 발췌 시점(초)과 화면 성격. SCENE_ASSETS_R3.json과 같은 값 */
const REVIEW_SCENES: Record<string, { seconds: [number, number, number]; variant: SceneSequenceProps["variant"] }> = {
  "bwl-brand-motion": { seconds: [2, 12.5, 22], variant: "motion" },
  "bwl-aqua-ad": { seconds: [2, 8, 14], variant: "ad" },
  "yofree-night-motion": { seconds: [3, 22, 42], variant: "animation" },
};

const EXAMPLE_VARIANT: Partial<Record<ExampleService, SceneSequenceProps["variant"]>> = {
  animation: "animation",
  "motion-graphics": "motion",
  ad: "ad",
};

type Labels = readonly [string, string, string];

export function WorkSequence({ work, labels, portrait = false, service, exampleLabels }: {
  work?: CsWorkCard;
  labels: Labels;
  portrait?: boolean;
  /** 공개판 연출 예시로 채울 서비스. 생략하면 예전처럼 작품이 없을 때 렌더하지 않는다 */
  service?: ExampleService;
  /** 연출 예시 장면 이름(생략 시 labels) */
  exampleLabels?: Labels;
}) {
  const review = work ? REVIEW_SCENES[work.slug] : undefined;
  if (work && review) {
    const scenes: SceneFrame[] = review.seconds.map((seconds, index) => ({
      src: `/reference-review/r3-scenes/${work.slug}/scene-${index + 1}.webp`,
      alt: `${work.title} 실제 영상 장면 ${index + 1} · ${work.label}`,
      width: 900,
      height: portrait ? 1600 : 506,
      time: `${seconds}초`,
    }));
    return <SceneSequence variant={review.variant} name={work.title} labels={labels} scenes={scenes} portrait={portrait} note="실제 영상에서 발췌한 장면"/>;
  }
  const variant = service ? EXAMPLE_VARIANT[service] : undefined;
  if (!service || !variant) return null;
  const slots = getExampleMedia(service, "scene").slice(0, 3);
  if (slots.length < 3) return null;
  const scenes: SceneFrame[] = slots.map(slot => ({ src: slot.src, alt: slot.alt, width: slot.width, height: slot.height, ...focusData(slot.focus) }));
  return <SceneSequence variant={variant} name="연출 예시" labels={exampleLabels ?? labels} scenes={scenes} portrait={slots.every(slot => slot.aspect === "9x16")} note="AIO가 만든 이미지로 구성한 장면 연출 예시" tag={slots[0].label}/>;
}
