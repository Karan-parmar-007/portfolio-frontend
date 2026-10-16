import { NavLink } from 'react-router-dom'
import { useLogout } from '@/context/AuthContext'
import { cn } from '@/lib/cn'
import { ADMIN_NAV_ITEMS } from './adminNav'

export function AdminSidebar() {
  const logout = useLogout()

  return (
    <aside className="hidden w-56 shrink-0 border-r border-lightest-navy bg-light-navy md:flex md:flex-col">
      <div className="border-b border-lightest-navy px-4 py-5">
        <p className="font-mono text-xs text-green">Portfolio CMS</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={'end' in item ? Boolean(item.end) : false}
            className={({ isActive }) =>
              cn(
                'rounded px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green',
                isActive
                  ? 'bg-green-tint text-green'
                  : 'text-light-slate hover:text-green',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-lightest-navy p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="block rounded px-3 py-2 text-sm text-light-slate hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
        >
          View site
        </a>
        <button
          type="button"
          className="w-full rounded px-3 py-2 text-left text-sm text-light-slate hover:text-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          onClick={() => void logout()}
        >
          Log out
        </button>
      </div>
    </aside>
  )
}
