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
 * Parse Organic Agri paste - 14 columns (from ORGANIC_AGRI_BY_PROVINCE.md).
 * Columns: No., Application, Name of Group, Name of Applicant, Location, Area, Date of Evaluation, Remarks,
 * Date of Endorsement, Final Inspection/Accreditation, Status, Issuance of Certificate, Remarks, Link File.
 * Skips ## headings, ```, and header row. Carries over Application/Name of Group on sub-rows.
 */
function parseOrganicAgriPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
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
  let lastApplication = ''
  let lastNameOfGroup = ''
  let headerFound = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (line.startsWith('##') || line.startsWith('```')) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)
    const col3 = get(3)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('application') || col2.toLowerCase().includes('group'))) {
      headerFound = true
      continue
    }
    if (!headerFound && row.length < 5) continue
    if (row.length < 5) continue
    if (!col3 && !col2 && !col1) continue
    if (col3.toLowerCase() === 'name of applicant' || col2.toLowerCase() === 'name of group') continue

    const application = col1 || lastApplication
    const nameOfGroup = col2 || lastNameOfGroup
    const nameOfApplicant = col3
    if (!nameOfApplicant) continue

    if (application) lastApplication = application
    if (nameOfGroup) lastNameOfGroup = nameOfGroup

    const location = get(4)
    const province = extractProvinceFromLocation(location) || defaultProvince

    rows.push({
      application: application || '',
      nameOfGroup: nameOfGroup || '',
      nameOfApplicant,
      province,
      location,
      area: get(5) || '',
      dateOfEvaluation: parseDate(get(6)) || get(6),
      remarks: get(7) || '',
      dateOfEndorsement: parseDate(get(8)) || get(8),
      finalInspection: get(9) || '',
      status: get(10) || '',
      issuanceOfCertificate: get(11) || '',
      finalRemarks: get(12) || '',
      linkFile: get(13) || '',
    })
  }
  return rows
}

/**
 * Parse GAP Certification Form paste (Good Agri Practices - first form). 11 columns from GAP_CERTIFICATION_BY_PROVINCE.md.
 * Columns: No., Date of Request, Name of Applicant, Location, Area (ha), Crop, Date of Pre-assessment, Remarks,
 * Date of Endorsement to BPI, Date of Final Inspection, Status.
 * Skips ##, ```, blank lines, and "CY 20XX - FIRST/SECOND SEMESTER" lines. Sets formType: 'gapCertification'.
 */
function parseGoodAgriPracticesGapPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function extractProvinceFromLocation(loc) {
    if (!loc || typeof loc !== 'string') return ''
    const lower = loc.toLowerCase()
    if (lower.includes('oriental mindoro')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro') || lower.includes('occ. mindoro')) return 'Occidental Mindoro'
    if (lower.includes('palawan') || lower.includes('puerto princesa') || lower.includes('narra')) return 'Palawan'
    if (lower.includes('marinduque')) return 'Marinduque'
    if (lower.includes('romblon')) return 'Romblon'
    return ''
  }

  const rows = []
  let headerFound = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (line.startsWith('##') || line.startsWith('```')) continue
    if (/^CY\s+\d{4}\s*-/i.test(line) || /SEMESTER\s*$/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('date') || col2.toLowerCase().includes('applicant'))) {
      headerFound = true
      continue
    }
    if (row.length < 5) continue
    if (!col2) continue
    if (col2.toLowerCase() === 'name of applicant') continue

    const province = extractProvinceFromLocation(get(3)) || defaultProvince

    rows.push({
      formType: 'gapCertification',
      controlNo: col0 || '',
      dateOfRequest: parseDate(col1) || col1,
      nameOfApplicant: col2,
      location: get(3),
      province,
      area: get(4) || '',
      crop: get(5) || '',
      dateOfPreAssessment: parseDate(get(6)) || get(6),
      remarks: get(7) || '',
      dateOfEndorsementToBPI: parseDate(get(8)) || get(8),
      dateOfFinalInspection: get(9) || '',
      status: get(10) || '',
    })
  }
  return rows
}

/**
 * Parse Monitoring of GAP Certified Farmer paste (Good Agri Practices - second form). 8 columns from GAP_MONITORING_BY_PROVINCE.md.
 * Columns: No., Date of Monitoring, Name of Farmer, Location, Area (ha), Certificate Number, Certificate Validity, Remarks.
 * Skips ##, ```, blank lines, and "CY 20XX - FIRST/SECOND SEMESTER" lines. Sets formType: 'monitoring'.
 */
function parseGoodAgriPracticesMonitoringPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function extractProvinceFromLocation(loc) {
    if (!loc || typeof loc !== 'string') return ''
    const lower = loc.toLowerCase()
    if (lower.includes('oriental mindoro') || lower.includes('or. mindoro')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro') || lower.includes('occ. mdo') || lower.includes('occ.mdo')) return 'Occidental Mindoro'
    if (lower.includes('palawan') || lower.includes('puerto princesa') || lower.includes('narra')) return 'Palawan'
    if (lower.includes('marinduque')) return 'Marinduque'
    if (lower.includes('romblon')) return 'Romblon'
    return ''
  }

  const rows = []
  let headerFound = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (line.startsWith('##') || line.startsWith('```')) continue
    if (/^CY\s+\d{4}\s*-/i.test(line) || /SEMESTER\s*$/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('date of monitoring') || col2.toLowerCase().includes('farmer'))) {
      headerFound = true
      continue
    }
    if (row.length < 5) continue
    if (!col2) continue
    if (col2.toLowerCase() === 'name of farmer') continue

    const province = extractProvinceFromLocation(get(3)) || defaultProvince

    rows.push({
      formType: 'monitoring',
      controlNo: col0 || '',
      dateOfMonitoring: parseDate(col1) || col1,
      nameOfFarmer: col2,
      location: get(3),
      province,
      area: get(4) || '',
      certificateNumber: get(5) || '',
      certificateValidity: parseDate(get(6)) || get(6),
      remarks: get(7) || '',
    })
  }
  return rows
}

/**
 * Parse Organic Post-Market Surveillance paste. Columns: No., Request Letter (Date), Identified Market Outlet,
 * Date of Communication Letter, Date of Surveillance, Product Brand, Commodity, Certification, Name of Owner/Manager,
 * Location, Area, Date of Evaluation, Remarks, Final Inspection, Status, Issuance of Certificate.
 * Skips ##, ```, blank, "FY 2024", "FY 2025 FIRST/SECOND SEMESTER". Carries over establishment fields on product sub-rows.
 */
function parseOrganicPostMarketPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function extractProvinceFromLocation(loc) {
    if (!loc || typeof loc !== 'string') return ''
    const lower = loc.toLowerCase()
    if (lower.includes('oriental mindoro') || lower.includes('or. mindoro') || lower.includes('calapan') || lower.includes('bongabong') || lower.includes('naujan') || lower.includes('puerto galera')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro') || lower.includes('occ. mindoro') || lower.includes('occidnetal') || lower.includes('magsaysay') || (lower.includes('san jose') && !lower.includes('oriental'))) return 'Occidental Mindoro'
    if (lower.includes('palawan') || lower.includes('ppc')) return 'Palawan'
    return ''
  }

  const rows = []
  let last = {
    requestLetterDate: '',
    identifiedMarketOutlet: '',
    dateOfCommunicationLetter: '',
    dateOfSurveillance: '',
    nameOfOwnerManager: '',
    location: '',
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (line.startsWith('##') || line.startsWith('```')) continue
    if (/^FY\s+\d{4}/i.test(line) || /FIRST SEMESTER/i.test(line) || /SECOND SEMESTER/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col1 = get(1)
    const col2 = get(2)
    const col3 = get(3)
    const col4 = get(4)
    const col5 = get(5)
    const col6 = get(6)
    const col7 = get(7)
    const col8 = get(8)
    const col9 = get(9)
    const col12 = get(12)

    if (get(0).toLowerCase() === 'no.' && (col1.toLowerCase().includes('request') || col2.toLowerCase().includes('market') || col2.toLowerCase().includes('establishment'))) continue
    if (row.length < 3) continue

    const requestLetterDate = col1 || last.requestLetterDate
    const identifiedMarketOutlet = col2 || last.identifiedMarketOutlet
    const dateOfCommunicationLetter = col3 || last.dateOfCommunicationLetter
    const dateOfSurveillance = col4 || last.dateOfSurveillance
    const nameOfOwnerManager = col8 || last.nameOfOwnerManager
    const location = col9 || last.location

    if (!identifiedMarketOutlet && !nameOfOwnerManager && !location && !col5 && !col6 && !col7) continue

    if (requestLetterDate) last.requestLetterDate = requestLetterDate
    if (identifiedMarketOutlet) last.identifiedMarketOutlet = identifiedMarketOutlet
    if (dateOfCommunicationLetter) last.dateOfCommunicationLetter = dateOfCommunicationLetter
    if (dateOfSurveillance) last.dateOfSurveillance = dateOfSurveillance
    if (nameOfOwnerManager) last.nameOfOwnerManager = nameOfOwnerManager
    if (location) last.location = location

    const province = extractProvinceFromLocation(location) || defaultProvince

    rows.push({
      requestLetterDate: parseDate(requestLetterDate) || requestLetterDate,
      identifiedMarketOutlet: identifiedMarketOutlet || '',
      dateOfCommunicationLetter: parseDate(dateOfCommunicationLetter) || dateOfCommunicationLetter,
      nameOfProduct: col5 || '',
      commodity: col6 || '',
      certification: col7 || '',
      nameOfOwnerManager: nameOfOwnerManager || '',
      province,
      location: location || '',
      dateOfSurveillance: parseDate(dateOfSurveillance) || dateOfSurveillance,
      remarks: col12 || '',
      linkFile: '',
    })
  }
  return rows
}

/**
 * Parse Land Use Matter (Land Use Concern) paste. 14 columns from LAND_USE_BY_PROVINCE.md.
 * Columns: No., Control No., Name of Applicant, Purpose of Application, Size of Area (ha), Location,
 * Date of Request, Date Received and Evaluated, Date of Reply to the Request, Date Received by the Applicant,
 * Field Investigation, Date of Endorsement, Issuance of Certificate, Remarks.
 * Skips ##, ```, blank, "CY 2024", "CY 2025". Date cells may contain "(through messenger)" etc. — first line used for parseDate.
 */
function parseLandUseMatterPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function firstLineDate(val) {
    const s = String(val || '').split(/\r?\n/)[0].trim()
    return parseDate(s) || s
  }

  function extractProvinceFromLocation(loc) {
    if (!loc || typeof loc !== 'string') return ''
    const lower = loc.toLowerCase()
    if (lower.includes('marinduque')) return 'Marinduque'
    if (lower.includes('oriental mindoro') || lower.includes('victoria')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro')) return 'Occidental Mindoro'
    if (lower.includes('palawan')) return 'Palawan'
    if (lower.includes('romblon')) return 'Romblon'
    return ''
  }

  const rows = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (line.startsWith('##') || line.startsWith('```')) continue
    if (/^CY\s+\d{4}/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('control') || col2.toLowerCase().includes('applicant'))) continue
    if (row.length < 6) continue
    if (!col2) continue
    if (col2.toLowerCase() === 'name of applicant') continue

    const location = get(5)
    const province = extractProvinceFromLocation(location) || defaultProvince

    rows.push({
      controlNo: col1 || '',
      nameOfApplicant: col2 || '',
      purposeOfApplication: get(3) || '',
      sizeOfArea: get(4) || '',
      province,
      location,
      dateOfRequest: firstLineDate(get(6)),
      dateReceivedAndEvaluated: firstLineDate(get(7)),
      dateOfReplyToRequest: firstLineDate(get(8)),
      dateReceivedByApplicant: firstLineDate(get(9)),
      fieldInvestigation: get(10) || '',
      dateOfEndorsement: firstLineDate(get(11)),
      issuanceOfCertificate: get(12) || '',
      remarks: get(13) || '',
    })
  }
  return rows
}

/**
 * Parse SAFDZ Validation paste. 16 columns from SAFDZ_VALIDATION_BY_PROVINCE.md.
 * Columns: No., Exploration Permit Application No., Name of Applicant, Date Received, Location, Area (ha),
 * Date of Reply to the Request, Endorsement to BSWM, Endorsement to MGB, Field Validation, Remarks,
 * Rescheduled date, Field Validation Report, Issuance of Certificate and Endorsement to MGB, Status, Findings.
 * Skips ##, ```, blank, "CY 2024", "CY 2025". Carries over application no., name, location, area on sub-rows.
 */
function parseSafdzValidationPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function firstLineDate(val) {
    const s = String(val || '').split(/\r?\n/)[0].trim()
    return parseDate(s) || s
  }

  function extractProvinceFromLocation(loc) {
    if (!loc || typeof loc !== 'string') return ''
    const lower = loc.toLowerCase()
    if (lower.includes('palawan')) return 'Palawan'
    if (lower.includes('marinduque')) return 'Marinduque'
    if (lower.includes('oriental mindoro')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro')) return 'Occidental Mindoro'
    if (lower.includes('romblon')) return 'Romblon'
    return ''
  }

  const rows = []
  let last = { explorationPermitApplicationNo: '', nameOfApplicant: '', location: '', area: '' }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (line.startsWith('##') || line.startsWith('```')) continue
    if (/^CY\s+\d{4}/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)
    const col4 = get(4)
    const col5 = get(5)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('exploration') || col2.toLowerCase().includes('applicant'))) continue
    if (row.length < 6) continue
    if (col2.toLowerCase() === 'name of applicant') continue

    const explorationPermitApplicationNo = col1 || last.explorationPermitApplicationNo
    const nameOfApplicant = col2 || last.nameOfApplicant
    const location = col4 || last.location
    const area = col5 || last.area

    if (!explorationPermitApplicationNo && !nameOfApplicant && !location && !get(3)) continue

    if (col1) last.explorationPermitApplicationNo = col1
    if (col2) last.nameOfApplicant = col2
    if (col4) last.location = col4
    if (col5) last.area = col5

    const province = extractProvinceFromLocation(location) || defaultProvince
    const areaStr = area ? String(area).replace(/,/g, '').trim() : ''

    rows.push({
      explorationPermitApplicationNo: explorationPermitApplicationNo || '',
      nameOfApplicant: nameOfApplicant || '',
      dateReceived: firstLineDate(get(3)),
      province,
      location: location || '',
      area: areaStr,
      dateOfReplyToRequest: firstLineDate(get(6)),
      endorsementToBSWM: get(7) || '',
      endorsementToMGB: get(8) || '',
      fieldValidation: get(9) || '',
      remarks: get(10) || '',
      rescheduledDate: firstLineDate(get(11)),
      fieldValidationReport: get(12) || '',
      issuanceOfCertificateAndEndorsementToMGB: get(13) || '',
      status: get(14) || '',
      findings: get(15) || '',
    })
  }
  return rows
}

/**
 * Parse Plant Pest Surveillance paste. 13 columns. Header may be "Date of Request and Collection" or "Date of Collection".
 * Province from section header. Carries over farmerName, date, and address on sub-rows so walang kulang.
 */
function parsePlantPestSurveillancePaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  const PROVINCE_NAMES = ['ORIENTAL MINDORO', 'OCCIDENTAL MINDORO', 'ROMBLON', 'PALAWAN', 'MARINDUQUE']
  const PROVINCE_DISPLAY = { 'ORIENTAL MINDORO': 'Oriental Mindoro', 'OCCIDENTAL MINDORO': 'Occidental Mindoro', ROMBLON: 'Romblon', PALAWAN: 'Palawan', MARINDUQUE: 'Marinduque' }
  function getProvinceFromLine(line) {
    const upper = line.toUpperCase().trim().replace(/\s+/g, ' ')
    for (const p of PROVINCE_NAMES) {
      if (upper === p || upper.startsWith(p + ' ') || upper === p.replace(/\s+/g, '')) return PROVINCE_DISPLAY[p] || p
    }
    return ''
  }

  function firstLine(val) {
    return String(val || '').split(/\r?\n/)[0].trim()
  }

  const rows = []
  let currentProvince = defaultProvince
  let lastFarmerName = ''
  let lastDate = ''
  let lastAddress = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    const provFromLine = getProvinceFromLine(line)
    if (provFromLine) {
      currentProvince = provFromLine
      continue
    }
    if (/^CY\s+\d{4}/i.test(line) || /FIRST SEMESTER/i.test(line) || /SECOND SEMESTER/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)

    if (col0.toLowerCase().includes('date of') && (col1.toLowerCase().includes('farmer') || col1.toLowerCase().includes('name of'))) continue
    if (col2.toLowerCase() === 'address' || col1.toLowerCase() === 'name of farmer') continue

    const farmerName = col1 || lastFarmerName
    const address = col2 || lastAddress
    const dateVal = firstLine(col0) || lastDate
    if (col1) lastFarmerName = col1
    if (col2) lastAddress = col2
    if (firstLine(col0)) lastDate = firstLine(col0)

    if (!farmerName && !address && !get(5)) continue

    const province = currentProvince || defaultProvince

    rows.push({
      dateOfRequestAndCollection: dateVal ? (parseDate(dateVal) || dateVal) : '',
      farmerName: farmerName || '',
      province,
      address: address || '',
      contactNumber: get(3) || '',
      gpsLocation: get(4) || '',
      crop: get(5) || '',
      variety: get(6) || '',
      datePlanted: firstLine(get(7)) ? (parseDate(firstLine(get(7))) || firstLine(get(7))) : get(7),
      areaPlanted: get(8) ? String(get(8)).replace(/,/g, '').trim() : '',
      areaAffected: get(9) || '',
      percentInfestation: get(10) || '',
      pestsDiseases: get(11) || '',
      remarks: get(12) || '',
    })
  }
  return rows
}

