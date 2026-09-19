import { apiClient } from '@/lib/apiClient'
import type { ItemsResponse, Paginated } from '@/types/api'
import type {
  AccessLevel,
  ProjectDetail,
  ProjectQuery,
  ProjectSuggestion,
  ProjectSummary,
} from '@/types/project'

export async function fetchProjects(
  query: ProjectQuery = {},
): Promise<Paginated<ProjectSummary>> {
  const { data } = await apiClient.get<Paginated<ProjectSummary>>('/projects', {
    params: {
      page: query.page,
      page_size: query.page_size,
      q: query.q || undefined,
      skill_ids: query.skill_ids,
      category_id: query.category_id,
      is_live: query.is_live,
      sort: query.sort,
    },
    paramsSerializer: {
      indexes: null,
    },
  })
  return data
}

export async function fetchFeaturedProjects(): Promise<ProjectSummary[]> {
  const { data } = await apiClient.get<ItemsResponse<ProjectSummary>>(
    '/projects/featured',
  )
  return data.items
}

export async function fetchLatestProjects(): Promise<ProjectSummary[]> {
  const { data } = await apiClient.get<ItemsResponse<ProjectSummary>>(
    '/projects/latest',
  )
  return data.items
}

export async function fetchProjectSuggestions(
  q: string,
): Promise<ProjectSuggestion[]> {
  const { data } = await apiClient.get<ItemsResponse<ProjectSuggestion>>(
    '/projects/suggestions',
    { params: { q } },
  )
  return data.items
}

export async function fetchProject(slug: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ProjectDetail>(`/projects/${slug}`)
  return data
}

export async function fetchAccessLevels(): Promise<AccessLevel[]> {
  const { data } = await apiClient.get<ItemsResponse<AccessLevel>>(
    '/access-levels',
  )
  return data.items
}
