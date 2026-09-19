export function getCsrfToken(): string | null {
  const match = document.cookie.match(/(^|;\s*)csrf_token=([^;]+)/)
  return match?.[2] ?? null
}
