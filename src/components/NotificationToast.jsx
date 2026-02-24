/**
 * Small toast notification for lower-right corner.
 * Slide in from right → stay → slide back out to right; auto-dismiss.
 */
import { useEffect, useState, useRef } from 'react'

const EXIT_DURATION_MS = 350

export default function NotificationToast({ type = 'success', title, message, onClose, duration = 3500 }) {
  const isSuccess = type === 'success'
  const [exiting, setExiting] = useState(false)
  const exitTimeoutRef = useRef(null)
  const closeTimeoutRef = useRef(null)

  useEffect(() => {
    const delayBeforeExit = Math.max(0, duration - EXIT_DURATION_MS)
    closeTimeoutRef.current = setTimeout(() => {
      setExiting(true)
      exitTimeoutRef.current = setTimeout(onClose, EXIT_DURATION_MS)
    }, delayBeforeExit)
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current)
      if (exitTimeoutRef.current) clearTimeout(exitTimeoutRef.current)
    }
  }, [duration, onClose])

  return (
    <div
      className={`fixed bottom-5 right-5 z-[110] flex max-w-[320px] items-start gap-3 rounded-xl border shadow-lg overflow-hidden ${exiting ? 'toast-exit' : 'toast-enter'}`}
      style={{
        background: isSuccess
          ? 'linear-gradient(135deg, #f0f9f4 0%, #ffffff 100%)'
          : 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
        borderColor: isSuccess ? 'rgba(30, 77, 43, 0.25)' : 'rgba(220, 38, 38, 0.25)',
        boxShadow: '0 10px 40px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.04)',
      }}
      role="status"
      aria-live="polite"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isSuccess ? 'bg-primary/15 text-primary' : 'bg-red-100 text-red-600'}`}
      >
        <iconify-icon
          icon={isSuccess ? 'mdi:check-circle' : 'mdi:alert-circle'}
          width="22"
          height="22"
        />
      </div>
      <div className="min-w-0 py-3 pr-4">
        <p className="text-sm font-bold text-content leading-tight">{title}</p>
        <p className="text-xs text-text-muted mt-0.5 leading-snug">{message}</p>
      </div>
    </div>
  )
}
