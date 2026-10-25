import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PageLoader } from '@/components/common/PageLoader'
import { SkillsPage } from '@/pages/SkillsPage'

const AdminRoutes = lazy(() => import('@/pages/admin/AdminRoutes'))
// Kept out of the home page bundle (the detail page pulls in DOMPurify).
const ProjectsPage = lazy(() =>
  import('@/pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ProjectDetailPage = lazy(() =>
  import('@/pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
)
const projectFallback = <PageLoader message="Loading projects..." />

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'projects',
        element: (
          <Suspense fallback={projectFallback}>
            <ProjectsPage />
          </Suspense>
        ),
      },
      {
        path: 'projects/:slug',
        element: (
          <Suspense fallback={projectFallback}>
            <ProjectDetailPage />
          </Suspense>
        ),
      },
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
