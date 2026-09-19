import { apiClient } from '@/lib/apiClient'
import type { ItemsResponse, Paginated, ReorderRequest } from '@/types/api'
import type {
  Education,
  EducationCreateRequest,
  EducationUpdateRequest,
  Profile,
  ProfileUpdateRequest,
  Skill,
  SkillCategory,
  SkillCategoryCreateRequest,
  SkillCategoryUpdateRequest,
  SocialLink,
  SocialLinkCreateRequest,
  SocialLinkUpdateRequest,
  WorkExperience,
  WorkExperienceCreateRequest,
  WorkExperienceUpdateRequest,
  ContactMessage,
} from '@/types/portfolio'

export async function updateProfile(
  payload: ProfileUpdateRequest,
): Promise<Profile> {
  const { data } = await apiClient.put<Profile>('/admin/profile', payload)
  return data
}

export async function uploadProfileImage(file: File): Promise<Profile> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.put<Profile>('/admin/profile/image', form)
  return data
}

export async function deleteProfileImage(): Promise<void> {
  await apiClient.delete('/admin/profile/image')
}

export async function uploadProfileResume(file: File): Promise<Profile> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.put<Profile>('/admin/profile/resume', form)
  return data
}

export async function deleteProfileResume(): Promise<void> {
  await apiClient.delete('/admin/profile/resume')
}

export async function fetchAdminEducation(): Promise<Education[]> {
  const { data } = await apiClient.get<ItemsResponse<Education>>(
    '/admin/education',
  )
  return data.items
}

export async function createEducation(
  payload: EducationCreateRequest,
): Promise<Education> {
  const { data } = await apiClient.post<Education>('/admin/education', payload)
  return data
}

export async function updateEducation(
  id: string,
  payload: EducationUpdateRequest,
): Promise<Education> {
  const { data } = await apiClient.put<Education>(
    `/admin/education/${id}`,
    payload,
  )
  return data
}

export async function deleteEducation(id: string): Promise<void> {
  await apiClient.delete(`/admin/education/${id}`)
}

export async function reorderEducation(ids: string[]): Promise<Education[]> {
  const body: ReorderRequest = { ids }
  const { data } = await apiClient.patch<ItemsResponse<Education>>(
    '/admin/education/reorder',
    body,
  )
  return data.items
}

export async function fetchAdminWorkExperience(): Promise<WorkExperience[]> {
  const { data } = await apiClient.get<ItemsResponse<WorkExperience>>(
    '/admin/work-experience',
  )
  return data.items
}

export async function createWorkExperience(
  payload: WorkExperienceCreateRequest,
): Promise<WorkExperience> {
  const { data } = await apiClient.post<WorkExperience>(
    '/admin/work-experience',
    payload,
  )
  return data
}

export async function updateWorkExperience(
  id: string,
  payload: WorkExperienceUpdateRequest,
): Promise<WorkExperience> {
  const { data } = await apiClient.put<WorkExperience>(
    `/admin/work-experience/${id}`,
    payload,
  )
  return data
}

export async function deleteWorkExperience(id: string): Promise<void> {
  await apiClient.delete(`/admin/work-experience/${id}`)
}

export async function reorderWorkExperience(
  ids: string[],
): Promise<WorkExperience[]> {
  const body: ReorderRequest = { ids }
  const { data } = await apiClient.patch<ItemsResponse<WorkExperience>>(
    '/admin/work-experience/reorder',
    body,
  )
  return data.items
}

export async function fetchAdminSocialMedia(): Promise<SocialLink[]> {
  const { data } = await apiClient.get<ItemsResponse<SocialLink>>(
    '/admin/social-media',
  )
  return data.items
}

export async function createSocialLink(
  payload: SocialLinkCreateRequest,
): Promise<SocialLink> {
  const { data } = await apiClient.post<SocialLink>(
    '/admin/social-media',
    payload,
  )
  return data
}

export async function updateSocialLink(
  id: string,
  payload: SocialLinkUpdateRequest,
): Promise<SocialLink> {
  const { data } = await apiClient.put<SocialLink>(
    `/admin/social-media/${id}`,
    payload,
  )
  return data
}

export async function deleteSocialLink(id: string): Promise<void> {
  await apiClient.delete(`/admin/social-media/${id}`)
}

export async function reorderSocialMedia(ids: string[]): Promise<SocialLink[]> {
  const body: ReorderRequest = { ids }
  const { data } = await apiClient.patch<ItemsResponse<SocialLink>>(
    '/admin/social-media/reorder',
    body,
  )
  return data.items
}

export async function fetchAdminSkillCategories(): Promise<SkillCategory[]> {
  const { data } = await apiClient.get<ItemsResponse<SkillCategory>>(
    '/admin/skill-categories',
  )
  return data.items
}

export async function createSkillCategory(
  payload: SkillCategoryCreateRequest,
): Promise<SkillCategory> {
  const { data } = await apiClient.post<SkillCategory>(
    '/admin/skill-categories',
    payload,
  )
  return data
}

export async function updateSkillCategory(
  id: string,
  payload: SkillCategoryUpdateRequest,
): Promise<SkillCategory> {
  const { data } = await apiClient.put<SkillCategory>(
    `/admin/skill-categories/${id}`,
    payload,
  )
  return data
}

export async function deleteSkillCategory(id: string): Promise<void> {
  await apiClient.delete(`/admin/skill-categories/${id}`)
}

export async function reorderSkillCategories(
  ids: string[],
): Promise<SkillCategory[]> {
  const body: ReorderRequest = { ids }
  const { data } = await apiClient.patch<ItemsResponse<SkillCategory>>(
    '/admin/skill-categories/reorder',
    body,
  )
  return data.items
}

export async function fetchAdminSkills(): Promise<Skill[]> {
  const { data } = await apiClient.get<ItemsResponse<Skill>>('/admin/skills')
  return data.items
}

export async function createSkill(form: FormData): Promise<Skill> {
  const { data } = await apiClient.post<Skill>('/admin/skills', form)
  return data
}

export async function updateSkill(id: string, form: FormData): Promise<Skill> {
  const { data } = await apiClient.put<Skill>(`/admin/skills/${id}`, form)
  return data
}

export async function deleteSkill(id: string): Promise<void> {
  await apiClient.delete(`/admin/skills/${id}`)
}

export async function deleteSkillIcon(id: string): Promise<void> {
  await apiClient.delete(`/admin/skills/${id}/icon`)
}

export async function reorderSkills(ids: string[]): Promise<Skill[]> {
  const body: ReorderRequest = { ids }
  const { data } = await apiClient.patch<ItemsResponse<Skill>>(
    '/admin/skills/reorder',
    body,
  )
  return data.items
}

export async function fetchAdminContactMessages(params?: {
  page?: number
  page_size?: number
}): Promise<Paginated<ContactMessage>> {
  const { data } = await apiClient.get<Paginated<ContactMessage>>(
    '/admin/contact-messages',
    { params },
  )
  return data
}

export async function updateContactMessage(
  id: string,
  payload: { is_read: boolean },
): Promise<ContactMessage> {
  const { data } = await apiClient.patch<ContactMessage>(
    `/admin/contact-messages/${id}`,
    payload,
  )
  return data
}

export async function deleteContactMessage(id: string): Promise<void> {
  await apiClient.delete(`/admin/contact-messages/${id}`)
}
