/**
 * COLOR THEME — pagkakasunod-sunod ng kulay (from COLOR THEME.png):
 * darkGreen → mutedGreen → lightKhaki → paleCream
 */
export const colorTheme = {
  darkGreen: '#1a3d24',
  mutedGreen: '#5c7355',
  lightKhaki: '#c4b896',
  paleCream: '#f5f0e6',
}

/** Page background: same format as header — kaliwa → kanan, green sa left. */
export function getLandingGradient() {
  const { darkGreen, mutedGreen, lightKhaki, paleCream } = colorTheme
  return `linear-gradient(90deg, ${darkGreen} 0%, ${mutedGreen} 35%, ${lightKhaki} 65%, ${paleCream} 100%)`
}

/** Header: kaliwa → kanan, green sa left. darkGreen (kaliwa) → mutedGreen → lightKhaki → paleCream (kanan). */
export function getHeaderGradient() {
  const { darkGreen, mutedGreen, lightKhaki, paleCream } = colorTheme
  return `linear-gradient(90deg, ${darkGreen} 0%, ${mutedGreen} 35%, ${lightKhaki} 65%, ${paleCream} 100%)`
}
