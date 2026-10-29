"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { FloorPlan, FLOOR_INFO } from "@/components/lab-samples/architecture";
import styles from "./renewal.module.css";
const BuildingScene = dynamic(
  () => import("@/components/lab-samples/building-scene"),
  {
    ssr: false,
    loading: () => (
      <Image
        src="/lab-renewal/nest-preview.webp"
        width={1600}
        height={900}
        alt="NEST 가상 건축 화면"
      />
    ),
  },
);
export function HomeScene() {
  const [floor, setFloor] = useState(-1),
    [room, setRoom] = useState(0),
    [reduced, setReduced] = useState(true),
    [active, setActive] = useState(false),
    [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(mq.matches);
    change();
    mq.addEventListener("change", change);
    let visible = false;
    const update = () => setActive(visible && !document.hidden);
    const observer = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      update();
    });
    if (ref.current) observer.observe(ref.current);
    document.addEventListener("visibilitychange", update);
    return () => {
      mq.removeEventListener("change", change);
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div className={styles.homeBuilding}>
      <div className={styles.homeScene} ref={ref}>
        {reduced || failed ? (
          <FloorPlan
            floor={Math.max(0, floor)}
            room={room}
            onRoom={(value) => {
              if (floor < 0) setFloor(0);
              setRoom(value);
            }}
          />
        ) : (
          <BuildingScene
            floor={floor}
            room={room}
            stage={3}
            exploded={false}
            night={false}
            resetToken={0}
            active={active}
            onFloor={(value) => {
              setFloor(value);
              setRoom(0);
            }}
            onRoom={setRoom}
            onStatus={(s) => {
              if (s === "failed") setFailed(true);
            }}
            brandLighting
            viewPadding={0.98}
          />
        )}
      </div>
      <div className={`${styles.choices} ${styles.floorControls}`}>
        {["전체", "1층", "2층", "3층"].map((s, i) => (
          <button
            key={s}
            type="button"
            aria-pressed={floor === i - 1}
            onClick={() => {
              setFloor(i - 1);
              setRoom(0);
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <p className={styles.note} aria-live="polite">
        {floor < 0
          ? "NEST · 가상 건축 공간"
          : `${floor + 1}층 · ${FLOOR_INFO[floor].spaces[room].name} · ${FLOOR_INFO[floor].spaces[room].detail}`}
        {reduced
          ? " · 감소 모션에서는 평면으로 탐색합니다"
          : failed
            ? " · 평면 대체 화면"
            : " · 드래그로 회전하고 층을 선택해 둘러보세요"}
      </p>
    </div>
  );
}
