import { Rocket } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { ProjectSummary } from '@/types/project'

/**
 * Opens the project's own Studio page (not the Studio dashboard). Studio asks
 * signed-out visitors to sign in or sign up and then returns them to that page.
 * Rendered only while the project is live and has a link.
 */
export function TryItNowLink({
  project,
  className,
}: {
  project: Pick<ProjectSummary, 'status' | 'try_url' | 'name'>
  className?: string
}) {
  if (project.status !== 'live' || !project.try_url) return null
  return (
    <a
      href={project.try_url}
      className={cn(
        'inline-flex items-center gap-2 rounded border border-green bg-green-tint px-5 py-2.5 font-mono text-xs font-medium text-green transition-colors hover:bg-green/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
        className,
      )}
      aria-label={`Try ${project.name} now`}
    >
      <Rocket className="h-4 w-4" aria-hidden />
      Try it now
    </a>
  )
}
