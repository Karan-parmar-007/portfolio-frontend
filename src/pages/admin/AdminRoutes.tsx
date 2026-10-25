import { Navigate, useRoutes } from 'react-router-dom'
import { OwnerGate } from '@/components/admin/OwnerGate'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminEducationPage } from '@/pages/admin/AdminEducationPage'
import { AdminExperiencePage } from '@/pages/admin/AdminExperiencePage'
import { AdminMessagesPage } from '@/pages/admin/AdminMessagesPage'
import { AdminProfilePage } from '@/pages/admin/AdminProfilePage'
import { AdminProjectFormPage } from '@/pages/admin/AdminProjectFormPage'
import { AdminProjectTagsPage } from '@/pages/admin/AdminProjectTagsPage'
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage'
import { AdminSkillsPage } from '@/pages/admin/AdminSkillsPage'
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
        { path: 'projects', element: <AdminProjectsPage /> },
        { path: 'projects/new', element: <AdminProjectFormPage /> },
        { path: 'projects/:id', element: <AdminProjectFormPage /> },
        { path: 'project-tags', element: <AdminProjectTagsPage /> },
        { path: 'skills', element: <AdminSkillsPage /> },
        { path: 'messages', element: <AdminMessagesPage /> },
        { path: '*', element: <Navigate to="/admin" replace /> },
      ],
    },
  ])
}
