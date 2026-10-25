import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { fetchProject, fetchProjectFacets, fetchProjects } from '@/api/projects'
import { queryKeys } from '@/lib/queryKeys'
import type { ProjectQuery } from '@/types/project'

export function useProjects(query: ProjectQuery) {
  return useQuery({
    queryKey: queryKeys.projects(query),
    queryFn: () => fetchProjects(query),
    // Keep the current page on screen while the next filter/page loads.
    placeholderData: keepPreviousData,
  })
}

export function useProjectFacets() {
  return useQuery({
    queryKey: queryKeys.projectFacets,
    queryFn: fetchProjectFacets,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.project(slug),
    queryFn: () => fetchProject(slug),
    enabled: slug.length > 0,
    // A missing project will not appear on retry; show "doesn't exist" at once.
    retry: (failureCount, error) =>
      !(isAxiosError(error) && error.response?.status === 404) && failureCount < 1,
  })
}
