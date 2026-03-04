import { getLandingGradient } from '../lib/colorTheme'

export default function FeaturesPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: getLandingGradient() }}
    >
      {/* Hero */}
      <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6">
        <div className="features-hero relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center text-center">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              System Features & Capabilities
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium drop-shadow max-w-xl mx-auto">
              Key features of the Regulatory Division Monitoring Data Portal.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-14 -mt-8">

        {/* Intro */}
        <section className="features-intro bg-white rounded-2xl p-5 sm:p-7 shadow-lg border border-border max-w-3xl mx-auto transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <p className="text-text-muted text-sm sm:text-base leading-relaxed text-center font-medium">
            This portal gives staff and administrators a single place to manage records, view analytics, and control access across the division’s three operational areas.
          </p>
        </section>

        {/* Important features — section title on gradient, white */}
        <section className="space-y-8">
          <div className="features-modules-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
              Important Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:view-dashboard" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Dashboard</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Live overview of total records, active units, monthly trends, and data by province and by unit—all in one view.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:database-search-outline" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Master Records</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                View and search all records across units. Filter by unit, month, and province for quick retrieval.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden md:col-span-2">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:folder-multiple-outline" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Three Operational Units</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                <strong>Registration &amp; Licensing:</strong> Animal Feeds, Livestock &amp; Handlers, Transport Carriers, Plant Material/Nursery, Organic Agri Certification, Animal Welfare. &nbsp;
                <strong>Quality Control:</strong> Good Agri Practices, Good Animal Husbandry, Organic Post-Market, Land Use, Food Safety, SAFDZ Validation. &nbsp;
                <strong>Pest &amp; Disease Surveillance:</strong> Plant Pest Surveillance, Animal Disease Surveillance, CFS/ADMCC. Each unit has dedicated forms for data entry and monitoring.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:account-key-outline" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Admin &amp; Staff Portals</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Separate login for Administrators and Staff. Staff access is limited to one section (Registration &amp; Licensing, Quality Control, or Pest &amp; Disease Surveillance) per user.
              </p>
            </div>

            <div className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:cog-outline" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Admin-Only Tools</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                User Management (add/edit staff, assign sections), System Logs (audit trail of actions), and Settings (admin registration code, password change). Available only to administrators.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
