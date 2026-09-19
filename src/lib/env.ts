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
const SSO_API_URL = requireEnv('VITE_SSO_API_URL')
const SSO_FRONTEND_URL = requireEnv('VITE_SSO_FRONTEND_URL')

export const env = {
  PORTFOLIO_API_URL,
  SSO_API_URL,
  SSO_FRONTEND_URL,
  PORTFOLIO_API_ORIGIN: originOf(PORTFOLIO_API_URL),
} as const
