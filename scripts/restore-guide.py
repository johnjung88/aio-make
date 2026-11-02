"""Compile the supplied design into ordinary React; never execute the DC runtime.

Usage: python scripts/restore-guide.py <original guide directory>
The original templates are immutable review inputs. Product changes live in the
explicit adaptation functions below and the typed guide primitives.
"""
from pathlib import Path
import base64
import hashlib
import json
import re
import shutil
import sys
from bs4 import BeautifulSoup, Tag, NavigableString, Comment

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(sys.argv[1])
OUT = ROOT / 'components/guide'
ARCHIVE = ROOT / 'docs/renewal/guide-source'
OUT.mkdir(parents=True, exist_ok=True)
ARCHIVE.mkdir(parents=True, exist_ok=True)
PAGES = {
    'main': 'AIO 메인 시안.dc.html',
    'about': 'AIO 회사소개 시안.dc.html',
    'team': 'AIO 팀원소개 시안.dc.html',
    'studio-home': 'Studio 홈.dc.html',
    'marketing-home': 'Marketing 홈.dc.html',
    'lab-home': 'Lab 홈 v4.dc.html',
    'studio-services': 'Studio 서비스 상세.dc.html',
    'marketing-services': 'Marketing 서비스 상세.dc.html',
    'lab-services': 'Lab 서비스 상세 v3.dc.html',
    'studio-contact': 'Studio 문의.dc.html',
    'marketing-contact': 'Marketing 문의.dc.html',
    'lab-contact': 'Lab 문의 v3.dc.html',
}
VOID = {'img', 'input', 'br', 'hr', 'source', 'area', 'meta', 'link', 'wbr', 'col'}
ALIASES = {'class':'className', 'for':'htmlFor', 'tabindex':'tabIndex',
           'preserveaspectratio':'preserveAspectRatio', 'stroke-width':'strokeWidth',
           'vector-effect':'vectorEffect',
           'colspan':'colSpan', 'rowspan':'rowSpan', 'viewbox':'viewBox',
           'maxlength':'maxLength', 'minlength':'minLength', 'readonly':'readOnly',
           'autocomplete':'autoComplete', 'srcset':'srcSet', 'playsinline':'playsInline',
           'onclick':'onClick', 'onchange':'onChange', 'oninput':'onInput',
           'onmouseenter':'onMouseEnter', 'onmouseleave':'onMouseLeave', 'onsubmit':'onSubmit',
           'onkeydown':'onKeyDown', 'onpointermove':'onPointerMove'}
BOOLS = {'required','disabled','checked','multiple','selected','autoplay','muted','controls','readonly','playsinline'}
css_rules = []
manifest = []

def camel(s):
    if s.startswith('--'): return s
    return re.sub(r'-([a-z])', lambda m:m[1].upper(), s)

def js(s): return json.dumps(s, ensure_ascii=False)

def val(s):
    parts = re.split(r'(\{\{.*?\}\})', str(s), flags=re.S)
    expr = []
    for p in parts:
        if p.startswith('{{'): expr.append('(' + p[2:-2].strip() + ')')
        elif p: expr.append(js(p))
    return ' + '.join(expr) if expr else '""'

def style(s):
    props = []
    for declaration in s.split(';'):
        if ':' not in declaration: continue
        key, value = declaration.split(':',1)
        key, value = key.strip(), value.strip()
        if not key or not value: continue
        value = value.replace("'Pretendard Variable',Pretendard,sans-serif", 'var(--font-body),sans-serif')
        props.append(js(camel(key)) + ': ' + val(value))
    return '{' + ', '.join(props) + '}'

def context(page):
    return 'video' if page.startswith('studio') else 'lab' if page.startswith('lab') else 'marketing' if page.startswith('marketing') else 'main'

