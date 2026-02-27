import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useDisabledUnits } from '../context/DisabledUnitsContext';
import { pathToCollectionId } from '../lib/collections';
import { SECTION_IDS, getUnitIdsForSections } from '../lib/sections';

const SECTIONS = [
  {
    id: SECTION_IDS.REGISTRATION_LICENSING,
    title: 'Registration and Licensing',
    description: 'Manage accreditations and compliance for feeds and handlers.',
    theme: 'primary',
    icon: 'mdi:certificate-outline',
    gradient: 'from-[#1e4d2b] via-[#1a4526] to-[#153019]',
    borderColor: 'border-[#1e4d2b]',
    hoverBorder: 'hover:border-[#1e4d2b]/50',
    iconBg: 'bg-[#1e4d2b]/10 text-[#1e4d2b] group-hover:bg-[#1e4d2b]/15',
    units: [
      { path: '/dashboard/forms/animal-feed', label: 'Animal Feeds Unit' },
      { path: '/dashboard/forms/animal-welfare', label: 'Animal Welfare Concern Unit' },
      { path: '/dashboard/forms/livestock-handlers', label: 'Livestock/Poultry Handlers' },
      { path: '/dashboard/forms/transport-carrier', label: 'Transport Carriers Accreditation' },
      { path: '/dashboard/forms/plant-material', label: 'Plant Material / Nursery Accreditation' },
      { path: '/dashboard/forms/organic-agri', label: 'Organic Agriculture Certification' },
    ],
  },
  {
    id: SECTION_IDS.QUALITY_CONTROL_INSPECTION,
    title: 'Quality Control and Inspection',
    description: 'Ensure standards for crops, animals, and food safety.',
    theme: 'primary-light',
    icon: 'mdi:shield-check-outline',
    gradient: 'from-[#5c7355] via-[#4a6b3c] to-[#3d5a32]',
    borderColor: 'border-[#5c7355]',
    hoverBorder: 'hover:border-[#5c7355]/50',
    iconBg: 'bg-[#5c7355]/10 text-[#5c7355] group-hover:bg-[#5c7355]/15',
    units: [
      { path: '/dashboard/forms/good-agri-practices', label: 'Good Agricultural Practices' },
      { path: '/dashboard/forms/good-animal-husbandry', label: 'Good Animal Husbandry' },
      { path: '/dashboard/forms/organic-post-market', label: 'Organic Post-Market Surveillance' },
      { path: '/dashboard/forms/land-use-matter', label: 'Land Use Matter Concern' },
      { path: '/dashboard/forms/food-safety', label: 'Food Safety Unit' },
      { path: '/dashboard/forms/safdz-validation', label: 'SAFDZ Validation' },
    ],
  },
  {
    id: SECTION_IDS.PEST_DISEASE_SURVEILLANCE,
    title: 'Pest & Disease Surveillance',
    description: 'Monitor and control spread of plant and animal diseases.',
    theme: 'accent',
    icon: 'mdi:virus-outline',
    gradient: 'from-[#9a7b4f] via-[#b8a066] to-[#8f7a45]',
    borderColor: 'border-[#b8a066]',
    hoverBorder: 'hover:border-[#b8a066]/50',
    iconBg: 'bg-[#b8a066]/10 text-[#9a7b4f] group-hover:bg-[#b8a066]/15',
    units: [
      { path: '/dashboard/forms/plant-pest-surveillance', label: 'Plant Pest Surveillance' },
      { path: '/dashboard/forms/cfs-admcc', label: 'CFS / ADMCC' },
      { path: '/dashboard/forms/animal-disease-surveillance', label: 'Animal Disease Surveillance' },
    ],
  },
];

