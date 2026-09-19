import { apiClient, ssoAuthUrl } from '@/lib/apiClient'
import { getCsrfToken } from '@/lib/csrf'
import axios from 'axios'
import type { SessionResponse } from '@/types/auth'

export async function fetchSession(): Promise<SessionResponse> {
  const { data } = await apiClient.get<SessionResponse>('/auth/session')
  return data
}

export async function logout(): Promise<void> {
  const csrf = getCsrfToken()
  await axios.post(
    ssoAuthUrl('/logout'),
    {},
    {
      withCredentials: true,
      headers: csrf ? { 'X-CSRF-Token': csrf } : undefined,
    },
  )
}

export async function refreshAuth(): Promise<void> {
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
