import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'

export function ErrorFallback({ error }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <div
        className="flex h-20 w-20 items-center justify-center rounded-2xl text-3xl font-bold text-white"
        style={{ backgroundColor: 'var(--java-orange-deep)' }}
      >
        !
      </div>
      <h1 className="display-title text-3xl font-bold">Something Went Wrong</h1>
      <p className="max-w-md text-sm" style={{ color: 'var(--java-muted)' }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <Link
        to="/"
        className="rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors"
        style={{ backgroundColor: 'var(--java-orange)' }}
      >
        Go Home
      </Link>
    </div>
  )
}
