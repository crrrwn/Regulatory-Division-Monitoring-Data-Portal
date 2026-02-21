import { Link } from 'react-router-dom'
import { getPublicImageUrl } from '../utils/publicAssets'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern">
      {/* Hero */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[72vh] py-24 sm:py-28 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${getPublicImageUrl('DA HOMEPAGE.png')})` }}
      >
        {/* Light green fade sa TAAS lang — hindi na umaabot sa Admin/Staff portal buttons */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/12 to-transparent [mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_70%)]" aria-hidden="true" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_20%,rgba(255,255,255,0.04),transparent_50%)]" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-background via-background/98 to-transparent" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center space-y-14 -translate-y-6">
          <div className="space-y-6">
            <h1 className="home-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black text-white tracking-tight leading-[1.12] drop-shadow-lg [text-shadow:0_2px_20px_rgba(0,0,0,0.2)]">
              Regulatory Division Monitoring Data Portal
            </h1>
            <p className="home-hero-subtitle text-base sm:text-lg text-white font-medium max-w-xl mx-auto leading-relaxed drop-shadow-md [text-shadow:0_1px_2px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.2)]">
              One secure hub for accreditation, food safety, and animal & plant welfare. Select your portal below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-16">
            <Link
              to="/admin-login"
              className="home-portal-card-1 home-portal-card group relative flex items-center gap-3 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#6b8f5a] via-[#4a6b3c] to-[#1e4d2b] border-2 border-[#3d5a32] text-left shadow-lg hover:shadow-xl hover:shadow-[#3d5a32]/30 hover:-translate-y-1 transition-all duration-400 ease-out overflow-hidden"
            >
              <span className="relative flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-white/20 text-white shadow-inner group-hover:bg-white/25 group-hover:scale-105 transition-all duration-400">
                <iconify-icon icon="mdi:shield-account" width="24" height="24"></iconify-icon>
              </span>
              <div className="relative min-w-0 flex-1 min-w-0">
                <span className="block font-bold text-white text-lg mb-0.5 whitespace-nowrap">Admin Portal</span>
                <span className="block text-xs text-white/90 font-medium whitespace-nowrap">Login as admin user</span>
              </div>
              <span className="relative flex-shrink-0 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                <iconify-icon icon="mdi:arrow-right" width="18" height="18"></iconify-icon>
              </span>
            </Link>

            <Link
              to="/staff-login"
              className="home-portal-card-2 home-portal-card group relative flex items-center gap-3 p-4 sm:p-5 rounded-xl bg-gradient-to-br from-[#7a6340] via-[#9A7B4F] to-[#c9b896] border-2 border-[#9A7B4F] text-left shadow-lg hover:shadow-xl hover:shadow-[#8F7A45]/30 hover:-translate-y-1 transition-all duration-400 ease-out overflow-hidden"
            >
              <span className="relative flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-lg bg-white/20 text-white shadow-inner group-hover:bg-white/25 group-hover:scale-105 transition-all duration-400">
                <iconify-icon icon="mdi:account-group" width="24" height="24"></iconify-icon>
              </span>
              <div className="relative min-w-0 flex-1 min-w-0">
                <span className="block font-bold text-white text-lg mb-0.5 whitespace-nowrap">Staff Portal</span>
                <span className="block text-xs text-white/90 font-medium whitespace-nowrap">Login as staff user</span>
              </div>
              <span className="relative flex-shrink-0 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400">
                <iconify-icon icon="mdi:arrow-right" width="18" height="18"></iconify-icon>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Intro + Core units */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-4 sm:px-6 pb-8 space-y-20 mt-8">
        <section className="home-intro-box relative bg-white rounded-2xl px-8 sm:px-12 py-10 sm:py-12 border-2 border-border shadow-xl max-w-3xl mx-auto overflow-hidden hover:shadow-2xl transition-all duration-400">
          <span className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-tl from-primary/5 to-transparent rounded-tl-full pointer-events-none" aria-hidden="true" />
          <div className="relative text-center">
            <p className="text-content text-base sm:text-lg leading-relaxed font-medium text-balance max-w-2xl mx-auto">
              Modernizing agricultural and veterinary services for a faster, safer, and more efficient community. This portal provides local government staff and administrators with a centralized hub to seamlessly manage operational data, track accreditations, ensure food safety, and monitor animal and plant welfare all in one secure place.
            </p>
          </div>
        </section>

        <section className="space-y-12">
          <div className="text-center space-y-4 home-section-title">
            <h2 className="text-2xl sm:text-3xl font-bold text-content tracking-tight">
              Core Operational Units
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Registration, quality control, and surveillance services under the Regulatory Division.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="home-core-card-1 group relative bg-white rounded-xl p-5 sm:p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-2.5 rounded-lg bg-surface/80 text-primary mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <iconify-icon icon="mdi:clipboard-text-outline" width="22" height="22"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                Registration & Licensing
              </h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Animal Feeds, Livestock, Plant Materials, Organic Certifications
              </p>
            </div>

            <div className="home-core-card-2 group relative bg-white rounded-xl p-5 sm:p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-2.5 rounded-lg bg-surface/80 text-primary mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <iconify-icon icon="mdi:check-circle-outline" width="22" height="22"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                Quality Control
              </h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Good Agri Practices, Animal Husbandry, Food Safety, Land Use
              </p>
            </div>

            <div className="home-core-card-3 group relative bg-white rounded-xl p-5 sm:p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/25 hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-2.5 rounded-lg bg-surface/80 text-primary mb-4 group-hover:bg-primary/10 transition-colors duration-300">
                <iconify-icon icon="mdi:microscope" width="22" height="22"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 tracking-tight group-hover:text-primary transition-colors duration-300">
                Surveillance & Disease
              </h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                Plant Pest, Animal Disease Monitoring, CFS/ADMCC
              </p>
            </div>
          </div>
        </section>

        {/* Footer strip */}
        <footer className="home-footer text-center py-8 border-t border-border/80">
          <p className="text-text-muted text-sm font-medium">
            Regulatory Division · Monitoring Data Portal
          </p>
          <p className="text-text-muted/80 text-xs mt-1">
            Agricultural & veterinary services · Secure, centralized access
          </p>
        </footer>
      </div>
    </div>
  )
}
