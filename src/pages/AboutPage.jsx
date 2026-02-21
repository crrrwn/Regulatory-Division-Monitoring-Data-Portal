import { getPublicImageUrl } from '../utils/publicAssets'

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern font-sans">
      {/* Hero — same size as Features page so background image is large */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${getPublicImageUrl('ABOUTPAGE.png')})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/55 to-slate-900/85" aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/90 to-transparent" aria-hidden="true" />

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

        {/* Mission & Vision */}
        <section className="space-y-8">
          <div className="about-mission-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
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

        {/* Our Team */}
        <section className="space-y-8">
          <div className="about-team-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
              Our Team
            </h2>
            <p className="text-text-muted text-sm sm:text-base text-center max-w-xl mx-auto">
              A dedicated two-person development team of CCS students collaborating on software design, cloud infrastructure, and process flow to bring real-time agricultural and veterinary data monitoring to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="about-team-card-1 group bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <div className="relative mb-5">
                <img
                  src={getPublicImageUrl('CERRA.png')}
                  alt="Cerra Arwen D. Dela Peña"
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-border shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-base font-bold text-content mb-1 group-hover:text-primary transition-colors duration-300">Cerra Arwen D. Dela Peña</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide mb-3">
                Lead Engineer | Full-Stack & UI/UX
              </span>
              <p className="text-text-muted text-xs leading-relaxed">
                Spearheaded the overall architecture and design of the platform, ensuring a seamless connection between the backend logic and the user interface.
              </p>
            </div>

            <div className="about-team-card-2 group bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <div className="relative mb-5">
                <img
                  src={getPublicImageUrl('NIÑO.png')}
                  alt="Niño Noel D. Monsanto"
                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-border shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-base font-bold text-content mb-1 group-hover:text-primary transition-colors duration-300">Niño Noel D. Monsanto</h3>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-xs tracking-wide mb-3">
                Software Engineer | Full-Stack & UI/UX
              </span>
              <p className="text-text-muted text-xs leading-relaxed">
                Co-developed the core functionalities and crafted intuitive user experiences, turning complex codes into a visually appealing website.
              </p>
            </div>
          </div>
        </section>

        {/* Acknowledgment */}
        <section className="about-ack py-6 sm:py-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight mb-4">
            Acknowledgment & Institution
          </h2>
          <p className="text-text-muted text-sm font-medium mb-6">
            Supported by the College of Computer Studies - Mindoro State University
          </p>
          <div className="flex flex-row items-center justify-center gap-8 sm:gap-12 py-4">
            <img src={getPublicImageUrl('CCS LOGO.png')} alt="CCS Logo" className="h-16 sm:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" />
            <div className="w-px h-14 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden sm:block rounded-full" aria-hidden="true" />
            <img src={getPublicImageUrl('MINSU LOGO.png')} alt="MINSU Logo" className="h-16 sm:h-20 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-content font-bold text-sm sm:text-base">
              College of Computer Studies · Mindoro State University
            </p>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              This project was developed under the guidance of CCS faculty and aligns with the department's goal of promoting innovation through modern information systems and advanced web technologies.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}
