import { Sparkles } from 'lucide-react'
import { env } from '@/lib/env'
import { cn } from '@/lib/cn'

const SIZES = {
  sm: 'h-9 px-4 text-xs',
  lg: 'h-12 w-full max-w-[200px] px-6 text-sm',
  hero: 'px-7 py-4 text-sm',
} as const

/**
 * Studio call-to-action. A tinted fill and a soft glow set it apart from the
 * plain outlined buttons without shouting. Opens in a new tab.
 */
export function StudioLink({
  size,
  className,
  onNavigate,
}: {
  size: keyof typeof SIZES
  className?: string
  onNavigate?: () => void
}) {
  return (
    <a
      href={env.STUDIO_URL}
      target="_blank"
      rel="noopener"
      onClick={onNavigate}
      title="Try my live AI tools in Studio"
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded border border-green/70 bg-green/10 font-mono text-green shadow-md shadow-green/10 transition-all duration-200 hover:-translate-y-0.5 hover:border-green hover:bg-green/20 hover:shadow-green/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-navy motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        SIZES[size],
        className,
      )}
    >
      <Sparkles aria-hidden="true" className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      <span>Studio</span>
      <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-green opacity-60 motion-safe:animate-ping" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
      </span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
