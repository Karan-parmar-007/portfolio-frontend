import type { MediaRef } from './media'
import type { ProjectSummary } from './project'

export interface Profile {
  name: string
  headline: string | null
  hero_greeting: string | null
  about: string | null
  email: string
  phone: string | null
  location: string | null
  available_for_work: boolean
  profile_image: MediaRef | null
  resume: MediaRef | null
}

export interface Education {
  id: string
  sequence: number
  school: string
  degree: string
  field_of_study: string | null
  start_year: number
  end_year: number | null
  score: number | null
  score_label: string | null
  description: string | null
}

export interface WorkExperience {
  id: string
  sequence: number
  company: string
  company_url: string | null
  position: string
  location: string | null
  employment_type: string | null
  description: string[]
  start_date: string
  end_date: string | null
  is_current: boolean
}

export interface Skill {
  id: string
  name: string
  sequence: number
  category_id: string | null
  category_name: string | null
  show_in_about: boolean
  icon: MediaRef | null
}

export interface SkillCategory {
  id: string
  name: string
  sequence: number
  show_on_home: boolean
  skills: Skill[]
}

export type SocialPlatform =
  | 'github'
  | 'linkedin'
  | 'instagram'
  | 'twitter'
  | 'youtube'
  | 'codepen'
  | 'stackoverflow'
  | 'medium'
  | 'dribbble'
  | 'email'

export interface SocialLink {
  id: string
  platform: SocialPlatform | string
  label: string
  url: string
  sequence: number
  show_in_rail: boolean
}

export interface PortfolioOverview {
  profile: Profile
  education: Education[]
  work_experience: WorkExperience[]
  skill_categories: SkillCategory[]
  about_skills: Skill[]
  social_media: SocialLink[]
  featured_projects: ProjectSummary[]
  other_projects: ProjectSummary[]
}

export interface ProfileUpdateRequest {
  name?: string
  headline?: string | null
  hero_greeting?: string | null
  about?: string | null
  email?: string
  phone?: string | null
  location?: string | null
  available_for_work?: boolean
}

export interface EducationCreateRequest {
  school: string
  degree: string
  field_of_study?: string | null
  start_year: number
  end_year?: number | null
  score?: number | null
  score_label?: string | null
  description?: string | null
  sequence?: number
}

export type EducationUpdateRequest = Partial<EducationCreateRequest>

export interface WorkExperienceCreateRequest {
  company: string
  company_url?: string | null
  position: string
  location?: string | null
  employment_type?: string | null
  description: string[]
  start_date: string
  end_date?: string | null
  sequence?: number
}

export type WorkExperienceUpdateRequest = Partial<WorkExperienceCreateRequest>

export interface SocialLinkCreateRequest {
  platform: string
  label: string
  url: string
  show_in_rail?: boolean
  sequence?: number
}

export type SocialLinkUpdateRequest = Partial<SocialLinkCreateRequest>

export interface SkillCategoryCreateRequest {
  name: string
  sequence?: number
  show_on_home?: boolean
}

export type SkillCategoryUpdateRequest = Partial<SkillCategoryCreateRequest>

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface ContactSubmitRequest {
  name: string
  email: string
  phone?: string
  subject: string
  message?: string
}
