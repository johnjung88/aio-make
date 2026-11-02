/**
 * JsonLd — 구조화 데이터(schema.org) 주입 컴포넌트
 *
 * Next.js App Router 공식 패턴:
 * https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
 *
 * 보안 노트: dangerouslySetInnerHTML 사용이 유일한 방법입니다.
 * - 이 컴포넌트는 오직 정적 schema.org 객체만 허용합니다.
 * - 사용자 입력을 절대 전달하지 마세요.
 * - JSON.stringify는 XSS-safe JSON을 생성합니다.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  // JSON.stringify는 null/undefined를 안전하게 직렬화합니다
  const json = JSON.stringify(data);
  return (
    // eslint-disable-next-line react/no-danger
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
  );
}
