import * as LabelPrimitive from '@radix-ui/react-label'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export function Label({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'font-mono text-xs text-green peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )}
      {...props}
    />
  )
}
