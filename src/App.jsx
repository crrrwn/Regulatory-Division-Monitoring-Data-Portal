import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Routes from './Routes'

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes />
      </NotificationProvider>
    </AuthProvider>
  )
}
