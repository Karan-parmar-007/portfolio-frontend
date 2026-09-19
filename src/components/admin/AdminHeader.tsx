import { Link, useLocation } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/AuthContext'
import { ADMIN_NAV_ITEMS } from './adminNav'

export function AdminHeader() {
  const { session, logout } = useAuth()
  const location = useLocation()
  const current =
    ADMIN_NAV_ITEMS.find((item) => {
      const end = 'end' in item && item.end
      return end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to)
    })?.label ?? 'Admin'

  return (
    <header className="flex items-center justify-between border-b border-lightest-navy bg-light-navy/50 px-6 py-4">
      <div>
        <h1 className="text-lg font-semibold text-lightest-slate">{current}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <a href="/" target="_blank" rel="noreferrer">
            View site
          </a>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              {session?.email ?? 'Account'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/">Public site</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void logout()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
