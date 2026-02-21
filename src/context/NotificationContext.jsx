import { createContext, useContext, useState } from 'react'
import NotificationModal from '../components/NotificationModal'

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
    })
  }

  const hideNotification = () => setNotification(null)

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
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
