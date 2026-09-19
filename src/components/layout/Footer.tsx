import { getSocialIcon } from '@/lib/socialIcons'
import type { SocialLink } from '@/types/portfolio'

export function Footer({
  name,
  socials,
}: {
  name?: string
  socials: SocialLink[]
}) {
  return (
    <footer className="flex w-full flex-col items-center pb-8 pt-24 text-sm text-slate">
      <ul className="mb-2 flex gap-4 pb-4 md:hidden">
        {socials.map((link) => {
          const Icon = getSocialIcon(link.platform)
          return (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="text-slate transition-colors hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
              >
                <Icon className="h-5 w-5" />
              </a>
            </li>
          )
        })}
      </ul>
      {name ? <div>Designed &amp; Built by {name}</div> : null}
    </footer>
  )
}
