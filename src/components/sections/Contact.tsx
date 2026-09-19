import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ScrollReveal } from '@/components/common/FadeIn'
import { submitContact } from '@/api/portfolio'
import { getErrorDetail } from '@/lib/errors'
import type { Profile } from '@/types/portfolio'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}

export function Contact({
  profile,
  number,
}: {
  profile: Profile
  number: string
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await submitContact({
        name: values.name,
        email: values.email,
        phone: values.phone || undefined,
        subject: values.subject,
        message: values.message || '',
      })
      toast.success("Message sent — I'll get back to you.")
      form.reset()
    } catch (error) {
      toast.error(getErrorDetail(error, 'Could not send the message'))
    }
  })

  return (
    <section id="contact" className="mx-auto max-w-[720px] scroll-mt-24 py-24">
      <ScrollReveal>
        <p className="mb-4 text-center font-mono text-base text-green">
          {number}. What&apos;s Next?
        </p>
        <h2
          id="contact-heading"
          className="mb-6 text-center text-4xl font-bold text-lightest-slate sm:text-5xl"
        >
          Get In Touch
        </h2>
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <p className="mb-8 text-center text-base leading-relaxed text-slate md:text-lg">
          {profile.available_for_work
            ? "I'm currently looking for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!"
            : "My inbox is always open! Whether you want to discuss a potential collaboration, ask a question, or just say hi, I'll try my best to get back to you."}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm">
          <a
            href={`mailto:${profile.email}`}
            className="text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            {profile.email}
          </a>
          {profile.phone ? (
            <a
              href={telHref(profile.phone)}
              className="text-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
            >
              {profile.phone}
            </a>
          ) : null}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <form className="space-y-4 text-left" onSubmit={(e) => void onSubmit(e)}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="contact-name">Name</Label>
              <Input id="contact-name" autoComplete="name" {...form.register('name')} />
              {form.formState.errors.name ? (
                <p className="font-mono text-xs text-green">
                  {form.formState.errors.name.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                {...form.register('email')}
              />
              {form.formState.errors.email ? (
                <p className="font-mono text-xs text-green">
                  {form.formState.errors.email.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                type="tel"
                autoComplete="tel"
                {...form.register('phone')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" {...form.register('subject')} />
              {form.formState.errors.subject ? (
                <p className="font-mono text-xs text-green">
                  {form.formState.errors.subject.message}
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" rows={5} {...form.register('message')} />
          </div>
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="rounded border border-green bg-transparent px-8 py-6 font-mono text-sm text-green hover:bg-green-tint hover:shadow-lg hover:shadow-green/10"
            >
              {form.formState.isSubmitting ? 'Sending…' : 'Send message'}
            </Button>
          </div>
        </form>
      </ScrollReveal>
    </section>
  )
}
