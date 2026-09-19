export type SectionId =
  | 'about'
  | 'experience'
  | 'education'
  | 'projects'
  | 'skills'
  | 'contact'

export interface NavSection {
  id: SectionId
  label: string
  number: string
}

export function buildNavSections(flags: {
  hasAbout: boolean
  hasExperience: boolean
  hasEducation: boolean
  hasProjects: boolean
  hasSkills: boolean
  hasContact: boolean
}): NavSection[] {
  const candidates: Array<{ id: SectionId; label: string; enabled: boolean }> = [
    { id: 'about', label: 'About', enabled: flags.hasAbout },
    { id: 'experience', label: 'Experience', enabled: flags.hasExperience },
    { id: 'education', label: 'Education', enabled: flags.hasEducation },
    { id: 'projects', label: 'Projects', enabled: flags.hasProjects },
    { id: 'skills', label: 'Skills', enabled: flags.hasSkills },
    { id: 'contact', label: 'Contact', enabled: flags.hasContact },
  ]

  return candidates
    .filter((c) => c.enabled)
    .map((c, index) => ({
      id: c.id,
      label: c.label,
      number: String(index + 1).padStart(2, '0'),
    }))
}
