import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'flex min-h-[100px] w-full rounded border border-lightest-navy bg-light-navy px-3 py-2 text-sm text-lightest-slate placeholder:text-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-navy disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
