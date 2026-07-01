import { useCallback, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { z } from 'zod'
import { useWorkspace } from '#/hooks/useWorkspace'
import { Canvas } from '#/components/canvas'
import { CodeViewer } from '#/components/code-viewer'
import { ThemeToggle } from '#/components/theme-toggle'
import { exportProject, SPRING_BOOT_VERSIONS, JAVA_VERSIONS } from '#/lib/project-exporter'
import type { ProdDb } from '#/lib/project-exporter'

const searchSchema = z.object({
  draft: z.string().optional(),
})

export const Route = createFileRoute('/workspace')({
  validateSearch: searchSchema.parse,
  component: WorkspacePage,
})

function ExportDialog({
  open,
  onClose,
  workspace,
}: {
  open: boolean
  onClose: () => void
  workspace: Parameters<typeof exportProject>[0]
}) {
  const [groupId, setGroupId] = useState('com.entityforge')
  const [artifactId, setArtifactId] = useState('entity-forge-app')
  const [packageName, setPackageName] = useState('com.entityforge.domain')
  const [version, setVersion] = useState('1.0.0')
  const [useH2, setUseH2] = useState(true)
  const [prodDb, setProdDb] = useState<ProdDb>('postgresql')
  const [springBootVersion, setSpringBootVersion] = useState('4.1.0')
  const [javaVersion, setJavaVersion] = useState(26)
  const [exporting, setExporting] = useState(false)

  const handleExport = useCallback(async () => {
    setExporting(true)
    try {
      await exportProject(workspace, { groupId, artifactId, packageName, version, useH2, prodDb, springBootVersion, javaVersion })
      onClose()
    } catch {
      // download failed
    } finally {
      setExporting(false)
    }
  }, [workspace, groupId, artifactId, packageName, version, useH2, prodDb, springBootVersion, javaVersion, onClose])

  if (!open) return null

  return (
      <div
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-4 pb-8 sm:items-center sm:pt-0 sm:pb-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      >
        <div
          className="mx-4 w-full max-w-md rounded-xl border p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          style={{
            backgroundColor: 'var(--bg-base)',
            borderColor: 'var(--line)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
        <h2 className="display-title text-lg font-bold">Export Project</h2>
        <p className="mt-1 text-xs" style={{ color: 'var(--java-muted)' }}>
          Configure your Maven project and download a ZIP.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold">Group ID</span>
            <input
              className="rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-(--java-orange)"
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              style={{
                backgroundColor: 'var(--chip-bg)',
                borderColor: 'var(--line)',
                color: 'var(--java-dark)',
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold">Artifact ID</span>
            <input
              className="rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-(--java-orange)"
              value={artifactId}
              onChange={(e) => setArtifactId(e.target.value)}
              style={{
                backgroundColor: 'var(--chip-bg)',
                borderColor: 'var(--line)',
                color: 'var(--java-dark)',
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold">Package</span>
            <input
              className="rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-(--java-orange)"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              style={{
                backgroundColor: 'var(--chip-bg)',
                borderColor: 'var(--line)',
                color: 'var(--java-dark)',
              }}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold">Project Version</span>
            <input
              className="rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-(--java-orange)"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              style={{
                backgroundColor: 'var(--chip-bg)',
                borderColor: 'var(--line)',
                color: 'var(--java-dark)',
              }}
            />
          </label>

          <div className="border-t pt-3" style={{ borderColor: 'var(--line)' }}>
            <span className="text-xs font-semibold">Spring Boot Version</span>
            <select
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              value={springBootVersion}
              onChange={(e) => setSpringBootVersion(e.target.value)}
              style={{
                backgroundColor: 'var(--chip-bg)',
                borderColor: 'var(--line)',
                color: 'var(--java-dark)',
              }}
            >
              {SPRING_BOOT_VERSIONS.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>

          <div className="border-t pt-3" style={{ borderColor: 'var(--line)' }}>
            <span className="text-xs font-semibold">Java Version</span>
            <select
              className="mt-2 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              value={javaVersion}
              onChange={(e) => setJavaVersion(Number(e.target.value))}
              style={{
                backgroundColor: 'var(--chip-bg)',
                borderColor: 'var(--line)',
                color: 'var(--java-dark)',
              }}
            >
              {JAVA_VERSIONS.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="border-t pt-3" style={{ borderColor: 'var(--line)' }}>
            <span className="text-xs font-semibold">Database</span>

            <label className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={useH2}
                onChange={(e) => setUseH2(e.target.checked)}
                className="h-4 w-4 cursor-pointer accent-(--java-orange)"
              />
              <span className="text-xs" style={{ color: 'var(--java-muted)' }}>
                Include H2 in-memory database (dev profile)
              </span>
            </label>

            <div className="mt-3 flex flex-col gap-1.5">
              <span className="text-xs" style={{ color: 'var(--java-muted)' }}>
                Production database:
              </span>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="prodDb"
                  value="postgresql"
                  checked={prodDb === 'postgresql'}
                  onChange={(e) => setProdDb(e.target.value as ProdDb)}
                  className="h-4 w-4 cursor-pointer accent-(--java-orange)"
                />
                <span className="text-xs">PostgreSQL</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="prodDb"
                  value="mysql"
                  checked={prodDb === 'mysql'}
                  onChange={(e) => setProdDb(e.target.value as ProdDb)}
                  className="h-4 w-4 cursor-pointer accent-(--java-orange)"
                />
                <span className="text-xs">MySQL</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            onClick={onClose}
            style={{ color: 'var(--java-muted)' }}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--java-orange)' }}
            disabled={exporting}
            onClick={handleExport}
          >
            {exporting ? 'Exporting...' : 'Download ZIP'}
          </button>
        </div>
      </div>
    </div>
  )
}

function WorkspacePage() {
  const { workspace, updateWorkspace, addEntity } = useWorkspace()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)

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
          <button
            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{
              color: 'var(--java-blue)',
              border: '1px solid var(--java-blue)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0,115,150,0.08)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
            onClick={() => setExportOpen(true)}
          >
            Export
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
