export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col page-bg-pattern">
      {/* Hero Section — CONTACTUS.PNG from public folder */}
      <section
        className="relative flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-[70vh] py-20 px-4 sm:px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}CONTACTUS.png)` }}
      >
        <div className="absolute inset-0 bg-slate-900/60" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgb(248,250,252)] via-[rgb(248,250,252)]/90 to-transparent" aria-hidden="true" />

        <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center">
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
              Get In Touch
            </h1>
            <p className="text-lg sm:text-xl text-slate-200 font-medium drop-shadow max-w-2xl mx-auto">
              Need assistance with your account or have inquiries regarding our services? We are here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Below the fold */}
      <div className="relative z-20 max-w-7xl mx-auto w-full px-4 sm:px-6 pb-24 space-y-20 -mt-8">

        {/* Our Offices — same section header + cards as HomePage */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Our Offices
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:map-marker" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:map-marker" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Regional Field Office</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                J.P. Rizal Street, Barangay Camilmil, Calapan City, Oriental Mindoro
              </p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-start text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:office-building" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:office-building" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">Satellite Office</h3>
              <p className="text-slate-500 leading-relaxed text-base">
                3rd Floor, ATI Building, Elliptical Road, Diliman, Quezon City
              </p>
            </div>
          </div>
        </section>

        {/* Contact Details — same card style */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Contact Details
            </h2>
            <div className="h-1.5 w-28 bg-gradient-to-r from-primary/80 to-primary mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:phone" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:phone" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">Telephone</h3>
              <p className="text-slate-500 text-base">8273-2474 Local 4400</p>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:email" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:email" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">Email Address</h3>
              <a href="mailto:mimaropa@mail.da.gov.ph" className="text-primary font-medium hover:underline text-base">
                mimaropa@mail.da.gov.ph
              </a>
            </div>

            <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-400 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
                <iconify-icon icon="mdi:facebook" width="120" height="120"></iconify-icon>
              </div>
              <div className="inline-flex p-4 rounded-xl bg-slate-50 text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                <iconify-icon icon="mdi:facebook" width="32" height="32"></iconify-icon>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors">Official Facebook</h3>
              <a href="https://www.facebook.com/DARFOMIMAROPA" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline text-base">
                DA RFO MIMAROPA
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
