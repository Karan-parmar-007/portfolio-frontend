import { useMemo } from 'react'
import {
  useAdminEducation,
  useAdminProfile,
  useAdminSkills,
  useAdminSocialMedia,
  useAdminWorkExperience,
} from '@/hooks/useAdminPortfolioMutations'
import { useAdminProjects } from '@/hooks/useAdminProjectMutations'
import { SOCIAL_PLATFORMS } from '@/lib/socialIcons'

export function useAdminPortfolioQueriesBundle() {
  const profileQuery = useAdminProfile()
  const educationQuery = useAdminEducation()
  const experienceQuery = useAdminWorkExperience()
  const socialsQuery = useAdminSocialMedia()
  const projectsQuery = useAdminProjects('')
  const skillsQuery = useAdminSkills()

  const profile = profileQuery.data
  const education = educationQuery.data ?? []
  const experience = experienceQuery.data ?? []
  const socials = socialsQuery.data ?? []
  const projects = projectsQuery.data ?? []
  const skills = skillsQuery.data ?? []

  const attention = useMemo(() => {
    const knownPlatforms = new Set<string>(SOCIAL_PLATFORMS)
    const socialList = socialsQuery.data ?? []
    const items: string[] = []
    if (profile) {
      if (!profile.profile_image) items.push('Profile has no image')
      if (!profile.resume) items.push('Profile has no resume')
      if (!profile.about) items.push('About text is empty')
    } else {
      items.push('Profile has not been created yet')
    }
    for (const social of socialList) {
      if (!knownPlatforms.has(String(social.platform).toLowerCase())) {
        items.push(`Social link "${social.label}" uses unknown platform`)
      }
    }
    return items
  }, [profile, socialsQuery.data])

  return {
    profile,
    education,
    experience,
    socials,
    projects,
    skills,
    attention,
  }
}
