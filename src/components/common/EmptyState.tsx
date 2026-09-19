import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function EmptyState({
  message,
  actionHref,
  actionLabel,
}: {
  message: string
  actionHref?: string
  actionLabel?: string
}) {
  const external = Boolean(actionHref && /^https?:\/\//i.test(actionHref))
  return (
    <div className="py-10 text-center text-slate">
      <p>{message}</p>
      {actionHref && actionLabel ? (
        <p className="mt-3">
          {external ? (
            <a
              href={actionHref}
              className="font-mono text-sm text-green underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            >
              {actionLabel}
            </a>
          ) : (
            <Link
              to={actionHref}
              className="font-mono text-sm text-green underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            >
              {actionLabel}
            </Link>
          )}
        </p>
      ) : null}
    </div>
  )
}

export function EmptyInline({ children }: { children: ReactNode }) {
  return <p className="text-slate">{children}</p>
}
