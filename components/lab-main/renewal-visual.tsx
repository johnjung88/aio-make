import Image from "next/image";
import styles from "./renewal.module.css";
export function DeviceVisual({
  name,
  hero = false,
  mobileOnly = false,
}: {
  name: string;
  hero?: boolean;
  mobileOnly?: boolean;
}) {
  return (
    <div
      className={`${styles.visual} ${styles.deviceVisual} ${hero ? styles.heroVisual : ""}`}
      data-mobile-only={mobileOnly}
    >
      <div className={styles.devices}>
        {!mobileOnly && (
          <Image
            src={`/lab/${name}-pc.webp`}
            alt="가상 브랜드 PC 전체 화면"
            width={1600}
            height={1000}
            priority={hero}
            sizes="(max-width: 900px) 90vw, 50vw"
          />
        )}
        <Image
          src={`/lab/${name}-mobile.webp`}
          alt="가상 브랜드 모바일 전체 화면"
          width={480}
          height={900}
          sizes="(max-width: 900px) 25vw, 15vw"
        />
      </div>
    </div>
  );
}
