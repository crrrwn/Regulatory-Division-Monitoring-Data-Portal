export default function FeaturesPage() {
  return (
    <div className="py-10 sm:py-16 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <section className="text-center space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            System Features & Capabilities
          </h1>
          <p className="text-lg sm:text-xl text-[#5c574f]">
            A robust, cloud-powered solution built for the Regulatory Division's complex workflows.
          </p>
        </section>

        {/* Comprehensive Operational Modules */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:view-module" width="28"></iconify-icon>
            Comprehensive Operational Modules
          </h2>
          <p className="text-[#5c574f] text-base sm:text-lg">
            Designed specifically to handle the diverse needs of the agriculture and veterinary sectors. The system neatly categorizes records into three main units for easy management:
          </p>
          
          <div className="space-y-4">
            <div className="p-4 sm:p-6 rounded-lg bg-white border-2 border-primary/20 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <iconify-icon icon="mdi:file-document-edit" width="24"></iconify-icon>
                Registration & Licensing
              </h3>
              <p className="text-[#5c574f] text-sm sm:text-base">
                Efficiently process applications for the Animal Feeds Unit, Livestock & Handlers, Transport Carriers, Plant Material/Nursery, and Organic Agri Certification. It also handles Animal Welfare Concerns.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-lg bg-white border-2 border-primary/20 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <iconify-icon icon="mdi:check-circle" width="24"></iconify-icon>
                Quality Control
              </h3>
              <p className="text-[#5c574f] text-sm sm:text-base">
                Ensure strict compliance with standards through dedicated tracking for Good Agri Practices, Good Animal Husbandry, Organic Post-Market, Land Use Concerns, Food Safety Unit, and SAFDZ Validation.
              </p>
            </div>

            <div className="p-4 sm:p-6 rounded-lg bg-white border-2 border-primary/20 shadow-sm">
              <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                <iconify-icon icon="mdi:microscope" width="24"></iconify-icon>
                Surveillance & Disease
              </h3>
              <p className="text-[#5c574f] text-sm sm:text-base">
                Log and monitor critical real-time data for Plant Pest Surveillance, Animal Disease Surveillance, and CFS/ADMCC.
              </p>
            </div>
          </div>
        </section>

        {/* Smart System Features */}
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
            <iconify-icon icon="mdi:star-outline" width="28"></iconify-icon>
            Smart System Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:view-dashboard" class="text-primary shrink-0" width="32" height="32"></iconify-icon>
                <div>
                  <h3 className="font-bold text-primary mb-2">Centralized Interactive Dashboard</h3>
                  <p className="text-sm text-[#5c574f]">
                    Get a clear, bird's-eye view of all three operational units as soon as you log in. Monitor pending licenses, quality control validations, and active disease surveillance reports in one workspace.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:magnify" class="text-primary shrink-0" width="32" height="32"></iconify-icon>
                <div>
                  <h3 className="font-bold text-primary mb-2">Advanced Smart Search</h3>
                  <p className="text-sm text-[#5c574f]">
                    Lightning-fast retrieval of records. Find client names, business permits, or specific transport carriers across any unit in just a few keystrokes.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:lock" class="text-primary shrink-0" width="32" height="32"></iconify-icon>
                <div>
                  <h3 className="font-bold text-primary mb-2">Secure Role-Based Login</h3>
                  <p className="text-sm text-[#5c574f]">
                    Separate access levels for Admins and Standard Users powered by Firebase Authentication. Sensitive data for disease surveillance and quality control remains strictly protected.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:cloud" class="text-primary shrink-0" width="32" height="32"></iconify-icon>
                <div>
                  <h3 className="font-bold text-primary mb-2">Cloud-Powered Database</h3>
                  <p className="text-sm text-[#5c574f]">
                    Data is saved instantly and backed up using Firebase Firestore. Say goodbye to lost physical files and manual encoding errors.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-lg bg-white border border-border shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div className="flex gap-3 items-start">
                <iconify-icon icon="mdi:leaf" class="text-primary shrink-0" width="32" height="32"></iconify-icon>
                <div>
                  <h3 className="font-bold text-primary mb-2">100% Paperless Process</h3>
                  <p className="text-sm text-[#5c574f]">
                    Reduce physical clutter, minimize human error, and help the environment by moving your division's transactions entirely online.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
