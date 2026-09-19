import { MediaImage } from '@/components/common/MediaImage'
import { NumberedHeading } from '@/components/common/NumberedHeading'
import { ScrollReveal } from '@/components/common/FadeIn'
import type { Profile, Skill } from '@/types/portfolio'

export function About({
  profile,
  skills,
  number,
}: {
  profile: Profile
  skills: Skill[]
  number: string
}) {
  return (
    <section id="about" className="scroll-mt-24 py-20">
      <ScrollReveal>
        <NumberedHeading number={number} title="About Me" id="about-heading" />
      </ScrollReveal>
      <div className="mt-12 grid gap-12 md:grid-cols-5">
        <ScrollReveal delay={0.1} className="md:col-span-3">
          {profile.about ? (
            <div className="space-y-4 whitespace-pre-line text-base text-slate lg:text-lg leading-relaxed">
              {profile.about}
            </div>
          ) : null}
          {skills.length > 0 ? (
            <>
              <p className="mt-6 text-lightest-slate">
                Here are a few technologies I&apos;ve been working with recently:
              </p>
              <ul className="mt-6 grid grid-cols-2 gap-2.5">
                {skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="relative pl-5 font-mono text-sm text-slate transition-colors hover:text-green"
                  >
                    <span className="absolute left-0 text-green">▹</span>
                    {skill.name}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </ScrollReveal>
        {profile.profile_image ? (
          <ScrollReveal delay={0.2} className="md:col-span-2">
            <div className="relative mx-auto h-[300px] w-full max-w-[300px]">
              <div className="group relative">
                <div className="relative z-10 h-full w-full overflow-hidden rounded bg-green transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                  <MediaImage
                    media={profile.profile_image}
                    alt={profile.name}
                    className="h-full w-full rounded object-cover grayscale contrast-125 transition-all duration-300 group-hover:grayscale-0 group-hover:contrast-100"
                  />
                </div>
                <div className="absolute top-4 left-4 -z-10 h-full w-full rounded border-2 border-green transition-transform duration-300 group-hover:translate-x-2 group-hover:translate-y-2" />
              </div>
            </div>
          </ScrollReveal>
        ) : null}
      </div>
    </section>
  )
}
