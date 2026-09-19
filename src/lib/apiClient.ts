import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { getCsrfToken } from './csrf'
import { env } from './env'

const rawUrl = env.PORTFOLIO_API_URL.replace(/\/+$/, '')
const normalizedBaseUrl = rawUrl.endsWith('/api/portfolio')
  ? rawUrl
  : rawUrl.endsWith('/api')
    ? `${rawUrl}/portfolio`
    : rawUrl

function apiOrigin(): string {
  try {
    return new URL(normalizedBaseUrl, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

/** SSO cookie path is /api/auth — refresh/logout must hit that prefix. */
export function ssoAuthUrl(path: string): string {
  const suffix = path.startsWith('/') ? path : `/${path}`
  return `${apiOrigin()}/api/auth${suffix}`
}

export const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  withCredentials: true,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase()

  if (
    method &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) &&
    !(config.data instanceof FormData)
  ) {
    if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
  }

  if (method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrf = getCsrfToken()
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf
    }
  }

  return config
})

let refreshPromise: Promise<void> | null = null

function isAuthLifecycle(config: InternalAxiosRequestConfig): boolean {
  const url = config.url ?? ''
  return (
    url.includes('/auth/session') ||
    url.includes('/auth/refresh') ||
    url.includes('/auth/logout')
  )
}

async function refreshViaPortfolio(): Promise<void> {
  const csrf = getCsrfToken()
  await axios.post(
    ssoAuthUrl('/refresh'),
    {},
    {
      withCredentials: true,
      headers: csrf ? { 'X-CSRF-Token': csrf } : undefined,
    },
  )
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    if (!originalRequest) {
      return Promise.reject(error)
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthLifecycle(originalRequest)
    ) {
      originalRequest._retry = true

      try {
        if (!refreshPromise) {
          refreshPromise = refreshViaPortfolio().finally(() => {
            refreshPromise = null
          })
        }
        await refreshPromise
        return apiClient(originalRequest)
      } catch (refreshError) {
        window.dispatchEvent(new CustomEvent('portfolio:unauthenticated'))
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
