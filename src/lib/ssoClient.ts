/**
 * Portfolio no longer talks to the SSO API for login/refresh/logout.
 * Those go through the portfolio backend proxy (`/api/auth/*` and `/api/portfolio/auth/session`).
 * Keep this helper only for deep-links into the SSO SPA (forgot password, etc.).
 */
import { env } from './env'

export function ssoFrontendUrl(path: string): string {
  const base = env.SSO_FRONTEND_URL.replace(/\/$/, '')
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${base}${suffix}`
}
