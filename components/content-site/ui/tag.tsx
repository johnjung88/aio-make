/* 미디어 상태 태그(필수). 문자열은 MEDIA_TAGS 상수나 서버가 고른 사례 라벨만 쓴다. */
export function CsTag({
  children,
  overlay = false,
}: {
  children: React.ReactNode;
  /** 미디어 박스 밖 요소 위에 겹칠 때(왼쪽 아래 12px) */
  overlay?: boolean;
}) {
  return (
    <span className={"cs-tag cs-t-caption" + (overlay ? " cs-tag--overlay" : "")}>
      {children}
    </span>
  );
}
