import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Badge({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded px-2 py-0.5 font-mono text-xxs text-green bg-green-tint',
        className,
      )}
    >
      {children}
    </span>
  )
}
