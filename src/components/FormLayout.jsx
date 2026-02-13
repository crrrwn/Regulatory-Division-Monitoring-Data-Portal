import { Link } from 'react-router-dom'

export default function FormLayout({ title, children }) {
  return (
    <div className="w-full min-w-0">
      <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm sm:text-base min-h-[44px] items-center"
        >
          <iconify-icon icon="mdi:arrow-left" width="20"></iconify-icon>
          Back to Dashboard
        </Link>
      </div>
      <h2 className="text-lg sm:text-xl font-bold text-primary mb-4 sm:mb-6">{title}</h2>
      <div className="bg-white rounded-lg sm:rounded-xl border border-border p-4 sm:p-6 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}
