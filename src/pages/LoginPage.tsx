import { useEffect } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { env } from '@/lib/env'

function buildSsoLoginUrl(returnPath: string): string {
  const path = returnPath.startsWith('/') ? returnPath : `/${returnPath}`
  const next = `${window.location.origin}${path}`
  const url = new URL('/login', env.SSO_FRONTEND_URL)
  url.searchParams.set('next', next)
  return url.toString()
}

export function LoginPage() {
  const { isOwner, isLoading, session, logout } = useAuth()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from ?? '/admin'

  useEffect(() => {
    if (isLoading) return
    if (isOwner) return
    if (session?.authenticated && !session.is_owner) return
    window.location.replace(buildSsoLoginUrl(from))
  }, [isLoading, isOwner, session, from])

  if (!isLoading && isOwner) {
    return <Navigate to={from.startsWith('/') ? from : '/admin'} replace />
  }

  if (!isLoading && session?.authenticated && !session.is_owner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy px-6 text-center">
        <Seo title="Admin Login" />
        <h1 className="text-2xl font-semibold text-lightest-slate">
          Not authorised
        </h1>
        <p className="max-w-md text-slate">
          This account does not have access to the portfolio admin.
        </p>
        <div className="flex gap-3">
          <Button type="button" onClick={() => void logout()}>
            Log out
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <Seo title="Admin Login" />
      <p className="font-mono text-sm text-green">Redirecting to sign in…</p>
    </div>
  )
}
