# 웹사이트 서비스 페이지 에이전시 리디자인

**날짜**: 2026-06-02  
**대상 파일**: `components/landing/website-landing.tsx`  
**범위**: 히어로 교체 + MockupShowcase 신규 + 업종별 섹션 개선 (Pricing/Process/CTA는 기존 유지)

---

## 1. 목표

현재 흰 배경 + 일반 이미지 히어로 구성을 **웹 에이전시 느낌**으로 업그레이드.  
핵심: **다크 히어로 + PC·모바일 목업 안에 실제 작업물 스크린샷 표시**.

---

## 2. 페이지 구조

```
[신규] DarkHero           — #0D1117 배경, 대형 타이포, 하단에 MacBook 상단 노출
[신규] MockupShowcase     — #0D1117 연속, MacBook+iPhone 목업 + 필터 칩
       ↕ 다크→화이트 전환
[유지] TrustNumbers       — 기존 컴포넌트 그대로
[개선] 업종별 섹션         — 이모지 → SVG 아이콘 + 8개 + hover 민트 효과
[유지] PricingTiers       — 기존 컴포넌트 (정렬 수정 완료)
[유지] ProcessSteps       — 기존 컴포넌트
[유지] ServiceCta         — 기존 컴포넌트
```

---

## 3. DarkHero 상세 명세

### 레이아웃
- 배경: `#0D1117`
- `min-height: 100vh`, 가운데 정렬 (`text-align: center`)
- 하단 패딩 없음 — MockupShowcase 섹션과 자연스럽게 연결

### 콘텐츠 (위→아래)
```
eyebrow  : "WEBSITE · 웹사이트 제작"
           색상: #4DD4AC (mint), 폰트: JetBrains Mono, 12px, tracking 0.28em

h1       : "스크롤을 멈추게"  (흰색)
           "만드는 홈페이지"  ("홈페이지" = #4DD4AC)
           크기: clamp(44px, 7vw, 96px), fontWeight 700, letterSpacing -0.03em

sub      : "랜딩페이지·회사 홈페이지·서비스 사이트."
           "운영 가능한 완성품을 5일 이내 납품합니다."
           색상: rgba(240,246,252,0.65), 16px, max-width 560px

badges   : [ 5일 납품 ]  [ 14일 A/S ]  [ SEO 세팅 포함 ]
           border: 1px solid #4DD4AC, color: #4DD4AC, 10px, pill

CTA      : "웹사이트 제작 문의 →"
           bg: #4DD4AC, color: #0D1117, 14px bold, hover: translateY(-2px)
```

### 하단 목업 힌트
히어로 섹션 하단에 MacBook 프레임 상단 25%가 노출됨 → 스크롤 유도  
구현: `overflow: visible`, MockupShowcase의 MacBook div가 히어로 영역을 침범하도록 `margin-top: -120px` 또는 `position: relative; top: -120px`

---

## 4. MockupShowcase 상세 명세

### 배경 + 구조
- 배경: `#0D1117` (히어로 연속)
- 섹션 하단: `padding-bottom: 0`, 다음 TrustNumbers가 흰 배경이므로 자동 전환

### 헤딩
```
$ aio portfolio --live    ← 민트 터미널 스타일 (선택적)
"결과를 먼저 보고 결정하세요"  ← 흰색, clamp(28px ~ 44px)
"데모가 아닙니다. 실제 운영 중인 사이트입니다."  ← fg-2 색상
```

### 필터 칩
```
[ 전체 ] [ 병원·의료 ] [ 법률·세무 ] [ 쇼핑몰 ] [ 스타트업 ]
```
- 선택: `bg: #4DD4AC, color: #0D1117`
- 미선택: `border: 1px solid rgba(255,255,255,0.15), color: rgba(255,255,255,0.6)`
- `useState` 로 active 관리

