"use client";
import { useEffect, useRef, useState } from "react";
/** One observer per media stage; no scroll handler or animation frame loop */
export function useStageActivity() {
 const root = useRef<HTMLDivElement>(null);
 const [active, setActive] = useState(false);
 const [reduced, setReduced] = useState(true);
 useEffect(() => {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  let intersecting = false;
  const update = () => { setReduced(media.matches); setActive(intersecting && !document.hidden); };
  const observer = new IntersectionObserver(([entry]) => { intersecting = entry.isIntersecting; update(); }, { threshold:.05 });
  if(root.current) observer.observe(root.current);
  media.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  update();
  return () => { observer.disconnect(); media.removeEventListener("change",update); document.removeEventListener("visibilitychange",update); };
 }, []);
 return { root, active, reduced };
}
