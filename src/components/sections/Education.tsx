import { GraduationCap } from 'lucide-react'
import { NumberedHeading } from '@/components/common/NumberedHeading'
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/common/FadeIn'
import { formatYearRange } from '@/lib/date'
import type { Education } from '@/types/portfolio'

export function EducationSection({
  items,
  number,
}: {
  items: Education[]
  number: string
}) {
  if (items.length === 0) return null

  return (
    <section id="education" className="scroll-mt-24 py-20">
      <ScrollReveal>
        <NumberedHeading number={number} title="Education" id="education-heading" />
      </ScrollReveal>
      <ScrollStagger delay={0.1} className="mt-10 grid gap-6">
        {items.map((item) => (
          <ScrollStaggerItem key={item.id}>
            <article
              className="rounded-lg border border-navy-border bg-light-navy p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-green/30 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-green-tint text-green">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <h3 className="text-xl font-bold text-lightest-slate">
                        {item.degree}
                        {item.field_of_study ? `, ${item.field_of_study}` : ''}
                      </h3>
                      <p className="text-sm font-medium text-green">{item.school}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-mono text-xs text-light-slate">
                        {formatYearRange(item.start_year, item.end_year)}
                      </p>
                      {item.score !== null && item.score_label ? (
                        <p className="mt-1 font-mono text-xs font-medium text-green">
                          {item.score} {item.score_label}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  {item.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-slate">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          </ScrollStaggerItem>
        ))}
      </ScrollStagger>
    </section>
  )
}
