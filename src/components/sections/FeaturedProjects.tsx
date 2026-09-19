import { NumberedHeading } from '@/components/common/NumberedHeading'
import { ScrollReveal } from '@/components/common/FadeIn'
import { FeaturedProjectCard } from '@/components/project/FeaturedProjectCard'
import type { ProjectSummary } from '@/types/project'

export function FeaturedProjects({
  projects,
  number,
}: {
  projects: ProjectSummary[]
  number: string
}) {
  if (projects.length === 0) return null

  return (
    <section id="projects" className="scroll-mt-24 py-20">
      <ScrollReveal>
        <NumberedHeading
          number={number}
          title="Some Things I've Built"
          id="projects-heading"
          className="mb-16"
        />
      </ScrollReveal>
      <div className="space-y-24">
        {projects.map((project, index) => (
          <ScrollReveal key={project.id} delay={0.1}>
            <FeaturedProjectCard
              project={project}
              reverse={index % 2 === 1}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
