import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function BulletListField({
  value,
  onChange,
}: {
  value: string[]
  onChange: (value: string[]) => void
}) {
  return (
    <div className="space-y-2">
      {value.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => {
              const next = [...value]
              next[index] = e.target.value
              onChange(next)
            }}
            placeholder={`Bullet ${index + 1}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Remove bullet"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onChange([...value, ''])}
      >
        <Plus className="h-4 w-4" />
        Add bullet
      </Button>
    </div>
  )
}
