import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { z } from 'zod'
import { ArrowLeft } from 'lucide-react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { ChipInput } from '@/components/admin/ChipInput'
import { FileDropzone } from '@/components/admin/FileDropzone'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { ErrorState } from '@/components/common/ErrorState'
import { PageLoader } from '@/components/common/PageLoader'
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
import { Textarea } from '@/components/ui/textarea'
import { useAdminSkills } from '@/hooks/useAdminPortfolioMutations'
import {
  useAdminProject,
  useCreateProject,
  useDeleteProjectCover,
  useProjectTags,
  useUpdateProject,
  useUploadProjectCover,
} from '@/hooks/useAdminProjectMutations'
import { mediaUrl } from '@/lib/mediaUrl'
import { PROJECT_STATUS_LABEL } from '@/lib/projectStatus'
import {
  PROJECT_STATUSES,
  type ProjectDetail,
  type ProjectWriteRequest,
} from '@/types/project'

const MAX_COVER_BYTES = 5 * 1024 * 1024

const optionalUrl = z
  .string()
  .trim()
  .max(500, 'At most 500 characters')
  .refine((v) => v === '' || /^https?:\/\/[^\s/]+/i.test(v), 'Must start with http:// or https://')

const schema = z.object({
  name: z.string().trim().min(1, 'Required').max(150),
  short_description: z.string().trim().min(1, 'Required').max(500),
  long_description: z.string().max(200_000),
  status: z.enum(['live', 'offline', 'archived']),
  is_featured: z.boolean(),
  github_url: optionalUrl,
  try_url: optionalUrl,
  tech_stack: z.array(z.string()).max(30),
  tags: z.array(z.string()).max(20),
})

type ProjectForm = z.infer<typeof schema>

const EMPTY_FORM: ProjectForm = {
  name: '',
  short_description: '',
  long_description: '',
  status: 'offline',
  is_featured: false,
  github_url: '',
  try_url: '',
  tech_stack: [],
  tags: [],
}

function toForm(project: ProjectDetail): ProjectForm {
  return {
    name: project.name,
    short_description: project.short_description,
    long_description: project.long_description,
    status: project.status,
    is_featured: project.is_featured,
    github_url: project.github_url ?? '',
    try_url: project.try_url ?? '',
    tech_stack: project.tech_stack,
    tags: project.tags,
  }
}

function toPayload(values: ProjectForm): ProjectWriteRequest {
  return {
    ...values,
    github_url: values.github_url || null,
    try_url: values.try_url || null,
  }
}

