/**
 * The single SSO client for this app (see single_sign_on/backend/docs/SSO_CONTRACT.md §6).
 *
 * The browser talks to SSO same-origin at `/api/auth/*` (Caddy in prod, the
 * Vite proxy in dev). `ssoUrl` is the public SSO frontend used for the
 * login / signup / account pages.
 */
import { createSsoClient } from '@/lib/sso/sso-client'
import { env } from './env'

export const sso = createSsoClient({ ssoUrl: env.SSO_FRONTEND_URL })

export {
  ANONYMOUS,
  isOwner,
  type SsoSession,
  type SsoUser,
} from '@/lib/sso/sso-client'

/** Current path + query + hash, for `?next=` return URLs. */
export function currentPath(): string {
  const { pathname, search, hash } = window.location
  return `${pathname}${search}${hash}`
}

/** Pages whose API calls require the owner session. */
export function isProtectedPath(pathname: string): boolean {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}
