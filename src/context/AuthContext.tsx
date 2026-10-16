import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useQuery,
  useQueryClient,
  type QueryClient,
} from '@tanstack/react-query'
import { SIGNED_OUT_EVENT } from '@/lib/apiClient'
import { queryKeys } from '@/lib/queryKeys'
import {
  ANONYMOUS,
  isOwner as isOwnerUser,
  sso,
  type SsoSession,
  type SsoUser,
} from '@/lib/sso'

interface AuthState {
  /** SSO session; `null` only while the first check is pending or after an SSO outage. */
  session: SsoSession | null
  user: SsoUser | null
  isLoading: boolean
  isAuthenticated: boolean
  /** UI only — the backend enforces owner access on every admin call. */
  isOwner: boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

/** Store the new session and drop data cached for the previous user. */
function applySession(queryClient: QueryClient, next: SsoSession): void {
  queryClient.setQueryData(queryKeys.session, next)
  const notSession = (query: { queryKey: readonly unknown[] }) =>
    query.queryKey[0] !== queryKeys.session[0]
  queryClient.removeQueries({ type: 'inactive', predicate: notSession })
  void queryClient.invalidateQueries({ type: 'active', predicate: notSession })
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()

  // sso.getSession() refreshes server-side, so an expired access token with a
  // live refresh cookie still resolves as signed in.
  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: () => sso.getSession(),
    staleTime: 60_000,
    retry: 1,
  })

  useEffect(() => {
    // Login/logout in another tab (or a session change noticed here).
    const unsubscribe = sso.onSessionChange((next) => applySession(queryClient, next))
    const onSignedOut = () => queryClient.setQueryData(queryKeys.session, ANONYMOUS)
    window.addEventListener(SIGNED_OUT_EVENT, onSignedOut)
    return () => {
      unsubscribe()
      window.removeEventListener(SIGNED_OUT_EVENT, onSignedOut)
    }
  }, [queryClient])

  const logout = useCallback(async () => {
    try {
      await sso.logout()
    } catch {
      // SSO always clears cookies; still sign out locally if it was unreachable.
    }
    applySession(queryClient, ANONYMOUS)
  }, [queryClient])

  const { refetch: refetchSession } = sessionQuery
  const refetch = useCallback(async () => {
    await refetchSession()
  }, [refetchSession])

  const session = sessionQuery.data ?? null
  const user = session?.authenticated ? session.user : null

  const value = useMemo<AuthState>(
    () => ({
      session,
      user,
      isLoading: sessionQuery.isPending,
      isAuthenticated: Boolean(session?.authenticated),
      isOwner: isOwnerUser(user),
      logout,
      refetch,
    }),
    [session, user, sessionQuery.isPending, logout, refetch],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

/**
 * Log out of SSO, clear cached data and land on the public home page.
 * Navigates first so protected pages unmount instead of redirecting to login.
 */
export function useLogout(): () => Promise<void> {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return useCallback(async () => {
    navigate('/', { replace: true })
    await logout()
  }, [logout, navigate])
}
