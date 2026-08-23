import { AlertTriangle } from 'lucide-react'

export function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl border p-5 shadow-2xl"
        style={{
          backgroundColor: 'var(--bg-base)',
          borderColor: 'var(--line)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-(--java-dark)">Reset Domain Model?</h3>
            <p className="mt-1 text-xs text-(--java-muted) leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2 border-t border-line pt-3">
          <button
            className="cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold text-(--java-muted) hover:text-(--java-dark)"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer rounded-lg px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
            onClick={onConfirm}
          >
            Reset Workspace
          </button>
        </div>
      </div>
    </div>
  )
}

