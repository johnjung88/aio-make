import Image from "next/image";

const sample = "/images/guide/webtoon-svc-webtoon-cut01.webp";

export function WebtoonDevices() {
  return (
    <div
      className="webtoon-devices"
      aria-label="웹툰 제작 서비스의 PC와 모바일 대표 시안"
    >
      <div className="device-preview-heading">
        <span>1억의 구단주 · 제작 예시</span>
        <strong>WEBTOON DESIGN</strong>
      </div>
      <div className="device-pair">
        <figure className="comic-desktop">
          <div className="comic-screen">
            <div className="comic-browser-bar">
              <i />
              <i />
              <i />
              <span>PC 보기</span>
            </div>
            <div className="comic-canvas">
              <Image
                src={sample}
                width={800}
                height={1200}
                alt="PC 정사각형 화면에 구성한 1억의 구단주 대표 장면"
                sizes="(max-width: 700px) 85vw, (max-width: 1100px) 55vw, 520px"
              />
            </div>
          </div>
          <figcaption>PC</figcaption>
        </figure>
        <figure className="comic-mobile">
          <div className="comic-phone">
            <div className="comic-phone-top" />
            <Image
              src={sample}
              width={800}
              height={1200}
              alt="모바일 화면에 구성한 1억의 구단주 웹툰 시안"
              sizes="(max-width: 700px) 65vw, 280px"
            />
          </div>
          <figcaption>모바일</figcaption>
        </figure>
      </div>
    </div>
  );
}
