import type { CsWorkCard } from "@/lib/content-site/types";
import { SceneSequence } from "./scene-sequence";
/** Server gate is retained before any scene data reaches the client island */
export function WorkSequence({ work, labels, portrait=false }: {work?:CsWorkCard;labels:[string,string,string];portrait?:boolean}) {
  if(!work || !["bwl-brand-motion","bwl-aqua-ad","yofree-night-motion"].includes(work.slug)) return null;
  return <SceneSequence slug={work.slug} title={work.title} label={work.label} labels={labels} portrait={portrait}/>;
}
