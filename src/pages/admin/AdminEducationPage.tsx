import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminFormDialog } from '@/components/admin/AdminFormDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTable } from '@/components/admin/AdminTable'
import { ReorderList } from '@/components/admin/ReorderList'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminEducation,
  useCreateEducation,
  useDeleteEducation,
  useReorderEducation,
  useUpdateEducation,
} from '@/hooks/useAdminPortfolioMutations'
import { formatYearRange } from '@/lib/date'
import type { Education } from '@/types/portfolio'

const schema = z
  .object({
    school: z.string().min(1),
    degree: z.string().min(1),
    field_of_study: z.string().optional(),
    start_year: z.string().min(1),
    end_year: z.string().optional(),
    score: z.string().optional(),
    score_label: z.string().optional(),
    description: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    const start = Number(v.start_year)
    if (!Number.isFinite(start) || start < 1900) {
      ctx.addIssue({ code: 'custom', message: 'Invalid start year', path: ['start_year'] })
    }
    if (v.end_year) {
      const end = Number(v.end_year)
      if (!Number.isFinite(end) || end < start) {
        ctx.addIssue({
          code: 'custom',
          message: 'End year must be >= start year',
          path: ['end_year'],
        })
      }
    }
  })

type FormValues = z.infer<typeof schema>

export function AdminEducationPage() {
  const { data = [], isLoading } = useAdminEducation()
  const create = useCreateEducation()
  const update = useUpdateEducation()
  const remove = useDeleteEducation()
  const reorder = useReorderEducation()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Education | null>(null)
  const [deleting, setDeleting] = useState<Education | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      school: '',
      degree: '',
      field_of_study: '',
      start_year: String(new Date().getFullYear()),
      end_year: '',
      score: '',
      score_label: '',
      description: '',
    },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset({
      school: '',
      degree: '',
      field_of_study: '',
      start_year: String(new Date().getFullYear()),
      end_year: '',
      score: '',
      score_label: '',
      description: '',
    })
    setOpen(true)
  }

  const openEdit = (item: Education) => {
    setEditing(item)
    form.reset({
      school: item.school,
      degree: item.degree,
      field_of_study: item.field_of_study ?? '',
      start_year: String(item.start_year),
      end_year: item.end_year == null ? '' : String(item.end_year),
      score: item.score == null ? '' : String(item.score),
      score_label: item.score_label ?? '',
      description: item.description ?? '',
    })
    setOpen(true)
  }

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      school: values.school,
      degree: values.degree,
      field_of_study: values.field_of_study || null,
      start_year: Number(values.start_year),
      end_year: values.end_year ? Number(values.end_year) : null,
      score: values.score ? Number(values.score) : null,
      score_label: values.score_label || null,
      description: values.description || null,
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
      <Seo title="Admin — Education" />
      <AdminPageHeader
        title="Education"
        description="Ordered list shown on the public site."
        actionLabel="Add education"
        onAction={openCreate}
      />

      <ReorderList
        items={data}
        getLabel={(item) => item.school}
        onReorder={(ids) => reorder.mutate(ids)}
        renderItem={(item) => (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lightest-slate">
                {item.degree} · {item.school}
              </p>
              <p className="font-mono text-xs text-slate">
                {formatYearRange(item.start_year, item.end_year)}
              </p>
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

      <AdminTable
        isLoading={isLoading}
        columns={[
          { key: 'order', header: '#' },
          { key: 'degree', header: 'Degree' },
          { key: 'school', header: 'School' },
          { key: 'years', header: 'Years' },
          { key: 'score', header: 'Score' },
        ]}
        rows={data.map((item) => ({
          id: item.id,
          cells: {
            order: item.sequence,
            degree: item.degree,
            school: item.school,
            years: formatYearRange(item.start_year, item.end_year),
            score:
              item.score !== null && item.score_label
                ? `${item.score} ${item.score_label}`
                : '—',
          },
        }))}
      />

      <AdminFormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Edit education' : 'Add education'}
        dirty={form.formState.isDirty}
      >
        <form className="space-y-3" onSubmit={(e) => void onSubmit(e)}>
          <div className="space-y-1">
            <Label>School</Label>
            <Input {...form.register('school')} />
          </div>
          <div className="space-y-1">
            <Label>Degree</Label>
            <Input {...form.register('degree')} />
          </div>
          <div className="space-y-1">
            <Label>Field of study</Label>
            <Input {...form.register('field_of_study')} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Start year</Label>
              <Input type="number" {...form.register('start_year')} />
            </div>
            <div className="space-y-1">
              <Label>End year</Label>
              <Input type="number" {...form.register('end_year')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Score</Label>
              <Input type="number" step="0.01" {...form.register('score')} />
            </div>
            <div className="space-y-1">
              <Label>Score label</Label>
              <Select
                value={form.watch('score_label') || 'none'}
                onValueChange={(v) =>
                  form.setValue('score_label', v === 'none' ? '' : v, {
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Label" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="CGPA">CGPA</SelectItem>
                  <SelectItem value="GPA">GPA</SelectItem>
                  <SelectItem value="%">%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea {...form.register('description')} />
          </div>
          {form.formState.errors.end_year ? (
            <p className="text-xs text-slate">
              {form.formState.errors.end_year.message}
            </p>
          ) : null}
          <Button type="submit" size="sm">
            {editing ? 'Save' : 'Create'}
          </Button>
        </form>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete education"
        description={`Delete “${deleting?.degree ?? ''}” at ${deleting?.school ?? ''}?`}
        loading={remove.isPending}
        onConfirm={() => {
          if (!deleting) return
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </div>
  )
}
