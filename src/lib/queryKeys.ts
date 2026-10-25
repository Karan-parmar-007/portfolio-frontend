import type { ProjectQuery } from '@/types/project'

export const queryKeys = {
  session: ['session'] as const,
  overview: ['portfolio', 'overview'] as const,
  profile: ['portfolio', 'profile'] as const,
  education: ['portfolio', 'education'] as const,
  workExperience: ['portfolio', 'work-experience'] as const,
  skillCategories: ['portfolio', 'skill-categories'] as const,
  skills: ['portfolio', 'skills'] as const,
  socialMedia: ['portfolio', 'social-media'] as const,
  /** Prefix for every public project query; invalidate after admin edits. */
  projectsRoot: ['projects'] as const,
  projects: (query: ProjectQuery) => ['projects', 'list', query] as const,
  projectFacets: ['projects', 'facets'] as const,
  project: (slug: string) => ['projects', 'detail', slug] as const,
  adminProjectsRoot: ['admin', 'projects'] as const,
  adminProjects: (q: string) => ['admin', 'projects', 'list', q] as const,
  adminProject: (id: string) => ['admin', 'projects', 'detail', id] as const,
  adminProjectTags: ['admin', 'project-tags'] as const,
  adminContactMessages: (query: { page: number; page_size: number }) =>
    ['admin', 'contact-messages', query] as const,
}
