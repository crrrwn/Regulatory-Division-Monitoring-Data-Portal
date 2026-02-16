import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { collection, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
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
import { exportToWord } from '../lib/exportWord'

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

  // --- PRINT LOGIC (column order = same as Edit Record: COLLECTION_FIELD_ORDER then rest) ---
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
    const orderedFromConfig = order.filter((k) => allKeys.has(k) && !skip.includes(k))
    const restKeys = Array.from(allKeys).filter((k) => !order.includes(k) && !skip.includes(k))
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
            @page { size: landscape; margin: 10mm; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              thead { display: table-header-group; }
              table, th, td { border-color: #000 !important; }
              th, td { border: 1px solid #000 !important; }
              th { font-weight: 700 !important; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; color: #1e293b; margin: 0; }
            .print-header { margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .print-title { color: #064e3b; font-size: 19px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .print-unit { color: #059669; font-size: 15px; font-weight: 600; margin: 4px 0; }
            .print-meta { color: #64748b; font-size: 12px; margin: 0; }
            table { width: 100%; border-collapse: collapse; font-size: 11px; table-layout: auto; border: 1px solid #000; }
            th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; vertical-align: top; }
            th { background: #065f46; color: #fff; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
            tr:nth-child(even) td { background: #f0fdf4; }
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
    const inputClass = "w-full px-3 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm transition-shadow text-primary placeholder-text-muted"

    if (RATING_FIELD_KEYS.includes(key)) {
      return (
        <select value={value ?? ''} onChange={(e) => updateEditField(key, e.target.value)} className={inputClass}>
          {RATING_OPTIONS.map((o) => <option key={o.value || 'empty'} value={o.value}>{o.label}</option>)}
        </select>
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
        return <span className="text-sm text-text-muted">No file</span>
      }
      return (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted truncate flex-1 min-w-0">File stored in record</span>
          <button type="button" onClick={download} className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark whitespace-nowrap">Download</button>
          <button type="button" onClick={removeAttachment} className="px-3 py-1.5 border border-red-500 text-red-600 rounded text-sm hover:bg-red-50 whitespace-nowrap">Remove</button>
        </div>
      )
    }

    if (value === null || value === undefined) {
       return <input type="text" value="" onChange={(e) => updateEditField(key, e.target.value)} className={inputClass} />
    }
    
    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      return (
        <div className="space-y-3 pl-3 border-l-2 border-primary/20 bg-primary/5 p-3 rounded-r-lg">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide w-24">{k}</span>
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
    <div className="space-y-6 animate-fade-in-up pb-10">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Master Records</h2>
          <p className="text-sm text-text-muted mt-1">Manage, view, and update regulatory data entries.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary border border-border rounded-lg hover:bg-surface hover:text-primary-dark transition-colors shadow-sm font-medium text-sm"
            >
              <iconify-icon icon="mdi:arrow-left" width="18"></iconify-icon>
              Dashboard
            </Link>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark shadow-md transition-all font-medium text-sm"
            >
              <iconify-icon icon="mdi:printer" width="18"></iconify-icon>
              Print List
            </button>
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary shadow-md transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? <iconify-icon icon="mdi:loading" width="18" class="animate-spin"></iconify-icon> : <iconify-icon icon="mdi:microsoft-excel" width="18"></iconify-icon>}
              {exporting ? 'Exporting...' : 'Export Excel'}
            </button>
            <button
              type="button"
              onClick={() => exportToWord(filtered, selectedCollection, collectionLabel)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 shadow-md transition-all font-medium text-sm"
            >
              <iconify-icon icon="mdi:microsoft-word" width="18"></iconify-icon>
              Export Word
            </button>
        </div>
      </div>

      {/* --- CONTROLS BAR (FILTERS & SEARCH) --- */}
      <div className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-4 lg:space-y-0 lg:flex lg:items-end lg:gap-4">
        
        {/* Collection Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 ml-1">Select Unit</label>
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
               <iconify-icon icon="mdi:folder-table-outline" width="20"></iconify-icon>
             </div>
             <select 
               value={selectedCollection} 
               onChange={(e) => setSelectedCollection(e.target.value)} 
               className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-primary text-sm focus:ring-2 focus:ring-primary focus:border-primary font-medium appearance-none"
             >
               {COLLECTIONS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
             </select>
             <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
               <iconify-icon icon="mdi:chevron-down" width="20"></iconify-icon>
             </div>
          </div>
        </div>

        {/* Filters Group */}
        <div className="flex gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 sm:w-48">
             <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 ml-1">Month</label>
             <select 
               value={filterMonth} 
               onChange={(e) => setFilterMonth(e.target.value)} 
               className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-primary text-sm focus:ring-2 focus:ring-primary focus:border-primary"
             >
               <option value="">All Months</option>
               {months.map((m) => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
             </select>
          </div>
          <div className="flex-1 sm:w-48">
             <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 ml-1">Province</label>
             <select 
               value={filterProvince} 
               onChange={(e) => setFilterProvince(e.target.value)} 
               className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg text-primary text-sm focus:ring-2 focus:ring-primary focus:border-primary"
             >
               <option value="">All Provinces</option>
               {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
             </select>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 min-w-[250px]">
           <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5 ml-1">Search Records</label>
           <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary">
                 <iconify-icon icon="mdi:magnify" width="20"></iconify-icon>
              </div>
              <input 
                 type="text" 
                 value={search} 
                 onChange={(e) => setSearch(e.target.value)} 
                 placeholder="Search by name, ID, or keyword..." 
                 className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-text-muted" 
              />
              {search && (
                 <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-primary">
                    <iconify-icon icon="mdi:close-circle" width="16"></iconify-icon>
                 </button>
              )}
           </div>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-surface border-b border-border sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-bold text-primary uppercase text-xs tracking-wider whitespace-nowrap">Primary Identifier / Name</th>
                {RATING_COLLECTIONS[selectedCollection] && (
                  <th className="px-6 py-4 font-bold text-primary uppercase text-xs tracking-wider whitespace-nowrap">Avg. Rating</th>
                )}
                <th className="px-6 py-4 font-bold text-primary uppercase text-xs tracking-wider whitespace-nowrap">Record Date</th>
                <th className="px-6 py-4 font-bold text-primary uppercase text-xs tracking-wider text-right w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                 <tr>
                    <td colSpan={RATING_COLLECTIONS[selectedCollection] ? 4 : 3} className="px-6 py-12 text-center">
                       <div className="flex flex-col items-center justify-center text-text-muted">
                          <iconify-icon icon="mdi:database-off-outline" width="48"></iconify-icon>
                          <p className="mt-2 font-medium">No records found matching your filters.</p>
                       </div>
                    </td>
                 </tr>
              ) : (
                 filtered.map((docItem) => (
                  <tr key={docItem.id} className="hover:bg-surface/80 transition-colors group">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                             {getDisplayName(docItem, selectedCollection).charAt(0).toUpperCase()}
                          </div>
                          <div className="font-semibold text-primary group-hover:text-primary-dark transition-colors max-w-xs sm:max-w-md truncate" title={getDisplayName(docItem, selectedCollection)}>
                             {getDisplayName(docItem, selectedCollection)}
                          </div>
                       </div>
                    </td>
                    {RATING_COLLECTIONS[selectedCollection] && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          const avg = getAvgRating(docItem, selectedCollection)
                          return avg ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                              <iconify-icon icon="mdi:star" width="14"></iconify-icon>
                              {avg}/5
                            </span>
                          ) : <span className="text-text-muted text-sm">—</span>
                        })()}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-text-muted text-xs font-medium">
                          {docItem.createdAt ? new Date(docItem.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                       </div>
                       <div className="text-text-muted text-[10px]">
                          {docItem.createdAt ? new Date(docItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit(docItem) && (
                          <button 
                             onClick={() => openEdit(docItem)} 
                             className="p-1.5 bg-white border border-border text-primary rounded hover:bg-primary/10 hover:border-primary/40 transition-colors tooltip"
                             title="Edit Record"
                          >
                            <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                          </button>
                        )}
                        {canDelete() && (
                          <button 
                             onClick={() => handleDelete(docItem.id)} 
                             className="p-1.5 bg-white border border-border text-red-600 rounded hover:bg-red-50 hover:border-red-200 transition-colors tooltip"
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
        <div className="bg-surface border-t border-border px-6 py-3 text-xs text-text-muted font-medium flex justify-between items-center">
            <span>Showing {filtered.length} record(s)</span>
            {filtered.length > 20 && <span className="text-text-muted italic">Scroll for more</span>}
        </div>
      </div>

      {/* --- EDIT MODAL --- */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
             className="absolute inset-0 bg-primary-dark/60 backdrop-blur-sm transition-opacity" 
             onClick={() => setEditing(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in-up">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface">
               <div>
                  <h3 className="text-lg font-bold text-primary">Edit Record</h3>
                  <p className="text-xs text-text-muted">ID: <span className="font-mono">{editing}</span></p>
               </div>
               <button onClick={() => setEditing(null)} className="text-text-muted hover:text-primary transition-colors">
                  <iconify-icon icon="mdi:close" width="24"></iconify-icon>
               </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid gap-5">
                {(() => {
                  const skip = ['createdBy', 'updatedAt']
                  const order = COLLECTION_FIELD_ORDER[selectedCollection]
                  const labels = COLLECTION_FIELD_LABELS?.[selectedCollection]
                  // Same fields as form: all keys from order, then any extra on document
                  const entries = order
                    ? [
                        ...order.filter((k) => !skip.includes(k)).map((k) => [k, editForm[k]]),
                        ...Object.entries(editForm).filter(([k]) => !order.includes(k) && !skip.includes(k)),
                      ]
                    : Object.entries(editForm).filter(([k]) => !skip.includes(k))

                  const getLabel = (key) => (labels && labels[key]) ? labels[key] : toTitleCase(key)

                  return entries.map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-xs font-bold text-primary uppercase tracking-wide mb-2 ml-1">
                         {getLabel(key)}
                      </label>
                      {renderEditValue(key, value)}
                    </div>
                  ))
                })()}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-surface flex justify-end gap-3">
              <button 
                 type="button" 
                 onClick={() => setEditing(null)} 
                 className="px-5 py-2.5 rounded-lg border border-border text-primary font-medium hover:bg-surface hover:text-primary-dark transition-colors text-sm"
              >
                 Cancel
              </button>
              <button 
                 type="button" 
                 onClick={saveEdit} 
                 className="px-5 py-2.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark shadow-lg transition-all text-sm flex items-center gap-2"
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