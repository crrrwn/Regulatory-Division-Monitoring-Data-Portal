// Section IDs and mapping for staff access control
// Staff users must select ONE section during registration and can only access that section.

export const SECTION_IDS = {
  REGISTRATION_LICENSING: 'registration-licensing',
  QUALITY_CONTROL_INSPECTION: 'quality-control-inspection',
  PEST_DISEASE_SURVEILLANCE: 'pest-disease-surveillance',
}

/** Options for the registration section dropdown */
export const SECTION_OPTIONS = [
  { value: SECTION_IDS.REGISTRATION_LICENSING, label: 'Registration and Licensing' },
  { value: SECTION_IDS.QUALITY_CONTROL_INSPECTION, label: 'Quality Control and Inspection' },
  { value: SECTION_IDS.PEST_DISEASE_SURVEILLANCE, label: 'Pest & Disease Surveillance' },
]

/** Collection IDs per section (for restricting access) */
export const SECTION_UNIT_IDS = {
  [SECTION_IDS.REGISTRATION_LICENSING]: [
    'animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial', 'organicAgri',
  ],
  [SECTION_IDS.QUALITY_CONTROL_INSPECTION]: [
    'goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 'landUseMatter', 'foodSafety', 'safdzValidation',
  ],
  [SECTION_IDS.PEST_DISEASE_SURVEILLANCE]: [
    'plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance',
  ],
}

/** Form path to section id */
export const PATH_TO_SECTION = {
  '/dashboard/forms/animal-feed': SECTION_IDS.REGISTRATION_LICENSING,
  '/dashboard/forms/animal-welfare': SECTION_IDS.REGISTRATION_LICENSING,
  '/dashboard/forms/livestock-handlers': SECTION_IDS.REGISTRATION_LICENSING,
  '/dashboard/forms/transport-carrier': SECTION_IDS.REGISTRATION_LICENSING,
  '/dashboard/forms/plant-material': SECTION_IDS.REGISTRATION_LICENSING,
  '/dashboard/forms/organic-agri': SECTION_IDS.REGISTRATION_LICENSING,
  '/dashboard/forms/good-agri-practices': SECTION_IDS.QUALITY_CONTROL_INSPECTION,
  '/dashboard/forms/good-animal-husbandry': SECTION_IDS.QUALITY_CONTROL_INSPECTION,
  '/dashboard/forms/organic-post-market': SECTION_IDS.QUALITY_CONTROL_INSPECTION,
  '/dashboard/forms/land-use-matter': SECTION_IDS.QUALITY_CONTROL_INSPECTION,
  '/dashboard/forms/food-safety': SECTION_IDS.QUALITY_CONTROL_INSPECTION,
  '/dashboard/forms/safdz-validation': SECTION_IDS.QUALITY_CONTROL_INSPECTION,
  '/dashboard/forms/plant-pest-surveillance': SECTION_IDS.PEST_DISEASE_SURVEILLANCE,
  '/dashboard/forms/cfs-admcc': SECTION_IDS.PEST_DISEASE_SURVEILLANCE,
  '/dashboard/forms/animal-disease-surveillance': SECTION_IDS.PEST_DISEASE_SURVEILLANCE,
}

export function getUnitIdsForSection(sectionId) {
  return SECTION_UNIT_IDS[sectionId] || []
}

/** Get all unit IDs for multiple sections */
export function getUnitIdsForSections(sectionIds) {
  if (!Array.isArray(sectionIds) || sectionIds.length === 0) return []
  return [...new Set(sectionIds.flatMap((s) => getUnitIdsForSection(s)))]
}

export function isPathAllowedForSection(path, sectionId) {
  if (!sectionId) return true
  const pathSection = PATH_TO_SECTION[path]
  return pathSection === sectionId
}

/** Check if path is allowed for staff with allowedSections array */
export function isPathAllowedForSections(path, allowedSections) {
  if (!allowedSections || allowedSections.length === 0) return true
  const pathSection = PATH_TO_SECTION[path]
  return pathSection && allowedSections.includes(pathSection)
}

/** Get human-readable label for section id (for User Management display) */
export function getSectionLabel(sectionId) {
  const opt = SECTION_OPTIONS.find((o) => o.value === sectionId)
  return opt ? opt.label : sectionId || '—'
}
