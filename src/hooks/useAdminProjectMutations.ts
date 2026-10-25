import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createProject,
  createProjectTag,
  deleteProject,
  deleteProjectCover,
  deleteProjectTag,
  fetchAdminProject,
  fetchAdminProjects,
  fetchProjectTags,
  reorderProjects,
  setProjectFeatured,
  setProjectStatus,
  updateProject,
  uploadProjectCover,
} from '@/api/adminProjects'
import { getErrorDetail } from '@/lib/errors'
import { queryKeys } from '@/lib/queryKeys'
import type {
  ProjectStatus,
  ProjectUpdateRequest,
  ProjectWriteRequest,
} from '@/types/project'

/** Every project edit can change the home page, the public list and the admin list. */
function invalidateProjects(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: queryKeys.adminProjectsRoot })
  void qc.invalidateQueries({ queryKey: queryKeys.adminProjectTags })
  void qc.invalidateQueries({ queryKey: queryKeys.projectsRoot })
  void qc.invalidateQueries({ queryKey: queryKeys.overview })
}

export function useAdminProjects(q: string) {
  return useQuery({
    queryKey: queryKeys.adminProjects(q),
    queryFn: () => fetchAdminProjects(q || undefined),
  })
}

export function useAdminProject(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.adminProject(id ?? ''),
    queryFn: () => fetchAdminProject(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useProjectTags() {
  return useQuery({
    queryKey: queryKeys.adminProjectTags,
    queryFn: fetchProjectTags,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProjectWriteRequest) => createProject(payload),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Project created')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProjectUpdateRequest }) =>
      updateProject(id, payload),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Project saved')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Project deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useSetProjectFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      setProjectFeatured(id, isFeatured),
    onSuccess: (project) => {
      invalidateProjects(qc)
      toast.success(project.is_featured ? 'Featured' : 'No longer featured')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useSetProjectStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      setProjectStatus(id, status),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Status updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderProjects() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderProjects(ids),
    onSuccess: () => invalidateProjects(qc),
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUploadProjectCover() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadProjectCover(id, file),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Cover updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProjectCover() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProjectCover(id),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Cover removed')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useCreateProjectTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createProjectTag(name),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Tag created')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProjectTag() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProjectTag(id),
    onSuccess: () => {
      invalidateProjects(qc)
      toast.success('Tag deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}
