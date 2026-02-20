import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SIDEBAR_SECTIONS = [
  {
    title: 'Registration & Licensing',
    icon: 'mdi:certificate-outline',
    items: [
      { path: '/dashboard/forms/animal-feed', label: 'Animal Feeds Unit' },
      { path: '/dashboard/forms/animal-welfare', label: 'Animal Welfare Concern' },
      { path: '/dashboard/forms/livestock-handlers', label: 'Livestock & Handlers' },
      { path: '/dashboard/forms/transport-carrier', label: 'Transport Carriers' },
      { path: '/dashboard/forms/plant-material', label: 'Plant Material / Nursery' },
      { path: '/dashboard/forms/organic-agri', label: 'Organic Agri Certification' },
    ],
  },
  {
    title: 'Quality Control',
    icon: 'mdi:shield-check-outline',
    items: [
      { path: '/dashboard/forms/good-agri-practices', label: 'Good Agri Practices' },
      { path: '/dashboard/forms/good-animal-husbandry', label: 'Good Animal Husbandry' },
      { path: '/dashboard/forms/organic-post-market', label: 'Organic Post-Market' },
      { path: '/dashboard/forms/land-use-matter', label: 'Land Use Concern' },
      { path: '/dashboard/forms/food-safety', label: 'Food Safety Unit' },
      { path: '/dashboard/forms/safdz-validation', label: 'SAFDZ Validation' },
    ],
  },
  {
    title: 'Surveillance & Disease',
    icon: 'mdi:virus-outline',
    items: [
      { path: '/dashboard/forms/plant-pest-surveillance', label: 'Plant Pest Surveillance' },
      { path: '/dashboard/forms/cfs-admcc', label: 'CFS / ADMCC' },
      { path: '/dashboard/forms/animal-disease-surveillance', label: 'Animal Disease Surv.' },
    ],
  },
]

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSections, setOpenSections] = useState([])
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

  const isActive = (path) => location.pathname === path

  // Auto-expand sidebar section if a child is active
  useEffect(() => {
    SIDEBAR_SECTIONS.forEach((section, idx) => {
      if (section.items.some(item => item.path === location.pathname)) {
        if (!openSections.includes(idx)) {
          setOpenSections(prev => [...prev, idx])
        }
      }
    })
  }, [location.pathname])

  return (
    <div className="flex h-screen min-h-[100dvh] bg-background overflow-hidden font-sans text-primary w-full min-w-0">
      
      {/* --- MOBILE OVERLAY (only when sidebar is drawer) --- */}
      <div
        className={`fixed inset-0 z-40 bg-primary-dark/90 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* --- SIDEBAR: drawer < md, always visible >= md --- */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-primary-dark text-accent-light shadow-2xl border-r border-primary relative
          pt-[env(safe-area-inset-top)]
          w-[min(280px,85vw)] ${sidebarOpen || mobileMenuOpen ? 'md:w-[280px]' : 'md:w-[88px]'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          max-w-full
        `}
        style={{ 
          backgroundImage: 'radial-gradient(circle at top left, #1e4d2b, #153019, #0d1f12)',
          paddingLeft: 'env(safe-area-inset-left)',
          transition: 'width 0.35s cubic-bezier(0.33, 1, 0.68, 1), transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
        }}
      >
        {/* --- FLOATING TOGGLE BUTTON (DESKTOP) --- */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute -right-3 top-6 sm:top-9 z-50 hidden md:flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-background text-primary shadow-[0_2px_8px_rgba(0,0,0,0.15)] ring-1 ring-primary/20 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:bg-accent-light hover:text-primary hover:scale-110 focus:outline-none active:scale-95
             ${!sidebarOpen ? 'rotate-180' : 'rotate-0'}
          `}
          style={{ transition: 'transform 0.35s cubic-bezier(0.33, 1, 0.68, 1), background-color 0.2s, box-shadow 0.2s' }}
          title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <iconify-icon icon="mdi:chevron-left" width="18"></iconify-icon>
        </button>

        {/* Brand Header */}
        <div className={`min-h-[72px] sm:h-24 flex items-center px-4 sm:px-6 border-b border-white/5 relative overflow-hidden shrink-0 ${!sidebarOpen && !mobileMenuOpen ? 'justify-center px-0' : 'justify-between'}`} style={{ transition: 'padding 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}>
          <Link to="/dashboard" className="flex items-center gap-4 overflow-hidden min-w-0 z-10 group">
            <div className="relative w-10 h-10 shrink-0">
               <div className="absolute inset-0 bg-primary blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
               <div className="relative w-full h-full rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg ring-1 ring-white/10 group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]">
                  <img src="/DALOGO.png" alt="DA" className="w-full h-full object-cover rounded-xl" onError={(e) => e.target.style.display = 'none'} />
                  <span className="absolute font-bold text-xs">DA</span>
               </div>
            </div>
            
            <div className={`flex flex-col min-w-0 overflow-hidden ${sidebarOpen || mobileMenuOpen ? 'opacity-100 translate-x-0 w-auto' : 'opacity-0 -translate-x-4 w-0'}`} style={{ transition: 'opacity 0.3s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, transform 0.35s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, width 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}>
              <h1 className="font-bold text-white text-sm sm:text-[15px] leading-tight tracking-wide truncate">REGULATORY</h1>
              <p className="text-[10px] text-accent-light font-bold tracking-wider uppercase truncate">Division Portal</p>
            </div>
          </Link>
          
          {/* Mobile Close Button (only when sidebar is drawer) */}
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-accent-light/80 hover:text-white transition-colors -mr-2" aria-label="Close menu">
            <iconify-icon icon="mdi:close" width="24"></iconify-icon>
          </button>
        </div>

        {/* Navigation Scroll Area */}
        <nav className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-4 sm:py-6 px-3 sm:px-4 space-y-6 sm:space-y-8 custom-scrollbar">
          
          {/* Main Module */}
          <div>
            <p
              className={`px-2 text-[10px] font-bold text-accent-light/70 uppercase tracking-widest mb-3 overflow-hidden whitespace-nowrap ${sidebarOpen || mobileMenuOpen ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0 mb-0'}`}
              style={{ transition: 'opacity 0.28s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, max-height 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}
            >
              Main Module
            </p>
            <div className="space-y-1">
              <NavItem to="/dashboard" icon="mdi:view-dashboard-variant-outline" label="Dashboard Overview" active={isActive('/dashboard')} sidebarOpen={sidebarOpen || mobileMenuOpen} />
              <NavItem to="/dashboard/analytics" icon="mdi:chart-box-outline" label="Data Analytics" active={isActive('/dashboard/analytics')} sidebarOpen={sidebarOpen || mobileMenuOpen} />
              <NavItem to="/dashboard/records" icon="mdi:database-search-outline" label="Master Records" active={isActive('/dashboard/records')} sidebarOpen={sidebarOpen || mobileMenuOpen} />
            </div>
          </div>

          {/* Department Units */}
          <div>
            <p
              className={`px-2 text-[10px] font-bold text-accent-light/70 uppercase tracking-widest mb-3 overflow-hidden whitespace-nowrap ${sidebarOpen || mobileMenuOpen ? 'opacity-100 max-h-8' : 'opacity-0 max-h-0 mb-0'}`}
              style={{ transition: 'opacity 0.28s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, max-height 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}
            >
              Operational Units
            </p>
            <div className="space-y-1">
              {SIDEBAR_SECTIONS.map((section, idx) => (
                <AccordionItem 
                  key={idx}
                  section={section}
                  isOpen={openSections.includes(idx)}
                  onToggle={() => toggleSection(idx)}
                  isActiveRoute={isActive}
                  sidebarOpen={sidebarOpen}
                  mobileMenuOpen={mobileMenuOpen}
                  setSidebarOpen={setSidebarOpen}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-primary/30 bg-primary/20 backdrop-blur-sm">
          <div className={`flex items-center gap-3 overflow-hidden group ${!sidebarOpen && !mobileMenuOpen ? 'justify-center' : ''}`} style={{ transition: 'justify-content 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}>
             <div className="relative shrink-0">
                <div className="w-9 h-9 rounded-full bg-primary border border-primary-light/50 flex items-center justify-center text-accent-light shadow-sm overflow-hidden group-hover:border-accent-light transition-colors duration-200">
                  <iconify-icon icon="mdi:account" width="20"></iconify-icon>
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent border-2 border-primary-dark rounded-full animate-pulse"></div>
             </div>

            <div
              className={`flex-1 min-w-0 overflow-hidden ${sidebarOpen || mobileMenuOpen ? 'opacity-100 max-w-[160px]' : 'opacity-0 max-w-0'}`}
              style={{ transition: 'opacity 0.28s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, max-width 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}
            >
              <p className="text-sm font-semibold text-white truncate group-hover:text-accent-light transition-colors duration-200">{user?.email?.split('@')[0]}</p>
              <p className="text-[10px] text-accent-light/70 uppercase font-medium truncate">{role || 'Admin Access'}</p>
            </div>
            
            <button
              onClick={handleSignOut}
              className={`shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-accent-light/80 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] touch-manipulation ${sidebarOpen || mobileMenuOpen ? 'opacity-100 w-11 pointer-events-auto' : 'opacity-0 w-0 min-w-0 overflow-hidden pointer-events-none'}`}
              style={{ transition: 'opacity 0.25s 0.06s, width 0.35s cubic-bezier(0.33, 1, 0.68, 1), min-width 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}
              title="Sign Out"
              aria-label="Sign out"
            >
              <iconify-icon icon="mdi:logout" width="18"></iconify-icon>
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0 w-full bg-background relative">
        {/* Header */}
        <header
          className="h-14 sm:h-16 min-h-[44px] sticky top-0 z-30 flex items-center justify-between gap-2 px-3 sm:px-6 lg:px-8 pt-[env(safe-area-inset-top)] pr-[max(0.75rem,env(safe-area-inset-right))] bg-white/90 backdrop-blur-md border-b border-border shadow-sm shrink-0"
        >
           {/* Hamburger + Title */}
           <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 -ml-1 text-primary hover:bg-surface active:bg-border rounded-lg transition-colors touch-manipulation"
                aria-label="Open menu"
              >
                <iconify-icon icon="mdi:menu" width="24"></iconify-icon>
              </button>
              
              <div className="flex flex-col justify-center min-w-0">
                 <h2 className="text-base sm:text-lg font-bold text-primary tracking-tight leading-tight truncate">
                    {SIDEBAR_SECTIONS.flatMap(s => s.items).find(i => i.path === location.pathname)?.label || 'Dashboard'}
                 </h2>
                 <p className="text-xs text-text-muted mt-0.5 hidden sm:block truncate">Regulatory Division Portal</p>
              </div>
           </div>

           {/* Right: Date */}
           <div className="flex items-center gap-1 sm:gap-4 shrink-0">
              <div className="hidden md:flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-surface rounded-full border border-border">
                 <iconify-icon icon="mdi:calendar-month-outline" width="16" class="text-text-muted"></iconify-icon>
                 <span className="text-xs font-semibold text-primary whitespace-nowrap">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                 </span>
              </div>
           </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 min-w-0 min-h-0 overflow-x-hidden overflow-y-auto custom-scrollbar view-records-scroll p-3 sm:p-6 lg:p-8 pb-[max(1rem,env(safe-area-inset-bottom))]">
           <div className="w-full max-w-7xl mx-auto min-w-0 animate-fade-in-up">
              <Outlet />
           </div>
        </main>
      </div>
    </div>
  )
}

// ---------------- ENHANCED NAV COMPONENTS ---------------- //

function NavItem({ to, icon, label, active, sidebarOpen }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-3 px-3 py-2.5 min-h-[44px] md:min-h-0 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group overflow-hidden touch-manipulation
        ${active 
          ? 'text-white shadow-lg shadow-primary-dark/20' 
          : 'text-accent-light/80 hover:text-accent-light hover:bg-white/5'
        }
        ${!sidebarOpen ? 'justify-center' : ''}
      `}
    >
      {active && (
         <div className="absolute inset-0 bg-primary border border-white/10 rounded-lg"></div>
      )}

      <iconify-icon 
         icon={icon} 
         width="20" 
         class={`relative z-10 shrink-0 transition-colors duration-200 ${active ? 'text-white' : 'group-hover:text-accent-light'}`}
      ></iconify-icon>
      
      <span
        className={`relative z-10 font-medium text-[13.5px] tracking-wide whitespace-nowrap overflow-hidden min-w-0 ${sidebarOpen ? 'opacity-100 max-w-[200px]' : 'opacity-0 max-w-0'}`}
        style={{ transition: 'opacity 0.28s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, max-width 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}
      >
         {label}
      </span>

      {/* Tooltip (Only when collapsed) */}
      {!sidebarOpen && (
        <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-dark text-white text-xs font-medium rounded-md shadow-xl border border-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 z-[60] whitespace-nowrap">
          {label}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-primary-dark border-l border-b border-primary transform rotate-45"></div>
        </div>
      )}
    </Link>
  )
}

function AccordionItem({ section, isOpen, onToggle, isActiveRoute, sidebarOpen, mobileMenuOpen, setSidebarOpen }) {
  const isChildActive = section.items.some(item => isActiveRoute(item.path));
  const showText = sidebarOpen || mobileMenuOpen;

  return (
    <div className="relative">
      <button
        onClick={() => {
           if (!showText) setSidebarOpen(true);
           onToggle();
        }}
        className={`relative w-full flex items-center px-3 py-2.5 min-h-[44px] md:min-h-0 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group touch-manipulation overflow-hidden
           ${isChildActive ? 'bg-white/5 text-accent-light' : 'text-accent-light/80 hover:bg-white/5 hover:text-accent-light'}
           ${!showText ? 'justify-center' : 'justify-between'}
        `}
      >
        <div className="flex items-center gap-3 min-w-0">
          <iconify-icon 
             icon={section.icon} 
             width="20" 
             class={`shrink-0 ${isChildActive ? 'text-accent-light' : 'group-hover:text-accent-light'} transition-colors duration-200`}
          ></iconify-icon>
          
          <span
            className={`text-[13.5px] font-semibold tracking-wide whitespace-nowrap overflow-hidden min-w-0 ${showText ? 'opacity-100 max-w-[180px]' : 'opacity-0 max-w-0'}`}
            style={{ transition: 'opacity 0.28s cubic-bezier(0.33, 1, 0.68, 1) 0.05s, max-width 0.35s cubic-bezier(0.33, 1, 0.68, 1)' }}
          >
             {section.title}
          </span>
        </div>
        
        {showText && (
           <iconify-icon 
             icon="mdi:chevron-down" 
             width="16" 
             style={{ 
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.35s cubic-bezier(0.33, 1, 0.68, 1)' 
             }}
             class={`transition-colors ${isChildActive ? 'text-accent-light' : ''}`}
           ></iconify-icon>
        )}

        {/* Tooltip for Parent Item when collapsed */}
        {!showText && (
           <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-primary-dark text-white text-xs font-medium rounded-md shadow-xl border border-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 z-[60] whitespace-nowrap">
             {section.title}
             <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 bg-primary-dark border-l border-b border-primary transform rotate-45"></div>
           </div>
        )}
      </button>

      {/* Submenu with Smooth Height Transition */}
      <div 
        className={`grid transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen && showText ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="ml-5 pl-4 border-l border-white/10 space-y-1 py-1">
            {section.items.map((item) => {
               const active = isActiveRoute(item.path);
               return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 py-2 px-3 min-h-[44px] md:min-h-0 rounded-md text-[12.5px] transition-all relative group/item touch-manipulation
                      ${active 
                        ? 'text-white font-medium bg-primary/30' 
                        : 'text-accent-light/80 hover:text-white hover:translate-x-1'
                      }`}
                  >
                    <span className={`absolute -left-[17px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? 'bg-accent-light scale-100' : 'bg-primary scale-0 group-hover/item:scale-75'}`}></span>
                    
                    {item.label}
                  </Link>
               )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout