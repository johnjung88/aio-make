import { withoutSentenceStops } from "../display-copy.ts";
/** Public Korean and English prose shares the same no-full-stop presentation rule */
export function studioText(value: string): string {
 return withoutSentenceStops(value);
}
