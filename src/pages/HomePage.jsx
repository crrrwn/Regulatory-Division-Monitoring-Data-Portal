import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CONTACT } from '../config'

export default function HomePage() {
  const location = useLocation()
  useEffect(() => {
    const hash = location.hash?.slice(1)
    if (hash) setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [location])

  return (
    <>
      <section className="relative py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 px-1">
            Agriculture & Veterinary Information Management System
          </h1>
          <p className="text-base sm:text-lg text-[#5c574f] mb-8 sm:mb-12">
            Efficient Data Management for Licensing, Quality Control, and Surveillance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <Link
              to="/admin-login"
              className="group flex flex-col items-center p-6 sm:p-8 rounded-xl bg-white border-2 border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                <iconify-icon icon="mdi:shield-account" width="28" height="28"></iconify-icon>
              </span>
              <span className="font-semibold text-primary mb-1">ADMIN PORTAL</span>
              <span className="text-sm text-[#5c574f]">Login as Admin</span>
            </Link>
            <Link
              to="/staff-login"
              className="group flex flex-col items-center p-8 rounded-xl bg-white border-2 border-border hover:border-primary hover:shadow-lg transition-all"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition">
                <iconify-icon icon="mdi:account-group" width="28" height="28"></iconify-icon>
              </span>
              <span className="font-semibold text-primary mb-1">STAFF PORTAL</span>
              <span className="text-sm text-[#5c574f]">Login as User</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="about" className="py-10 sm:py-16 px-3 sm:px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
            <iconify-icon icon="mdi:information-outline" width="28"></iconify-icon>
            About
          </h2>
          <p className="text-[#5c574f] mb-4">
            <strong className="text-primary">Mission:</strong> To make the monitoring of agricultural and veterinary transactions faster and easier.
          </p>
          <p className="text-[#5c574f]">
            This system was built for the Regulatory Division to speed up the recording process for Animal Welfare, Accreditation, and Disease Monitoring.
          </p>
        </div>
      </section>

      <section id="features" className="py-10 sm:py-16 px-3 sm:px-4 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-6 sm:mb-8 flex items-center gap-2">
            <iconify-icon icon="mdi:star-outline" width="28"></iconify-icon>
            Features
          </h2>
          <ul className="space-y-3 sm:space-y-4">
            <li className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-white border border-border">
              <iconify-icon icon="mdi:lock-outline" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
              <div>
                <strong className="text-primary">Secure Login</strong> — Separate access for Admins and Standard Users using Firebase Authentication.
              </div>
            </li>
            <li className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-white border border-border">
              <iconify-icon icon="mdi:cloud-outline" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
              <div>
                <strong className="text-primary">Cloud Database</strong> — Data is saved instantly using Firebase Firestore. No more manual spreadsheets.
              </div>
            </li>
            <li className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-white border border-border">
              <iconify-icon icon="mdi:view-dashboard-outline" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
              <div>
                <strong className="text-primary">Easy Dashboard</strong> — Quick access to Registration, Quality Control, and Surveillance units.
              </div>
            </li>
            <li className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-white border border-border">
              <iconify-icon icon="mdi:magnify" class="text-primary shrink-0" width="24" height="24"></iconify-icon>
              <div>
                <strong className="text-primary">Smart Search</strong> — Fast searching for records, names, and accreditation status.
              </div>
            </li>
          </ul>
        </div>
      </section>

      <section id="contact" className="py-10 sm:py-16 px-3 sm:px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
            <iconify-icon icon="mdi:contact-mail-outline" width="28"></iconify-icon>
            Contact Us
          </h2>
          <div className="space-y-3 text-[#5c574f] text-sm sm:text-base break-words">
            <p><strong className="text-primary">Office Address:</strong> {CONTACT.officeAddress}</p>
            <p><strong className="text-primary">Email Support:</strong> {CONTACT.emailSupport}</p>
            <p><strong className="text-primary">Hotline:</strong> {CONTACT.hotline}</p>
            {CONTACT.facebookUrl && <p><strong className="text-primary">Social Media:</strong> <a href={CONTACT.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Official Facebook Page</a></p>}
          </div>
        </div>
      </section>
    </>
  )
}
