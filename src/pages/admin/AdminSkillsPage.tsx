import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog'
import { AdminFormDialog } from '@/components/admin/AdminFormDialog'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { FileDropzone } from '@/components/admin/FileDropzone'
import { ReorderList } from '@/components/admin/ReorderList'
import { Seo } from '@/components/common/Seo'
import { MediaImage } from '@/components/common/MediaImage'
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
  useAdminSkillCategories,
  useAdminSkills,
  useCreateSkill,
  useCreateSkillCategory,
  useDeleteSkill,
  useDeleteSkillCategory,
  useDeleteSkillIcon,
  useReorderSkillCategories,
  useReorderSkills,
  useUpdateSkill,
  useUpdateSkillCategory,
} from '@/hooks/useAdminPortfolioMutations'
import type { Skill, SkillCategory } from '@/types/portfolio'

const skillSchema = z.object({
  name: z.string().min(1),
  category_id: z.string().optional(),
  show_in_about: z.boolean(),
})

type SkillForm = z.infer<typeof skillSchema>

export function AdminSkillsPage() {
  const { data: categories = [] } = useAdminSkillCategories()
  const { data: skills = [] } = useAdminSkills()
  const createCategory = useCreateSkillCategory()
  const updateCategory = useUpdateSkillCategory()
  const deleteCategory = useDeleteSkillCategory()
  const reorderCategories = useReorderSkillCategories()
  const createSkill = useCreateSkill()
  const updateSkill = useUpdateSkill()
  const deleteSkill = useDeleteSkill()
  const deleteIcon = useDeleteSkillIcon()
  const reorderSkills = useReorderSkills()

  const [categoryName, setCategoryName] = useState('')
  const [skillOpen, setSkillOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<SkillCategory | null>(
    null,
  )

  const form = useForm<SkillForm>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: '', category_id: '', show_in_about: false },
  })

  const aboutCount = skills.filter((s) => s.show_in_about).length
  const homeCount = categories.filter((c) => c.show_on_home).length

  const grouped = useMemo(() => {
    const map = new Map<string | null, Skill[]>()
    for (const skill of skills) {
      const key = skill.category_id
      const list = map.get(key) ?? []
      list.push(skill)
      map.set(key, list)
    }
    return map
  }, [skills])

  const openCreateSkill = () => {
    setEditingSkill(null)
    setIconFile(null)
    form.reset({ name: '', category_id: '', show_in_about: false })
    setSkillOpen(true)
  }

  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setIconFile(null)
    form.reset({
      name: skill.name,
      category_id: skill.category_id ?? '',
      show_in_about: skill.show_in_about,
    })
    setSkillOpen(true)
  }

  const submitSkill = form.handleSubmit((values) => {
    const fd = new FormData()
    fd.append('name', values.name)
    if (values.category_id) fd.append('category_id', values.category_id)
    fd.append('show_in_about', String(values.show_in_about))
    if (iconFile) fd.append('icon', iconFile)

    if (editingSkill) {
      updateSkill.mutate(
        { id: editingSkill.id, form: fd },
        { onSuccess: () => setSkillOpen(false) },
      )
    } else {
      createSkill.mutate(fd, { onSuccess: () => setSkillOpen(false) })
    }
  })

  return (
    <div className="space-y-6">
      <Seo title="Admin — Skills" />
      <AdminPageHeader
        title="Skills"
        description={`Categories and skills. Toggle Home on up to 3 categories for the homepage. ${aboutCount} shown in About${
          aboutCount === 0 || aboutCount > 8
            ? ' — aim for about 6 for the two-column list.'
            : '.'
        }`}
        actionLabel="Add skill"
        onAction={openCreateSkill}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded border border-lightest-navy bg-light-navy p-4">
          <h3 className="mb-3 font-semibold text-lightest-slate">
            Categories
            <span className="ml-2 font-mono text-xs font-normal text-slate">
              {homeCount}/3 on home
            </span>
          </h3>
          <form
            className="mb-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!categoryName.trim()) return
              createCategory.mutate(
                { name: categoryName.trim() },
                { onSuccess: () => setCategoryName('') },
              )
            }}
          >
            <Input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="New category"
            />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>
          <ReorderList
            items={categories}
            getLabel={(c) => c.name}
            onReorder={(ids) => reorderCategories.mutate(ids)}
            renderItem={(item) => (
              <div className="flex items-center justify-between gap-2">
                <Input
                  defaultValue={item.name}
                  onBlur={(e) => {
                    const next = e.target.value.trim()
                    if (next && next !== item.name) {
                      updateCategory.mutate({
                        id: item.id,
                        payload: { name: next },
                      })
                    }
                  }}
                />
                <Switch
                  checked={item.show_on_home}
                  disabled={!item.show_on_home && homeCount >= 3}
                  onCheckedChange={(v) =>
                    updateCategory.mutate({
                      id: item.id,
                      payload: { show_on_home: v },
                    })
                  }
                  aria-label={`Show ${item.name} on home`}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeletingCategory(item)}
                >
                  Delete
                </Button>
              </div>
            )}
          />
        </section>

        <section className="rounded border border-lightest-navy bg-light-navy p-4">
          <h3 className="mb-3 font-semibold text-lightest-slate">Skills</h3>
          <div className="space-y-6">
            {[...categories, null].map((category) => {
              const categoryId = category ? category.id : null
              const group = grouped.get(categoryId) ?? []
              if (group.length === 0 && categoryId === null) return null
              return (
                <div key={categoryId ?? 'uncategorised'}>
                  <p className="mb-2 font-mono text-xs text-green">
                    {category?.name ?? 'Uncategorised'}
                  </p>
                  <ReorderList
                    items={group}
                    getLabel={(s) => s.name}
                    onReorder={(ids) => {
                      const otherIds = skills
                        .filter((s) => s.category_id !== categoryId)
                        .map((s) => s.id)
                      reorderSkills.mutate([...ids, ...otherIds])
                    }}
                    renderItem={(skill) => (
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {skill.icon ? (
                            <MediaImage
                              media={skill.icon}
                              alt=""
                              className="h-6 w-6 object-contain"
                            />
                          ) : null}
                          <span className="text-lightest-slate">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={skill.show_in_about}
                            onCheckedChange={(v) => {
                              const fd = new FormData()
                              fd.append('show_in_about', String(v))
                              updateSkill.mutate({ id: skill.id, form: fd })
                            }}
                            aria-label={`Show ${skill.name} in about`}
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => openEditSkill(skill)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeletingSkill(skill)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  />
                </div>
              )
            })}
          </div>
        </section>
      </div>

      <AdminFormDialog
        open={skillOpen}
        onOpenChange={setSkillOpen}
        title={editingSkill ? 'Edit skill' : 'Add skill'}
        dirty={form.formState.isDirty || Boolean(iconFile)}
      >
        <form className="space-y-3" onSubmit={(e) => void submitSkill(e)}>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input {...form.register('name')} />
          </div>
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={form.watch('category_id') || 'none'}
              onValueChange={(v) =>
                form.setValue('category_id', v === 'none' ? '' : v, {
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Uncategorised</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch
              checked={form.watch('show_in_about')}
              onCheckedChange={(v) =>
                form.setValue('show_in_about', v, { shouldDirty: true })
              }
            />
            <Label>Show in About</Label>
          </div>
          <FileDropzone
            accept="image/*"
            maxBytes={2 * 1024 * 1024}
            onFile={setIconFile}
            label="Skill icon"
          />
          {editingSkill?.icon ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => deleteIcon.mutate(editingSkill.id)}
            >
              Remove icon
            </Button>
          ) : null}
          <Button type="submit" size="sm">
            {editingSkill ? 'Save' : 'Create'}
          </Button>
        </form>
      </AdminFormDialog>

      <AdminDeleteDialog
        open={Boolean(deletingSkill)}
        onOpenChange={(v) => !v && setDeletingSkill(null)}
        title="Delete skill"
        description={`Delete “${deletingSkill?.name ?? ''}”?`}
        loading={deleteSkill.isPending}
        onConfirm={() => {
          if (!deletingSkill) return
          deleteSkill.mutate(deletingSkill.id, {
            onSuccess: () => setDeletingSkill(null),
          })
        }}
      />

      <AdminDeleteDialog
        open={Boolean(deletingCategory)}
        onOpenChange={(v) => !v && setDeletingCategory(null)}
        title="Delete category"
        description={`Delete “${deletingCategory?.name ?? ''}”? Skills in this category will be kept but uncategorised.`}
        loading={deleteCategory.isPending}
        onConfirm={() => {
          if (!deletingCategory) return
          deleteCategory.mutate(deletingCategory.id, {
            onSuccess: () => setDeletingCategory(null),
          })
        }}
      />
    </div>
  )
}
