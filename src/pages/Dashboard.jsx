import { Link } from 'react-router-dom'

const SECTIONS = [
  {
    title: 'Registration and Licensing Section',
    units: [
      { path: '/dashboard/forms/animal-feed', label: 'Animal Feeds Unit' },
      { path: '/dashboard/forms/animal-welfare', label: 'Animal Welfare Concern Unit' },
      { path: '/dashboard/forms/livestock-handlers', label: 'Livestock/Poultry/By-Products Handlers' },
      { path: '/dashboard/forms/transport-carrier', label: 'Transport Carriers Accreditation Unit' },
      { path: '/dashboard/forms/plant-material', label: 'Plant Material / Nursery Accreditation Unit' },
      { path: '/dashboard/forms/organic-agri', label: 'Organic Agriculture Certification Unit' },
    ],
  },
  {
    title: 'Quality Control and Inspection Section',
    units: [
      { path: '/dashboard/forms/good-agri-practices', label: 'Good Agricultural Practices Unit' },
      { path: '/dashboard/forms/good-animal-husbandry', label: 'Good Animal Husbandry Practices Unit' },
      { path: '/dashboard/forms/organic-post-market', label: 'Organic Product Post-Market Surveillance' },
      { path: '/dashboard/forms/land-use-matter', label: 'Land Use Matter Concern Unit' },
      { path: '/dashboard/forms/food-safety', label: 'Food Safety Unit' },
    ],
  },
  {
    title: 'Plant Pest & Animal Disease Surveillance',
    units: [
      { path: '/dashboard/forms/plant-pest-surveillance', label: 'Plant Pest and Disease Surveillance Unit' },
      { path: '/dashboard/forms/cfs-admcc', label: 'CFS/ADMCC' },
      { path: '/dashboard/forms/animal-disease-surveillance', label: 'Animal Disease Surveillance Unit' },
    ],
  },
]

export default function Dashboard() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/dashboard/analytics"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-muted text-white rounded-lg hover:bg-primary text-sm sm:text-base"
          >
            <iconify-icon icon="mdi:chart-bar" width="20"></iconify-icon>
            Data Analytics
          </Link>
          <Link
            to="/dashboard/records"
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm sm:text-base"
          >
            <iconify-icon icon="mdi:table" width="20"></iconify-icon>
            View Records
          </Link>
        </div>
      </div>
      <p className="text-sm sm:text-base text-[#5c574f] mb-6 sm:mb-8">Select a unit below to open its data entry form.</p>
      <div className="space-y-4 sm:space-y-6">
        {SECTIONS.map((section, idx) => (
          <div key={idx} className="bg-white rounded-lg sm:rounded-xl border border-border overflow-hidden">
            <div className="px-3 sm:px-5 py-2 sm:py-3 bg-surface font-semibold text-primary border-b border-border text-sm sm:text-base">
              {section.title}
            </div>
            <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {section.units.map((unit) => (
                <Link
                  key={unit.path}
                  to={unit.path}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition"
                >
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <iconify-icon icon="mdi:file-document-edit-outline" width="22"></iconify-icon>
                  </span>
                  <span className="font-medium text-[#2d2a26] text-sm sm:text-base min-w-0">{unit.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