/**
 * Parse CFS/ADMCC paste. 11 data columns (No. + 10). Columns: Name of LGU/Client/Farm, Type of Disease Surveillance,
 * Purpose, Address, Date of Request, Date of Surveillance (Blood Collection), Number of Samples, Date Submitted to Lab,
 * Date of Endorsement to DA-BAI, Remarks. Province extracted from Address. Skips section headers (2024 ANIMAL DISEASE, FIRST SEM, etc.).
 */
function parseCfsAdmccPaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function firstLine(val) {
    return String(val || '').split(/\r?\n/)[0].trim()
  }

  function extractProvinceFromAddress(addr) {
    if (!addr || typeof addr !== 'string') return ''
    const lower = addr.toLowerCase()
    if (lower.includes('oriental mindoro')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro')) return 'Occidental Mindoro'
    if (lower.includes('romblon')) return 'Romblon'
    if (lower.includes('palawan')) return 'Palawan'
    if (lower.includes('marinduque')) return 'Marinduque'
    return ''
  }

  const rows = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (/2024\s+ANIMAL\s+DISEASE/i.test(line) || /^FIRST\s+SEM/i.test(line) || /^SECOND\s+SEM/i.test(line) || /AVIAN\s+INFLUENZA\s+SURVEILLANCE/i.test(line) || /FIRST\s+SEMESTER/i.test(line) || /SECOND\s+SEMESTER/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col4 = get(4)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('name of') || col1.toLowerCase().includes('local government'))) continue
    if (col0.toLowerCase().includes('blood collection') || col1.toLowerCase().includes('number of samples collected')) continue
    if (row.length < 6) continue
    if (!col1 && !col4) continue

    const address = get(4)
    const province = extractProvinceFromAddress(address) || defaultProvince

    rows.push({
      clientName: col1 || '',
      typeOfDiseaseSurveillance: get(2) || '',
      purpose: get(3) || '',
      province,
      address: address || '',
      dateOfRequest: firstLine(get(5)) ? (parseDate(firstLine(get(5))) || firstLine(get(5))) : '',
      dateOfSurveillance: firstLine(get(6)) ? (parseDate(firstLine(get(6))) || firstLine(get(6))) : get(6),
      numberOfSamples: get(7) ? String(get(7)).replace(/,/g, '').trim() : '',
      dateSubmittedToLab: firstLine(get(8)) ? (parseDate(firstLine(get(8))) || firstLine(get(8))) : get(8),
      dateOfEndorsementToDA: firstLine(get(9)) ? (parseDate(firstLine(get(9))) || firstLine(get(9))) : get(9),
      remarks: get(10) || '',
    })
  }
  return rows
}

/**
 * Parse Animal Disease Surveillance paste. Same 11 data columns as CFS/ADMCC. Skips "CY 2024", "FIRST SEMESTER", "SECOND SEMESTER", header row, and "(Blood Collection)" continuation. Province from Address; normalizes "Occidenatal" to Occidental Mindoro.
 */
