import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import { Box, Code2, BookOpen, Menu, X, Home, ArrowRight } from 'lucide-react'

export function Header() {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="island-shell sticky top-0 z-50 flex flex-col border-b backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="group flex items-center gap-2.5 text-inherit no-underline"
          >
            <img
              className="size-7.5 sm:size-8 shrink-0 transition-transform duration-300 group-hover:scale-105"
              src="/header-logo.png"
              alt="EntityForge Logo"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span
                  className="text-base sm:text-lg font-extrabold tracking-tight"
                  style={{ color: 'var(--java-orange)' }}
                >
                  EntityForge
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/workspace"
            className="group relative inline-flex items-center gap-1.5 sm:gap-2 overflow-hidden rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background:
                'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
              boxShadow: '0 4px 14px rgba(237, 139, 0, 0.35)',
            }}
          >
            <Code2 className="size-3.5 transition-transform group-hover:rotate-12" />
            <span className="hidden xs:inline">Launch Studio</span>
            <span className="xs:hidden">Studio</span>
            <span className="hidden rounded bg-black/20 px-1 py-0.5 text-[9px] font-mono lg:inline-block">
              Shift+W
            </span>
          </Link>

          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-line text-(--java-muted) hover:text-(--java-dark) hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </button>
        </div>
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
