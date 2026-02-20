import { Outlet, useLocation } from 'react-router-dom'
import TopNav from '../components/TopNav'

export default function LandingLayout() {
  const { pathname } = useLocation()
  const hideTopNav = pathname === '/admin-login' || pathname === '/staff-login'

  return (
    <div className="min-h-screen min-h-[100dvh] bg-background flex flex-col w-full min-w-0">
      {!hideTopNav && <TopNav />}
      <main className="flex-1 w-full min-w-0 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  )
}
