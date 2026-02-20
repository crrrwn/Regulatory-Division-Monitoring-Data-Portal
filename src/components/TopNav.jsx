import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/contact', label: 'Contact Us' },
]

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const handleNav = () => {
    setMenuOpen(false)
  }

  return (
    <header
      className="sticky top-0 z-50 pt-[env(safe-area-inset-top)] transition-shadow duration-300"
      style={{
        background: 'linear-gradient(180deg, #153019 0%, #1e4d2b 50%, #1a4328 100%)',
        boxShadow: '0 4px 24px -4px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.06) inset',
      }}
    >
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-80" aria-hidden="true" />

      <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 min-h-[52px]">
          {/* Logo + Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 sm:gap-3 min-w-0 shrink py-2 touch-target rounded-xl -ml-1 pl-1 pr-2 transition-all duration-300 ease-out hover:bg-white/8 active:scale-[0.98]"
          >
            <span className="relative flex shrink-0 transition-transform duration-300 ease-out group-hover:scale-105">
              <img
                src="/DALOGO.png"
                alt="DA Logo"
                className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover ring-2 ring-white/20 group-hover:ring-white/50 transition-all duration-300 shadow-lg"
              />
              <span className="absolute -inset-0.5 rounded-full bg-accent/20 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" aria-hidden="true" />
            </span>
            <span className="text-white font-bold text-sm sm:text-base md:text-lg truncate tracking-tight drop-shadow-sm transition-colors duration-300 group-hover:text-white/95">
              Regulatory Division Portal
            </span>
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-xl text-white hover:bg-white/10 active:bg-white/15 transition-all duration-300 ease-out active:scale-95"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <iconify-icon
              icon={menuOpen ? 'mdi:close' : 'mdi:menu'}
              width="26"
              height="26"
              className="transition-transform duration-300 ease-out"
            />
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={handleNav}
                  className={`
                    group relative px-4 py-2.5 rounded-xl font-medium text-[15px] transition-all duration-300 ease-out
                    ${isActive
                      ? 'text-accent-light bg-white/12'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <span className="relative block py-0.5">{link.label}</span>
                  <span
                    className={`absolute bottom-1.5 left-1/2 w-6 h-0.5 rounded-full bg-accent-light -translate-x-1/2 origin-center transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                    aria-hidden="true"
                  />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Mobile menu — smooth open/close */}
        <div
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[-1] lg:hidden transition-opacity duration-300 ease-out ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          aria-hidden="true"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${menuOpen ? 'max-h-[320px]' : 'max-h-0'}`}
        >
          <div className="py-3 flex flex-col gap-0.5 border-t border-white/10" role="dialog" aria-label="Navigation menu">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={handleNav}
                  className={`
                    min-h-[48px] flex items-center py-3 px-4 rounded-xl font-medium transition-all duration-300 ease-out
                    ${isActive
                      ? 'text-accent-light bg-white/12 border-l-2 border-accent-light -ml-0.5 pl-[calc(1rem+2px)]'
                      : 'text-white/90 hover:bg-white/10 active:bg-white/15'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="h-3 pb-[env(safe-area-inset-bottom)]" />
          </div>
        </div>
      </nav>
    </header>
  )
}
