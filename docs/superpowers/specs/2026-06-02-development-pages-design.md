# 개발 카테고리 4페이지 설계 (2026-06-02)

## 트래픽 구조 (설계 최우선 원칙)

```
광고·검색 → 웹사이트/쇼핑몰/자동화 상세 페이지  (가장 많음 — 전환 랜딩페이지)
광고·검색 → 개발 허브                            (중간 — 라우팅 페이지)
명함·소개  → 메인 페이지                         (브랜드 확인 페이지)
```

**서브 서비스 페이지(웹사이트·쇼핑몰·자동화)**: 처음 보는 차가운 방문자가 대상.
"이 회사가 내 사이트를 잘 만들 수 있나?" 를 혼자서 설득해야 함.
→ **포트폴리오·가격·신뢰 지표·CTA를 스크롤 최상단에 집중 배치**.

**개발 허브**: 4개 서비스 중 뭘 원하는지 모르고 온 사람이 대상.
→ 빠른 라우팅 + 브랜드 신뢰. 깔끔한 인덱스.

---

## 공통 베이스

- **배경**: `#FFFFFF`
- **본문**: `#111111`
- **보조**: `#6B7280`
- **폰트**: Pretendard (본문), JetBrains Mono (수치·배지)
- **레이아웃**: `max-w-[1280px] mx-auto`
- **교체 대상**: 기존 `components/landing/*.tsx` 직접 교체

---

## 1. 개발 허브 `/services/development`

**역할**: 라우팅 + 브랜드 신뢰. 4개 서비스로 빠르게 보낸다.

### 포인트 컬러
- **Black** `#111111`

### 섹션 구성 (심플·빠름)

| # | 섹션 | 내용 |
|---|---|---|
| 1 | **Hero** | "코드로 만드는 모든 것" + 수치 3개(5일/98%/142) + CTA + 히어로 이미지 |
| 2 | **4서비스 카드** | 웹·쇼핑몰·자동화·앱(예정) 카드. 클릭 → 각 상세 페이지 |
| 3 | **일하는 방식** | 4강점 (투명·완성품·속도·A/S) |
| 4 | **CTA** | 제작 문의 |

### Hero 이미지
- **신규 생성 필요**
- 저장: `public/images/services/development-hero.png`

**생성 프롬프트:**
```
Korean development team in a modern tech office, various team members 
working at computers — some coding, some designing, some in discussion, 
full studio overview, bright professional atmosphere, 
overhead wide angle, editorial documentary photography, photorealistic
1600×900px
```

---

## 2. 웹사이트 `/services/website`

**역할**: 전환 랜딩페이지. "웹사이트 제작 에이전시" 검색 후 유입.
처음 본 사람이 견적 문의를 남기도록 설득.

### 포인트 컬러
- **Mint** `#4DD4AC`

### 섹션 구성 (전환 최적화 — 위에서부터 설득)

| # | 섹션 | 내용 | 이유 |
|---|---|---|---|
| 1 | **Hero** | "스크롤을 멈추게 만드는 홈페이지" + 히어로 이미지 + **CTA 버튼** + 신뢰 배지(5일 납품·1개월 A/S) | 첫 화면에서 CTA 노출 |
| 2 | **포트폴리오 쇼케이스** | 실제 납품 사이트 그리드 (병원·법률·커머스·스타트업) | "이런 걸 만드는구나" 즉시 확인 |
| 3 | **신뢰 수치** | 의뢰 142건·재의뢰율 98%·평균 응답 23분 | 불신 제거 |
| 4 | **업종별 전문** | 병원·법률·쇼핑몰·스타트업 전문 소개 | "내 업종도 되는구나" |
| 5 | **가격 3티어** | Light / Standard / Premium — 가격 투명하게 | 가격 궁금증 선제 해소 |
| 6 | **제작 프로세스** | 상담→견적→제작→납품→A/S | 불안감 해소 |
| 7 | **CTA** | 제작 문의 (재노출) | 최종 전환 |

### Hero 이미지
- `public/images/services/website-hero.png` ✅ 완료

---

## 3. 쇼핑몰 `/services/shopping-mall`

