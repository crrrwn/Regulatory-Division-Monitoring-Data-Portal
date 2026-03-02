import { useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { COLLECTIONS, COLLECTION_FIELD_ORDER } from '../lib/collections'
import { PROVINCES } from '../lib/regions'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { addSystemLog } from '../lib/systemLogs'

function parseDate(str) {
  if (!str || typeof str !== 'string') return ''
  const s = str.trim()
  if (!s) return ''
  const d = new Date(s)
  if (!isNaN(d.getTime())) return d.toISOString()
  const parts = s.split('/')
  if (parts.length === 3) {
    const m = parseInt(parts[0], 10)
    const d2 = parseInt(parts[1], 10)
    const y = parseInt(parts[2], 10)
    if (m >= 1 && m <= 12 && d2 >= 1 && d2 <= 31 && y > 2000) {
      return new Date(y, m - 1, d2).toISOString()
    }
  }
  return s
}

/**
 * Parse Animal Feeds paste - 26 columns in exact screenshot order:
 * No, Registration No, Date of Application, Name of Establishment, Last Name, First Name, Middle Initial,
 * Barangay, Municipality, Province, With License-to-Operate, With Mayor's Permit, Type, New/Renewal,
 * LTO Number, OR Number, OR Date, Fees Collected, Date of Inspection and Monitoring, Date of Monitoring,
 * Date of Feed Sampling (1st sem), (2nd sem), No. of Feed Samples (1st sem), (2nd sem), Date of Issuance of LTO, Validity
 */
function parseAnimalFeedsPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  const rows = []
  let headerIndex = -1
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].split(/\t/)
    const first = (row[0] || '').toLowerCase()
    if (row.length < 5 && (first.includes('oriental') || first.includes('mindoro') || first.includes('calapan') || first.includes('puerto') || first.includes('galera') || first.includes('naujan') || first.includes('gloria') || first.includes('bansud') || first.includes('baco') || first.includes('victoria'))) continue
    if (first.startsWith('(retailer') || first.startsWith('(if renewal)') || first.startsWith('(1st semester)') || first.startsWith('(2nd semester)')) continue
    const joined = row.join(' ').toLowerCase()
    if (joined.includes('registration no') || joined.includes('name of establishment')) {
      headerIndex = i
      continue
    }
    if (headerIndex < 0) continue
    const col0 = (row[0] || '').trim()
    const col1 = (row[1] || '').trim()
    const col3 = (row[3] || '').trim()
    if (!col3 && !col1) continue
    if (col0.toLowerCase() === 'no.' || col1.toLowerCase() === 'registration no.') continue
    if (/^\d+$/.test(col0) === false && !/^[DR][\s-]?\d/i.test(col1)) continue

    const get = (idx) => (row[idx] || '').trim()
    const lastName = get(4)
    const firstName = get(5)
    const middleName = get(6)
    const completeName = [lastName, firstName, middleName].filter(Boolean).join(', ')
    const province = get(9) || defaultProvince
    const municipality = get(8)
    const barangay = get(7)
    const completeAddress = [barangay, municipality, province].filter(Boolean).join(', ')

    const wLto = get(10)
    const wMayor = get(11)
    const newRenewal = get(13)
    const validity = get(25)
    const remarkParts = []
    if (wLto) remarkParts.push(`With LTO: ${wLto}`)
    if (wMayor) remarkParts.push(`With Mayor's Permit: ${wMayor}`)
    if (newRenewal) remarkParts.push(`New/Renewal: ${newRenewal}`)
    if (validity) remarkParts.push(`Validity: ${validity}`)
    const remarks = remarkParts.join('; ')

    rows.push({
      controlNo: get(1) || get(14),
      registrationNo: get(1),
      date: parseDate(get(2)),
      companyName: get(3),
      lastName,
      firstName,
      middleName,
      completeName,
      barangay,
      municipality,
      province,
      completeAddress,
      withLicenseToOperate: wLto,
      withMayorsPermit: wMayor,
      type: get(12),
      newRenewal,
      validity,
      orNo: get(15),
      orDate: parseDate(get(16)),
      fee: get(17) ? String(get(17)).replace(/,/g, '').trim() : '',
      dateOfInspection: parseDate(get(18)),
      dateOfMonitoring: parseDate(get(19)),
      dateOfFeedSampling1stSem: parseDate(get(20)),
      dateOfFeedSampling2ndSem: parseDate(get(21)),
      noOfFeedSamples1stSem: get(22) || '',
      noOfFeedSamples2ndSem: get(23) || '',
      dateIssued: parseDate(get(24)),
      remarks,
    })
  }
  return rows
}

