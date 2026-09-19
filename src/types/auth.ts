export interface SsoUser {
  id: string
  email: string
  name: string | null
}

export interface SessionResponse {
  authenticated: boolean
  is_owner: boolean
  email: string | null
  user_id: string | null
  role_name: string | null
  name: string | null
}

export interface LoginResponse {
  user: SsoUser
  access_token_expires_in: number
}
