import { Link } from 'react-router-dom'
import { Seo } from '@/components/common/Seo'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <Seo title="404 — Not Found" />
      <p className="font-mono text-green">404</p>
      <h1 className="text-[clamp(32px,5vw,48px)] font-semibold text-lightest-slate">
        Page Not Found
      </h1>
      <p className="max-w-md text-slate">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  )
}
