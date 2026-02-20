import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern">
      {/* Hero Section */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}DA%20HOMEPAGE.png)` }}
      >
        {/* Gradient overlay with subtle primary tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/60 to-slate-900/80" aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-50 via-slate-50/80 to-transparent" aria-hidden="true" />

        <div className="relative z-10 max-w-6xl mx-auto w-full space-y-16 flex flex-col items-center text-center">
          {/* Header Text area — Centered */}
          <div className="space-y-5 max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              Regulatory Division Monitoring Data Portal
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 font-medium drop-shadow">
              Please select your portal to continue
            </p>
          </div>

          {/* Portals — Horizontal Layout with Premium Glass Effect */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full mx-auto">
            <Link
              to="/admin-login"
              className="group relative overflow-hidden flex items-center p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:border-white hover:ring-2 hover:ring-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-500 ease-out"
            >
              <div className="flex-shrink-0 mr-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 text-white group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                <iconify-icon icon="mdi:shield-account" width="32" height="32"></iconify-icon>
              </div>
              <div className="text-left">
                <span className="block font-extrabold text-white group-hover:text-primary mb-1 text-2xl tracking-wide transition-colors duration-500">
                  ADMIN PORTAL
                </span>
                <span className="block text-sm text-slate-300 group-hover:text-slate-500 font-medium transition-colors duration-500">
                  Login as Admin
                </span>
              </div>
            </Link>

            <Link
              to="/staff-login"
              className="group relative overflow-hidden flex items-center p-6 sm:p-8 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white hover:border-white hover:ring-2 hover:ring-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 transition-all duration-500 ease-out"
            >
              <div className="flex-shrink-0 mr-6 inline-flex items-center justify-center w-16 h-16 rounded-xl bg-white/20 text-white group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                <iconify-icon icon="mdi:account-group" width="32" height="32"></iconify-icon>
              </div>
              <div className="text-left">
                <span className="block font-extrabold text-white group-hover:text-primary mb-1 text-2xl tracking-wide transition-colors duration-500">
                  STAFF PORTAL
                </span>
                <span className="block text-sm text-slate-300 group-hover:text-slate-500 font-medium transition-colors duration-500">
                  Login as User
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Below the fold: intro + core units */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-20 -mt-8">
        <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-md border border-slate-100 border-l-4 border-l-primary max-w-5xl mx-auto hover:shadow-lg transition-shadow duration-500">
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed text-center font-medium">
            Modernizing agricultural and veterinary services for a faster, safer, and more efficient community. This portal provides local government staff and administrators with a centralized hub to seamlessly manage operational data, track accreditations, ensure food safety, and monitor animal and plant welfare—all in one secure place.
          </p>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Our Core Operational Units
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:clipboard-text-outline" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:clipboard-text-outline" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Registration & Licensing</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Animal Feeds, Livestock, Plant Materials, Organic Certifications
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:check-circle-outline" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:check-circle-outline" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Quality Control</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Good Agri Practices, Animal Husbandry, Food Safety, Land Use
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:microscope" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:microscope" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors duration-500">Surveillance & Disease</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                Plant Pest, Animal Disease Monitoring, CFS/ADMCC
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}