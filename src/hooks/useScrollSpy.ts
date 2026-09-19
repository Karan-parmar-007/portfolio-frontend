import { useEffect, useState } from 'react'

export function useScrollSpy(sectionIds: string[], offset = 140): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(null)
      return
    }

    const onScroll = () => {
      // Check if user is near the bottom of page
      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50

      if (isAtBottom) {
        const lastId = sectionIds[sectionIds.length - 1]
        setActiveId(lastId ?? null)
        return
      }

      let current: string | null = null

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        // If the top of the element has reached above the offset
        if (rect.top <= offset) {
          current = id
        }
      }

      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionIds, offset])

  return activeId
}
