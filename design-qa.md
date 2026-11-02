# 가이드 기준 화면 검증 v03

2026-10-01 KST · 담당 Codex 자기 검증 · 독립 AI 검토 아님

final result: passed

이 판정은 아래에서 직접 확인한 로컬 화면·동선의 디자인 품질에 한정한다. 운영 계정 연결·실제 기기·배포 완료를 뜻하지 않는다.

## 비교 조건

원본 ZIP의 선정 HTML 12종을 별도 서버에서 렌더했다. Windows Chrome을 보이는 상태로 두고 원본/구현을 1400×900 CSS viewport에서 각각 캡처했다. 양쪽 실제 콘텐츠 폭은 스크롤바 제외1385px다. 같은 상태와 크기의 원본/구현을 나란히 합성하고 실제 이미지로 확인했다.

|표면|직접 확인한 결과|근거|
|---|---|---|
|구성·배치|메인·회사소개·Studio/Marketing/Lab 홈·Studio 문의의 원본 순서와 카드 배치 유지|docs/renewal/iteration-v03/comparison-*-visible-final.jpg 6쌍|
|서체·행갈이|Pretendard/Unbounded/JetBrains Mono, 원본 자간 우선 행맞춤. Marketing 제목 경계 일치|focus-main/focus-marketing-visible-final.jpg, comparison-state-final.json|
|색·버튼|밝은 Marketing 첫 화면, 어두운 Studio/Lab, 보라 CTA. 문의 선택 상태·Studio 화살표 확인|focus-contact-visible-final.jpg, comparison-studio-visible-final.jpg|
|이미지|사무실 배경 유지, 생성 브랜드 필름/마케팅 이미지와 제작 예시 표시. 모바일 cover 선명도 보완|comparison-mobile-cover-final.jpg, main-delivery-final.jpg|
|모바일·동선|14서비스375px 실제 화면, 메뉴·탭·FAQ·Lab 예시·문의/관리자 동선 확인|services-{marketing,lab,video}-375-final.jpg, responsive-delivery.json, browser-*.json|

47폭/템플릿 기록에서 clientWidth=scrollWidth이고 보이는 깨진 이미지가 없었다. 대표375/768/1400px·관리자 모바일 포함. Chrome viewport 검증이며 물리 스마트폰 검증은 아니다.

## 발견 → 수정 → 재확인

- 가이드에서 벗어난 v02 → 12개 가이드를 일반 React 화면으로 변환, 원본 토큰·순서·서체 복원 → 6쌍 비교.
- Marketing 제목 크기 차이/단계 카드 넘침 → 원본 행맞춤·반응형 열 수정 → 제목 경계와 모바일 재확인.
- 모바일 배경 흐림 → cover에1200px 이미지 선택 → 전/후 같은 폭에서 직접 비교.
- Studio 빈 원형 버튼 → 화살표/제작 방향 링크 → 최신 비교 화면 확인.
- 가격·포함 범위 불일치 → 개발 사업v12·마케팅 사업v36·영상 사업v06 반영 → production 조건 검사와 가격 영역 확인.
- Lab 권한 버튼 이름 누락 → 접근 가능한 이름/aria-pressed → production에서 매니저 권한 토글 확인.
- 가상 고객·성과·직원 → 명시한 제작/운영 예시와 업무 역할 → 실제 실적과 구분 확인.

확인 범위에 남은 실행 가능한 P0/P1/P2 디자인 결함은 발견하지 않았다. 원본에서 보완한 내용은 사실성·실제 링크·저장·접근성·사업 조건에 필요한 변경이다.

## 제외한 캡처와 한계

최소화 중 만든 pass5·빈/지연 캡처는 판정에서 제외했다. Marketing 자동 단계 상태가 다른 비교도 제외하고 같은01 상태에서 재캡처했다. 스크롤 후 clip y=0으로 잘못 잡은 가격 이미지는 website-price-wrong-crop-excluded.jpg로 보존하고, scrollY를 적용한 website-approved-prices-1400.jpg로 교체했다. contact-disconnected-375-delivery.jpg는 오류 위치의 이미지 증거로 사용하지 않으며 실제 오류 관측은 browser-delivery.json을 따른다.

원본 Studio stock 영상은 직접 생성한 콘셉트 이미지로 대체하고 실제 영상 등록 전 상태를 표시했다. 운영 Supabase/GA4 서버 인증·Storage·Advisors·실제 기기·field CWV·운영 개인정보 조건·배포는 RELEASE.md의 남은 게이트다.

마지막 인계 화면의 Marketing 카드 분류 불일치(SNS→AI 인플루언서)는 서비스/CMS service 값 기반 공통 분류로 수정하고 실제 DOM에서 링크와 함께 재확인했다.
