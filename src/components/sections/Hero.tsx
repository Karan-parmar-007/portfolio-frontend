import { Button } from '@/components/ui/button'
import { Stagger, StaggerItem } from '@/components/common/FadeIn'
import { mediaUrl } from '@/lib/mediaUrl'
import type { Profile } from '@/types/portfolio'

export function Hero({
  profile,
  animateIn,
}: {
  profile: Profile
  animateIn: boolean
}) {
  const resumeHref = mediaUrl(profile.resume)

  return (
    <section className="flex min-h-[calc(100vh-6rem)] flex-col justify-center py-10">
      <Stagger delay={0.15} enabled={animateIn}>
        {profile.hero_greeting ? (
          <StaggerItem>
            <p className="mb-4 font-mono text-sm sm:text-base text-green">{profile.hero_greeting}</p>
          </StaggerItem>
        ) : null}
        <StaggerItem>
          <h1 className="mb-3 break-words text-[clamp(32px,6vw,72px)] font-bold tracking-tight text-lightest-slate leading-none">
            {profile.name}.
          </h1>
        </StaggerItem>
        {profile.headline ? (
          <StaggerItem>
            <h2 className="mb-8 break-words text-[clamp(26px,5vw,60px)] font-bold tracking-tight text-slate leading-[1.1]">
              {profile.headline}
            </h2>
          </StaggerItem>
        ) : null}
        {resumeHref ? (
          <StaggerItem>
            <Button asChild className="w-fit rounded px-7 py-5 font-mono text-sm">
              <a href={resumeHref} target="_blank" rel="noreferrer">
                Get Resume
              </a>
            </Button>
          </StaggerItem>
        ) : null}
      </Stagger>
    </section>
  )
}
