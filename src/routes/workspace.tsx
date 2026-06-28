import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useWorkspace } from '#/hooks/useWorkspace'

const searchSchema = z.object({
  draft: z.string().optional(),
})

export const Route = createFileRoute('/workspace')({
  validateSearch: searchSchema.parse,
  component: WorkspacePage,
})

function WorkspacePage() {
  const { workspace } = useWorkspace()

  return (
    <div className="flex h-screen flex-col">
      <header className="island-shell flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="nav-link text-sm"
          >
            Home
          </Link>
          <h1 className="display-title text-2xl font-bold">EntityForge</h1>
        </div>
        <span className="island-kicker text-sm">Workspace</span>
      </header>
      <main className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-(--java-muted)">
            Canvas loading...
          </p>
          <p className="mt-2 text-sm text-(--java-muted) opacity-60">
            {workspace.nodes.length} entities, {workspace.edges.length} relationships
          </p>
        </div>
      </main>
    </div>
  )
}