### 목업 영역
```
[MacBook 프레임]                    [iPhone 프레임]
 width: 76% max 900px               position: absolute
 은색/스페이스그레이 CSS 프레임       right: 4%, bottom: -8%
 브라우저 크롬 (주소창 + traffic dots) rotate: 2.5deg
 내부 스크린에 <Image> 삽입           내부 스크린에 <Image> 삽입
```

**MacBook CSS 프레임 핵심:**
- 본체: `background: linear-gradient(180deg, #A8AAAE, #9A9C9F)` (space gray)
- 베젤: `background: #1a1a1a`, `border-radius: 8px 8px 0 0`
- 브라우저 크롬 (스크린 내부 상단):
  - traffic dots: `#FF5F57 / #FEBC2E / #28C840` (10px 원형)
  - URL bar: `background: #2a2a2a`, `border-radius: 4px`, `font: 11px mono`
  - URL 텍스트: 필터별 실제 도메인 표시 (예: `jaeheon-clinic.com`)
- 스크린: `aspect-ratio: 16/10`, overflow hidden
- 그림자: `filter: drop-shadow(0 60px 100px rgba(0,0,0,0.7))`

**iPhone CSS 프레임 핵심:**
- 본체: `background: #1a1a1a`, `border-radius: 44px`
- Dynamic Island: 검정 pill `width: 90px, height: 28px` at top center
- 내부 스크린: `border-radius: 36px`, overflow hidden, `aspect-ratio: 9/19.5`
- 그림자: `filter: drop-shadow(0 35px 70px rgba(0,0,0,0.6))`

### 이미지 경로 규칙
```
public/images/portfolio/
  ws-all-desktop.jpg       1280×800  (필터 "전체")
  ws-all-mobile.jpg         390×844
  ws-medical-desktop.jpg   1280×800  (병원·의료)
  ws-medical-mobile.jpg     390×844
  ws-legal-desktop.jpg     1280×800  (법률·세무)
  ws-legal-mobile.jpg       390×844
  ws-shop-desktop.jpg      1280×800  (쇼핑몰)
  ws-shop-mobile.jpg        390×844
  ws-startup-desktop.jpg   1280×800  (스타트업)
  ws-startup-mobile.jpg     390×844
```
- 이미지 없을 시 카테고리별 그라디언트 플레이스홀더 표시
- `next/image`의 `fill` + `object-fit: cover` 사용

### 이미지 전환
- `useState(activeCategory)` 로 관리
- 필터 변경 시 이미지 컨테이너에 `opacity: 0 → 1` CSS transition (0.3s)
- `key={activeCategory}` 로 교체 시 리마운트 유도

### 카드별 메타 데이터
```ts
const SHOWCASE = [
  { id: "all",     label: "전체",     domain: "aio-make.com",       name: "AIO 스튜디오",    kpi: "누적 142개 프로젝트",  gradient: "linear-gradient(135deg,#1a3a4a,#4DD4AC)" },
  { id: "medical", label: "병원·의료", domain: "jaeheon-clinic.com",  name: "자연한의원",      kpi: "예약 +120%",           gradient: "linear-gradient(135deg,#1a2a3a,#2d6e8a)" },
  { id: "legal",   label: "법률·세무", domain: "seoul-legal.kr",      name: "서울법무사사무소", kpi: "상담문의 +85%",         gradient: "linear-gradient(135deg,#1a1f0a,#4a6228)" },
  { id: "shop",    label: "쇼핑몰",   domain: "chefmeal.co.kr",      name: "셰프밀 식품몰",    kpi: "매출 +28%",            gradient: "linear-gradient(135deg,#2a1f0a,#8a6228)" },
  { id: "startup", label: "스타트업", domain: "v-aio.app",           name: "V-AIO 서비스",    kpi: "전환율 +52%",          gradient: "linear-gradient(135deg,#0a1a2a,#2a4a8a)" },
]
```
→ 이미지가 없을 경우 `gradient` 값이 플레이스홀더 배경으로 사용됨

