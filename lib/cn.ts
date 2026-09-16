/** Tiny classname joiner. Keeps components free of a runtime dependency. */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}
