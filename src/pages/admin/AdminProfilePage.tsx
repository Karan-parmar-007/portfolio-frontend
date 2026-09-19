import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AdminCard, AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { MediaField } from '@/components/admin/MediaField'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  useAdminProfile,
  useDeleteProfileImage,
  useDeleteProfileResume,
  useUpdateProfile,
  useUploadProfileImage,
  useUploadProfileResume,
} from '@/hooks/useAdminPortfolioMutations'

const heroSchema = z.object({
  name: z.string().min(1),
  hero_greeting: z.string().optional(),
  headline: z.string().optional(),
})

const aboutSchema = z.object({
  about: z.string().optional(),
})

const contactSchema = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  available_for_work: z.boolean(),
})

type HeroValues = z.infer<typeof heroSchema>
type AboutValues = z.infer<typeof aboutSchema>
type ContactValues = z.infer<typeof contactSchema>

export function AdminProfilePage() {
  const { data: profile } = useAdminProfile()
  const updateProfile = useUpdateProfile()
  const uploadImage = useUploadProfileImage()
  const deleteImage = useDeleteProfileImage()
  const uploadResume = useUploadProfileResume()
  const deleteResume = useDeleteProfileResume()

  const heroForm = useForm<HeroValues>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      name: '',
      hero_greeting: '',
      headline: '',
    },
  })
  const aboutForm = useForm<AboutValues>({
    resolver: zodResolver(aboutSchema),
    defaultValues: { about: '' },
  })
  const contactForm = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: '',
      phone: '',
      location: '',
      available_for_work: false,
    },
  })

  useEffect(() => {
    if (!profile) return
    heroForm.reset({
      name: profile.name,
      hero_greeting: profile.hero_greeting ?? '',
      headline: profile.headline ?? '',
    })
    aboutForm.reset({ about: profile.about ?? '' })
    contactForm.reset({
      email: profile.email,
      phone: profile.phone ?? '',
      location: profile.location ?? '',
      available_for_work: profile.available_for_work,
    })
  }, [profile, heroForm, aboutForm, contactForm])

  const heroWatch = heroForm.watch()

  return (
    <div className="space-y-6">
      <Seo title="Admin — Profile" />
      <AdminPageHeader
        title="Profile"
        description="Hero, about, contact, and media."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <AdminCard title="Hero">
            <form
              className="space-y-3"
              onSubmit={heroForm.handleSubmit((values) =>
                updateProfile.mutate({
                  name: values.name,
                  hero_greeting: values.hero_greeting || null,
                  headline: values.headline || null,
                }),
              )}
            >
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" {...heroForm.register('name')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hero_greeting">Greeting</Label>
                <Input id="hero_greeting" {...heroForm.register('hero_greeting')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="headline">Headline</Label>
                <Input id="headline" {...heroForm.register('headline')} />
              </div>
              <Button type="submit" size="sm" disabled={updateProfile.isPending}>
                Save hero
              </Button>
            </form>
          </AdminCard>

          <AdminCard title="About">
            <form
              className="space-y-3"
              onSubmit={aboutForm.handleSubmit((values) =>
                updateProfile.mutate({ about: values.about || null }),
              )}
            >
              <Textarea rows={8} {...aboutForm.register('about')} />
              <p className="text-xs text-slate">
                {(aboutForm.watch('about') ?? '').length} characters
              </p>
              <Button type="submit" size="sm" disabled={updateProfile.isPending}>
                Save about
              </Button>
            </form>
          </AdminCard>

          <AdminCard title="Contact">
            <form
              className="space-y-3"
              onSubmit={contactForm.handleSubmit((values) =>
                updateProfile.mutate({
                  email: values.email,
                  phone: values.phone || null,
                  location: values.location || null,
                  available_for_work: values.available_for_work,
                }),
              )}
            >
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...contactForm.register('email')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...contactForm.register('phone')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...contactForm.register('location')} />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={contactForm.watch('available_for_work')}
                  onCheckedChange={(v) =>
                    contactForm.setValue('available_for_work', v, {
                      shouldDirty: true,
                    })
                  }
                />
                <Label>Available for work</Label>
              </div>
              <Button type="submit" size="sm" disabled={updateProfile.isPending}>
                Save contact
              </Button>
            </form>
          </AdminCard>

          <AdminCard title="Profile image">
            <MediaField
              media={profile?.profile_image}
              accept="image/*"
              maxBytes={5 * 1024 * 1024}
              uploading={uploadImage.isPending}
              removing={deleteImage.isPending}
              onUpload={(file) => uploadImage.mutate(file)}
              onRemove={() => deleteImage.mutate()}
            />
          </AdminCard>

          <AdminCard title="Resume">
            <MediaField
              media={profile?.resume}
              accept=".pdf,application/pdf"
              maxBytes={10 * 1024 * 1024}
              kind="file"
              uploading={uploadResume.isPending}
              removing={deleteResume.isPending}
              onUpload={(file) => uploadResume.mutate(file)}
              onRemove={() => deleteResume.mutate()}
            />
          </AdminCard>
        </div>

        <aside className="rounded border border-lightest-navy bg-light-navy p-5">
          <p className="mb-4 font-mono text-xs text-green">Live preview</p>
          {heroWatch.hero_greeting ? (
            <p className="mb-2 font-mono text-sm text-green">
              {heroWatch.hero_greeting}
            </p>
          ) : null}
          <p className="text-2xl font-semibold text-lightest-slate">
            {heroWatch.name || 'Your name'}
          </p>
          {heroWatch.headline ? (
            <p className="text-xl text-slate">{heroWatch.headline}</p>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
