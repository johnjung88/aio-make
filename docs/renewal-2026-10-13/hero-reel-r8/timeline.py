"""R8 approved copy and cut lists. Times snap to the independently measured grid."""
import json
from sources import QA

SCENES = [
 ('웹툰', '제품 이야기를 12컷·24컷으로 그립니다', 'L2', [
  ('시나리오','회차를 한 편의 이야기로','script',''),
  ('컷 구성','한 화면에 들어갈 컷을 짭니다','grid','wt'),
  ('작화','장면과 감정을 그립니다','image','wt4'),
  ('편집','말풍선과 순서를 맞춥니다','scroll','wt'),
  ('완성','모션코믹으로도 만듭니다','clip','comic')]),
 ('애니메이션','브랜드 캐릭터가 움직이는 30초·60초 영상','L1', [
  ('캐릭터 기획','제품을 닮은 캐릭터를 정합니다','poses','mascot'),
  ('설계','색·글자·움직임을 정합니다','palette',''),
  ('영상 시나리오','16컷을 박자에 놓습니다','beats',''),
  ('작업·편집','컷마다 박에 맞춥니다','wave','alignment'),
  ('완성','30초 애니메이션 영상','clip','s1')]),
 ('AI 인플루언서','브랜드 전용 AI 가상인물을 만듭니다','L2', [
  ('인물 기획','나이·직업·말투를 정합니다','identity','face'),
  ('컨텐츠 기획','한 편을 6컷으로 짭니다','aiboard',''),
  ('SNS 운영 기획','계정 틀과 일정을 짭니다','profile','profile'),
  ('작업·업로드','편집하고 올릴 시간을 정합니다','clip','ai2'),
  ('운영','계정 운영은 별도 견적입니다','calendar','')]),
 ('모션그래픽','제품과 메시지를 짧고 분명하게','L1', [
  ('컷 01 훅','원료 4종이 박마다 팝','clip','mg1'),
  ('컷 02 자연','원료 깊이와 초점 이동','clip','mg2'),
  ('컷 03 연구','원형 단면과 측정 링','clip','hero-mg3'),
  ('컷 04 기술','기술 4종을 같은 길이로','clip','hero-mg4'),
  ('컷 05 제품','제품을 실제 병으로 완성','clip','hero-mg6')]),
 ('브랜드 홍보 영상','회사와 브랜드를 소개하는 영상','L1', [
  ('오프닝','로고로 시작합니다','clip','logo'),
  ('고층','현장 영상으로 보여줍니다','clip','highrise2'),
  ('공항','장면마다 단계를 나눕니다','clip','airport3'),
  ('산악','제품이 일하는 곳을 보입니다','clip','mountain2'),
  ('마무리','제품과 로고로 닫습니다','clip','hero-photo')]),
 ('SNS 광고 영상','세로형 9:16 숏폼 광고','L1', [
  ('시나리오','12컷을 25초에 짭니다','acts',''),
  ('이미지','컷마다 기준 이미지를 정합니다','grid','adimg'),
  ('영상','이미지를 4초 클립으로','clip','addraft'),
  ('편집','자막과 소리를 얹습니다','edit','hero-ad1'),
  ('완성','25초 광고 한 편','clip','hero-ad2')])
]

