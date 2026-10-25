import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { AdminTable } from '@/components/admin/AdminTable'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  useCreateProjectTag,
  useDeleteProjectTag,
  useProjectTags,
} from '@/hooks/useAdminProjectMutations'
import { getErrorDetail } from '@/lib/errors'
import type { ProjectTag } from '@/types/project'

export function AdminProjectTagsPage() {
  const { data = [], isLoading } = useProjectTags()
  const create = useCreateProjectTag()
  const remove = useDeleteProjectTag()
  const [name, setName] = useState('')
  const [deleting, setDeleting] = useState<ProjectTag | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const value = name.trim()
    if (!value) return
    create.mutate(value, { onSuccess: () => setName('') })
  }

  return (
    <div className="space-y-6">
      <Seo title="Admin — Project tags" />
      <Link
        to="/admin/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-slate hover:text-green"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        All projects
      </Link>
      <AdminPageHeader
        title="Project tags"
        description="Tags group projects; visitors can filter by them from a project page."
      />

      <form onSubmit={submit} className="flex max-w-md gap-2">
        <Input
          value={name}
          maxLength={50}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          aria-label="New tag name"
        />
        <Button type="submit" size="sm" disabled={create.isPending || !name.trim()}>
          Add
        </Button>
      </form>

      <AdminTable
        isLoading={isLoading}
        emptyMessage="No tags yet."
        columns={[
          { key: 'name', header: 'Tag' },
          { key: 'count', header: 'Projects' },
          { key: 'actions', header: '', className: 'text-right' },
        ]}
        rows={data.map((tag) => ({
          id: tag.id,
          cells: {
            name: tag.name,
            count: tag.project_count,
            actions: (
              <Button type="button" size="sm" variant="ghost" onClick={() => setDeleting(tag)}>
                Delete
              </Button>
            ),
          },
        }))}
      />

      <AdminDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete tag?"
        description={
          deleting && deleting.project_count > 0
            ? `"${deleting.name}" is removed from ${deleting.project_count} project(s).`
            : `"${deleting?.name ?? ''}" will be deleted.`
        }
        loading={remove.isPending}
        error={remove.error ? getErrorDetail(remove.error) : null}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </div>
  )
}
