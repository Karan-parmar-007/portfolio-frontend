import { useEffect, useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { cn } from '@/lib/cn'

export function FileDropzone({
  accept,
  maxBytes,
  onFile,
  previewUrl,
  label = 'Drop a file here or click to browse',
}: {
  accept: string
  maxBytes: number
  onFile: (file: File | null) => void
  previewUrl?: string | null
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview)
    }
  }, [localPreview])

  const handleFile = (file: File | null) => {
    setError(null)
    if (!file) {
      if (localPreview) URL.revokeObjectURL(localPreview)
      setLocalPreview(null)
      onFile(null)
      return
    }
    if (file.size > maxBytes) {
      setError(`File must be under ${Math.round(maxBytes / 1024 / 1024)}MB`)
      return
    }
    if (localPreview) URL.revokeObjectURL(localPreview)
    if (file.type.startsWith('image/')) {
      setLocalPreview(URL.createObjectURL(file))
    } else {
      setLocalPreview(null)
    }
    onFile(file)
  }

  const shown = localPreview ?? previewUrl

  return (
    <div>
      <button
        type="button"
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded border border-dashed border-lightest-navy bg-navy/40 px-4 py-8 text-sm text-slate transition hover:border-green hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files?.[0] ?? null
          handleFile(file)
        }}
      >
        {shown ? (
          <img src={shown} alt="" className="max-h-40 rounded object-contain" />
        ) : (
          <>
            <Upload className="h-6 w-6" />
            <span>{label}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {error ? <p className="mt-2 text-xs text-slate">{error}</p> : null}
    </div>
  )
}
