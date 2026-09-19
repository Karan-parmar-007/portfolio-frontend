import { Navigate, useRoutes } from 'react-router-dom'
import { OwnerGate } from '@/components/admin/OwnerGate'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminEducationPage } from '@/pages/admin/AdminEducationPage'
import { AdminExperiencePage } from '@/pages/admin/AdminExperiencePage'
import { AdminMessagesPage } from '@/pages/admin/AdminMessagesPage'
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage'
import { AdminSocialPage } from '@/pages/admin/AdminSocialPage'

export default function AdminRoutes() {
  return useRoutes([
    {
      element: (
        <OwnerGate>
          <AdminLayout />
        </OwnerGate>
      ),
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: 'profile', element: <AdminProfilePage /> },
        { path: 'education', element: <AdminEducationPage /> },
        { path: 'experience', element: <AdminExperiencePage /> },
        { path: 'social', element: <AdminSocialPage /> },
        { path: 'messages', element: <AdminMessagesPage /> },
        { path: '*', element: <Navigate to="/admin" replace /> },
      ],
    },
  ])
}
