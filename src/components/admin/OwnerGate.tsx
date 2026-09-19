import type { ReactNode } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'

export function OwnerGate({ children }: { children: ReactNode }) {
  const { isLoading, session, isOwner } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy p-8">
        <div className="w-full max-w-md">
          <AdminTableSkeleton rows={4} />
        </div>
      </div>
    )
  }

  if (!session?.authenticated) {
    return (
      <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
    )
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
        <Button asChild>
          <Link to="/">Go home</Link>
        </Button>
      </div>
    )
  }

  return children
}
