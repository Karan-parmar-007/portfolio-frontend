const APPS_FRONTEND_URL = (
  import.meta.env.VITE_APPS_FRONTEND_URL || 'https://app.karanparmar.in'
).replace(/\/$/, '')

export function appsHomeUrl(): string {
  return APPS_FRONTEND_URL
}

export function appsUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const normalised = path.startsWith('/') ? path : `/${path}`
  return `${APPS_FRONTEND_URL}${normalised}`
}

export function projectPublicUrl(project: {
  slug: string
  is_live: boolean
  live_url: string | null
}): string {
  if (project.is_live) {
    if (project.live_url) return appsUrl(project.live_url)
    return appsUrl(`/apps/${project.slug}`)
  }
  return appsUrl(`/projects/${project.slug}`)
}
