import type { AxiosError } from 'axios'
import type { ApiError } from '@/types/api'

export function getErrorDetail(error: unknown, fallback = 'Something went wrong'): string {
  const axiosError = error as AxiosError<ApiError>
  const detail: unknown = axiosError.response?.data?.detail
  if (typeof detail === 'string' && detail.length > 0) return detail
  // FastAPI request validation: [{ loc: [...], msg: '...' }, ...]
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item: unknown) =>
        item && typeof item === 'object' && 'msg' in item ? String(item.msg) : '',
      )
      .filter((msg) => msg.length > 0)
    if (messages.length > 0) return messages.join('; ')
  }
  if (error instanceof Error && error.message) return error.message
  return fallback
}