**역할**: 전환 랜딩페이지. "카페24 쇼핑몰 제작" 검색 후 유입.

### 포인트 컬러
- **Orange** `#FB923C`

### 섹션 구성 (전환 최적화)

| # | 섹션 | 내용 | 이유 |
|---|---|---|---|
| 1 | **Hero** | "팔리는 쇼핑몰을 구축합니다" + 히어로 이미지 + **CTA** + 신뢰 배지 | 즉시 CTA |
| 2 | **쇼핑몰 쇼케이스** | 카페24 실제 구축 예시 (뷰티·식품·패션·리빙) | 결과물 먼저 |
| 3 | **신뢰 수치** | 구축 건수·재의뢰율·응답 속도 | 신뢰 구축 |
| 4 | **포함 내역** | 상품등록·결제연동·모바일최적화·1개월A/S | "다 해주는구나" |
| 5 | **업종별 전문** | 뷰티·식품·패션·리빙 | 내 업종 확인 |
| 6 | **가격 3티어** | Light / Standard / Premium | 가격 투명 |
| 7 | **CTA** | 쇼핑몰 제작 문의 (재노출) | 최종 전환 |

### Hero 이미지
- `public/images/services/shopping-hero.png` ✅ 완료

---

## 4. 자동화·프로그램 `/services/automation-app`

**역할**: 전환 랜딩페이지. "업무 자동화 개발" "엑셀 자동화" 검색 후 유입.

### 포인트 컬러
- **Indigo** `#818CF8`

### 섹션 구성 (전환 최적화 — Before/After 임팩트 먼저)

| # | 섹션 | 내용 | 이유 |
|---|---|---|---|
| 1 | **Hero** | "반복 업무를 코드에게" + 히어로 이미지 + **CTA** + 신뢰 배지 | 즉시 CTA |
| 2 | **Before/After 케이스** | 엑셀파싱·알림발송·크롤링·매크로 — 수동 vs 자동화 비교 | "이거 나 얘기잖아" |
| 3 | **시간 절약 계산** | "하루 N시간 × 365일 = N시간/년 절약" | 임팩트 숫자 |
| 4 | **신뢰 수치** | 구축 건수·재의뢰율 | 신뢰 구축 |
| 5 | **기술 스택** | n8n · Make · Python · Electron | 실력 증명 |
| 6 | **가격 3티어** | Light / Standard / Premium | 가격 투명 |
| 7 | **CTA** | 자동화 문의 (재노출) | 최종 전환 |

### Hero 이미지
- `public/images/services/automation-hero.png` ✅ 완료

---

## 이미지 현황

| 페이지 | 파일 | 상태 |
|---|---|---|
| 허브 | `public/images/services/development-hero.png` | ⏳ 생성 필요 |
| 웹사이트 | `public/images/services/website-hero.png` | ✅ 완료 |
| 쇼핑몰 | `public/images/services/shopping-hero.png` | ✅ 완료 |
| 자동화 | `public/images/services/automation-hero.png` | ✅ 완료 |

---

## 공통 컴포넌트 패턴

4페이지 공통으로 쓰는 블록을 재사용 컴포넌트로 추출:

- `ServiceHero` — `{ headline, sub, accentColor, imageSrc, badges, ctaHref }`
- `TrustNumbers` — 수치 3개 바 (의뢰수·재의뢰율·응답시간)
- `PricingTiers` — 3티어 가격표 (`servicesData` 활용)
- `ProcessSteps` — 제작 프로세스 단계

---

## 데이터 소스

- 가격·납기·서비스 내역: `lib/services-data.ts` 기존 그대로
- 포트폴리오: `public/portfolio/` 기존 이미지
- 신규 이미지: `public/images/services/`

---

## 검증 기준

- [ ] 서브 서비스 3페이지: 첫 화면(above the fold)에 CTA 버튼 노출
- [ ] 375 / 768 / 1024 / 1440 반응형 4단계 정상
- [ ] 각 페이지 포인트 컬러 명확히 구분
- [ ] `npm run build` TypeScript 오류 없음
- [ ] 포트폴리오 이미지 lazy loading + alt 텍스트
- [ ] CTA 버튼 → `/[locale]/quote` 링크 정상
