import { Outlet } from 'react-router-dom'
import TopNav from '../components/TopNav'

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
