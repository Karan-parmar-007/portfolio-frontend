import { apiClient } from '@/lib/apiClient'
import type { ItemsResponse } from '@/types/api'
import type { MediaRef } from '@/types/media'
import type {
  Education,
  PortfolioOverview,
  Profile,
  Skill,
  SkillCategory,
  SocialLink,
  WorkExperience,
  ContactSubmitRequest,
} from '@/types/portfolio'

const appsApiUrl =
  import.meta.env.VITE_APPS_API_URL || 'http://localhost:8002/api/allprojects'

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function pick<T>(obj: Record<string, unknown>, ...keys: string[]): T | undefined {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key] as T
  }
  return undefined
}

function mapSkill(raw: Record<string, unknown>): Skill {
  const iconUrl = pick<string>(raw, 'icon_url', 'iconUrl')
  const icon: MediaRef | null = iconUrl
    ? {
        id: String(raw.id),
        url: iconUrl,
        filename: String(raw.name ?? 'icon'),
        content_type: 'image/png',
        width: null,
        height: null,
      }
    : null
  return {
    id: String(raw.id),
    name: String(raw.name),
    sequence: Number(raw.sequence ?? 0),
    category_id: pick<string | null>(raw, 'category_id', 'categoryId') ?? null,
    category_name: pick<string | null>(raw, 'category_name', 'categoryName') ?? null,
    show_in_about: Boolean(pick(raw, 'show_in_about', 'showInAbout')),
    icon,
  }
}

function mapSkillCategory(raw: Record<string, unknown>): SkillCategory {
  return {
    id: String(raw.id),
    name: String(raw.name),
    sequence: Number(raw.sequence ?? 0),
    show_on_home: Boolean(pick(raw, 'show_on_home', 'showOnHome')),
    skills: ((raw.skills as Record<string, unknown>[]) || []).map(mapSkill),
  }
}

async function fetchAppsJson(path: string): Promise<Record<string, unknown>> {
  const res = await fetch(`${appsApiUrl}${path}`)
  if (!res.ok) return { items: [] }
  return asRecord(await res.json())
}

export async function fetchOverview(): Promise<PortfolioOverview> {
  const { data } = await apiClient.get<PortfolioOverview>('/portfolio/overview')

  try {
    const [featuredRes, otherRes, homeSkillsRes, aboutSkillsRes] = await Promise.all([
      fetchAppsJson('/portfolio/featured'),
      fetchAppsJson('/portfolio/projects'),
      fetchAppsJson('/portfolio/skill-categories'),
      fetchAppsJson('/portfolio/about-skills'),
    ])

    const mapCard = (p: Record<string, unknown>) => {
      const statusSlug = String(pick(p, 'status') || '').toLowerCase()
      const statusLabel = statusSlug
        ? `${statusSlug.charAt(0).toUpperCase()}${statusSlug.slice(1)}`
        : ''
      return {
        id: String(p.id),
        name: String(p.name),
        slug: String(p.slug),
        short_description: String(
          pick(p, 'short_description', 'shortDescription') ?? '',
        ),
        sequence: Number(p.sequence ?? 0),
        is_featured: Boolean(pick(p, 'is_featured', 'isFeatured')),
        is_live: statusSlug === 'live',
        live_url: pick<string | null>(p, 'live_url', 'liveUrl') ?? null,
        github_link_backend: pick<string | null>(p, 'github_url', 'githubUrl') ?? null,
        github_link_frontend: null,
        cover_image: pick<string>(p, 'cover_image_url', 'coverImageUrl')
          ? {
              id: String(p.id),
              url: String(pick(p, 'cover_image_url', 'coverImageUrl')),
              filename: 'cover.jpg',
              content_type: 'image/jpeg',
              width: null,
              height: null,
            }
          : null,
        skills: ((pick<string[]>(p, 'tech_stack', 'techStack') ?? []) as string[]).map(
          (name: string) => ({
            id: name,
            name,
          }),
        ),
        access_level: {
          id: statusSlug || 'public',
          name: statusLabel || 'public',
        },
        created_at: '',
      }
    }

    data.featured_projects = ((featuredRes.items as Record<string, unknown>[]) || []).map(
      mapCard,
    )
    data.other_projects = ((otherRes.items as Record<string, unknown>[]) || []).map(
      mapCard,
    )
    data.skill_categories = (
      (homeSkillsRes.items as Record<string, unknown>[]) || []
    ).map(mapSkillCategory)
    data.about_skills = (
      (aboutSkillsRes.items as Record<string, unknown>[]) || []
    ).map(mapSkill)
  } catch (err) {
    console.error('Failed to fetch projects/skills from all_projects backend:', err)
    data.featured_projects = []
    data.other_projects = []
    data.skill_categories = []
    data.about_skills = []
  }

  return data
}

export async function fetchProfile(): Promise<Profile> {
  const { data } = await apiClient.get<Profile>('/portfolio/profile')
  return data
}

export async function fetchEducation(): Promise<Education[]> {
  const { data } = await apiClient.get<ItemsResponse<Education>>(
    '/portfolio/education',
  )
  return data.items
}

export async function fetchWorkExperience(): Promise<WorkExperience[]> {
  const { data } = await apiClient.get<ItemsResponse<WorkExperience>>(
    '/portfolio/work-experience',
  )
  return data.items
}

export async function fetchSkillCategories(): Promise<SkillCategory[]> {
  const data = await fetchAppsJson('/portfolio/skills')
  return ((data.items as Record<string, unknown>[]) || [])
    .filter((item) => item.id != null)
    .map(mapSkillCategory)
}

export async function fetchSkills(params?: {
  category_id?: string
  in_about?: boolean
}): Promise<Skill[]> {
  if (params?.in_about) {
    const data = await fetchAppsJson('/portfolio/about-skills')
    return ((data.items as Record<string, unknown>[]) || []).map(mapSkill)
  }
  const data = await fetchAppsJson('/portfolio/skills')
  const groups = (data.items as Record<string, unknown>[]) || []
  const skills = groups.flatMap((g) =>
    ((g.skills as Record<string, unknown>[]) || []).map(mapSkill),
  )
  if (params?.category_id) {
    return skills.filter((s) => s.category_id === params.category_id)
  }
  return skills
}

export async function fetchSocialMedia(params?: {
  in_rail?: boolean
}): Promise<SocialLink[]> {
  const { data } = await apiClient.get<ItemsResponse<SocialLink>>(
    '/portfolio/social-media',
    { params },
  )
  return data.items
}

export async function submitContact(
  payload: ContactSubmitRequest,
): Promise<{ message: string }> {
  const { data } = await apiClient.post<{ message: string }>('/contact', payload)
  return data
}
