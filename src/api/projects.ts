import { apiClient } from '@/lib/apiClient'
import type { Paginated } from '@/types/api'
import type {
  ProjectDetail,
  ProjectFacets,
  ProjectQuery,
  ProjectSummary,
} from '@/types/project'

export async function fetchProjects(
  query: ProjectQuery,
): Promise<Paginated<ProjectSummary>> {
  const { data } = await apiClient.get<Paginated<ProjectSummary>>(
    '/portfolio/projects',
    {
      params: query,
      // FastAPI reads repeated keys: status=live&status=archived
      paramsSerializer: { indexes: null },
    },
  )
  return data
}

export async function fetchProject(slug: string): Promise<ProjectDetail> {
  const { data } = await apiClient.get<ProjectDetail>(
    `/portfolio/projects/${encodeURIComponent(slug)}`,
  )
  return data
}

export async function fetchProjectFacets(): Promise<ProjectFacets> {
  const { data } = await apiClient.get<ProjectFacets>('/portfolio/project-facets')
  return data
}
