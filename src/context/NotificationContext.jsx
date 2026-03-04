import { createContext, useContext, useState, useCallback } from 'react'
import NotificationToast from '../components/NotificationToast'
import NotificationModal from '../components/NotificationModal'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null)
  const [modal, setModal] = useState(null)

  const showNotification = useCallback(({ type = 'success', title, message, toast: useToast = false }) => {
    if (useToast) {
      setToast({ type, title, message })
    } else {
      setModal({ type, title, message })
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {toast && (
        <NotificationToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      {modal && (
        <NotificationModal
          open={!!modal}
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
