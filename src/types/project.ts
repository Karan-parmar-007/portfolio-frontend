import type { MediaRef } from './media'

export type ProjectStatus = 'live' | 'offline' | 'archived'

export const PROJECT_STATUSES: readonly ProjectStatus[] = ['live', 'offline', 'archived']

/** GET /portfolio/projects items (also the overview's project lists). */
export interface ProjectSummary {
  id: string
  name: string
  slug: string
  short_description: string
  status: ProjectStatus
  is_featured: boolean
  sequence: number
  github_url: string | null
  /** Exact Studio product page; public responses only include it while live. */
  try_url: string | null
  cover: MediaRef | null
  tech_stack: string[]
  tags: string[]
}

/** GET /portfolio/projects/{slug} and the admin detail. */
export interface ProjectDetail extends ProjectSummary {
  long_description: string
  created_at: string
  updated_at: string
}

export interface FacetCount {
  value: string
  count: number
}

/** GET /portfolio/project-facets */
export interface ProjectFacets {
  total: number
  statuses: FacetCount[]
  skills: FacetCount[]
  tags: FacetCount[]
}

export interface ProjectQuery {
  q?: string
  status?: ProjectStatus[]
  skill?: string
  tag?: string
  page?: number
  page_size?: number
}

export interface ProjectTag {
  id: string
  name: string
  project_count: number
}

export interface ProjectWriteRequest {
  name: string
  short_description: string
  long_description: string
  status: ProjectStatus
  is_featured: boolean
  github_url: string | null
  try_url: string | null
  tech_stack: string[]
  tags: string[]
}

export type ProjectUpdateRequest = Partial<ProjectWriteRequest>