/**
 * Parse Animal Welfare paste - NEW (14 cols) or RENEWAL (12 cols).
 * NEW: No, RegNo, Facility, Owner, Address, Type, DateApp, DateInsp, OR#, OR Date, Fee, Endorsement, RegDate, Validity
 * RENEWAL: No, RegNo, Facility, Owner, Address, Type, DateApp, DateInsp, OR#, OR Date, Fee, RegDate, Validity
 */
function parseAnimalWelfarePaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  function extractProvinceFromAddress(addr) {
    if (!addr || typeof addr !== 'string') return ''
    const parts = addr.split(',').map((p) => p.trim()).filter(Boolean)
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      const found = PROVINCES.find((prov) => prov.toLowerCase() === p.toLowerCase())
      if (found) return found
      if (p.toLowerCase() === 'palawan') return 'Palawan'
      if (p.toLowerCase() === 'oriental mindoro') return 'Oriental Mindoro'
      if (p.toLowerCase() === 'occidental mindoro') return 'Occidental Mindoro'
      if (p.toLowerCase() === 'marinduque') return 'Marinduque'
      if (p.toLowerCase() === 'romblon') return 'Romblon'
    }
    return ''
  }

  const rows = []
  let inDataSection = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lower = line.toLowerCase()
    if (lower.includes('cy 20') || lower.includes('new application') || lower.includes('renewal application')) {
      inDataSection = false
      continue
    }
    const row = line.split(/\t/)
    const get = (idx) => (row[idx] || '').trim()
    const col0 = get(0).toLowerCase()
    const col1 = get(1).trim()
    const col2 = get(2).trim()

    if (col1.toLowerCase().includes('registration') && (col2.toLowerCase().includes('facility') || col2.toLowerCase().includes('name'))) {
      inDataSection = true
      continue
    }
    if (!inDataSection) continue
    if (row.length < 8) continue
    if (!col1 && !col2 && !get(3)) continue
    if (col0 === 'no.' && col1.toLowerCase().includes('registration')) continue

    const regNo = col1
    const facilityName = col2 || get(2)
    const ownerName = get(3)
    const address = get(4)
    const facilityType = get(5)
    const dateApplied = get(6)
    const dateOfInspection = get(7)
    const orNo = get(8)
    const orDate = get(9)
    const fee = get(10) ? String(get(10)).replace(/,/g, '').trim() : ''
    const isNewFormat = row.length >= 14
    const endorsementToBAI = isNewFormat ? get(11) : ''
    const registrationDate = isNewFormat ? get(12) : get(11)
    const validityDate = isNewFormat ? get(13) : get(12)

    if (!regNo && !facilityName && !ownerName) continue

    const province = extractProvinceFromAddress(address) || defaultProvince

    rows.push({
      certificateNo: regNo,
      facilityName: facilityName || ownerName,
      ownerName: ownerName || '',
      province,
      address,
      facilityType,
      dateApplied: parseDate(dateApplied),
      dateOfInspection: parseDate(dateOfInspection),
      orNo,
      orDate: parseDate(orDate),
      fee,
      endorsementToBAI,
      registrationDate: parseDate(registrationDate),
      validityDate: validityDate || '',
      status: 'Registered',
      applicationType: isNewFormat && endorsementToBAI ? 'New' : 'Renewal',
    })
  }
  return rows
}

