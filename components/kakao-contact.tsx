"use client";
import { usePathname } from "next/navigation";
import {
  KAKAO_CHANNEL_URL,
  kakaoChatUrl,
  contactDivision,
} from "@/lib/contact-channels";
import { track } from "@/lib/tracking-events";
import styles from "./kakao-contact.module.css";

export function KakaoContact({
  placement = "header",
  channelUrl = KAKAO_CHANNEL_URL,
}: {
  placement?: "header" | "footer";
  channelUrl?: string;
}) {
  const page = usePathname();
  const href = kakaoChatUrl(channelUrl);
  if (!href) return null;
  return (
    <div className={styles[placement]} data-kakao-contact={placement}>
      <a
        className={styles.button}
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() =>
          track("kakao_chat_click", { page, division: contactDivision(page) })
        }
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#FEE500"
            d="M12 3C5.9 3 1 6.6 1 11c0 2.8 2 5.3 5 6.7L5 22l5-3.1 2 .1c6.1 0 11-3.6 11-8S18.1 3 12 3Z"
          />
        </svg>
        카카오톡 상담 <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}