def current_business_copy(text, page):
    if page.startswith('marketing'):
        text = text.replace('월 2,000,000원', '월 2,000,000원부터')
        text = text.replace('계약 고객께 제공합니다. 사이트가 없으면 구축, 있으면 리뉴얼합니다', '기본 소개·문의용 사이트 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다')
        text = text.replace('계약 고객께 사이트 구축 또는 리뉴얼을 제공합니다. 사이트가 필요하면 구축하고, 이미 있으면 리뉴얼합니다', '기본 소개·문의용 사이트 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다')
        text = text.replace('채널마다 20개, 월 게시 콘텐츠는 모두 100개입니다', '채널별 수량과 형식은 월 플랜에서 합의하며, 5개 채널 합계는 100개입니다')
        if page == 'marketing-services':
            text = text.replace("priceNote: '스레드 운영은 별도 협의이며 추가 금액이 있습니다'", "priceNote: '착수일부터 최소 3개월입니다. 스레드 운영은 별도 협의이며 추가 금액이 있습니다'", 1)
    if page.startswith('lab'):
        replacements = {
            '오픈하는 날부터': '디자인 복사부터',
            '광고를 돌릴 수 있는 쇼핑몰': '기본 이미지 세팅까지',
            '견적 시 협의 납품 후 지원': '납기·지원 범위는 견적 시 합의',
            '이후 A/S를 위해 당사도 같은 내용을 함께 보관합니다': '납품 후 지원은 고객과 합의한 접근 방식으로 진행합니다',
            '범위별 협의이 걸립니다': '요구사항에 따라 기간이 달라집니다',
            '24시간 안에 연락드립니다': '요청 내용을 확인한 뒤 연락드립니다',
            '1달 납품 후 지원 기간에는 사이트 구조 변경으로 생긴 오류도 수정합니다. 이후에는 건별 견적으로 대응합니다': '사이트 구조 변경에 대한 대응과 납품 후 지원 범위는 개별 견적에서 정합니다',
            '카페24 · 독립몰 구축': '카페24 디자인 복사 · 기본 이미지 세팅',
            '상품 등록, 결제 연동, GA4와 광고 픽셀까지 세팅해 오픈하는 날부터 광고를 시작할 수 있게 넘겨드립니다': '완성 템플릿을 복사하고, 풀 세팅 상품은 기본 로고·배너 등 이미지를 제작·적용합니다. 상품등록·오픈설정은 제외합니다',
            '카페24 또는 독립몰로 쇼핑몰을 구축합니다. 상품 등록, 결제 연동, GA4와 광고 픽셀까지 세팅해 넘겨드립니다': '카페24 완성 템플릿의 디자인 복사와 기본 이미지 제작·적용을 제공합니다. 상품등록·PG·배송 등 오픈설정은 포함되지 않습니다',
            '카페24 스킨 구조에 맞춰 제작하며, 독립몰은 범위에 따라 견적이 달라집니다': '단순 복사와 풀 세팅의 범위를 구분하며, 독립몰·추가 기능은 별도 문의입니다',
            '상품 등록 대행': '상품등록·오픈설정 제외',
            'PG 결제 연동': '선택 템플릿 적용',
            '배송·적립금 정책 설정': '기본 로고·배너 제작 (풀 세팅)',
            'GA4 이커머스 설정': 'PC·모바일 표시 범위 확인',
            '메타·네이버 광고 픽셀': '자료·이미지 적용 검수',
            '상품 정보와 옵션 일괄 등록': '로고·배너 등 기본 이미지 제작',
            '결제·배송 설정, 스킨 화면 구현': '선택 템플릿과 합의한 이미지 적용',
            'PG사 가입은 사업자 명의로 직접 신청하셔야 합니다. 필요한 서류와 순서를 안내드리고, 승인 후 연동은 저희가 진행합니다': 'PG 신청·배송 등 오픈설정은 디자인 복사·풀 세팅 상품에 포함되지 않습니다. 필요한 경우 별도로 문의해주세요',
            '기본 등록 수량은 견적 때 정합니다. 엑셀로 상품 정보를 주시면 일괄 등록으로 빠르게 처리합니다': '상품등록은 디자인 복사·풀 세팅 상품에 포함되지 않습니다. 상품 자료와 필요한 작업을 별도로 확인합니다',
            '기본 수정 1회가 포함됩니다. 납품 후 작업 범위 내 오류·누락은 무상으로 처리하며, 이후 추가 수정은 별도 견적으로 진행합니다.': '수정 횟수와 오류·누락 대응, 추가 작업 범위는 개별 견적에서 합의합니다.',
            '착수 시 50%, 납품 시 나머지 50%를 계좌이체로 진행하며 견적 확정 후 착수금 입금이 확인되면 다음 날 작업을 시작합니다': '착수금과 잔금, 결제 방법 및 작업 시작 일정은 개별 견적에서 정합니다',
            '납품 후 지원 범위는 견적에서 정합니다 — 오류 수정, 사소한 텍스트·이미지 교체는 무상으로 처리하며 이후 추가 수정·기능 추가는 별도 견적으로 진행합니다': '납품 후 오류 대응·수정·유지보수 범위와 비용은 개별 견적에서 정합니다',
        }
        for original, current in replacements.items(): text = text.replace(original, current)
        text = text.replace('개발자가 직접 확인하고 요청 내용을 확인한 뒤', '개발자가 요청 내용을 확인한 뒤')
        text = text.replace('확인한 뒤 요청 내용을 확인한 뒤', '확인한 뒤')
        if page == 'lab-services':
            text = text.replace("'회원가입·로그인',", "'템플릿 기본 화면 구성 검수',")
            shop_copy = {
                '카페24·독립몰 구축': '카페24 완성 템플릿 디자인 복사',
                '쇼핑몰에 들어가는 기능': '추가 기능 예시 · 범위별 상담',
                '상품을 담아 보세요. 예시 화면이며 금액은 예시입니다': '기능·금액 예시입니다. PG·배송 등 오픈설정은 복사·풀 세팅 상품에 포함되지 않습니다',
                '오픈 후에도 배너, 상품, 디자인을 관리자에서 바꿀 수 있게 나눠서 구성합니다': '선택한 템플릿의 기본 화면과 관리자에서 변경할 수 있는 범위를 확인합니다',
                '배너, 추천 상품, 이벤트 영역을 관리자에서 바꿀 수 있게 구성합니다': '선택 템플릿의 기본 관리 기능과 배너 적용 범위를 확인합니다',
                '결제 단계를 줄이고 PG 결제를 연동합니다': '선택 템플릿의 주문서 화면을 확인합니다. PG 등 오픈설정은 제외합니다',
                '회원가입, 로그인, 주문 조회 화면까지 포함합니다': '선택 템플릿의 기본 마이페이지 표시 범위를 확인합니다',
                '등록할 상품 수와 옵션 구조': '선택 템플릿과 적용할 기본 이미지 목록',
                '카페24 스킨 디자인 수정 범위': '디자인 복사 또는 풀 세팅 선택',
                '독립몰 여부와 연동할 외부 시스템': '추가 디자인 수정·외부 기능 범위',
                '상품 수와 옵션 구조 정리': '템플릿·기본 이미지 자료 정리',
                '쇼핑몰 방식과 범위 확정': '복사·풀 세팅 범위 확정',
                '테스트·오픈': '검수·인계',
                '결제와 주문 흐름 자동 점검': '이미지·레이아웃 오류 점검',
                '테스트 주문 후 결과 공유, 오픈·픽셀 확인': '화면·링크 검수 후 결과와 수정 방법 인계',
                '주문 오류 모니터링': '화면·이미지 표시 확인',
                '상품 수와 참고하는 쇼핑몰을 알려주시면 견적을 안내드립니다': '선택 템플릿과 필요한 기본 이미지 목록을 알려주시면 안내드립니다',
            }
            for original, current in shop_copy.items(): text = text.replace(original, current)
        text = text.replace("'1~20페이지 150,000원 (부가세 별도)'", 'developmentOffer("website").summary')
        text = text.replace("'템플릿 복사 150,000원 · 풀세트 300,000원'", 'developmentOffer("shop").summary')
        text = text.replace('템플릿 복사 (견적 협의)', '단순 복사 (150,000원)').replace('풀세트 (견적 협의)', '풀 세팅 (300,000원)')
    if page.startswith('studio'):
        replacements = {
            '요청하시면 1회 수정 후 확정합니다': '합의한 수정 범위 안에서 보완한 뒤 확정합니다',
            '요청 시 1회 수정 후 확정': '수정 범위 합의 후 확정',
            '요청 시 1회 수정하고 확정': '합의한 범위 안에서 수정하고 확정',
            '최대 3회까지 보완합니다': '합의한 범위 안에서 보완합니다',
            '제작 단계에서 최대 3회까지 보완합니다': '제작 단계에서 합의한 범위 안에서 보완합니다',
            '제작·최대 3회 수정 보완': '제작·합의한 범위의 수정 보완',
            '수정 최대 3회': '수정 범위 합의',
            '수정 1회': '수정 범위 합의',
            '시나리오와 결과물, 두 번의 확인 단계에서 고객 요청이 있으면 각각 1회 수정한 뒤 확정합니다': '시나리오와 결과물을 고객과 확인하고, 계약 전에 정한 수정 범위 안에서 보완한 뒤 확정합니다',
            '시나리오는 전달 후 요청하시면 1회 수정하고 확정합니다. 웹툰은 결과물 확인 후 요청하시면 1회 수정하고 확정합니다': '시나리오와 결과물을 확인하는 단계에서 계약 전에 정한 수정 범위 안에서 보완한 뒤 확정합니다',
        }
        for original, current in replacements.items(): text = text.replace(original, current)
    return text

