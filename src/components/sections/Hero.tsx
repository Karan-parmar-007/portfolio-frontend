import { Button } from '@/components/ui/button'
import { Stagger, StaggerItem } from '@/components/common/FadeIn'
import { StudioLink } from '@/components/common/StudioLink'
import { mediaDownloadUrl } from '@/lib/mediaUrl'
import { resumeFileName } from '@/lib/resume'
import type { Profile } from '@/types/portfolio'

export function Hero({
  profile,
  animateIn,
}: {
  profile: Profile
  animateIn: boolean
}) {
  const resumeHref = mediaDownloadUrl(profile.resume, resumeFileName(profile.name))

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
        <StaggerItem>
          <div className="flex flex-wrap items-center gap-4">
            {resumeHref ? (
              <Button asChild className="w-fit rounded px-7 py-5 font-mono text-sm">
                <a href={resumeHref} download>
                  Get Resume
                </a>
              </Button>
            ) : null}
            {/* The nav shows Studio from lg up; below that it is in the menu, so surface it here. */}
            <StudioLink size="hero" className="py-5 lg:hidden" />
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
