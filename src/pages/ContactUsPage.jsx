export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern">
      {/* Hero */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}CONTACTUS.png)` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background via-background/90 to-transparent" aria-hidden="true" />

        <div className="contact-hero relative z-10 max-w-3xl mx-auto w-full flex flex-col items-center text-center">
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              Get In Touch
            </h1>
            <p className="text-base sm:text-lg text-slate-200 font-medium drop-shadow max-w-xl mx-auto">
              Need assistance with your account or have inquiries regarding our services? We are here to help.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-20 max-w-4xl mx-auto w-full px-4 sm:px-6 pb-16 space-y-14 -mt-8">

        {/* Our Offices */}
        <section className="space-y-8">
          <div className="contact-offices-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
              Our Offices
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="contact-office-1 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:map-marker" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Regional Field Office</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                J.P. Rizal Street, Barangay Camilmil, Calapan City, Oriental Mindoro
              </p>
            </div>

            <div className="contact-office-2 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 text-left overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:office-building" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-2 group-hover:text-primary transition-colors duration-300">Satellite Office</h3>
              <p className="relative text-text-muted text-xs leading-relaxed">
                3rd Floor, ATI Building, Elliptical Road, Diliman, Quezon City
              </p>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="space-y-8">
          <div className="contact-details-title text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-content tracking-tight">
              Contact Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="contact-detail-1 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:phone" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-1 group-hover:text-primary transition-colors duration-300">Telephone</h3>
              <p className="relative text-text-muted text-sm">8273-2474 Local 4400</p>
            </div>

            <div className="contact-detail-2 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:email" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-1 group-hover:text-primary transition-colors duration-300">Email Address</h3>
              <a href="mailto:mimaropa@mail.da.gov.ph" className="relative text-primary font-medium hover:underline text-sm transition-colors duration-300">
                mimaropa@mail.da.gov.ph
              </a>
            </div>

            <div className="contact-detail-3 group relative bg-white rounded-2xl p-5 sm:p-6 border border-border shadow-md hover:shadow-lg hover:border-primary/25 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center overflow-hidden">
              <span className="absolute left-0 top-4 bottom-4 w-0.5 bg-primary/20 rounded-r group-hover:bg-primary/40 transition-colors duration-300" aria-hidden="true" />
              <span className="relative inline-flex p-3 rounded-xl bg-surface/80 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <iconify-icon icon="mdi:facebook" width="24" height="24"></iconify-icon>
              </span>
              <h3 className="relative text-base font-bold text-content mb-1 group-hover:text-primary transition-colors duration-300">Official Facebook</h3>
              <a href="https://www.facebook.com/DARFOMIMAROPA" target="_blank" rel="noopener noreferrer" className="relative text-primary font-medium hover:underline text-sm transition-colors duration-300">
                DA RFO MIMAROPA
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
