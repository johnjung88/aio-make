/* 컨텐츠 사이트 푸터(서버). 항상 ink 테마. 메인 사이트로 가는 유일한 링크 'AIO MAKE 홈'이 여기 있다.
 * 사업자 정보 4줄은 메인 Footer(components/site-shell.tsx)와 같은 문자열이다. */
import Link from "next/link";
import { Brand } from "@/components/site-shell";
import { CS_COPY } from "@/lib/content-site/copy";
import {
  CONTENT_SERVICES,
  contentServicePath,
} from "@/lib/content-site/types";

const BUSINESS_INFO = [
  "사업자명: 에이아이오 (AIO) | 사업자번호: 682-01-02748",
  "통신판매업신고: 제 2026-경기김포-3656 호",
  "주소: 경기도 김포시 대곶면 흥신로67",
] as const;
const EMAIL = "AIOMAKE2023@GMAIL.COM";

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
            <p className="cs-t-small">{f.line}</p>
          </div>
          <nav
            className="cs-footer-col cs-col-4"
            aria-label={f.servicesLabel}
          >
            <p className="cs-footer-heading cs-t-eyebrow">SERVICES</p>
            <ul className="cs-footer-links">
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
          </div>
        </div>
      </div>
    </footer>
  );
}