### 하단
```
[ 전체 포트폴리오 보기 → ]  링크: /{locale}/services/website/portfolio
스타일: ghost 버튼, mint border
```

---

## 5. 업종별 섹션 개선

### 변경 사항
- `🏥 이모지` → `mint bg(10%) + mint SVG 아이콘 박스` (32×32px)
- 4개 → 8개 업종
- 카드 hover: `border-color: #4DD4AC`, `transform: translateY(-2px)`
- 기존 흰 배경 유지

### 8개 업종 목록
```ts
const INDUSTRIES = [
  { icon: "hospital",  title: "병원·의료",    desc: "의원·한의원·치과·성형외과. 예약·진료 안내·의료광고법 대응." },
  { icon: "scale",     title: "법률·세무",    desc: "변호사·법무사·세무사. 상담 유도와 전문성 강조에 최적화." },
  { icon: "book-open", title: "교육·학원",    desc: "학원·과외·온라인 강의. 강사·시간표·수강 신청 시스템." },
  { icon: "cart",      title: "쇼핑몰·D2C",  desc: "카페24·자사몰. 상품성과 구매 동선 최적화." },
  { icon: "coffee",    title: "F&B·카페",     desc: "음식점·카페·베이커리. 메뉴·매장·주문 흐름." },
  { icon: "sparkles",  title: "뷰티·미용",    desc: "미용실·네일·피부관리. 시술 메뉴·예약·후기." },
  { icon: "home",      title: "부동산",       desc: "중개·분양·임대. 매물 리스트·지도·문의." },
  { icon: "rocket",    title: "스타트업·서비스", desc: "빠른 런칭과 전환율 중심의 서비스 랜딩페이지." },
]
```
→ SVG 아이콘은 Heroicons 또는 Lucide (프로젝트에 lucide-react 설치됨 확인)

---

## 6. 구현 범위 정리

| 항목 | 방식 |
|---|---|
| `WebsiteLanding` | 전체 재작성 (기존 DarkHero 대체 + MockupShowcase 추가 + 업종별 개선) |
| `ServiceHero` | 더 이상 사용하지 않음 (DarkHero로 대체) |
| `TrustNumbers` | 기존 컴포넌트 그대로 import |
| `PricingTiers` | 기존 컴포넌트 그대로 import (수정 완료) |
| `ProcessSteps` | 기존 컴포넌트 그대로 import |
| `ServiceCta` | 기존 컴포넌트 그대로 import |
| 이미지 플레이스홀더 | 그라디언트 (이미지 준비 전까지) |
| 이미지 실제 적용 | `/public/images/portfolio/ws-{id}-{device}.jpg` 추가 시 자동 반영 |

---

## 7. 주의 사항

1. `"use client"` 필요 — `useState` 사용 (필터 칩)
2. `next/image`의 `fill` 사용 시 부모에 `position: relative` + 명시적 크기 필요
3. `lucide-react` 아이콘 사용 — 이미 설치되어 있음 (`components/[locale]/services/[category]/page.tsx`에서 ArrowLeft import 확인됨)
4. MockupShowcase는 `"use client"` 컴포넌트 안에 있으므로 hydration 이슈 없음
5. AioNav는 `level="leaf" sub="website"` 유지 (이미 수정됨)

---

## 8. 완료 체크리스트

- [ ] DarkHero 다크 배경 + 타이포 확인
- [ ] MockupShowcase 필터 칩 전환 작동
- [ ] MacBook 프레임 사실적 느낌 확인
- [ ] iPhone 오버랩 위치 확인
- [ ] 이미지 없는 상태에서 그라디언트 플레이스홀더 표시 확인
- [ ] 업종별 8개 + SVG 아이콘 확인
- [ ] 모바일(375px) 반응형 이상 없음
- [ ] `npm run build` 통과
- [ ] push → Vercel 배포 확인
