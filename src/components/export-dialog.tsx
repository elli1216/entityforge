import { useCallback, useState } from 'react'
import { exportProject, SPRING_BOOT_VERSIONS, JAVA_VERSIONS } from '#/lib/project-exporter'
import type { ProdDb } from '#/lib/project-exporter'
import { handleError } from '#/lib/error-handler'

export function ExportDialog({
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
    } catch (e) {
      handleError(e, 'Export failed')
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
