import { PROVINCES } from './regions'

/** Get YYYY-MM from doc for month filter (uses createdAt or first date field found) */
export function getMonthFromDoc(doc) {
  const d = doc.createdAt || doc.date || doc.dateApplied || doc.applicationDate || doc.dateOfMonitoring || doc.inspectionDate || doc.dateReceived || doc.dateReported || doc.requestLetterDate || doc.dateOfCommunicationLetter || doc.dateOfSurveillance || doc.dateOfRequest || doc.dateReceivedAndEvaluated || doc.dateOfPreAssessment || doc.dateOfMonitoring
  if (!d) return null
  const date = typeof d === 'string' ? new Date(d) : d
  if (isNaN(date.getTime())) return null
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/** Get province from doc (checks address.province, businessAddress.province, province, municipality for some) */
export function getProvinceFromDoc(doc) {
  const p = doc.address?.province ?? doc.businessAddress?.province ?? doc.province ?? doc.municipality
  if (!p || typeof p !== 'string') return null
  return PROVINCES.includes(p) ? p : p
}

/** Get list of unique months from docs for dropdown (newest first) */
export function getMonthsFromDocs(docs) {
  const set = new Set()
  docs.forEach((d) => {
    const m = getMonthFromDoc(d)
    if (m) set.add(m)
  })
  return Array.from(set).sort().reverse()
}

/** Format month key to display label */
export function formatMonthLabel(ym) {
  if (!ym) return 'All'
  const [y, m] = ym.split('-')
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${monthNames[Number(m) - 1]} ${y}`
}

/** Flatten doc to printable row (object → string for nested) */
export function docToRow(doc) {
  const skip = ['createdBy', 'updatedAt']
  const row = {}
  Object.entries(doc).forEach(([key, value]) => {
    if (key === 'id' || skip.includes(key)) return
    if (key === 'attachmentData') {
      row[key] = value && String(value).length > 0 ? '(file attached)' : ''
      return
    }
    if (value === null || value === undefined) row[key] = ''
    else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      if (typeof value.toDate === 'function') row[key] = value.toDate().toLocaleString()
      else row[key] = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('; ')
    } else if (Array.isArray(value)) row[key] = value.join(', ')
    else row[key] = String(value)
  })
  return row
}

/** Convert camelCase or snake_case to Title Case for labels */
export function toTitleCase(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_](.)/g, (_, c) => ' ' + c.toUpperCase())
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

export { PROVINCES }
