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
      className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={onCancel}
    >
      <div
        className="mx-4 w-full max-w-sm rounded-xl border p-5 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-base)',
          borderColor: 'var(--line)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm" style={{ color: 'var(--java-dark)' }}>
          {message}
        </p>
        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
            onClick={onCancel}
            style={{ color: 'var(--java-muted)' }}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: 'var(--java-orange)' }}
            onClick={onConfirm}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
