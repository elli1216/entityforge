import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import { Box, BookOpen, Home, ArrowRight } from 'lucide-react'

export function Header() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="island-shell sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="flex items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <img className="size-10" src="/header-logo.png" alt="logo/" />
          <span
            className="hidden md:block text-xl font-bold"
            style={{ color: 'var(--java-orange)' }}
          >
            EntityForge
          </span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/workspace"
          className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
          style={{
            backgroundColor: 'var(--java-orange)',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'var(--java-orange)')
          }
        >
          Open Workspace
        </Link>
        <ThemeToggle />
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-line bg-(--surface-strong) px-4 py-3 space-y-1.5 font-mono text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
              currentPath === '/'
                ? 'bg-(--java-orange)/10 text-(--java-orange) font-bold'
                : 'text-(--java-muted)'
            }`}
          >
            <div className="flex items-center gap-2">
              <Home className="size-4 text-(--java-orange)" />
              <span>Home Overview</span>
            </div>
            <ArrowRight className="size-3 opacity-50" />
          </Link>
          <Link
            to="/workspace"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
              currentPath === '/workspace'
                ? 'bg-(--java-orange)/10 text-(--java-orange) font-bold'
                : 'text-(--java-muted)'
            }`}
          >
            <div className="flex items-center gap-2">
              <Box className="size-4 text-(--java-orange)" />
              <span>Interactive Workspace Studio</span>
            </div>
            <ArrowRight className="size-3 opacity-50" />
          </Link>
          <Link
            to="/documentation"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between rounded-lg p-2.5 transition-colors ${
              currentPath === '/documentation'
                ? 'bg-(--java-blue)/10 text-(--java-blue) font-bold'
                : 'text-(--java-muted)'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-(--java-blue)" />
              <span>JPA Specification Handbook</span>
            </div>
            <ArrowRight className="size-3 opacity-50" />
          </Link>
        </div>
      )}
    </header>
  )
}
