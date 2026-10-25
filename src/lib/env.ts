import { resolveAppUrl } from '@/lib/sso/sso-client'

function requireEnv(key: string): string {
  const value = import.meta.env[key]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function originOf(url: string): string {
  try {
    return new URL(url).origin
  } catch {
    return typeof window !== 'undefined' ? window.location.origin : ''
  }
}

const PORTFOLIO_API_URL = requireEnv('VITE_PORTFOLIO_API_URL')
const SSO_FRONTEND_URL = resolveAppUrl(requireEnv('VITE_SSO_FRONTEND_URL'))
// Optional so an image built without the arg still links to production Studio.
const STUDIO_URL = resolveAppUrl(import.meta.env.VITE_STUDIO_URL || 'https://studio.karanparmar.in')

export const env = {
  PORTFOLIO_API_URL,
  SSO_FRONTEND_URL,
  STUDIO_URL,
  PORTFOLIO_API_ORIGIN: originOf(PORTFOLIO_API_URL),
} as const
