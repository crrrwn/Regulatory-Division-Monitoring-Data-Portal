import { getLandingGradient } from '../lib/colorTheme'

export default function AboutPage() {
  return (
    <div
      className="min-h-screen flex flex-col font-sans"
      style={{ background: getLandingGradient() }}
    >
      {/* Hero */}
      <section className="relative flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6">
        <div className="about-hero relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center text-center">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              About the Portal
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium drop-shadow-md max-w-xl mx-auto">
              Our story, mission, and team behind the Regulatory Division Monitoring Data Portal
            </p>
          </div>
        </div>
      </section>

      {/* Main content — card starts lower like Features page */}
      <div className="relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-14 -mt-8">

        {/* Story */}
        <section className="about-story bg-white rounded-2xl p-5 sm:p-7 shadow-lg border border-border max-w-3xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight mb-5 text-center">
            The Story Behind the Portal
          </h2>
          <p className="text-text-muted text-sm sm:text-base leading-relaxed text-center font-medium">
            Developed to support the local agriculture sector, this portal began as an initiative to unify and streamline the complex workflows of our core Operational Units. By transitioning from manual paperwork to a centralized cloud-based system, the portal bridges the gap between diverse agricultural and veterinary sectors. It ensures seamless coordination and real-time data management across three main divisions: Registration & Licensing (handling Animal Feeds, Livestock & Handlers, Plant Materials, and Organic Certifications), Quality Control (ensuring Good Agri Practices, Food Safety, Land Use, and SAFDZ Validation), and Surveillance & Disease (monitoring Plant Pests and Animal Diseases).
          </p>
        </section>

        {/* Mission & Vision — section title on gradient, white */}
        <section className="space-y-8">
          <div className="about-mission-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
              Mission & Vision
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="about-mission-card-1 group bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <span className="inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:target" width="28" height="28"></iconify-icon>
              </span>
              <h3 className="text-lg font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Mission</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                To enhance the efficiency, accuracy, and accessibility of agricultural and veterinary services by integrating a secure digital platform that simplifies data management for the Regulatory Division.
              </p>
            </div>

            <div className="about-mission-card-2 group bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <span className="inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:eye-outline" width="28" height="28"></iconify-icon>
              </span>
              <h3 className="text-lg font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Vision</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                To establish a highly responsive and digitally empowered local agriculture sector where monitoring, licensing, and disease surveillance are handled seamlessly to better serve the community.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
