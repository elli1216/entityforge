import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useWorkspace } from '#/hooks/useWorkspace'
import { Canvas } from '#/components/canvas'
import { CodeViewer } from '#/components/code-viewer'
import { ThemeToggle } from '#/components/theme-toggle'

const searchSchema = z.object({
  draft: z.string().optional(),
})

export const Route = createFileRoute('/workspace')({
  validateSearch: searchSchema.parse,
  component: WorkspacePage,
})

function WorkspacePage() {
  const { workspace, updateWorkspace, addEntity } = useWorkspace()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <header className="island-shell flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-3">
          <Link to="/" className="nav-link text-sm">Home</Link>
          <span className="text-sm font-bold" style={{ color: 'var(--java-orange)' }}>EntityForge</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--java-muted)' }}>
            {workspace.nodes.length} entities &middot; {workspace.edges.length} relations
          </span>
          <button
            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--java-orange)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange)')}
            onClick={addEntity}
          >
            + New Entity
          </button>
          <ThemeToggle />
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm transition-colors"
            onClick={() => setSidebarOpen((o) => !o)}
            style={{
              color: sidebarOpen ? 'var(--java-orange)' : 'var(--java-muted)',
              backgroundColor: sidebarOpen ? 'rgba(237, 139, 0, 0.1)' : 'transparent',
            }}
            title={sidebarOpen ? 'Close code viewer' : 'Open code viewer'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </button>
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden">
        {workspace.nodes.length === 0 && !sidebarOpen ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ backgroundColor: 'rgba(237, 139, 0, 0.1)' }}
              >
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="var(--java-orange)" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <h2 className="display-title text-xl font-bold">No entities yet</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--java-muted)' }}>
                Click <strong>+ New Entity</strong> to add your first table.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-1">
            <div className="flex-1">
              <Canvas workspace={workspace} updateWorkspace={updateWorkspace} />
            </div>
            <div
              className="overflow-hidden transition-all duration-200 ease-in-out"
              style={{ width: sidebarOpen ? '420px' : '0px' }}
            >
              <div className="h-full w-105">
                <CodeViewer workspace={workspace} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
