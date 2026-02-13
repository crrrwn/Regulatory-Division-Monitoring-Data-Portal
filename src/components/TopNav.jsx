import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home', hash: null },
  { to: '/', label: 'About', hash: 'about' },
  { to: '/', label: 'Features', hash: 'features' },
  { to: '/', label: 'Contact Us', hash: 'contact' },
]

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  const handleNav = (e, link) => {
    if (link.hash && isHome) {
      e.preventDefault()
      document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-primary shadow-md pt-[env(safe-area-inset-top)]">
      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 min-h-[44px]">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 shrink py-2 touch-target">
            <img src="/DA LOGO.jpg" alt="DA Logo" className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover border-2 border-white/30 shrink-0" />
            <span className="text-white font-semibold text-xs sm:text-sm md:text-lg truncate">
              Regulatory Division Portal
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white hover:bg-white/10 active:bg-white/20"
            aria-label="Toggle menu"
          >
            <iconify-icon icon={menuOpen ? 'mdi:close' : 'mdi:menu'} width="28" height="28"></iconify-icon>
          </button>
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.hash ? `/#${link.hash}` : '/'}
                onClick={(e) => handleNav(e, link)}
                className={`font-medium transition ${isHome && !link.hash ? 'text-accent-light' : 'text-white/90 hover:text-white'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        {menuOpen && (
          <div className="lg:hidden py-3 border-t border-white/20 flex flex-col gap-1 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.hash ? `/#${link.hash}` : '/'}
                onClick={(e) => handleNav(e, link)}
                className={`min-h-[44px] flex items-center py-3 px-4 rounded-lg font-medium active:bg-white/20 ${isHome && !link.hash ? 'text-accent-light bg-white/10' : 'text-white/90 hover:bg-white/10'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