def adapt_markup(doc, page):
    # Replace only factual placeholders. Preserve source geometry and hierarchy.
    text = str(doc)
    text = text.replace('사이트 준비 중','문의 가능').replace('레퍼런스 제목','제작 예시')
    text = text.replace('월 200만 원','월 200만 원부터 · VAT 별도').replace('월 100만 원','월 100만 원 · VAT 별도')
    if context(page) in ['video', 'lab']:
        text = re.sub(r'평균 (?:2|10)일', '범위별 협의', text)
        text = text.replace('납품 후 1달간 무상으로 수정합니다','납품 후 지원 범위는 견적 단계에서 정합니다')
        text = text.replace('납품 후 1달','견적 시 협의').replace('무상 A/S 1달','납품 후 지원')
        text = text.replace('1달간 무상으로 수정합니다','합의한 범위 안에서 지원합니다')
    if page == 'main':
        text = text.replace('반복 작업을 AI로 줄여 제작·운영 단가를 낮췄고,','반복 작업에 AI를 활용하고,')
        text = text.replace('VOICES FROM THE FIELD','OUR STANDARD')
        text = text.replace('“빠른 제작이라 퀄리티가 걱정됐는데, 첫 화면 카피와 버튼 위치까지 <span style="color:#6B4DFF">영업에 바로 쓸 수 있게</span> 다듬어주셨어요”','첫 화면의 문구부터 문의 버튼까지, <span style="color:#6B4DFF">실제로 사용할 수 있는 결과물</span>을 기준으로 확인합니다')
        text = text.replace('<strong>김 대표</strong>','<strong>AIO MAKE의 작업 기준</strong>').replace('교육 컨설팅 · 랜딩페이지 제작','기획 · 제작 · 검수 · 인계')
        text = text.replace('href="#"><div style="aspect-ratio', 'href="{{ g.href }}"><div style="aspect-ratio')
    if page == 'about':
        text = text.replace('결과물을 보장합니다','결과물을 확인합니다').replace('검증된 결과물로','검수한 결과물로')
    if context(page) == 'video':
        text = text.replace('>▶</span>SHOWREEL 2026', '>→</span>SHOWREEL 2026')
        text = text.replace('▶', '').replace('SHOWREEL 2026', '제작 방향 살펴보기')
        text = text.replace('샘플 1회차를 끝까지 보세요', '웹툰 제작 예시를 살펴보세요')
        text = text.replace('최종 이미지 24장이 1회 분량입니다. 1장을 1컷으로 세며, 샘플 1회차로 실제 길이를 스크롤로 확인할 수 있습니다', '제공된 가이드의 이미지 10장을 발췌해 보여드립니다. 계약 시 회차별 분량과 수정 범위를 먼저 정합니다')
    if page.startswith('marketing'):
        text = text.replace(' · VAT 별도 · 부가세 별도', ' · VAT 별도').replace(' · VAT 별도, 부가세 별도', ' · VAT 별도')
        text = text.replace('업종별로 무엇을 운영했고 무엇이 달라졌는지', '서비스별 콘텐츠와 검색 접점의 구성 예시').replace('1위', '예시')
        text = text.replace('Reviews', 'Our standards').replace('고객이 남긴 이야기', '운영을 확인하는 기준')
        text = text.replace('사이트 구축이 필요하면 구축, 리뉴얼이 필요하면 리뉴얼을 제공합니다', '기본 소개·문의용 사이트의 신규 구축 또는 리뉴얼을 1회 제공합니다. 추가 기능은 별도 협의합니다')
    if page.startswith('lab'):
        text = text.replace('무상 A/S', '납품 후 지원')
        text = text.replace('견적 시 협의 무상 A/S', '지원 범위 견적 시 협의')
    if page == 'team':
        text = text.replace('THE PEOPLE', 'PROJECT ROLES').replace('리더십 · 분야 책임자', '기획 · 분야별 작업 역할').replace(' · DIRECTORS', '')
        text = text.replace('분야별 전문가', '분야별 작업 역할').replace('LEADERSHIP', 'PROJECT ROLES')
        text = text.replace('{{ d.ko }} · {{ d.total }}명', '{{ d.ko }}').replace('{{ r.count }}명', '작업 역할')
        text = text.replace('팀원 소개', '팀과 작업 역할').replace('리더 소개', '분야별 작업 기준')
    return BeautifulSoup(current_business_copy(text, page), 'html.parser')

