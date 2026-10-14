/** Strip Korean sentence stops only: URLs, file extensions and decimal prices stay intact */
export function studioText(value: string): string {
 return value.replace(/([가-힣])\.(?=\s|$)/g, "$1");
}
