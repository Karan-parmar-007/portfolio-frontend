import type { MediaRef } from './media'

export type ProjectSort =
  | 'sequence'
  | 'newest'
  | 'oldest'
  | 'name'
  | 'relevance'

export interface AccessLevelSummary {
  id: string
  name: string
}

export interface AccessLevel {
  id: string
  name: string
  description: string | null
  is_public: boolean
  project_count?: number
}

export interface ProjectSkillSummary {
  id: string
  name: string
}

export interface ProjectSkillDetail extends ProjectSkillSummary {
  category_name: string | null
  icon: MediaRef | null
}

export interface ProjectSummary {
  id: string
  name: string
  slug: string
  short_description: string
  is_featured: boolean
  is_live: boolean
  live_url: string | null
  github_link_backend: string | null
  github_link_frontend: string | null
  sequence: number
  access_level: AccessLevelSummary
  cover_image: MediaRef | null
  skills: ProjectSkillSummary[]
  created_at: string
}

export interface ProjectDetail extends ProjectSummary {
  long_description: string
  docker_image_link_backend: string | null
  docker_image_link_frontend: string | null
  contributors: Record<string, string>
  skills: ProjectSkillDetail[]
  updated_at?: string
}

export interface ProjectSuggestion {
  id: string
  name: string
  slug: string
}

export interface ProjectQuery {
  page?: number
  page_size?: number
  q?: string
  skill_ids?: string[]
  category_id?: string
  is_live?: boolean
  sort?: ProjectSort
}

export interface AdminProjectQuery {
  page?: number
  page_size?: number
  q?: string
}
