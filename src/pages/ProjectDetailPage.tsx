import { isAxiosError } from 'axios'
import { Archive, ArrowLeft, PowerOff, Star } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { MediaImage } from '@/components/common/MediaImage'
import { PageLoader } from '@/components/common/PageLoader'
import { Seo } from '@/components/common/Seo'
import { ProjectBody } from '@/components/project/ProjectBody'
import { ProjectStatusBadge } from '@/components/project/ProjectStatusBadge'
import { TryItNowLink } from '@/components/project/TryItNowLink'
import { useProject } from '@/hooks/useProjectQueries'
import { GithubIconExport as GithubIcon } from '@/lib/socialIcons'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const { data: project, isLoading, isError, error, refetch } = useProject(slug)

  if (isLoading) return <PageLoader message="Loading project..." />
  if (isError || !project) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return (
        <EmptyState
          message="This project doesn't exist."
          actionHref="/projects"
          actionLabel="Browse all projects"
        />
      )
    }
    return <ErrorState message="Couldn't load this project." onRetry={() => void refetch()} />
  }

  return (
    <article className="mx-auto w-full max-w-[900px] pb-20">
      <Seo title={project.name} description={project.short_description} />

      <Link
        to="/projects"
        className="mb-8 inline-flex items-center gap-2 font-mono text-xs text-slate transition-colors hover:text-green"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All projects
      </Link>

      {project.cover ? (
        <MediaImage
          media={project.cover}
          alt=""
          loading="eager"
          className="mb-10 max-h-[440px] w-full rounded-xl border border-navy-border object-cover"
        />
      ) : null}

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ProjectStatusBadge status={project.status} />
        {project.is_featured ? (
          <span className="inline-flex items-center gap-1 font-mono text-xxs text-green">
            <Star className="h-3 w-3 fill-green" aria-hidden />
            Featured
          </span>
        ) : null}
      </div>

      <h1 className="mb-4 text-4xl font-bold text-lightest-slate md:text-5xl">{project.name}</h1>
      <p className="mb-8 text-lg leading-relaxed text-light-slate">{project.short_description}</p>

      <div className="mb-8 flex flex-wrap items-center gap-4">
        <TryItNowLink project={project} />
        {project.github_url ? (
          <a
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded border border-lightest-navy px-5 py-2.5 font-mono text-xs text-lightest-slate transition-colors hover:border-green hover:text-green"
          >
            <GithubIcon className="h-4 w-4" />
            Source code
          </a>
        ) : null}
      </div>

      {project.status === 'offline' ? (
        <p className="mb-8 flex items-start gap-2 rounded-lg border border-navy-border bg-light-navy p-4 text-sm text-slate">
          <PowerOff className="mt-0.5 h-4 w-4 shrink-0 text-light-slate" aria-hidden />
          This project is offline right now. It will be back once it&apos;s running again.
        </p>
      ) : null}
      {project.status === 'archived' ? (
        <p className="mb-8 flex items-start gap-2 rounded-lg border border-navy-border bg-light-navy p-4 text-sm text-slate">
          <Archive className="mt-0.5 h-4 w-4 shrink-0 text-light-slate" aria-hidden />
          Archived: kept here for reference. It no longer runs, but the write-up and code are still worth a look.
        </p>
      ) : null}

      {project.tech_stack.length > 0 ? (
        <section aria-label="Tech stack" className="mb-6 flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <Link
              key={tech}
              to={`/projects?skill=${encodeURIComponent(tech)}`}
              className="rounded-full border border-green/20 bg-green-tint px-3 py-1 font-mono text-xs text-green transition-colors hover:bg-green/20"
            >
              {tech}
            </Link>
          ))}
        </section>
      ) : null}

      {project.tags.length > 0 ? (
        <section aria-label="Tags" className="mb-10 flex flex-wrap gap-2">
          {project.tags.map((name) => (
            <Link
              key={name}
              to={`/projects?tag=${encodeURIComponent(name)}`}
              className="rounded border border-navy-border px-2.5 py-0.5 font-mono text-xxs text-slate transition-colors hover:border-green/40 hover:text-lightest-slate"
            >
              #{name}
            </Link>
          ))}
        </section>
      ) : null}

      <ProjectBody html={project.long_description} />
    </article>
  )
}
