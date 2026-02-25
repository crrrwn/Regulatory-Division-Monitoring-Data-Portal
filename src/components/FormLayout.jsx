import { Link } from 'react-router-dom'

export default function FormLayout({ title, children }) {
  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden px-0">
      <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 min-h-[44px] bg-white border-2 border-[#e8e0d4] rounded-xl text-[#1e4d2b] font-bold text-xs sm:text-sm shadow-sm hover:bg-[#1e4d2b]/10 hover:border-[#1e4d2b]/50 hover:shadow-md hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] touch-manipulation"
        >
          <iconify-icon icon="mdi:arrow-left" width="20" className="shrink-0"></iconify-icon>
          Back to Dashboard
        </Link>
      </div>
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-primary mb-3 sm:mb-6 break-words">{title}</h2>
      <div className="form-layout-inner bg-white rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 lg:p-8 overflow-x-hidden min-w-0 max-w-full">
        {children}
      </div>
    </div>
  )
}
