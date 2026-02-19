export default function ContactUsPage() {
  return (
    <div className="py-10 sm:py-16 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <section className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-[#5c574f]">
            Need assistance with your account or have inquiries regarding our services? We are here to help.
          </p>
        </section>

        {/* Our Offices */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:office-building" width="28"></iconify-icon>
            Our Offices
          </h2>
          <div className="space-y-4">
            <div className="p-4 sm:p-6 rounded-lg bg-white border border-border shadow-sm">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:map-marker" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
                <div>
                  <p className="font-semibold text-primary mb-1">Regional Field Office</p>
                  <p className="text-[#5c574f] text-sm sm:text-base">
                    J.P. Rizal Street, Barangay Camilmil, Calapan City, Oriental Mindoro
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-white border border-border shadow-sm">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:map-marker" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
                <div>
                  <p className="font-semibold text-primary mb-1">Satellite Office</p>
                  <p className="text-[#5c574f] text-sm sm:text-base">
                    3rd Floor, ATI Building, Elliptical Road, Diliman, Quezon City
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Details */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:contact-mail-outline" width="28"></iconify-icon>
            Contact Details
          </h2>
          <div className="space-y-3">
            <div className="p-4 sm:p-6 rounded-lg bg-white border border-border shadow-sm">
              <div className="flex gap-3 items-center">
                <iconify-icon icon="mdi:phone" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
                <div>
                  <p className="font-semibold text-primary mb-1">Telephone</p>
                  <p className="text-[#5c574f] text-sm sm:text-base">8273-2474 Local 4400</p>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-white border border-border shadow-sm">
              <div className="flex gap-3 items-center">
                <iconify-icon icon="mdi:email" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
                <div>
                  <p className="font-semibold text-primary mb-1">Email Address</p>
                  <a href="mailto:mimaropa@mail.da.gov.ph" className="text-primary hover:underline text-sm sm:text-base">
                    mimaropa@mail.da.gov.ph
                  </a>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6 rounded-lg bg-white border border-border shadow-sm">
              <div className="flex gap-3 items-center">
                <iconify-icon icon="mdi:facebook" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
                <div>
                  <p className="font-semibold text-primary mb-1">Official Facebook Page</p>
                  <a href="https://www.facebook.com/DARFOMIMAROPA" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm sm:text-base">
                    DA RFO MIMAROPA
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
