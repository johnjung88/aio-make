import Image from "next/image";
import Link from "next/link";
import { emptyJourneyData, type HomeJourneyData } from "@/lib/home-journey";
import { newTabProps } from "@/lib/new-tab";
import { NewTabHint } from "@/components/new-tab-hint";

export function HomeServices({ data = emptyJourneyData }: { data?: HomeJourneyData }) {
 const content = data.contentSelections.find(item => item.tab.id === "motion-graphics") ?? data.contentSelections[0];
 const contentImage = content?.media.kind === "video" ? content.media.poster : content?.media.src;
 const dev = data.devProjects[0];
 const cards = [
  { title:"컨텐츠", eyebrow:"CONTENT", href:"/content", image:contentImage ?? "/creative-v06/video-webtoon.webp", alt:content?.media.alt ?? "컨텐츠 제작 예시", caption:content?.caption ?? "연출 예시", line:"브랜드 이야기를 보고 싶은 컨텐츠로", items:["웹툰 · 애니메이션 · AI 인플루언서", "모션그래픽 · 브랜드 홍보 영상 · SNS 광고 영상"] },
  { title:"개발", eyebrow:"DEVELOPMENT", href:"/lab", image:dev?.after.src ?? "/creative-v08/development-website.webp", alt:dev?.after.alt ?? "웹사이트 제작 연출 예시", caption:dev ? `${dev.work.brand} · ${dev.work.title}` : "연출 예시", line:"찾아온 고객이 머물고 행동하는 화면", items:["웹사이트 · 쇼핑몰", "업무 자동화 · 프로그램"] },
  { title:"마케팅", eyebrow:"MARKETING", href:"/marketing", image:null, alt:"", caption:"운영 설계", line:"컨텐츠를 고객의 발견과 문의로", items:["통합 마케팅 · SNS 운영", "SEO · AEO · GEO"] },
 ];
 return <section id="divisions" className="home-services l-container">
  <header className="home-services-head"><p className="eyebrow">OUR SERVICES</p><h2 className="t-h2">필요한 분야에서 시작해<br />브랜드의 다음 단계까지</h2><p className="t-lead">컨텐츠, 개발, 마케팅을 연결하고 필요한 범위부터 함께 만듭니다</p></header>
  <div className="home-services-grid">{cards.map((card,index) => <Link key={card.title} href={card.href} className="home-service-card" {...(card.href === "/content" ? newTabProps : {})}>
   <div className="home-service-image">{card.image ? <Image src={card.image} alt={card.alt} fill sizes="(min-width:1024px) 32vw, 90vw" /> : <div className="home-marketing-board"><span className="eyebrow">운영 설계 · OPERATING PLAN</span><strong className="t-h3">발견 → 관심 → 문의</strong><span>채널 기획</span><span>컨텐츠·광고 운영</span><span>반응 확인·다음 제작에 반영</span></div>}{card.image ? <span className="home-service-caption t-small">{card.caption}</span> : null}</div>
   <div className="home-service-copy"><span className="eyebrow">0{index+1} / {card.eyebrow}</span><h3 className="t-h3">{card.title}</h3><p className="t-body">{card.line}</p><ul className="t-small">{card.items.map(item=><li key={item}>{item}</li>)}</ul><span className="home-service-link t-button">서비스 살펴보기 <span aria-hidden="true">↗</span>{card.href === "/content" ? <NewTabHint /> : null}</span></div>
  </Link>)}</div>
 </section>;
}
