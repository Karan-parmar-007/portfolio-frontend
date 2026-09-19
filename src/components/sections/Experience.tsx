import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { NumberedHeading } from '@/components/common/NumberedHeading'
import { ScrollReveal } from '@/components/common/FadeIn'
import { formatDateRange } from '@/lib/date'
import { cn } from '@/lib/cn'
import type { WorkExperience } from '@/types/portfolio'

export function Experience({
  items,
  number,
}: {
  items: WorkExperience[]
  number: string
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [heights, setHeights] = useState<Record<string, string>>({})

  const measureHeights = () => {
    const next: Record<string, string> = {}
    for (const item of items) {
      const el = contentRefs.current[item.id]
      next[item.id] = el ? `${el.scrollHeight}px` : '0px'
    }
    setHeights(next)
  }

  useEffect(() => {
    measureHeights()
    const t = window.setTimeout(measureHeights, 300)
    const onResize = () => measureHeights()
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(t)
      window.removeEventListener('resize', onResize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  const toggle = (id: string) => {
    setActiveId((current) => (current === id ? null : id))
    window.requestAnimationFrame(() => measureHeights())
  }

  if (items.length === 0) return null

  return (
    <section id="experience" className="scroll-mt-24 py-20">
      <ScrollReveal>
        <NumberedHeading
          number={number}
          title="Where I've Worked"
          id="experience-heading"
        />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <div className="mt-8 flex flex-col gap-4">
          {items.map((work) => {
            const open = activeId === work.id
            return (
              <div
                key={work.id}
                className="overflow-hidden rounded-lg border border-navy-border bg-light-navy/60 transition-colors hover:border-green/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(work.id)}
                  aria-expanded={open}
                  className={cn(
                    'flex w-full items-center justify-between px-6 py-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
                    open ? 'bg-light-navy text-green' : 'text-light-slate hover:bg-light-navy/90 hover:text-green',
                  )}
                >
                  <div>
                    <div className="text-base font-semibold text-lightest-slate md:text-lg">
                      {work.position}
                      <span className="text-green">&nbsp;@&nbsp;</span>
                      {work.company_url ? (
                        <a
                          href={work.company_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {work.company}
                        </a>
                      ) : (
                        <span className="text-green">{work.company}</span>
                      )}
                    </div>
                    <div className="mt-1 font-mono text-xs text-light-slate">
                      {formatDateRange(
                        work.start_date,
                        work.end_date,
                        work.is_current,
                      )}
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-green transition-transform duration-300',
                      open && 'rotate-180',
                    )}
                  />
                </button>
                <div
                  ref={(el) => {
                    contentRefs.current[work.id] = el
                  }}
                  className="overflow-hidden px-6 text-slate transition-[max-height] duration-300"
                  style={{ maxHeight: open ? heights[work.id] || '1000px' : '0px' }}
                >
                  <ul className="list-none space-y-3 py-4 pl-2">
                    {work.description.map((bullet, i) => (
                      <li key={i} className="relative pl-6 leading-relaxed">
                        <span className="absolute left-0 text-green">▹</span>
                        <div className="break-words text-sm md:text-base">{bullet}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollReveal>
    </section>
  )
}
