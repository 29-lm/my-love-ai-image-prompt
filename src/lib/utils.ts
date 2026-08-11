import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Prefix public asset paths with Vite's base URL (needed for GitHub Pages subpath deploy)
export function assetUrl(path: string) {
  if (!path) return path
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
