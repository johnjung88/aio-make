(function () {
  const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
  const P = 'public/portfolio/';
  const services = [
    { key: 'website', no: '01', en: 'WEBSITE', name: '웹사이트 제작', tab: 'web',
      short: '회사 홈페이지 · 랜딩페이지 · 서비스 사이트',
      desc: '시안이 아닌 완성된 사이트로 납품합니다. 검색 기본 설정과 문의 폼 연동까지 마친 상태로 넘겨드립니다',
      stack: ['Next.js', 'React', 'WordPress', 'Vercel'], days: '평균 2일',
      desk: P + 'med-ondam/live.png', mob: P + 'med-ondam/mobile-preview.png', url: 'ondam.clinic' },
    { key: 'shop', no: '02', en: 'SHOPPING MALL', name: '쇼핑몰 제작', tab: 'web',
      short: '카페24 · 독립몰 구축',
      desc: '상품 등록, 결제 연동, GA4와 광고 픽셀까지 세팅해 오픈하는 날부터 광고를 시작할 수 있게 넘겨드립니다',
      stack: ['카페24', 'PG 결제', 'GA4', 'Meta 픽셀'], days: '평균 2일',
      desk: 'public/images/portfolio/ws-mealkit-scroll.png', mob: 'public/images/portfolio/ws-shop-mobile.png', url: 'chefmeal.co.kr' },
    { key: 'automation', no: '03', en: 'AUTOMATION', name: '업무 자동화', tab: 'auto',
      short: '엑셀 · 크롤링 · 알림 · 워크플로',
      desc: '매일 반복하는 엑셀 정리, 데이터 수집, 알림 발송을 코드로 바꿉니다. 지금 쓰는 도구는 그대로 둡니다',
      stack: ['Python', 'n8n', 'Google Sheets', 'API'], days: '평균 10일',
      desk: P + 'blogautopilot-multinational/real-demo/app-schedule.png', url: 'autopilot.app/schedule' },
    { key: 'program', no: '04', en: 'PROGRAM', name: '프로그램 개발', tab: 'auto',
      short: '관리자 페이지 · 사내 시스템 · 데스크톱 앱 · 챗봇',
      desc: '우리 업무 방식에 맞춘 도구를 만듭니다. 화면 설계부터 서버 배포까지 한 팀이 맡습니다',
      stack: ['Next.js', 'Node.js', 'Electron', 'PostgreSQL'], days: '평균 10일',
      desk: P + 'v-aio-admin/dashboard.png', url: 'admin.v-aio.kr' }
  ];
  const cases = [
    { slug: 'ondam', svc: 'website', client: '온담 한의원', ind: '병원·의료', title: '진료 안내와 예약 동선을 한 화면에 정리했습니다', url: 'ondam.clinic', kpi: '+120%', kpiL: '온라인 예약', desk: P + 'med-ondam/live.png', mob: P + 'med-ondam/mobile-preview.png', stack: ['Next.js', 'Vercel', 'GA4'], days: '5일' },
    { slug: 'yuldam', svc: 'website', client: '율담 법무사사무소', ind: '법률·세무', title: '상담 신청까지 가는 길을 세 단계로 줄였습니다', url: 'yuldam.law', kpi: '+85%', kpiL: '상담 문의', desk: P + 'law-yuldam/live.png', mob: P + 'law-yuldam/mobile-preview.png', stack: ['Next.js', 'Vercel'], days: '5일' },
    { slug: 'aura', svc: 'website', client: '오라', ind: '뷰티·D2C', title: '광고 유입을 받는 제품 랜딩페이지를 만들었습니다', url: 'aura-glow.kr', kpi: '+63%', kpiL: '구매 전환율', desk: P + 'lp-aura/live.png', mob: P + 'lp-aura/mobile-preview.png', stack: ['Next.js', 'GA4', 'Meta 픽셀'], days: '4일' },
    { slug: 'jungsan', svc: 'website', client: '정산세무회계', ind: '법률·세무', title: '절세 계산 예시를 첫 화면에 둔 세무사 홈페이지', url: 'jungsan-tax.kr', desk: P + 'tax-jungsan/live.png', mob: P + 'tax-jungsan/mobile-preview.png', stack: ['Next.js', 'Vercel'], days: '5일' },
    { slug: 'novatek', svc: 'website', client: '노바텍', ind: '제조·B2B', title: '제품군과 인증 현황을 정리한 기업 홈페이지', url: 'novatek.co.kr', desk: P + 'corp-novatek/live.png', mob: P + 'corp-novatek/mobile-preview.png', stack: ['Next.js', 'Vercel'], days: '6일' },
    { slug: 'hangro', svc: 'website', client: '항로 관세사무소', ind: '물류·통관', title: '통관 절차를 단계별로 보여주는 서비스 사이트', url: 'hangro.kr', desk: P + 'cus-hangro/live.png', mob: P + 'cus-hangro/mobile-preview.png', stack: ['Next.js', 'Vercel'], days: '5일' },
    { slug: 'chefmeal', svc: 'shop', client: '셰프밀', ind: '식품·밀키트', title: '카페24 쇼핑몰 구축과 GA4·메타 픽셀 세팅', url: 'chefmeal.co.kr', desk: 'public/images/portfolio/ws-mealkit-scroll.png', mob: 'public/images/portfolio/ws-shop-mobile.png', stack: ['카페24', 'GA4', 'Meta 픽셀'], days: '5일' },
    { slug: 'objetroom', svc: 'shop', client: '오브제룸', ind: '리빙·가구', title: '카페24 스킨을 브랜드 톤에 맞춰 새로 구성했습니다', url: 'objetroom.kr', desk: P + 'shopping-mall/d01.jpg', stack: ['카페24'], days: '5일' },
    { slug: 'greentable', svc: 'shop', client: '그린테이블', ind: '식품', title: '정기배송 메뉴를 앞에 둔 식품 쇼핑몰', url: 'greentable.kr', desk: P + 'shopping-mall/d04.jpg', stack: ['카페24', 'PG 결제'], days: '5일' },
    { slug: 'petharu', svc: 'shop', client: '펫하루', ind: '반려동물', title: '연령별 상품 분류를 적용한 반려동물 쇼핑몰', url: 'petharu.kr', desk: P + 'shopping-mall/d10.jpg', stack: ['카페24'], days: '5일' },
    { slug: 'autopilot', svc: 'automation', client: '블로그 오토파일럿', ind: '미디어·제휴 마케팅', title: '여러 나라 블로그에 글을 예약 발행하는 자동화 프로그램', url: 'autopilot.app/schedule', desk: P + 'blogautopilot-multinational/real-demo/app-schedule.png', desk2: P + 'blogautopilot-multinational/real-demo/app-dashboard.png', stack: ['Python', 'Electron', 'API'], days: '7일' },
    { slug: 'v-aio-admin', svc: 'program', client: 'V-AIO 어드민', ind: '서비스업', title: '문의와 상담 현황을 한곳에서 보는 관리자 대시보드', url: 'admin.v-aio.kr', desk: P + 'v-aio-admin/dashboard.png', stack: ['Next.js', 'Node.js', 'PostgreSQL'], days: '협의' },
    { slug: 'visabot', svc: 'program', client: 'VisaBot', ind: '비자·행정', title: '비자 상담 질문에 먼저 답하는 상담 챗봇', url: 'visabot.v-aio.kr', desk: P + 'v-aio-admin/chatbot.png', stack: ['Node.js', 'LLM API'], days: '협의' }
  ];
  const svcName = k => (services.find(s => s.key === k) || {}).name;
  cases.forEach(c => { c.svcName = svcName(c.svc); c.tab = (services.find(s => s.key === c.svc) || {}).tab; });
  const reviews = [
    { text: '생각보다 훨씬 빠르게 완성됐고 퀄리티도 기대 이상이었어요 — 요청한 내용 100% 반영해주셨습니다', author: '이*진', service: '웹사이트 제작', date: '2026.04' },
    { text: '카페24 쇼핑몰 세팅부터 상품 등록, GA4까지 한 번에 처리해주셔서 정말 편했습니다 — 오픈 후 바로 광고 돌릴 수 있었어요', author: '박*수', service: '쇼핑몰 구축', date: '2026.03' },
    { text: '매일 엑셀 정리하던 걸 자동화로 해결했습니다 — 하루 2시간씩 아끼고 있어요, 코드 설명도 친절하게 해주셨습니다', author: '최*영', service: '업무 자동화', date: '2026.05' }
  ];
  const posts = [
    { slug: 'prep', cat: '웹사이트', date: '2026.12.21', title: '홈페이지 제작 전에 준비할 자료 다섯 가지', img: U('1498050108023-c5249f4df085'), lead: '로고, 원고, 사진, 도메인, 참고 사이트. 이 다섯 가지가 준비되어 있으면 제작 기간이 절반으로 줄어듭니다' },
    { slug: 'cafe24', cat: '쇼핑몰', date: '2026.12.14', title: '카페24와 독립몰, 무엇으로 시작할까', img: U('1556742049-0cfed4f6a45d'), lead: '초기 비용, 운영 편의, 확장성을 기준으로 두 방식을 비교합니다' },
    { slug: 'excel', cat: '자동화', date: '2026.12.07', title: '엑셀 반복 작업, 자동화할 수 있는지 판단하는 법', img: U('1551288049-bebda4e38f71'), lead: '규칙이 정해져 있고 매주 반복된다면 대부분 자동화할 수 있습니다' },
    { slug: 'domain', cat: '웹사이트', date: '2026.11.30', title: '도메인과 호스팅, 납품 후에 꼭 알아둘 것', img: U('1558494949-ef010cbdcc31'), lead: '갱신일, 결제 계정, DNS 설정 권한을 누가 가지고 있는지 확인해 두세요' },
    { slug: 'admin', cat: '프로그램', date: '2026.11.23', title: '관리자 페이지가 필요해지는 시점', img: U('1460925895917-afdab827c52f'), lead: '엑셀 파일이 여러 사람 손을 거치기 시작하면 시스템을 검토할 때입니다' },
    { slug: 'seo', cat: '웹사이트', date: '2026.11.16', title: '새 홈페이지에 검색 기본 설정이 필요한 이유', img: U('1432888498266-38ffec3eaf0a'), lead: '메타 정보와 사이트맵이 없으면 검색엔진은 새 사이트를 찾는 데 몇 주가 걸립니다' }
  ];
  const faqs = [
    ['제작 기간이 얼마나 걸리나요?', '웹사이트·쇼핑몰 기본 작업은 결제 후 5일 내 완성이 기준입니다. 자동화 프로그램은 1–7일이 기준이며, 기능형(예약·결제·회원 등)은 범위에 따라 별도 협의합니다.'],
    ['수정은 몇 번까지 가능한가요?', '기본 수정 1회가 포함됩니다. 납품 후 작업 범위 내 오류·누락은 무상으로 처리하며, 이후 추가 수정은 별도 견적으로 진행합니다.'],
    ['도메인·호스팅도 포함인가요?', '도메인과 호스팅은 기본 패키지에 포함되지 않으며 별도 구매가 필요합니다 — 구매 후 연결 세팅은 모두 지원드립니다'],
    ['결제·예약·회원가입 기능도 만들 수 있나요?', '가능합니다 — 다만 해당 기능은 기본 패키지 외 별도 견적으로 진행되며 필요한 기능을 말씀해주시면 정확한 비용을 안내드립니다'],
    ['착수금은 얼마이고 어떻게 결제하나요?', '착수 시 50%, 납품 시 나머지 50%를 계좌이체로 진행하며 견적 확정 후 착수금 입금이 확인되면 다음 날 작업을 시작합니다'],
    ['납품 후 유지보수는 어떻게 되나요?', '납품 후 1달간 무상 A/S를 제공합니다 — 오류 수정, 사소한 텍스트·이미지 교체는 무상으로 처리하며 이후 추가 수정·기능 추가는 별도 견적으로 진행합니다']
  ];
  window.LAB_DATA = { services, cases, reviews, posts, faqs, U };
})();
