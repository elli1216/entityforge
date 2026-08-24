import { useCallback, useState } from 'react'
import { exportProject, SPRING_BOOT_VERSIONS, JAVA_VERSIONS } from '#/lib/project-exporter'
import type { ProdDb } from '#/lib/project-exporter'
import { handleError } from '#/lib/error-handler'
import {
  Archive,
  Cpu,
  Database,
  Download,
  Layers,
  X,
} from 'lucide-react'

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
      await exportProject(workspace, {
        groupId,
        artifactId,
        packageName,
        version,
        useH2,
        prodDb,
        springBootVersion,
        javaVersion,
      })
      onClose()
    } catch (e) {
      handleError(e, 'Export failed')
    } finally {
      setExporting(false)
    }
  }, [
    workspace,
    groupId,
    artifactId,
    packageName,
    version,
    useH2,
    prodDb,
    springBootVersion,
    javaVersion,
    onClose,
  ])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 sm:items-center backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: 'var(--bg-base)',
          borderColor: 'var(--line)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Wizard Header */}
        <div
          className="flex items-center justify-between border-b px-4 py-3 sm:px-6 sm:py-4"
          style={{
            background: 'linear-gradient(135deg, var(--duke-blue), var(--java-blue-deep))',
            borderColor: 'var(--line)',
          }}
        >
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-white/10 text-amber-300 backdrop-blur-md shadow-xs">
              <Archive className="size-4 sm:size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">Spring Boot Project Initializr</h2>
                <span className="rounded bg-(--spring-green) px-1.5 py-0.2 text-[8px] sm:text-[9px] font-bold text-white uppercase">
                  Maven ZIP
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/70 font-mono">
                Compiled directly in-browser with JSZip
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 sm:h-8 sm:w-8 cursor-pointer items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Wizard Form Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Metadata Grid */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-(--java-orange) mb-2.5 sm:mb-3">
              <Cpu className="size-3.5" />
              <span>Project Coordinates</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold">Group ID</span>
                <input
                  className="rounded-lg border px-3 py-2 text-xs font-mono outline-none transition-colors focus:border-(--java-orange)"
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
                  className="rounded-lg border px-3 py-2 text-xs font-mono outline-none transition-colors focus:border-(--java-orange)"
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
                <span className="text-xs font-semibold">Package Name</span>
                <input
                  className="rounded-lg border px-3 py-2 text-xs font-mono outline-none transition-colors focus:border-(--java-orange)"
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
                <span className="text-xs font-semibold">Version</span>
                <input
                  className="rounded-lg border px-3 py-2 text-xs font-mono outline-none transition-colors focus:border-(--java-orange)"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  style={{
                    backgroundColor: 'var(--chip-bg)',
                    borderColor: 'var(--line)',
                    color: 'var(--java-dark)',
                  }}
                />
              </label>
            </div>
          </div>

          {/* JVM & Spring Boot Matrix */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-(--java-blue) mb-2.5 sm:mb-3">
              <Layers className="size-3.5" />
              <span>Target Java & Framework Runtime</span>
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold">Spring Boot Version</span>
                <select
                  className="rounded-lg border px-3 py-2 text-xs font-mono outline-none"
                  value={springBootVersion}
                  onChange={(e) => setSpringBootVersion(e.target.value)}
                  style={{
                    backgroundColor: 'var(--chip-bg)',
                    borderColor: 'var(--line)',
                    color: 'var(--java-dark)',
                  }}
                >
                  {SPRING_BOOT_VERSIONS.map((v) => (
                    <option key={v.value} value={v.value}>
                      Spring Boot {v.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-semibold">Java SDK Version</span>
                <select
                  className="rounded-lg border px-3 py-2 text-xs font-mono outline-none"
                  value={javaVersion}
                  onChange={(e) => setJavaVersion(Number(e.target.value))}
                  style={{
                    backgroundColor: 'var(--chip-bg)',
                    borderColor: 'var(--line)',
                    color: 'var(--java-dark)',
                  }}
                >
                  {JAVA_VERSIONS.map((v) => (
                    <option key={v} value={v}>
                      Java {v} {v === 17 || v === 21 ? '(LTS)' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {/* Database & Flyway Persistence */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-(--spring-green) mb-2.5 sm:mb-3">
              <Database className="size-3.5" />
              <span>Persistence & Database Driver</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prodDb"
                    value="postgresql"
                    checked={prodDb === 'postgresql'}
                    onChange={(e) => setProdDb(e.target.value as ProdDb)}
                    className="accent-(--java-orange)"
                  />
                  <span className="text-xs font-semibold font-mono">PostgreSQL</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prodDb"
                    value="mysql"
                    checked={prodDb === 'mysql'}
                    onChange={(e) => setProdDb(e.target.value as ProdDb)}
                    className="accent-(--java-orange)"
                  />
                  <span className="text-xs font-semibold font-mono">MySQL</span>
                </label>
              </div>

              <label className="flex items-center gap-2.5 rounded-lg border border-line p-2.5 bg-black/5 dark:bg-white/5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useH2}
                  onChange={(e) => setUseH2(e.target.checked)}
                  className="size-4 rounded accent-(--java-orange)"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold">Enable H2 In-Memory Database for Dev</span>
                  <span className="text-[11px] text-(--java-muted)">
                    Configures `spring.profiles.active=dev` with H2 console enabled
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Project Structure Tree Preview */}
          <div className="border-t pt-4" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[11px] font-mono text-(--java-muted) mb-2 font-bold">
              📦 Generated Project Tree:
            </div>
            <div className="rounded-lg bg-[#19181c] p-3 font-mono text-[11px] text-gray-300 space-y-1 overflow-x-auto">
              <div className="text-amber-400 font-bold">{artifactId}/</div>
              <div className="pl-3 text-gray-400">├── 📄 pom.xml</div>
              <div className="pl-3 text-gray-400">├── ⚙️ mvnw & mvnw.cmd</div>
              <div className="pl-3 text-gray-400">
                ├── 📁 src/main/java/{packageName.replace(/\./g, '/')}/
              </div>
              <div className="pl-6 text-sky-300">
                ├── ☕ {workspace.nodes.length} @Entity classes
              </div>
              <div className="pl-3 text-gray-400">
                ├── 📁 src/main/resources/db/migration/
              </div>
              <div className="pl-6 text-emerald-400">
                └── 🗄️ V1__create_initial_schema.sql
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t px-4 py-3 sm:px-6 sm:py-4"
          style={{ borderColor: 'var(--line)', backgroundColor: 'var(--surface-strong)' }}
        >
          <span className="font-mono text-[11px] sm:text-xs text-(--java-muted) text-center sm:text-left">
            {workspace.nodes.length} Entities • {workspace.edges.length} Relationships
          </span>
          <div className="flex items-center justify-end gap-2">
            <button
              className="flex-1 sm:flex-initial cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold text-(--java-muted) hover:text-(--java-dark)"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 cursor-pointer rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:scale-105 disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--java-orange), var(--java-orange-deep))',
              }}
              disabled={exporting}
              onClick={handleExport}
            >
              <Download className="size-3.5" />
              <span>{exporting ? 'Generating ZIP...' : 'Download ZIP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

