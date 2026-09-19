import type { SkillCategory } from '@/types/portfolio'
import type { ProjectSort } from '@/types/project'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function ProjectFilters({
  sort,
  onSortChange,
  categories,
  selectedSkills,
  onSkillsChange,
}: {
  sort: ProjectSort
  onSortChange: (sort: ProjectSort) => void
  categories: SkillCategory[]
  selectedSkills: string[]
  onSkillsChange: (ids: string[]) => void
}) {
  const groups = categories.filter((category) => category.skills.length > 0)

  const toggleSkill = (id: string, active: boolean) => {
    onSkillsChange(
      active
        ? selectedSkills.filter((skillId) => skillId !== id)
        : [...selectedSkills, id],
    )
  }

  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {groups.map((category) => {
          const selectedCount = category.skills.filter((skill) =>
            selectedSkills.includes(skill.id),
          ).length
          return (
            <details
              key={category.id}
              className="rounded border border-lightest-navy bg-light-navy/40"
            >
              <summary className="cursor-pointer list-none px-3 py-2 font-mono text-xs text-green marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-3">
                  <span>{category.name}</span>
                  <span className="text-slate">
                    {selectedCount > 0
                      ? `${selectedCount} selected`
                      : `${category.skills.length} skills`}
                  </span>
                </span>
              </summary>
              <div className="flex flex-wrap gap-2 px-3 pb-3">
                {category.skills.map((skill) => {
                  const active = selectedSkills.includes(skill.id)
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      className={
                        active
                          ? 'rounded border border-green bg-green-tint px-3 py-1 font-mono text-xs text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green'
                          : 'rounded border border-lightest-navy px-3 py-1 font-mono text-xs text-slate hover:border-green hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green'
                      }
                      onClick={() => toggleSkill(skill.id, active)}
                    >
                      {skill.name}
                    </button>
                  )
                })}
              </div>
            </details>
          )
        })}
        {selectedSkills.length > 0 ? (
          <button
            type="button"
            className="self-start font-mono text-xs text-slate hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            onClick={() => onSkillsChange([])}
          >
            Clear skill filters
          </button>
        ) : null}
      </div>
      <Select value={sort} onValueChange={(v) => onSortChange(v as ProjectSort)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sequence">Default</SelectItem>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="relevance">Relevance</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
