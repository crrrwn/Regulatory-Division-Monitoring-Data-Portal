import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { addSystemLog } from '../lib/systemLogs'
import { COLLECTIONS, COLLECTION_TITLE_FIELD, COLLECTION_FIELD_ORDER, COLLECTION_FIELD_LABELS, RATING_FIELD_KEYS, RATING_LABELS } from '../lib/collections'
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
import AppSelect from '../components/AppSelect'

// --- HELPER FUNCTIONS ---
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

const RATING_COLLECTIONS = {
  animalFeed: RATING_FIELD_KEYS,
  animalWelfare: RATING_FIELD_KEYS,
  livestockHandlers: RATING_FIELD_KEYS,
  transportCarrier: RATING_FIELD_KEYS,
  plantMaterial: RATING_FIELD_KEYS,
  organicAgri: RATING_FIELD_KEYS,
  goodAgriPractices: RATING_FIELD_KEYS,
  goodAnimalHusbandry: RATING_FIELD_KEYS,
  organicPostMarket: RATING_FIELD_KEYS,
  landUseMatter: RATING_FIELD_KEYS,
  foodSafety: RATING_FIELD_KEYS,
  plantPestSurveillance: RATING_FIELD_KEYS,
  cfsAdmcc: RATING_FIELD_KEYS,
  animalDiseaseSurveillance: RATING_FIELD_KEYS,
  safdzValidation: RATING_FIELD_KEYS,
}

