import { ExternalLink, Folder, Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MediaImage } from '@/components/common/MediaImage'
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
  return (
    <div className="group relative overflow-hidden rounded-lg bg-light-navy transition-all duration-300 hover:shadow-2xl hover:shadow-green/10">
      <div className="grid gap-0 md:grid-cols-2">
        <div
          className={cn(
            'relative h-[400px] overflow-hidden',
            reverse ? 'md:order-1' : 'md:order-2',
          )}
        >
          {project.cover_image ? (
            <MediaImage
              media={project.cover_image}
              alt={project.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-navy">
              <Folder className="h-24 w-24 text-green/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-light-navy via-light-navy/50 to-transparent opacity-60" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {project.access_level?.name ? (
              <span className="flex items-center gap-1.5 rounded-full border border-green/30 bg-navy/90 px-3 py-1.5 font-mono text-xs text-green backdrop-blur-sm">
                <Shield className="h-3 w-3" />
                {project.access_level.name}
              </span>
            ) : null}
            {project.is_live ? (
              <span className="flex items-center gap-1.5 rounded-full border border-green/30 bg-navy/90 px-3 py-1.5 font-mono text-xs text-green backdrop-blur-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green" />
                Live
              </span>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col justify-center p-8 md:p-10',
            reverse ? 'md:order-2' : 'md:order-1',
          )}
        >
          <p className="mb-2 font-mono text-sm text-green">Featured Project</p>
          <h3 className="mb-6 text-3xl font-bold text-lightest-slate transition-colors group-hover:text-green">
            <Link
              to={`/projects/${project.slug}`}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            >
              {project.name}
            </Link>
          </h3>
          <p className="leading-relaxed text-slate">{project.short_description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded-full border border-green/20 bg-green-tint px-3 py-1 font-mono text-xs text-green"
              >
                {skill.name}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            {project.github_link_backend ? (
              <a
                href={project.github_link_backend}
                target="_blank"
                rel="noreferrer"
                title="Backend Repository"
                className="flex items-center gap-2 text-lightest-slate transition-colors hover:text-green"
              >
                <GithubIcon className="h-5 w-5" />
                <span className="font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100">
                  Backend
                </span>
              </a>
            ) : null}
            {project.github_link_frontend ? (
              <a
                href={project.github_link_frontend}
                target="_blank"
                rel="noreferrer"
                title="Frontend Repository"
                className="flex items-center gap-2 text-lightest-slate transition-colors hover:text-green"
              >
                <GithubIcon className="h-5 w-5" />
                <span className="font-mono text-xs opacity-0 transition-opacity group-hover:opacity-100">
                  Frontend
                </span>
              </a>
            ) : null}
            {project.is_live && project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="ml-auto flex items-center gap-2 rounded border border-green/30 bg-green-tint px-4 py-2 text-green transition-colors hover:bg-green/20"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="font-mono text-xs font-medium">View Live</span>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