/**
 * Parse Livestock Handlers paste - Format A (11 cols) or Format B (14 cols with Date of Certification, Transmittal).
 * Format A: No, RegNo, Establishment, Applicant, Address, Type, DateApp, OR#, OR Date, Fee, DateInsp, Validity
 * Format B: No, RegNo, Establishment, Applicant, Address, Type, DateApp, OR#, OR Date, Fee, DateInsp, DateCert, Transmittal, Validity
 */
function parseLivestockHandlersPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  function extractProvinceFromAddress(addr) {
    if (!addr || typeof addr !== 'string') return ''
    const parts = addr.split(',').map((p) => p.trim()).filter(Boolean)
    const provNames = ['Oriental Mindoro', 'Occidental Mindoro', 'Palawan', 'Marinduque', 'Romblon', 'Puerto Princesa City']
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      const found = PROVINCES.find((prov) => prov.toLowerCase() === p.toLowerCase())
      if (found) return found
      if (p.toLowerCase().includes('oriental mindoro')) return 'Oriental Mindoro'
      if (p.toLowerCase().includes('occidental mindoro')) return 'Occidental Mindoro'
      if (p.toLowerCase().includes('palawan') || p.toLowerCase().includes('puerto princesa')) return 'Palawan'
      if (p.toLowerCase().includes('marinduque')) return 'Marinduque'
      if (p.toLowerCase().includes('romblon')) return 'Romblon'
    }
    return ''
  }

  const rows = []
  let inDataSection = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lower = line.toLowerCase()
    if (lower.includes('cy 20') || lower.includes('new application') || lower.includes('renewal application')) {
      inDataSection = false
      continue
    }
    const row = line.split(/\t/)
    const get = (idx) => (row[idx] || '').trim()
    const col1 = get(1).trim()
    const col2 = get(2).trim()

    if (col1.toLowerCase().includes('registration') && (col2.toLowerCase().includes('establishment') || col2.toLowerCase().includes('name'))) {
      inDataSection = true
      continue
    }
    if (!inDataSection) continue
    if (row.length < 10) continue
    if (!col1 && !col2 && !get(3)) continue
    if (get(0).toLowerCase() === 'no.' && col1.toLowerCase().includes('registration')) continue

    const regNo = col1
    const establishment = col2
    const applicant = get(3)
    const address = get(4)
    if (!regNo && !establishment && !applicant) continue

    const isFormatB = row.length >= 14
    const validity = isFormatB ? get(13) : get(11)

    rows.push({
      controlNo: regNo,
      registrationNo: regNo,
      nameOfEstablishment: establishment,
      nameOfApplicant: applicant,
      address,
      province: extractProvinceFromAddress(address) || defaultProvince,
      typeOfApplication: get(5),
      dateOfApplicationReceivedAndEvaluated: parseDate(get(6)),
      orNumber: get(7),
      orDate: parseDate(get(8)),
      amountOfFeeCollected: get(9) ? String(get(9)).replace(/,/g, '').trim() : '',
      dateOfInspection: parseDate(get(10)),
      dateOfCertification: isFormatB ? parseDate(get(11)) : '',
      transmittalDateToBAI: isFormatB ? get(12) : '',
      validity: validity || '',
    })
  }
  return rows
}

/**
 * Parse Transport Carrier paste - 14 columns:
 * No/Code, RegNo, Establishment, Applicant, Address, Type, DateApp, OR#, OR Date, Fee,
 * Date of Inspection and Monitoring, Date of Certification, Transmittal Date to BAI, Validity
 */
function parseTransportCarrierPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  function extractProvinceFromAddress(addr) {
    if (!addr || typeof addr !== 'string') return ''
    const parts = addr.split(',').map((p) => p.trim()).filter(Boolean)
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      const found = PROVINCES.find((prov) => prov.toLowerCase() === p.toLowerCase())
      if (found) return found
      if (p.toLowerCase().includes('oriental mindoro')) return 'Oriental Mindoro'
      if (p.toLowerCase().includes('occidental mindoro')) return 'Occidental Mindoro'
      if (p.toLowerCase().includes('palawan') || p.toLowerCase().includes('puerto princesa')) return 'Palawan'
      if (p.toLowerCase().includes('marinduque')) return 'Marinduque'
      if (p.toLowerCase().includes('romblon')) return 'Romblon'
    }
    return ''
  }

  const rows = []
  let inDataSection = false
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lower = line.toLowerCase()
    if (lower.includes('cy 20') || lower.includes('new application') || lower.includes('renewal application')) {
      inDataSection = false
      continue
    }
    const row = line.split(/\t/)
    const get = (idx) => (row[idx] || '').trim()
    const col1 = get(1).trim()
    const col2 = get(2).trim()

    if (col1.toLowerCase().includes('registration') && (col2.toLowerCase().includes('establishment') || col2.toLowerCase().includes('name'))) {
      inDataSection = true
      continue
    }
    if (!inDataSection) continue
    if (row.length < 13) continue
    if (!col1 && !col2 && !get(3)) continue
    if ((get(0).toLowerCase() === 'no.' || get(0).toLowerCase() === 'code') && col1.toLowerCase().includes('registration')) continue

    const regNo = col1
    const establishment = col2
    const applicant = get(3)
    const address = get(4)
    if (!regNo && !establishment && !applicant) continue

    rows.push({
      controlNo: get(0) || regNo,
      registrationNo: regNo,
      nameOfEstablishment: establishment,
      nameOfApplicant: applicant,
      address,
      province: extractProvinceFromAddress(address) || defaultProvince,
      typeOfApplication: get(5),
      dateOfApplicationReceivedAndEvaluated: parseDate(get(6)),
      orNumber: get(7),
      orDate: parseDate(get(8)),
      amountOfFeeCollected: get(9) ? String(get(9)).replace(/,/g, '').trim() : '',
      dateOfInspectionAndMonitoring: parseDate(get(10)),
      dateOfCertification: parseDate(get(11)),
      transmittalDateToBAI: get(12) || '',
      validity: get(13) || '',
    })
  }
  return rows
}

/**
 * Parse Plant Material paste - 16 columns:
 * No., Applicant, Operator, Location, Crops/Variety, Submission, Evaluation, Payment, Amount of Fee,
 * Date of inspection and evaluation of nursery, Approved validated result, Endorsement to BPI,
 * Date of inspection (1st Sem), Date of inspection (2nd Sem), Status, Validity
 */
function parsePlantMaterialPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  function extractProvinceFromLocation(loc) {
    if (!loc || typeof loc !== 'string') return ''
    const parts = loc.split(',').map((p) => p.trim()).filter(Boolean)
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i].toLowerCase()
      if (p.includes('oriental mindoro')) return 'Oriental Mindoro'
      if (p.includes('occidental mindoro')) return 'Occidental Mindoro'
      if (p.includes('palawan') || p.includes('puerto princesa')) return 'Palawan'
      if (p.includes('marinduque')) return 'Marinduque'
      if (p.includes('romblon')) return 'Romblon'
    }
    return ''
  }

  const rows = []
  let headerFound = false
  for (let i = 0; i < lines.length; i++) {
    const row = lines[i].split(/\t/)
    const get = (idx) => (row[idx] || '').trim()
    const col1 = get(1).toLowerCase()
    const col2 = get(2).toLowerCase()

    if (col1.includes('applicant') && (col2.includes('operator') || col2.includes('location'))) {
      headerFound = true
      continue
    }
    if (!headerFound && row.length < 10) continue
    if (row.length < 10) continue
    if (!get(1) && !get(2) && !get(3)) continue
    if (get(1).toLowerCase() === 'applicant') continue

    const location = get(3)
    const province = extractProvinceFromLocation(location) || defaultProvince

    rows.push({
      applicant: get(1),
      operator: get(2),
      province,
      location,
      cropsVariety: get(4),
      submissionOfApplicationForm: parseDate(get(5)) || get(5),
      evaluationOfDocumentary: parseDate(get(6)) || get(6),
      paymentOfApplicationFee: parseDate(get(7)) || get(7),
      amountOfFee: get(8) ? String(get(8)).replace(/,/g, '').trim() : '',
      dateOfInspectionAndEvaluation: parseDate(get(9)) || get(9),
      approvedValidatedResult: parseDate(get(10)) || get(10),
      endorsementToBPI: parseDate(get(11)) || get(11),
      dateOfInspection1stSem: parseDate(get(12)) || get(12),
      dateOfInspection2ndSem: parseDate(get(13)) || get(13),
      status: get(14) || 'Operational',
      validity: get(15) || '',
    })
  }
  return rows
}

