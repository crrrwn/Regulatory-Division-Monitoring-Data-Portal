import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { COLLECTIONS, COLLECTION_TITLE_FIELD, COLLECTION_FIELD_ORDER } from '../lib/collections'
import {
  getMonthFromDoc,
  getProvinceFromDoc,
  getMonthsFromDocs,
  formatMonthLabel,
  docToRow,
  toTitleCase,
  PROVINCES,
} from '../lib/recordFilters'
import { exportToExcel } from '../lib/exportExcel'

function getDisplayName(data, collectionId) {
  const key = COLLECTION_TITLE_FIELD[collectionId]
  if (!key) return '—'
  const val = data[key]
  if (val == null) return '—'
  if (typeof val === 'object') return [val.last, val.first, val.mi].filter(Boolean).join(' ') || JSON.stringify(val)
  return String(val)
}

function flattenForSearch(data) {
  if (data == null) return ''
  if (typeof data !== 'object') return String(data)
  return Object.values(data).map(flattenForSearch).join(' ')
}

export default function ViewRecords() {
  const [selectedCollection, setSelectedCollection] = useState(COLLECTIONS[0].id)
  const [docs, setDocs] = useState([])
  const [search, setSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [exporting, setExporting] = useState(false)
  const { user, role } = useAuth()

  useEffect(() => {
    const colRef = collection(db, selectedCollection)
    const unsub = onSnapshot(colRef, (snap) => {
      setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [selectedCollection])

  const months = getMonthsFromDocs(docs)
  const collectionLabel = COLLECTIONS.find((c) => c.id === selectedCollection)?.label || selectedCollection

  let filtered = docs
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter((d) => flattenForSearch(d).toLowerCase().includes(q))
  }
  if (filterMonth) {
    filtered = filtered.filter((d) => getMonthFromDoc(d) === filterMonth)
  }
  if (filterProvince) {
    filtered = filtered.filter((d) => getProvinceFromDoc(d) === filterProvince)
  }

  const canEdit = (docItem) => role === 'admin' || docItem.createdBy === user?.uid
  const canDelete = () => role === 'admin'

  const handleDelete = async (id) => {
    if (!confirm('Delete this record permanently?')) return
    try {
      await deleteDoc(doc(db, selectedCollection, id))
    } catch (err) {
      alert(err.message)
    }
  }

  const openEdit = (docItem) => {
    const { id, createdAt, createdBy, ...rest } = docItem
    setEditForm(rest)
    setEditing(id)
  }

  const saveEdit = async () => {
    if (!editing) return
    try {
      await updateDoc(doc(db, selectedCollection, editing), { ...editForm, updatedAt: new Date().toISOString() })
      setEditing(null)
    } catch (err) {
      alert(err.message)
    }
  }

  const updateEditField = (key, value) => setEditForm((f) => ({ ...f, [key]: value }))

  const handlePrint = () => {
    const esc = (s) => {
      if (s == null || s === '') return ''
      const t = String(s)
      return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    const allKeys = new Set()
    filtered.forEach((doc) => {
      Object.keys(doc).filter((k) => !['id', 'createdBy', 'updatedAt'].includes(k)).forEach((k) => allKeys.add(k))
    })
    const headers = ['No.', 'Name / Title', ...Array.from(allKeys)]
    const headerLabels = ['No.', 'Name / Title', ...Array.from(allKeys).map(toTitleCase)]

    let tableRows = ''
    filtered.forEach((doc, idx) => {
      const row = docToRow(doc)
      const name = getDisplayName(doc, selectedCollection)
      tableRows += '<tr>'
      tableRows += `<td>${esc(idx + 1)}</td>`
      tableRows += `<td>${esc(name)}</td>`
      headers.slice(2).forEach((h) => {
        tableRows += `<td>${esc(row[h] ?? '')}</td>`
      })
      tableRows += '</tr>'
    })

    const thCells = headerLabels.map((l) => `<th>${esc(l)}</th>`).join('')
    const metaParts = []
    if (filterMonth) metaParts.push(`Month: ${formatMonthLabel(filterMonth)}`)
    if (filterProvince) metaParts.push(`Province: ${filterProvince}`)
    metaParts.push(`Printed: ${new Date().toLocaleString()}`)
    metaParts.push(`Total: ${filtered.length} record(s)`)
    const metaLine = metaParts.join(' • ')

    const win = window.open('', '_blank')
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Records - ${esc(collectionLabel)}</title>
          <style>
            @page { size: landscape; margin: 10mm; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              thead { display: table-header-group; }
            }
            body { font-family: 'Poppins', Arial, sans-serif; padding: 12px; color: #2d2a26; margin: 0; }
            .print-header { margin-bottom: 10px; }
            .print-title { color: #1e4d2b; font-size: 16px; font-weight: 700; margin: 0 0 2px 0; }
            .print-unit { color: #1e4d2b; font-size: 13px; font-weight: 600; margin: 0 0 6px 0; }
            .print-meta { color: #5c574f; font-size: 10px; margin: 0 0 8px 0; }
            table { width: 100%; border-collapse: collapse; font-size: 9px; table-layout: auto; }
            th, td { border: 1px solid #1e4d2b; padding: 5px 6px; text-align: left; vertical-align: top;
              word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: normal;
              min-width: 0; }
            th { background: #1e4d2b; color: #fff; font-weight: 600; }
            tr:nth-child(even) td { background: #faf8f5; }
          </style>
        </head>
        <body>
          <div class="print-header">
            <p class="print-title">Regulatory Division Monitoring Data Portal</p>
            <p class="print-unit">${esc(collectionLabel)}</p>
            <p class="print-meta">${esc(metaLine)}</p>
          </div>
          <table>
            <thead><tr>${thCells}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close(); }, 300)
  }

  const handleExportExcel = async () => {
    setExporting(true)
    try {
      await exportToExcel(filtered, selectedCollection, collectionLabel)
    } catch (err) {
      alert(err.message || 'Export failed.')
    }
    setExporting(false)
  }

  const renderEditValue = (key, value) => {
    if (value === null || value === undefined) return <input type="text" value="" onChange={(e) => updateEditField(key, e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return (
        <div className="space-y-1 pl-2 border-l-2 border-surface">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex gap-2 items-center">
              <span className="text-xs text-[#5c574f] w-24">{k}:</span>
              <input type="text" value={typeof v === 'object' ? JSON.stringify(v) : v} onChange={(e) => updateEditField(key, { ...value, [k]: e.target.value })} className="flex-1 px-2 py-1 border rounded text-sm" />
            </div>
          ))}
        </div>
      )
    }
    return <input type="text" value={Array.isArray(value) ? value.join(', ') : value} onChange={(e) => updateEditField(key, e.target.value)} className="w-full px-2 py-1 border rounded text-sm" />
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-primary">View Records</h2>
        <Link to="/dashboard" className="text-primary hover:underline font-medium flex items-center gap-1 w-fit">
          <iconify-icon icon="mdi:arrow-left" width="20"></iconify-icon>
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
        <div className="w-full min-w-0">
          <label className="block text-sm font-medium text-primary mb-1">Unit / Collection</label>
          <select value={selectedCollection} onChange={(e) => setSelectedCollection(e.target.value)} className="w-full sm:min-w-[200px] px-3 sm:px-4 py-2 border border-border rounded-lg bg-white">
            {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </div>
        <div className="w-full min-w-0">
          <label className="block text-sm font-medium text-primary mb-1">Filter by Month</label>
          <select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-full sm:min-w-[160px] px-3 sm:px-4 py-2 border border-border rounded-lg bg-white">
            <option value="">All months</option>
            {months.map((m) => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
          </select>
        </div>
        <div className="w-full min-w-0">
          <label className="block text-sm font-medium text-primary mb-1">Filter by Province</label>
          <select value={filterProvince} onChange={(e) => setFilterProvince(e.target.value)} className="w-full sm:min-w-[160px] px-3 sm:px-4 py-2 border border-border rounded-lg bg-white">
            <option value="">All provinces</option>
            {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="w-full md:flex-1 min-w-0">
          <label className="block text-sm font-medium text-primary mb-1">Search (Name or any field)</label>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Type to filter..." className="w-full px-3 sm:px-4 py-2 border border-border rounded-lg" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          <iconify-icon icon="mdi:printer" width="20"></iconify-icon>
          Print (by Month/Province)
        </button>
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50"
        >
          <iconify-icon icon="mdi:file-excel" width="20"></iconify-icon>
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden min-w-0">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <table className="w-full text-sm min-w-[320px]">
            <thead className="bg-surface">
              <tr>
                <th className="text-left p-2 sm:p-3 font-semibold text-primary">Name / Title</th>
                <th className="text-left p-2 sm:p-3 font-semibold text-primary whitespace-nowrap">Created</th>
                <th className="text-left p-2 sm:p-3 font-semibold text-primary w-24 sm:w-28">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((docItem) => (
                <tr key={docItem.id} className="border-t border-border hover:bg-background/50">
                  <td className="p-2 sm:p-3 max-w-[180px] sm:max-w-none truncate" title={getDisplayName(docItem, selectedCollection)}>{getDisplayName(docItem, selectedCollection)}</td>
                  <td className="p-2 sm:p-3 text-[#5c574f] whitespace-nowrap text-xs sm:text-sm">{docItem.createdAt ? new Date(docItem.createdAt).toLocaleString() : '—'}</td>
                  <td className="p-2 sm:p-3">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {canEdit(docItem) && (
                        <button type="button" onClick={() => openEdit(docItem)} className="px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 text-xs font-medium">
                          Edit
                        </button>
                      )}
                      {canDelete() && (
                        <button type="button" onClick={() => handleDelete(docItem.id)} className="px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 text-xs font-medium">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="p-8 text-center text-[#5c574f]">No records found.</div>}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-t-xl sm:rounded-xl shadow-xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border font-semibold text-primary text-sm sm:text-base">Edit Record</div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-3">
              {(() => {
              const skip = ['createdBy', 'updatedAt']
              const order = COLLECTION_FIELD_ORDER[selectedCollection]
              const entries = order
                ? [
                    ...order.filter((k) => editForm[k] !== undefined && !skip.includes(k)).map((k) => [k, editForm[k]]),
                    ...Object.entries(editForm).filter(([k]) => !order.includes(k) && !skip.includes(k)),
                  ]
                : Object.entries(editForm).filter(([k]) => !skip.includes(k))
              return entries.map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-primary mb-1">{toTitleCase(key)}</label>
                  {renderEditValue(key, value)}
                </div>
              ))
            })()}
            </div>
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-border flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 sm:px-4 py-2 border border-border rounded-lg hover:bg-surface text-sm sm:text-base">Cancel</button>
              <button type="button" onClick={saveEdit} className="px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark text-sm sm:text-base">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