export function AdminProjectFormPage() {
  const { id } = useParams()
  const isNew = !id
  const navigate = useNavigate()
  const project = useAdminProject(id)
  const skills = useAdminSkills()
  const tags = useProjectTags()
  const create = useCreateProject()
  const update = useUpdateProject()
  const uploadCover = useUploadProjectCover()
  const deleteCover = useDeleteProjectCover()
  const [pendingCover, setPendingCover] = useState<File | null>(null)

  const values = useMemo(
    () => (project.data ? toForm(project.data) : undefined),
    [project.data],
  )
  const form = useForm<ProjectForm>({
    resolver: zodResolver(schema),
    defaultValues: EMPTY_FORM,
    // Refetches (e.g. after a cover upload) must not wipe unsaved edits.
    values,
    resetOptions: { keepDirtyValues: true },
  })
  const { errors } = form.formState
  const status = form.watch('status')
  const tryUrl = form.watch('try_url')

  if (!isNew && project.isLoading) return <PageLoader message="Loading project..." />
  if (!isNew && (project.isError || !project.data)) {
    return <ErrorState message="Couldn't load this project." onRetry={() => void project.refetch()} />
  }

  const submit = form.handleSubmit((formValues) => {
    const payload = toPayload(formValues)
    if (isNew) {
      create.mutate(payload, {
        onSuccess: (created) => {
          const done = () => navigate(`/admin/projects/${created.id}`, { replace: true })
          if (pendingCover) {
            uploadCover.mutate({ id: created.id, file: pendingCover }, { onSettled: done })
          } else {
            done()
          }
        },
      })
    } else if (id) {
      update.mutate(
        { id, payload },
        { onSuccess: (saved) => form.reset(toForm(saved)) },
      )
    }
  })

  const saving = create.isPending || update.isPending || uploadCover.isPending
  const cover = project.data?.cover ?? null

  return (
    <div className="space-y-6">
      <Seo title={`Admin — ${isNew ? 'New project' : project.data?.name ?? 'Project'}`} />
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-green"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All projects
      </Link>
      <AdminPageHeader
        title={isNew ? 'New project' : 'Edit project'}
        description={
          isNew ? undefined : `Public page: /projects/${project.data?.slug ?? ''}`
        }
      />

      <form onSubmit={submit} className="space-y-6" noValidate>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" maxLength={150} {...form.register('name')} />
            {errors.name ? <p className="text-xs text-red-400">{errors.name.message}</p> : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Controller
                control={form.control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-label="Status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROJECT_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {PROJECT_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_featured">Featured</Label>
              <Controller
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <div className="flex h-10 items-center">
                    <Switch id="is_featured" checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="short_description">Short description (cards and search)</Label>
          <Textarea
            id="short_description"
            rows={3}
            maxLength={500}
            {...form.register('short_description')}
          />
          {errors.short_description ? (
            <p className="text-xs text-red-400">{errors.short_description.message}</p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="try_url">“Try it now” link (exact Studio product page)</Label>
            <Input
              id="try_url"
              placeholder="https://studio.karanparmar.in/products/…"
              {...form.register('try_url')}
            />
            {errors.try_url ? (
              <p className="text-xs text-red-400">{errors.try_url.message}</p>
            ) : tryUrl && status !== 'live' ? (
              <p className="text-xs text-slate">The button only shows while the project is Live.</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="github_url">GitHub link</Label>
            <Input id="github_url" placeholder="https://github.com/…" {...form.register('github_url')} />
            {errors.github_url ? (
              <p className="text-xs text-red-400">{errors.github_url.message}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tech stack (drives the skill filter)</Label>
            <Controller
              control={form.control}
              name="tech_stack"
              render={({ field }) => (
                <ChipInput
                  value={field.value}
                  onChange={field.onChange}
                  maxItems={30}
                  placeholder="Python, FastAPI… (Enter to add)"
                  suggestions={(skills.data ?? []).map((s) => s.name)}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <Controller
              control={form.control}
              name="tags"
              render={({ field }) => (
                <ChipInput
                  value={field.value}
                  onChange={field.onChange}
                  maxItems={20}
                  placeholder="AI, Scraper… (Enter to add)"
                  suggestions={(tags.data ?? []).map((t) => t.name)}
                />
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Cover image</Label>
          <FileDropzone
            accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
            maxBytes={MAX_COVER_BYTES}
            previewUrl={mediaUrl(cover) ?? null}
            label="Drop a cover image here or click to browse"
            onFile={(file) => {
              if (isNew) {
                setPendingCover(file)
              } else if (file && id) {
                uploadCover.mutate({ id, file })
              }
            }}
          />
          {!isNew && cover && id ? (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={deleteCover.isPending}
              onClick={() => deleteCover.mutate(id)}
            >
              Remove cover
            </Button>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Write-up (detail page)</Label>
          <Controller
            control={form.control}
            name="long_description"
            render={({ field }) => <RichTextEditor value={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : isNew ? 'Create project' : 'Save changes'}
          </Button>
          {!isNew && project.data ? (
            <a
              href={`/projects/${project.data.slug}`}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-xs text-green hover:underline"
            >
              View public page →
            </a>
          ) : null}
        </div>
      </form>
    </div>
  )
}