function getAvgRating(docItem, collectionId) {
  const keys = RATING_COLLECTIONS[collectionId] || []
  if (keys.length === 0) return null
  const nums = keys.map((k) => {
    const v = docItem[k]
    if (v === '' || v == null) return null
    const n = parseInt(v, 10)
    return isNaN(n) ? null : n
  }).filter((n) => n != null)
  if (nums.length === 0) return null
  return (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
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
  const { showNotification } = useNotification()

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
    if (!confirm('Are you sure you want to permanently delete this record?')) return
    try {
      await deleteDoc(doc(db, selectedCollection, id))
      addSystemLog({ action: 'record_deleted', userId: user?.uid, userEmail: user?.email, role: role || 'staff', details: `${selectedCollection} record deleted.` }).catch(() => {})
    } catch (err) {
      showNotification({ type: 'error', title: 'Delete failed', message: err.message || 'Failed to delete.' })
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
      showNotification({ type: 'success', title: 'Changes saved', message: 'Record updated successfully.' })
      addSystemLog({ action: 'record_updated', userId: user?.uid, userEmail: user?.email, role: role || 'staff', details: `${selectedCollection} record updated.` }).catch(() => {})
    } catch (err) {
      showNotification({ type: 'error', title: 'Save failed', message: err.message || 'Failed to save changes.' })
    }
  }

  const updateEditField = (key, value) => setEditForm((f) => ({ ...f, [key]: value }))

  // --- PRINT LOGIC: exclude ratings and recommendation from print ---
  const printExcludeKeys = [...RATING_FIELD_KEYS, 'recommendation']
  const handlePrint = () => {
    const esc = (s) => {
      if (s == null || s === '') return ''
      const t = String(s)
      return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    }
    const skip = ['createdBy', 'updatedAt']
    const excludeKeys = ['id', 'createdAt', 'createdBy', 'updatedAt']
    const allKeys = new Set()
    filtered.forEach((doc) => {
      Object.keys(doc).filter((k) => !excludeKeys.includes(k)).forEach((k) => allKeys.add(k))
    })
    const order = COLLECTION_FIELD_ORDER[selectedCollection] || []
    const orderedFromConfig = order.filter((k) => allKeys.has(k) && !skip.includes(k) && !printExcludeKeys.includes(k))
    const restKeys = Array.from(allKeys).filter((k) => !order.includes(k) && !skip.includes(k) && !printExcludeKeys.includes(k))
    const columnKeys = [...orderedFromConfig, ...restKeys]
    const headers = ['No.', 'Name / Title', ...columnKeys]
    const headerLabels = ['No.', 'Name / Title', ...columnKeys.map(toTitleCase)]

    let tableRows = ''
    filtered.forEach((doc, idx) => {
      const row = docToRow(doc)
      const name = getDisplayName(doc, selectedCollection)
      tableRows += '<tr>'
      tableRows += `<td>${esc(idx + 1)}</td>`
      tableRows += `<td>${esc(name)}</td>`
      columnKeys.forEach((key) => {
        tableRows += `<td>${esc(row[key] ?? '')}</td>`
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
            /* 1. Set specific size to LONG Paper in Landscape, Pinaliit ang Margin */
            @page { 
              size: 13in 8.5in; 
              margin: 5mm; 
            }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              thead { display: table-header-group; }
              /* Prevent rows from being cut in half across pages */
              tr { page-break-inside: avoid; }
              table, th, td { border-color: #000 !important; }
              th, td { border: 1px solid #000 !important; }
              th { font-weight: 700 !important; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 10px; }
            .print-header { margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 8px; }
            .print-title { color: #064e3b; font-size: 16px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .print-unit { color: #059669; font-size: 13px; font-weight: 600; margin: 4px 0; }
            .print-meta { color: #64748b; font-size: 10px; margin: 0; }
            
            /* 2. AUTO Layout at mas maliit na font para magkasya lahat ng columns */
            table { 
              width: 100%; 
              border-collapse: collapse; 
              font-size: 9px; /* Binabaan yung font para magkasya ang madaming columns */
              table-layout: auto; /* Hahayaan yung browser mag-adjust ng saktong lapad */
            }
            th, td { 
              border: 1px solid #000; 
              padding: 4px 4px; /* Binawasan ang padding */
              text-align: left; 
              vertical-align: top; 
              word-wrap: break-word; 
            }
            th { 
              background: #065f46; 
              color: #fff; 
              font-weight: 700; 
              text-transform: uppercase; 
              font-size: 8px; /* Mas maliit ng konti ang header para hindi maputol */
              letter-spacing: 0.2px; 
            }
            tr:nth-child(even) td { background: #f0fdf4; }

            /* 3. I-lock lang yung No. column na maliit, the rest is auto */
            th:nth-child(1) { width: 2%; white-space: nowrap; } 
          </style>
        </head>
        <body>
          <div class="print-header">
            <p class="print-title">Regulatory Division Data Report</p>
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

  // --- FORM RENDERER ---
  const RATING_OPTIONS = [
    { value: '', label: 'Select rating...' },
    { value: '1', label: 'Poor (1)' },
    { value: '2', label: 'Fair (2)' },
    { value: '3', label: 'Satisfied (3)' },
    { value: '4', label: 'Very Satisfied (4)' },
    { value: '5', label: 'Excellent (5)' },
  ]

  const renderEditValue = (key, value) => {
    const inputClass = "w-full px-3 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] text-sm font-medium text-[#1e4d2b] placeholder:text-[#8a857c] transition-all"

    if (RATING_FIELD_KEYS.includes(key)) {
      return (
        <AppSelect
          options={RATING_OPTIONS}
          value={value ?? ''}
          onChange={(v) => updateEditField(key, v)}
          placeholder="Select rating..."
          aria-label={key}
        />
      )
    }

    if (key === 'attachmentData') {
      const base64 = value && String(value)
      const fileName = editForm.attachmentFileName || 'attachment'
      const download = () => {
        try {
          const bin = atob(base64)
          const arr = new Uint8Array(bin.length)
          for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
          const blob = new Blob([arr])
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName
          a.click()
          URL.revokeObjectURL(url)
        } catch (_) { /* ignore */ }
      }
      const removeAttachment = () => {
        updateEditField('attachmentData', '')
        updateEditField('attachmentFileName', '')
      }
      if (!base64 || base64.length === 0) {
        return <span className="text-sm text-[#5c7355]">No file</span>
      }
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-[#5c7355] truncate flex-1 min-w-0">File stored in record</span>
          <button type="button" onClick={download} className="px-3 py-1.5 bg-[#1e4d2b] text-white rounded-xl text-sm font-bold hover:bg-[#153019] whitespace-nowrap">Download</button>
          <button type="button" onClick={removeAttachment} className="px-3 py-1.5 border-2 border-red-400 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 whitespace-nowrap">Remove</button>
        </div>
      )
    }

    if (value === null || value === undefined) {
       return <input type="text" value="" onChange={(e) => updateEditField(key, e.target.value)} className={inputClass} />
    }
    
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return (
        <div className="space-y-3 pl-3 border-l-2 border-[#1e4d2b]/30 bg-[#1e4d2b]/5 p-3 rounded-r-xl">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <span className="text-xs font-bold text-[#5c7355] uppercase tracking-wider w-24">{k}</span>
              <input 
                 type="text" 
                 value={typeof v === 'object' ? JSON.stringify(v) : v} 
                 onChange={(e) => updateEditField(key, { ...value, [k]: e.target.value })} 
                 className={inputClass} 
              />
            </div>
          ))}
        </div>
      )
    }
    return <input type="text" value={Array.isArray(value) ? value.join(', ') : value} onChange={(e) => updateEditField(key, e.target.value)} className={inputClass} />
  }

  return (
    <div className="space-y-6 pb-10 min-w-0 w-full max-w-full overflow-x-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="view-records-anim-1 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)] transition-opacity duration-500 group-hover:opacity-80" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Master Records</h2>
              <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1">Manage, view, and update regulatory data entries</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#1e4d2b] rounded-xl hover:bg-[#faf8f5] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-sm border border-white/30"
              >
                <iconify-icon icon="mdi:printer" width="18"></iconify-icon>
                Print List
              </button>
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b8a066] text-[#153019] rounded-xl hover:bg-[#d4c4a0] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-[#b8a066]/50"
              >
                {exporting ? <iconify-icon icon="mdi:loading" width="18" class="animate-spin"></iconify-icon> : <iconify-icon icon="mdi:microsoft-excel" width="18"></iconify-icon>}
                {exporting ? 'Exporting...' : 'Export Excel'}
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-sm"
              >
                <iconify-icon icon="mdi:arrow-left" width="18"></iconify-icon>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTROLS BAR (FILTERS & SEARCH) — khaki/gold accent (Quality Control style) --- */}
      <div className="view-records-anim-2 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#b8a066]/10 overflow-visible hover:shadow-xl hover:shadow-[#b8a066]/15 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="px-4 py-3 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] relative border-b-2 border-[#b8a066]/25 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
          <span className="relative z-10 text-[10px] font-black text-white uppercase tracking-widest">Filters & Search</span>
        </div>
        <div className="p-4 sm:p-5 space-y-4 lg:space-y-0 lg:flex lg:items-end lg:gap-4 lg:flex-wrap border-l-4 border-[#b8a066]/25">
          <div className="flex-1 min-w-[240px] sm:min-w-[280px]">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5 transition-colors duration-300">Select Unit</label>
            <AppSelect
              value={selectedCollection}
              onChange={(v) => setSelectedCollection(v)}
              options={COLLECTIONS.map((c) => ({ value: c.id, label: c.label }))}
              leftIcon={<iconify-icon icon="mdi:folder-table-outline" width="20"></iconify-icon>}
              aria-label="Select Unit"
            />
          </div>
          <div className="flex gap-3 flex-wrap sm:flex-nowrap flex-1 min-w-0">
            <div className="flex-1 min-w-[140px] sm:min-w-[180px]">
              <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Month</label>
              <AppSelect
                value={filterMonth}
                onChange={setFilterMonth}
                placeholder="All Months"
                options={[
                  { value: '', label: 'All Months' },
                  { value: 'test_value', label: 'Test Month' },
                  ...months.map((m) => ({ value: m, label: formatMonthLabel(m) })),
                ]}
                leftIcon={<iconify-icon icon="mdi:calendar-month-outline" width="18"></iconify-icon>}
                aria-label="Month"
                className="min-w-0"
              />
            </div>
            <div className="flex-1 min-w-[140px] sm:min-w-[180px]">
              <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Province</label>
              <AppSelect
                value={filterProvince}
                onChange={setFilterProvince}
                placeholder="All Provinces"
                options={[
                  { value: '', label: 'All Provinces' },
                  { value: 'Bulacan', label: 'Bulacan' },
                  ...PROVINCES.map((p) => ({ value: p, label: p })),
                ]}
                leftIcon={<iconify-icon icon="mdi:map-marker-outline" width="18"></iconify-icon>}
                aria-label="Province"
                className="min-w-0"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[200px] lg:min-w-[260px]">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Search Records</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5c7355] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                <iconify-icon icon="mdi:magnify" width="20"></iconify-icon>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, ID, or keyword..."
                className="w-full pl-10 pr-10 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-[#1e4d2b] text-sm font-medium focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5c7355] hover:text-[#1e4d2b] hover:scale-110 transition-all duration-200">
                  <iconify-icon icon="mdi:close-circle" width="18"></iconify-icon>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- DATA TABLE — green --- */}
      <div className="view-records-anim-3 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden flex flex-col min-h-[400px] hover:shadow-xl hover:shadow-[#1e4d2b]/10 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-3 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-sm font-black text-white uppercase tracking-tight">Records</span>
            <span className="text-[11px] font-semibold text-white/85">{collectionLabel}</span>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-280px)] min-h-0 custom-scrollbar view-records-scroll flex-1 border-l-4 border-[#1e4d2b]/25">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-b-2 border-[#e8e0d4]">
              <tr>
                <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Name / Identifier</th>
                {RATING_COLLECTIONS[selectedCollection] && (
                  <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Avg. Rating</th>
                )}
                <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Date</th>
                <th className="px-5 py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider text-right w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={RATING_COLLECTIONS[selectedCollection] ? 4 : 3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-[#5c7355] rounded-xl border-2 border-dashed border-[#1e4d2b]/25 bg-[#f0f5ee]/80 py-12 mx-4">
                      <iconify-icon icon="mdi:database-off-outline" width="56" class="opacity-60 animate-pulse"></iconify-icon>
                      <p className="mt-3 font-semibold text-[#1e4d2b]">No records found</p>
                      <p className="text-xs text-[#5c7355] mt-1">Try adjusting filters or search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((docItem) => (
                  <tr key={docItem.id} className="hover:bg-[#faf8f5]/90 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e4d2b]/15 to-[#5c7355]/10 text-[#1e4d2b] flex items-center justify-center font-black text-sm shrink-0 border border-[#e8e0d4]/50 group-hover:scale-105 group-hover:from-[#1e4d2b]/20 group-hover:to-[#5c7355]/15 transition-all duration-300">
                          {getDisplayName(docItem, selectedCollection).charAt(0).toUpperCase()}
                        </div>
                        <div className="font-bold text-[#1e4d2b] group-hover:text-[#153019] transition-colors duration-300 max-w-xs sm:max-w-md truncate" title={getDisplayName(docItem, selectedCollection)}>
                          {getDisplayName(docItem, selectedCollection)}
                        </div>
                      </div>
                    </td>
                    {RATING_COLLECTIONS[selectedCollection] && (
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {(() => {
                          const avg = getAvgRating(docItem, selectedCollection)
                          return avg ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#b8a066]/15 text-[#1e4d2b] font-bold text-xs border border-[#b8a066]/30 group-hover:bg-[#b8a066]/25 group-hover:border-[#b8a066]/50 transition-all duration-300">
                              <iconify-icon icon="mdi:star" width="14" class="text-[#b8a066]"></iconify-icon>
                              {avg}/5
                            </span>
                          ) : <span className="text-[#8a857c] text-sm">—</span>
                        })()}
                      </td>
                    )}
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <div className="text-[#1e4d2b] text-xs font-semibold">
                        {docItem.createdAt ? new Date(docItem.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </div>
                      <div className="text-[#5c7355] text-[10px] font-medium">
                        {docItem.createdAt ? new Date(docItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {canEdit(docItem) && (
                          <button
                            onClick={() => openEdit(docItem)}
                            className="p-2 bg-white border-2 border-[#e8e0d4] text-[#1e4d2b] rounded-xl hover:bg-[#1e4d2b]/10 hover:border-[#1e4d2b]/50 hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
                            title="Edit Record"
                          >
                            <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                          </button>
                        )}
                        {canDelete() && (
                          <button
                            onClick={() => handleDelete(docItem.id)}
                            className="p-2 bg-white border-2 border-[#e8e0d4] text-red-600 rounded-xl hover:bg-red-50 hover:border-red-300 hover:scale-110 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]"
                            title="Delete Record"
                          >
                            <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="shrink-0 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-t-2 border-[#1e4d2b]/15 px-5 py-2.5 flex justify-between items-center text-[11px] font-bold text-[#5c7355] transition-colors duration-300">
          <span>Showing {filtered.length} record(s)</span>
          {filtered.length > 20 && <span className="italic">Scroll for more</span>}
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-[#153019]/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setEditing(null)}
          />
          <div className="relative bg-white rounded-2xl border-2 border-[#e8e0d4] shadow-2xl shadow-[#1e4d2b]/20 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out" style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-6 py-4 flex justify-between items-center relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">Edit Record</h3>
                <p className="text-[11px] font-semibold text-white/80 mt-0.5">ID: <span className="font-mono">{editing}</span></p>
              </div>
              <button onClick={() => setEditing(null)} className="relative z-10 p-2 rounded-xl bg-white/15 hover:bg-white/25 hover:scale-110 active:scale-95 text-white transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]">
                <iconify-icon icon="mdi:close" width="24"></iconify-icon>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar view-records-scroll bg-gradient-to-b from-[#faf8f5] to-[#f2ede6] border-l-4 border-[#1e4d2b]/25">
              <div className="grid gap-5">
                {(() => {
                  const skip = ['createdBy', 'updatedAt']
                  const order = COLLECTION_FIELD_ORDER[selectedCollection]
                  const labels = COLLECTION_FIELD_LABELS?.[selectedCollection]
                  // Same fields as forms only: form field order, no extra doc keys
                  const entries = order
                    ? order.filter((k) => !skip.includes(k)).map((k) => [k, editForm[k]])
                    : Object.entries(editForm).filter(([k]) => !skip.includes(k))

                  const getLabel = (key) => (labels && labels[key]) ? labels[key] : toTitleCase(key)

                  return entries.map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-[10px] font-black text-[#1e4d2b] uppercase tracking-wider mb-1.5">
                        {getLabel(key)}
                      </label>
                      {renderEditValue(key, value)}
                    </div>
                  ))
                })()}
              </div>
            </div>

            <div className="shrink-0 px-6 py-4 border-t border-[#e8e0d4] bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border-2 border-[#e8e0d4] text-[#1e4d2b] font-bold hover:bg-white hover:border-[#1e4d2b]/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="px-5 py-2.5 rounded-xl bg-[#1e4d2b] text-white font-bold hover:bg-[#153019] hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] text-sm flex items-center gap-2"
              >
                <iconify-icon icon="mdi:content-save-check" width="18"></iconify-icon>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}