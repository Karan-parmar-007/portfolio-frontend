import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { PageLoader } from '@/components/common/PageLoader'
import { Seo } from '@/components/common/Seo'
import { cn } from '@/lib/cn'
import { useSkillCategories } from '@/hooks/usePortfolioQueries'

const PALETTE = [
  'text-green border-green/25 bg-green/10',
  'text-lightest-slate border-lightest-navy bg-light-navy',
  'text-green border-green/20 bg-green-tint',
  'text-light-slate border-lightest-navy bg-navy-border/40',
] as const

export function SkillsPage() {
  const { data, isLoading, isError, error, refetch } = useSkillCategories()

  if (isLoading) return <PageLoader message="Loading skills..." />
  if (isError) {
    console.error(error)
    return (
      <ErrorState message="Failed to load skills." onRetry={() => void refetch()} />
    )
  }
  if (!data || data.length === 0) {
    return <EmptyState message="No skills available yet." />
  }

  const groups = data.filter((category) => category.skills.length > 0)

  return (
    <div className="mx-auto max-w-[1400px] pb-20">
      <Seo title="Skills" description="Technologies and tools" />
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-lightest-slate md:text-5xl">
          Skills &amp; Technologies
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate">
          A collection of tools, languages, and frameworks I work with — organized by
          domain.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((category, index) => (
          <article
            key={category.id}
            className={cn(
              'rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
              PALETTE[index % PALETTE.length],
            )}
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-current" />
              <h2 className="text-xl font-bold">{category.name}</h2>
              <span className="ml-auto font-mono text-xs opacity-60">
                {category.skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center rounded-full border border-current/30 bg-current/10 px-3 py-1.5 font-mono text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