def adapt_script(script, page):
    script = script.replace('extends DCLogic','extends GuideLogic')
    script = script.replace('window.LAB_DATA','LAB_DATA')
    script = re.sub(r'2026\.(?:11|12)\.\d\d', '제작 가이드', script)
    script = script.replace('월 200만 원','월 200만 원부터 · VAT 별도').replace('월 100만 원','월 100만 원 · VAT 별도')
    # Studio rates and quantities are proposals in the current business documents.
    if context(page) == 'video':
        def price_label(match):
            text = match[0][1:-1]
            if '(' in text and re.match(r'^(웹툰|애니메이션|AI 인플루언서|브랜드 홍보|SNS 광고)', text):
                return "'" + text.split('(')[0].strip() + " (범위 확인 후 견적)'"
            return "'범위 확인 후 견적'"
        script = re.sub(r"'[^'\n]*(?:\d[\d,]*원|\d+% 할인)[^'\n]*'", price_label, script)
        script = script.replace("const KEYS = Object.keys(SVC), CUTN = 24;", "const KEYS = Object.keys(SVC), CUTN = 10;")
        script = script.replace("'svc-webtoon-cut' + N(i + 1)", "'svc-webtoon-cut' + N([1,2,3,4,5,6,7,8,11,12][i])")
        script = script.replace('샘플 1회차', '발췌 예시').replace('최종 이미지 24장', '합의한 분량의 이미지').replace('24컷', '발췌 예시').replace('1회 = 24컷', '웹툰 제작 예시')
        script = script.replace("rc('image-slot',", 'rc(GuideImage,')
        script = script.replace("id: 'svc-webtoon-hero-' + (i + 1)", "id: 'svc-webtoon-cut' + N([1,2,3,4,5,6,7,8,11,12][i])")
        script = script.replace('1회 = 발췌 예시', '제작 방향 예시')
    if page.startswith('lab'):
        script = script.replace('평균 2일','범위별 협의').replace('평균 10일','범위별 협의')
        script = script.replace('납품 후 1달','견적 시 협의').replace('무상 A/S 1달','납품 후 지원')
        script = script.replace('1달간 무상으로 수정합니다','합의한 범위 안에서 지원합니다')
    if page == 'main':
        script = script.replace("name: 'Marketing', ko: '마케팅', href: '#'", "name: 'Marketing', ko: '마케팅', href: '/marketing/work'")
        script = script.replace("name: 'Lab', ko: '개발', href: '#'", "name: 'Lab', ko: '개발', href: '/lab/work'")
    # Initialize service pages from the canonical route, avoiding URL/SSR drift.
    if page.endswith('services'):
        script = re.sub(r"key: q\(\) \|\| ('[^']+')", r'key: this.props.service || \1', script)
    if page.endswith('contact'):
        script = script.replace('state = { service:', 'state = { service: MAP[guideContactKey(this.props.service, '+js(context(page))+')] ||')
        script = script.replace('AI 챗봇', '외부 서비스 연동')
    if page.startswith('lab'):
        script = script.replace('템플릿 복사 (150,000원)', '템플릿 복사 (견적 협의)').replace('풀세트 (300,000원)', '풀세트 (견적 협의)')
    if page.startswith('marketing'):
        script = re.sub(r"const CASES = (\[[\s\S]*?\]);", 'const CASES = marketingExamples;', script)
    # Use our own localized assets instead of stock CDN URLs in delivered code.
    script = re.sub(r"const U = \([^;]+;", 'const U = (id) => guideAsset(id);', script)
    script = re.sub(r"const U = [^;]+;", 'const U = (id) => guideAsset(id);', script)
    script = script.replace('window.innerWidth : 1200', '1200 : 1200')
    # Native route changes preserve back/forward navigation for service tabs.
    script = re.sub(r"try \{ const u = new URL\(location.href\); u.searchParams.set\('s', key\); history.replaceState\(null, '', u\); \} catch \(e\) \{\}", "location.assign(guideServiceHref("+js(context(page))+", key));", script)
    if context(page) == 'video':
        script = re.sub(r"cutNote: '[^']*'", "cutNote: '제공된 가이드에서 발췌한 이미지 10장'", script)
        script = re.sub(r"priceNote: '[^']*'", "priceNote: '사용 목적, 분량과 수정 범위를 확인한 뒤 견적과 일정을 안내합니다'", script)
        script = re.sub(r"TIP\('[^']*', '[^']*', '[^']*', '[^']*', '[^']*', ([01])\)", lambda m: "TIP('"+('단일 작업' if m[1]=='1' else '연속 제작')+"', '범위 확인 후 견적', '길이·분량·수정 기준을 먼저 정합니다', '', '', "+m[1]+")", script)
        script = script.replace('합의한 분량의 이미지이', '합의한 분량의 이미지가')
        script = re.sub(r"\['1회 분량은 어느 정도인가요\?', '[^']*'\]", "['회차별 분량은 어떻게 정하나요?', '목적과 채널에 맞춰 필요한 컷 수와 회차별 분량을 먼저 정합니다. 아래 발췌 이미지는 제작 방향을 확인하는 예시입니다']", script)
        script = script.replace('최종 이미지 24장(발췌 예시)이 1회 분량입니다.', '회차별 분량은 계약 전에 정합니다.')
        script = script.replace('최종 이미지 24장 = 발췌 예시', '발췌 이미지 10장')
        script = script.replace('이 페이지의 발췌 예시로 실제 길이를 확인하실 수 있습니다', '발췌 이미지는 제작 방향을 확인하는 예시입니다')
        script = script.replace('1회 = 최종 이미지 24장 = 발췌 예시', '제공된 가이드 이미지 발췌')
    if page.startswith('lab'):
        script = script.replace('견적 시 협의 무상 A/S', '지원 범위 견적 시 협의')
        script = script.replace('무상 A/S', '납품 후 지원').replace('납품과 납품 후 지원', '납품 후 지원')
        script = script.replace('24시간 이내', '범위 확인 후').replace('착수 50% · 납품 50%', '견적서에서 협의').replace('착수금 확인 다음 날', '일정 합의 후')
        script = script.replace('평균 7일', '범위별 협의').replace("['무상 A/S', '견적 시 협의']", "['납품 후 지원', '견적 시 협의']")
    if page == 'lab-services':
        script = script.replace('const sw = (on) => ({', 'const sw = (on) => ({ selected: on,')
        script = script.replace('return { ...sw(on), toggle:', "return { label: role + ' ' + ['보기','수정','삭제'][c], ...sw(on), toggle:")
    if page == 'team':
        script = re.sub(r"leaders: \[[\s\S]*?\],\s*tabs:", 'leaders: [], tabs:', script)
    if page.startswith('marketing'):
        script = re.sub(r"reviews: \[[\s\S]*?\],\s*posts:", 'reviews: [], posts:', script)
        script = script.replace(' · VAT 별도 · 부가세 별도', ' · VAT 별도').replace(' · VAT 별도, 부가세 별도', ' · VAT 별도')
    script = script.replace('return { label: o, bg: on', 'return { selected: on, label: o, bg: on')
    if page == 'lab-home':
        script = script.replace("const el = h(); if (!el || reduce) return;", "const el = h(); if (!el || reduce) { cancelAnimationFrame(this.raf); return; }")
        script = script.replace("componentWillUnmount() {", "componentWillUnmount() { const el = document.getElementById('lab-wave'); if(el){ el.removeEventListener('pointermove',this.mv); el.removeEventListener('pointerenter',this.enter); el.removeEventListener('pointerleave',this.leave); delete el.__w; }")
        script = script.replace("return { no: '0' + (i + 1), t, tag, note,", "return { pick: () => {clearInterval(this.tick); this.setState({step:i})}, no: '0' + (i + 1), t, tag, note,")
    return current_business_copy(script, page)

