// 자동 생성, 직접 수정 금지 — npm run works:build
import type { WorkRecord } from "../work-schema.ts";

// 검토 데이터는 서버 또는 명시적인 로컬 검토 브라우저에서만 사용합니다
export const generatedWorks: WorkRecord[] =
  typeof window === "undefined" || process.env.NEXT_PUBLIC_AIO_REFERENCE_REVIEW === "1"
    ? [
  {
    "slug": "bwl-aqua-ad",
    "id": "AIO-WORK-BWL-AD-02",
    "brand": "BWL · DR's Secret",
    "title": "아쿠아 세럼 영상 시안",
    "division": "video",
    "primaryService": "ad",
    "relatedServices": [
      {
        "division": "video",
        "id": "ai-influencer"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 15,
    "description": "아쿠아 부스트 세럼 10의 9:16 제안용 영상입니다.",
    "purpose": "아쿠아 부스트 세럼 10의 사용 장면을 세로 광고로 구성했습니다",
    "scope": "인물과 제품이 등장하는 9:16 영상의 장면 구성과 편집 시안입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/bwl-aqua-ad/hero.mp4",
        "alt": "DR's Secret 아쿠아 세럼 영상 시안",
        "poster": "/reference-review/bwl-aqua-ad/hero-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "bwl-aqua-webtoon",
    "id": "AIO-WORK-BWL-WEBTOON-02",
    "brand": "BWL · DR's Secret",
    "title": "충전은 챙기면서",
    "division": "video",
    "primaryService": "webtoon",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 12,
    "description": "아쿠아 부스트 세럼 10 제품편 웹툰 3페이지의 내부 검토본입니다.",
    "purpose": "바쁜 일상 속 피부 관리 이야기를 제품 소개와 연결했습니다",
    "scope": "아쿠아 부스트 세럼 10을 주제로 6컷·3페이지의 웹툰을 제작했습니다",
    "media": [
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-aqua-webtoon/gallery-01.webp",
        "alt": "DR's Secret 충전은 챙기면서 1페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-aqua-webtoon/gallery-02.webp",
        "alt": "DR's Secret 충전은 챙기면서 2페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-aqua-webtoon/gallery-03.webp",
        "alt": "DR's Secret 충전은 챙기면서 3페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      }
    ]
  },
  {
    "slug": "bwl-brand-ad",
    "id": "AIO-WORK-BWL-AD-01",
    "brand": "BWL · DR's Secret",
    "title": "브랜드 광고 30초 시안",
    "division": "video",
    "primaryService": "brand-film",
    "relatedServices": [
      {
        "division": "video",
        "id": "brand-film"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 14,
    "description": "16:9 브랜드 광고의 제안용 편집 시안입니다.",
    "purpose": "브랜드 이미지와 제품 장면을 연결해 짧은 광고의 흐름을 만들었습니다",
    "scope": "16:9 브랜드 광고의 기획과 편집 시안입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/bwl-brand-ad/hero.mp4",
        "alt": "DR's Secret 브랜드 광고 30초 시안",
        "poster": "/reference-review/bwl-brand-ad/hero-poster.webp",
        "presentation": "wide"
      }
    ]
  },
  {
    "slug": "bwl-brand-motion",
    "id": "AIO-WORK-BWL-MOTION-01",
    "brand": "BWL · DR's Secret",
    "title": "브랜드 모션그래픽",
    "division": "video",
    "primaryService": "motion-graphics",
    "relatedServices": [
      {
        "division": "video",
        "id": "brand-film"
      }
    ],
    "productionStatus": "제작 완료",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 0,
    "description": "제품군과 브랜드 문구를 30초 그래픽 흐름으로 구성한 16:9 모션그래픽입니다.",
    "purpose": "여러 스킨케어 제품과 브랜드 메시지를 한 편의 짧은 영상에 담았습니다",
    "scope": "제품 이미지, 타이포그래피, 장면 전환을 구성한 30초 가로 모션그래픽입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/bwl-brand-motion/hero.mp4",
        "alt": "DR's Secret 브랜드 모션그래픽",
        "poster": "/reference-review/bwl-brand-motion/hero-poster.webp",
        "presentation": "wide"
      }
    ]
  },
  {
    "slug": "bwl-brand-webtoon",
    "id": "AIO-WORK-BWL-WEBTOON-01",
    "brand": "BWL · DR's Secret",
    "title": "장바구니는 꽉, 내 루틴은 물음표",
    "division": "video",
    "primaryService": "webtoon",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 5,
    "description": "브랜드편 웹툰 4페이지의 내부 검토본입니다.",
    "purpose": "제품을 고르는 소비자의 고민을 일상적인 장면과 대화로 표현했습니다",
    "scope": "8컷의 브랜드 이야기를 4페이지로 구성한 웹툰 시안입니다",
    "media": [
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-brand-webtoon/gallery-01.webp",
        "alt": "DR's Secret 장바구니는 꽉, 내 루틴은 물음표 1페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-brand-webtoon/gallery-02.webp",
        "alt": "DR's Secret 장바구니는 꽉, 내 루틴은 물음표 2페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-brand-webtoon/gallery-03.webp",
        "alt": "DR's Secret 장바구니는 꽉, 내 루틴은 물음표 3페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/bwl-brand-webtoon/gallery-04.webp",
        "alt": "DR's Secret 장바구니는 꽉, 내 루틴은 물음표 4페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      }
    ]
  },
  {
    "slug": "bwl-cleanser-ad",
    "id": "AIO-WORK-BWL-AD-04",
    "brand": "BWL · DR's Secret",
    "title": "클렌저 1 영상 시안",
    "division": "video",
    "primaryService": "ad",
    "relatedServices": [
      {
        "division": "video",
        "id": "ai-influencer"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 17,
    "description": "클렌저 1의 9:16 제안용 영상입니다.",
    "purpose": "클렌저 1의 제품 소개를 일상적인 사용 장면으로 풀었습니다",
    "scope": "인물과 제품을 중심으로 구성한 9:16 광고 편집 시안입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/bwl-cleanser-ad/hero.mp4",
        "alt": "DR's Secret 클렌저 1 영상 시안",
        "poster": "/reference-review/bwl-cleanser-ad/hero-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "bwl-cplus-ad",
    "id": "AIO-WORK-BWL-AD-03",
    "brand": "BWL · DR's Secret",
    "title": "C Plus 세럼 영상 시안",
    "division": "video",
    "primaryService": "ad",
    "relatedServices": [
      {
        "division": "video",
        "id": "ai-influencer"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 16,
    "description": "C Plus 세럼 7S의 9:16 제안용 영상입니다.",
    "purpose": "C Plus 세럼 7S를 소개하는 인물 중심의 세로 영상을 구성했습니다",
    "scope": "제품 소개 장면을 연결한 9:16 광고 편집 시안입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/bwl-cplus-ad/hero.mp4",
        "alt": "DR's Secret C Plus 세럼 영상 시안",
        "poster": "/reference-review/bwl-cplus-ad/hero-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "bwl-editorial",
    "id": "AIO-WORK-BWL-EDITORIAL-01",
    "brand": "BWL · DR's Secret",
    "title": "제품 에디토리얼 이미지",
    "division": "development",
    "primaryService": "shopping-mall",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 18,
    "description": "쇼핑몰 판매 상세용 제품 이미지 15장의 원본입니다. 라벨 내용은 확인 대기입니다.",
    "purpose": "제품마다 어울리는 색과 배경으로 쇼핑몰 상세 이미지의 방향을 제안했습니다",
    "scope": "제품 에디토리얼 이미지 15장입니다 생성 이미지의 제품 라벨과 세부 표기는 최종 확인 전입니다",
    "media": [
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-01.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 1번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-02.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 2번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-03.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 3번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-04.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 4번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-05.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 5번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-06.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 6번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-07.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 7번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-08.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 8번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-09.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 9번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-10.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 10번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-11.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 11번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-12.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 12번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-13.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 13번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-14.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 14번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      },
      {
        "kind": "image",
        "src": "/reference-review/bwl-editorial/gallery-15.webp",
        "alt": "DR's Secret 제품 에디토리얼 이미지 15번째 이미지",
        "width": 1536,
        "height": 1024,
        "presentation": "square"
      }
    ]
  },
  {
    "slug": "bwl-store",
    "id": "AIO-WORK-BWL-STORE-01",
    "brand": "BWL · DR's Secret",
    "title": "DR's Secret 쇼핑몰 레퍼런스",
    "division": "development",
    "primaryService": "shopping-mall",
    "relatedServices": [],
    "productionStatus": "제작 완료",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 2,
    "description": "브랜드 소개와 제품 탐색을 연결한 정적 쇼핑몰 레퍼런스. 실제 주문과 결제는 받지 않습니다.",
    "purpose": "스킨케어 브랜드의 분위기를 유지하면서 제품을 찾고 비교할 수 있도록 구성했습니다",
    "scope": "브랜드 소개, 제품 탐색과 상세 화면, PC·모바일 반응형 디자인을 제작했습니다 공개된 레퍼런스 사이트이며 주문·결제 기능은 운영하지 않습니다",
    "media": [
      {
        "kind": "image",
        "src": "/reference-review/bwl-store/hero.webp",
        "alt": "DR's Secret 쇼핑몰 레퍼런스 PC 화면",
        "mobileSrc": "/reference-review/bwl-store/mobile.webp",
        "width": 1440,
        "height": 1000,
        "presentation": "site"
      }
    ]
  },
  {
    "slug": "healernet-motion",
    "id": "AIO-WORK-HN-MOTION-01",
    "brand": "힐러넷",
    "title": "회사 홍보 모션그래픽",
    "division": "video",
    "primaryService": "motion-graphics",
    "relatedServices": [
      {
        "division": "video",
        "id": "brand-film"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 9,
    "description": "연구에서 제품까지의 메시지를 가로와 세로 영상으로 구성한 후보입니다.",
    "purpose": "연구에서 제품으로 이어지는 회사의 메시지를 영상으로 풀었습니다",
    "scope": "30초 가로판과 15초 세로판을 제작했습니다. 두 화면 비율은 작품 상세에서 확인할 수 있습니다.",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/healernet-motion/hero.mp4",
        "alt": "HEALERNET 회사 홍보 모션그래픽",
        "poster": "/reference-review/healernet-motion/hero-poster.webp",
        "presentation": "wide"
      },
      {
        "kind": "image",
        "src": "/reference-review/healernet-motion/gallery-01.webp",
        "alt": "HEALERNET 회사 홍보 모션그래픽 1번째 이미지",
        "width": 1080,
        "height": 1920,
        "presentation": "wide"
      },
      {
        "kind": "video",
        "src": "/reference-review/healernet-motion/gallery-02.mp4",
        "alt": "HEALERNET 회사 홍보 모션그래픽",
        "poster": "/reference-review/healernet-motion/gallery-02-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "healernet-website",
    "id": "AIO-WORK-HEALERNET-SITE-01",
    "brand": "힐러넷",
    "title": "힐러넷 기업 웹사이트 시안",
    "division": "development",
    "primaryService": "website",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 3,
    "description": "회사 소개, 연구 방향과 제품을 연결한 웹사이트 검토 시안입니다.",
    "purpose": "힐러넷의 회사 소개와 연구 방향을 요프리 제품 소개로 연결했습니다",
    "scope": "회사·제품 정보 구조와 반응형 웹 화면을 설계한 시안입니다 실제 시설을 촬영한 기록이나 최종 배포본을 의미하지 않습니다",
    "media": [
      {
        "kind": "image",
        "src": "/reference-review/healernet-website/hero.webp",
        "alt": "HEALERNET 기업 웹사이트 시안 PC 화면",
        "mobileSrc": "/reference-review/healernet-website/mobile.webp",
        "width": 1440,
        "height": 900,
        "presentation": "site"
      },
      {
        "kind": "image",
        "src": "/reference-review/healernet-website/gallery-01.webp",
        "alt": "HEALERNET 기업 웹사이트 시안 1번째 이미지",
        "width": 1440,
        "height": 900,
        "presentation": "site"
      }
    ]
  },
  {
    "slug": "yofree-mg-short",
    "id": "AIO-WORK-YOFREE-AD-01",
    "brand": "YoFree",
    "title": "밸런스 샷 모션그래픽 4안",
    "division": "video",
    "primaryService": "motion-graphics",
    "relatedServices": [
      {
        "division": "video",
        "id": "ad"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 21,
    "description": "두 콘셉트의 세로 광고 후보 4개 버전입니다.",
    "purpose": "선물과 제품 소개라는 두 메시지를 서로 다른 움직임으로 표현했습니다",
    "scope": "두 콘셉트에 각각 절제형·다이내믹형을 적용한 세로 모션그래픽 4안을 제작했습니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg-short/hero.mp4",
        "alt": "YoFree 밸런스 샷 모션그래픽 4안",
        "poster": "/reference-review/yofree-mg-short/hero-poster.webp",
        "presentation": "portrait"
      },
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg-short/gallery-01.mp4",
        "alt": "YoFree 밸런스 샷 모션그래픽 4안",
        "poster": "/reference-review/yofree-mg-short/gallery-01-poster.webp",
        "presentation": "portrait"
      },
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg-short/gallery-02.mp4",
        "alt": "YoFree 밸런스 샷 모션그래픽 4안",
        "poster": "/reference-review/yofree-mg-short/gallery-02-poster.webp",
        "presentation": "portrait"
      },
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg-short/gallery-03.mp4",
        "alt": "YoFree 밸런스 샷 모션그래픽 4안",
        "poster": "/reference-review/yofree-mg-short/gallery-03-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "yofree-mg30",
    "id": "AIO-WORK-YOFREE-AD-02",
    "brand": "YoFree",
    "title": "30초 광고 모션그래픽 3편",
    "division": "video",
    "primaryService": "motion-graphics",
    "relatedServices": [
      {
        "division": "video",
        "id": "ad"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 22,
    "description": "세 시나리오의 가로·세로 영상 후보 4개입니다.",
    "purpose": "같은 제품을 타이포그래피, 제품 이미지, 모션 코믹으로 각각 소개했습니다",
    "scope": "세 시나리오의 가로·세로 모션그래픽 출력 4개입니다 제품 효능 표현은 확인 대기 상태입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg30/hero.mp4",
        "alt": "YoFree 30초 광고 모션그래픽 3편",
        "poster": "/reference-review/yofree-mg30/hero-poster.webp",
        "presentation": "wide"
      },
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg30/gallery-01.mp4",
        "alt": "YoFree 30초 광고 모션그래픽 3편",
        "poster": "/reference-review/yofree-mg30/gallery-01-poster.webp",
        "presentation": "portrait"
      },
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg30/gallery-02.mp4",
        "alt": "YoFree 30초 광고 모션그래픽 3편",
        "poster": "/reference-review/yofree-mg30/gallery-02-poster.webp",
        "presentation": "portrait"
      },
      {
        "kind": "video",
        "src": "/reference-review/yofree-mg30/gallery-03.mp4",
        "alt": "YoFree 30초 광고 모션그래픽 3편",
        "poster": "/reference-review/yofree-mg30/gallery-03-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "yofree-night-motion",
    "id": "AIO-WORK-YOFREE-MOTION-02",
    "brand": "YoFree",
    "title": "밤편 웹툰 모션그래픽",
    "division": "video",
    "primaryService": "animation",
    "relatedServices": [
      {
        "division": "video",
        "id": "webtoon"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 20,
    "description": "요프리 밤편 웹툰을 장면별로 재구성한 내부 검토본입니다.",
    "purpose": "밤편 웹툰의 장면과 대화를 모션 코믹으로 이어 붙였습니다",
    "scope": "6페이지 웹툰을 42장면으로 재구성한 세로 영상의 내부 검토본입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/yofree-night-motion/hero.mp4",
        "alt": "YoFree 밤편 웹툰 모션그래픽",
        "poster": "/reference-review/yofree-night-motion/hero-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "yofree-night-webtoon",
    "id": "AIO-WORK-YOFREE-WEBTOON-02",
    "brand": "YoFree",
    "title": "엄마, 오늘은 잘 잤어?",
    "division": "video",
    "primaryService": "webtoon",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 13,
    "description": "요프리 밤편 웹툰 6페이지의 내부 검토본입니다. 효능 표현은 확인 대기입니다.",
    "purpose": "가족의 대화와 밤의 일상을 중심으로 제품 이야기를 풀었습니다",
    "scope": "창작 장면을 포함한 6페이지 웹툰 시안입니다 제품 효능 표현은 확인 대기 상태입니다",
    "media": [
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-night-webtoon/gallery-01.webp",
        "alt": "YoFree 엄마, 오늘은 잘 잤어? 1페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-night-webtoon/gallery-02.webp",
        "alt": "YoFree 엄마, 오늘은 잘 잤어? 2페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-night-webtoon/gallery-03.webp",
        "alt": "YoFree 엄마, 오늘은 잘 잤어? 3페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-night-webtoon/gallery-04.webp",
        "alt": "YoFree 엄마, 오늘은 잘 잤어? 4페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-night-webtoon/gallery-05.webp",
        "alt": "YoFree 엄마, 오늘은 잘 잤어? 5페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-night-webtoon/gallery-06.webp",
        "alt": "YoFree 엄마, 오늘은 잘 잤어? 6페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      }
    ]
  },
  {
    "slug": "yofree-outing-motion",
    "id": "AIO-WORK-YOFREE-MOTION-01",
    "brand": "YoFree",
    "title": "외출편 웹툰 모션그래픽",
    "division": "video",
    "primaryService": "animation",
    "relatedServices": [
      {
        "division": "video",
        "id": "webtoon"
      }
    ],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 19,
    "description": "요프리 외출편 웹툰을 움직이는 영상으로 재구성한 검토본입니다.",
    "purpose": "외출편 웹툰을 영상으로 볼 수 있도록 장면의 움직임과 읽는 속도를 설계했습니다",
    "scope": "기존 웹툰을 세로 모션그래픽으로 재구성한 v04 검토본입니다",
    "media": [
      {
        "kind": "video",
        "src": "/reference-review/yofree-outing-motion/hero.mp4",
        "alt": "YoFree 외출편 웹툰 모션그래픽",
        "poster": "/reference-review/yofree-outing-motion/hero-poster.webp",
        "presentation": "portrait"
      }
    ]
  },
  {
    "slug": "yofree-outing-webtoon",
    "id": "AIO-WORK-YOFREE-WEBTOON-01",
    "brand": "YoFree",
    "title": "엄마가 자꾸 멈추는 이유",
    "division": "video",
    "primaryService": "webtoon",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 1,
    "description": "요프리 외출편 웹툰 5페이지의 내부 검토본입니다.",
    "purpose": "가족의 외출에서 시작하는 일상 이야기를 브랜드 웹툰으로 구성했습니다",
    "scope": "장면과 대사를 5페이지의 읽는 흐름으로 정리했습니다 제품 관련 표현은 고객 검토 전 시안입니다",
    "media": [
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-outing-webtoon/gallery-01.webp",
        "alt": "YoFree 엄마가 자꾸 멈추는 이유 1페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-outing-webtoon/gallery-02.webp",
        "alt": "YoFree 엄마가 자꾸 멈추는 이유 2페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-outing-webtoon/gallery-03.webp",
        "alt": "YoFree 엄마가 자꾸 멈추는 이유 3페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-outing-webtoon/gallery-04.webp",
        "alt": "YoFree 엄마가 자꾸 멈추는 이유 4페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      },
      {
        "kind": "webtoon",
        "src": "/reference-review/yofree-outing-webtoon/gallery-05.webp",
        "alt": "YoFree 엄마가 자꾸 멈추는 이유 5페이지",
        "width": 1024,
        "height": 1536,
        "presentation": "webtoon"
      }
    ]
  },
  {
    "slug": "yofree-shop",
    "id": "AIO-WORK-YOFREE-SHOP-01",
    "brand": "YoFree",
    "title": "쇼핑몰 고객 시연",
    "division": "development",
    "primaryService": "shopping-mall",
    "relatedServices": [],
    "productionStatus": "제작 후보",
    "visibility": "review",
    "rightsConfirmed": false,
    "featuredOrder": 4,
    "description": "브랜드와 제품 탐색 동선을 보여주는 고객 검토용 시연입니다. 실제 판매는 미실행입니다.",
    "purpose": "요프리의 브랜드와 제품 정보를 구매 동선에 맞춰 정리했습니다",
    "scope": "홈·브랜드·제품·원리·고객센터와 루틴·선물 동선을 제작한 고객 시연입니다 실제 주문·결제와 판매 조건은 확정 전입니다",
    "media": [
      {
        "kind": "image",
        "src": "/reference-review/yofree-shop/hero.webp",
        "alt": "YoFree 쇼핑몰 고객 시연 PC 화면",
        "width": 1440,
        "height": 900,
        "presentation": "site"
      }
    ]
  }
]
    : [];
