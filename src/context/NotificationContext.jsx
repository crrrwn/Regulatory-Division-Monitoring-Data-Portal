import { createContext, useContext, useState } from 'react'
import NotificationModal from '../components/NotificationModal'
import NotificationToast from '../components/NotificationToast'

const NotificationContext = createContext(null)

export function useNotification() {
  const ctx = useContext(NotificationContext)
  if (!ctx) return { showNotification: () => {}, hideNotification: () => {} }
  return ctx
}

export function NotificationProvider({ children }) {
  const [notification, setNotification] = useState(null)

  const showNotification = (opts) => {
    setNotification({
      type: opts.type || 'success',
      title: opts.title || (opts.type === 'error' ? 'Error' : 'Success'),
      message: opts.message || '',
      toast: opts.toast === true,
    })
  }

  const hideNotification = () => setNotification(null)

  const isToast = notification?.toast === true

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && isToast && (
        <NotificationToast
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
      {notification && !isToast && (
        <NotificationModal
          open={!!notification}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  )
}
