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
import { Plus, Sparkles, Box, Code2, Layers, Cpu } from 'lucide-react'
import { RELATIONSHIP_TYPES } from '#/lib/relationship-types'
import type { Workspace } from '#/lib/schema'

const searchSchema = z.object({
  draft: z.string().optional(),
})

export const Route = createFileRoute('/workspace')({
  validateSearch: searchSchema.parse,
  component: WorkspacePage,
})

function WorkspacePage() {
  const {
    workspace,
    updateWorkspace,
    addEntity,
    resetWorkspace,
    undo,
    redo,
    canUndo,
    canRedo,
    cloneEntity,
  } = useWorkspace()
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

  const handleLoadSampleSchema = useCallback(() => {
    const userId = crypto.randomUUID()
    const orderId = crypto.randomUUID()
    const productId = crypto.randomUUID()

    const sample: Workspace = {
      nodes: [
        {
          id: userId,
          type: 'entity',
          position: { x: 80, y: 120 },
          data: {
            tableName: 'users',
            fields: [
              { id: crypto.randomUUID(), name: 'id', type: 'UUID', isPrimaryKey: true, isNullable: false, isUnique: true },
              { id: crypto.randomUUID(), name: 'email', type: 'VARCHAR', length: 128, isPrimaryKey: false, isNullable: false, isUnique: true },
              { id: crypto.randomUUID(), name: 'full_name', type: 'VARCHAR', length: 100, isPrimaryKey: false, isNullable: false, isUnique: false },
              { id: crypto.randomUUID(), name: 'role', type: 'ENUM', enumValues: ['ADMIN', 'CUSTOMER', 'SELLER'], isPrimaryKey: false, isNullable: false, isUnique: false },
            ],
            indexes: [
              { id: crypto.randomUUID(), name: 'idx_user_email', columns: ['email'], isUnique: true }
            ],
          },
        },
        {
          id: orderId,
          type: 'entity',
          position: { x: 480, y: 120 },
          data: {
            tableName: 'orders',
            fields: [
              { id: crypto.randomUUID(), name: 'id', type: 'UUID', isPrimaryKey: true, isNullable: false, isUnique: true },
              { id: crypto.randomUUID(), name: 'total_amount', type: 'DECIMAL', precision: 12, scale: 2, isPrimaryKey: false, isNullable: false, isUnique: false },
              { id: crypto.randomUUID(), name: 'status', type: 'ENUM', enumValues: ['PENDING', 'PAID', 'SHIPPED', 'CANCELLED'], isPrimaryKey: false, isNullable: false, isUnique: false },
              { id: crypto.randomUUID(), name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, isNullable: false, isUnique: false },
            ],
            indexes: [],
          },
        },
        {
          id: productId,
          type: 'entity',
          position: { x: 480, y: 400 },
          data: {
            tableName: 'products',
            fields: [
              { id: crypto.randomUUID(), name: 'id', type: 'UUID', isPrimaryKey: true, isNullable: false, isUnique: true },
              { id: crypto.randomUUID(), name: 'title', type: 'VARCHAR', length: 200, isPrimaryKey: false, isNullable: false, isUnique: false },
              { id: crypto.randomUUID(), name: 'price', type: 'DECIMAL', precision: 10, scale: 2, isPrimaryKey: false, isNullable: false, isUnique: false },
              { id: crypto.randomUUID(), name: 'stock', type: 'INTEGER', isPrimaryKey: false, isNullable: false, isUnique: false, defaultValue: '0' },
            ],
            indexes: [],
          },
        },
      ],
      edges: [
        {
          id: crypto.randomUUID(),
          source: orderId,
          target: userId,
          type: 'relationship',
          data: { relationshipType: RELATIONSHIP_TYPES.MANY_TO_ONE },
        },
      ],
    }
    updateWorkspace(autoLayout(sample))
  }, [updateWorkspace])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault()
          undo()
        }
        if (e.key === 'z' && e.shiftKey) {
          e.preventDefault()
          redo()
        }
        if (e.key === 'y') {
          e.preventDefault()
          redo()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  return (
    <div className="flex h-screen flex-col overflow-hidden">
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
      <ExportDialog
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        workspace={workspace}
      />
      <ConfirmDialog
        open={confirmReset}
        message="Are you sure you want to reset the workspace? All entity classes and associations will be cleared."
        onConfirm={() => {
          setConfirmReset(false)
          resetWorkspace()
        }}
        onCancel={() => setConfirmReset(false)}
      />
      <main className="flex flex-1 h-full w-full overflow-hidden relative min-h-0 min-w-0">
        {workspace.nodes.length === 0 ? (
          <div className="flex flex-1 h-full w-full items-center justify-center p-6 blueprint-grid overflow-y-auto">
            <div className="mx-auto max-w-lg text-center java-class-card p-8 sm:p-10 shadow-2xl border backdrop-blur-md">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-(--java-orange)/10 text-(--java-orange) shadow-xs">
                <Box className="size-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-(--oop-badge-bg) px-3 py-1 font-mono text-[11px] font-semibold text-(--java-orange) border border-(--oop-badge-border) mb-3">
                <span>package com.entityforge.domain;</span>
              </div>
              <h2 className="display-title text-2xl font-bold">
                Instantiate Java JPA Blueprint
              </h2>
              <p className="mt-2 text-xs md:text-sm text-(--java-muted) leading-relaxed">
                Design your schema as Object-Oriented JPA entities. Click below to add a blank class or initialize a sample domain model.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={addEntity}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
                  }}
                >
                  <Plus className="size-4" />
                  <span>+ Blank @Entity Class</span>
                </button>
                <button
                  onClick={handleLoadSampleSchema}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-2.5 text-xs font-semibold transition-all hover:bg-black/5 dark:hover:bg-white/5"
                  style={{
                    backgroundColor: 'var(--chip-bg)',
                    color: 'var(--java-dark)',
                  }}
                >
                  <Sparkles className="size-4 text-(--java-blue)" />
                  <span>Load E-Commerce Schema</span>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-line flex items-center justify-center gap-4 text-[11px] font-mono text-(--java-muted)">
                <span>• Zero Latency</span>
                <span>• URL Synced</span>
                <span>• Flyway DDL</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 h-full w-full overflow-hidden relative min-h-0 min-w-0">
            <div className="flex-1 h-full w-full relative min-h-0 min-w-0 overflow-hidden">
              <Canvas
                workspace={workspace}
                updateWorkspace={updateWorkspace}
                onCloneNode={cloneEntity}
              />
            </div>

            {/* Responsive Workspace Sidebar */}
            <div
              className={`transition-all duration-300 ease-in-out border-l border-line bg-(--bg-base) ${
                sidebarOpen
                  ? 'fixed inset-y-0 right-0 z-30 w-full sm:static sm:z-auto sm:w-[520px] md:w-[620px] lg:w-[720px] xl:w-[800px]'
                  : 'w-0 overflow-hidden border-none pointer-events-none'
              }`}
            >
              <div className="h-full w-full">
                <CodeViewer
                  workspace={workspace}
                  onClose={() => setSidebarOpen(false)}
                  onAddEntity={addEntity}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

