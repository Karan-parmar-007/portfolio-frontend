import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { SiteLayout } from '@/components/layout/SiteLayout'
import { AdminTableSkeleton } from '@/components/common/Skeletons'
import { ArchivePage } from '@/pages/ArchivePage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { SkillsPage } from '@/pages/SkillsPage'

const AdminRoutes = lazy(() => import('@/pages/admin/AdminRoutes'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ArchivePage /> },
      { path: 'projects/:slug', element: <ProjectDetailPage /> },
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
