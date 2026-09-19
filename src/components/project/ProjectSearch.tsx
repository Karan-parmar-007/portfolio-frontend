import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { useProjectSuggestions } from '@/hooks/useProjectQueries'

export function ProjectSearch({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const debounced = useDebouncedValue(value, 300)
  const { data: suggestions = [] } = useProjectSuggestions(debounced)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={wrapRef} className="relative mb-6 max-w-md">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search projects…"
        aria-label="Search projects"
        aria-autocomplete="list"
      />
      {open && suggestions.length > 0 ? (
        <ul className="absolute z-20 mt-1 w-full overflow-hidden rounded border border-lightest-navy bg-light-navy shadow-lg">
          {suggestions.map((item) => (
            <li key={item.id}>
              <Link
                to={`/projects/${item.slug}`}
                className="block px-3 py-2 text-sm text-lightest-slate hover:bg-green-tint hover:text-green focus-visible:outline-none focus-visible:bg-green-tint"
                onClick={() => setOpen(false)}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
