import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ExternalLink, Star } from 'lucide-react'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { EmptyState } from '@/components/common/EmptyState'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import {
  useAdminProjects,
  useDeleteProject,
  useReorderProjects,
  useSetProjectFeatured,
  useSetProjectStatus,
} from '@/hooks/useAdminProjectMutations'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { getErrorDetail } from '@/lib/errors'
import { PROJECT_STATUS_LABEL, isProjectStatus } from '@/lib/projectStatus'
import { PROJECT_STATUSES, type ProjectSummary } from '@/types/project'

// Mirrors MAX_FEATURED_PROJECTS in the API; the API enforces it.
const MAX_FEATURED = 12

export function AdminProjectsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const q = useDebouncedValue(search.trim(), 300)
  const { data = [], isLoading } = useAdminProjects(q)
  const setFeatured = useSetProjectFeatured()
  const setStatus = useSetProjectStatus()
  const reorder = useReorderProjects()
  const remove = useDeleteProject()
  const [deleting, setDeleting] = useState<ProjectSummary | null>(null)

  const featuredCount = data.filter((p) => p.is_featured).length
  // Reordering needs the full list: the API rejects partial orders.
  const canReorder = q === '' && !reorder.isPending

  // Featured projects always sort first, so only swap within the same group.
  const move = (index: number, direction: -1 | 1) => {
    const other = data[index + direction]
    const current = data[index]
    if (!other || !current || other.is_featured !== current.is_featured) return
    const ids = data.map((p) => p.id)
    ids[index] = other.id
    ids[index + direction] = current.id
    reorder.mutate(ids)
  }

  return (
    <div className="space-y-6">
      <Seo title="Admin — Projects" />
      <AdminPageHeader
        title="Projects"
        description={`Featured projects (any status) are shown first everywhere. ${featuredCount}/${MAX_FEATURED} featured.`}
        actionLabel="New project"
        onAction={() => navigate('/admin/projects/new')}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="max-w-sm"
        />
        <Link to="/admin/project-tags" className="font-mono text-xs text-green hover:underline">
          Manage tags →
        </Link>
      </div>

      {isLoading ? (
        <AdminTableSkeleton />
      ) : data.length === 0 ? (
        <EmptyState message={q ? 'No projects match that search.' : 'No projects yet.'} />
      ) : (
        <ul className="space-y-2">
          {data.map((project, index) => {
            const prev = data[index - 1]
            const next = data[index + 1]
            return (
              <li
                key={project.id}
                className="flex flex-wrap items-center gap-3 rounded border border-lightest-navy bg-navy/30 p-3"
              >
                <div className="flex flex-col">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${project.name} up`}
                    disabled={!canReorder || !prev || prev.is_featured !== project.is_featured}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Move ${project.name} down`}
                    disabled={!canReorder || !next || next.is_featured !== project.is_featured}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="min-w-[200px] flex-1">
                  <p className="flex items-center gap-2 text-lightest-slate">
                    {project.is_featured ? (
                      <Star className="h-3.5 w-3.5 fill-green text-green" aria-label="Featured" />
                    ) : null}
                    {project.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-slate">{project.short_description}</p>
                </div>

                <Select
                  value={project.status}
                  onValueChange={(value) => {
                    if (isProjectStatus(value) && value !== project.status) {
                      setStatus.mutate({ id: project.id, status: value })
                    }
                  }}
                >
                  <SelectTrigger className="w-32" aria-label={`Status of ${project.name}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {PROJECT_STATUS_LABEL[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <label className="flex items-center gap-2 font-mono text-xs text-slate">
                  <Switch
                    checked={project.is_featured}
                    disabled={
                      setFeatured.isPending ||
                      (!project.is_featured && featuredCount >= MAX_FEATURED)
                    }
                    onCheckedChange={(checked) =>
                      setFeatured.mutate({ id: project.id, isFeatured: checked })
                    }
                    aria-label={`Feature ${project.name}`}
                  />
                  Featured
                </label>

                <div className="flex items-center gap-1">
                  <Button asChild size="sm" variant="ghost">
                    <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" aria-label={`View ${project.name}`}>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link to={`/admin/projects/${project.id}`}>Edit</Link>
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setDeleting(project)}>
                    Delete
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <AdminDeleteDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        title="Delete project?"
        description={`"${deleting?.name ?? ''}" and its cover image will be removed from the site.`}
        loading={remove.isPending}
        error={remove.error ? getErrorDetail(remove.error) : null}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id, { onSuccess: () => setDeleting(null) })
        }}
      />
    </div>
  )
}
