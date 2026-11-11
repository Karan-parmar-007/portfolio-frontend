// Shared with /home/karan/my_website/studio/frontend/src/chat: keep both copies in sync.
// This is the ONE file that is meant to differ between the two copies: it adapts the widget
// to each site (auth, config loading, styling). Every other file should stay identical.
import { useQuery } from '@tanstack/react-query'
import { fetchChatConfig } from '@/api/chatbot'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { env } from '@/lib/env'
import { queryKeys } from '@/lib/queryKeys'
import { currentPath, sso } from '@/lib/sso'
import type { ChatConfig } from './types'

export const SURFACE: 'studio' | 'portfolio' = 'portfolio'

/** Studio backend, same-origin: Caddy routes /api/studio/chatbot* there (the Vite proxy in dev). */
export const API_BASE = '/api/studio'

export function csrfToken(): string | null {
  return sso.csrfToken()
}

/** One silent session refresh after a 401. Never throws. */
export async function refreshSession(): Promise<boolean> {
  try {
    return await sso.refresh()
  } catch {
    return false
  }
}

export function loginUrl(): string {
  return sso.loginUrl(currentPath())
}

/** "Open in Studio" for a prepared search: the same playground path on this build's Studio URL. */
export function studioPath(openUrl: string, query: string): string {
  let path = '/products/gmaps/playground'
  try {
    path = new URL(openUrl).pathname
  } catch {
    /* keep the default */
  }
  return `${env.STUDIO_URL}${path}?${query}`
}

export function useReduced(): boolean {
  return usePrefersReducedMotion()
}

/** The assistant's config for this visitor. AuthContext refetches it on sign-in/out. */
export function useChatConfig(): ChatConfig | null {
  const { data } = useQuery({
    queryKey: queryKeys.chatbotConfig(SURFACE),
    queryFn: () => fetchChatConfig(SURFACE),
    staleTime: 5 * 60_000,
    retry: false,
  })
  return data ?? null
}

/** Class names that differ between the two design systems. */
export const tone = {
  solid: 'bg-green text-navy hover:bg-green/90',
  // Clear of the xl email rail; ScrollToTop sits just above.
  bubble: 'bottom-6 right-6 md:right-10 xl:right-24',
  panel: 'sm:bottom-24 sm:right-6 md:right-10 xl:right-24',
  /** Light text on the dark lightbox backdrop. */
  onDark: 'text-white',
  /** Behind figure images, most of which are drawn for a white page. */
  figureBg: 'bg-white',
}
