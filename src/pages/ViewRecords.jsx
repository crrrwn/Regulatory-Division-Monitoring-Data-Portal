import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { collection, query, limit, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { addSystemLog } from '../lib/systemLogs'
import { COLLECTIONS, COLLECTION_TITLE_FIELD, COLLECTION_FIELD_ORDER, COLLECTION_FIELD_LABELS, GOOD_AGRI_PRACTICES_FORM_FIELDS, RATING_FIELD_KEYS, RATING_LABELS } from '../lib/collections'
import { useDisabledUnits } from '../context/DisabledUnitsContext'
import { getUnitIdsForSections } from '../lib/sections'
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
  // GoodAgriPractices: show nameOfFarmer (Monitoring) or nameOfApplicant (GAP Certification)
  if (collectionId === 'goodAgriPractices') {
    const name = data?.nameOfFarmer ?? data?.nameOfApplicant
    if (name != null && name !== '') return String(name)
    return '—'
  }
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

// Unit grouping by section (same as Data Analytics) for Select Unit dropdown
const UNIT_GROUPS = [
  { sectionLabel: 'Registration & Licensing', unitIds: ['animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial', 'organicAgri'] },
  { sectionLabel: 'Quality Control', unitIds: ['goodAgriPractices', 'goodAnimalHusbandry', 'organicPostMarket', 'landUseMatter', 'foodSafety', 'safdzValidation'] },
  { sectionLabel: 'Surveillance', unitIds: ['plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance'] },
]

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
  const { disabledUnitIds } = useDisabledUnits()
  const [selectedCollection, setSelectedCollection] = useState(COLLECTIONS[0].id)
  const [docs, setDocs] = useState([])
  const [search, setSearch] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [exporting, setExporting] = useState(false)
  const [deleteConfirming, setDeleteConfirming] = useState(null) // { id, name } or { ids: string[], count } or null
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [loadError, setLoadError] = useState(null)
  const { user, role, userAllowedSections } = useAuth()
  const { showNotification } = useNotification()

  const allowedUnitIds = userAllowedSections && role === 'staff' ? getUnitIdsForSections(userAllowedSections) : null
  const enabledCollectionIds = COLLECTIONS.filter((c) => {
    if (disabledUnitIds.includes(c.id)) return false
    if (allowedUnitIds !== null && !allowedUnitIds.includes(c.id)) return false
    return true
  }).map((c) => c.id)

  // Keep selected unit in sync with enabled list (e.g. admin disables current unit, or section change)
  useEffect(() => {
    const enabled = new Set(enabledCollectionIds)
    if (enabled.size === 0) return
    if (!enabled.has(selectedCollection)) {
      const first = COLLECTIONS.find((c) => enabled.has(c.id))
      if (first) setSelectedCollection(first.id)
    }
  }, [enabledCollectionIds, selectedCollection])

  const VIEW_RECORDS_LIMIT = 5000

  useEffect(() => setSelectedIds(new Set()), [selectedCollection])

  useEffect(() => {
    setLoadError(null)
    const colRef = collection(db, selectedCollection)
    const q = query(colRef, limit(VIEW_RECORDS_LIMIT))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      },
      (err) => {
        console.error('[ViewRecords] Firestore error:', err)
        setLoadError(err?.message || 'Failed to load records')
      }
    )
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

  // GoodAgriPractices: split for separate GAP Certification vs Monitoring sections in table and print
  const isGAP = selectedCollection === 'goodAgriPractices'
  const filteredGapCert = isGAP ? filtered.filter((d) => d.formType === 'gapCertification') : []
  const filteredGapMonitoring = isGAP ? filtered.filter((d) => d.formType === 'monitoring') : []
  const filteredGapOther = isGAP ? filtered.filter((d) => d.formType !== 'gapCertification' && d.formType !== 'monitoring') : []

  const canEdit = (docItem) => role === 'admin' || docItem.createdBy === user?.uid
  const canDelete = () => role === 'admin'

  const allDisplayedIds = isGAP
    ? [...filteredGapCert, ...filteredGapMonitoring, ...filteredGapOther].map((d) => d.id)
    : filtered.map((d) => d.id)

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size >= allDisplayedIds.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(allDisplayedIds))
  }

  const clearSelection = () => setSelectedIds(new Set())

  const handleDelete = async (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds]
    try {
      for (const id of ids) await deleteDoc(doc(db, selectedCollection, id))
      setDeleteConfirming(null)
      setSelectedIds(new Set())
      const n = ids.length
      showNotification({
        type: 'success',
        title: n === 1 ? 'Record deleted' : `${n} records deleted`,
        message: n === 1 ? 'The record has been permanently deleted.' : `${n} records have been permanently deleted.`,
      })
      addSystemLog({
        action: 'record_deleted',
        userId: user?.uid,
        userEmail: user?.email,
        role: role || 'staff',
        details: `${selectedCollection} ${n} record(s) deleted.`,
      }).catch(() => {})
    } catch (err) {
      showNotification({ type: 'error', title: 'Delete failed', message: err.message || 'Failed to delete.' })
    }
  }

  const openEdit = (docItem) => {
    const { id, createdAt, createdBy, ...rest } = docItem
    const skip = ['createdBy', 'updatedAt']
    // GoodAgriPractices: use only the fields for this record’s form type (GAP Certification or Monitoring)
    let order = COLLECTION_FIELD_ORDER[selectedCollection]
    if (selectedCollection === 'goodAgriPractices' && GOOD_AGRI_PRACTICES_FORM_FIELDS) {
      const formType = rest.formType
      const formFields = formType && GOOD_AGRI_PRACTICES_FORM_FIELDS[formType]
      if (formFields?.length) order = formFields
    }
    if (order && order.length) {
      const formKeys = order.filter((k) => !skip.includes(k))
      const onlyFormFields = {}
      formKeys.forEach((k) => { onlyFormFields[k] = rest[k] })
      setEditForm(onlyFormFields)
    } else {
      setEditForm(rest)
    }
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

  // --- PRINT LOGIC: exclude ratings, recommendation, and attachment/file columns from print ---
  const printExcludeKeys = [
    ...RATING_FIELD_KEYS,
    'recommendation',
    'attachmentData',
    'attachmentFileName',
    'attachmentUrl',
    'linkFile',
  ]

  // Shorten header label for print so table fits A4/Legal; optional line break for 2-line header
  const shortenHeaderForPrint = (label, maxLen = 20, allowTwoLines = true) => {
    if (!label || typeof label !== 'string') return ''
    const abbrev = label
      .replace(/\bDate of Application\/Valuated\b/gi, 'Date Appl./Val.')
      .replace(/\bDate of Application Received & Evaluated\b/gi, 'Date Recv. & Eval.')
      .replace(/\bDate of Application Received and Evaluated\b/gi, 'Date Recv. & Eval.')
      .replace(/\bName of Establishment\b/gi, 'Establishment')
      .replace(/\bName of Applicant\b/gi, 'Applicant')
      .replace(/\bComplete Address\b/gi, 'Address')
      .replace(/\bDate of Inspection\b/gi, 'Date Insp.')
      .replace(/\bDate of Monitoring\b/gi, 'Date Mon.')
      .replace(/\bDate of Certification\b/gi, 'Date Cert.')
      .replace(/\bDate of Endorsement\b/gi, 'Date Endors.')
      .replace(/\bAmount of Fee Collected\b/gi, 'Fee Collected')
      .replace(/\bType of Application\b/gi, 'App Type')
      .replace(/\bDate of Inspection and Monitoring\b/gi, 'Date Insp. & Mon.')
      .replace(/\bTransmittal Date to BAI\b/gi, 'Transmittal to BAI')
      .replace(/\bSubmission of Client's Filled Application Form to DA-Regulatory Division\b/gi, 'Submission of Appl. Form')
      .replace(/\bEvaluation of Submitted Documentary Requirements\b/gi, 'Eval. of Documentary Req.')
      .replace(/\bPayment of Application Fee\b/gi, 'Payment of Fee')
      .replace(/\bDate of Inspection and Evaluation of Nursery\b/gi, 'Date Insp. & Eval.')
      .replace(/\bApproved Validated Result of Inspection and Validation of Areas\b/gi, 'Approved Validated Result')
      .replace(/\bEndorsement of Application to BPI\b/gi, 'Endorsement to BPI')
      .replace(/\bDate of Request and Collection\b/gi, 'Date Req. & Coll.')
      .replace(/\bDate of Request\b/gi, 'Date Req.')
      .replace(/\bDate of Pre-assessment\b/gi, 'Date Pre-assess.')
      .replace(/\bDate of Endorsement to BPI\b/gi, 'Date Endors. BPI')
      .replace(/\bDate of Final Inspection\b/gi, 'Date Final Insp.')
      .replace(/\bDate of Surveillance\b/gi, 'Date Surveill.')
      .replace(/\bDate Received and Evaluated\b/gi, 'Date Recv. & Eval.')
      .replace(/\bDate of Reply to the Request\b/gi, 'Date Reply')
      .replace(/\bDate Received by the Applicant\b/gi, 'Date Recv. by Applicant')
      .replace(/\bIssuance of Certificate\b/gi, 'Issuance Cert.')
      .replace(/\bQuantity of Goods\/Services Provided\b/gi, 'Quantity')
      .replace(/\bServices Rendered by Personnel\b/gi, 'Services/Personnel')
      .replace(/\bFor training consider its relevance\b/gi, 'Training')
      .replace(/\bAttitude \(courteousness\)\b/gi, 'Attitude')
      .replace(/\bPromptness in attending the request\b/gi, 'Promptness')
      .replace(/\bGood Agricultural Practices\b/gi, 'GAP')
      .trim()
    let out = abbrev.length > maxLen ? abbrev.slice(0, maxLen - 1).trim() + '.' : abbrev
    if (allowTwoLines && out.length > 14) {
      const lastSpace = out.lastIndexOf(' ', 14)
      const brAt = lastSpace > 6 ? lastSpace : 14
      out = out.slice(0, brAt) + '<br>' + out.slice(brAt).trim()
    }
    return out
  }

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
    let columnKeys = [...orderedFromConfig, ...restKeys]
    if (selectedCollection === 'animalFeed') {
      const animalFeedPrintExclude = [
        'companyName',
        'lastName', 'middleName', 'firstName', 'nameExt',
        'barangay', 'municipality', 'officeAddress', 'plantAddress'
      ]
      columnKeys = columnKeys.filter((k) => !animalFeedPrintExclude.includes(k))
    }
    const labels = COLLECTION_FIELD_LABELS?.[selectedCollection]
    const getLabel = (key) => (labels && labels[key] ? labels[key] : toTitleCase(key))
    const rawLabels = ['No.', 'Name / Title', ...columnKeys.map(getLabel)]
    const headerLabels = rawLabels.map((l) => shortenHeaderForPrint(l, 20, true))
    const numCols = headerLabels.length

    const rowToTr = (doc, idx) => {
      const row = docToRow(doc)
      const name = getDisplayName(doc, selectedCollection)
      let tr = '<tr><td>' + esc(idx + 1) + '</td><td>' + esc(name) + '</td>'
      columnKeys.forEach((key) => { tr += '<td>' + esc(row[key] ?? '') + '</td>' })
      return tr + '</tr>'
    }

    let tableRows = ''
    if (selectedCollection === 'goodAgriPractices') {
      const gapCert = filtered.filter((d) => d.formType === 'gapCertification')
      const gapMonitoring = filtered.filter((d) => d.formType === 'monitoring')
      const gapOther = filtered.filter((d) => d.formType !== 'gapCertification' && d.formType !== 'monitoring')
      tableRows += '<tr><td colspan="' + numCols + '" style="background:#065f46;color:#fff;font-weight:700;padding:6px 8px;">GAP CERTIFICATION' + (gapCert.length ? ' (' + gapCert.length + ' record(s))' : '') + '</td></tr>'
      gapCert.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      tableRows += '<tr><td colspan="' + numCols + '" style="background:#065f46;color:#fff;font-weight:700;padding:6px 8px;">MONITORING OF GAP CERTIFIED FARMER' + (gapMonitoring.length ? ' (' + gapMonitoring.length + ' record(s))' : '') + '</td></tr>'
      gapMonitoring.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      if (gapOther.length) {
        tableRows += '<tr><td colspan="' + numCols + '" style="background:#78716c;color:#fff;font-weight:700;padding:6px 8px;">OTHER (' + gapOther.length + ' record(s))</td></tr>'
        gapOther.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      }
    } else {
      filtered.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
    }

    const thCells = headerLabels.map((l) => {
      const parts = l.split('<br>').map((p) => esc(p))
      return '<th>' + parts.join('<br>') + '</th>'
    }).join('')
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
            /* A4 Landscape - magkasya lahat; puwede rin Legal sa print dialog */
            @page { 
              size: A4 landscape; 
              margin: 8mm; 
            }
            @media print {
              html, body { 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact; 
                overflow: visible !important;
                height: auto !important;
                max-width: 100% !important;
              }
              .print-body { overflow: visible !important; }
              thead { display: table-header-group; }
              tr { page-break-inside: avoid; }
              table, th, td { border-color: #000 !important; }
              th, td { border: 1px solid #000 !important; }
              th { font-weight: 700 !important; }
              .print-table-wrapper { overflow: visible !important; transform-origin: top left; }
            }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 0; padding: 10px; overflow-x: auto; }
            .print-header { margin-bottom: 12px; border-bottom: 2px solid #000; padding-bottom: 6px; flex-shrink: 0; }
            .print-title { color: #064e3b; font-size: 22px; font-weight: 800; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
            .print-unit { color: #059669; font-size: 19px; font-weight: 600; margin: 2px 0; }
            .print-meta { color: #64748b; font-size: 14px; margin: 0; }
            .print-table-wrapper { width: fit-content; max-width: 100%; margin: 0 auto; }
            table { 
              border-collapse: collapse; 
              font-size: 16px; 
              table-layout: auto; 
              width: max-content; 
              min-width: 100%;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 8px 10px; 
              vertical-align: top; 
              word-wrap: break-word; 
              word-break: break-word; 
              overflow-wrap: break-word;
              max-width: 95px;
              line-height: 1.45;
            }
            td { text-align: left; }
            th { 
              background: #065f46; 
              color: #fff; 
              font-weight: 700; 
              font-size: 15px; 
              letter-spacing: 0.1px; 
              text-align: center; 
              white-space: normal; 
              line-height: 1.45;
            }
            tr { min-height: 2.2em; }
            tr:nth-child(even) td { background: #f0fdf4; }
            th:nth-child(1), td:nth-child(1) { width: 2%; min-width: 28px; white-space: nowrap; }
            td:nth-child(1) { text-align: center; }
            th:nth-child(2), td:nth-child(2) { max-width: 100px; }
          </style>
        </head>
        <body class="print-body">
          <div class="print-header">
            <p class="print-title">Regulatory Division Data Report</p>
            <p class="print-unit">${esc(collectionLabel)}</p>
            <p class="print-meta">${esc(metaLine)}</p>
          </div>
          <div class="print-table-wrapper" id="printTableWrapper">
            <table id="printTable">
              <thead><tr>${thCells}</tr></thead>
              <tbody>${tableRows}</tbody>
            </table>
          </div>
          <script>
            (function() {
              function fitTableToPage() {
                var wrapper = document.getElementById('printTableWrapper');
                var table = document.getElementById('printTable');
                if (!wrapper || !table) return;
                var marginMm = 16;
                var a4LandscapeMm = 297;
                var legalLandscapeMm = 356;
                var contentWidthMm = a4LandscapeMm - marginMm;
                var contentWidthPx = contentWidthMm * 96 / 25.4;
                var tableWidth = table.scrollWidth || table.offsetWidth;
                if (tableWidth > contentWidthPx && tableWidth > 0) {
                  var scale = (contentWidthPx - 30) / tableWidth;
                  if (scale < 1) {
                    wrapper.style.transform = 'scale(' + Math.min(scale, 0.98) + ')';
                    wrapper.style.transformOrigin = 'top left';
                  }
                }
              }
              if (document.readyState === 'complete') fitTableToPage();
              else window.addEventListener('load', fitTableToPage);
              setTimeout(fitTableToPage, 150);
            })();
          <\/script>
        </body>
      </html>
    `)
    win.document.close()
    win.focus()
    setTimeout(() => { win.print(); win.close(); }, 600)
  }

  const handleExportExcel = async () => {
    const EXPORT_WARN_THRESHOLD = 5000
    if (filtered.length > EXPORT_WARN_THRESHOLD && !window.confirm(
      `Exporting ${filtered.length} records may take a while and use more memory. Continue?`
    )) return
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

  // Keys that should use date input (settable date picker)
  const isDateField = (k) => {
    if (!k || typeof k !== 'string') return false
    const lower = k.toLowerCase()
    return lower.includes('date')
  }

  const toDateInputValue = (val) => {
    if (val == null || val === '') return ''
    if (typeof val === 'string') return val.slice(0, 10)
    if (val && typeof val.toDate === 'function') return val.toDate().toISOString().slice(0, 10)
    return ''
  }

  const renderEditValue = (key, value) => {
    const inputClass = "w-full px-3 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] text-sm font-medium text-[#1e4d2b] placeholder:text-[#8a857c] transition-all"

    if (RATING_FIELD_KEYS.includes(key)) {
      const ratingValue = value != null && value !== '' ? String(value) : ''
      return (
        <div className="view-records-edit-rating-select">
          <AppSelect
            options={RATING_OPTIONS}
            value={ratingValue}
            onChange={(v) => updateEditField(key, v)}
            placeholder="Select rating..."
            aria-label={key}
            className="w-full"
          />
        </div>
      )
    }

    if (isDateField(key)) {
      const dateVal = toDateInputValue(value)
      return (
        <input
          type="date"
          value={dateVal}
          onChange={(e) => updateEditField(key, e.target.value)}
          className={inputClass}
          aria-label={key}
        />
      )
    }

    // Uploaded file (base64) — display with filename, Download, Remove
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
        return <span className="text-sm text-[#5c7355]">No file uploaded</span>
      }
      return (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border-2 border-[#e8e0d4] bg-[#faf8f5]">
          <span className="text-sm font-semibold text-[#1e4d2b] truncate flex-1 min-w-0" title={fileName}>{fileName}</span>
          <button type="button" onClick={download} className="px-3 py-2 min-h-[44px] bg-[#1e4d2b] text-white rounded-xl text-sm font-bold hover:bg-[#153019] whitespace-nowrap touch-manipulation">Download</button>
          <button type="button" onClick={removeAttachment} className="px-3 py-2 min-h-[44px] border-2 border-red-400 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 whitespace-nowrap touch-manipulation">Remove</button>
        </div>
      )
    }

    // Link / file URL fields (e.g. linkFile) — show clickable link and editable input
    const isLinkOrFileUrlKey = key === 'linkFile' || key === 'attachmentUrl' || (typeof key === 'string' && (key.endsWith('File') || key.endsWith('Url')) && key !== 'attachmentFileName' && key !== 'attachmentData')
    const urlVal = typeof value === 'string' ? value.trim() : ''
    const looksLikeUrl = urlVal && (urlVal.startsWith('http://') || urlVal.startsWith('https://'))
    if (isLinkOrFileUrlKey) {
      return (
        <div className="space-y-2">
          {looksLikeUrl && (
            <a href={urlVal} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1e4d2b] hover:underline break-all">
              <iconify-icon icon="mdi:open-in-new" width="16"></iconify-icon>
              Open link / file
            </a>
          )}
          <input type="url" value={urlVal} onChange={(e) => updateEditField(key, e.target.value)} className={inputClass} placeholder="https://..." />
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
    <div className="space-y-4 sm:space-y-6 pb-10 sm:pb-12 min-w-0 w-full max-w-full overflow-x-hidden">
      
      {/* --- HEADER SECTION --- */}
      <div className="view-records-anim-1 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden hover:shadow-xl hover:shadow-[#1e4d2b]/12 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)] transition-opacity duration-500 group-hover:opacity-80" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight drop-shadow-sm">Master Records</h2>
              <p className="text-[11px] font-semibold text-white/85 tracking-wider mt-1">Manage, view, and update regulatory data entries</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 min-h-[44px] bg-white text-[#1e4d2b] rounded-xl hover:bg-[#faf8f5] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm border border-white/30 touch-manipulation"
              >
                <iconify-icon icon="mdi:printer" width="18" className="shrink-0"></iconify-icon>
                Print List
              </button>
              <button
                onClick={handleExportExcel}
                disabled={exporting}
                className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 min-h-[44px] bg-[#b8a066] text-[#153019] rounded-xl hover:bg-[#d4c4a0] hover:scale-105 active:scale-[0.98] shadow-md hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-[#b8a066]/50 touch-manipulation"
              >
                {exporting ? <iconify-icon icon="mdi:loading" width="18" class="animate-spin shrink-0"></iconify-icon> : <iconify-icon icon="mdi:microsoft-excel" width="18" className="shrink-0"></iconify-icon>}
                {exporting ? 'Exporting...' : 'Export Excel'}
              </button>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-3 py-2.5 sm:px-4 min-h-[44px] bg-white/15 backdrop-blur-sm text-white border border-white/25 rounded-xl hover:bg-white/25 hover:border-white/40 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] font-bold text-xs sm:text-sm touch-manipulation"
              >
                <iconify-icon icon="mdi:arrow-left" width="18" className="shrink-0"></iconify-icon>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {loadError && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          <span className="inline-flex items-center gap-2">
            <iconify-icon icon="mdi:alert-circle" width="20"></iconify-icon>
            {loadError}
          </span>
        </div>
      )}

      {/* --- CONTROLS BAR (FILTERS & SEARCH) — khaki/gold accent (Quality Control style) --- */}
      <div className="view-records-anim-2 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#b8a066]/10 overflow-visible hover:shadow-xl hover:shadow-[#b8a066]/15 hover:-translate-y-0.5 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="px-4 py-3 bg-gradient-to-r from-[#9a7b4f] via-[#b8a066] to-[#8f7a45] relative border-b-2 border-[#b8a066]/25 rounded-t-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.12),transparent_50%)]" />
          <span className="relative z-10 text-[10px] font-black text-white uppercase tracking-widest">Filters & Search</span>
        </div>
        <div className="p-4 sm:p-5 border-l-4 border-[#b8a066]/25 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.25fr] gap-4 lg:gap-5 lg:items-end">
          <div className="flex flex-col min-w-0">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5 transition-colors duration-300">Select Unit</label>
            <AppSelect
              value={selectedCollection}
              onChange={(v) => setSelectedCollection(v)}
              groups={UNIT_GROUPS.map((g) => ({
                sectionLabel: g.sectionLabel,
                options: g.unitIds.map((id) => {
                  const c = COLLECTIONS.find((col) => col.id === id)
                  const appDisabled = disabledUnitIds.includes(id)
                  const sectionRestricted = allowedUnitIds !== null && !allowedUnitIds.includes(id)
                  const disabled = appDisabled || sectionRestricted
                  const suffix = sectionRestricted ? ' (Not in your section)' : appDisabled ? ' (Disabled)' : ''
                  return {
                    value: id,
                    label: c ? `${c.label}${suffix}` : id,
                    disabled,
                  }
                }),
              }))}
              leftIcon={<iconify-icon icon="mdi:folder-table-outline" width="20"></iconify-icon>}
              aria-label="Select Unit"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Month</label>
            <AppSelect
              value={filterMonth}
              onChange={setFilterMonth}
              placeholder="All Months"
              options={[
                { value: '', label: 'All Months' },
                ...months.map((m) => ({ value: m, label: formatMonthLabel(m) })),
              ]}
              leftIcon={<iconify-icon icon="mdi:calendar-month-outline" width="18"></iconify-icon>}
              aria-label="Month"
              className="min-w-0"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Province</label>
            <AppSelect
              value={filterProvince}
              onChange={setFilterProvince}
              placeholder="All Provinces"
              options={[
                { value: '', label: 'All Provinces' },
                ...PROVINCES.map((p) => ({ value: p, label: p })),
              ]}
              leftIcon={<iconify-icon icon="mdi:map-marker-outline" width="18"></iconify-icon>}
              aria-label="Province"
              className="min-w-0"
            />
          </div>
          <div className="flex flex-col min-w-0 sm:col-span-2 lg:col-span-1">
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Search Records</label>
            <div className="relative group flex items-stretch">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5c7355] group-focus-within:text-[#1e4d2b] transition-colors duration-300">
                <iconify-icon icon="mdi:magnify" width="20"></iconify-icon>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, ID, or keyword..."
                className="w-full min-h-[42px] pl-10 pr-10 py-2.5 bg-white border-2 border-[#e8e0d4] rounded-xl text-[#1e4d2b] text-sm font-medium focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] hover:border-[#1e4d2b]/50 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] placeholder:text-[#8a857c] box-border"
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
        {canDelete() && selectedIds.size > 0 && (
          <div className="shrink-0 px-4 sm:px-6 py-2.5 bg-amber-50 border-b-2 border-amber-200/60 flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-amber-900">
              {selectedIds.size} record{selectedIds.size !== 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearSelection}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 border-amber-300 text-amber-800 hover:bg-amber-100 transition-all"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirming({ ids: Array.from(selectedIds), count: selectedIds.size })}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                Delete selected
              </button>
            </div>
          </div>
        )}
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-260px)] sm:max-h-[calc(100vh-280px)] min-h-0 custom-scrollbar view-records-scroll flex-1 border-l-4 border-[#1e4d2b]/25 -mx-1 px-1 sm:mx-0 sm:px-0">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-b-2 border-[#e8e0d4]">
              <tr>
                {canDelete() && (
                  <th className="px-2 sm:px-3 py-3 sm:py-3.5 w-10 sm:w-12 text-center">
                    <label className="flex items-center justify-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={allDisplayedIds.length > 0 && selectedIds.size === allDisplayedIds.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-2 border-[#1e4d2b]/40 text-[#1e4d2b] focus:ring-[#1e4d2b]/50"
                        aria-label="Select all"
                      />
                    </label>
                  </th>
                )}
                <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Name / Identifier</th>
                {RATING_COLLECTIONS[selectedCollection] && (
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Avg. Rating</th>
                )}
                <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Date</th>
                <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider text-center w-24 sm:w-28">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d4]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={(RATING_COLLECTIONS[selectedCollection] ? 4 : 3) + (canDelete() ? 1 : 0)} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-[#5c7355] rounded-xl border-2 border-dashed border-[#1e4d2b]/25 bg-[#f0f5ee]/80 py-12 mx-4">
                      <iconify-icon icon="mdi:database-off-outline" width="56" class="opacity-60 animate-pulse"></iconify-icon>
                      <p className="mt-3 font-semibold text-[#1e4d2b]">No records found</p>
                      <p className="text-xs text-[#5c7355] mt-1">Try adjusting filters or search.</p>
                    </div>
                  </td>
                </tr>
              ) : isGAP ? (
                <>
                  {/* GAP Certification section */}
                  <tr className="bg-[#1e4d2b]/10 border-y-2 border-[#1e4d2b]/20">
                    <td colSpan={(RATING_COLLECTIONS[selectedCollection] ? 4 : 3) + (canDelete() ? 1 : 0)} className="px-5 py-2.5">
                      <span className="text-xs font-black text-[#1e4d2b] uppercase tracking-wider">GAP Certification</span>
                      {filteredGapCert.length > 0 && <span className="ml-2 text-[10px] font-semibold text-[#5c7355]">({filteredGapCert.length} record(s))</span>}
                    </td>
                  </tr>
                  {filteredGapCert.map((docItem) => (
                    <tr key={docItem.id} className="hover:bg-[#faf8f5]/90 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group">
                      {canDelete() && (
                        <td className="px-2 sm:px-3 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(docItem.id)}
                            onChange={() => toggleSelect(docItem.id)}
                            className="w-4 h-4 rounded border-2 border-[#1e4d2b]/40 text-[#1e4d2b] focus:ring-[#1e4d2b]/50"
                            aria-label={`Select ${getDisplayName(docItem, selectedCollection)}`}
                          />
                        </td>
                      )}
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
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit(docItem) && (
                            <button onClick={() => openEdit(docItem)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b] hover:shadow-md hover:shadow-[#1e4d2b]/20 active:scale-[0.98] transition-all duration-300" title="Edit Record">
                              <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                              <span>Edit</span>
                            </button>
                          )}
                          {canDelete() && (
                            <button onClick={() => setDeleteConfirming({ id: docItem.id, name: getDisplayName(docItem, selectedCollection) })} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-400 hover:shadow-md hover:shadow-red-200/30 active:scale-[0.98] transition-all duration-300" title="Delete Record">
                              <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* GAP Monitoring section */}
                  <tr className="bg-[#1e4d2b]/10 border-y-2 border-[#1e4d2b]/20">
                    <td colSpan={(RATING_COLLECTIONS[selectedCollection] ? 4 : 3) + (canDelete() ? 1 : 0)} className="px-5 py-2.5">
                      <span className="text-xs font-black text-[#1e4d2b] uppercase tracking-wider">Monitoring of GAP Certified Farmer</span>
                      {filteredGapMonitoring.length > 0 && <span className="ml-2 text-[10px] font-semibold text-[#5c7355]">({filteredGapMonitoring.length} record(s))</span>}
                    </td>
                  </tr>
                  {filteredGapMonitoring.map((docItem) => (
                    <tr key={docItem.id} className="hover:bg-[#faf8f5]/90 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group">
                      {canDelete() && (
                        <td className="px-2 sm:px-3 py-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(docItem.id)}
                            onChange={() => toggleSelect(docItem.id)}
                            className="w-4 h-4 rounded border-2 border-[#1e4d2b]/40 text-[#1e4d2b] focus:ring-[#1e4d2b]/50"
                            aria-label={`Select ${getDisplayName(docItem, selectedCollection)}`}
                          />
                        </td>
                      )}
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
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {canEdit(docItem) && (
                            <button onClick={() => openEdit(docItem)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b] hover:shadow-md hover:shadow-[#1e4d2b]/20 active:scale-[0.98] transition-all duration-300" title="Edit Record">
                              <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                              <span>Edit</span>
                            </button>
                          )}
                          {canDelete() && (
                            <button onClick={() => setDeleteConfirming({ id: docItem.id, name: getDisplayName(docItem, selectedCollection) })} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-400 hover:shadow-md hover:shadow-red-200/30 active:scale-[0.98] transition-all duration-300" title="Delete Record">
                              <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredGapOther.length > 0 && (
                    <>
                      <tr className="bg-[#b8a066]/10 border-y-2 border-[#b8a066]/20">
                        <td colSpan={(RATING_COLLECTIONS[selectedCollection] ? 4 : 3) + (canDelete() ? 1 : 0)} className="px-5 py-2.5">
                          <span className="text-xs font-black text-[#5c574f] uppercase tracking-wider">Other</span>
                          <span className="ml-2 text-[10px] font-semibold text-[#5c7355]">({filteredGapOther.length} record(s))</span>
                        </td>
                      </tr>
                      {filteredGapOther.map((docItem) => (
                        <tr key={docItem.id} className="hover:bg-[#faf8f5]/90 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group">
                          {canDelete() && (
                            <td className="px-2 sm:px-3 py-3.5 text-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.has(docItem.id)}
                                onChange={() => toggleSelect(docItem.id)}
                                className="w-4 h-4 rounded border-2 border-[#1e4d2b]/40 text-[#1e4d2b] focus:ring-[#1e4d2b]/50"
                                aria-label={`Select ${getDisplayName(docItem, selectedCollection)}`}
                              />
                            </td>
                          )}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1e4d2b]/15 to-[#5c7355]/10 text-[#1e4d2b] flex items-center justify-center font-black text-sm shrink-0 border border-[#e8e0d4]/50">
                                {getDisplayName(docItem, selectedCollection).charAt(0).toUpperCase()}
                              </div>
                              <div className="font-bold text-[#1e4d2b] max-w-xs sm:max-w-md truncate" title={getDisplayName(docItem, selectedCollection)}>
                                {getDisplayName(docItem, selectedCollection)}
                              </div>
                            </div>
                          </td>
                          {RATING_COLLECTIONS[selectedCollection] && (
                            <td className="px-5 py-3.5 whitespace-nowrap">
                              {getAvgRating(docItem, selectedCollection) ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#b8a066]/15 text-[#1e4d2b] font-bold text-xs border border-[#b8a066]/30">
                                  <iconify-icon icon="mdi:star" width="14" class="text-[#b8a066]"></iconify-icon>
                                  {getAvgRating(docItem, selectedCollection)}/5
                                </span>
                              ) : <span className="text-[#8a857c] text-sm">—</span>}
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
                          <td className="px-5 py-3.5 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {canEdit(docItem) && (
                                <button onClick={() => openEdit(docItem)} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b] hover:shadow-md hover:shadow-[#1e4d2b]/20 active:scale-[0.98] transition-all duration-300" title="Edit Record">
                                  <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                                  <span>Edit</span>
                                </button>
                              )}
                              {canDelete() && (
                                <button onClick={() => setDeleteConfirming({ id: docItem.id, name: getDisplayName(docItem, selectedCollection) })} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-400 hover:shadow-md hover:shadow-red-200/30 active:scale-[0.98] transition-all duration-300" title="Delete Record">
                                  <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </>
              ) : (
                filtered.map((docItem) => (
                  <tr key={docItem.id} className="hover:bg-[#faf8f5]/90 transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group">
                    {canDelete() && (
                      <td className="px-2 sm:px-3 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(docItem.id)}
                          onChange={() => toggleSelect(docItem.id)}
                          className="w-4 h-4 rounded border-2 border-[#1e4d2b]/40 text-[#1e4d2b] focus:ring-[#1e4d2b]/50"
                          aria-label={`Select ${getDisplayName(docItem, selectedCollection)}`}
                        />
                      </td>
                    )}
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
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {canEdit(docItem) && (
                          <button
                            onClick={() => openEdit(docItem)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b] hover:shadow-md hover:shadow-[#1e4d2b]/20 active:scale-[0.98] transition-all duration-300"
                            title="Edit Record"
                          >
                            <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                            <span>Edit</span>
                          </button>
                        )}
                        {canDelete() && (
                          <button
                            onClick={() => setDeleteConfirming({ id: docItem.id, name: getDisplayName(docItem, selectedCollection) })}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-400 hover:shadow-md hover:shadow-red-200/30 active:scale-[0.98] transition-all duration-300"
                            title="Delete Record"
                          >
                            <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                            <span>Delete</span>
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
        <div className="shrink-0 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-t-2 border-[#1e4d2b]/15 px-5 py-2.5 flex flex-wrap justify-between items-center gap-2 text-[11px] font-bold text-[#5c7355] transition-colors duration-300">
          <span>Showing {filtered.length} record(s)</span>
          <span className="flex items-center gap-2">
            {docs.length >= VIEW_RECORDS_LIMIT && (
              <span className="italic text-amber-700">First {VIEW_RECORDS_LIMIT} loaded — use filters to narrow</span>
            )}
            {filtered.length > 20 && <span className="italic">Scroll for more</span>}
          </span>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL (portal = full-screen backdrop) --- */}
      {deleteConfirming && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 min-h-[100dvh] min-w-full bg-red-950/45 backdrop-blur-md animate-in fade-in duration-300"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setDeleteConfirming(null)}
          />
          <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-[#e8e0d4] shadow-2xl shadow-[#1e4d2b]/20 w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out" style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="shrink-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 px-6 py-4 flex items-center gap-3 relative overflow-hidden border-b-2 border-red-900/30">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
              <span className="relative z-10 p-2 rounded-xl bg-white/15 border border-white/20">
                <iconify-icon icon="mdi:alert-circle-outline" width="24" class="text-white"></iconify-icon>
              </span>
              <div className="relative z-10">
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  {deleteConfirming.ids ? `Delete ${deleteConfirming.count} Record${deleteConfirming.count !== 1 ? 's' : ''}` : 'Delete Record'}
                </h3>
                <p className="text-[11px] font-semibold text-white/90 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="p-6 border-l-4 border-red-500/30 bg-gradient-to-b from-[#fef2f2] to-[#faf8f5]">
              <p className="text-sm font-medium text-[#1e293b] mb-1">
                {deleteConfirming.ids
                  ? `Are you sure you want to permanently delete ${deleteConfirming.count} record${deleteConfirming.count !== 1 ? 's' : ''}?`
                  : 'Are you sure you want to permanently delete this record?'}
              </p>
              {deleteConfirming.name && deleteConfirming.name !== '—' && (
                <p className="text-xs text-[#64748b] mt-2 px-3 py-2 rounded-lg bg-white/80 border border-[#e8e0d4]">
                  <span className="font-semibold text-[#1e4d2b]">{deleteConfirming.name}</span>
                </p>
              )}
            </div>
            <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-[#e8e0d4] bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirming(null)}
                className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl border-2 border-[#e8e0d4] text-[#1e4d2b] font-bold hover:bg-white hover:border-[#1e4d2b]/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 text-xs sm:text-sm touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirming.ids || deleteConfirming.id)}
                className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm flex items-center gap-2 touch-manipulation"
              >
                <iconify-icon icon="mdi:trash-can-outline" width="18"></iconify-icon>
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* --- EDIT MODAL (portal = full-screen backdrop) --- */}
      {editing && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 min-h-[100dvh] min-w-full bg-[#153019]/80 backdrop-blur-md animate-in fade-in duration-300"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setEditing(null)}
          />
          <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-[#e8e0d4] shadow-2xl shadow-[#1e4d2b]/20 w-full max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out" style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-4 sm:px-6 py-4 flex justify-between items-center relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_0%,rgba(255,255,255,0.1),transparent_50%)]" />
              <div className="relative z-10 min-w-0">
                <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight truncate">Edit Record</h3>
                <p className="text-[11px] font-semibold text-white/80 mt-0.5">ID: <span className="font-mono">{editing}</span></p>
              </div>
              <button onClick={() => setEditing(null)} className="relative z-10 p-2 min-h-[44px] min-w-[44px] rounded-xl bg-white/15 hover:bg-white/25 hover:scale-110 active:scale-95 text-white transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] touch-manipulation" aria-label="Close">
                <iconify-icon icon="mdi:close" width="24"></iconify-icon>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar view-records-scroll bg-gradient-to-b from-[#faf8f5] to-[#f2ede6] border-l-4 border-[#1e4d2b]/25">
              <div className="grid gap-5">
                {(() => {
                  const skip = ['createdBy', 'updatedAt']
                  let order = COLLECTION_FIELD_ORDER[selectedCollection]
                  // GoodAgriPractices: show only fields for the record’s form type (GAP Certification vs Monitoring)
                  if (selectedCollection === 'goodAgriPractices' && GOOD_AGRI_PRACTICES_FORM_FIELDS) {
                    const formType = editForm.formType
                    const formFields = formType && GOOD_AGRI_PRACTICES_FORM_FIELDS[formType]
                    if (formFields?.length) order = formFields
                  }
                  const labels = COLLECTION_FIELD_LABELS?.[selectedCollection]
                  // Hide attachmentFileName row when we show attachmentData (one combined "Attachment" row)
                  const filterKey = (k) => !skip.includes(k) && !(k === 'attachmentFileName' && editForm.attachmentData)
                  const entries = order?.length
                    ? order.filter(filterKey).map((k) => [k, editForm[k]])
                    : Object.entries(editForm).filter(([k]) => filterKey(k))

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

            <div className="shrink-0 px-4 sm:px-6 py-4 border-t border-[#e8e0d4] bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl border-2 border-[#e8e0d4] text-[#1e4d2b] font-bold hover:bg-white hover:border-[#1e4d2b]/50 hover:scale-105 active:scale-[0.98] transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] text-xs sm:text-sm touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="min-h-[44px] px-4 sm:px-5 py-2.5 rounded-xl bg-[#1e4d2b] text-white font-bold hover:bg-[#153019] hover:scale-105 active:scale-[0.98] shadow-lg hover:shadow-xl transition-all duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] text-xs sm:text-sm flex items-center gap-2 touch-manipulation"
              >
                <iconify-icon icon="mdi:content-save-check" width="18"></iconify-icon>
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}