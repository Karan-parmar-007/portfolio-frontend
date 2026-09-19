import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createAccessLevel,
  createProject,
  deleteAccessLevel,
  deleteProject,
  deleteProjectCover,
  fetchAdminAccessLevels,
  fetchAdminProject,
  fetchAdminProjects,
  reorderProjects,
  setProjectFeatured,
  updateAccessLevel,
  updateProject,
} from '@/api/adminProjects'
import { getErrorDetail } from '@/lib/errors'
import { queryKeys } from '@/lib/queryKeys'
import type { AdminProjectQuery } from '@/types/project'

function invalidateProjectCaches(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: ['projects'] })
  void qc.invalidateQueries({ queryKey: ['admin', 'projects'] })
  void qc.invalidateQueries({ queryKey: queryKeys.overview })
}

export function useAdminProjects(query: AdminProjectQuery) {
  return useQuery({
    queryKey: queryKeys.adminProjects(query),
    queryFn: () => fetchAdminProjects(query),
  })
}

export function useAdminProject(id: string | null) {
  return useQuery({
    queryKey: queryKeys.adminProject(id ?? ''),
    queryFn: () => {
      if (!id) {
        return Promise.reject(new Error('Missing project id'))
      }
      return fetchAdminProject(id)
    },
    enabled: Boolean(id),
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) => createProject(form),
    onSuccess: () => {
      invalidateProjectCaches(qc)
      toast.success('Project created')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updateProject(id, form),
    onSuccess: () => {
      invalidateProjectCaches(qc)
      toast.success('Project updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      invalidateProjectCaches(qc)
      toast.success('Project deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProjectCover() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProjectCover(id),
    onSuccess: () => {
      invalidateProjectCaches(qc)
      toast.success('Cover removed')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useSetProjectFeatured() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      setProjectFeatured(id, is_featured),
    onSuccess: () => {
      invalidateProjectCaches(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderProjects() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderProjects(ids),
    onSuccess: () => {
      invalidateProjectCaches(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useAdminAccessLevels() {
  return useQuery({
    queryKey: queryKeys.accessLevels,
    queryFn: fetchAdminAccessLevels,
  })
}

export function useCreateAccessLevel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: {
      name: string
      description?: string | null
      is_public: boolean
    }) => createAccessLevel(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.accessLevels })
      void qc.invalidateQueries({ queryKey: ['projects'] })
      void qc.invalidateQueries({ queryKey: queryKeys.overview })
      toast.success('Access level created')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateAccessLevel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: {
        name?: string
        description?: string | null
        is_public?: boolean
      }
    }) => updateAccessLevel(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.accessLevels })
      void qc.invalidateQueries({ queryKey: ['projects'] })
      void qc.invalidateQueries({ queryKey: queryKeys.overview })
      toast.success('Access level updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteAccessLevel() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteAccessLevel(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.accessLevels })
      void qc.invalidateQueries({ queryKey: ['projects'] })
      void qc.invalidateQueries({ queryKey: queryKeys.overview })
      toast.success('Access level deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}
