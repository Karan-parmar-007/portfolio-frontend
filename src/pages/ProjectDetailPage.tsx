import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageLoader } from '@/components/common/PageLoader'
import { appsUrl } from '@/lib/apps'

export function ProjectDetailPage() {
  const { slug = '' } = useParams()

  useEffect(() => {
    window.location.replace(appsUrl(`/projects/${encodeURIComponent(slug)}`))
  }, [slug])

  return <PageLoader message="Opening project..." />
}
