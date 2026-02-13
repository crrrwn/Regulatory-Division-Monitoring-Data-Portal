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

function escapeHtml(s) {
  if (s == null || s === '') return ''
  const t = String(s)
  return t
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function dateFile() {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}_${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}`
}

/**
 * Export records to a Word-compatible document (.doc – HTML that Word can open)
 */
export function exportToWord(records, collectionId, collectionLabel) {
  const allKeys = new Set()
  records.forEach((doc) => {
    Object.keys(doc)
      .filter((k) => !['id', 'createdBy', 'updatedAt'].includes(k))
      .forEach((k) => allKeys.add(k))
  })
  const headers = ['No.', 'Name / Title', ...Array.from(allKeys)]
  const headerLabels = ['No.', 'Name / Title', ...Array.from(allKeys).map(toTitleCase)]

  let tableRows = ''
  records.forEach((doc, idx) => {
    const row = docToRow(doc)
    const name = getDisplayName(doc, collectionId)
    tableRows += '<tr>'
    tableRows += `<td>${escapeHtml(idx + 1)}</td>`
    tableRows += `<td>${escapeHtml(name)}</td>`
    headers.slice(2).forEach((h) => {
      tableRows += `<td>${escapeHtml(row[h] ?? '')}</td>`
    })
    tableRows += '</tr>'
  })

  const thCells = headerLabels.map((l) => `<th>${escapeHtml(l)}</th>`).join('')

  const html = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head>
  <meta charset="utf-8">
  <title>Records - ${escapeHtml(collectionLabel)}</title>
  <style>
    body { font-family: 'Poppins', Arial, sans-serif; padding: 16px; color: #2d2a26; }
    .header { margin-bottom: 12px; }
    .title { color: #1e4d2b; font-size: 16px; font-weight: 700; margin: 0 0 4px 0; }
    .unit { color: #1e4d2b; font-size: 13px; font-weight: 600; margin: 0 0 8px 0; }
    .meta { color: #5c574f; font-size: 11px; margin: 0 0 10px 0; }
    table { width: 100%; border-collapse: collapse; font-size: 10px; table-layout: auto; }
    th, td { border: 1px solid #1e4d2b; padding: 6px 8px; text-align: left; vertical-align: top;
      word-wrap: break-word; word-break: break-word; }
    th { background: #1e4d2b; color: #fff; font-weight: 700; }
    tr:nth-child(even) td { background: #faf8f5; }
  </style>
</head>
<body>
  <div class="header">
    <p class="title">Regulatory Division Monitoring Data Portal</p>
    <p class="unit">${escapeHtml(collectionLabel)}</p>
    <p class="meta">Exported: ${new Date().toLocaleString()} &nbsp;|&nbsp; Total: ${records.length} record(s)</p>
  </div>
  <table>
    <thead><tr>${thCells}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`

  const blob = new Blob(['\ufeff' + html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Records_${collectionId}_${dateFile()}.doc`
  a.click()
  URL.revokeObjectURL(url)
}
