import { apiClient } from '@/lib/apiClient'
import type { ItemsResponse } from '@/types/api'
import type {
  Education,
  PortfolioOverview,
  Profile,
  Skill,
  SkillCategory,
  SocialLink,
  WorkExperience,
  ContactSubmitRequest,
} from '@/types/portfolio'

export async function fetchOverview(): Promise<PortfolioOverview> {
  const { data } = await apiClient.get<PortfolioOverview>('/portfolio/overview')
  return data
}

export async function fetchProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>('/portfolio/profile')
  return data
}

export async function fetchEducation(): Promise<Education[]> {
  const { data } = await apiClient.get<ItemsResponse<Education>>(
    '/portfolio/education',
  )
  return data.items
}

export async function fetchWorkExperience(): Promise<WorkExperience[]> {
  const { data } = await apiClient.get<ItemsResponse<WorkExperience>>(
    '/portfolio/work-experience',
  )
  return data.items
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const { data } = await apiClient.get<ItemsResponse<SkillCategory>>(
    '/portfolio/skill-categories',
  )
  return data.items
}

export async function fetchSkills(params?: {
  category_id?: string
  in_about?: boolean
}): Promise<Skill[]> {
  const { data } = await apiClient.get<ItemsResponse<Skill>>('/portfolio/skills', {
    params,
  })
  return data.items
}

export async function fetchSocialMedia(params?: {
  in_rail?: boolean
}): Promise<SocialLink[]> {
  const { data } = await apiClient.get<ItemsResponse<SocialLink>>(
    '/portfolio/social-media',
    { params },
  )
  return data.items
}

export async function submitContact(
  payload: ContactSubmitRequest,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/contact', payload)
  return data
}
