import type { MediaRef } from '@/types/media'
import { env } from './env'

export function mediaUrl(ref: MediaRef | null | undefined): string | undefined {
  if (!ref) return undefined
  return new URL(ref.url, env.PORTFOLIO_API_ORIGIN).toString()
}

/** Same file, served as an attachment saved under `name` (extension kept by the API). */
export function mediaDownloadUrl(
  ref: MediaRef | null | undefined,
  name: string,
): string | undefined {
  const url = mediaUrl(ref)
  if (!url) return undefined
  return `${url}/download?name=${encodeURIComponent(name)}`
}
