import { FadeIn } from '@/components/common/FadeIn'
import { getSocialIcon } from '@/lib/socialIcons'
import type { SocialLink } from '@/types/portfolio'

export function SocialRail({
  links,
  animateIn,
}: {
  links: SocialLink[]
  animateIn: boolean
}) {
  if (links.length === 0) return null

  return (
    <FadeIn
      delay={0.8}
      y={0}
      enabled={animateIn}
      className="fixed bottom-0 left-8 z-20 hidden flex-col items-center gap-6 xl:flex 2xl:left-12"
    >
      <ul className="flex flex-col items-center gap-6" aria-label="Social links">
        {links.map((link) => {
          const Icon = getSocialIcon(link.platform)
          return (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="text-slate transition-all hover:-translate-y-1 hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <Icon className="h-5 w-5" />
              </a>
            </li>
          )
        })}
      </ul>
      <div className="mt-4 h-28 w-px bg-slate" aria-hidden />
    </FadeIn>
  )
}
