import { Button } from '@/components/ui/button'

export function ErrorState({
  message = 'Something went wrong while loading this content.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="max-w-md text-slate">{message}</p>
      {onRetry ? (
        <Button type="button" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}
