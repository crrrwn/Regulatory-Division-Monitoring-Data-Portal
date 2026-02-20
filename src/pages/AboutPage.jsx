export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern font-sans">
      {/* Hero Section */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url(/ABOUTPAGE.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/75 via-slate-900/55 to-slate-900/85" aria-hidden="true" />
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgb(248,250,252)] via-[rgb(248,250,252)]/90 to-transparent" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center mt-10">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-xl leading-tight">
              About the Portal
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-200 font-medium drop-shadow-md max-w-2xl mx-auto">
              Our story, mission, and team behind the Regulatory Division Monitoring Data Portal
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-24 -mt-16">

        {/* Story Section */}
        <section className="bg-white rounded-[2rem] p-8 sm:p-14 shadow-xl shadow-slate-200/40 border-t-4 border-t-primary border-x border-b border-slate-100 max-w-5xl mx-auto relative overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-shadow duration-500">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" aria-hidden="true"></div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-8 text-center relative z-10">
            The Story Behind the Portal
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl leading-relaxed text-center font-medium relative z-10">
            Developed to support the local agriculture sector, this portal began as an initiative to unify and streamline the complex workflows of our core Operational Units. By transitioning from manual paperwork to a centralized cloud-based system, the portal bridges the gap between diverse agricultural and veterinary sectors. It ensures seamless coordination and real-time data management across three main divisions: Registration & Licensing (handling Animal Feeds, Livestock & Handlers, Plant Materials, and Organic Certifications), Quality Control (ensuring Good Agri Practices, Food Safety, Land Use, and SAFDZ Validation), and Surveillance & Disease (monitoring Plant Pests and Animal Diseases).
          </p>
        </section>

        {/* Mission & Vision Section */}
        <section className="space-y-12 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Mission & Vision
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm opacity-90"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Mission Card */}
            <div className="group bg-white rounded-3xl p-10 border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none transform translate-x-4 -translate-y-4 text-primary">
                <iconify-icon icon="mdi:target" width="160" height="160"></iconify-icon>
              </div>
              <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mb-6 group-hover:scale-110 group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:target" width="36" height="36"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">Mission</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To enhance the efficiency, accuracy, and accessibility of agricultural and veterinary services by integrating a secure digital platform that simplifies data management for the Regulatory Division.
              </p>
            </div>

            {/* Vision Card */}
            <div className="group bg-white rounded-3xl p-10 border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none transform -translate-x-4 -translate-y-4 text-primary">
                <iconify-icon icon="mdi:eye-outline" width="160" height="160"></iconify-icon>
              </div>
              <div className="inline-flex p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary mb-6 group-hover:scale-110 group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:eye-outline" width="36" height="36"></iconify-icon>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-primary transition-colors">Vision</h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                To establish a highly responsive and digitally empowered local agriculture sector where monitoring, licensing, and disease surveillance are handled seamlessly to better serve the community.
              </p>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section className="space-y-14 max-w-6xl mx-auto">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Our Team
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm opacity-90"></div>
            <p className="text-slate-600 text-lg sm:text-xl text-center max-w-3xl mx-auto mt-6">
              The developers behind the system. A dedicated two-person development team of CCS students collaborating on software design, cloud infrastructure, and process flow to bring real-time agricultural and veterinary data monitoring to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-10">
            {/* Cerra */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative mb-8 mt-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary/5 rounded-full blur-xl group-hover:blur-2xl group-hover:from-primary/40 transition-all duration-500 scale-110"></div>
                <img
                  src="/CERRA.png"
                  alt="Cerra Arwen D. Dela Peña"
                  className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">Cerra Arwen D. Dela Peña</h3>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide mb-5">
                Lead Engineer | Full-Stack & UI/UX
              </span>
              <p className="text-slate-600 leading-relaxed text-base">
                Spearheaded the overall architecture and design of the platform, ensuring a seamless connection between the backend logic and the user interface.
              </p>
            </div>

            {/* Niño */}
            <div className="group bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="relative mb-8 mt-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary/5 rounded-full blur-xl group-hover:blur-2xl group-hover:from-primary/40 transition-all duration-500 scale-110"></div>
                <img
                  src="/NIÑO.png"
                  alt="Niño Noel D. Monsanto"
                  className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">Niño Noel D. Monsanto</h3>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm tracking-wide mb-5">
                Software Engineer | Full-Stack & UI/UX
              </span>
              <p className="text-slate-600 leading-relaxed text-base">
                Co-developed the core functionalities and crafted intuitive user experiences, turning complex codes into a visually appealing website.
              </p>
            </div>
          </div>
        </section>

        {/* Acknowledgment Section — plain, no card */}
        <section className="py-8 sm:py-12 text-center">
          <div className="space-y-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              Acknowledgment & Institution
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm opacity-90"></div>
          </div>

          <p className="text-slate-600 text-lg mb-8 font-medium">
            Supported by the College of Computer Studies - Mindoro State University
          </p>

          <div className="flex flex-row items-center justify-center gap-12 sm:gap-20 py-6">
            <img src="/CCS LOGO.png" alt="CCS Logo" className="h-24 sm:h-32 object-contain drop-shadow-md hover:scale-110 hover:drop-shadow-lg transition-all duration-500" />
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-primary/30 to-transparent hidden sm:block rounded-full"></div>
            <img src="/MINSU LOGO.png" alt="MINSU Logo" className="h-24 sm:h-32 object-contain drop-shadow-md hover:scale-110 hover:drop-shadow-lg transition-all duration-500" />
          </div>

          <div className="mt-10 space-y-3">
            <p className="text-slate-800 font-bold text-lg sm:text-xl">
              College of Computer Studies · Mindoro State University
            </p>
            <p className="text-slate-500 text-base max-w-3xl mx-auto leading-relaxed">
              This project was developed under the guidance of CCS faculty and aligns with the department's goal of promoting innovation through modern information systems and advanced web technologies.
            </p>
          </div>
        </section>

      </div>
    </div>
  )
}