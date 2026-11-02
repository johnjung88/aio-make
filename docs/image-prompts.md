# W-W8 문서담 이미지 생성 기록

갱신일: 2026-11-01 · 개정번호: 1 · 상태: PC2 Codex W-W8 · 로컬 정적 이미지 검증 완료

- 최종 파일: `public/lab-website/munseodam-mobile.webp`
- 생성 도구: Codex 내장 image_gen, 생성 횟수 1회 (화면 전체가 아닌 사진 1장)
- 유료 생성·가입 없음 (별도 유료 API·외부 AI·가입 사용 없음)
- 생성 원본: `C:/Users/aioma/.codex/generated_images/01a1957e-3747-7d02-824e-0109f7a28556/exec-40c46d73-27e5-4e79-b649-22805cd0069d.png`
- 보관 및 재현 파일: `C:/AIO-PC2/50-scratch/codex/261101/W-W8/`의 `hero-source.png`, `hero.webp`, `mobile.html`, `capture.cjs`, `process.cjs`, `manifest.json`

## image_gen 최종 프롬프트 원문

```text
Use case: photorealistic-natural
Asset type: mobile website hero photograph for a legal and tax consultation preparation office
Primary request: A realistic editorial photograph of a neatly arranged consultation table by a window, with tidy blank documents, an unbranded fountain pen, a notebook, and a wine burgundy cover binder
Composition: close view of the tabletop, landscape 4:3 framing that can crop to 390 by 300 pixels, objects arranged naturally
Lighting: soft window daylight, calm ivory and deep wine palette, tactile paper and wood
Constraints: no people, no faces, no logos, no trademarks, no readable letters, no words, no numbers, no labels or stickers, no watermark, no text anywhere
```

## HTML 합성 방식과 검증

사진에서 서류·만년필·와인색 바인더가 있는 부분을 잘라 780×600 WebP로 준비하고, 로컬 HTML의 높이 300px 사진 영역에 배치했다. 머리 로고, 메뉴, 와인색 본문, 준비 버튼과 상담 분야 목록은 HTML/CSS로 구성했다. 저장소의 PretendardVariable.woff2를 로컬 파일로 불러왔다. 한글은 생성 이미지에 쓰지 않았다

지정 Playwright의 headless Chromium으로 file URL을 열고 390×844, deviceScaleFactor=1에서 폰트와 이미지 decode를 기다린 뒤 PNG를 캡처했다. Sharp quality 85로 최종 WebP를 만들었다. 로컬 폰트 로딩 true와 viewport 390×844를 확인하고 최종 그림을 직접 열어 검수했다. 문장 끝 마침표와 시연 표시, 이미지 위 라벨은 없다. 신규 실적·후기·인증·주소·전화번호를 넣지 않았다

다른 13개 파일은 생성하지 않았다. 명세가 지정한 배경색 덮기·상단 띠 자르기 방식으로 12개를 편집하고 nest-close.webp는 바이트 그대로 복사했다. 상단 띠를 자른 파일은 하단 배경을 같은 높이만큼 늘려 원래 크기를 유지했다. clinic-pc의 사진 배경은 지운 영역 위아래 픽셀을 열별 보간했다. 의료광고 고지는 유지했다. 처리 좌표·원본/결과 SHA256은 재현 폴더의 manifest.json에 있다

이 기록은 정적 그림에 관한 것이며 서비스 운영·실제 접수·배포 완료를 의미하지 않는다. 페이지의 새 이미지 연결 및 빌드는 PC2 Claude 담당이다
