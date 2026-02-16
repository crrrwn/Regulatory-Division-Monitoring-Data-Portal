import React from 'react';
import { Link } from 'react-router-dom';

// Icons use <iconify-icon> loaded via script in index.html
const SECTIONS = [
  {
    title: 'Registration and Licensing',
    description: 'Manage accreditations and compliance for feeds and handlers.',
    theme: 'primary',
    icon: 'mdi:certificate-outline',
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
    title: 'Quality Control and Inspection',
    description: 'Ensure standards for crops, animals, and food safety.',
    theme: 'primary-light',
    icon: 'mdi:shield-check-outline',
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
    title: 'Pest & Disease Surveillance',
    description: 'Monitor and control spread of plant and animal diseases.',
    theme: 'accent',
    icon: 'mdi:virus-outline',
    units: [
      { path: '/dashboard/forms/plant-pest-surveillance', label: 'Plant Pest Surveillance' },
      { path: '/dashboard/forms/cfs-admcc', label: 'CFS / ADMCC' },
      { path: '/dashboard/forms/animal-disease-surveillance', label: 'Animal Disease Surveillance' },
    ],
  },
];

// Theme palette: primary (green), primary-light (muted green), accent (khaki) - from public/theme.css
const getThemeColors = (theme) => {
  switch (theme) {
    case 'primary':
      return 'bg-primary/10 text-primary border-primary/20 group-hover:border-primary/40 group-hover:bg-primary/15';
    case 'primary-light':
      return 'bg-primary-light/15 text-primary border-primary-light/30 group-hover:border-primary-light/50 group-hover:bg-primary-light/20';
    case 'accent':
      return 'bg-accent/15 text-accent border-accent/30 group-hover:border-accent/50 group-hover:bg-accent/20';
    default:
      return 'bg-surface text-primary border-border group-hover:border-primary/30 group-hover:bg-surface';
  }
};

export default function Dashboard() {
  return (
    <div className="min-w-0 w-full max-w-full bg-background p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="w-full max-w-7xl mx-auto mb-8 sm:mb-12 min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight break-words">
              Dashboard Overview
            </h1>
            <p className="text-text-muted mt-1 text-sm sm:text-base break-words">
              Welcome back! Select a module below to manage records and forms.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 min-w-0 shrink-0">
            <Link
              to="/dashboard/analytics"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-primary border border-border rounded-lg shadow-sm hover:bg-surface hover:border-primary/30 transition-all text-sm font-medium"
            >
              <iconify-icon icon="mdi:chart-box-outline" width="20"></iconify-icon>
              Data Analytics
            </Link>
            <Link
              to="/dashboard/records"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg shadow-md hover:bg-primary-dark hover:shadow-lg transition-all text-sm font-medium"
            >
              <iconify-icon icon="mdi:database-search-outline" width="20"></iconify-icon>
              View Masterlist
            </Link>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT SECTIONS --- */}
      <div className="w-full max-w-7xl mx-auto space-y-10 min-w-0">
        {SECTIONS.map((section, idx) => (
          <div key={idx} className="animate-fade-in-up min-w-0" style={{ animationDelay: `${idx * 100}ms` }}>
            
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-border pb-3 min-w-0">
              <div className={`shrink-0 p-2 rounded-lg ${
                  section.theme === 'primary' ? 'bg-primary/15 text-primary' :
                  section.theme === 'primary-light' ? 'bg-primary-light/20 text-primary' :
                  'bg-accent/20 text-accent'
                }`}>
                <iconify-icon icon={section.icon} width="24"></iconify-icon>
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-primary leading-tight break-words">
                  {section.title}
                </h3>
                <p className="text-xs sm:text-sm text-text-muted mt-1 break-words">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Grid of Units */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 min-w-0">
              {section.units.map((unit) => (
                <Link
                  key={unit.path}
                  to={unit.path}
                  className="group relative bg-white p-4 rounded-xl border border-border shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-start gap-4 overflow-hidden min-w-0"
                >
                  {/* Decorative background on hover - theme color */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300 ${
                    section.theme === 'primary' ? 'bg-primary' :
                    section.theme === 'primary-light' ? 'bg-primary-light' : 'bg-accent'
                  }`} />

                  {/* Icon Box */}
                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${getThemeColors(section.theme)}`}>
                    <iconify-icon icon="mdi:file-document-edit-outline" width="20"></iconify-icon>
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0 z-10">
                    <p className="font-semibold text-primary group-hover:text-primary-dark text-sm leading-snug">
                      {unit.label}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-text-muted mt-1.5 group-hover:text-primary transition-colors">
                      <span>Open Form</span>
                      <iconify-icon icon="mdi:arrow-right" width="14"></iconify-icon>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}