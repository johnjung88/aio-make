import Image from "next/image";

const sample = "/images/guide/webtoon-svc-webtoon-cut01.webp";

export function WebtoonDevices() {
  return (
    <div
      className="webtoon-devices"
      aria-label="같은 웹툰 이미지의 PC와 모바일 보기 예시"
    >
      <div className="device-preview-heading">
        <span>1억의 구단주 · 제작 예시</span>
        <strong>이미지 1장 = 1컷</strong>
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
                alt="PC 화면에 표시한 1억의 구단주 원본 이미지 한 컷 전체"
                sizes="(max-width: 620px) 60vw, 600px"
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
              alt="모바일 화면에 표시한 같은 원본 이미지 한 컷 전체"
              sizes="(max-width: 620px) 30vw, 220px"
            />
          </div>
          <figcaption>모바일</figcaption>
        </figure>
      </div>
      <p>화면 크기가 달라도 같은 이미지 1장이 1컷입니다</p>
    </div>
  );
}
