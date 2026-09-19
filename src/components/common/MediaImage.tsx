import type { ImgHTMLAttributes } from 'react'
import { mediaUrl } from '@/lib/mediaUrl'
import { cn } from '@/lib/cn'
import type { MediaRef } from '@/types/media'

interface MediaImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height'> {
  media: MediaRef | null | undefined
  fallbackClassName?: string
}

export function MediaImage({
  media,
  alt,
  className,
  fallbackClassName,
  loading = 'lazy',
  ...props
}: MediaImageProps) {
  const src = mediaUrl(media)
  if (!src || !media) {
    return (
      <div
        className={cn('bg-lightest-navy/40', fallbackClassName ?? className)}
        aria-hidden
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={loading}
      className={className}
      {...props}
    />
  )
}
