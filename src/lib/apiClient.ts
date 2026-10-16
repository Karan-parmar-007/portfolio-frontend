import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'
import { env } from './env'
import { currentPath, isProtectedPath, sso } from './sso'

const rawUrl = env.PORTFOLIO_API_URL.replace(/\/+$/, '')
const normalizedBaseUrl = rawUrl.endsWith('/api/portfolio')
  ? rawUrl
  : rawUrl.endsWith('/api')
    ? `${rawUrl}/portfolio`
    : rawUrl

/** Fired when an API 401 could not be recovered by refreshing the SSO session. */
export const SIGNED_OUT_EVENT = 'portfolio:unauthenticated'

const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

export const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
  withCredentials: true,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase()

  if (method && MUTATING_METHODS.includes(method)) {
    if (!(config.data instanceof FormData) && !config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json'
    }
    const csrf = sso.csrfToken()
    if (csrf) {
      config.headers['X-CSRF-Token'] = csrf
    }
  }

  return config
})

// Single-flight: concurrent 401s share one SSO session refresh.
let refreshPromise: Promise<boolean> | null = null

function refreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = sso.refresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined

    if (
      !originalRequest ||
      error.response?.status !== 401 ||
      originalRequest._retry
    ) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    let signedIn: boolean
    try {
      signedIn = await refreshSession()
    } catch {
      // SSO unreachable: keep the current UI state, surface the original error.
      return Promise.reject(error)
    }

    if (signedIn) {
      return apiClient(originalRequest)
    }

    window.dispatchEvent(new CustomEvent(SIGNED_OUT_EVENT))
    if (isProtectedPath(window.location.pathname)) {
      sso.redirectToLogin(currentPath())
    }
    return Promise.reject(error)
  },
)
