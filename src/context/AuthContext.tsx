import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSession, logout as logoutRequest } from '@/api/auth'
import { queryKeys } from '@/lib/queryKeys'
import type { SessionResponse } from '@/types/auth'

interface AuthState {
  session: SessionResponse | null
  isLoading: boolean
  isOwner: boolean
  logout: () => Promise<void>
  refetch: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

const anonymousSession: SessionResponse = {
  authenticated: false,
  is_owner: false,
  email: null,
  user_id: null,
  role_name: null,
  name: null,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [bootstrapped, setBootstrapped] = useState(false)

  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: fetchSession,
    staleTime: 60_000,
    retry: false,
  })

  useEffect(() => {
    if (!sessionQuery.isLoading) {
      setBootstrapped(true)
    }
  }, [sessionQuery.isLoading])

  useEffect(() => {
    const onUnauthenticated = () => {
      queryClient.setQueryData(queryKeys.session, anonymousSession)
    }
    window.addEventListener('portfolio:unauthenticated', onUnauthenticated)
    return () =>
      window.removeEventListener('portfolio:unauthenticated', onUnauthenticated)
  }, [queryClient])

  const logout = useCallback(async () => {
    try {
      await logoutRequest()
    } catch {
      // clear local session even if SSO proxy fails
    }
    queryClient.setQueryData(queryKeys.session, anonymousSession)
    queryClient.clear()
  }, [queryClient])

  const refetch = useCallback(async () => {
    await sessionQuery.refetch()
  }, [sessionQuery])

  const session = sessionQuery.data ?? null

  const value = useMemo<AuthState>(
    () => ({
      session,
      isLoading: !bootstrapped || sessionQuery.isLoading,
      isOwner: Boolean(session?.authenticated && session.is_owner),
      logout,
      refetch,
    }),
    [bootstrapped, session, sessionQuery.isLoading, logout, refetch],
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
