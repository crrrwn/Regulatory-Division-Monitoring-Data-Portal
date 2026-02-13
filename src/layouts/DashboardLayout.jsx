import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SIDEBAR_SECTIONS = [
  {
    title: 'Registration and Licensing',
    items: [
      { path: '/dashboard/forms/animal-feed', label: 'Animal Feeds Unit' },
      { path: '/dashboard/forms/animal-welfare', label: 'Animal Welfare Concern Unit' },
      { path: '/dashboard/forms/livestock-handlers', label: 'Livestock/Poultry/By-Products Handlers' },
      { path: '/dashboard/forms/transport-carrier', label: 'Transport Carriers Accreditation' },
      { path: '/dashboard/forms/plant-material', label: 'Plant Material / Nursery Accreditation' },
      { path: '/dashboard/forms/organic-agri', label: 'Organic Agriculture Certification' },
    ],
  },
  {
    title: 'Quality Control and Inspection',
    items: [
      { path: '/dashboard/forms/good-agri-practices', label: 'Good Agricultural Practices Unit' },
      { path: '/dashboard/forms/good-animal-husbandry', label: 'Good Animal Husbandry Practices Unit' },
      { path: '/dashboard/forms/organic-post-market', label: 'Organic Product Post-Market Surveillance' },
      { path: '/dashboard/forms/land-use-matter', label: 'Land Use Matter Concern Unit' },
      { path: '/dashboard/forms/food-safety', label: 'Food Safety Unit' },
    ],
  },
  {
    title: 'Plant Pest & Animal Disease Surveillance',
    items: [
      { path: '/dashboard/forms/plant-pest-surveillance', label: 'Plant Pest and Disease Surveillance' },
      { path: '/dashboard/forms/cfs-admcc', label: 'CFS/ADMCC' },
      { path: '/dashboard/forms/animal-disease-surveillance', label: 'Animal Disease Surveillance' },
    ],
  },
]

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState([0, 1, 2])
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, signOut } = useAuth()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const toggleSection = (i) => {
    setOpenSections((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay when sidebar open */}
      <div
        className={`fixed inset-0 z-30 bg-black/50 lg:hidden transition-opacity ${mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-full lg:h-screen w-72 lg:w-64 flex flex-col shrink-0 transition-transform duration-300 ease-out lg:translate-x-0
          ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          bg-primary text-white shadow-xl lg:shadow-lg`}
      >
        <div className="p-3 sm:p-4 flex items-center justify-between border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden min-w-0">
            <img src="/DA LOGO.jpg" alt="Logo" className="h-9 w-9 rounded-full object-cover shrink-0" />
            {sidebarOpen && <span className="font-semibold truncate text-sm">Regulatory Portal</span>}
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 rounded hover:bg-white/10"
              aria-label="Close menu"
            >
              <iconify-icon icon="mdi:close" width="24"></iconify-icon>
            </button>
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-1 rounded hover:bg-white/10"
              aria-label="Toggle sidebar"
            >
              <iconify-icon icon={sidebarOpen ? 'mdi:chevron-left' : 'mdi:chevron-right'} width="24"></iconify-icon>
            </button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <Link
            to="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 ${location.pathname === '/dashboard' ? 'bg-white/15' : ''}`}
          >
            <iconify-icon icon="mdi:view-dashboard" width="22"></iconify-icon>
            {(sidebarOpen || mobileMenuOpen) && <span>Dashboard</span>}
          </Link>
          <Link
            to="/dashboard/analytics"
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 ${location.pathname === '/dashboard/analytics' ? 'bg-white/15' : ''}`}
          >
            <iconify-icon icon="mdi:chart-bar" width="22"></iconify-icon>
            {(sidebarOpen || mobileMenuOpen) && <span>Data Analytics</span>}
          </Link>
          <Link
            to="/dashboard/records"
            className={`flex items-center gap-3 px-4 py-3 hover:bg-white/10 ${location.pathname === '/dashboard/records' ? 'bg-white/15' : ''}`}
          >
            <iconify-icon icon="mdi:table" width="22"></iconify-icon>
            {(sidebarOpen || mobileMenuOpen) && <span>View Records</span>}
          </Link>
          {(sidebarOpen || mobileMenuOpen) && (
            <>
              {SIDEBAR_SECTIONS.map((section, idx) => (
                <div key={idx} className="mt-2">
                  <button
                    type="button"
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between px-4 py-2 text-left text-white/90 hover:bg-white/10 text-sm font-medium"
                  >
                    <span className="truncate pr-2">{section.title}</span>
                    <iconify-icon icon={openSections.includes(idx) ? 'mdi:chevron-up' : 'mdi:chevron-down'} width="20"></iconify-icon>
                  </button>
                  {openSections.includes(idx) && (
                    <div className="pl-4 pb-2">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block py-2 px-2 rounded text-sm truncate ${location.pathname === item.path ? 'bg-white/15' : 'text-white/80 hover:bg-white/10'}`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </nav>
        <div className="p-3 border-t border-white/10">
          <div className={`flex items-center gap-2 ${!sidebarOpen && !mobileMenuOpen ? 'justify-center' : ''}`}>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <iconify-icon icon="mdi:account" width="18"></iconify-icon>
            </span>
            {(sidebarOpen || mobileMenuOpen) && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{user?.email}</p>
                  <p className="text-xs text-white/70 capitalize">{role}</p>
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="p-1.5 rounded hover:bg-white/10"
                  title="Sign out"
                >
                  <iconify-icon icon="mdi:logout" width="20"></iconify-icon>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <header className="h-12 sm:h-14 bg-white border-b border-border flex items-center px-3 sm:px-6 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-lg text-primary hover:bg-surface"
            aria-label="Open menu"
          >
            <iconify-icon icon="mdi:menu" width="24" height="24"></iconify-icon>
          </button>
          <h1 className="font-semibold text-primary text-sm sm:text-base truncate ml-2 lg:ml-0">
            Regulatory Division Portal
          </h1>
        </header>
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
