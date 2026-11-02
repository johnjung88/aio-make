# R4 컨텐츠 홈 동적 구성 계획

2026-10-14 · A 홈전용소유 · 메인기준복원/서비스6종문서와분리

## 2026-10-14 범위 정정 후 컨텐츠 동적 구성 추가

메인은 BRIEF_MAIN_SCOPE_RESTORE에 따라 기준복원하고 지정워크플로우밖변경금지
이번추가A수정은 components/content-home 및 lib/content-home에만한정
사용자최신동적요구로이전R3정적갤러리방침교체

로컬reference dist/app.js updateCarousel관측:거리별translateX±365/212, translateZ-170/-95, rotateY±42, scale1/.88/.72
실제검증자carousel-0/3이미지에서중간상태기울기와중앙정면카드안착확인
선택이동React state→CSS 3D transform보간으로구현,터치45px·키보드·카드내화살표
배경색변환은사용자검정통일원칙에따라제외
실제작업물/공개fallback·원비율·시작가정본·CTA계층유지

reference selectStep/processArt는문서→콘티→제작타임라인→검수→납품파일의미디어상태교체
현행정본4단계상담/기획/제작/납품을유지하며문서/콘티/영상타임라인/파일스택으로표현
자료는서버gate를거친journey props와중성문서도형만사용,생성/추가자산다운로드없음
기획2회/최종1회수정과파일인계범위정본불변
오프스크린/탭비활성/reducedmotion시영상·CSSloop중지,선택기능은유지


결과: RESULT_CONTENT_HOME_MOTION_R4.md
서비스6종문서는 B소유 BRIEF_CONTENT_MOTION_R4.md / RESULT_CONTENT_MOTION_SERVICES_R4.md
원문추가기록은 BRIEF_DESIGN_R3.md에보존
