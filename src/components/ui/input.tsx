import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'flex h-10 w-full rounded border border-lightest-navy bg-light-navy px-3 py-2 text-sm text-lightest-slate placeholder:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
