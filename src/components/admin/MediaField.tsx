import { mediaUrl } from '@/lib/mediaUrl'
import type { MediaRef } from '@/types/media'
import { Button } from '@/components/ui/button'
import { FileDropzone } from './FileDropzone'

export function MediaField({
  media,
  accept,
  maxBytes,
  onUpload,
  onRemove,
  kind = 'image',
  uploading,
  removing,
}: {
  media: MediaRef | null | undefined
  accept: string
  maxBytes: number
  onUpload: (file: File) => void
  onRemove: () => void
  kind?: 'image' | 'file'
  uploading?: boolean
  removing?: boolean
}) {
  const href = mediaUrl(media)

  return (
    <div className="space-y-3">
      {kind === 'image' && media ? (
        <img
          src={href}
          alt={media.filename}
          className="max-h-48 rounded object-contain"
        />
      ) : null}
      {kind === 'file' && media ? (
        <div className="flex items-center gap-3 text-sm text-light-slate">
          <span>{media.filename}</span>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-green hover:underline"
            >
              View
            </a>
          ) : null}
        </div>
      ) : null}
      <FileDropzone
        accept={accept}
        maxBytes={maxBytes}
        previewUrl={kind === 'image' ? href : null}
        onFile={(file) => {
          if (file) onUpload(file)
        }}
        label={media ? 'Replace file' : 'Upload file'}
      />
      <div className="flex gap-2">
        {media ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={removing || uploading}
            onClick={onRemove}
          >
            {removing ? 'Removing…' : 'Remove'}
          </Button>
        ) : null}
        {uploading ? (
          <span className="text-xs text-slate">Uploading…</span>
        ) : null}
      </div>
    </div>
  )
}
