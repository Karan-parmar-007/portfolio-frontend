import { apiClient } from '@/lib/apiClient'
import type { ItemsResponse } from '@/types/api'
import type {
  ProjectDetail,
  ProjectStatus,
  ProjectSummary,
  ProjectTag,
  ProjectUpdateRequest,
  ProjectWriteRequest,
} from '@/types/project'

export async function fetchAdminProjects(q?: string): Promise<ProjectSummary[]> {
  const { data } = await apiClient.get<ItemsResponse<ProjectSummary>>(
    '/admin/projects',
    { params: q ? { q } : undefined },
  )
  return data.items
}

export async function fetchAdminProject(id: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ProjectDetail>(`/admin/projects/${id}`)
  return data
}

export async function createProject(
  payload: ProjectWriteRequest,
): Promise<ProjectDetail> {
  const { data } = await apiClient.post<ProjectDetail>('/admin/projects', payload)
  return data
}

export async function updateProject(
  id: string,
  payload: ProjectUpdateRequest,
): Promise<ProjectDetail> {
  const { data } = await apiClient.put<ProjectDetail>(`/admin/projects/${id}`, payload)
  return data
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}`)
}

export async function setProjectFeatured(
  id: string,
  isFeatured: boolean,
): Promise<ProjectDetail> {
  const { data } = await apiClient.patch<ProjectDetail>(
    `/admin/projects/${id}/featured`,
    { is_featured: isFeatured },
  )
  return data
}

export async function setProjectStatus(
  id: string,
  status: ProjectStatus,
): Promise<ProjectDetail> {
  const { data } = await apiClient.patch<ProjectDetail>(
    `/admin/projects/${id}/status`,
    { status },
  )
  return data
}

export async function reorderProjects(ids: string[]): Promise<ProjectSummary[]> {
  const { data } = await apiClient.patch<ItemsResponse<ProjectSummary>>(
    '/admin/projects/reorder',
    { ids },
  )
  return data.items
}

export async function uploadProjectCover(
  id: string,
  file: File,
): Promise<ProjectDetail> {
  const form = new FormData()
  form.append('file', file)
  const { data } = await apiClient.put<ProjectDetail>(
    `/admin/projects/${id}/cover`,
    form,
  )
  return data
}

export async function deleteProjectCover(id: string): Promise<ProjectDetail> {
  const { data } = await apiClient.delete<ProjectDetail>(`/admin/projects/${id}/cover`)
  return data
}

export async function fetchProjectTags(): Promise<ProjectTag[]> {
  const { data } = await apiClient.get<ItemsResponse<ProjectTag>>('/admin/project-tags')
  return data.items
}

export async function createProjectTag(name: string): Promise<ProjectTag> {
  const { data } = await apiClient.post<ProjectTag>('/admin/project-tags', { name })
  return data
}

export async function deleteProjectTag(id: string): Promise<void> {
  await apiClient.delete(`/admin/project-tags/${id}`)
}
