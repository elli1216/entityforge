import { Link } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { AlertOctagon, RotateCcw, Home } from 'lucide-react'

export function ErrorFallback({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center blueprint-grid">
      <div className="mx-auto max-w-lg java-class-card p-8 shadow-2xl border backdrop-blur-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 shadow-xs">
          <AlertOctagon className="size-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 font-mono text-[11px] font-bold text-red-500 border border-red-500/20 mb-3">
          <span>java.lang.RuntimeException</span>
        </div>

        <h1 className="display-title text-2xl font-bold">Uncaught Exception</h1>

        <div className="my-4 max-h-48 overflow-y-auto rounded-lg bg-[#19181c] p-3.5 text-left font-mono text-[11px] text-gray-300">
          <div className="text-red-400 font-bold">
            {error.name || 'Error'}: {error.message || 'An unexpected runtime error occurred.'}
          </div>
          {error.stack && (
            <pre className="mt-2 text-[10px] text-gray-500 whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {reset && (
            <button
              onClick={reset}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
              }}
            >
              <RotateCcw className="size-4" />
              <span>Retry Execution</span>
            </button>
          )}
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-2.5 text-xs font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              backgroundColor: 'var(--chip-bg)',
              color: 'var(--java-dark)',
            }}
          >
            <Home className="size-4 text-(--java-blue)" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

