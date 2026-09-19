import type { ReactNode } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ReorderList<T extends { id: string }>({
  items,
  onReorder,
  renderItem,
  getLabel,
}: {
  items: T[]
  onReorder: (ids: string[]) => void
  renderItem: (item: T, index: number) => ReactNode
  getLabel: (item: T) => string
}) {
  const move = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return
    const next = [...items]
    const current = next[index]
    const swap = next[nextIndex]
    if (!current || !swap) return
    next[index] = swap
    next[nextIndex] = current
    onReorder(next.map((item) => item.id))
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="flex items-center gap-2 rounded border border-lightest-navy bg-navy/30 p-2"
        >
          <div className="flex flex-col">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move ${getLabel(item)} up`}
              disabled={index === 0}
              onClick={() => move(index, -1)}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Move ${getLabel(item)} down`}
              disabled={index === items.length - 1}
              onClick={() => move(index, 1)}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="min-w-0 flex-1">{renderItem(item, index)}</div>
        </li>
      ))}
    </ul>
  )
}
