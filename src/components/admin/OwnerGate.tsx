import { useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import { Button } from '@/components/ui/button'
import { useAuth, useLogout } from '@/context/AuthContext'
import { sso } from '@/lib/sso'

function GateSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy p-8">
      <div className="w-full max-w-md">
        <AdminTableSkeleton rows={4} />
      </div>
    </div>
  )
}

/** UI gate only — every admin API call is enforced by the backend (live SSO owner check). */
export function OwnerGate({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, isOwner } = useAuth()
  const logout = useLogout()
  const location = useLocation()
  const signedOut = !isLoading && !isAuthenticated

  useEffect(() => {
    if (signedOut) {
      sso.redirectToLogin(`${location.pathname}${location.search}${location.hash}`)
    }
  }, [signedOut, location.pathname, location.search, location.hash])

  if (isLoading || signedOut) {
    return <GateSkeleton />
  }

  if (!isOwner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy px-6 text-center">
        <h1 className="text-2xl font-semibold text-lightest-slate">
          Not authorised
        </h1>
        <p className="max-w-md text-slate">
          This account does not have access to the portfolio admin.
        </p>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => void logout()}>
            Log out
          </Button>
          <Button asChild>
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return children
}
