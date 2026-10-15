import { getSlot } from "@/lib/content-site/example-media";
import { ReelPlayer } from "./reel-player";

export type FigureItem = { title: string; body: string; slot?: string; line?: string };
export function FigureRow({ items, snap = false, bands = false }: { items: readonly FigureItem[]; snap?: boolean; bands?: boolean }) {
  return <ol className={`cs-figure-row${snap ? " cs-figure-row--snap" : ""}`} data-count={items.length}>
    {items.map((item, index) => <li key={item.title}>
      {item.slot && <div className="cs-figure-media"><ReelPlayer slot={getSlot(item.slot)} />{bands && <h3 className="cs-figure-band cs-t-h3">{item.title}</h3>}</div>}
      <div className="cs-figure-copy"><p className="cs-t-eyebrow">{String(index + 1).padStart(2, "0")}</p>{!bands && <h3 className="cs-t-h3">{item.title}</h3>}{item.line && <p className="cs-t-label">{item.line}</p>}<p className="cs-t-body">{item.body}</p></div>
    </li>)}
  </ol>;
}
