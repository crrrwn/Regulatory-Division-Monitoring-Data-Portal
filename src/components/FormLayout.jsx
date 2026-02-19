import { Link } from 'react-router-dom'

export default function FormLayout({ title, children }) {
  return (
    <div className="w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-[#1e4d2b] font-bold text-sm shadow-sm hover:bg-[#1e4d2b]/10 hover:border-[#1e4d2b]/50 hover:shadow-md hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] min-h-[44px] items-center"
        >
          <iconify-icon icon="mdi:arrow-left" width="20"></iconify-icon>
          Back to Dashboard
        </Link>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-primary mb-4 sm:mb-6">{title}</h2>
      <div className="bg-white rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 overflow-visible min-w-0">
        {children}
      </div>
    </div>
  )
}
