export default function AboutPage() {
  return (
    <div className="py-10 sm:py-16 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Story Section */}
        <section className="space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
            The Story Behind the Regulatory Division Monitoring Data Portal
          </h1>
          <p className="text-[#5c574f] text-base sm:text-lg leading-relaxed">
            Developed to support the local agriculture sector, this portal began as an initiative to unify and streamline the complex workflows of our core Operational Units. By transitioning from manual paperwork to a centralized cloud-based system, the portal bridges the gap between diverse agricultural and veterinary sectors. It ensures seamless coordination and real-time data management across three main divisions: Registration & Licensing (handling Animal Feeds, Livestock & Handlers, Plant Materials, and Organic Certifications), Quality Control (ensuring Good Agri Practices, Food Safety, Land Use, and SAFDZ Validation), and Surveillance & Disease (monitoring Plant Pests and Animal Diseases).
          </p>
        </section>

        {/* Mission Section */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:target" width="28"></iconify-icon>
            Mission
          </h2>
          <p className="text-[#5c574f] text-base sm:text-lg">
            To enhance the efficiency, accuracy, and accessibility of agricultural and veterinary services by integrating a secure digital platform that simplifies data management for the Regulatory Division.
          </p>
        </section>

        {/* Vision Section */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:eye-outline" width="28"></iconify-icon>
            Vision
          </h2>
          <p className="text-[#5c574f] text-base sm:text-lg">
            To establish a highly responsive and digitally empowered local agriculture sector where monitoring, licensing, and disease surveillance are handled seamlessly to better serve the community.
          </p>
        </section>

        {/* Our Team Section */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:account-group" width="28"></iconify-icon>
            Our Team
          </h2>
          <p className="text-[#5c574f] text-base sm:text-lg mb-6">
            The developers behind the system. A dedicated two-person development team of CCS students collaborating on software design, cloud infrastructure, and process flow to bring real-time agricultural and veterinary data monitoring to life.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <img 
                src="/CERRA.png" 
                alt="Cerra Arwen D. Dela Peña" 
                className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary">Cerra Arwen D. Dela Peña</h3>
                <p className="text-sm font-semibold text-[#5c574f]">Lead Engineer | Full-Stack & UI/UX</p>
                <p className="text-sm text-[#5c574f]">
                  Spearheaded the overall architecture and design of the platform, ensuring a seamless connection between the backend logic and the user interface.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center text-center space-y-4">
              <img 
                src="/NIÑO.png" 
                alt="Niño Noel D. Mosanto" 
                className="w-48 h-48 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-primary">Niño Noel D. Monsanto</h3>
                <p className="text-sm font-semibold text-[#5c574f]">Software Engineer | Full-Stack & UI/UX</p>
                <p className="text-sm text-[#5c574f]">
                  Co-developed the core functionalities and crafted intuitive user experiences, turning complex codes into a visually appealing website.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Acknowledgment Section */}
        <section className="space-y-6 py-8 border-t border-border">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:school-outline" width="28"></iconify-icon>
            Acknowledgment & Institution
          </h2>
          <p className="text-[#5c574f] text-base sm:text-lg">
            Supported by the College of Computer Studies - Mindoro State University
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-6">
            <img 
              src="/CCS LOGO.png" 
              alt="CCS Logo" 
              className="h-24 sm:h-32 object-contain"
            />
            <img 
              src="/MINSU LOGO.png" 
              alt="MINSU Logo" 
              className="h-24 sm:h-32 object-contain"
            />
          </div>
          
          <p className="text-[#5c574f] text-sm sm:text-base text-center">
            <strong className="text-primary">College of Computer Studies</strong><br />
            <strong className="text-primary">Mindoro State University</strong>
          </p>
          
          <p className="text-[#5c574f] text-sm sm:text-base">
            This project was developed under the guidance of CCS faculty and aligns with the department's goal of promoting innovation through modern information systems and advanced web technologies.
          </p>
        </section>
      </div>
    </div>
  )
}
