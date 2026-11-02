/* 컨텐츠 사이트 푸터(서버). 항상 ink 테마. 메인 사이트로 가는 유일한 링크 'AIO MAKE 홈'이 여기 있다.
 * 사업자 정보 4줄은 메인 Footer(components/site-shell.tsx)와 같은 문자열이다.
 * 정렬(R7): 767px 이하만 가운데, 768px 이상은 왼쪽 다열이다. 서비스 링크는 모바일에서 2열 격자(cs-footer-links--services)다. */
import Link from "next/link";
import { Brand } from "@/components/site-shell";
import { CS_COPY } from "@/lib/content-site/copy";
import {
  CONTENT_SERVICES,
  contentServicePath,
} from "@/lib/content-site/types";

import { BUSINESS_INFO, BUSINESS_EMAIL as EMAIL } from "@/lib/business-info";

export function ContentSiteFooter() {
  const f = CS_COPY.footer;
  return (
    <footer className="cs-footer">
      <div className="cs-container">
        <div className="cs-grid cs-footer-grid">
          <div className="cs-footer-col cs-col-5">
            <Link
              href="/content"
              className="cs-lockup"
              aria-label={CS_COPY.header.homeLabel}
            >
              <span className="cs-brand">
                <Brand />
              </span>
              <span className="cs-lockup-divider" aria-hidden="true" />
              <span className="cs-lockup-label cs-t-eyebrow" aria-hidden="true">
                {CS_COPY.header.studio}
              </span>
            </Link>
            <p className="cs-footer-intro cs-t-small">{f.line}</p>
          </div>
          <nav
            className="cs-footer-col cs-col-4"
            aria-label={f.servicesLabel}
          >
            <p className="cs-footer-heading cs-t-eyebrow">SERVICES</p>
            <ul className="cs-footer-links cs-footer-links--services">
              {CONTENT_SERVICES.map((s) => (
                <li key={s.id}>
                  <Link href={contentServicePath(s.id)} className="cs-t-nav">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="cs-footer-col cs-col-3">
            <p className="cs-footer-heading cs-t-eyebrow">CONTACT</p>
            <ul className="cs-footer-links">
              <li><Link href="/content/references" className="cs-t-nav">레퍼런스 모아보기</Link></li>
              <li>
                <Link href="/content/contact" className="cs-t-nav">
                  {f.contact}
                </Link>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="cs-t-nav">
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="cs-footer-bottom">
          <div className="cs-footer-biz cs-t-caption">
            {BUSINESS_INFO.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <a href={`mailto:${EMAIL}`}>이메일: {EMAIL}</a>
          </div>
          <div className="cs-footer-legal">
            <Link href="/privacy" className="cs-t-small">
              {f.privacy}
            </Link>
            <Link href="/terms" className="cs-t-small">
              {f.terms}
            </Link>
            <Link href="/" className="cs-footer-home cs-t-small">
              {f.home} <span aria-hidden="true">→</span>
            </Link>
            <span className="cs-footer-copy cs-t-caption">
              © 2026 AIO MAKE · All rights reserved
            </span>
            <span className="cs-footer-copy cs-t-caption">음악: FreePD(CC0) · Kevin MacLeod · Bryan Teoh · Rafael Krux</span>
            <span className="cs-footer-copy cs-t-caption">메인 영상 음악: Cat Walk · Arulo / Mixkit</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
