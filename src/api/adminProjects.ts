import { apiClient } from '@/lib/apiClient'
import type { ItemsResponse, Paginated } from '@/types/api'
import type {
  AccessLevel,
  AdminProjectQuery,
  ProjectDetail,
} from '@/types/project'

export async function fetchAdminProjects(
  query: AdminProjectQuery = {},
): Promise<Paginated<ProjectDetail>> {
  const { data } = await apiClient.get<Paginated<ProjectDetail>>(
    '/admin/projects',
    {
      params: {
        page: query.page,
        page_size: query.page_size,
        q: query.q || undefined,
      },
    },
  )
  return data
}

export async function fetchAdminProject(id: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ProjectDetail>(`/admin/projects/${id}`)
  return data
}

export async function createProject(form: FormData): Promise<ProjectDetail> {
  const { data } = await apiClient.post<ProjectDetail>('/admin/projects', form)
  return data
}

export async function updateProject(
  id: string,
  form: FormData,
): Promise<ProjectDetail> {
  const { data } = await apiClient.put<ProjectDetail>(
    `/admin/projects/${id}`,
    form,
  )
  return data
}

export async function deleteProject(id: string): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}`)
}

export async function deleteProjectCover(id: string): Promise<void> {
  await apiClient.delete(`/admin/projects/${id}/cover`)
}

export async function setProjectFeatured(
  id: string,
  is_featured: boolean,
): Promise<ProjectDetail> {
  const { data } = await apiClient.patch<ProjectDetail>(
    `/admin/projects/${id}/featured`,
    { is_featured },
  )
  return data
}

export async function reorderProjects(ids: string[]): Promise<ProjectDetail[]> {
  const { data } = await apiClient.patch<ItemsResponse<ProjectDetail>>(
    '/admin/projects/reorder',
    { ids },
  )
  return data.items
}

export async function fetchAdminAccessLevels(): Promise<AccessLevel[]> {
  const { data } = await apiClient.get<ItemsResponse<AccessLevel>>(
    '/admin/access-levels',
  )
  return data.items
}

export async function createAccessLevel(payload: {
  name: string
  description?: string | null
  is_public: boolean
}): Promise<AccessLevel> {
  const { data } = await apiClient.post<AccessLevel>(
    '/admin/access-levels',
    payload,
  )
  return data
}

export async function updateAccessLevel(
  id: string,
  payload: {
    name?: string
    description?: string | null
    is_public?: boolean
  },
): Promise<AccessLevel> {
  const { data } = await apiClient.put<AccessLevel>(
    `/admin/access-levels/${id}`,
    payload,
  )
  return data
}

export async function deleteAccessLevel(id: string): Promise<void> {
  await apiClient.delete(`/admin/access-levels/${id}`)
}
