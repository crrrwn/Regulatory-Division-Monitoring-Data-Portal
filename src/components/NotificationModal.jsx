/**
 * Reusable notification message modal (success / error).
 * High visibility: dark backdrop, strong shadow, larger text.
 */
export default function NotificationModal({ open, onClose, type = 'success', title, message }) {
  if (!open) return null

  const isSuccess = type === 'success'

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-[fade-in_0.2s_ease-out]"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden modal-in border-2 border-primary/20 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(30,77,43,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <div
            className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
              isSuccess ? 'bg-primary/20 text-primary ring-4 ring-primary/20' : 'bg-red-100 text-red-600 ring-4 ring-red-200'
            }`}
          >
            <iconify-icon
              icon={isSuccess ? 'mdi:check-circle' : 'mdi:alert-circle'}
              width="40"
            />
          </div>
          <h3 className="text-xl font-black text-content mb-2 tracking-tight">{title}</h3>
          <p className="text-content/90 text-base font-medium leading-relaxed">{message}</p>
        </div>
        <div className="px-8 pb-8">
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
              isSuccess ? 'bg-primary hover:bg-primary-dark shadow-primary/25' : 'bg-red-600 hover:bg-red-700 shadow-red-900/20'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
