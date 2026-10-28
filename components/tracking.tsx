"use client";
import { useEffect, useRef } from "react";
import { pageTracking, track } from "@/lib/tracking-events";

type Player = {
  addEventListener: (
    name: string,
    callback: (event: { data: number }) => void,
  ) => void;
  removeEventListener: (
    name: string,
    callback: (event: { data: number }) => void,
  ) => void;
};
type Youtube = {
  Player: new (element: HTMLIFrameElement, options: object) => Player;
};
declare global {
  interface Window {
    YT?: Youtube;
    onYouTubeIframeAPIReady?: () => void;
  }
}
let youtubeApi: Promise<Youtube> | undefined;
function loadYoutube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  return (youtubeApi ??= new Promise<Youtube>((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("YouTube API unavailable"));
    document.head.appendChild(script);
  }));
}
const players = new WeakMap<HTMLIFrameElement, Player>();

export function SiteTracking({ pathname }: { pathname: string }) {
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;
    const page = pageTracking(pathname);
    track("aio_page_view", {
      page_path: pathname,
      page_title: document.title,
      page_type: page.type,
      service_slug: page.service,
    });
    if (page.service) track("aio_service_view", { service_slug: page.service });
    if (page.article && document.querySelector("article")) {
      const article = document.querySelector<HTMLElement>("article");
      track("aio_reference_view", {
        content_type: page.contentType,
        content_slug: page.slug,
        industry: article?.dataset.industry ?? "",
        biz_type: article?.dataset.bizType ?? "",
      });
    }
  }, [pathname]);
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (
        !target ||
        (event.defaultPrevented &&
          !target.matches("[data-plan],[data-case],[data-material]"))
      )
        return;
      const url = new URL(target.href, location.href);
      if (
        url.origin !== location.origin ||
        !(
          /\/contact\/?$/.test(url.pathname) ||
          ["#inquiry", "#contact"].includes(url.hash)
        )
      )
        return;
      const page = pageTracking(pathname);
      const locationName = target.closest(".cs-mbar,.floating-contact")
        ? "mobile_bar"
        : target.closest("header")
          ? "header"
          : target.closest("footer")
            ? "footer"
            : target.closest('[data-cs-section="hero"],.guide-hero,.hero')
              ? "hero"
              : page.type === "insight"
                ? "insight"
                : page.type === "reference"
                  ? "reference"
                  : "contact_section";
      track("aio_cta_click", {
        cta_location: locationName,
        service_slug: page.service,
      });
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, [pathname]);
  useEffect(() => {
    let active = true;
    const attached = new WeakSet<HTMLIFrameElement>();
    const cleanups: (() => void)[] = [];
    const attach = () =>
      document
        .querySelectorAll<HTMLIFrameElement>("iframe[src]")
        .forEach((frame) => {
          if (attached.has(frame)) return;
          let url: URL;
          try {
            url = new URL(frame.src);
          } catch {
            return;
          }
          const id = url.pathname.match(/^\/embed\/([A-Za-z0-9_-]{11})$/)?.[1];
          if (
            !id ||
            !["www.youtube.com", "www.youtube-nocookie.com"].includes(
              url.hostname,
            )
          )
            return;
          attached.add(frame);
          void loadYoutube()
            .then((api) => {
              if (!active || !frame.isConnected) return;
              url.searchParams.set("enablejsapi", "1");
              url.searchParams.set("origin", location.origin);
              if (frame.src !== url.href) frame.src = url.href;
              let played = false;
              const state = (event: { data: number }) => {
                if (!active || event.data !== 1 || played) return;
                played = true;
                track("aio_video_play", {
                  video_id: id,
                  content_slug: pageTracking(pathname).slug,
                });
              };
              let player = players.get(frame);
              if (!player) {
                player = new api.Player(frame, {
                  events: { onStateChange: state },
                });
                players.set(frame, player);
              } else player.addEventListener("onStateChange", state);
              cleanups.push(() =>
                player?.removeEventListener("onStateChange", state),
              );
            })
            .catch(() => {});
        });
    attach();
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      active = false;
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [pathname]);
  return null;
}
