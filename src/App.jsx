import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { DisabledUnitsProvider } from './context/DisabledUnitsContext'
import Routes from './Routes'

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <DisabledUnitsProvider>
          <Routes />
        </DisabledUnitsProvider>
      </NotificationProvider>
    </AuthProvider>
  )
}
