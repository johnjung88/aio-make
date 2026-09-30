import Link from "next/link";
export default function NotFound() {
  return (
    <main className="container section">
      <p className="eyebrow">404 / AIO MAKE</p>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <p>주소를 확인하거나 홈에서 필요한 분야를 찾아주세요.</p>
      <Link className="button" href="/">
        홈으로 돌아가기 ↗
      </Link>
    </main>
  );
}
