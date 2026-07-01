import { useCallback, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useWorkspace } from '#/hooks/useWorkspace'
import { Canvas } from '#/components/canvas'
import { CodeViewer } from '#/components/code-viewer'
import { ThemeToggle } from '#/components/theme-toggle'
import { ExportDialog } from '#/components/export-dialog'
import { ConfirmDialog } from '#/components/confirm-dialog'

const searchSchema = z.object({
  draft: z.string().optional(),
})

export const Route = createFileRoute('/workspace')({
  validateSearch: searchSchema.parse,
  component: WorkspacePage,
})

function WorkspacePage() {
  const { workspace, updateWorkspace, addEntity, resetWorkspace } = useWorkspace()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = useCallback(() => {
    if (workspace.nodes.length === 0 && workspace.edges.length === 0) return
    setConfirmReset(true)
  }, [workspace])

  return (
    <div className="flex h-screen flex-col">
      <header className="island-shell flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="nav-link hidden text-sm sm:inline">Home</Link>
          <span className="text-sm font-bold" style={{ color: 'var(--java-orange)' }}>EntityForge</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <span
            className="hidden text-xs sm:inline"
            style={{ color: 'var(--java-muted)' }}
            title={`${workspace.nodes.length} Entities - ${workspace.edges.length} relationships`}
          >
            {workspace.nodes.length}e &middot; {workspace.edges.length}r
          </span>
          <button
            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold text-white transition-colors sm:px-3"
            style={{ backgroundColor: 'var(--java-orange)' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange)')}
            onClick={addEntity}
          >
            <span className="sm:hidden">+</span>
            <span className="hidden sm:inline">+ New Entity</span>
          </button>
          <button
            className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors sm:px-3"
            style={{
              color: 'var(--java-blue)',
              border: '1px solid var(--java-blue)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,115,150,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            onClick={() => setExportOpen(true)}
          >
            <span className="sm:hidden" title="Export">↓</span>
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors"
            onClick={handleReset}
            style={{ color: 'var(--java-muted)' }}
            title="Reset workspace"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
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
      <ExportDialog open={exportOpen} onClose={() => setExportOpen(false)} workspace={workspace} />
      <ConfirmDialog
        open={confirmReset}
        message="Are you sure to reset workspace? Your progress will not be saved."
        onConfirm={() => { setConfirmReset(false); resetWorkspace() }}
        onCancel={() => setConfirmReset(false)}
      />
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
