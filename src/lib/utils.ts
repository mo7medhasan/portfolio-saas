// src/lib/utils.ts
// Simple className helper — no external dependencies required.
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}