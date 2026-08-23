import { Link } from '@tanstack/react-router'
import { ThemeToggle } from '#/components/theme-toggle'
import {
  Trash2,
  Undo,
  Redo,
  Plus,
  PanelRightClose,
  PanelRightOpen,
  Grid2X2,
  Download,
  Box,
  Workflow,
  Sparkles,
  Code2,
} from 'lucide-react'

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
    <header className="island-shell flex shrink-0 items-center justify-between gap-1.5 sm:gap-3 border-b px-2.5 py-1.5 sm:px-4 sm:py-2 backdrop-blur-md overflow-x-auto scrollbar-none">
      {/* Left: Brand & Java Package Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          to="/"
          className="group flex items-center gap-1.5 sm:gap-2.5 text-inherit no-underline"
        >
          <img
            className="size-6 sm:size-7 shrink-0 transition-transform duration-300 group-hover:scale-105"
            src="/header-logo.png"
            alt="EntityForge Logo"
          />
          <span
            className="text-xs sm:text-sm font-extrabold tracking-tight"
            style={{ color: 'var(--java-orange)' }}
          >
            EntityForge
          </span>
        </Link>

        <div className="hidden xl:flex items-center gap-1.5 rounded-md bg-black/5 dark:bg-white/5 px-2 py-0.5 font-mono text-[11px] text-(--java-muted) border border-line">
          <span className="text-purple-500 font-semibold">package</span>
          <span>com.entityforge.domain;</span>
        </div>
      </div>

      {/* Center / Right: IDE Controls & Actions */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Undo / Redo */}
        <div className="flex items-center rounded-lg border border-line p-0.5 bg-black/5 dark:bg-white/5">
          <button
            className="flex h-6.5 w-6.5 sm:h-7 sm:w-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:opacity-25 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onUndo}
            disabled={!canUndo}
            style={{ color: 'var(--java-muted)' }}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="size-3 sm:size-3.5" />
          </button>
          <button
            className="flex h-6.5 w-6.5 sm:h-7 sm:w-7 cursor-pointer items-center justify-center rounded text-xs transition-colors disabled:opacity-25 hover:bg-black/5 dark:hover:bg-white/5"
            onClick={onRedo}
            disabled={!canRedo}
            style={{ color: 'var(--java-muted)' }}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="size-3 sm:size-3.5" />
          </button>
        </div>

        {/* Live OOP Architecture Counters */}
        <div
          className="hidden md:flex items-center gap-2 rounded-lg border border-line px-2.5 py-1 font-mono text-[11px]"
          style={{
            backgroundColor: 'var(--chip-bg)',
            color: 'var(--java-muted)',
          }}
          title={`${nodeCount} Java Classes (@Entity) • ${edgeCount} Associations`}
        >
          <div className="flex items-center gap-1">
            <Box className="size-3 text-(--java-orange)" />
            <span className="font-bold text-(--java-dark)">{nodeCount}</span>
            <span>class{nodeCount === 1 ? '' : 'es'}</span>
          </div>
          <span className="text-gray-400">|</span>
          <div className="flex items-center gap-1">
            <Workflow className="size-3 text-(--java-blue)" />
            <span className="font-bold text-(--java-dark)">{edgeCount}</span>
            <span>rel</span>
          </div>
        </div>

        {/* Auto Layout (UML Dagre) */}
        <button
          className="flex h-7 sm:h-8 items-center gap-1 cursor-pointer rounded-lg border border-line px-2 sm:px-2.5 text-xs font-medium transition-colors disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5"
          onClick={onAutoLayout}
          disabled={nodeCount < 2}
          style={{ color: 'var(--java-muted)' }}
          title="Auto-arrange entity graph (UML layout)"
        >
          <Grid2X2 className="size-3 sm:size-3.5 text-(--java-blue)" />
          <span className="hidden lg:inline">Auto Layout</span>
        </button>

        {/* New Entity / Class Action */}
        <button
          className="flex h-7 sm:h-8 cursor-pointer items-center gap-1 sm:gap-1.5 rounded-lg px-2 sm:px-3 text-xs font-bold text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5"
          style={{
            background:
              'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
          }}
          onClick={onAddEntity}
        >
          <Plus className="size-3 sm:size-3.5" />
          <span className="hidden xs:inline">@Entity</span>
          <span className="xs:hidden">Class</span>
        </button>

        {/* Export Maven ZIP */}
        <button
          className="flex h-7 sm:h-8 cursor-pointer items-center gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
          style={{
            borderColor: 'var(--java-blue)',
            color: 'var(--java-blue)',
            backgroundColor: 'rgba(0, 115, 150, 0.08)',
          }}
          onClick={onExport}
        >
          <Download className="size-3 sm:size-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Reset */}
        <button
          className="flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-lg border border-line text-xs transition-colors hover:text-red-500 hover:border-red-400"
          onClick={onReset}
          style={{ color: 'var(--java-muted)' }}
          title="Reset Workspace"
        >
          <Trash2 className="size-3 sm:size-3.5" />
        </button>

        <ThemeToggle />

        {/* Code Viewer Panel Toggle */}
        <button
          className="flex h-7 sm:h-8 items-center gap-1 sm:gap-1.5 cursor-pointer rounded-lg px-2 sm:px-2.5 text-xs font-bold transition-all border"
          onClick={onToggleSidebar}
          style={{
            borderColor: sidebarOpen ? 'var(--java-orange)' : 'var(--line)',
            color: sidebarOpen ? 'var(--java-orange)' : 'var(--java-muted)',
            backgroundColor: sidebarOpen
              ? 'rgba(237, 139, 0, 0.12)'
              : 'transparent',
          }}
          title={sidebarOpen ? 'Close Code Inspector' : 'Open Code Inspector'}
        >
          <Code2 className="size-3 sm:size-3.5" />
          <span className="hidden sm:inline">
            {sidebarOpen ? 'Hide Code' : 'Inspect'}
          </span>
          {sidebarOpen ? (
            <PanelRightClose className="size-3 sm:size-3.5 ml-0.5 hidden sm:inline" />
          ) : (
            <PanelRightOpen className="size-3 sm:size-3.5 ml-0.5 hidden sm:inline" />
          )}
        </button>
      </div>
    </header>
  )
}
