import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Search, Tag, X } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Seo } from '@/components/common/Seo'
import { ProjectCard } from '@/components/project/ProjectCard'
import { Pagination } from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useProjectFacets, useProjects } from '@/hooks/useProjectQueries'
import { cn } from '@/lib/cn'
import { PROJECT_STATUS_LABEL, isProjectStatus } from '@/lib/projectStatus'
import { PROJECT_STATUSES, type ProjectStatus } from '@/types/project'

const PAGE_SIZE = 12
const SKILLS_COLLAPSED = 14

const chipClass = (active: boolean) =>
  cn(
    'rounded-full px-3 py-1 font-mono text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
    active
      ? 'bg-green font-semibold text-navy'
      : 'border border-navy-border bg-navy text-slate hover:border-green/40 hover:text-lightest-slate',
  )

export function ProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const urlQ = searchParams.get('q') ?? ''
  const statuses = searchParams.getAll('status').filter(isProjectStatus)
  // The API caps these at 50 characters; a longer hand-edited URL must not error.
  const skill = (searchParams.get('skill') ?? '').slice(0, 50)
  const tag = (searchParams.get('tag') ?? '').slice(0, 50)
  const page = Math.max(1, Number.parseInt(searchParams.get('page') ?? '1', 10) || 1)

  // The box updates instantly; the URL (and the request) follow 300 ms later.
  const [input, setInput] = useState(urlQ)
  const debouncedQ = useDebouncedValue(input.trim(), 300)

  // Back/forward or "Clear" changed the URL from outside: mirror it in the box.
  const [seenUrlQ, setSeenUrlQ] = useState(urlQ)
  if (urlQ !== seenUrlQ) {
    setSeenUrlQ(urlQ)
    if (urlQ !== debouncedQ) setInput(urlQ)
  }

  useEffect(() => {
    if (debouncedQ === urlQ) return
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (debouncedQ) next.set('q', debouncedQ)
        else next.delete('q')
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }, [debouncedQ, urlQ, setSearchParams])

  const update = (mutate: (next: URLSearchParams) => void) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      mutate(next)
      return next
    })
  }

  const toggleStatus = (status: ProjectStatus) =>
    update((next) => {
      const current = next.getAll('status').filter(isProjectStatus)
      next.delete('status')
      const wanted = current.includes(status)
        ? current.filter((s) => s !== status)
        : [...current, status]
      PROJECT_STATUSES.filter((s) => wanted.includes(s)).forEach((s) =>
        next.append('status', s),
      )
      next.delete('page')
    })

  const selectSkill = (value: string) =>
    update((next) => {
      if (next.get('skill') === value) next.delete('skill')
      else next.set('skill', value)
      next.delete('page')
    })

  const clearTag = () =>
    update((next) => {
      next.delete('tag')
      next.delete('page')
    })

  const goToPage = (value: number) => {
    update((next) => {
      if (value <= 1) next.delete('page')
      else next.set('page', String(value))
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearAll = () => {
    setInput('')
    setSearchParams(new URLSearchParams())
  }

  // React Query hashes keys structurally, so a fresh object per render is fine.
  const query = {
    q: urlQ || undefined,
    status: statuses.length > 0 ? statuses : undefined,
    skill: skill || undefined,
    tag: tag || undefined,
    page,
    page_size: PAGE_SIZE,
  }

  const projects = useProjects(query)
  const facets = useProjectFacets()
  const [showAllSkills, setShowAllSkills] = useState(false)

  const statusCounts = new Map(facets.data?.statuses.map((f) => [f.value, f.count]))
  const skills = facets.data?.skills ?? []
  // Always a copy: the facet array belongs to the query cache.
  const visibleSkills = skills.slice(0, showAllSkills ? skills.length : SKILLS_COLLAPSED)
  // Keep a skill that came in via the URL visible even if it is outside the top list.
  if (skill && !visibleSkills.some((s) => s.value === skill)) {
    visibleSkills.push({ value: skill, count: 0 })
  }
  const hasFilters = Boolean(urlQ || input || statuses.length || skill || tag)

  const data = projects.data
  const firstItem = data && data.total > 0 ? (data.page - 1) * data.page_size + 1 : 0
  const lastItem = data ? firstItem + data.items.length - 1 : 0

  return (
    <div className="mx-auto w-full max-w-[1200px] pb-20">
      <Seo
        title="Projects"
        description="Everything I've built: live tools you can try, plus archived experiments."
      />
      <header className="mb-10 max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold text-lightest-slate md:text-5xl">Projects</h1>
        <p className="text-lg leading-relaxed text-slate">
          Everything I&apos;ve built. Live projects can be tried right away in Studio;
          archived ones are kept for reference.
        </p>
      </header>

      <section
        aria-label="Filter projects"
        className="mb-8 rounded-xl border border-navy-border bg-light-navy p-5 shadow-lg"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
            <input
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search name, description or stack…"
              aria-label="Search projects"
              maxLength={200}
              className="w-full rounded-lg border border-navy-border bg-navy py-2 pr-9 pl-10 text-sm text-lightest-slate placeholder:text-dark-slate focus:border-green focus:outline-none"
            />
            {input ? (
              <button
                type="button"
                onClick={() => setInput('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-slate hover:text-lightest-slate"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Status">
            {PROJECT_STATUSES.map((status) => {
              const active = statuses.includes(status)
              const count = statusCounts.get(status)
              return (
                <button
                  key={status}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleStatus(status)}
                  className={chipClass(active)}
                >
                  {PROJECT_STATUS_LABEL[status]}
                  {count !== undefined ? (
                    <span className={cn('ml-1.5', active ? 'text-navy/70' : 'text-dark-slate')}>
                      {count}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        {visibleSkills.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-navy-border pt-4">
            <span className="mr-1 flex items-center gap-1 font-mono text-xs text-slate">
              <Filter className="h-3 w-3 text-green" aria-hidden />
              Stack:
            </span>
            {visibleSkills.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={skill === s.value}
                onClick={() => selectSkill(s.value)}
                className={chipClass(skill === s.value)}
              >
                {s.value}
              </button>
            ))}
            {skills.length > SKILLS_COLLAPSED ? (
              <button
                type="button"
                onClick={() => setShowAllSkills((v) => !v)}
                className="font-mono text-xs text-green hover:underline"
              >
                {showAllSkills ? 'Show fewer' : `+${skills.length - SKILLS_COLLAPSED} more`}
              </button>
            ) : null}
          </div>
        ) : null}

        {tag || hasFilters ? (
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-navy-border pt-4">
            {tag ? (
              <button type="button" onClick={clearTag} className={chipClass(true)}>
                <Tag className="mr-1 inline h-3 w-3" aria-hidden />
                {tag}
                <X className="ml-1 inline h-3 w-3" aria-label="Remove tag filter" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-slate hover:text-green"
            >
              <X className="h-3 w-3" aria-hidden />
              Clear filters
            </button>
          </div>
        ) : null}
      </section>

      {projects.isError ? (
        <ErrorState
          message="Couldn't load projects."
          onRetry={() => void projects.refetch()}
        />
      ) : !data ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : data.total === 0 ? (
        <EmptyState message="No projects match these filters." />
      ) : data.items.length === 0 ? (
        // e.g. ?page=999 from an old link, or results shrank since the page was opened.
        <div className="py-10 text-center text-slate">
          <p>That page is past the end of the results.</p>
          <button
            type="button"
            onClick={() => goToPage(1)}
            className="mt-3 font-mono text-sm text-green hover:underline"
          >
            Back to page 1
          </button>
        </div>
      ) : (
        <>
          <p className="mb-6 font-mono text-xs text-slate" aria-live="polite">
            Showing {firstItem}–{lastItem} of {data.total} projects
          </p>
          <div
            className={cn(
              'grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3',
              projects.isPlaceholderData && 'opacity-60',
            )}
          >
            {data.items.map((project) => (
              <ProjectCard key={project.id} project={project} onSelectSkill={selectSkill} />
            ))}
          </div>
          <Pagination page={data.page} totalPages={data.total_pages} onPageChange={goToPage} />
        </>
      )}
    </div>
  )
}
