"use client";

import { useEffect, useState, type RefObject } from "react";

const SOUND_EVENT = "aio:reel-sound";

/** User gestures enable sound; a new audible reel mutes the previous one. */
export function useReelSound(ref: RefObject<HTMLVideoElement | null>) {
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    const silence = () => {
      if (ref.current) ref.current.muted = true;
      setMuted(true);
    };
    const otherReel = (event: Event) => {
      if ((event as CustomEvent<HTMLVideoElement>).detail !== ref.current) silence();
    };
    const visibility = () => { if (document.hidden) silence(); };
    window.addEventListener(SOUND_EVENT, otherReel);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener(SOUND_EVENT, otherReel);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [ref]);

  const toggleSound = () => {
    const node = ref.current;
    if (!node) return;
    const next = !node.muted;
    if (!next) window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: node }));
    node.muted = next;
    setMuted(next);
  };
  return { muted, toggleSound };
}
