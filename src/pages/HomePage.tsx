import { useOutletContext } from 'react-router-dom'
import { ErrorState } from '@/components/common/ErrorState'
import { PageLoader } from '@/components/common/PageLoader'
import { Seo } from '@/components/common/Seo'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { EducationSection } from '@/components/sections/Education'
import { Experience } from '@/components/sections/Experience'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { Hero } from '@/components/sections/Hero'
import { OtherProjects } from '@/components/sections/OtherProjects'
import { SkillsSection } from '@/components/sections/SkillsSection'
import { useOverview } from '@/hooks/usePortfolioQueries'
import type { NavSection } from '@/lib/sections'

export function HomePage() {
  const { data, isLoading, isError, error, refetch } = useOverview()
  const { sections, animateIn } = useOutletContext<{
    sections: NavSection[]
    animateIn: boolean
  }>()

  const sectionNumber = (id: string) =>
    sections.find((s) => s.id === id)?.number ?? '01'

  if (isLoading) {
    return <PageLoader message="Loading portfolio..." />
  }

  if (isError || !data) {
    console.error(error)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <ErrorState
          message="Couldn't load portfolio data. Check that the API is running and CORS allows this origin."
          onRetry={() => void refetch()}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1000px]">
      <Seo
        title={`${data.profile.name} - Software Engineer`}
        description={data.profile.headline ?? data.profile.about ?? undefined}
      />
      <Hero profile={data.profile} animateIn={animateIn} />
      {(data.profile.about || data.about_skills.length > 0) && (
        <About
          profile={data.profile}
          skills={data.about_skills}
          number={sectionNumber('about')}
        />
      )}
      {data.work_experience.length > 0 && (
        <Experience
          items={data.work_experience}
          number={sectionNumber('experience')}
        />
      )}
      {data.education.length > 0 && (
        <EducationSection
          items={data.education}
          number={sectionNumber('education')}
        />
      )}
      {data.featured_projects.length > 0 && (
        <FeaturedProjects
          projects={data.featured_projects}
          number={sectionNumber('projects')}
        />
      )}
      {data.other_projects.length > 0 && (
        <OtherProjects projects={data.other_projects} />
      )}
      {data.skill_categories.length > 0 && (
        <SkillsSection
          categories={data.skill_categories}
          number={sectionNumber('skills')}
        />
      )}
      {data.profile.email ? (
        <Contact profile={data.profile} number={sectionNumber('contact')} />
      ) : null}
    </div>
  )
}
