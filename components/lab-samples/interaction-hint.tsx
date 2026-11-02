"use client";

import { Hand, MoveHorizontal } from "lucide-react";
import styles from "./interaction-hint.module.css";

export function InteractionHint({
  interacted,
  plan = false,
}: {
  interacted: boolean;
  plan?: boolean;
}) {
  if (interacted) return null;
  return (
    <p className={styles.hint} data-lab-interaction-hint>
      <Hand size={22} aria-hidden="true" />
      {plan ? (
        <span>공간을 눌러 설명을 확인하세요</span>
      ) : (
        <>
          <span className={styles.desktop}>
            건물을 눌러 층을 열어보세요 · 드래그해서 돌려보세요
          </span>
          <span className={styles.mobile}>
            건물을 눌러보세요 · 밀어서 돌려보세요
          </span>
          <MoveHorizontal size={20} aria-hidden="true" />
        </>
      )}
    </p>
  );
}
