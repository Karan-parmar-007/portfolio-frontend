import { useQuery } from '@tanstack/react-query'
import {
  fetchEducation,
  fetchOverview,
  fetchProfile,
  fetchSkillCategories,
  fetchSkills,
  fetchSocialMedia,
  fetchWorkExperience,
} from '@/api/portfolio'
import { queryKeys } from '@/lib/queryKeys'

export function useOverview() {
  return useQuery({
    queryKey: queryKeys.overview,
    queryFn: fetchOverview,
  })
}

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: fetchProfile,
  })
}

export function useEducation() {
  return useQuery({
    queryKey: queryKeys.education,
    queryFn: fetchEducation,
  })
}

export function useWorkExperience() {
  return useQuery({
    queryKey: queryKeys.workExperience,
    queryFn: fetchWorkExperience,
  })
}

export function useSkillCategories() {
  return useQuery({
    queryKey: queryKeys.skillCategories,
    queryFn: fetchSkillCategories,
  })
}

export function useSkills(params?: { category_id?: string; in_about?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.skills, params] as const,
    queryFn: () => fetchSkills(params),
  })
}

export function useSocialMedia(params?: { in_rail?: boolean }) {
  return useQuery({
    queryKey: [...queryKeys.socialMedia, params] as const,
    queryFn: () => fetchSocialMedia(params),
  })
}