function parseAnimalDiseaseSurveillancePaste(text, defaultProvince = '') {
  const lines = text.split(/\r?\n/).map((l) => l.trim())
  if (lines.length < 2) return []

  function firstLine(val) {
    return String(val || '').split(/\r?\n/)[0].trim()
  }

  function extractProvinceFromAddress(addr) {
    if (!addr || typeof addr !== 'string') return ''
    const lower = addr.toLowerCase()
    if (lower.includes('oriental mindoro')) return 'Oriental Mindoro'
    if (lower.includes('occidental mindoro') || lower.includes('occidenatal mindoro')) return 'Occidental Mindoro'
    if (lower.includes('romblon')) return 'Romblon'
    if (lower.includes('palawan')) return 'Palawan'
    if (lower.includes('marinduque')) return 'Marinduque'
    return ''
  }

  const rows = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue
    if (/CY\s+\d{4}/i.test(line) || /^FIRST\s+SEMESTER/i.test(line) || /^SECOND\s+SEMESTER/i.test(line)) continue

    const row = line.split(/\t/)
    const get = (idx) => (row[idx] !== undefined && row[idx] !== null ? String(row[idx]).trim() : '')

    const col0 = get(0)
    const col1 = get(1)
    const col2 = get(2)
    const col4 = get(4)

    if (col0.toLowerCase() === 'no.' && (col1.toLowerCase().includes('name of') || col1.toLowerCase().includes('local government') || (col2 && col2.toLowerCase().includes('african swine')))) continue
    if (col0.toLowerCase().includes('blood collection') || col1.toLowerCase().includes('number of samples collected')) continue
    if (row.length < 6) continue
    if (!col1 && !col4) continue

    const address = get(4)
    const province = extractProvinceFromAddress(address) || defaultProvince

    rows.push({
      clientName: col1 || '',
      typeOfDiseaseSurveillance: get(2) || '',
      purpose: get(3) || '',
      province,
      address: address || '',
      dateOfRequest: firstLine(get(5)) ? (parseDate(firstLine(get(5))) || firstLine(get(5))) : '',
      dateOfSurveillance: firstLine(get(6)) ? (parseDate(firstLine(get(6))) || firstLine(get(6))) : get(6),
      numberOfSamples: get(7) ? String(get(7)).replace(/,/g, '').trim() : '',
      dateSubmittedToLab: firstLine(get(8)) ? (parseDate(firstLine(get(8))) || firstLine(get(8))) : get(8),
      dateOfEndorsementToDA: firstLine(get(9)) ? (parseDate(firstLine(get(9))) || firstLine(get(9))) : get(9),
      remarks: get(10) || '',
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

const UNITS_WITH_CUSTOM_PARSER = ['animalFeed', 'animalWelfare', 'livestockHandlers', 'transportCarrier', 'plantMaterial', 'organicAgri', 'goodAgriPractices', 'organicPostMarket', 'landUseMatter', 'safdzValidation', 'plantPestSurveillance', 'cfsAdmcc', 'animalDiseaseSurveillance']

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
    } else if (unit === 'organicAgri') {
      rows = parseOrganicAgriPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Check your paste format. Use tab-separated data (14 cols). Pwede i-paste buong block mula sa ORGANIC_AGRI_BY_PROVINCE.md (kasama ## at header).' })
    } else if (unit === 'goodAgriPractices') {
      const isMonitoring = /Date of Monitoring/i.test(pasted) && /Name of Farmer/i.test(pasted)
      rows = isMonitoring ? parseGoodAgriPracticesMonitoringPaste(pasted, province) : parseGoodAgriPracticesGapPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: isMonitoring ? 'Monitoring form: 8 cols. Pwede i-paste buong block mula sa GAP_MONITORING_BY_PROVINCE.md.' : 'GAP Certification form: 11 cols. Pwede i-paste buong block mula sa GAP_CERTIFICATION_BY_PROVINCE.md (kasama ## at header).' })
    } else if (unit === 'organicPostMarket') {
      rows = parseOrganicPostMarketPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Organic Post-Market: 16 cols. Pwede i-paste buong block mula sa ORGANIC_POST_MARKET_BY_PROVINCE.md (kasama ## at header). Sub-rows carry over establishment.' })
    } else if (unit === 'landUseMatter') {
      rows = parseLandUseMatterPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Land Use Matter: 14 cols. Pwede i-paste buong block mula sa LAND_USE_BY_PROVINCE.md (kasama ## at header).' })
    } else if (unit === 'safdzValidation') {
      rows = parseSafdzValidationPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'SAFDZ Validation: 16 cols. Pwede i-paste buong block mula sa SAFDZ_VALIDATION_BY_PROVINCE.md (kasama ## at header). Sub-rows carry over application.' })
    } else if (unit === 'plantPestSurveillance') {
      rows = parsePlantPestSurveillancePaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Plant Pest Surveillance: 13 cols. Pwede i-paste buong block mula sa PLANT_PEST_SURVEILLANCE_BY_PROVINCE.md. Lagay province name (ORIENTAL MINDORO, etc.) bago ang table para ma-detect ang province.' })
    } else if (unit === 'cfsAdmcc') {
      rows = parseCfsAdmccPaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'CFS/ADMCC: 11 cols (No., Name of LGU/Client/Farm, Type of Disease Surveillance, Purpose, Address, Date of Request, Date of Surveillance, No. of Samples, Date Submitted to Lab, Date of Endorsement to DA-BAI, Remarks). Province from Address. Pwede i-paste mula sa CFSADMCC_BY_PROVINCE.md.' })
    } else if (unit === 'animalDiseaseSurveillance') {
      rows = parseAnimalDiseaseSurveillancePaste(pasted, province)
      if (rows.length === 0) showNotification({ type: 'warning', title: 'No data parsed', message: 'Animal Disease Surveillance: 11 cols (No., Name of LGU/Client/Farm, Type of Disease Surveillance, Purpose, Address, Date of Request, Date of Surveillance, No. of Samples, Date Submitted to Lab, Date of Endorsement to DA-BAI, Remarks). Province from Address. Pwede i-paste buong block mula sa ANIMAL_DISEASE_SURVEILLANCE_BY_PROVINCE.md o ANIMAL_DISEASE_SURVEILLANCE_FULL_DATA.txt.' })
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
          {unit === 'organicAgri' && 'Pwede i-paste ang buong block mula sa ORGANIC_AGRI_BY_PROVINCE.md (kasama ang ## 1. PALAWAN at header row). Tab-separated, 14 cols: No., Application, Name of Group, Name of Applicant, Location, Area, Date of Evaluation, Remarks, Date of Endorsement, Final Inspection/Accreditation, Status, Issuance of Certificate, Remarks, Link File.'}
          {unit === 'goodAgriPractices' && 'Dalawang form: (1) GAP Certification — GAP_CERTIFICATION_BY_PROVINCE.md, 11 cols: No., Date of Request, Name of Applicant, Location, Area, Crop, Date of Pre-assessment, Remarks, Date of Endorsement to BPI, Date of Final Inspection, Status. (2) Monitoring of GAP Certified Farmer — GAP_MONITORING_BY_PROVINCE.md, 8 cols: No., Date of Monitoring, Name of Farmer, Location, Area, Certificate Number, Certificate Validity, Remarks. Auto-detect mula sa header.'}
          {unit === 'organicPostMarket' && 'Organic Post-Market Surveillance. Pwede i-paste buong block mula sa ORGANIC_POST_MARKET_BY_PROVINCE.md (kasama ## at header). 16 cols: No., Request Letter (Date), Identified Market Outlet, Date of Communication Letter, Date of Surveillance, Product Brand, Commodity, Certification, Name of Owner/Manager, Location, Area, Date of Evaluation, Remarks, Final Inspection, Status, Issuance of Certificate. Sub-rows carry over establishment.'}
          {unit === 'landUseMatter' && 'Land Use Concern. Pwede i-paste buong block mula sa LAND_USE_BY_PROVINCE.md (kasama ## at header). 14 cols: No., Control No., Name of Applicant, Purpose of Application, Size of Area (ha), Location, Date of Request, Date Received and Evaluated, Date of Reply to the Request, Date Received by the Applicant, Field Investigation, Date of Endorsement, Issuance of Certificate, Remarks.'}
          {unit === 'safdzValidation' && 'SAFDZ Validation. Pwede i-paste buong block mula sa SAFDZ_VALIDATION_BY_PROVINCE.md (kasama ## at header). 16 cols: No., Exploration Permit Application No., Name of Applicant, Date Received, Location, Area (ha), Date of Reply to the Request, Endorsement to BSWM, Endorsement to MGB, Field Validation, Remarks, Rescheduled date, Field Validation Report, Issuance of Certificate and Endorsement to MGB, Status, Findings. Sub-rows carry over application.'}
          {unit === 'plantPestSurveillance' && 'Plant Pest Surveillance. 13 cols: Date of Request/Collection, Name of Farmer, Address, Contact Number, GPS Location, Crop, Variety, Date Planted, Area Planted, Area Affected, Percent Infestation, Pests/Diseases, Remarks. Lagay province name (ORIENTAL MINDORO, OCCIDENTAL MINDORO, ROMBLON, PALAWAN, MARINDUQUE) sa sariling line bago ang table. Pwede i-paste mula sa PLANT_PEST_SURVEILLANCE_BY_PROVINCE.md.'}
          {unit === 'cfsAdmcc' && 'CFS/ADMCC. 11 cols: No., Name of LGU/Client/Farm, Type of Disease Surveillance, Purpose, Address, Date of Request, Date of Surveillance (Blood Collection), No. of Samples, Date Submitted to Lab, Date of Endorsement to DA-BAI, Remarks. Province auto from Address. Pwede i-paste buong block (ASF/AI, First Sem/Second Sem) mula sa CFSADMCC_BY_PROVINCE.md.'}
          {unit === 'animalDiseaseSurveillance' && 'Animal Disease Surveillance. 11 cols: No., Name of LGU/Client/Farm, Type of Disease Surveillance, Purpose, Address, Date of Request, Date of Surveillance (Blood Collection), No. of Samples, Date Submitted to Lab, Date of Endorsement to DA-BAI, Remarks. Province auto from Address, by province. Pwede i-paste buong block (CY 2024 First Sem/Second Sem) mula sa ANIMAL_DISEASE_SURVEILLANCE_FULL_DATA.txt — kumpleto lahat ng data.'}
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
            ) : unit === 'organicAgri' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Application</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Group</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.application || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfGroup || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfApplicant || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[220px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'goodAgriPractices' ? (parsed[0]?.formType === 'monitoring' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Monitoring</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Farmer</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Certificate No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfMonitoring ? (typeof r.dateOfMonitoring === 'string' ? r.dateOfMonitoring : new Date(r.dateOfMonitoring).toLocaleDateString('en-PH')) : '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfFarmer || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[220px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.certificateNumber || '—'}</td>
                      <td className="px-2 py-1.5">{r.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date of Request</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5 text-[#5c574f]">{r.dateOfRequest ? (typeof r.dateOfRequest === 'string' ? r.dateOfRequest : new Date(r.dateOfRequest).toLocaleDateString('en-PH')) : '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfApplicant || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[220px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )) : unit === 'organicPostMarket' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1100px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Market Outlet</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Product</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Commodity</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Certification</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.identifiedMarketOutlet || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[140px] truncate">{r.nameOfProduct || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[120px] truncate">{r.commodity || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[120px] truncate">{r.certification || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[200px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'landUseMatter' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Control No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Purpose</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5">{r.controlNo || '—'}</td>
                      <td className="px-2 py-1.5">{r.nameOfApplicant || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.purposeOfApplication || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[200px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'safdzValidation' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1100px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">EPA No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Applicant</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Location</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Field Validation</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5 max-w-[160px] truncate">{r.explorationPermitApplicationNo || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.nameOfApplicant || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.location || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[140px] truncate">{r.fieldValidation || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[120px] truncate">{r.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : unit === 'plantPestSurveillance' ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1100px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Date</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Name of Farmer</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Address</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Crop</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Pests/Diseases</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5 whitespace-nowrap">{r.dateOfRequestAndCollection ? (r.dateOfRequestAndCollection.match(/^\d{4}-\d{2}-\d{2}/) ? new Date(r.dateOfRequestAndCollection).toLocaleDateString('en-PH') : r.dateOfRequestAndCollection) : '—'}</td>
                      <td className="px-2 py-1.5 max-w-[160px] truncate">{r.farmerName || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.address || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[120px] truncate">{r.crop || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.pestsDiseases || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (unit === 'cfsAdmcc' || unit === 'animalDiseaseSurveillance') ? (
              <table className="w-full text-sm border-collapse" style={{ minWidth: '1100px' }}>
                <thead>
                  <tr className="border-b-2 border-[#e8e0d4] bg-[#faf8f5]">
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">No.</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Client/LGU/Farm</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Type of Surveillance</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Address</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Province</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Samples</th>
                    <th className="px-2 py-1.5 text-left font-bold text-[#1e4d2b] whitespace-nowrap">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.map((r, i) => (
                    <tr key={i} className="border-b border-[#e8e0d4] hover:bg-[#f0f5ee]/60">
                      <td className="px-2 py-1.5 font-medium text-[#5c574f]">{startNo + i}</td>
                      <td className="px-2 py-1.5 max-w-[200px] truncate">{r.clientName || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[140px] truncate">{r.typeOfDiseaseSurveillance || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[180px] truncate">{r.address || '—'}</td>
                      <td className="px-2 py-1.5">{r.province || '—'}</td>
                      <td className="px-2 py-1.5">{r.numberOfSamples || '—'}</td>
                      <td className="px-2 py-1.5 max-w-[160px] truncate">{r.remarks || '—'}</td>
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
