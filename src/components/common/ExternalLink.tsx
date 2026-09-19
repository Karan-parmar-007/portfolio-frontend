import { ExternalLink as ExternalLinkIcon } from 'lucide-react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function ExternalLink({
  href,
  children,
  className,
  showIcon = false,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  showIcon?: boolean
}) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        'inline-flex items-center gap-1 text-green transition-colors hover:text-green/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green focus-visible:ring-offset-2 focus-visible:ring-offset-navy',
        className,
      )}
      {...props}
    >
      {children}
      {showIcon ? <ExternalLinkIcon className="h-3.5 w-3.5" aria-hidden /> : null}
    </a>
  )
}
