import {writeFile} from "node:fs/promises";
import sharp from "sharp";
const configs=[
 ["main","VIDEO · MARKETING · DEVELOPMENT",["필요한 일을","함께 완성합니다"],"영상 제작부터 마케팅, 개발까지","development"],
 ["video","AIO MAKE STUDIO",["이야기를 담고","장면을 만듭니다"],"웹툰 · 애니메이션 · 브랜드 영상","video"],
 ["marketing","AIO MAKE MARKETING",["브랜드의 매력을","고객에게 전합니다"],"콘텐츠 · 채널 운영 · 검색과 문의","marketing"],
 ["lab","AIO MAKE DEVELOPMENT",["사업에 맞는 웹사이트","판매를 위한 쇼핑몰"],"기획 · 디자인 · 제작 · 운영 인계","development"]
];
for(const [id,label,lines,footer,img]of configs){
 const image=(await sharp("public/creative-v11/"+img+".webp").png().toBuffer()).toString("base64");
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630"><defs><clipPath id="photo"><rect x="740" y="44" width="416" height="542" rx="18"/></clipPath></defs><rect width="1200" height="630" fill="#f4f3ef"/><image x="575" y="44" width="720" height="542" preserveAspectRatio="xMidYMid slice" clip-path="url(#photo)" xlink:href="data:image/png;base64,${image}"/><text x="54" y="95" font-family="Arial" font-weight="900" font-size="43" letter-spacing="-2" fill="#141219">AIO MAKE</text><rect x="282" y="82" width="12" height="12" fill="#6b4dff"/><text x="56" y="175" font-family="Arial" font-size="15" font-weight="700" letter-spacing="2" fill="#6b4dff">${label}</text><g font-family="Malgun Gothic" font-weight="700" font-size="52" letter-spacing="-2" fill="#141219"><text x="52" y="282">${lines[0]}</text><text x="52" y="360">${lines[1]}</text></g><text x="56" y="429" font-family="Malgun Gothic" font-size="23" fill="#66616f">${footer}</text><path d="M56 490H680" stroke="#d5d0df"/><text x="56" y="550" font-family="Arial" font-size="22" fill="#6b4dff">aio-make.com</text><rect x="0" y="616" width="1200" height="14" fill="#6b4dff"/></svg>`;
 await writeFile("public/social/"+id+"-v11.svg",svg);await sharp(Buffer.from(svg)).png().toFile("public/social/"+id+"-v11.png");
}
