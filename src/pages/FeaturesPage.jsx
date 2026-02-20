export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern">
      {/* Hero */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}FEATURES.png)` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/90 to-transparent" aria-hidden="true" />

        <div className="features-hero relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center text-center">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              System Features & Capabilities
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium drop-shadow max-w-xl mx-auto">
              A robust, cloud-powered solution built for the Regulatory Division's complex workflows.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-14 -mt-8">

        {/* Intro card — smaller */}
        <section className="features-intro bg-white rounded-2xl p-5 sm:p-7 shadow-lg border border-border max-w-3xl mx-auto transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <p className="text-text-muted text-sm sm:text-base leading-relaxed text-center font-medium">
            Designed specifically to handle the diverse needs of the agriculture and veterinary sectors. The system neatly categorizes records into three main units for easy management and real-time monitoring.
          </p>
        </section>

        {/* Operational Modules — smaller cards */}
        <section className="space-y-8">
          <div className="features-modules-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
              Comprehensive Operational Modules
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="features-modules-1 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:file-document-edit" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Registration & Licensing</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Efficiently process applications for Animal Feeds, Livestock & Handlers, Transport Carriers, Plant Material/Nursery, Organic Agri Certification, and Animal Welfare.
              </p>
            </div>

            <div className="features-modules-2 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:check-circle" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Quality Control</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Ensure strict compliance with Good Agri Practices, Good Animal Husbandry, Organic Post-Market, Land Use, Food Safety, and SAFDZ Validation.
              </p>
            </div>

            <div className="features-modules-3 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:microscope" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Surveillance & Disease</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Log and monitor critical real-time data for Plant Pest Surveillance, Animal Disease Surveillance, and CFS/ADMCC.
              </p>
            </div>
          </div>
        </section>

        {/* Smart System Features — smaller */}
        <section className="space-y-8">
          <div className="features-smart-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
              Smart System Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="features-smart-1 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:view-dashboard" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Centralized Interactive Dashboard</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Get a clear, bird's-eye view of all three operational units. Monitor pending licenses, quality control validations, and active disease surveillance in one workspace.
              </p>
            </div>

            <div className="features-smart-2 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:magnify" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Advanced Smart Search</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Lightning-fast retrieval of records. Find client names, business permits, or transport carriers across any unit in just a few keystrokes.
              </p>
            </div>

            <div className="features-smart-3 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:lock" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Secure Role-Based Login</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Separate access for Admins and Standard Users with Firebase Authentication. Sensitive data remains strictly protected.
              </p>
            </div>

            <div className="features-smart-4 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:cloud" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Cloud-Powered Database</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Data saved instantly and backed up with Firebase Firestore. Say goodbye to lost physical files and manual encoding errors.
              </p>
            </div>

            <div className="features-smart-5 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden md:col-span-2">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:leaf" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">100% Paperless Process</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Reduce physical clutter, minimize human error, and help the environment by moving your division's transactions entirely online.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
