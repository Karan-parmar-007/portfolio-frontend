import type { ChatConfig, ChatSurface } from '@/types/chatbot'

/**
 * The site assistant lives on the Studio backend, reached same-origin at /api/studio
 * (Caddy in prod, the Vite proxy in dev), so it does not go through apiClient.
 * The answer stream itself is read in components/chat/useNdjsonStream.ts.
 */
export async function fetchChatConfig(surface: ChatSurface): Promise<ChatConfig> {
  const response = await fetch(`/api/studio/chatbot/config?surface=${surface}`, {
    credentials: 'include',
  })
  if (!response.ok) throw new Error(`Assistant config failed (${response.status})`)
  return (await response.json()) as ChatConfig
}
