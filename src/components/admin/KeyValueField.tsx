import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function KeyValueField({
  value,
  onChange,
}: {
  value: Record<string, string>
  onChange: (value: Record<string, string>) => void
}) {
  const entries = Object.entries(value)

  const setEntries = (next: Array<[string, string]>) => {
    const obj: Record<string, string> = {}
    for (const [k, v] of next) {
      if (k.trim()) obj[k] = v
    }
    onChange(obj)
  }

  return (
    <div className="space-y-2">
      {entries.map(([key, val], index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={key}
            placeholder="Name"
            onChange={(e) => {
              const next = [...entries] as Array<[string, string]>
              next[index] = [e.target.value, val]
              setEntries(next)
            }}
          />
          <Input
            value={val}
            placeholder="Profile URL"
            onChange={(e) => {
              const next = [...entries] as Array<[string, string]>
              next[index] = [key, e.target.value]
              setEntries(next)
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove contributor"
            onClick={() => setEntries(entries.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setEntries([...entries, ['', '']])}
      >
        <Plus className="h-4 w-4" />
        Add contributor
      </Button>
    </div>
  )
}
