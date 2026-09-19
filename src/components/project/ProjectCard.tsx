import { ExternalLink, Folder } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIconExport as GithubIcon } from '@/lib/socialIcons'
import type { ProjectSummary } from '@/types/project'

export function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-transparent bg-light-navy p-7 transition-all duration-300 hover:-translate-y-2 hover:border-green/20 hover:shadow-2xl hover:shadow-green/10">
      <div>
        {/* Card Header: Folder Icon and External Links */}
        <div className="mb-6 flex items-center justify-between">
          <Folder className="h-10 w-10 text-green transition-transform duration-300 group-hover:scale-105" aria-hidden />
          <div className="flex items-center gap-3">
            {project.github_link_backend ? (
              <a
                href={project.github_link_backend}
                target="_blank"
                rel="noreferrer"
                title="Backend Repository"
                aria-label="Backend Repository"
                className="text-light-slate transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            ) : null}
            {project.github_link_frontend ? (
              <a
                href={project.github_link_frontend}
                target="_blank"
                rel="noreferrer"
                title="Frontend Repository"
                aria-label="Frontend Repository"
                className="text-light-slate transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            ) : null}
            {project.is_live && project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                title="Live Demo"
                aria-label="Live Demo"
                className="text-light-slate transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <ExternalLink className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </div>

        {/* Access Level / Live Badges */}
        <div className="mb-3 flex items-center gap-2">
          {project.access_level?.name ? (
            <span className="rounded bg-green-tint px-2 py-0.5 font-mono text-xs text-green">
              {project.access_level.name}
            </span>
          ) : null}
          {project.is_live ? (
            <span className="rounded bg-green-tint px-2 py-0.5 font-mono text-xs text-green">
              Live
            </span>
          ) : null}
        </div>

        {/* Project Name */}
        <h3 className="mb-3 text-xl font-bold text-lightest-slate transition-colors group-hover:text-green">
          <Link
            to={`/projects/${project.slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            {project.name}
          </Link>
        </h3>

        {/* Project Description */}
        <p className="line-clamp-4 text-sm leading-relaxed text-slate">
          {project.short_description}
        </p>
      </div>

      {/* Tech Stack Footer */}
      <div className="mt-6 pt-2">
        <ul className="flex flex-wrap gap-x-3 gap-y-1.5 font-mono text-xs text-slate">
          {project.skills.slice(0, 5).map((skill) => (
            <li key={skill.id} className="transition-colors group-hover:text-light-slate">
              {skill.name}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
