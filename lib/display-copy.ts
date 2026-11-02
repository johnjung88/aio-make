/** Keep prose sentences on separate lines; decimal values and paths keep their dots. */
export function withoutSentenceStops(value: string): string {
  return value
    .replace(/([가-힣A-Za-z0-9)\]”’])\.[ \t]+(?=[가-힣A-Z])/g, "$1\n")
    .replace(
      /(니다|세요|해요|돼요|어요|아요|예요|이에요)[ \t]+(?=[가-힣A-Z0-9《])/g,
      "$1\n",
    )
    .replace(/([가-힣A-Za-z0-9)\]”’])\.(?=(?:["'”’)\]]?)(?:\s|$))/g, "$1");
}

/** Copy a public view model so source records and stored editorial bodies are preserved */
export function displayCopy<T>(value: T): T {
  if (typeof value === "string") return withoutSentenceStops(value) as T;
  if (Array.isArray(value)) return value.map((item) => displayCopy(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, displayCopy(item)]),
    ) as T;
  }
  return value;
}
