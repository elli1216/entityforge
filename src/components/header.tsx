import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'

export function Header() {
  return (
    <header className="island-shell sticky top-0 z-50 flex items-center justify-between border-b px-6 py-3">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
          <img className="size-10" src="/header-logo.png" alt="logo/" />
          <span className="hidden md:block text-xl font-bold" style={{ color: 'var(--java-orange)' }}>
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
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange)')}
        >
          Open Workspace
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}
