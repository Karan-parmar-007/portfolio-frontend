import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { IntroLoader } from '@/components/common/IntroLoader'
import { ScrollToTop } from '@/components/common/ScrollToTop'
import { useOverview } from '@/hooks/usePortfolioQueries'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { buildNavSections } from '@/lib/sections'
import { EmailRail } from './EmailRail'
import { Footer } from './Footer'
import { Nav } from './Nav'
import { SocialRail } from './SocialRail'

export function SiteLayout() {
  const location = useLocation()
  const reduced = usePrefersReducedMotion()
  const isHome = location.pathname === '/'
  const [introDone, setIntroDone] = useState(() => !isHome || reduced)
  const { data } = useOverview()

  const onIntroComplete = useCallback(() => setIntroDone(true), [])

  useEffect(() => {
    if (reduced) {
      setIntroDone(true)
      return
    }
    setIntroDone(!isHome)
  }, [isHome, reduced])

  const sections = buildNavSections({
    hasAbout: Boolean(
      data?.profile.about || (data?.about_skills.length ?? 0) > 0,
    ),
    hasExperience: (data?.work_experience.length ?? 0) > 0,
    hasEducation: (data?.education.length ?? 0) > 0,
    hasProjects:
      (data?.featured_projects.length ?? 0) > 0 ||
      (data?.project_count ?? 0) > 0,
    hasSkills: (data?.skill_categories.length ?? 0) > 0,
    hasContact: Boolean(data?.profile.email),
  })

  const railSocials =
    data?.social_media.filter((s) => s.show_in_rail) ?? data?.social_media ?? []

  const letter = data?.profile.name?.trim()?.[0] ?? 'K'

  if (isHome && !introDone && !reduced) {
    return <IntroLoader letter={letter} onLoadComplete={onIntroComplete} />
  }

  return (
    <div className="relative min-h-screen bg-navy text-lightest-slate">
      <Nav
        sections={sections}
        profileName={data?.profile.name}
        resume={data?.profile.resume ?? null}
        animateIn={isHome}
      />
      <SocialRail links={railSocials} animateIn={isHome} />
      <EmailRail email={data?.profile.email} animateIn={isHome} />
      <main className="w-full px-6 sm:px-10 md:px-16 lg:px-24 xl:px-32 2xl:px-40 pt-28 pb-16">
        <Outlet context={{ sections, animateIn: isHome }} />
      </main>
      <Footer name={data?.profile.name} socials={railSocials} />
      <ScrollToTop />
    </div>
  )
}