def render(node, page, depth=0):
    if isinstance(node,Comment): return ''
    if isinstance(node,NavigableString):
        s = str(node)
        if not s.strip(): return ''
        parts = re.split(r'(\{\{.*?\}\})',s,flags=re.S)
        return ''.join('{' + p[2:-2].strip() + '}' if p.startswith('{{') else '{'+js(p)+'}' for p in parts if p)
    if not isinstance(node,Tag): return ''
    name = node.name
    if name in ['helmet','script','style']: return ''
    children = lambda: ''.join(render(x,page,depth+1) for x in node.children)
    if name == 'dc-import':
        if node.get('name') in ['AioHeader','AioFooter']: return ''
        return '<GuideNav division='+js(context(page))+' active='+js(node.get('active','home'))+' />'
    if name == 'sc-if':
        return '{('+node.get('value','').strip()[2:-2].strip()+') ? <React.Fragment>'+children()+'</React.Fragment> : null}'
    if name == 'sc-for':
        expression = node.get('list','').strip()[2:-2].strip()
        variable = node.get('as','item'); index = '__index'+str(depth)
        return '{('+expression+' || []).map(('+variable+', '+index+') => <React.Fragment key={'+index+'}>'+children()+'</React.Fragment>)}'
    if name == 'lab-cloud': return '<GuideCloud />'
    if name == 'guide-offer': return '<GuideOffer service={s.key} />'
    if name == 'image-slot': name = 'GuideImage'
    elif name == 'video-slot': name = 'GuideMedia'
    elif name == 'a': name = 'GuideLink'
    elif name == 'form': name = 'InquiryBridge'
    attrs = []
    for k,v in node.attrs.items():
        if k.startswith('hint-') or k == 'shape': continue
        if k == 'style': attrs.append('style={'+style(v)+'}'); continue
        if k == 'style-hover':
            classname = 'gh-'+hashlib.sha256(v.encode()).hexdigest()[:8]
            css_rules.append('.guide-page .'+classname+':hover{'+v+'}')
            attrs.append('className='+js(classname)); continue
        if name == 'InquiryBridge' and k == 'onsubmit': continue
        if k == 'class' and isinstance(v,list): v = ' '.join(v)
        target = ALIASES.get(k,k)
        if k == 'autoplay': target = 'autoPlay'
        if k in BOOLS and not v: attrs.append(target+'={true}'); continue
        if '{{' in str(v): attrs.append(target+'={'+val(v)+'}'); continue
        if target.startswith('on'): raise ValueError('Unhandled inline handler: '+k)
        if k in ['rows','cols','maxlength','minlength','tabindex']:
            attrs.append(target+'={'+str(int(v))+'}'); continue
        attrs.append(target+'='+js(v))
    if name == 'GuideLink': attrs.append('context='+js(context(page)))
    if name == 'InquiryBridge':
        attrs += ['division='+js('development' if context(page)=='lab' else 'video' if context(page)=='video' else 'marketing'), 'selection={this.state}', 'initialService={this.props.service}', 'quick={'+str(page=='main').lower()+'}']
        form_inputs = node.find_all(['input','textarea','select'])
        for idx,field in enumerate(form_inputs):
            label = field.find_parent('label')
            text = label.get_text(' ',strip=True) if label else ''
            typ = field.get('type','')
            key = 'consent' if typ=='checkbox' else 'email' if typ=='email' else 'phone' if typ=='tel' else 'message' if field.name=='textarea' else 'company' if re.search('회사|브랜드|업체',text) else 'name' if re.search('이름|성함|고객명',text) else 'reference' if re.search('참고|링크',text) else 'detail'+str(idx)
            field['name'] = key
            if key in ['email','phone']:
                field.attrs.pop('required',None)
                if label:
                    for text_node in label.find_all(string=True):
                        if '*' in text_node: text_node.replace_with(str(text_node).replace('*',''))
    if name == 'button' and 'type' not in node.attrs: attrs.append('type="button"')
    if name == 'button' and '{{' in str(node.get('onclick','')):
        event = node['onclick'][2:-2].strip()
        if event == 'o.pick': attrs.append('aria-pressed={o.selected}')
        if event == 's.go': attrs.append('aria-pressed={this.state.ch === Number(s.no) - 1}')
        if event.endswith('.toggle') and 'f.' in event: attrs.append('aria-expanded={f.open}')
        if page == 'lab-services' and event == 'c.toggle': attrs += ['aria-label={c.label}', 'aria-pressed={c.selected}']
        if page == 'lab-services' and event == 'i.toggle': attrs += ['aria-label={i.t + " 연결"}', 'aria-pressed={i.selected}']
    if name == 'img':
        for i,a in enumerate(attrs):
            if a.startswith('src='):
                src = node.get('src','')
                attrs[i] = 'src={guideAsset('+val(src)+')}'
        if not node.has_attr('alt'): attrs.append('alt=""')
    if node.has_attr('data-ch'): attrs.append('aria-hidden="true"')
    if node.get('id') == 'lab-wave': attrs.append('aria-label="필요한 것을 만들고, 소스까지 넘겨드립니다"')
    attr_text = ' '+ ' '.join(attrs) if attrs else ''
    if node.name in VOID or name in ['GuideImage','GuideMedia']: return '<'+name+attr_text+' />'
    return '<'+name+attr_text+'>'+children()+'</'+name+'>'

