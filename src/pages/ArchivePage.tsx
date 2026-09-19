import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Seo } from '@/components/common/Seo'
import { ProjectGridSkeleton } from '@/components/common/Skeletons'
import { ProjectCard } from '@/components/project/ProjectCard'
import { ProjectFilters } from '@/components/project/ProjectFilters'
import { ProjectSearch } from '@/components/project/ProjectSearch'
import { Pagination } from '@/components/ui/pagination'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useSkillCategories } from '@/hooks/usePortfolioQueries'
import { useProjects } from '@/hooks/useProjectQueries'
import type { ProjectSort } from '@/types/project'

export function ArchivePage() {
  const [params, setParams] = useSearchParams()
  const qParam = params.get('q') ?? ''
  const sort = (params.get('sort') as ProjectSort | null) ?? 'sequence'
  const page = Number(params.get('page') ?? '1') || 1
  const skillsParam = params.get('skills') ?? ''
  const skillIds = skillsParam ? skillsParam.split(',').filter(Boolean) : []

  const [qInput, setQInput] = useState(qParam)
  const debouncedQ = useDebouncedValue(qInput, 300)

  useEffect(() => {
    setQInput(qParam)
  }, [qParam])

  const update = (patch: Record<string, string | null>) => {
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
      }
      return next
    })
  }

  useEffect(() => {
    setParams((prev) => {
      const current = prev.get('q') ?? ''
      if (debouncedQ === current) return prev
      const next = new URLSearchParams(prev)
      if (debouncedQ) next.set('q', debouncedQ)
      else {
        next.delete('q')
        if (next.get('sort') === 'relevance') next.set('sort', 'sequence')
      }
      next.set('page', '1')
      return next
    })
  }, [debouncedQ, setParams])

  const effectiveSort: ProjectSort =
    debouncedQ && sort === 'relevance'
      ? 'relevance'
      : sort === 'relevance'
        ? 'sequence'
        : sort

  const query = {
    q: debouncedQ || undefined,
    sort: effectiveSort,
    page,
    page_size: 12,
    skill_ids: skillIds.length > 0 ? skillIds : undefined,
  }

  const { data, isLoading, isError, error, refetch } = useProjects(query)
  const categories = useSkillCategories()

  return (
    <div className="mx-auto max-w-[1100px] pb-20">
      <Seo title="Archive - Projects" description="All projects" />
      <h1 className="mb-2 text-[clamp(32px,5vw,48px)] font-bold text-lightest-slate">
        Archive
      </h1>
      <p className="mb-8 font-mono text-sm text-green">
        A complete list of things I&apos;ve built
      </p>

      <ProjectSearch value={qInput} onChange={setQInput} />
      <ProjectFilters
        sort={effectiveSort}
        onSortChange={(value) => update({ sort: value, page: '1' })}
        categories={categories.data ?? []}
        selectedSkills={skillIds}
        onSkillsChange={(ids) =>
          update({ skills: ids.length ? ids.join(',') : null, page: '1' })
        }
      />

      {isLoading ? <ProjectGridSkeleton /> : null}
      {isError ? (
        (() => {
          console.error(error)
          return (
            <ErrorState
              message="Failed to load projects."
              onRetry={() => void refetch()}
            />
          )
        })()
      ) : null}
      {data && data.items.length === 0 ? (
        <EmptyState message="No projects match these filters yet." />
      ) : null}
      {data && data.items.length > 0 ? (
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((project) => (
              <li key={project.id} className="h-full">
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
          <Pagination
            page={data.page}
            totalPages={data.total_pages}
            onPageChange={(p) => update({ page: String(p) })}
          />
        </>
      ) : null}
    </div>
  )
}
