import Image from "next/image";
import { Eyebrow, ContactCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
export const metadata = pageMetadata(
  "AIO 소개",
  "사업에 필요한 마케팅, 개발, 영상을 연결하는 AIO MAKE.",
  "/about",
);
export default function About() {
  return (
    <>
      <section className="container page-intro">
        <Eyebrow>ALL IDEAS. ONE DIRECTION.</Eyebrow>
        <h1>
          일을 이해하고,
          <br />
          필요한 것을 만듭니다.
        </h1>
        <p>
          AIO는 여러 사업에 AI를 도입하는 운영 조직입니다. AIO MAKE는 그 경험을
          바탕으로 마케팅, 개발, 영상의 기획과 제작을 연결합니다.
        </p>
        <div className="about-image">
          <Image
            src="/renewal/hero.webp"
            alt="서로 다른 형태가 하나의 방향으로 연결되는 생성 이미지"
            fill
            sizes="100vw"
          />
        </div>
      </section>
      <section className="container section">
        <Eyebrow>HOW WE WORK</Eyebrow>
        <h2>제작의 기준.</h2>
        <div className="about-principles">
          {[
            [
              "질문에서 시작합니다.",
              "고객이 무엇을 궁금해하는지, 사업에서 어떤 문제가 생기는지 먼저 확인합니다.",
            ],
            [
              "목표에 맞게 연결합니다.",
              "콘텐츠, 채널, 웹사이트와 운영 흐름이 같은 목적을 향하게 설계합니다.",
            ],
            [
              "AI의 속도에 사람의 판단을 더합니다.",
              "AI를 제작 과정에 활용하고 사실, 권리, 표현과 실제 동작은 사람이 확인합니다.",
            ],
            [
              "합의한 범위를 끝까지 확인합니다.",
              "진행 범위와 결과물, 수정과 지원 조건을 정리하고 검수 뒤 인계합니다.",
            ],
          ].map(([t, p]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p>{p}</p>
            </div>
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
