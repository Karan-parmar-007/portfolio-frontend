import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  createEducation,
  createSkill,
  createSkillCategory,
  createSocialLink,
  createWorkExperience,
  deleteContactMessage,
  deleteEducation,
  deleteProfileImage,
  deleteProfileResume,
  deleteSkill,
  deleteSkillCategory,
  deleteSkillIcon,
  deleteSocialLink,
  deleteWorkExperience,
  fetchAdminEducation,
  fetchAdminContactMessages,
  fetchAdminSkillCategories,
  fetchAdminSkills,
  fetchAdminSocialMedia,
  fetchAdminWorkExperience,
  reorderEducation,
  reorderSkillCategories,
  reorderSkills,
  reorderSocialMedia,
  reorderWorkExperience,
  updateEducation,
  updateContactMessage,
  updateProfile,
  updateSkill,
  updateSkillCategory,
  updateSocialLink,
  updateWorkExperience,
  uploadProfileImage,
  uploadProfileResume,
} from '@/api/adminPortfolio'
import { fetchProfile } from '@/api/portfolio'
import { getErrorDetail } from '@/lib/errors'
import { queryKeys } from '@/lib/queryKeys'
import type {
  EducationCreateRequest,
  EducationUpdateRequest,
  ProfileUpdateRequest,
  SkillCategoryCreateRequest,
  SkillCategoryUpdateRequest,
  SocialLinkCreateRequest,
  SocialLinkUpdateRequest,
  WorkExperienceCreateRequest,
  WorkExperienceUpdateRequest,
} from '@/types/portfolio'

function invalidateOverview(qc: ReturnType<typeof useQueryClient>) {
  void qc.invalidateQueries({ queryKey: queryKeys.overview })
}

export function useAdminProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdateRequest) => updateProfile(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.profile })
      invalidateOverview(qc)
      toast.success('Profile updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUploadProfileImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.profile })
      invalidateOverview(qc)
      toast.success('Profile image updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProfileImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => deleteProfileImage(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.profile })
      invalidateOverview(qc)
      toast.success('Profile image removed')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUploadProfileResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => uploadProfileResume(file),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.profile })
      invalidateOverview(qc)
      toast.success('Resume updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteProfileResume() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => deleteProfileResume(),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.profile })
      invalidateOverview(qc)
      toast.success('Resume removed')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useAdminEducation() {
  return useQuery({
    queryKey: queryKeys.education,
    queryFn: fetchAdminEducation,
  })
}

export function useCreateEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: EducationCreateRequest) => createEducation(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.education })
      invalidateOverview(qc)
      toast.success('Education added')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: EducationUpdateRequest
    }) => updateEducation(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.education })
      invalidateOverview(qc)
      toast.success('Education updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEducation(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.education })
      invalidateOverview(qc)
      toast.success('Education deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderEducation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderEducation(ids),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.education })
      invalidateOverview(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useAdminWorkExperience() {
  return useQuery({
    queryKey: queryKeys.workExperience,
    queryFn: fetchAdminWorkExperience,
  })
}

export function useCreateWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: WorkExperienceCreateRequest) =>
      createWorkExperience(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.workExperience })
      invalidateOverview(qc)
      toast.success('Experience added')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: WorkExperienceUpdateRequest
    }) => updateWorkExperience(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.workExperience })
      invalidateOverview(qc)
      toast.success('Experience updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWorkExperience(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.workExperience })
      invalidateOverview(qc)
      toast.success('Experience deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderWorkExperience() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderWorkExperience(ids),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.workExperience })
      invalidateOverview(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useAdminSocialMedia() {
  return useQuery({
    queryKey: queryKeys.socialMedia,
    queryFn: fetchAdminSocialMedia,
  })
}

export function useCreateSocialLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SocialLinkCreateRequest) => createSocialLink(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.socialMedia })
      invalidateOverview(qc)
      toast.success('Social link added')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateSocialLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SocialLinkUpdateRequest
    }) => updateSocialLink(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.socialMedia })
      invalidateOverview(qc)
      toast.success('Social link updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteSocialLink() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSocialLink(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.socialMedia })
      invalidateOverview(qc)
      toast.success('Social link deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderSocialMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderSocialMedia(ids),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.socialMedia })
      invalidateOverview(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useAdminSkillCategories() {
  return useQuery({
    queryKey: queryKeys.skillCategories,
    queryFn: fetchAdminSkillCategories,
  })
}

export function useAdminSkills() {
  return useQuery({
    queryKey: queryKeys.skills,
    queryFn: fetchAdminSkills,
  })
}

export function useCreateSkillCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkillCategoryCreateRequest) =>
      createSkillCategory(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      invalidateOverview(qc)
      toast.success('Category added')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateSkillCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: SkillCategoryUpdateRequest
    }) => updateSkillCategory(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      invalidateOverview(qc)
      toast.success('Category updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteSkillCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSkillCategory(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      invalidateOverview(qc)
      toast.success('Category deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderSkillCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderSkillCategories(ids),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      invalidateOverview(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useCreateSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (form: FormData) => createSkill(form),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      invalidateOverview(qc)
      toast.success('Skill added')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useUpdateSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updateSkill(id, form),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      invalidateOverview(qc)
      toast.success('Skill updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteSkill() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSkill(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      invalidateOverview(qc)
      toast.success('Skill deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteSkillIcon() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSkillIcon(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      invalidateOverview(qc)
      toast.success('Icon removed')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useReorderSkills() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => reorderSkills(ids),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.skills })
      void qc.invalidateQueries({ queryKey: queryKeys.skillCategories })
      invalidateOverview(qc)
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useAdminContactMessages(query: {
  page: number
  page_size: number
}) {
  return useQuery({
    queryKey: queryKeys.adminContactMessages(query),
    queryFn: () => fetchAdminContactMessages(query),
  })
}

export function useUpdateContactMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, is_read }: { id: string; is_read: boolean }) =>
      updateContactMessage(id, { is_read }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
      toast.success('Message updated')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}

export function useDeleteContactMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteContactMessage(id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })
      toast.success('Message deleted')
    },
    onError: (error) => toast.error(getErrorDetail(error)),
  })
}
