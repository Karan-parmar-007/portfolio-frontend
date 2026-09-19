import { cn } from '@/lib/cn'

export function NumberedHeading({
  number,
  title,
  id,
  className,
}: {
  number: string
  title: string
  id: string
  className?: string
}) {
  return (
    <div className={cn('mb-10 flex items-center gap-4', className)}>
      <span className="flex-shrink-0 font-mono text-xl text-green">{number}.</span>
      <h2
        id={id}
        className="flex-shrink-0 text-2xl font-bold text-lightest-slate md:text-3xl"
      >
        {title}
      </h2>
      <div className="ml-4 h-px flex-1 bg-lightest-navy" aria-hidden />
    </div>
  )
}
