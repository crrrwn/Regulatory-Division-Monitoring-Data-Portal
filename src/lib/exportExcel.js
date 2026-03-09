import ExcelJS from 'exceljs'
import { docToRow, toTitleCase } from './recordFilters'
import { COLLECTION_TITLE_FIELD, COLLECTION_FIELD_ORDER, COLLECTION_FIELD_LABELS, RATING_FIELD_KEYS } from './collections'

function getDisplayName(data, collectionId) {
  const key = COLLECTION_TITLE_FIELD[collectionId]
  if (!key) return '—'
  const val = data[key]
  if (val == null) return '—'
  if (typeof val === 'object') return [val.last, val.first, val.mi].filter(Boolean).join(' ') || ''
  return String(val)
}

// Excel worksheet names cannot contain: * ? : \ / [ ] and max 31 chars
function safeSheetName(name) {
  if (!name || typeof name !== 'string') return 'Sheet'
  const sanitized = name.replace(/[*?:\\\/[\]]/g, ' ').replace(/\s+/g, ' ').trim()
  return (sanitized || 'Sheet').slice(0, 31)
}

const EXPORT_MAX_RECORDS = 15000

/**
 * @param {object} [options] - Optional filters applied to this export
 * @param {string} [options.filterYear] - Year filter (e.g. '2024')
 * @param {string} [options.filterSemester] - Semester filter (e.g. '1st Semester')
 * @param {string} [options.filterProvince] - Province filter
 * @param {function} [options.formatYearLabel] - (year) => string for year display
 */
/** Export records to Excel with styled header and columns. Optionally show By Year, By Semester, By Province. */
export async function exportToExcel(records, collectionId, collectionLabel, options = {}) {
  if (!Array.isArray(records)) throw new Error('Invalid records')
  const toExport = records.length > EXPORT_MAX_RECORDS ? records.slice(0, EXPORT_MAX_RECORDS) : records
  if (records.length > EXPORT_MAX_RECORDS) {
    console.warn(`[exportExcel] Capped at ${EXPORT_MAX_RECORDS} records (had ${records.length})`)
  }

  const { filterYear, filterSemester, filterProvince, formatYearLabel } = options
  const yearLabel = filterYear && typeof formatYearLabel === 'function' ? formatYearLabel(filterYear) : (filterYear || '')
  const byYear = yearLabel ? `Year: ${yearLabel}` : 'Year: All Years'
  const bySemester = filterSemester ? `Semester: ${filterSemester}` : 'Semester: All Semesters'
  const byProvince = filterProvince ? `Province: ${filterProvince}` : 'Province: All Provinces'

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Regulatory Division Portal'
  const sheetName = safeSheetName(collectionLabel || collectionId)
  const sheet = workbook.addWorksheet(sheetName, {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  })

  if (toExport.length === 0) {
    sheet.addRow(['No records to export.'])
    if (byYear || bySemester || byProvince) {
      sheet.insertRow(1, [`Exported by: ${byYear} | ${bySemester} | ${byProvince}`])
      sheet.getRow(1).font = { italic: true }
      sheet.getRow(1).alignment = { wrapText: true }
    }
    const buf = await workbook.xlsx.writeBuffer()
    downloadBlob(buf, buildExportFilename(collectionId, options))
    return
  }

  const excludeMeta = ['id', 'createdAt', 'createdBy', 'updatedAt']
  const excludeFromExport = [...RATING_FIELD_KEYS, 'recommendation', 'source', 'sourceBulkImport', 'source_bulk_import']
  const allKeys = new Set()
  toExport.forEach((doc) => {
    Object.keys(doc).filter((k) => !excludeMeta.includes(k)).forEach((k) => allKeys.add(k))
  })
  // Same column order as Edit modal; exclude ratings and recommendation
  const order = COLLECTION_FIELD_ORDER[collectionId] || []
  const orderedFromConfig = order.filter((k) => allKeys.has(k) && !excludeFromExport.includes(k))
  const restKeys = Array.from(allKeys).filter((k) => !order.includes(k) && !excludeFromExport.includes(k))
  const columnKeys = [...orderedFromConfig, ...restKeys]
  const labels = COLLECTION_FIELD_LABELS?.[collectionId]
  const getHeaderLabel = (key) => (labels && labels[key] ? labels[key] : toTitleCase(key))
  const headers = ['No.', 'Name / Title', ...columnKeys.map(getHeaderLabel)]
  const headerKeys = ['No.', 'Name/Title', ...columnKeys]

  let dataStartRow = 1
  if (byYear || bySemester || byProvince) {
    const filterRow = sheet.addRow([`Exported by: ${byYear} | ${bySemester} | ${byProvince}`])
    filterRow.font = { italic: true }
    filterRow.alignment = { wrapText: true }
    sheet.getRow(1).eachCell((c) => { c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } } })
    dataStartRow = 2
  }

  const headerRow = sheet.addRow(headers)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E4D2B' } }
  headerRow.alignment = { vertical: 'middle', wrapText: true }
  headerRow.height = 22
  sheet.getRow(dataStartRow).eachCell((c) => {
    c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })

  toExport.forEach((doc, idx) => {
    const row = docToRow(doc)
    const name = getDisplayName(doc, collectionId)
    const cellValues = [idx + 1, name, ...headerKeys.slice(2).map((k) => row[k] ?? '')]
    const dataRow = sheet.addRow(cellValues)
    dataRow.eachCell((c) => {
      c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
      c.alignment = { vertical: 'top', wrapText: true }
    })
    dataRow.height = 30
  })

  const numCols = headers.length
  const colWidths = []
  for (let c = 0; c < numCols; c++) {
    let maxLen = 12
    toExport.forEach((doc, idx) => {
      const row = docToRow(doc)
      const name = getDisplayName(doc, collectionId)
      const val = c === 0 ? String(idx + 1) : c === 1 ? name : (row[headerKeys[c]] ?? '')
      const str = String(val)
      const lines = str.split(/\r?\n/)
      const lineLen = lines.reduce((m, l) => Math.max(m, l.length), 0)
      maxLen = Math.max(maxLen, Math.min(lineLen, 80))
    })
    const headerLen = (headers[c] || '').length
    maxLen = Math.max(maxLen, headerLen + 2)
    colWidths[c] = Math.min(50, Math.max(14, maxLen + 1))
  }
  sheet.columns = colWidths.map((w, i) => ({ width: w }))

  const buf = await workbook.xlsx.writeBuffer()
  downloadBlob(buf, buildExportFilename(collectionId, options))
}

function buildExportFilename(collectionId, options = {}) {
  const { filterYear, filterSemester, filterProvince, formatYearLabel } = options
  const parts = [collectionId]
  if (filterYear) parts.push(typeof formatYearLabel === 'function' ? formatYearLabel(filterYear).replace(/\s+/g, '') : filterYear)
  if (filterSemester) parts.push(filterSemester.replace(/\s+/g, ''))
  if (filterProvince) parts.push(filterProvince.replace(/\s+/g, ''))
  return `Records_${parts.join('_')}_${dateFile()}.xlsx`
}

function dateFile() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
}

function downloadBlob(buffer, filename) {
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
