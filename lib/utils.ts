import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanContent(content: string): string {
  if (!content) return '';
  // Remove citation markers like [1], [2], etc.
  return content.replace(/\[\d+\]/g, '');
}
