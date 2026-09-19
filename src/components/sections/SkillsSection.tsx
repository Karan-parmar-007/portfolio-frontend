import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { NumberedHeading } from '@/components/common/NumberedHeading'
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/common/FadeIn'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'
import type { SkillCategory } from '@/types/portfolio'

export function SkillsSection({
  categories,
  number,
}: {
  categories: SkillCategory[]
  number: string
}) {
  const navigate = useNavigate()
  const activeCategories = categories.filter((c) => c.skills.length > 0)

  if (activeCategories.length === 0) return null

  return (
    <section id="skills" className="scroll-mt-24 py-20">
      <ScrollReveal>
        <NumberedHeading number={number} title="Skills &amp; Technologies" id="skills-heading" />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <p className="mb-10 max-w-2xl text-base text-slate lg:text-lg">
          A categorized breakdown of technologies, languages, frameworks, and developer tools I work with.
        </p>
      </ScrollReveal>

      <ScrollStagger delay={0.15} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activeCategories.map((category) => (
          <ScrollStaggerItem key={category.id}>
            <div
              className={cn(
                'group relative flex h-full flex-col justify-between rounded-lg border border-navy-border bg-light-navy p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-green/30 hover:shadow-xl hover:shadow-green/5',
              )}
            >
              <div>
                <div className="mb-4 flex items-center justify-between border-b border-lightest-navy/40 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full bg-green shadow-sm shadow-green/50" />
                    <h3 className="text-lg font-bold text-lightest-slate transition-colors group-hover:text-green">
                      {category.name}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-slate">
                    {category.skills.length} skills
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center rounded border border-lightest-navy bg-navy/60 px-2.5 py-1 font-mono text-xs text-light-slate transition-colors hover:border-green/40 hover:text-green"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>

      <ScrollReveal delay={0.2} className="mt-12 flex justify-center">
        <Button
          type="button"
          onClick={() => navigate('/skills')}
          className="group flex items-center gap-2 rounded border border-green bg-transparent px-8 py-5 font-mono text-sm text-green hover:bg-green-tint"
        >
          <span>View All Skills</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Button>
      </ScrollReveal>
    </section>
  )
}
