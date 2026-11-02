import "server-only";
import fs from "fs";
import path from "path";

/**
 * PPT 상세 갤러리를 디스크에서 자동 스캔하여 반환.
 * cover-slide.png → sample-1.png, sample-2.png, … 순서.
 * 폴더에 이미지를 추가하면 코드 수정 없이 자동 반영된다.
 */
export function getPptGalleryFromDisk(assetDir: string): string[] {
  try {
    const dir = path.join(process.cwd(), "public/portfolio/ppt-design", assetDir);
    const files = fs.readdirSync(dir);

    const coverFile = files.find((f) => f === "cover-slide.png");
    const sampleFiles = files
      .filter((f) => /^sample-(\d+)\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => {
        const numA = parseInt(a.match(/^sample-(\d+)\./i)![1], 10);
        const numB = parseInt(b.match(/^sample-(\d+)\./i)![1], 10);
        return numA - numB;
      });

    const ordered = [...(coverFile ? [coverFile] : []), ...sampleFiles];
    return ordered.map((f) => `/portfolio/ppt-design/${assetDir}/${f}`);
  } catch {
    return [];
  }
}
