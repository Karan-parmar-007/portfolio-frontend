import { keepPreviousData, useQuery } from '@tanstack/react-query'
import {
  fetchAccessLevels,
  fetchFeaturedProjects,
  fetchLatestProjects,
  fetchProject,
  fetchProjectSuggestions,
  fetchProjects,
} from '@/api/projects'
import { queryKeys } from '@/lib/queryKeys'
import type { ProjectQuery } from '@/types/project'

export function useProjects(query: ProjectQuery) {
  return useQuery({
    queryKey: queryKeys.projects(query),
    queryFn: () => fetchProjects(query),
    placeholderData: keepPreviousData,
  })
}

export function useFeaturedProjects() {
  return useQuery({
    queryKey: queryKeys.featuredProjects,
    queryFn: fetchFeaturedProjects,
  })
}

export function useLatestProjects() {
  return useQuery({
    queryKey: queryKeys.latestProjects,
    queryFn: fetchLatestProjects,
  })
}

export function useProjectSuggestions(q: string) {
  return useQuery({
    queryKey: queryKeys.projectSuggestions(q),
    queryFn: () => fetchProjectSuggestions(q),
    enabled: q.trim().length >= 2,
  })
}

export function useProject(slug: string) {
  return useQuery({
    queryKey: queryKeys.project(slug),
    queryFn: () => fetchProject(slug),
    enabled: slug.length > 0,
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } }).response
        ?.status
      if (status === 404) return false
      return failureCount < 1
    },
  })
}

export function useAccessLevels() {
  return useQuery({
    queryKey: queryKeys.accessLevels,
    queryFn: fetchAccessLevels,
  })
}
