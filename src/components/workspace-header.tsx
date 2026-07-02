import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import { Trash2, Undo, Redo, Plus, PanelRightClose, PanelRightOpen, Grid2X2 } from 'lucide-react';

type Props = {
  nodeCount: number
  edgeCount: number
  sidebarOpen: boolean
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onAutoLayout: () => void
  onAddEntity: () => void
  onExport: () => void
  onReset: () => void
  onToggleSidebar: () => void
}

export function WorkspaceHeader({
  nodeCount,
  edgeCount,
  sidebarOpen,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onAutoLayout,
  onAddEntity,
  onExport,
  onReset,
  onToggleSidebar,
}: Props) {
  return (
    <header className="island-shell flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2 sm:px-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <Link to="/" className="nav-link hidden text-sm sm:inline">Home</Link>
        <span className="text-sm font-bold" style={{ color: 'var(--java-orange)' }}>EntityForge</span>
      </div>
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:opacity-30"
          onClick={onUndo}
          disabled={!canUndo}
          style={{ color: 'var(--java-muted)' }}
          title="Undo (Ctrl+Z)"
        >
          <Undo className='size-4' />
        </button>
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:opacity-30"
          onClick={onRedo}
          disabled={!canRedo}
          style={{ color: 'var(--java-muted)' }}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo className='size-4' />
        </button>
        <span className="hidden text-xs sm:inline" style={{ color: 'var(--java-muted)' }}>|</span>
        <span
          className="hidden text-xs sm:inline"
          style={{ color: 'var(--java-muted)' }}
          title={`${nodeCount} Entities - ${edgeCount} relationships`}
        >
          {nodeCount}e &middot; {edgeCount}r
        </span>
        <span className="hidden text-xs sm:inline" style={{ color: 'var(--java-muted)' }}>|</span>
        <button
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:opacity-30"
          onClick={onAutoLayout}
          disabled={nodeCount < 2}
          style={{ color: 'var(--java-muted)' }}
          title="Auto layout"
        >
          <Grid2X2 className='size-4' />
        </button>
        <span className="hidden text-xs sm:inline" style={{ color: 'var(--java-muted)' }}>|</span>
        <button
          className="cursor-pointer rounded-lg px-2 py-1.5 text-xs font-semibold text-white transition-colors sm:px-3"
          style={{ backgroundColor: 'var(--java-orange)' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange-deep)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--java-orange)')}
          onClick={onAddEntity}
        >
          <span className="sm:hidden"><Plus className='size-3.5 mr-2' /></span>
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
          onClick={onExport}
        >
          <span className="sm:hidden" title="Export">↓</span>
          <span className="hidden sm:inline">Export</span>
        </button>
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-xs transition-colors"
          onClick={onReset}
          style={{ color: 'var(--java-muted)' }}
          title="Reset workspace"
        >
          <Trash2 className='size-4' />
        </button>
        <ThemeToggle />
        <button
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm transition-colors"
          onClick={onToggleSidebar}
          style={{
            color: sidebarOpen ? 'var(--java-orange)' : 'var(--java-muted)',
            backgroundColor: sidebarOpen ? 'rgba(237, 139, 0, 0.1)' : 'transparent',
          }}
          title={sidebarOpen ? 'Close code viewer' : 'Open code viewer'}
        >
          {sidebarOpen ? <PanelRightClose className='size-4' /> : <PanelRightOpen className='size-4' />}
        </button>
      </div>
    </header>
  )
}