def config(id):
    music = json.loads((QA/'music-analysis.json').read_text(encoding='utf-8'))[id]
    w,h = {'hero':(1920,1080),'webtoon':(720,1080),'ai-influencer':(720,1280),'ad':(720,1280)}.get(id,(1280,720))
    result = dict(id=id,w=w,h=h,fps=30,duration=music['duration'],music=music)
    if id=='hero':
        result['scenes']=[dict(title=t,sub=s,layout=l,panels=[dict(label=a,desc=b,kind=k,src=v) for a,b,k,v in panels]) for t,s,l,panels in SCENES]
        return result
    items=[]
    def add(a,b,kind,src,big,small):
        unit=music['unitSeconds']
        snap=lambda t: round(round(t/30*music['units'])*unit*30)/30
        items.append(dict(start=snap(a),end=snap(b),kind=kind,src=src,big=big,small=small))
    if id=='webtoon':
        add(0,2,'image','wt1','웹툰','제품 이야기를 12컷·24컷으로 그립니다')
        add(2,6,'scroll','wt','웹툰','제품 이야기를 12컷·24컷으로 그립니다')
        for a,src in [(6,'wt4'),(8,'wt8'),(10,'wt12')]: add(a,a+2,'image',src,'장면을','감정을 담습니다')
        for a,src in [(12,'otherwt1'),(14,'otherwt2'),(16,'otherwt3')]: add(a,a+2,'image',src,'브랜드 이야기도','웹툰으로 만듭니다')
        add(18,24,'clip','wtmotion','움직이는 웹툰도','만듭니다')
        add(24,28,'grid','wt','12컷 · 24컷','제품 이야기를 컷으로')
        add(28,30,'lockup','','AIO MAKE','웹툰부터 SNS 광고 영상까지')
    elif id=='ai-influencer':
        add(0,2,'identity','face','AI 인플루언서','브랜드 전용 AI 가상인물을 만듭니다')
        add(2,6,'grid','face','같은 얼굴로','20장을 고정합니다')
        for a,src in [(6,'ai1'),(9,'ai2'),(12,'ai3'),(15,'ai4')]: add(a,a+3,'clip',src,'한 편','한 컷씩 기획합니다')
        for a,src in [(18,'aiproduct2'),(20,'aiproduct3')]: add(a,a+2,'clip',src,'한 사람이','여러 편을 이어 갑니다')
        add(22,26,'calendar','','SNS 운영 기획','채널과 일정을 계획합니다')
        add(26,28,'profile','profile','AI 인플루언서','브랜드 전용 AI 가상인물을 만듭니다')
        add(28,30,'lockup','','AIO MAKE','웹툰부터 SNS 광고 영상까지')
    elif id=='motion-graphics':
        for a,b,src,big,small in [(0,2,'mg1','모션그래픽','제품과 메시지를 짧고 분명하게'),(2,4,'mg2','모션그래픽','제품과 메시지를 짧고 분명하게'),(4,8,'mg3','원료에서','제품까지 한 흐름으로'),(8,14,'mg4','원료에서','제품까지 한 흐름으로'),(14,16,'mg5','원료에서','제품까지 한 흐름으로'),(16,20,'mg6','제품으로','마무리합니다'),(20,26,'s2','같은 제품을','다른 스타일로'),(26,28,'s3','같은 제품을','다른 스타일로')]: add(a,b,'clip',src,big,small)
        add(28,30,'lockup','','AIO MAKE','웹툰부터 SNS 광고 영상까지')
    elif id=='brand-film':
        sources=['logo','highres','highrise2','highrise3','airport1','airportres','airport3','mountain1','mountain2','mountain3','photo1','photo2','photo3']
        for n,src in enumerate(sources): add(n*2,n*2+2,'clip',src,'브랜드 홍보 영상' if n==0 else '제품이' if n<10 else '제품으로','회사와 브랜드를 소개하는 영상' if n==0 else '일하는 현장으로 이어집니다' if n<10 else '소개를 마무리합니다')
        add(26,30,'clip','logoend','제품으로','소개를 마무리합니다')
    elif id=='ad':
        rows=[(0,2,'mgv1','SNS 광고 영상','세로형 9:16 숏폼 광고'),(2,4,'mgv2','첫 장면에서','제품을 보여줍니다'),(4,6,'sv1','한 줄로','메시지를 남깁니다'),(6,8,'sv2','한 줄로','메시지를 남깁니다'),(8,12,'ad1','이야기로','웃음을 만듭니다'),(12,16,'ad2','이야기로','웃음을 만듭니다'),(16,18,'ad3','이야기로','웃음을 만듭니다'),(18,20,'highres','제품별','현장 영상도 만듭니다'),(20,22,'airportres','제품별','현장 영상도 만듭니다'),(22,24,'mountain2','제품별','현장 영상도 만듭니다'),(24,26,'sv3','광고는','마지막까지 한 흐름입니다'),(26,28,'sv4','광고는','마지막까지 한 흐름입니다')]
        for a,b,src,big,small in rows: add(a,b,'clip',src,big,small)
        add(28,30,'lockup','','AIO MAKE','웹툰부터 SNS 광고 영상까지')
    assert all(i['end']>i['start'] for i in items), items
    result['items']=items
    return result