export default function Dashboard() {
  const { role, userAllowedSections } = useAuth()
  const { disabledUnitIds } = useDisabledUnits()
  const allowedUnitIds = userAllowedSections && role === 'staff' ? getUnitIdsForSections(userAllowedSections) : null

  return (
    <div className="min-w-0 w-full max-w-full overflow-x-hidden px-3 sm:px-4 md:px-5 lg:px-6 pb-10 sm:pb-12">
      <div className="w-full max-w-7xl mx-auto min-w-0 space-y-4 sm:space-y-6">

        {/* --- HEADER --- */}
        <div className="dashboard-section rounded-xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden" style={{ animationDelay: '0ms' }}>
          <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-4 sm:px-6 py-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm break-words">
                  Dashboard Overview
                </h1>
                <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1 break-words">
                  Welcome back! Select a module below to manage records and forms.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 shrink-0">
                <Link
                  to="/dashboard/analytics"
                  className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 min-h-[44px] bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm touch-manipulation"
                >
                  <iconify-icon icon="mdi:chart-box-outline" width="18" className="shrink-0"></iconify-icon>
                  Data Analytics
                </Link>
                <Link
                  to="/dashboard/records"
                  className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 sm:py-2 min-h-[44px] bg-[#b8a066] text-[#153019] rounded-xl border border-[#b8a066]/50 hover:bg-[#d4c4a0] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-lg transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm touch-manipulation"
                >
                  <iconify-icon icon="mdi:database-search-outline" width="18" className="shrink-0"></iconify-icon>
                  View Masterlist
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTIONS --- */}
        {SECTIONS.map((section, idx) => (
          <div
            key={idx}
            className="dashboard-section rounded-xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/5 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/8 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]"
            style={{ animationDelay: `${80 + idx * 120}ms` }}
          >
            {/* Section header strip */}
            <div className={`bg-gradient-to-r ${section.gradient} px-4 sm:px-5 py-3 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/15 backdrop-blur-sm border border-white/20 text-white">
                  <iconify-icon icon={section.icon} width="22"></iconify-icon>
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-black text-white uppercase tracking-tight drop-shadow-sm break-words">
                    {section.title}
                  </h2>
                  <p className="text-[10px] font-semibold text-white/85 tracking-wider mt-0.5 break-words">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Unit cards grid */}
            <div className="p-4 sm:p-5 bg-gradient-to-b from-[#faf8f5] to-[#f2ede6]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 min-w-0">
                {section.units.map((unit, unitIdx) => {
                  const unitId = pathToCollectionId(unit.path)
                  const isAppDisabled = disabledUnitIds.includes(unitId)
                  const isSectionRestricted = allowedUnitIds !== null && !allowedUnitIds.includes(unitId)
                  const isUnitDisabled = isAppDisabled || isSectionRestricted
                  if (isUnitDisabled) {
                    return (
                      <div
                        key={unit.path}
                        className="dashboard-card group relative bg-gray-100 rounded-xl border-2 border-[#e8e0d4] p-4 shadow-sm flex items-start gap-3 overflow-hidden min-w-0 cursor-not-allowed opacity-75"
                        style={{ animationDelay: `${180 + idx * 120 + unitIdx * 40}ms` }}
                      >
                        <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-gray-200 border border-[#e8e0d4] text-[#8a857c]">
                          <iconify-icon icon="mdi:file-document-edit-outline" width="20"></iconify-icon>
                        </div>
                        <div className="flex-1 min-w-0 z-10">
                          <p className="font-bold text-[#5c574f] text-sm leading-snug">
                            {unit.label}
                          </p>
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                            {isSectionRestricted ? 'Not in your section' : 'Disabled'}
                          </span>
                        </div>
                      </div>
                    )
                  }
                  return (
                    <Link
                      key={unit.path}
                      to={unit.path}
                      className="dashboard-card group relative bg-white rounded-xl border-2 border-[#e8e0d4] p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#1e4d2b]/40 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] flex items-start gap-3 overflow-hidden min-w-0"
                      style={{ animationDelay: `${180 + idx * 120 + unitIdx * 40}ms` }}
                    >
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 bg-gradient-to-br ${section.gradient}`} />
                      <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110 ${section.iconBg} border border-[#e8e0d4]`}>
                        <iconify-icon icon="mdi:file-document-edit-outline" width="20"></iconify-icon>
                      </div>
                      <div className="flex-1 min-w-0 z-10">
                        <p className="font-bold text-[#1e4d2b] group-hover:text-[#153019] text-sm leading-snug transition-colors duration-300">
                          {unit.label}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#5c7355] mt-1.5 group-hover:text-[#1e4d2b] transition-colors duration-300">
                          <span>Open Form</span>
                          <span className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:translate-x-0.5">
                            <iconify-icon icon="mdi:arrow-right" width="14"></iconify-icon>
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
