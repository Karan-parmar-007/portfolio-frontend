import { useEffect } from 'react'
import { PageLoader } from '@/components/common/PageLoader'
import { appsHomeUrl } from '@/lib/apps'

export function ArchivePage() {
  useEffect(() => {
    window.location.replace(appsHomeUrl())
  }, [])

  return <PageLoader message="Opening projects..." />
}
