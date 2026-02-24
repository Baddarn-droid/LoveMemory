/**
 * When NEXT_PUBLIC_BACKEND_URL is set, the frontend calls the backend for sensitive APIs.
 * When unset, requests go to the same origin (Next.js API routes).
 */
export function getApiBase(): string {
  if (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, '')
  }
  return ''
}
