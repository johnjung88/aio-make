import { r8Sections } from "./r8-sections.ts";
import { r8Details } from "./r8-details.ts";
import type { CsCutBoard } from "./types.ts";

const cuts = (id: "motion-graphics" | "brand-film" | "ad") => r8Details[id].cuts.map(cut => ({ ...cut }));
export const r8Boards: Record<"motion-graphics" | "brand-film" | "ad", CsCutBoard> = {
  "motion-graphics": {
    id:"motion-sample", ...r8Sections["motion-graphics"]["SAMPLE FILM"], tag:"제작 예시",
    sample:[
      {label:"가로 16:9",src:"",poster:"/content-examples/motion-graphics/sample-wide-poster.webp",aspect:"16x9"},
      {label:"세로 9:16",src:"",poster:"/content-examples/motion-graphics/sample-vertical-poster.webp",aspect:"9x16",cuts:cuts("motion-graphics").slice(0,5).map((cut,i) => ({...cut,from:[0,2,3.5,5,9.5][i],to:[2,3.5,5,9.5,12.4][i]}))},
    ], cuts:cuts("motion-graphics"),
    note:"샘플 규격 1920×1080 · 60fps · 가로 25.5초 · 세로판은 같은 흐름을 컷 길이만 줄여 세로 구도로 다시 짠 12.4초입니다",
  },
  "brand-film": {
    id:"brand-sample", ...r8Sections["brand-film"]["SAMPLE FILM"], tag:"제작 예시 · AI 생성 장면 포함",
    sample:[{label:"특장차 전문 기업 홍보 영상",src:"",poster:"/content-examples/brand-film/sample-poster.webp",aspect:"16x9"}],cuts:cuts("brand-film"),
    note:"샘플 길이 61.8초 · 1280×720 · 60초 구성 예시 · 보드는 8장 중 6장만 보여줍니다",
    chapters:[
      {name:"오프닝",from:0,to:2.9},{name:"신뢰",from:2.9,to:10.7},{name:"고층 현장",from:10.7,to:22.2},{name:"전환",from:22.2,to:26.4},
      {name:"공항 현장",from:26.4,to:41.5},{name:"산악 현장",from:41.5,to:52.6},{name:"제품",from:52.6,to:58.2},{name:"마무리",from:58.2,to:61.9},
    ],
  },
  ad: {
    id:"ad-sample", ...r8Sections.ad["SAMPLE FILM"],tag:"제작 예시 · AI 가상인물 · 연출 예시",
    sample:[{label:"건강기능식품 브랜드 광고 샘플",src:"",poster:"/content-examples/ad/sample-poster.webp",aspect:"16x9"}],cuts:cuts("ad"),
    note:"샘플 규격 1920×1080 · 샘플 영상은 소리 없이 재생되며 소리 열은 대본의 설계 내용입니다 · 세로 9:16 기본 규격 작업은 아래 세로 편집을 참고하세요",
  },
};
