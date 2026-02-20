export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern">
      {/* Hero Section — FEATURE.PNG from public folder */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}FEATURES.png)` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgb(248,250,252)] via-[rgb(248,250,252)]/90 to-transparent" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              System Features & Capabilities
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 font-medium drop-shadow max-w-2xl mx-auto">
              A robust, cloud-powered solution built for the Regulatory Division's complex workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Below the fold */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-20 -mt-8">

        {/* Intro card — same as HomePage */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-100 border-l-4 border-l-primary max-w-5xl mx-auto hover:shadow-lg transition-shadow duration-500">
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed text-center font-medium">
            Designed specifically to handle the diverse needs of the agriculture and veterinary sectors. The system neatly categorizes records into three main units for easy management and real-time monitoring.
          </p>
        </section>

        {/* Comprehensive Operational Modules — same section + cards as HomePage "Our Core Operational Units" */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Comprehensive Operational Modules
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:file-document-edit" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:file-document-edit" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Registration & Licensing</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Efficiently process applications for Animal Feeds, Livestock & Handlers, Transport Carriers, Plant Material/Nursery, Organic Agri Certification, and Animal Welfare Concerns.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:check-circle" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:check-circle" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Quality Control</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Ensure strict compliance with Good Agri Practices, Good Animal Husbandry, Organic Post-Market, Land Use, Food Safety Unit, and SAFDZ Validation.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:microscope" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:microscope" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Surveillance & Disease</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Log and monitor critical real-time data for Plant Pest Surveillance, Animal Disease Surveillance, and CFS/ADMCC.
              </p>
            </div>
          </div>
        </section>

        {/* Smart System Features — same card style, grid 2 cols */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Smart System Features
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:view-dashboard" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:view-dashboard" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Centralized Interactive Dashboard</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Get a clear, bird's-eye view of all three operational units. Monitor pending licenses, quality control validations, and active disease surveillance reports in one workspace.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:magnify" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:magnify" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Advanced Smart Search</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Lightning-fast retrieval of records. Find client names, business permits, or specific transport carriers across any unit in just a few keystrokes.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:lock" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:lock" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Secure Role-Based Login</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Separate access levels for Admins and Standard Users powered by Firebase Authentication. Sensitive data remains strictly protected.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:cloud" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:cloud" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Cloud-Powered Database</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Data is saved instantly and backed up using Firebase Firestore. Say goodbye to lost physical files and manual encoding errors.
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden md:col-span-2">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:leaf" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:leaf" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">100% Paperless Process</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Reduce physical clutter, minimize human error, and help the environment by moving your division's transactions entirely online.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
