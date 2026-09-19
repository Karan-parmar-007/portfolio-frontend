import { isAxiosError } from 'axios'
import { Link, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { MediaImage } from '@/components/common/MediaImage'
import { PageLoader } from '@/components/common/PageLoader'
import { Seo } from '@/components/common/Seo'
import { Badge } from '@/components/ui/badge'
import { useProject } from '@/hooks/useProjectQueries'

function contributorHref(url: string): string {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function ProjectDetailPage() {
  const { slug = '' } = useParams()
  const { data, isLoading, isError, error, refetch } = useProject(slug)

  if (isLoading) return <PageLoader message="Loading project..." />

  if (isError && isAxiosError(error) && error.response?.status === 404) {
    return (
      <EmptyState
        message="Project not found."
        actionHref="/projects"
        actionLabel="Back to archive"
      />
    )
  }

  if (isError || !data) {
    console.error(error)
    return (
      <ErrorState
        message="Failed to load project."
        onRetry={() => void refetch()}
      />
    )
  }

  return (
    <article className="mx-auto max-w-[800px] pb-20">
      <Seo title={`${data.name} — Project`} description={data.short_description} />
      <Link
        to="/projects"
        className="mb-8 inline-block font-mono text-sm text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
      >
        ← Archive
      </Link>
      <h1 className="mb-4 text-[clamp(32px,5vw,48px)] font-semibold text-lightest-slate">
        {data.name}
      </h1>
      <p className="mb-6 text-lg text-slate">{data.short_description}</p>
      {data.cover_image ? (
        <MediaImage
          media={data.cover_image}
          alt={data.name}
          className="mb-8 w-full rounded"
        />
      ) : null}
      <div className="mb-8 flex flex-wrap gap-2">
        {data.skills.map((skill) => (
          <Badge key={skill.id}>{skill.name}</Badge>
        ))}
      </div>
      <div className="max-w-none whitespace-pre-line text-slate">
        {data.long_description}
      </div>
      <div className="mt-8 flex flex-wrap gap-4 font-mono text-sm">
        {data.is_live && data.live_url ? (
          <a
            href={data.live_url}
            target="_blank"
            rel="noreferrer"
            className="text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            Live site
          </a>
        ) : null}
        {data.github_link_frontend ? (
          <a
            href={data.github_link_frontend}
            target="_blank"
            rel="noreferrer"
            className="text-green hover:underline"
          >
            Frontend
          </a>
        ) : null}
        {data.github_link_backend ? (
          <a
            href={data.github_link_backend}
            target="_blank"
            rel="noreferrer"
            className="text-green hover:underline"
          >
            Backend
          </a>
        ) : null}
        {data.docker_image_link_frontend ? (
          <a
            href={data.docker_image_link_frontend}
            target="_blank"
            rel="noreferrer"
            className="text-green hover:underline"
          >
            Frontend Docker
          </a>
        ) : null}
        {data.docker_image_link_backend ? (
          <a
            href={data.docker_image_link_backend}
            target="_blank"
            rel="noreferrer"
            className="text-green hover:underline"
          >
            Backend Docker
          </a>
        ) : null}
      </div>
      {Object.keys(data.contributors).length > 0 ? (
        <div className="mt-8 border-t border-lightest-navy pt-6">
          <p className="mb-3 font-mono text-sm text-green">Contributors</p>
          <ul className="flex flex-wrap gap-3">
            {Object.entries(data.contributors).map(([role, person]) => (
              <li
                key={role}
                className="rounded border border-lightest-navy bg-navy px-3 py-1.5 text-xs"
              >
                <span className="font-medium text-lightest-slate">{role}</span>
                <span className="mx-1 text-slate">•</span>
                <a
                  href={contributorHref(person)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
                >
                  {person}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
