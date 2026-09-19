import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminFormDialog } from '@/components/admin/AdminFormDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { BulletListField } from '@/components/admin/BulletListField'
import { ReorderList } from '@/components/admin/ReorderList'
import { Seo } from '@/components/common/Seo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useAdminWorkExperience,
  useCreateWorkExperience,
  useDeleteWorkExperience,
  useReorderWorkExperience,
  useUpdateWorkExperience,
} from '@/hooks/useAdminPortfolioMutations'
import { formatDateRange } from '@/lib/date'
import type { WorkExperience } from '@/types/portfolio'

const schema = z
  .object({
    company: z.string().min(1),
    company_url: z.string().url().optional().or(z.literal('')),
    position: z.string().min(1),
    location: z.string().optional(),
    employment_type: z.string().optional(),
    start_date: z.string().min(1),
    end_date: z.string().optional(),
    description: z.array(z.string()).min(1),
  })
  .refine(
    (v) =>
      !v.end_date ||
      v.end_date.length === 0 ||
      v.end_date >= v.start_date,
    { message: 'End date must be on or after start date', path: ['end_date'] },
  )
  .refine((v) => v.description.some((b) => b.trim().length > 0), {
    message: 'At least one bullet is required',
    path: ['description'],
  })

type FormValues = z.infer<typeof schema>

export function AdminExperiencePage() {
  const { data = [] } = useAdminWorkExperience()
  const create = useCreateWorkExperience()
  const update = useUpdateWorkExperience()
  const remove = useDeleteWorkExperience()
  const reorder = useReorderWorkExperience()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<WorkExperience | null>(null)
  const [deleting, setDeleting] = useState<WorkExperience | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      company: '',
      company_url: '',
      position: '',
      location: '',
      employment_type: '',
      start_date: '',
      end_date: '',
      description: [''],
    },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset({
      company: '',
      company_url: '',
      position: '',
      location: '',
      employment_type: '',
      start_date: '',
      end_date: '',
      description: [''],
    })
    setOpen(true)
  }

  const openEdit = (item: WorkExperience) => {
    setEditing(item)
    form.reset({
      company: item.company,
      company_url: item.company_url ?? '',
      position: item.position,
      location: item.location ?? '',
      employment_type: item.employment_type ?? '',
      start_date: item.start_date.slice(0, 10),
      end_date: item.end_date?.slice(0, 10) ?? '',
      description: item.description.length ? item.description : [''],
    })
    setOpen(true)
  }

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      company: values.company,
      company_url: values.company_url || null,
      position: values.position,
      location: values.location || null,
      employment_type: values.employment_type || null,
      start_date: values.start_date,
      end_date: values.end_date || null,
      description: values.description.map((b) => b.trim()).filter(Boolean),
    }
    if (editing) {
      update.mutate(
        { id: editing.id, payload },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      create.mutate(payload, { onSuccess: () => setOpen(false) })
    }
  })

  return (
    <div className="space-y-6">
      <Seo title="Admin — Experience" />
      <AdminPageHeader
        title="Experience"
        description="Sequence controls the tab order on the public site."
        actionLabel="Add experience"
        onAction={openCreate}
      />

      <ReorderList
        items={data}
        getLabel={(item) => item.company}
        onReorder={(ids) => reorder.mutate(ids)}
        renderItem={(item) => (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lightest-slate">
                {item.position} @ {item.company}
              </p>
              <p className="font-mono text-xs text-slate">
                {formatDateRange(item.start_date, item.end_date, item.is_current)}
                {' · '}
                {item.description.length} bullets
              </p>
              {item.is_current ? <Badge>Current</Badge> : null}
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => openEdit(item)}>
                Edit
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setDeleting(item)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      />

      <AdminFormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Edit experience' : 'Add experience'}
        dirty={form.formState.isDirty}
      >
        <form className="space-y-3" onSubmit={(e) => void onSubmit(e)}>
          <div className="space-y-1">
            <Label>Company</Label>
            <Input {...form.register('company')} />
          </div>
          <div className="space-y-1">
            <Label>Company URL</Label>
            <Input {...form.register('company_url')} />
          </div>
          <div className="space-y-1">
            <Label>Position</Label>
            <Input {...form.register('position')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Location</Label>
              <Input {...form.register('location')} />
            </div>
            <div className="space-y-1">
              <Label>Employment type</Label>
              <Input {...form.register('employment_type')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Start date</Label>
              <Input type="date" {...form.register('start_date')} />
            </div>
            <div className="space-y-1">
              <Label>End date</Label>
              <Input type="date" {...form.register('end_date')} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description bullets</Label>
            <Controller
              control={form.control}
              name="description"
              render={({ field }) => (
                <BulletListField value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <Button type="submit" size="sm">
            {editing ? 'Save' : 'Create'}
          </Button>
        </form>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete experience"
        description={`Delete “${deleting?.position ?? ''}” at ${deleting?.company ?? ''}?`}
        loading={remove.isPending}
        onConfirm={() => {
          if (!deleting) return
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </div>
  )
}
