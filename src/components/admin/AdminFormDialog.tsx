import type { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function AdminFormDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  dirty = false,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  dirty?: boolean
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && dirty) {
          const ok = window.confirm('Discard unsaved changes?')
          if (!ok) return
        }
        onOpenChange(next)
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
