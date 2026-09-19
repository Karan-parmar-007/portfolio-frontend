import type { AdminProjectQuery, ProjectQuery } from '@/types/project'

export const queryKeys = {
  session: ['session'] as const,
  overview: ['portfolio', 'overview'] as const,
  profile: ['portfolio', 'profile'] as const,
  education: ['portfolio', 'education'] as const,
  workExperience: ['portfolio', 'work-experience'] as const,
  skillCategories: ['portfolio', 'skill-categories'] as const,
  skills: ['portfolio', 'skills'] as const,
  socialMedia: ['portfolio', 'social-media'] as const,
  accessLevels: ['access-levels'] as const,
  projects: (query: ProjectQuery) => ['projects', 'list', query] as const,
  featuredProjects: ['projects', 'featured'] as const,
  latestProjects: ['projects', 'latest'] as const,
  projectSuggestions: (q: string) => ['projects', 'suggestions', q] as const,
  project: (slug: string) => ['projects', 'detail', slug] as const,
  adminProjects: (query: AdminProjectQuery) =>
    ['admin', 'projects', query] as const,
  adminProject: (id: string) => ['admin', 'projects', 'detail', id] as const,
  adminContactMessages: (query: { page: number; page_size: number }) =>
    ['admin', 'contact-messages', query] as const,
}
