import * as TabsPrimitive from '@radix-ui/react-tabs'
import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export const Tabs = TabsPrimitive.Root

export function TabsList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn('inline-flex items-center gap-1', className)}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center rounded px-3 py-1.5 font-mono text-sm text-slate transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green data-[state=active]:bg-light-navy data-[state=active]:text-green',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('mt-2 focus-visible:outline-none', className)}
      {...props}
    />
  )
}
