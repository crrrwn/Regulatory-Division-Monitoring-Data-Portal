import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="py-10 sm:py-16 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Hero Section with Image */}
        <section className="text-center space-y-6">
          <div className="mb-6">
            <img 
              src="/DA HOMEPAGE.png" 
              alt="Regulatory Division Monitoring Data Portal" 
              className="w-full max-w-4xl mx-auto rounded-lg shadow-lg"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Welcome to the Regulatory Division Monitoring Data Portal
          </h1>
          <p className="text-lg sm:text-xl text-[#5c574f] font-medium">
            Your unified digital platform for Registration & Licensing, Quality Control, and Surveillance & Disease.
          </p>
        </section>

        {/* Welcome Text */}
        <section className="space-y-4">
          <p className="text-[#5c574f] text-base sm:text-lg leading-relaxed text-center max-w-4xl mx-auto">
            Modernizing agricultural and veterinary services for a faster, safer, and more efficient community. This portal provides local government staff and administrators with a centralized hub to seamlessly manage operational data, track accreditations, ensure food safety, and monitor animal and plant welfare—all in one secure place.
          </p>
        </section>

        {/* Core Operational Units */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
            Our Core Operational Units
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-white border-2 border-primary/20 shadow-sm text-center">
              <div className="flex justify-center mb-3 text-primary">
                <iconify-icon icon="mdi:clipboard-text-outline" width="48" height="48"></iconify-icon>
              </div>
              <h3 className="font-bold text-primary mb-2">Registration & Licensing</h3>
              <p className="text-sm text-[#5c574f]">
                Animal Feeds, Livestock, Plant Materials, Organic Certifications
              </p>
            </div>
            <div className="p-5 rounded-lg bg-white border-2 border-primary/20 shadow-sm text-center">
              <div className="flex justify-center mb-3 text-primary">
                <iconify-icon icon="mdi:check-circle-outline" width="48" height="48"></iconify-icon>
              </div>
              <h3 className="font-bold text-primary mb-2">Quality Control</h3>
              <p className="text-sm text-[#5c574f]">
                Good Agri Practices, Animal Husbandry, Food Safety, Land Use
              </p>
            </div>
            <div className="p-5 rounded-lg bg-white border-2 border-primary/20 shadow-sm text-center">
              <div className="flex justify-center mb-3 text-primary">
                <iconify-icon icon="mdi:microscope" width="48" height="48"></iconify-icon>
              </div>
              <h3 className="font-bold text-primary mb-2">Surveillance & Disease</h3>
              <p className="text-sm text-[#5c574f]">
                Plant Pest, Animal Disease Monitoring, CFS/ADMCC
              </p>
            </div>
          </div>
        </section>

        {/* Quick Action / Portals */}
        <section className="space-y-6 py-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-primary">
              Quick Action / Portals
            </h2>
            <p className="text-[#5c574f] text-base sm:text-lg">
              Please select your designated portal to continue:
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <Link
              to="/admin-login"
              className="group flex flex-col items-center p-6 sm:p-8 rounded-xl bg-white border-2 border-border hover:border-primary hover:shadow-lg transition-all min-h-[140px] justify-center"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                <iconify-icon icon="mdi:shield-account" width="28" height="28"></iconify-icon>
              </span>
              <span className="font-semibold text-primary mb-1 text-lg">ADMIN PORTAL</span>
              <span className="text-sm text-[#5c574f]">Login as Admin</span>
            </Link>
            <Link
              to="/staff-login"
              className="group flex flex-col items-center p-6 sm:p-8 rounded-xl bg-white border-2 border-border hover:border-primary hover:shadow-lg transition-all min-h-[140px] justify-center"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                <iconify-icon icon="mdi:account-group" width="28" height="28"></iconify-icon>
              </span>
              <span className="font-semibold text-primary mb-1 text-lg">STAFF PORTAL</span>
              <span className="text-sm text-[#5c574f]">Login as User</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
