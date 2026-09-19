import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export function AdminPageHeader({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-lightest-slate">{title}</h2>
        {description ? <p className="mt-1 text-sm text-slate">{description}</p> : null}
      </div>
      {actionLabel && onAction ? (
        <Button type="button" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export function AdminCard({
  title,
  children,
  action,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="rounded border border-lightest-navy bg-light-navy p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-lightest-slate">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  )
}
