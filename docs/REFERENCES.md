# 레퍼런스 등록

작품 데이터의 원본은 `content/works/<slug>.json`입니다. `lib/generated/works.generated.ts`는 자동 생성물이므로 직접 수정하지 않습니다.

## 새 작품 추가: 5단계

1. `public/reference-review/<slug>/`에 원본 또는 웹용 파일을 준비합니다. 파생물이 필요하면 JSON의 해당 `media.source`에 원본 경로를 지정합니다. 기존 파일은 덮어쓰지 않습니다.
2. `content/works/<slug>.json`을 작성합니다. 파일명과 `slug`를 일치시키고 서비스 ID는 `lib/content.ts`에서 확인합니다. 처음에는 `visibility: "review"`, `rightsConfirmed: false`로 등록합니다.
3. `npm run works:build -- --media`를 실행합니다. `source`가 지정된 누락 미디어만 sharp/ffmpeg로 생성하고 모든 JSON을 검증한 뒤 TS를 갱신합니다. 이미 준비된 미디어를 등록할 때는 `npm run works:build`만 실행해도 됩니다.
4. `npm test`를 실행합니다. 테스트는 직렬로 실행됩니다. 로컬 미디어 존재까지 확인하려면 PowerShell에서 `$env:AIO_VERIFY_LOCAL_MEDIA='1'; npm test`를 실행합니다. 검토 플래그를 켠 로컬 페이지에서도 화면·미디어를 확인합니다.
5. 공개 권리와 최종 파일을 확인한 **제작 완료·운영 중 작품**은 `visibility: "public"`, `rightsConfirmed: true` 두 값을 변경하고 다시 생성·검증합니다. `제작 후보`는 먼저 실제 제작 상태를 확인해야 하며 공개 검증을 통과하지 못합니다. 이 작업은 배포와 별도입니다.

## 필드

| 필드 | 설명 |
| --- | --- |
| `slug`, `id` | 고유 URL 식별자와 작품 ID. `slug`는 소문자·숫자·하이픈으로 작성하며 파일명과 일치 |
| `brand`, `title` | 브랜드와 작품 제목 |
| `division` | `video`, `development`, `marketing` 중 하나. 컨텐츠 URL은 `/content` |
| `primaryService` | 해당 분과의 서비스 ID |
| `relatedServices` | `{ "division": "video", "id": "brand-film" }` 형태의 연관 서비스 배열 |
| `productionStatus` | `제작 예시`, `제작 후보`, `제작 완료`, `운영 중` 중 하나 |
| `visibility`, `rightsConfirmed` | 표시 상태와 공개 권리 확인. 공개에는 `public`과 `true`가 모두 필요 |
| `featuredOrder` | 선택 항목. 작은 정수부터 정렬하며 미지정 작품은 지정 작품 뒤로 배치 |
| `description`, `purpose`, `scope` | 작품 설명, 제작 목적, 작업 범위. 목적과 범위는 서로 다른 문장 |
| `media` | 표시 순서대로 작성하는 미디어 배열. 최소 1개 필요 |
| `media.kind`, `src`, `alt` | `image`, `video`, `webtoon` 중 하나, 사이트 내부 경로, 대체 설명 |
| `poster` | 영상에 필수인 `.webp` 포스터 경로 |
| `mobileSrc`, `width`, `height` | 선택 항목. 모바일 미디어 경로와 기존 파일의 가로·세로 크기 |
| `presentation` | 선택 항목. `site`, `wide`, `portrait`, `webtoon`, `square` 중 하나 |
| `source` | 선택 항목. 원본 절대 경로 또는 작업트리 기준 상대 경로. 빌드 입력 전용으로 생성 TS·브라우저에는 포함하지 않음 |

웹툰은 `gallery-01.webp`, `gallery-02.webp` 순서로 작성합니다. `--media`의 출력은 작품의 `/reference-review/<slug>/` 안에만 생성됩니다. 이미지 파생물은 최대 1600×2400, 영상은 최대 1280×1280·30fps로 준비합니다. 다른 화면비의 별도 원본은 다른 media 항목의 `source`에 지정합니다.

현재 18개 고객 작품의 공개 권리는 UNKNOWN/HOLD입니다. `review` 또는 권리 미확인 작품은 `NEXT_PUBLIC_AIO_REFERENCE_REVIEW="1"`인 로컬 검토에서만 표시하며 noindex를 유지합니다. 공개 카탈로그와 사이트맵에는 포함하지 않습니다. 플래그를 끈 빌드의 브라우저 JavaScript에서도 검토 작품 데이터가 제거됩니다. 검토 빌드는 Vercel 배포가 차단됩니다.

## 더미 JSON

아래는 등록 형식 예시이며 실제 고객 실적이 아닙니다. 사용하려면 해당 원본 파일을 준비해야 합니다.

```json
{
  "slug": "sample-motion",
  "id": "AIO-WORK-SAMPLE-MOTION-01",
  "brand": "샘플 브랜드",
  "title": "모션그래픽 제작 예시",
  "division": "video",
  "primaryService": "motion-graphics",
  "relatedServices": [{ "division": "video", "id": "brand-film" }],
  "productionStatus": "제작 예시",
  "visibility": "review",
  "rightsConfirmed": false,
  "featuredOrder": 100,
  "description": "등록 방법을 설명하는 더미 작품입니다",
  "purpose": "제품 소개 문구의 전달 순서를 확인합니다",
  "scope": "글자와 제품 이미지의 움직임을 구성한 영상 예시입니다",
  "media": [{
    "kind": "video",
    "src": "/reference-review/sample-motion/hero.mp4",
    "poster": "/reference-review/sample-motion/hero-poster.webp",
    "alt": "샘플 브랜드 제품 소개 모션그래픽 연출 예시",
    "presentation": "wide",
    "source": "content/sources/sample-motion.mp4"
  }]
}
```

sharp는 기존 의존성을 사용합니다. 영상 원본을 변환할 때는 로컬 `ffmpeg`가 필요합니다. 기존 5개 경로 인자를 받는 `scripts/prepare-reference-media.mjs` 실행 방식은 유지하며 결과 미디어 데이터는 지정한 보고서 폴더의 `PREPARED_WORK_MEDIA.json`에 기록합니다.
