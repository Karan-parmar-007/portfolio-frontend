import { Folder } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MediaImage } from '@/components/common/MediaImage'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'
import { TryItNowLink } from '@/components/project/TryItNowLink'
import { cn } from '@/lib/cn'
import { GithubIconExport as GithubIcon } from '@/lib/socialIcons'
import type { ProjectSummary } from '@/types/project'

export function FeaturedProjectCard({
  project,
  reverse,
}: {
  project: ProjectSummary
  reverse: boolean
}) {
  const detailHref = `/projects/${project.slug}`
  return (
    <div className="group relative overflow-hidden rounded-lg bg-light-navy transition-all duration-300 hover:shadow-2xl hover:shadow-green/10">
      <div className="grid gap-0 md:grid-cols-2">
        <Link
          to={detailHref}
          tabIndex={-1}
          aria-hidden
          className={cn(
            'relative block h-[400px] overflow-hidden',
            reverse ? 'md:order-1' : 'md:order-2',
          )}
        >
          {project.cover ? (
            <MediaImage
              media={project.cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-navy">
              <Folder className="h-24 w-24 text-green/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-light-navy via-light-navy/50 to-transparent opacity-60" />
          <div className="absolute top-4 left-4">
            <ProjectStatusBadge status={project.status} className="backdrop-blur-sm" />
          </div>
        </Link>

        <div
          className={cn(
            'flex flex-col justify-center p-8 md:p-10',
            reverse ? 'md:order-2' : 'md:order-1',
          )}
        >
          <p className="mb-2 font-mono text-sm text-green">Featured Project</p>
          <h3 className="mb-6 text-3xl font-bold text-lightest-slate transition-colors group-hover:text-green">
            <Link
              to={detailHref}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            >
              {project.name}
            </Link>
          </h3>
          <p className="leading-relaxed text-slate">{project.short_description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech_stack.map((tech) => (
              <Link
                key={tech}
                to={`/projects?skill=${encodeURIComponent(tech)}`}
                className="rounded-full border border-green/20 bg-green-tint px-3 py-1 font-mono text-xs text-green transition-colors hover:bg-green/20"
              >
                {tech}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} source code`}
                className="text-lightest-slate transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            ) : null}
            <Link
              to={detailHref}
              className="font-mono text-xs text-light-slate transition-colors hover:text-green"
            >
              Details →
            </Link>
            <TryItNowLink project={project} className="ml-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}
