import Image from "next/image";
import styles from "./renewal.module.css";

export function HomeScene() {
  return (
    <figure className={styles.homeScreen}>
      <Image
        src="/lab-renewal/home-website.webp"
        width={1440}
        height={900}
        priority
        sizes="(max-width: 900px) 100vw, 65vw"
        alt="여백결 샘플 사이트 실행 화면 · 공간 사진과 상담 동선을 담은 홈페이지"
      />
      <figcaption>여백결 · 가상 브랜드 샘플 사이트 실행 화면</figcaption>
    </figure>
  );
}
