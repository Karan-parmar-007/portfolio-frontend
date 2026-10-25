import { cn } from '@/lib/cn'
import { PROJECT_STATUS_LABEL } from '@/lib/projectStatus'
import type { ProjectStatus } from '@/types/project'

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xxs',
        status === 'live' && 'border-green/30 bg-green-tint text-green',
        status === 'offline' && 'border-lightest-navy bg-navy/80 text-light-slate',
        status === 'archived' && 'border-navy-border bg-navy/80 text-slate',
        className,
      )}
    >
      {status === 'live' ? (
        <span className="h-1.5 w-1.5 rounded-full bg-green motion-safe:animate-pulse" aria-hidden />
      ) : null}
      {PROJECT_STATUS_LABEL[status]}
    </span>
  )
}
