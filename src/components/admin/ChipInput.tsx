import { useId, useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/input'

/** Free-text chips (tech stack, tags) with optional suggestions; Enter or comma adds. */
export function ChipInput({
  value,
  onChange,
  suggestions = [],
  placeholder,
  maxItems,
  maxLength = 50,
}: {
  value: string[]
  onChange: (value: string[]) => void
  suggestions?: string[]
  placeholder?: string
  maxItems?: number
  maxLength?: number
}) {
  const [draft, setDraft] = useState('')
  const listId = useId()
  const lower = new Set(value.map((v) => v.toLowerCase()))
  const full = maxItems !== undefined && value.length >= maxItems

  const add = (raw: string) => {
    const next = raw.trim()
    if (!next || full || lower.has(next.toLowerCase())) return
    onChange([...value, next.slice(0, maxLength)])
    setDraft('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      add(draft)
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="space-y-2">
      {value.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-1 rounded-full border border-green/30 bg-green-tint px-2.5 py-0.5 font-mono text-xs text-green"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(value.filter((v) => v !== item))}
                className="text-green/70 hover:text-green"
              >
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <Input
        value={draft}
        list={suggestions.length > 0 ? listId : undefined}
        maxLength={maxLength}
        disabled={full}
        placeholder={full ? `Limit of ${maxItems} reached` : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(draft)}
      />
      {suggestions.length > 0 ? (
        <datalist id={listId}>
          {suggestions
            .filter((s) => !lower.has(s.toLowerCase()))
            .map((s) => (
              <option key={s} value={s} />
            ))}
        </datalist>
      ) : null}
    </div>
  )
}
