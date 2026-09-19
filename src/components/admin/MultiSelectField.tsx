import { cn } from '@/lib/cn'

export function MultiSelectField({
  options,
  value,
  onChange,
}: {
  options: Array<{ id: string; label: string; group?: string }>
  value: string[]
  onChange: (value: string[]) => void
}) {
  const groups = new Map<string, typeof options>()
  for (const option of options) {
    const group = option.group ?? 'Other'
    const list = groups.get(group) ?? []
    list.push(option)
    groups.set(group, list)
  }

  return (
    <div className="max-h-56 space-y-4 overflow-y-auto rounded border border-lightest-navy p-3">
      {[...groups.entries()].map(([group, opts]) => (
        <div key={group}>
          <p className="mb-2 font-mono text-xxs text-green">{group}</p>
          <div className="flex flex-wrap gap-2">
            {opts.map((opt) => {
              const active = value.includes(opt.id)
              return (
                <button
                  key={opt.id}
                  type="button"
                  className={cn(
                    'rounded border px-2 py-1 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
                    active
                      ? 'border-green bg-green-tint text-green'
                      : 'border-lightest-navy text-light-slate hover:border-green',
                  )}
                  onClick={() =>
                    onChange(
                      active
                        ? value.filter((id) => id !== opt.id)
                        : [...value, opt.id],
                    )
                  }
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
