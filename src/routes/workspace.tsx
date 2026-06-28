import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useWorkspace } from '#/hooks/useWorkspace'
import { Canvas } from '#/components/canvas'

const searchSchema = z.object({
  draft: z.string().optional(),
})

export const Route = createFileRoute('/workspace')({
  validateSearch: searchSchema.parse,
  component: WorkspacePage,
})

function WorkspacePage() {
  const { workspace, updateWorkspace, addEntity } = useWorkspace()

  return (
    <div className="flex h-screen flex-col">
      <header
        className="island-shell flex shrink-0 items-center justify-between border-b px-4 py-2"
      >
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
        </div>
      </header>
      <main className="flex flex-1">
        {workspace.nodes.length === 0 ? (
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
          <Canvas workspace={workspace} updateWorkspace={updateWorkspace} />
        )}
      </main>
    </div>
  )
}
