import type { ServiceCase } from "./service-case-schema.ts";

/** The build index records file existence without shipping image/video bytes in an API function. */
export function assertServiceCaseMedia(record: ServiceCase, extraPaths: string[], registeredPaths: readonly string[]) {
  const available = new Set(registeredPaths);
  const paths = new Set([
    ...record.assets.flatMap((asset) => [asset.src, ...(asset.poster ? [asset.poster] : [])]),
    ...record.stages.flatMap((stage) => stage.asset ? [stage.asset] : []),
    ...extraPaths.filter((value) => value.startsWith("/")),
  ]);
  for (const source of paths) {
    if (!available.has(source)) throw new Error("연결한 결과물·포스터·과정 이미지가 사이트 public 폴더에 있는지 확인해주세요");
  }
}
