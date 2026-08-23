import { Link } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft, Terminal } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center blueprint-grid">
      <div className="mx-auto max-w-md java-class-card p-8 shadow-2xl border backdrop-blur-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 shadow-xs">
          <AlertCircle className="size-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-1 font-mono text-[11px] font-bold text-rose-500 border border-rose-500/20 mb-3">
          <span>java.lang.ClassNotFoundException</span>
        </div>

        <h1 className="display-title text-2xl font-bold">404 - Route Not Found</h1>

        <div className="my-4 rounded-lg bg-[#19181c] p-3 text-left font-mono text-[11px] text-gray-300">
          <div className="text-rose-400 font-semibold">
            Exception: Target route could not be loaded into the ApplicationContext.
          </div>
          <div className="mt-1 text-gray-500 text-[10px]">
            at com.entityforge.router.DispatcherServlet.doDispatch(DispatcherServlet.java:404)
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
            }}
          >
            <ArrowLeft className="size-4" />
            <span>Return to Main</span>
          </Link>
          <Link
            to="/workspace"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-2.5 text-xs font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5"
            style={{
              backgroundColor: 'var(--chip-bg)',
              color: 'var(--java-dark)',
            }}
          >
            <Terminal className="size-4 text-(--java-blue)" />
            <span>Open Studio</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

