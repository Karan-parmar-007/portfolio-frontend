import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminFormDialog } from '@/components/admin/AdminFormDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
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
import { Switch } from '@/components/ui/switch'
import {
  useAdminSocialMedia,
  useCreateSocialLink,
  useDeleteSocialLink,
  useReorderSocialMedia,
  useUpdateSocialLink,
} from '@/hooks/useAdminPortfolioMutations'
import { getSocialIcon, SOCIAL_PLATFORMS } from '@/lib/socialIcons'
import type { SocialLink } from '@/types/portfolio'

const schema = z.object({
  platform: z.string().min(1),
  label: z.string().min(1),
  url: z.string().url(),
  show_in_rail: z.boolean(),
})

type FormValues = z.infer<typeof schema>

export function AdminSocialPage() {
  const { data = [] } = useAdminSocialMedia()
  const create = useCreateSocialLink()
  const update = useUpdateSocialLink()
  const remove = useDeleteSocialLink()
  const reorder = useReorderSocialMedia()

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<SocialLink | null>(null)
  const [deleting, setDeleting] = useState<SocialLink | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      platform: 'github',
      label: '',
      url: '',
      show_in_rail: true,
    },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset({
      platform: 'github',
      label: '',
      url: '',
      show_in_rail: true,
    })
    setOpen(true)
  }

  const openEdit = (item: SocialLink) => {
    setEditing(item)
    form.reset({
      platform: String(item.platform),
      label: item.label,
      url: item.url,
      show_in_rail: item.show_in_rail,
    })
    setOpen(true)
  }

  const onSubmit = form.handleSubmit((values) => {
    if (editing) {
      update.mutate(
        { id: editing.id, payload: values },
        { onSuccess: () => setOpen(false) },
      )
    } else {
      create.mutate(values, { onSuccess: () => setOpen(false) })
    }
  })

  return (
    <div className="space-y-6">
      <Seo title="Admin — Social" />
      <AdminPageHeader
        title="Social links"
        description="Links shown in the side rail and footer."
        actionLabel="Add link"
        onAction={openCreate}
      />

      <ReorderList
        items={data}
        getLabel={(item) => item.label}
        onReorder={(ids) => reorder.mutate(ids)}
        renderItem={(item) => {
          const Icon = getSocialIcon(String(item.platform))
          return (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 text-green" />
                <div>
                  <p className="text-lightest-slate">{item.label}</p>
                  <p className="font-mono text-xs text-slate">{item.platform}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={item.show_in_rail}
                  onCheckedChange={(v) =>
                    update.mutate({
                      id: item.id,
                      payload: { show_in_rail: v },
                    })
                  }
                  aria-label={`Show ${item.label} in rail`}
                />
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
          )
        }}
      />

      <AdminFormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? 'Edit social link' : 'Add social link'}
        dirty={form.formState.isDirty}
      >
        <form className="space-y-3" onSubmit={(e) => void onSubmit(e)}>
          <div className="space-y-1">
            <Label>Platform</Label>
            <Select
              value={form.watch('platform')}
              onValueChange={(v) =>
                form.setValue('platform', v, { shouldDirty: true })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOCIAL_PLATFORMS.map((platform) => {
                  const Icon = getSocialIcon(platform)
                  return (
                    <SelectItem key={platform} value={platform}>
                      <span className="inline-flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {platform}
                      </span>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Label</Label>
            <Input {...form.register('label')} />
          </div>
          <div className="space-y-1">
            <Label>URL</Label>
            <Input {...form.register('url')} />
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.watch('show_in_rail')}
              onCheckedChange={(v) =>
                form.setValue('show_in_rail', v, { shouldDirty: true })
              }
            />
            <Label>Show in rail</Label>
          </div>
          <Button type="submit" size="sm">
            {editing ? 'Save' : 'Create'}
          </Button>
        </form>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(v) => !v && setDeleting(null)}
        title="Delete social link"
        description={`Delete “${deleting?.label ?? ''}”?`}
        loading={remove.isPending}
        onConfirm={() => {
          if (!deleting) return
          remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </div>
  )
}
