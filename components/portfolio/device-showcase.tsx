import Image from "next/image";
import type { ReactNode } from "react";

interface MonitorFrameProps {
  src: string;
  alt: string;
  /** Optional: override the default fill Image with a custom screen layer (e.g. gradient+error fallback) */
  screenSlot?: ReactNode;
}

export function MonitorFrame({ src, alt, screenSlot }: MonitorFrameProps) {
  return (
    <div className="flex-1 min-w-0" style={{ position: "relative" }}>
      {/* screen cutout — matches monitor.png pixel geometry */}
      <div style={{
        position: "absolute", top: "1.71%", left: "12.01%",
        width: "76.11%", height: "70.85%",
        overflow: "hidden", zIndex: 0,
        background: "#0d1117",
      }}>
        {screenSlot ?? (
          <Image
            src={src}
            alt={alt}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 820px"
            style={{ objectFit: "cover", objectPosition: "top center" }}
          />
        )}
      </div>
      <Image
        src="/mockups/monitor.png"
        alt="monitor frame"
        width={3072}
        height={2048}
        unoptimized
        style={{
          width: "100%", height: "auto", display: "block",
          position: "relative", zIndex: 1,
          filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.28))",
        }}
      />
    </div>
  );
}

interface PhoneFrameProps {
  src: string;
  alt: string;
  /** Optional: override the default fill Image with a custom screen layer */
  screenSlot?: ReactNode;
}

export function PhoneFrame({ src, alt, screenSlot }: PhoneFrameProps) {
  return (
    <div className="hidden md:block shrink-0 w-[30%] max-w-[240px]">
      <div style={{ position: "relative" }}>
        {/* screen cutout — matches phone.png pixel geometry */}
        <div style={{
          position: "absolute", top: "15.79%", left: "18.17%",
          width: "63.54%", height: "70.87%",
          overflow: "hidden", zIndex: 0,
          background: "#0d1117",
        }}>
          {screenSlot ?? (
            <Image
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes="240px"
              style={{ objectFit: "cover", objectPosition: "top center" }}
            />
          )}
        </div>
        <img
          src="/mockups/phone.png"
          alt="phone frame"
          style={{
            width: "100%", height: "auto", display: "block",
            position: "relative", zIndex: 1,
            filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.28))",
          }}
        />
      </div>
    </div>
  );
}

interface DeviceShowcaseProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
}

export function DeviceShowcase({ desktopSrc, mobileSrc, alt }: DeviceShowcaseProps) {
  return (
    <div
      className="relative flex items-end mx-auto pt-12 pb-3"
      style={{ gap: "3%", maxWidth: 1040 }}
    >
      {/* Accent glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 40% 60%, rgba(77,212,172,0.07) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

      <MonitorFrame src={desktopSrc} alt={`${alt} desktop`} />

      {mobileSrc && (
        <PhoneFrame src={mobileSrc} alt={`${alt} mobile`} />
      )}
    </div>
  );
}
