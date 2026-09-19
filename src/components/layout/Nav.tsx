import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { X, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FadeDown } from '@/components/common/FadeIn'
import { mediaUrl } from '@/lib/mediaUrl'
import { cn } from '@/lib/cn'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { useAuth } from '@/context/AuthContext'
import { env } from '@/lib/env'
import { appsHomeUrl } from '@/lib/apps'
import { ssoFrontendUrl } from '@/lib/ssoClient'
import type { NavSection } from '@/lib/sections'
import type { MediaRef } from '@/types/media'

function firstNameLetter(name: string | null | undefined, email: string | null | undefined): string {
  const first = (name || '').trim().split(/\s+/)[0]
  if (first) return first.charAt(0).toUpperCase()
  if (email) return email.charAt(0).toUpperCase()
  return '?'
}

function ssoAuthUrl(path: '/login' | '/signup'): string {
  const url = new URL(path, env.SSO_FRONTEND_URL)
  url.searchParams.set('next', window.location.href)
  return url.toString()
}

export function Nav({
  sections,
  profileName,
  resume,
  animateIn,
}: {
  sections: NavSection[]
  profileName?: string
  resume: MediaRef | null
  animateIn: boolean
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const { session } = useAuth()
  const isHomePage = location.pathname === '/'
  const activeId = useScrollSpy(sections.map((s) => s.id), 140)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const resumeHref = mediaUrl(resume)

  // Always keep navbar sticky at top (never vanish on scroll)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [menuOpen])

  type NavItem = { href: string; text: string; number?: string }

  const homeItems: NavItem[] = sections.map((s) => ({
    href: `#${s.id}`,
    text: s.label,
    number: s.number,
  }))

  const otherItems: NavItem[] = [
    { href: '/', text: 'Home' },
    { href: appsHomeUrl(), text: 'Projects' },
    { href: '/skills', text: 'Skills' },
  ]

  const navItems = isHomePage ? homeItems : otherItems

  const isActive = (href: string) => {
    if (href.startsWith('#')) return activeId === href.slice(1)
    return location.pathname === href
  }

  const handleNavClick = (href: string) => {
    setMenuOpen(false)
    if (href.startsWith('#')) {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
      return
    }
    if (/^https?:\/\//i.test(href)) {
      window.location.assign(href)
      return
    }
    navigate(href)
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isHomePage) {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ease-in-out',
        isScrolled
          ? 'h-20 bg-navy/90 shadow-lg shadow-navy-shadow/60 backdrop-blur-md'
          : 'h-24 bg-transparent',
      )}
    >
      <nav className="flex h-full w-full items-center justify-between px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
        {/* Brand Logo - Original Logo Asset from old website */}
        <FadeDown delay={0} enabled={animateIn} className="flex-shrink-0">
          <Link
            to="/"
            onClick={handleLogoClick}
            aria-label={profileName ? `${profileName} - Home` : 'Home'}
            className="group flex items-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          >
            <div className="relative flex h-11 w-11 items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-10 w-10 object-contain"
                onError={(e) => {
                  const target = e.currentTarget
                  if (target.src.indexOf('file.png') === -1) {
                    target.src = '/file.png'
                  }
                }}
              />
            </div>
          </Link>
        </FadeDown>

        {/* Desktop Navigation (visible on lg screens and up to avoid crowding on tablets) */}
        <div className="hidden items-center gap-6 lg:flex xl:gap-8">
          <ol className="flex items-center gap-5 xl:gap-7">
            {navItems.map((item, index) => (
              <li key={item.href}>
                <FadeDown delay={(index + 1) * 0.08} enabled={animateIn}>
                  {item.href.startsWith('#') ? (
                    <a
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(item.href)
                      }}
                      className={cn(
                        'group flex items-center gap-1.5 font-mono text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green xl:text-sm',
                        isActive(item.href)
                          ? 'text-green font-semibold'
                          : 'text-lightest-slate hover:text-green',
                      )}
                    >
                      {item.number ? (
                        <span className="text-green">{item.number}.</span>
                      ) : null}
                      <span className="font-sans text-xs tracking-wide transition-colors xl:text-sm">
                        {item.text}
                      </span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleNavClick(item.href)}
                      className={cn(
                        'group flex items-center gap-1.5 font-mono text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green xl:text-sm',
                        isActive(item.href)
                          ? 'text-green font-semibold'
                          : 'text-lightest-slate hover:text-green',
                      )}
                    >
                      {item.number ? (
                        <span className="text-green">{item.number}.</span>
                      ) : null}
                      <span className="font-sans text-xs tracking-wide transition-colors xl:text-sm">
                        {item.text}
                      </span>
                    </button>
                  )}
                </FadeDown>
              </li>
            ))}
          </ol>

          {resumeHref ? (
            <FadeDown delay={(navItems.length + 1) * 0.08} enabled={animateIn}>
              <Button
                asChild
                className="h-9 rounded border border-green bg-transparent px-4 font-mono text-xs text-green transition-all duration-200 hover:bg-green-tint hover:shadow-lg hover:shadow-green/10"
              >
                <a href={resumeHref} target="_blank" rel="noreferrer">
                  Resume
                </a>
              </Button>
            </FadeDown>
          ) : null}

          <FadeDown delay={(navItems.length + 2) * 0.08} enabled={animateIn}>
            {session?.authenticated ? (
              <a
                href={ssoFrontendUrl('/account')}
                aria-label="Open SSO profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-green font-mono text-sm font-semibold text-green transition-colors hover:bg-green-tint"
              >
                {firstNameLetter(session.name, session.email)}
              </a>
            ) : (
              <Button
                asChild
                className="h-9 rounded border border-green bg-transparent px-4 font-mono text-xs text-green transition-all duration-200 hover:bg-green-tint hover:shadow-lg hover:shadow-green/10"
              >
                <a href={ssoAuthUrl('/login')}>Log in / Sign up</a>
              </Button>
            )}
          </FadeDown>
        </div>

        {/* Mobile / Tablet Hamburger Button (visible on < lg screens) */}
        <button
          id="mobile-menu-button"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-50 flex h-11 w-11 items-center justify-center rounded p-2 text-green lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="h-7 w-7 text-green transition-transform duration-200" />
          ) : (
            <Menu className="h-7 w-7 text-green transition-transform duration-200" />
          )}
        </button>
      </nav>

      {/* Mobile Backdrop */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-navy/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Slide-Out Drawer */}
      <aside
        id="navbar-menu"
        className={cn(
          'fixed top-0 right-0 bottom-0 z-40 flex h-screen w-[min(80vw,340px)] flex-col justify-center bg-light-navy px-8 py-12 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <nav className="w-full">
          <ol className="flex flex-col items-center gap-5 text-center">
            {navItems.map((item) => (
              <li key={item.href} className="w-full">
                {item.href.startsWith('#') ? (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      handleNavClick(item.href)
                    }}
                    className={cn(
                      'flex items-center justify-center gap-2.5 rounded-lg py-2.5 transition-colors',
                      isActive(item.href)
                        ? 'text-green font-semibold'
                        : 'text-lightest-slate hover:text-green',
                    )}
                  >
                    {item.number ? (
                      <span className="font-mono text-sm text-green">{item.number}.</span>
                    ) : null}
                    <span className="text-base sm:text-lg">{item.text}</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.href)}
                    className={cn(
                      'flex w-full items-center justify-center gap-2.5 rounded-lg py-2.5 text-center transition-colors',
                      isActive(item.href)
                        ? 'text-green font-semibold'
                        : 'text-lightest-slate hover:text-green',
                    )}
                  >
                    {item.number ? (
                      <span className="font-mono text-sm text-green">{item.number}.</span>
                    ) : null}
                    <span className="text-base sm:text-lg">{item.text}</span>
                  </button>
                )}
              </li>
            ))}
          </ol>

          {resumeHref ? (
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                className="h-12 w-full max-w-[200px] rounded border border-green bg-transparent px-6 font-mono text-sm text-green hover:bg-green-tint"
              >
                <a href={resumeHref} target="_blank" rel="noreferrer">
                  Resume
                </a>
              </Button>
            </div>
          ) : null}

          <div className="mt-6 flex justify-center">
            {session?.authenticated ? (
              <a
                href={ssoFrontendUrl('/account')}
                onClick={() => setMenuOpen(false)}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-green font-mono text-lg font-semibold text-green"
                aria-label="Open SSO profile"
              >
                {firstNameLetter(session.name, session.email)}
              </a>
            ) : (
              <Button
                asChild
                className="h-12 w-full max-w-[200px] rounded border border-green bg-transparent px-6 font-mono text-sm text-green hover:bg-green-tint"
              >
                <a href={ssoAuthUrl('/login')}>Log in / Sign up</a>
              </Button>
            )}
          </div>
        </nav>
      </aside>
    </header>
  )
}
