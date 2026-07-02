import { useCallback, useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { useWorkspace } from '#/hooks/useWorkspace'
import { autoLayout } from '#/lib/auto-layout'
import { Canvas } from '#/components/canvas'
import { CodeViewer } from '#/components/code-viewer'
import { WorkspaceHeader } from '#/components/workspace-header'
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
  const { workspace, updateWorkspace, addEntity, resetWorkspace, undo, redo, canUndo, canRedo, cloneEntity } = useWorkspace()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleReset = useCallback(() => {
    if (workspace.nodes.length === 0 && workspace.edges.length === 0) return
    setConfirmReset(true)
  }, [workspace])

  const handleAutoLayout = useCallback(() => {
    updateWorkspace(autoLayout(workspace))
  }, [workspace, updateWorkspace])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
        if (e.key === 'z' && e.shiftKey) { e.preventDefault(); redo() }
        if (e.key === 'y') { e.preventDefault(); redo() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return (
    <div className="flex h-screen flex-col">
      <WorkspaceHeader
        nodeCount={workspace.nodes.length}
        edgeCount={workspace.edges.length}
        sidebarOpen={sidebarOpen}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onAutoLayout={handleAutoLayout}
        onAddEntity={addEntity}
        onExport={() => setExportOpen(true)}
        onReset={handleReset}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
      />
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
              <Canvas workspace={workspace} updateWorkspace={updateWorkspace} onCloneNode={cloneEntity} />
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
