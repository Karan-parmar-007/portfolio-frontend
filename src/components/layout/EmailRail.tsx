import { FadeIn } from '@/components/common/FadeIn'

export function EmailRail({
  email,
  animateIn,
}: {
  email?: string
  animateIn: boolean
}) {
  if (!email) return null

  return (
    <FadeIn
      delay={0.9}
      y={0}
      enabled={animateIn}
      className="fixed bottom-0 right-8 z-20 hidden flex-col items-center gap-6 xl:flex 2xl:right-12"
    >
      <a
        href={`mailto:${email}`}
        className="font-mono text-xs tracking-[0.1em] text-slate transition-all hover:-translate-y-1 hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green [writing-mode:vertical-rl]"
      >
        {email}
      </a>
      <div className="mt-4 h-28 w-px bg-slate" aria-hidden />
    </FadeIn>
  )
}
