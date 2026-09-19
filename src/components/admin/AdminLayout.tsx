import { Outlet } from 'react-router-dom'
import { AdminHeader } from './AdminHeader'
import { AdminSidebar } from './AdminSidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-navy text-slate">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
