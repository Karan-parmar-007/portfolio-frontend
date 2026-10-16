import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Seo } from '@/components/common/Seo'
import { sso } from '@/lib/sso'

/**
 * `/admin/login` is just a shortcut to the SSO login page. SSO sends the user
 * back to `/admin` (immediately if already signed in), where OwnerGate decides.
 */
export function LoginPage() {
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from
  const returnTo = from?.startsWith('/admin') ? from : '/admin'

  useEffect(() => {
    window.location.replace(sso.loginUrl(returnTo))
  }, [returnTo])

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy px-6">
      <Seo title="Admin Login" />
      <p className="font-mono text-sm text-green">Redirecting to sign in…</p>
    </div>
  )
}
