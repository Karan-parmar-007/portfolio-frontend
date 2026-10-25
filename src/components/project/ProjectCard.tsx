import { Folder, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'
import { GithubIconExport as GithubIcon } from '@/lib/socialIcons'
import type { ProjectSummary } from '@/types/project'

export function ProjectCard({
  project,
  onSelectSkill,
}: {
  project: ProjectSummary
  /** On the projects page a tech chip filters in place; elsewhere it links there. */
  onSelectSkill?: (skill: string) => void
}) {
  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-transparent bg-light-navy p-7 transition-all duration-300 hover:-translate-y-2 hover:border-green/20 hover:shadow-2xl hover:shadow-green/10">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <Folder className="h-10 w-10 text-green transition-transform duration-300 group-hover:scale-105" aria-hidden />
          <div className="flex items-center gap-3">
            {project.is_featured ? (
              <Star className="h-4 w-4 fill-green text-green" aria-label="Featured" />
            ) : null}
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${project.name} source code`}
                className="relative z-10 text-light-slate transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <ProjectStatusBadge status={project.status} />
        </div>

        <h3 className="mb-3 text-xl font-bold text-lightest-slate transition-colors group-hover:text-green">
          {/* The stretched link makes the whole card open the detail page. */}
          <Link
            to={`/projects/${project.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            {project.name}
          </Link>
        </h3>

        <p className="line-clamp-4 text-sm leading-relaxed text-slate">
          {project.short_description}
        </p>
      </div>

      <ul className="relative z-10 mt-6 flex flex-wrap gap-x-3 gap-y-1.5 pt-2 font-mono text-xs text-slate">
        {project.tech_stack.slice(0, 6).map((tech) => (
          <li key={tech}>
            {onSelectSkill ? (
              <button
                type="button"
                onClick={() => onSelectSkill(tech)}
                className="transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                {tech}
              </button>
            ) : (
              <Link
                to={`/projects?skill=${encodeURIComponent(tech)}`}
                className="transition-colors hover:text-green"
              >
                {tech}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </article>
  )
}
