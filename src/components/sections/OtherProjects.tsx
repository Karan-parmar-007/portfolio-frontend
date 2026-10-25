import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollReveal, ScrollStagger, ScrollStaggerItem } from '@/components/common/FadeIn'
import { ProjectCard } from '@/components/project/ProjectCard'
import { Link } from 'react-router-dom'
import type { ProjectSummary } from '@/types/project'

export function OtherProjects({
  projects,
  totalCount,
}: {
  projects: ProjectSummary[]
  totalCount: number
}) {
  if (totalCount === 0) return null

  return (
    <section className="py-20">
      <ScrollReveal>
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-lightest-slate md:text-3xl">
            Other Noteworthy Projects
          </h2>
          <p className="font-mono text-sm text-green">
            archive of things I&apos;ve worked on
          </p>
        </div>
      </ScrollReveal>

      {projects.length > 0 ? (
        <ScrollStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ScrollStaggerItem key={project.id} className="h-full">
              <ProjectCard project={project} />
            </ScrollStaggerItem>
          ))}
        </ScrollStagger>
      ) : null}

      <ScrollReveal delay={0.2} className="mt-14 flex justify-center">
        <Button
          asChild
          className="group flex items-center gap-2 rounded border border-green bg-transparent px-8 py-5 font-mono text-sm text-green hover:bg-green-tint"
        >
          <Link to="/projects">
            <span>View all {totalCount} projects</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      </ScrollReveal>
    </section>
  )
}
