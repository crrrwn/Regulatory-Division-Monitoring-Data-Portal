import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

/**
 * Custom dropdown with theme design, open/close animation, and green/cream colors.
 * Renders panel in a portal so it's never clipped by parent overflow.
 * Optional: pass `groups` instead of `options` for section headers (e.g. [{ sectionLabel, options: [{ value, label }] }]).
 */
export default function AppSelect({
  options = [],
  groups = null,
  value = '',
  onChange,
  placeholder = 'Select...',
  className = '',
  disabled = false,
  leftIcon,
  'aria-label': ariaLabel,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [panelRect, setPanelRect] = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)
  const triggerRef = useRef(null)

  const flatOptions = groups
    ? groups.flatMap((g) => g.options || [])
    : options
  const selectedOption = flatOptions.find((o) => String(o.value) === String(value))
  const displayLabel = selectedOption ? selectedOption.label : placeholder

  const updatePanelRect = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setPanelRect({
        top: rect.bottom + 6,
        left: rect.left,
        width: rect.width,
      })
    }
  }

  useEffect(() => {
    if (!isOpen) return
    updatePanelRect()
    const handleClickOutside = (e) => {
      if (containerRef.current?.contains(e.target)) return
      if (e.target.closest?.('[data-app-select-panel]')) return
      triggerRef.current?.focus()
      setIsOpen(false)
    }
    const handleScrollResize = () => updatePanelRect()
    window.addEventListener('scroll', handleScrollResize, true)
    window.addEventListener('resize', handleScrollResize)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScrollResize, true)
      window.removeEventListener('resize', handleScrollResize)
    }
  }, [isOpen])

  const handleSelect = (option) => {
    if (option.disabled) return
    onChange?.(option.value)
    triggerRef.current?.focus()
    setIsOpen(false)
  }

  const dropdownPanel = (
    <div
      data-app-select-panel
      role="listbox"
      aria-hidden={!isOpen}
      {...(isOpen ? {} : { inert: '' })}
      className={isOpen ? 'app-select-panel-open' : 'app-select-panel-closed'}
      style={{
        zIndex: 10001,
        position: 'fixed',
        top: panelRect.top,
        left: panelRect.left,
        width: panelRect.width,
        minWidth: 140,
        background: 'white',
        border: '2px solid #e8e0d4',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 20px 25px rgba(30, 77, 43, 0.12)',
      }}
    >
      <div className={`max-h-56 overflow-y-auto custom-scrollbar ${groups ? 'py-1' : 'py-1.5'}`}>
        {groups ? (
          groups.map((group, gIdx) => (
            <div key={gIdx} className="pt-1 first:pt-0">
              <div className="px-3 py-1.5 text-[10px] font-black text-[#5c7355] uppercase tracking-wider sticky top-0 bg-[#faf8f5] border-b border-[#e8e0d4]/60 z-10">
                {group.sectionLabel}
              </div>
              {(group.options || []).map((option, index) => {
                const isSelected = String(option.value) === String(value)
                const isPlaceholder = option.value === '' || option.value == null
                const isOptionDisabled = option.disabled === true
                return (
                  <button
                    key={option.value ?? 'empty'}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isOptionDisabled}
                    onClick={() => handleSelect(option)}
                    disabled={isOptionDisabled}
                    style={isOpen ? { animationDelay: `${(gIdx * 20 + index) * 25}ms` } : undefined}
                    className={`
                      app-select-option w-full text-left px-4 py-2 text-sm font-semibold
                      transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]
                      ${isOptionDisabled ? 'text-[#8a857c] opacity-60 cursor-not-allowed' : ''}
                      ${!isOptionDisabled && isPlaceholder ? 'text-[#8a857c] hover:bg-[#faf8f5] hover:text-[#5c7355]' : ''}
                      ${!isOptionDisabled && !isPlaceholder ? 'text-[#1e4d2b] hover:bg-[#f0f5ee] hover:text-[#153019] hover:translate-x-0.5 active:scale-[0.99]' : ''}
                      ${isSelected ? 'bg-[#f0f5ee]' : ''}
                    `}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          ))
        ) : (
          options.map((option, index) => {
            const isSelected = String(option.value) === String(value)
            const isPlaceholder = option.value === '' || option.value == null
            return (
              <button
                key={option.value ?? 'empty'}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option)}
                style={isOpen ? { animationDelay: `${index * 35}ms` } : undefined}
                className={`
                  app-select-option w-full text-left px-4 py-2.5 text-sm font-semibold text-[#1e4d2b]
                  transition-all duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]
                  ${isPlaceholder ? 'text-[#8a857c] hover:bg-[#faf8f5] hover:text-[#5c7355]' : 'hover:bg-[#f0f5ee] hover:text-[#153019]'}
                  ${isSelected ? 'bg-[#f0f5ee]' : ''}
                  hover:translate-x-0.5 active:scale-[0.99]
                `}
              >
                {option.label}
              </button>
            )
          })
        )}
      </div>
    </div>
  )

  return (
    <>
      <div ref={containerRef} className={`relative ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={ariaLabel || placeholder}
          onClick={() => {
            if (disabled) return
            if (!isOpen) updatePanelRect()
            setIsOpen((o) => !o)
          }}
          className={`
            w-full flex items-center justify-between gap-2
            py-2.5 pr-10 min-h-[44px] pl-3 sm:pl-4
            bg-white border-2 border-[#e8e0d4] rounded-xl
            text-left text-sm font-semibold text-[#1e4d2b]
            transition-all duration-350 ease-[cubic-bezier(0.33,1,0.68,1)]
            hover:border-[#1e4d2b]/50 hover:bg-[#faf8f5] hover:shadow-md hover:shadow-[#1e4d2b]/10
            focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none
            active:scale-[0.99]
            ${isOpen ? 'app-select-trigger-open' : ''}
            ${!selectedOption ? 'text-[#8a857c]' : ''}
          `}
        >
          <span className="flex items-center gap-2 min-w-0">
            {leftIcon && (
              <span className="shrink-0 flex items-center justify-center text-[#5c7355] transition-transform duration-300 w-6">
                {leftIcon}
              </span>
            )}
            <span className="truncate">{displayLabel}</span>
          </span>
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 shrink-0 text-[#1e4d2b] transition-transform duration-400 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
          </span>
        </button>
      </div>
      {createPortal(dropdownPanel, document.body)}
    </>
  )
}
