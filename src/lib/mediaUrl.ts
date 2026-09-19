import type { MediaRef } from '@/types/media'
import { env } from './env'

export function mediaUrl(ref: MediaRef | null | undefined): string | undefined {
  if (!ref) return undefined
  return new URL(ref.url, env.PORTFOLIO_API_ORIGIN).toString()
}
