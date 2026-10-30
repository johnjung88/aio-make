import Link from "next/link";
import { labContactPath } from "@/lib/lab-services";
import styles from "./renewal.module.css";
export function LabResourceInquiry() {
  return (
    <div className={styles.page}>
      <section
        className={`${styles.section} ${styles.inquiry}`}
        id="lab-inquiry"
      >
        <p className={styles.eyebrow}>LET’S MAKE IT WORK</p>
        <h2>
          마음에 드는 화면을
          <br />
          <em>알려주세요</em>
        </h2>
        <p>
          참고할 화면과 필요한 기능을 보내주세요
          <br />
          사업에 맞는 제작 범위를 함께 정합니다
        </p>
        <Link className={styles.button} href={labContactPath()}>
          제작 상담하기 ↗
        </Link>
      </section>
    </div>
  );
}