/**
 * Generic TSV parser for units without custom parser. Maps columns by position to collection fields.
 * First row = header (skipped). Data columns map to COLLECTION_FIELD_ORDER[unit] (excluding rating, attachmentData).
 */
function parseGenericTsvPaste(unitId, text, defaultProvince = '') {
  const fields = COLLECTION_FIELD_ORDER[unitId]
  if (!fields || !Array.isArray(fields)) return []

  const skipFields = ['ratingQuantity', 'ratingServicesPersonnel', 'ratingTraining', 'ratingAttitude', 'ratingPromptness', 'recommendation', 'attachmentData', 'attachmentFileName']
  const dataFields = fields.filter((f) => !skipFields.includes(f))
  const dateLikeFields = ['date', 'Date', 'dateOf', 'DateOf', 'dateApplied', 'dateOfInspection', 'dateOfMonitoring', 'dateOfRequest', 'dateReceived', 'dateOfEvaluation', 'dateOfEndorsement', 'dateOfSurveillance', 'datePlanted', 'dateSubmitted', 'issuanceOf', 'validity', 'certificateValidity']

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) return []

  const rows = []
  const firstRow = lines[0].split(/\t/)
  const isHeader = firstRow.some((c) => {
    const l = (c || '').toLowerCase()
    return l.includes('applicant') || l.includes('name') || l.includes('province') || l.includes('date')
  })
  const start = isHeader ? 1 : 0

  for (let i = start; i < lines.length; i++) {
    const row = lines[i].split(/\t/)
    const obj = {}
    for (let j = 0; j < dataFields.length && j < row.length; j++) {
      let val = (row[j] || '').trim()
      const key = dataFields[j]
      if (key === 'province' && !val && defaultProvince) val = defaultProvince
      const isDateField = dateLikeFields.some((d) => key.toLowerCase().includes(d.toLowerCase()))
      if (isDateField && val) val = parseDate(val) || val
      if (key === 'fee' || key === 'amountOfFee' || key === 'amountOfFeeCollected') {
        if (val) val = String(val).replace(/,/g, '').trim()
      }
      obj[key] = val
    }
    if (Object.values(obj).some((v) => v)) rows.push(obj)
  }
  return rows
}

const UNITS_WITH_CUSTOM_PARSER = ['animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial']

