import type { AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

export function getErrorDetail(error: unknown, fallback = 'Something went wrong'): string {
  const axiosError = error as AxiosError<ApiError>
  const detail = axiosError.response?.data?.detail
  if (typeof detail === 'string' && detail.length > 0) return detail
  if (error instanceof Error && error.message) return error.message
  return fallback
}
