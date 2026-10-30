// Leave unset until the representative supplies the official channel address.
export const KAKAO_CHANNEL_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHANNEL_URL ?? "";

export function kakaoChatUrl(url: string) {
  const base = url
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/chat$/, "");
  return base ? `${base}/chat` : "";
}

export function contactDivision(page: string) {
  const segment = page.split("/")[1];
  return segment === "content"
    ? "video"
    : segment === "lab"
      ? "development"
      : segment === "marketing"
        ? "marketing"
        : "main";
}
