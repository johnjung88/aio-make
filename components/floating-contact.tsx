"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
const faq = [
  [
    "어떤 일을 맡길 수 있나요?",
    "영상 제작, 마케팅 운영, 웹사이트와 쇼핑몰 제작을 맡길 수 있습니다",
  ],
  [
    "준비된 기획서가 없어도 괜찮나요?",
    "만들고 싶은 것과 참고 자료를 알려주시면 필요한 범위부터 함께 정리합니다",
  ],
  [
    "견적은 어떻게 받나요?",
    "요청 내용과 자료를 바탕으로 제작 범위, 비용, 일정을 안내합니다",
  ],
  [
    "수정과 유지보수도 가능한가요?",
    "수정 횟수와 지원 범위를 견적 단계에서 함께 정합니다",
  ],
];
export function FloatingContact() {
  const path = usePathname(),
    dialog = useRef<HTMLDialogElement>(null);
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const v = window.visualViewport;
    const change = () =>
      setKeyboard(!!v && window.innerHeight - v.height > 160);
    v?.addEventListener("resize", change);
    return () => v?.removeEventListener("resize", change);
  }, []);
  const parts = path.split("/").filter(Boolean);
  const division = ["video", "marketing", "lab"].includes(parts[0])
    ? parts[0]
    : "";
  const href =
    (division ? "/" + division : "") +
    "/contact" +
    (parts[1] === "services" ? "?service=" + encodeURIComponent(parts[2]) : "");
  function openFaq() {
    const section = document.querySelector(".service-faq, #faq");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      return;
    }
    dialog.current?.showModal();
  }
  return (
    <>
      <nav
        className="floating-contact"
        aria-label="빠른 상담"
        hidden={keyboard}
      >
        <button onClick={openFaq}>자주 묻는 질문</button>
        <Link href={href}>
          문의하기 <span aria-hidden="true">↗</span>
        </Link>
      </nav>
      <dialog
        className="faq-dialog"
        ref={dialog}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <form method="dialog">
          <button aria-label="자주 묻는 질문 닫기">닫기 ×</button>
        </form>
        <h2>자주 묻는 질문</h2>
        {faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
        <Link
          className="button"
          href={href}
          onClick={() => dialog.current?.close()}
        >
          문의 남기기 ↗
        </Link>
      </dialog>
    </>
  );
}