for page,filename in PAGES.items():
    raw = (SOURCE/filename).read_text(encoding='utf-8-sig')
    shutil.copy2(SOURCE/filename, ARCHIVE/filename)
    manifest.append({'file':filename,'sha256':hashlib.sha256((SOURCE/filename).read_bytes()).hexdigest()})
    soup = BeautifulSoup(raw,'html.parser')
    script_tag = soup.select_one('script[data-dc-script]')
    script = adapt_script(script_tag.get_text() if script_tag else '',page)
    tpl = adapt_markup(soup.find('x-dc'),page)
    template = tpl.find('x-dc')
    if page == 'lab-services':
        quote = next((n for n in template.find_all('strong') if n.get_text(strip=True) == '범위 확인 후 견적'), None)
        if quote:
            quote.name = 'guide-offer'; quote.clear(); quote.attrs = {}
    if page == 'marketing-home':
        stage_loop = template.find('sc-for', attrs={'as':'s','list':'{{ stages }}'})
        if stage_loop: stage_loop.parent['class'] = 'guide-stage-grid'
    if page == 'lab-home':
        timeline = template.find('sc-for', attrs={'as':'n'})
        if timeline:
            trigger = timeline.find('div')
            trigger.name = 'button'; trigger['onclick'] = '{{ n.pick }}'; trigger['style'] += ';text-align:left;cursor:pointer;background:none;border:0;padding:0;width:100%;color:inherit'
    for anchor in template.find_all('a'):
        if anchor.find_parent('sc-for', attrs={'as':'p'}) and (page.endswith('home') or page == 'main'):
            if '인사이트' in anchor.get('href','') or '칼럼' in anchor.get('href',''):
                anchor['href'] = '{{ p.href }}'
        if anchor.find_parent('sc-for', attrs={'as':'g'}) and page == 'main':
            anchor['href'] = '{{ g.href }}'
            image = anchor.find('image-slot')
            if image:
                slot = 'big' if 'bigId' in image.get('id','') else 's1' if 's1Id' in image.get('id','') else 's2'
                anchor['href'] = '{{ g.'+slot+'Href }}'
                title = anchor.find('strong')
                if title: title.string = '{{ g.'+slot+'Title }}'
        if page == 'main':
            label = anchor.get_text()
            if '상세 문의 남기기' in label: anchor['href'] = '/contact'
            if '고객을 부르는 분야' in label: anchor['href'] = '/marketing'
            if '시스템을 만드는 분야' in label: anchor['href'] = '/lab'
            if '장면을 담는 분야' in label: anchor['href'] = '/video'
    names = set(re.findall(r'\{\{\s*([a-zA-Z_$][\w$]*)',str(template)))
    names -= {n.get('as') for n in template.find_all('sc-for')}
    names -= {'true','false','null','undefined'}
    jsx = ''.join(render(x,page) for x in template.children)
    # Do not expose guide-only future posts or fictional client testimony.
    jsx = jsx.replace('{p.date}', '{p.date === "制作" ? "제작 가이드" : p.date}')
    class_end = script.rfind('}')
    if 'class Component extends GuideLogic' not in script: script += '\nclass Component extends GuideLogic { renderVals(){return {}} }'; class_end=script.rfind('}')
    method = '\nrender(){ const values = adaptGuideValues('+js(page)+', this.renderVals(), this.props); const {'+', '.join(sorted(names))+'} = values; return <div className='+js('guide-page guide-'+page)+'><GuideEffects />'+jsx+'</div>; }\n'
    script = script[:class_end]+method+script[class_end:]
    head = '''"use client";
/* Generated from the preserved design by scripts/restore-guide.py.
 * Layout and copy changes belong in the compiler adaptation or shared primitives.
 * No DC interpreter, eval, HTML injection, editor runtime or stock video ships. */
/* eslint-disable @next/next/no-img-element, @typescript-eslint/no-unused-vars */
import React from "react";
import { GuideLogic, GuideImage, GuideMedia, GuideLink, GuideNav, GuideCloud, GuideEffects, GuideOffer, developmentOffer, guideAsset, guideServiceHref, guideContactKey, adaptGuideValues, marketingExamples } from "./primitives";
import { InquiryBridge } from "./inquiry-bridge";
import LAB_DATA from "./lab-data";
'''
    (OUT/(page+'.jsx')).write_text(head+script+'\nexport default Component;\n',encoding='utf-8')

