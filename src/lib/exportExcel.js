import ExcelJS from 'exceljs'
import { docToRow, toTitleCase } from './recordFilters'
import { COLLECTION_TITLE_FIELD } from './collections'

function getDisplayName(data, collectionId) {
  const key = COLLECTION_TITLE_FIELD[collectionId]
  if (!key) return '—'
  const val = data[key]
  if (val == null) return '—'
  if (typeof val === 'object') return [val.last, val.first, val.mi].filter(Boolean).join(' ') || ''
  return String(val)
}

/** Export records to Excel with styled header and columns */
export async function exportToExcel(records, collectionId, collectionLabel) {
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Regulatory Division Portal'
  const sheet = workbook.addWorksheet(collectionLabel || collectionId, {
    pageSetup: { paperSize: 9, orientation: 'landscape', fitToPage: true },
  })

  if (records.length === 0) {
    sheet.addRow(['No records to export.'])
    const buf = await workbook.xlsx.writeBuffer()
    downloadBlob(buf, `Records_${collectionId}_${dateFile()}.xlsx`)
    return
  }

  const allKeys = new Set()
  records.forEach((doc) => {
    Object.keys(doc).filter((k) => !['createdBy', 'updatedAt'].includes(k)).forEach((k) => allKeys.add(k))
  })
  const rawHeaders = ['No.', 'Name / Title', ...Array.from(allKeys).filter((k) => k !== 'id')]
  const headers = rawHeaders.map((h) => (h === 'No.' || h === 'Name / Title' ? h : toTitleCase(h)))
  const headerKeys = ['No.', 'Name/Title', ...Array.from(allKeys).filter((k) => k !== 'id')]

  const headerRow = sheet.addRow(headers)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E4D2B' } }
  headerRow.alignment = { vertical: 'middle', wrapText: true }
  headerRow.height = 22
  sheet.getRow(1).eachCell((c) => {
    c.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
  })

  records.forEach((doc, idx) => {
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
    records.forEach((doc, idx) => {
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
  downloadBlob(buf, `Records_${collectionId}_${dateFile()}.xlsx`)
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
