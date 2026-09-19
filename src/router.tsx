import { Suspense, lazy, useEffect } from 'react'
import { createBrowserRouter, useParams } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { SkillsPage } from '@/pages/SkillsPage'
import { appsHomeUrl, appsUrl } from '@/lib/apps'

const AdminRoutes = lazy(() => import('@/pages/admin/AdminRoutes'))

function RedirectToAppsHome() {
  useEffect(() => {
    window.location.replace(appsHomeUrl())
  }, [])
  return null
}

function RedirectToAppsProject() {
  const { slug = '' } = useParams()
  useEffect(() => {
    window.location.replace(appsUrl(`/projects/${encodeURIComponent(slug)}`))
  }, [slug])
  return null
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <RedirectToAppsHome /> },
      { path: 'projects/:slug', element: <RedirectToAppsProject /> },
      { path: 'skills', element: <SkillsPage /> },
    ],
  },
  { path: '/admin/login', element: <LoginPage /> },
  {
    path: '/admin/*',
    element: (
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-navy p-8">
            <div className="w-full max-w-md">
              <AdminTableSkeleton />
            </div>
          </div>
        }
      >
        <AdminRoutes />
      </Suspense>
    ),
  },
  { path: '*', element: <NotFoundPage /> },
])
