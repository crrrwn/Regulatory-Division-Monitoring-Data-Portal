/**
 * Lahat ng PNG na nasa public folder. Gamitin getPublicImageUrl() para sa tamang path sa deploy.
 * Preload sa startup para mag-display agad ang mga larawan.
 */
const BASE = import.meta.env.BASE_URL || '/'

export const PUBLIC_PNG = [
  'DALOGO.png',
  'ABOUTPAGE.png',
  'CERRA.png',
  'NIÑO.png',
  'CCS LOGO.png',
  'MINSU LOGO.png',
  'DA HOMEPAGE.png',
  'FEATURES.png',
  'CONTACTUS.png',
]

/**
 * @param {string} filename - Filename lang (e.g. 'DALOGO.png', 'CCS LOGO.png')
 * @returns {string} Full URL para sa public asset (gumagana sa deploy/subpath)
 */
export function getPublicImageUrl(filename) {
  return BASE + encodeURIComponent(filename)
}

/**
 * Preload lahat ng PNG para mag-display agad sa lahat ng page.
 * Tawagin sa app startup (main.jsx).
 */
export function preloadPublicImages() {
  PUBLIC_PNG.forEach((filename) => {
    const img = new Image()
    img.src = getPublicImageUrl(filename)
  })
}