# Store the original data as a review input and adapt only promises and invented clients.
data_raw = (SOURCE/'lab-data.js').read_text(encoding='utf-8')
shutil.copy2(SOURCE/'lab-data.js', ARCHIVE/'lab-data.js')
data = data_raw.replace('(function () {', 'const LAB_DATA = (() => {',1)
data = data.replace('window.LAB_DATA = { services, cases, reviews, posts, faqs, U };','return { services, cases: [], reviews: [], posts, faqs, U };')
data = re.sub(r'2026\.(?:11|12)\.\d\d','제작 가이드',data)
data = data.replace('평균 2일','범위별 협의').replace('평균 10일','범위별 협의')
data = data.replace('납품 후 1달간 무상 A/S를 제공합니다','납품 후 지원 범위는 견적에서 정합니다')
data = re.sub(r"const U = [^;]+;",'const U = (id) => guideAsset(id);',data)
data = data.replace("['카페24', 'PG 결제', 'GA4', 'Meta 픽셀']", "['카페24', '완성 템플릿', '로고·배너', '범위 확인']")
data = re.sub(r"const reviews = \[[\s\S]*?\];", '', data)
data = re.sub(r"const cases = \[[\s\S]*?\];", 'const cases = [];', data)
data = re.sub(r"const cases = \[\];[\s\S]*?const posts =", 'const posts =', data)
data = data.replace('웹사이트·쇼핑몰 기본 작업은 결제 후 5일 내 완성이 기준입니다. 자동화 프로그램은 1–7일이 기준이며, 기능형(예약·결제·회원 등)은 범위에 따라 별도 협의합니다.','제작 일정은 자료 준비와 기능 범위를 확인한 뒤 견적 단계에서 협의합니다.')
(OUT/'lab-data.js').write_text('import { guideAsset } from "./primitives";\n'+current_business_copy(data, 'lab-data')+'\nexport default LAB_DATA;\n',encoding='utf-8')
(OUT/'source-hover.css').write_text('\n'.join(sorted(set(css_rules))),encoding='utf-8')
(ARCHIVE/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')

# Supplied photos and proof screenshots remain byte-identical.
for source_path in (SOURCE/'public').rglob('*'):
    if source_path.is_file():
        rel = source_path.relative_to(SOURCE/'public')
        dest = ROOT/'public/images/guide'/rel
        dest.parent.mkdir(parents=True,exist_ok=True)
        shutil.copy2(source_path,dest)
slots = json.loads((SOURCE/'.image-slots.state.json').read_text(encoding='utf-8'))
slot_map = {}
for name,obj in slots.items():
    uri = obj.get('u','')
    if uri.startswith('data:image/webp;base64,'):
        dest = ROOT/'public/images/guide'/('webtoon-'+name+'.webp')
        dest.write_bytes(base64.b64decode(uri.split(',',1)[1]))
        slot_map[name] = '/images/guide/'+dest.name
(OUT/'supplied-slots.json').write_text(json.dumps(slot_map,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Compiled {len(PAGES)} React views; {len(slot_map)} supplied image slots. Original manifest saved.')