export default function BulkImport() {
  const { user } = useAuth()
  const { showNotification } = useNotification()
  const [unit, setUnit] = useState('animalFeed')
  const [province, setProvince] = useState('Oriental Mindoro')
  const [startNo, setStartNo] = useState(1)
  const [pasted, setPasted] = useState('')
  const [parsed, setParsed] = useState([])
  const [loading, setLoading] = useState(false)

  const handleParse = () => {
    let rows = []
    if (unit === 'animalFeed') {
      rows = parseAnimalFeedsPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Check your paste format. Use tab-separated data from Excel/Sheets with headers.' })
    } else if (unit === 'animalWelfare') {
      rows = parseAnimalWelfarePaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Check your paste format. Use tab-separated data (NEW: 14 cols, RENEWAL: 12 cols).' })
    } else if (unit === 'livestockHandlers') {
      rows = parseLivestockHandlersPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Check your paste format. Use tab-separated data (11 or 14 cols).' })
    } else if (unit === 'transportCarrier') {
      rows = parseTransportCarrierPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Check your paste format. Use tab-separated data (14 cols).' })
    } else if (unit === 'plantMaterial') {
      rows = parsePlantMaterialPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Check your paste format. Use tab-separated data (16 cols). See PLANT_MATERIAL_FORM_BY_PROVINCE.md.' })
    } else {
      rows = parseGenericTsvPaste(unit, pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Paste tab-separated data. First row = header. Column order must match the unit\'s field order.' })
    }
    setParsed(rows)
  }

  const handleImport = async () => {
    if (parsed.length === 0) {
      showNotification({ type: 'error', title: 'No data', message: 'Parse data first.' })
      return
    }
    setLoading(true)
    let success = 0
    let failed = 0
    try {
      const colRef = collection(db, unit)
      for (const row of parsed) {
        const docData = {
          ...row,
          createdAt: new Date().toISOString(),
          createdBy: user?.uid || '',
          source: 'bulk-import',
        }
        try {
          await addDoc(colRef, docData)
          success++
        } catch (e) {
          failed++
          console.error('Failed to add doc:', e)
        }
      }
      await addSystemLog({
        action: 'bulk_import',
        userId: user?.uid,
        userEmail: user?.email,
        role: 'admin',
        details: `Bulk import: ${success} records to ${unit}, ${failed} failed.`,
      }).catch(() => {})
      showNotification({
        type: 'success',
        title: 'Import complete',
        message: `${success} record(s) added.${failed ? ` ${failed} failed.` : ''}`,
      })
      setParsed([])
      setPasted('')
    } catch (err) {
      showNotification({ type: 'error', title: 'Import failed', message: err.message || 'Could not import.' })
    }
    setLoading(false)
  }

  const inputClass =
    'w-full px-4 py-2.5 border-2 border-[#e8e0d4] rounded-xl bg-white text-[#1e4d2b] text-sm font-medium focus:ring-2 focus:ring-[#1e4d2b]/40 focus:border-[#1e4d2b] placeholder:text-[#8a857c]'
  const btnPrimary =
    'px-5 py-2.5 bg-[#1e4d2b] text-white font-bold rounded-xl hover:bg-[#153019] disabled:opacity-60 transition-all duration-300'

  return (
    <div className="space-y-6 pb-10 min-w-0 w-full max-w-full overflow-x-hidden">
      <div className="rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden">
        <div className="bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/15 border border-white/25">
                <iconify-icon icon="mdi:database-import-outline" width="28" className="text-[#d4c4a0]"></iconify-icon>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Bulk Import</h1>
                <p className="text-[11px] font-semibold text-white/85 mt-1">Import data by pasting from Excel or Google Sheet (tab-separated)</p>
              </div>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] bg-white/15 text-white border border-white/25 rounded-xl hover:bg-white/25 font-bold text-sm shrink-0"
            >
              <iconify-icon icon="mdi:arrow-left" width="18"></iconify-icon>
              Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg p-5 sm:p-6">
        <h2 className="text-base font-black text-[#1e4d2b] uppercase tracking-tight mb-4">Import options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Unit</label>
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className={inputClass}>
              {COLLECTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Default Province</label>
            <select value={province} onChange={(e) => setProvince(e.target.value)} className={inputClass}>
              <option value="">— Use from data —</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Simula sa No.</label>
            <input
              type="number"
              min={1}
              value={startNo}
              onChange={(e) => setStartNo(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className={inputClass}
              placeholder="1"
            />
            <p className="text-[10px] text-[#5c574f] mt-1">Kung batch 2, ilagay 13 para magsimula sa 13.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg p-5 sm:p-6">
        <h2 className="text-base font-black text-[#1e4d2b] uppercase tracking-tight mb-2">Paste data</h2>
        <p className="text-xs text-[#5c574f] mb-3">
          {unit === 'animalFeed' && 'Copy from Excel or Google Sheet (with headers). Tab-separated. Animal Feeds: No., Registration No., Date of Application, Name of Establishment, Last Name, First Name, Middle Initial, Barangay, Municipality, Province, With License-to-Operate, With Mayor\'s Permit, Type, New/Renewal, LTO Number, OR Number, OR Date, Fees Collected, Date of Inspection and Monitoring, Date of Monitoring, Feed Sampling dates, No. of Feed Samples, Date of Issuance of LTO, Validity.'}
          {unit === 'animalWelfare' && 'Copy from Excel or Google Sheet (with headers). Tab-separated. Animal Welfare NEW (14 cols): No., Registration No., Name of Facility, Owner, Complete Business Address, Type of Facility, Date of Application, Date of Inspection, OR Number, OR Date, Amount of Fee Collected, Endorsement to BAI, Registration Date, Validity. RENEWAL (12 cols): same but without Endorsement to BAI.'}
          {unit === 'livestockHandlers' && 'Copy from Excel or Google Sheet (with headers). Tab-separated. Livestock Handlers: No., Registration No., Name of Establishment, Name of Applicant, Address, Type of Application, Date of Application, OR Number, OR Date, Amount of Fee Collected, Date of Inspection, Validity. (2nd Sem adds: Date of Certification, Transmittal Date to BAI.) Paste BY PROVINCE.'}
          {unit === 'transportCarrier' && 'Copy from Excel or Google Sheet (with headers). Tab-separated. Transport Carrier (14 cols): No., Registration No., Name of Establishment, Name of Applicant, Address, Type of Application, Date of Application, OR Number, OR Date, Amount of Fee Collected, Date of Inspection and Monitoring, Date of Certification, Transmittal Date to BAI, Validity. Paste BY PROVINCE.'}
          {unit === 'plantMaterial' && 'Copy from Excel or Google Sheet (with headers). Tab-separated. Plant Material (16 cols): No., Applicant, Operator, Location, Crops/Variety, Submission of Application Form, Evaluation of Documentary, Payment of Application Fee, Amount of Fee, Date of inspection and evaluation of nursery, Approved validated result, Endorsement to BPI, Date of inspection (1st Sem), Date of inspection (2nd Sem), Status, Validity. See PLANT_MATERIAL_FORM_BY_PROVINCE.md.'}
          {!UNITS_WITH_CUSTOM_PARSER.includes(unit) && 'Copy from Excel or Google Sheet. Tab-separated. First row = header. Column order must match the unit\'s field order (see View Records for field names). Default Province applies if not in data.'}
        </p>
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder="Paste your data here..."
          className={`${inputClass} min-h-[220px] font-mono text-xs`}
        />
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" onClick={handleParse} className={btnPrimary}>
            Parse data
          </button>
        </div>
      </div>

      {parsed.length > 0 && (
        <div className="rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#b8a066] to-[#8f7a45] px-5 py-3">
            <h2 className="text-base font-black text-white uppercase tracking-tight">Preview — {parsed.length} row(s) parsed</h2>
            <p className="text-[11px] text-white/90 mt-0.5">Review before importing. Data will be saved to Firestore.</p>
          </div>
          <div className="overflow-x-auto max-h-[500px] overflow-y-auto p-4">
            {unit === 'plantMaterial' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Operator</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Status</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.applicant || '—'}</td>
                      <td className="px-2 py-1.5">{r.operator || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[220px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.status || '—'}</td>
                      <td className="px-2 py-1.5">{r.validity || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'transportCarrier' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Registration No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Establishment</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Address</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">OR No</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Fee</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.registrationNo || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfEstablishment || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfApplicant || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[200px] truncate">{r.address || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.orNumber || '—'}</td>
                      <td className="px-2 py-1.5">{r.amountOfFeeCollected || '—'}</td>
                      <td className="px-2 py-1.5">{r.validity || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'livestockHandlers' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Registration No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Establishment</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Address</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">OR No</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Fee</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.registrationNo || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfEstablishment || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfApplicant || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[200px] truncate">{r.address || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.orNumber || '—'}</td>
                      <td className="px-2 py-1.5">{r.amountOfFeeCollected || '—'}</td>
                      <td className="px-2 py-1.5">{r.validity || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'animalWelfare' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1200px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Registration No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Facility</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Owner</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Address</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Type</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date Applied</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Inspection</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">OR No</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Fee</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.certificateNo || '—'}</td>
                      <td className="px-2 py-1.5">{r.facilityName || '—'}</td>
                      <td className="px-2 py-1.5">{r.ownerName || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[200px] truncate">{r.address || '—'}</td>
                      <td className="px-2 py-1.5">{r.facilityType || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateApplied ? new Date(r.dateApplied).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfInspection ? new Date(r.dateOfInspection).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5">{r.orNo || '—'}</td>
                      <td className="px-2 py-1.5">{r.fee || '—'}</td>
                      <td className="px-2 py-1.5">{r.validityDate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : !UNITS_WITH_CUSTOM_PARSER.includes(unit) && parsed.length > 0 ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '800px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    {Object.keys(parsed[0]).slice(0, 10).map((k) => (
                      <th key={k} className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">{k}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      {Object.keys(parsed[0]).slice(0, 10).map((k) => (
                        <td key={k} className="px-2 py-1.5 max-w-[180px] truncate">{String(r[k] ?? '—')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1600px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Registration No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Application</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Establishment</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Last Name</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">First Name</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Middle Initial</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Barangay</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Municipality</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">With LTO</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">With Mayor's Permit</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Type</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">New/Renewal</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">LTO Number</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">OR Number</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">OR Date</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Fees Collected</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Inspection</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Monitoring</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Feed Sample (1st)</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Feed Sample (2nd)</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No. Samples (1st)</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No. Samples (2nd)</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Issuance</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.registrationNo || '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.date ? new Date(r.date).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5">{r.companyName || '—'}</td>
                      <td className="px-2 py-1.5">{r.lastName || '—'}</td>
                      <td className="px-2 py-1.5">{r.firstName || '—'}</td>
                      <td className="px-2 py-1.5">{r.middleName || '—'}</td>
                      <td className="px-2 py-1.5">{r.barangay || '—'}</td>
                      <td className="px-2 py-1.5">{r.municipality || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.withLicenseToOperate || '—'}</td>
                      <td className="px-2 py-1.5">{r.withMayorsPermit || '—'}</td>
                      <td className="px-2 py-1.5">{r.type || '—'}</td>
                      <td className="px-2 py-1.5">{r.newRenewal || '—'}</td>
                      <td className="px-2 py-1.5">{r.controlNo || '—'}</td>
                      <td className="px-2 py-1.5">{r.orNo || '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.orDate ? new Date(r.orDate).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5">{r.fee || '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfInspection ? new Date(r.dateOfInspection).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfMonitoring ? new Date(r.dateOfMonitoring).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfFeedSampling1stSem ? new Date(r.dateOfFeedSampling1stSem).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfFeedSampling2ndSem ? new Date(r.dateOfFeedSampling2ndSem).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5">{r.noOfFeedSamples1stSem || '—'}</td>
                      <td className="px-2 py-1.5">{r.noOfFeedSamples2ndSem || '—'}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateIssued ? new Date(r.dateIssued).toLocaleDateString('en-PH') : '—'}</td>
                      <td className="px-2 py-1.5">{r.validity || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="p-4 border-t-2 border-[#e8e0d4] flex flex-wrap gap-3 items-center">
            <button type="button" onClick={handleImport} disabled={loading} className={`${btnPrimary} min-h-[44px]`}>
              {loading ? 'Importing...' : `Import ${parsed.length} record(s)`}
            </button>
            <button
              type="button"
              onClick={() => { setParsed([]); setPasted('') }}
              className="px-5 py-2.5 border-2 border-[#e8e0d4] text-[#5c574f] font-bold rounded-xl hover:bg-[#f5f0e8] transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
