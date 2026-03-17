import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { collection, query, limit, onSnapshot, deleteDoc, doc, updateDoc, addDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { addSystemLog } from '../lib/systemLogs'
import { COLLECTIONS, COLLECTION_TITLE_FIELD, COLLECTION_FIELD_ORDER, COLLECTION_FIELD_LABELS, GOOD_AGRI_PRACTICES_FORM_FIELDS, PLANT_MATERIAL_FORM_FIELDS, RATING_FIELD_KEYS, RATING_LABELS, COLLECTION_DATE_FIELD_FOR_YEAR } from '../lib/collections'
import { useDisabledUnits } from '../context/DisabledUnitsContext'
import { getUnitIdsForSections } from '../lib/sections'
import {
  getYearFromDoc,
  getProvinceFromDoc,
  getYearsFromDocs,
  formatYearLabel,
  docToRow,
  toTitleCase,
  PROVINCES,
} from '../lib/recordFilters'
import { exportToExcel } from '../lib/exportExcel'
import { TRANSPORT_FIRST_SEM_REG_NOS, TRANSPORT_SECOND_SEM_REG_NOS, TRANSPORT_MASTER_LIST } from '../lib/transportCarrierSemesterList'
import { GAP_CERT_MASTER_LIST, MONITORING_MASTER_LIST, normalizeNameForGAP, normalizeDateForGAP } from '../lib/goodAgriPracticesSemesterList'
import { SAFDZ_MASTER_LIST } from '../lib/safdzValidationMasterList'
import AppSelect from '../components/AppSelect'

// --- HELPER FUNCTIONS ---
function getDisplayName(data, collectionId) {
  // GoodAgriPractices: show nameOfFarmer (Monitoring) or nameOfApplicant (GAP Certification)
  if (collectionId === 'goodAgriPractices') {
    const name = data?.nameOfFarmer ?? data?.nameOfApplicant
    if (name != null && name !== '') return String(name)
    return '—'
  }
  // PlantMaterial (Plant Nursery): show nameOfPlantNursery (Stock Inventory), nameOfNursery, or applicant (Accreditation)
  if (collectionId === 'plantMaterial') {
    const name = data?.nameOfPlantNursery ?? data?.nameOfNursery ?? data?.applicant
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
  const [filterYear, setFilterYear] = useState('')
  const [filterSemester, setFilterSemester] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [filterFormType, setFilterFormType] = useState('') // Good Agri Practices only: '' | 'gapCertification' | 'monitoring' | 'other'
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [exporting, setExporting] = useState(false)
  const [deleteConfirming, setDeleteConfirming] = useState(null) // { id, name } or { ids: string[], count } or null
  const [deletePhase, setDeletePhase] = useState('confirm') // 'confirm' | 'deleting'
  const [deleteProgress, setDeleteProgress] = useState(0) // 0–100 for progress bar
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [loadError, setLoadError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [backfillingSemester, setBackfillingSemester] = useState(false)
  const { user, role, userAllowedSections } = useAuth()

  const PAGE_SIZE = 10
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
  const MAX_ATTACHMENT_SIZE = 768 * 1024 // ~768 KB, same as forms (Firestore doc limit ~1 MB)

  useEffect(() => setSelectedIds(new Set()), [selectedCollection])
  useEffect(() => {
    if (deleteConfirming) {
      setDeletePhase('confirm')
      setDeleteProgress(0)
    }
  }, [deleteConfirming])
  useEffect(() => {
    if (selectedCollection !== 'goodAgriPractices' && selectedCollection !== 'plantMaterial') setFilterFormType('')
  }, [selectedCollection])

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

  const years = getYearsFromDocs(docs, selectedCollection)
  const collectionLabel = COLLECTIONS.find((c) => c.id === selectedCollection)?.label || selectedCollection

  let filtered = docs
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    filtered = filtered.filter((d) => flattenForSearch(d).toLowerCase().includes(q))
  }
  if (filterYear) {
    filtered = filtered.filter((d) => getYearFromDoc(d, selectedCollection) === filterYear)
  }
  if (filterSemester) {
    filtered = filtered.filter((d) => (d.semester || '') === filterSemester)
  }
  if (filterProvince) {
    filtered = filtered.filter((d) => getProvinceFromDoc(d) === filterProvince)
  }

  const isGAP = selectedCollection === 'goodAgriPractices'
  const isPlantMaterial = selectedCollection === 'plantMaterial'
  if (isGAP && filterFormType) {
    if (filterFormType === 'other') {
      filtered = filtered.filter((d) => d.formType !== 'gapCertification' && d.formType !== 'monitoring')
    } else {
      filtered = filtered.filter((d) => d.formType === filterFormType)
    }
  }
  if (isPlantMaterial && filterFormType) {
    if (filterFormType === 'other') {
      filtered = filtered.filter((d) => d.formType !== 'accreditation' && d.formType !== 'monitoring' && d.formType !== 'stockInventory')
    } else {
      filtered = filtered.filter((d) => d.formType === filterFormType)
    }
  }

  // GoodAgriPractices: split for separate GAP Certification vs Monitoring sections in table and print (uses filtered above)
  const filteredGapCert = isGAP ? filtered.filter((d) => d.formType === 'gapCertification') : []
  const filteredGapMonitoring = isGAP ? filtered.filter((d) => d.formType === 'monitoring') : []
  const filteredGapOther = isGAP ? filtered.filter((d) => d.formType !== 'gapCertification' && d.formType !== 'monitoring') : []

  // PlantMaterial: split for Accreditation vs Monitoring vs Stock Inventory sections
  const filteredPlantAccred = isPlantMaterial ? filtered.filter((d) => d.formType === 'accreditation') : []
  const filteredPlantMonitoring = isPlantMaterial ? filtered.filter((d) => d.formType === 'monitoring') : []
  const filteredPlantStockInv = isPlantMaterial ? filtered.filter((d) => d.formType === 'stockInventory') : []
  const filteredPlantOther = isPlantMaterial ? filtered.filter((d) => !['accreditation', 'monitoring', 'stockInventory'].includes(d.formType)) : []

  const displayList = isGAP ? [...filteredGapCert, ...filteredGapMonitoring, ...filteredGapOther] : isPlantMaterial ? [...filteredPlantAccred, ...filteredPlantMonitoring, ...filteredPlantStockInv, ...filteredPlantOther] : filtered
  const totalPages = Math.max(1, Math.ceil(displayList.length / PAGE_SIZE))
  const paginatedList = displayList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCollection, search, filterYear, filterSemester, filterProvince, filterFormType])
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages)
  }, [totalPages, currentPage])

  const canEdit = () => role === 'admin' || role === 'staff'
  const canDelete = () => role === 'admin'

  const allDisplayedIds = paginatedList.map((d) => d.id)

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

  const clearSemesterForCurrentUnit = async () => {
    // Currently only used for Livestock Handlers as requested
    if (selectedCollection !== 'livestockHandlers') return
    if (backfillingSemester) return

    const withSemester = docs.filter((d) => d.semester)
    if (withSemester.length === 0) {
      showNotification({
        type: 'success',
        title: 'Nothing to clear',
        message: 'No Livestock Handlers records currently have a semester value.',
      })
      return
    }

    try {
      setBackfillingSemester(true)
      await Promise.all(
        withSemester.map((d) =>
          updateDoc(doc(db, 'livestockHandlers', d.id), {
            semester: null,
          })
        )
      )
      showNotification({
        type: 'success',
        title: 'Semester cleared',
        message: `Removed semester for ${withSemester.length} Livestock Handlers record(s).`,
      })
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Failed to clear semester',
        message: err?.message || 'There was a problem clearing the semester values.',
      })
    } finally {
      setBackfillingSemester(false)
    }
  }

  const backfillSemesterForCurrentUnit = async () => {
    if (backfillingSemester) return

    // Animal Feeds: all existing records are 1st Semester
    if (selectedCollection === 'animalFeed') {
      const missing = docs.filter((d) => !d.semester)
      if (missing.length === 0) {
        showNotification({
          type: 'success',
          title: 'Nothing to update',
          message: 'All Animal Feeds records already have a semester value.',
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          missing.map((d) =>
            updateDoc(doc(db, 'animalFeed', d.id), {
              semester: '1st Semester',
            })
          )
        )
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Set "1st Semester" for ${missing.length} Animal Feeds record(s).`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Animal Welfare: mix of 1st and 2nd semester based on Registration No. (certificateNo)
    if (selectedCollection === 'animalWelfare') {
      const firstSemRegs = new Set([
        'KNL-0470',
        'PLT-L-0844',
        'GRM-0481',
        'PLT-L-0940',
        'SWN-0186',
        'SWN-0187',
        'SWN-0188',
        'STYD-0063',
        'STYD-0064',
        'STYD-0065',
        'SWN-0223',
        'VET-NS-0583',
        'SWN-0070',
        'GMF-0068',
        'STYD-0020',
        'STYD-0023',
        'VET-S-0176',
        'SWN-0012',
        'GMF-0057',
        'STYD-0011',
      ])

      const secondSemRegs = new Set([
        'STYD-0061',
        'STYD-0066',
        'PLT-L-1232',
        'QUA-0010',
        'PYF-1476',
      ])

      const toUpdate = docs
        .filter((d) => !d.semester && typeof d.certificateNo === 'string' && d.certificateNo.trim() !== '')
        .map((d) => {
          const reg = d.certificateNo.trim()
          if (firstSemRegs.has(reg)) return { id: d.id, semester: '1st Semester', reg }
          if (secondSemRegs.has(reg)) return { id: d.id, semester: '2nd Semester', reg }
          return null
        })
        .filter(Boolean)

      if (toUpdate.length === 0) {
        showNotification({
          type: 'info',
          title: 'No matching records',
          message: 'No Animal Welfare records without semester matched the provided registration numbers.',
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          toUpdate.map((item) =>
            updateDoc(doc(db, 'animalWelfare', item.id), {
              semester: item.semester,
            })
          )
        )
        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Updated ${firstCount} record(s) to 1st Semester and ${secondCount} record(s) to 2nd Semester for Animal Welfare.`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Livestock Handlers: mix of 1st and 2nd semester based on Registration No. (registrationNo)
    if (selectedCollection === 'livestockHandlers') {
      const firstSemRegs = new Set([
        // CY 2024 - FIRST SEMESTER - NEW APPLICATION
        '24-01-05-001',
        '24-01-08-002',
        '24-01-10-005',
        '24-01-12-006',
        '24-01-12-007',
        '24-01-15-009',
        '24-01-19-012',
        '24-01-23-015',
        '24-01-25-016',
        '24-01-29-017',
        '24-01-31-018',
        '24-01-31-020',
        '24-01-31-021',
        '24-01-31-022',
        '24-02-06-023',
        '24-02-06-024',
        '24-02-08-026',
        '24-02-08-027',
        '24-02-14-028',
        '24-02-19-029',
        '24-02-20-031',
        '24-02-20-032',
        '24-02-21-033',
        '24-02-21-034',
        '24-02-26-035',
        '24-02-27-036',
        '24-02-28-037',
        '24-02-29-038',
        '24-03-07-039',
        '24-03-21-040',
        '24-03-22-041',
        '24-03-26-042',
        '24-04-11-045',
        '24-04-15-046',
        '24-04-18-049',
        '24-04-24-050',
        '24-04-26-051',
        '24-04-29-052',
        '24-05-03-054',
        '24-05-17-056',
        '24-05--058',
        '24-05-23-059',
        '24-06-07-062',
        // CY 2024 - FIRST SEMESTER - RENEWAL APPLICATION
        '2021-003099-DARFO4B',
        '2021-001811-DARFO4B',
        '2023-005960-DARFO4B',
        '2021-001803-DARFO4B',
        '2023-006937-DARFO4B',
        '2020-001475-DARFO4B',
        '2021-001810-DARFO4B',
        '2022-004879-DARFO4B',
        '2021-DARFO-IVB-1978',
        '2021-003103-DARFO4B',
        '2021-DARFO-IVB-2154',
        '2022-004570-DARFO4B',
        '2023-DARFO4B-002975',
        '2020-001463-DARFO4B',
        '2022-004844-DARFO4B',
        '2020-00541-DARFO4B',
        '2022-004847-DARFO4B',
        '2022-001814-DARFO4B',
        '2020-001467-DARFO4B',
        '2020-012583-DARFO4B',
        '2022-004842-DARFO4B',
        '2008-01968-DARFO4B',
        '2022-004843-DARFO4B',
        '2022-004710-DARFO4B',
        '2021-002153-DARFO4B',
        '2019-10756-DARFO4B',
        '2018-8647-DARFO4B',
        '2021-001975-DARFO4B',
        '2022-005095-DARFO4B',
        '2021-04112-DARFO4B',
        '2021-000411-DARFO4B',
        '2023-DARFO-IV-B-005940',
        '2024-DARFO-IV-B-004830',
        '2022-DARFO4B-005317',
        '2022-005429-DARFO4B',
        '2021-DARFO4B-002648',
        '2021-002648-DARFO4B',
        '2020-000540-DARFO4B',
        '2023-006167-DARFO4B',
        '2021-DARFO-IV-B-002899',
        '2022-DARFO-IV-B-005906',
        '2021-DARFO-IV-B-002955',
        '2021-DARFO-IV-B-002610',
        '2020-DARFO-IV-B-000031',
      ])

      const secondSemRegs = new Set([
        // CY 2024 - SECOND SEMESTER - NEW APPLICATION
        '24-07-02-064',
        '24-07-12-065',
        '24-07-26-067',
        '24-08-12-070',
        '24-08-14-071',
        '24-08-16-072',
        '24-08-20-073',
        '24-08-20-074',
        '24-08-22-075',
        '24-08-29-076',
        '24-09-04-078',
        '24-09-12-079',
        '24-09-12-080',
        '24-09-12-082',
        '24-09-11-083',
        '24-09-24-084',
        '24-09-25-087',
        '24-09-12-088',
        '24-09-30-089',
        '24-10-02-091',
        '24-10-07-092',
        '24-10-11-096',
        '24-11-06-097',
        '24-12-11-102',
        // CY 2024 - SECOND SEMESTER - RENEWAL APPLICATION
        '2020-DARFO-IV-B-000068',
        '2023-DARFO-IV-B-002636',
        '2021-DARFO-IV-B-002008',
        '2021-DARFO4B--IV-B-003217',
        '2021-DARFO-IV-B-004808',
        '2021-DARFO-IV-B-10184',
        '2023-DARFO-IV-B-002644',
        '2021-DARFO-IV-B-002861',
        '2020-DARFO-IV-B-000071',
        '2007-DARFO-IV-B-0000848',
        '2023-DARFO-IV-B-015714',
        '2021-DARFO-IV-B-002990',
        '2021-DARFO-IV-B-003321',
        '2021-DARFO-IV-B-003474',
        '2023-DARFO-IV-B-002627',
        '2023-DARFO-IV-B-002988',
        '2022-DARFO-IV-B-005901',
        '2021-DARFO-IV-B-004111',
        '2021-DARFO-IV-B-003104',
        '2023-DARFO-IV-B-002976',
        '2021-DARFO-IV-B-003216',
        '2023-DARFO-IV-B-002949',
        '2020-DARFO-IV-B-001482',
        '2023-DARFO-IV-B-015758',
        '2018-DARFO-IV-B-009989',
        '2023-DARFO-IV-B-003396',
        '2023-DARFO-IV-B-015713',
        '2020-DARFO-IV-B-000564',
        '2021-DARFO-IV-B-003101',
        '2020-DARFO-IV-B-000539',
        '2023-DARFO-IV-B-003508',
        '2023-DARFO-IV-B-003157',
        '2021-DARFO-IV-B-004070',
        '2021-DARFO-IV-B-003100',
        '2020-DARFO-IV-B-001483',
        '2023-DARFO-IV-B-015703',
        '2023-DARFO-IV-B-003070',
        '2020-DARFO-IV-B-012582',
        '2023-DARFO-IV-B-003590',
        '2021-DARFO-IV-B-001806',
        '2021-DARFO-IV-B-001821',
        '2023-DARFO-IV-B-003382',
        '2023-DARFO-IV-B-003375',
        '2023-DARFO-IV-B-003288',
        '2022-DARFO-IV-B-0001481',
      ])

      // 1) Assign by registration number list (known 1st / 2nd sem)
      let toUpdate = docs
        .filter((d) => !d.semester && typeof d.registrationNo === 'string' && d.registrationNo.trim() !== '')
        .map((d) => {
          const reg = d.registrationNo.trim()
          if (firstSemRegs.has(reg)) return { id: d.id, semester: '1st Semester', reg }
          if (secondSemRegs.has(reg)) return { id: d.id, semester: '2nd Semester', reg }
          return null
        })
        .filter(Boolean)

      const updatedIds = new Set(toUpdate.map((x) => x.id))
      const dateField = 'dateOfApplicationReceivedAndEvaluated'

      // 2) For records still without semester, derive from date (Jan–Jun = 1st, Jul–Dec = 2nd)
      docs
        .filter((d) => !d.semester && !updatedIds.has(d.id) && d[dateField])
        .forEach((d) => {
          const raw = d[dateField]
          const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : raw ? new Date(raw) : null
          if (dt && !Number.isNaN(dt.getTime())) {
            const month = dt.getMonth() + 1
            const semester = month <= 6 ? '1st Semester' : '2nd Semester'
            toUpdate.push({ id: d.id, semester })
            updatedIds.add(d.id)
          }
        })

      if (toUpdate.length === 0) {
        showNotification({
          type: 'info',
          title: 'No records to update',
          message: 'No Livestock Handlers records without semester. Or add "Date of Application Received and Evaluated" so semester can be derived from date.',
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          toUpdate.map((item) =>
            updateDoc(doc(db, 'livestockHandlers', item.id), {
              semester: item.semester,
            })
          )
        )
        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Updated ${firstCount} record(s) to 1st Semester and ${secondCount} record(s) to 2nd Semester for Livestock Handlers.`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Transport Carrier: 1st/2nd semester from master list, then by date; add missing records from list
    if (selectedCollection === 'transportCarrier') {
      const firstSemRegs = new Set(TRANSPORT_FIRST_SEM_REG_NOS)
      const secondSemRegs = new Set(TRANSPORT_SECOND_SEM_REG_NOS)
      const dateField = 'dateOfApplicationReceivedAndEvaluated'

      // 1) Assign by registration number list
      let toUpdate = docs
        .filter((d) => !d.semester && typeof d.registrationNo === 'string' && d.registrationNo.trim() !== '')
        .map((d) => {
          const reg = d.registrationNo.trim()
          if (firstSemRegs.has(reg)) return { id: d.id, semester: '1st Semester', reg }
          if (secondSemRegs.has(reg)) return { id: d.id, semester: '2nd Semester', reg }
          return null
        })
        .filter(Boolean)

      const updatedIds = new Set(toUpdate.map((x) => x.id))

      // 2) For records still without semester, derive from date (Jan–Jun = 1st, Jul–Dec = 2nd)
      docs
        .filter((d) => !d.semester && !updatedIds.has(d.id) && d[dateField])
        .forEach((d) => {
          const raw = d[dateField]
          const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : raw ? new Date(raw) : null
          if (dt && !Number.isNaN(dt.getTime())) {
            const month = dt.getMonth() + 1
            const semester = month <= 6 ? '1st Semester' : '2nd Semester'
            toUpdate.push({ id: d.id, semester })
            updatedIds.add(d.id)
          }
        })

      const existingRegNos = new Set(docs.map((d) => (d.registrationNo && String(d.registrationNo).trim()) || '').filter(Boolean))

      // 3) Add missing records: in master list but not in system (with Date of Application for year segregation)
      const uniqueToAdd = []
      const seenReg = new Set()
      TRANSPORT_MASTER_LIST.forEach((entry) => {
        const reg = (entry.registrationNo && String(entry.registrationNo).trim()) || ''
        if (!reg || existingRegNos.has(reg) || seenReg.has(reg)) return
        seenReg.add(reg)
        uniqueToAdd.push({
          registrationNo: reg,
          semester: entry.semester,
          dateOfApplicationReceivedAndEvaluated: entry.dateOfApplicationReceivedAndEvaluated || null,
        })
      })

      try {
        setBackfillingSemester(true)

        if (toUpdate.length > 0) {
          await Promise.all(
            toUpdate.map((item) =>
              updateDoc(doc(db, 'transportCarrier', item.id), {
                semester: item.semester,
              })
            )
          )
        }

        if (uniqueToAdd.length > 0) {
          const collRef = collection(db, 'transportCarrier')
          await Promise.all(
            uniqueToAdd.map((item) => {
              const { dateOfApplicationReceivedAndEvaluated, ...rest } = item
              return addDoc(collRef, {
                ...rest,
                ...(dateOfApplicationReceivedAndEvaluated && { dateOfApplicationReceivedAndEvaluated }),
                typeOfApplication: 'TRANSPORT CARRIER',
                createdBy: user?.uid || null,
              })
            })
          )
        }

        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        const parts = []
        if (toUpdate.length > 0) parts.push(`Updated ${firstCount} to 1st Semester and ${secondCount} to 2nd Semester.`)
        if (uniqueToAdd.length > 0) parts.push(`Added ${uniqueToAdd.length} missing record(s) from master list.`)
        showNotification({
          type: 'success',
          title: 'Transport Carrier semester',
          message: parts.length ? parts.join(' ') : 'No records to update or add.',
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update Transport Carrier',
          message: err?.message || 'There was a problem updating or adding records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Good Agri Practices: match by date + name to master list (GAP Certification / Monitoring); fallback to date-derived semester
    if (selectedCollection === 'goodAgriPractices') {
      const certLookup = new Map()
      GAP_CERT_MASTER_LIST.forEach((row) => {
        const key = `${normalizeDateForGAP(row.dateOfRequest)}|${normalizeNameForGAP(row.nameOfApplicant)}`
        certLookup.set(key, row.semester)
      })
      const monitoringLookup = new Map()
      MONITORING_MASTER_LIST.forEach((row) => {
        const key = `${normalizeDateForGAP(row.dateOfMonitoring)}|${normalizeNameForGAP(row.nameOfFarmer)}`
        monitoringLookup.set(key, row.semester)
      })

      const dateFields = ['dateOfRequest', 'dateOfMonitoring']
      const toUpdate = []
      docs
        .filter((d) => !d.semester)
        .forEach((d) => {
          const formType = d.formType
          const isCert = formType === 'gapCertification'
          const isMonitoring = formType === 'monitoring'
          const dateField = isCert ? 'dateOfRequest' : isMonitoring ? 'dateOfMonitoring' : null
          const nameField = isCert ? 'nameOfApplicant' : isMonitoring ? 'nameOfFarmer' : null
          const lookup = isCert ? certLookup : isMonitoring ? monitoringLookup : null

          let raw = null
          for (const field of dateFields) {
            if (d[field] != null && d[field] !== '') {
              raw = d[field]
              break
            }
          }
          if (!raw) return
          const normDate = normalizeDateForGAP(raw)
          if (!normDate) return

          let semester = null
          if (lookup && nameField && (d[nameField] != null && d[nameField] !== '')) {
            const key = `${normDate}|${normalizeNameForGAP(d[nameField])}`
            semester = lookup.get(key)
          }
          if (!semester) {
            const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : raw ? new Date(raw) : null
            if (!dt || Number.isNaN(dt.getTime())) return
            const month = dt.getMonth() + 1
            semester = month <= 6 ? '1st Semester' : '2nd Semester'
          }
          toUpdate.push({ id: d.id, semester })
        })

      if (toUpdate.length === 0) {
        showNotification({
          type: 'success',
          title: 'Nothing to update',
          message: 'All Good Agri Practices records already have a semester value, or no date (Date of Request / Date of Monitoring) to derive from.',
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          toUpdate.map((item) =>
            updateDoc(doc(db, 'goodAgriPractices', item.id), {
              semester: item.semester,
            })
          )
        )
        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Updated ${firstCount} record(s) to 1st Semester and ${secondCount} record(s) to 2nd Semester for Good Agri Practices.`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Organic Agriculture: derive semester from Date of Application (Jan–Jun = 1st Semester, Jul–Dec = 2nd Semester)
    // Tries: dateOfApplication → dateOfEvaluation → application (in case date was stored as text from Excel import)
    if (selectedCollection === 'organicAgri') {
      const parseDate = (raw) => {
        if (raw == null || raw === '') return null
        const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw)
        return dt && !Number.isNaN(dt.getTime()) ? dt : null
      }
      const dateFields = ['dateOfApplication', 'dateOfEvaluation', 'application']
      const toUpdate = []
      docs
        .filter((d) => !d.semester)
        .forEach((d) => {
          let dt = null
          for (const field of dateFields) {
            const raw = d[field]
            if (raw == null || raw === '') continue
            dt = parseDate(raw)
            if (dt) break
          }
          if (dt) {
            const month = dt.getMonth() + 1
            const semester = month <= 6 ? '1st Semester' : '2nd Semester'
            toUpdate.push({ id: d.id, semester })
          }
        })

      if (toUpdate.length === 0) {
        const withSemester = docs.filter((d) => d.semester).length
        const withoutDate = docs.filter((d) => !d.semester).length
        const msg = withSemester === docs.length
          ? 'All Organic Agriculture records already have a semester.'
          : withoutDate > 0
            ? `${withoutDate} record(s) have no semester and no date field (Date of Application, Date of Evaluation, or Application) to derive from. Add a date in Edit Record.`
            : 'No records to update.'
        showNotification({
          type: 'info',
          title: 'Nothing to update',
          message: msg,
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          toUpdate.map((item) =>
            updateDoc(doc(db, 'organicAgri', item.id), {
              semester: item.semester,
            })
          )
        )
        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Organic Agriculture: ${firstCount} record(s) → 1st Semester, ${secondCount} record(s) → 2nd Semester (based on Date of Application).`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Organic Post Market: derive semester from Date of Communication Letter (Jan–Jun = 1st Semester, Jul–Dec = 2nd Semester)
    // Tries: dateOfCommunicationLetter → requestLetterDate → dateOfSurveillance (fallbacks for imported records)
    if (selectedCollection === 'organicPostMarket') {
      const parseDate = (raw) => {
        if (raw == null || raw === '') return null
        const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw)
        return dt && !Number.isNaN(dt.getTime()) ? dt : null
      }
      const dateFields = ['dateOfCommunicationLetter', 'requestLetterDate', 'dateOfSurveillance']
      const toUpdate = []
      docs
        .filter((d) => !d.semester)
        .forEach((d) => {
          let dt = null
          for (const field of dateFields) {
            const raw = d[field]
            if (raw == null || raw === '') continue
            dt = parseDate(raw)
            if (dt) break
          }
          if (dt) {
            const month = dt.getMonth() + 1
            const semester = month <= 6 ? '1st Semester' : '2nd Semester'
            toUpdate.push({ id: d.id, semester })
          }
        })

      if (toUpdate.length === 0) {
        const withSemester = docs.filter((d) => d.semester).length
        const withoutDate = docs.filter((d) => !d.semester).length
        const msg = withSemester === docs.length
          ? 'All Organic Post Market records already have a semester.'
          : withoutDate > 0
            ? `${withoutDate} record(s) have no semester and no date field (Date of Communication Letter, Request Letter Date, or Date of Surveillance) to derive from. Add a date in Edit Record.`
            : 'No records to update.'
        showNotification({
          type: 'info',
          title: 'Nothing to update',
          message: msg,
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          toUpdate.map((item) =>
            updateDoc(doc(db, 'organicPostMarket', item.id), {
              semester: item.semester,
            })
          )
        )
        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Organic Post Market: ${firstCount} record(s) → 1st Semester, ${secondCount} record(s) → 2nd Semester (based on Date of Communication Letter).`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Land Use Matter: derive semester from Date of Request (Jan–Jun = 1st Semester, Jul–Dec = 2nd Semester)
    // Tries: dateOfRequest → dateReceivedAndEvaluated → dateOfEndorsement (fallbacks for imported records)
    if (selectedCollection === 'landUseMatter') {
      const parseDate = (raw) => {
        if (raw == null || raw === '') return null
        const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw)
        return dt && !Number.isNaN(dt.getTime()) ? dt : null
      }
      const dateFields = ['dateOfRequest', 'dateReceivedAndEvaluated', 'dateOfEndorsement']
      const toUpdate = []
      docs
        .filter((d) => !d.semester)
        .forEach((d) => {
          let dt = null
          for (const field of dateFields) {
            const raw = d[field]
            if (raw == null || raw === '') continue
            dt = parseDate(raw)
            if (dt) break
          }
          if (dt) {
            const month = dt.getMonth() + 1
            const semester = month <= 6 ? '1st Semester' : '2nd Semester'
            toUpdate.push({ id: d.id, semester })
          }
        })

      if (toUpdate.length === 0) {
        const withSemester = docs.filter((d) => d.semester).length
        const withoutDate = docs.filter((d) => !d.semester).length
        const msg = withSemester === docs.length
          ? 'All Land Use Matter records already have a semester.'
          : withoutDate > 0
            ? `${withoutDate} record(s) have no semester and no date field (Date of Request, Date Received and Evaluated, or Date of Endorsement) to derive from. Add a date in Edit Record.`
            : 'No records to update.'
        showNotification({
          type: 'info',
          title: 'Nothing to update',
          message: msg,
        })
        return
      }

      try {
        setBackfillingSemester(true)
        await Promise.all(
          toUpdate.map((item) =>
            updateDoc(doc(db, 'landUseMatter', item.id), {
              semester: item.semester,
            })
          )
        )
        const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
        const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
        showNotification({
          type: 'success',
          title: 'Semester filled',
          message: `Land Use Matter: ${firstCount} record(s) → 1st Semester, ${secondCount} record(s) → 2nd Semester (based on Date of Request).`,
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update semester',
          message: err?.message || 'There was a problem updating the records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // SAFDZ Validation: sync to master list (6 records only), fill semester, add missing
    // Keeps ONLY records that match the master list; removes others; adds missing
    if (selectedCollection === 'safdzValidation') {
      const parseDate = (raw) => {
        if (raw == null || raw === '') return null
        const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : new Date(raw)
        return dt && !Number.isNaN(dt.getTime()) ? dt : null
      }
      const toYyyyMmDd = (raw) => {
        const dt = parseDate(raw)
        if (!dt) return ''
        return dt.toISOString().slice(0, 10)
      }
      const masterListKeys = new Set()
      SAFDZ_MASTER_LIST.forEach((entry) => {
        const epa = (entry.explorationPermitApplicationNo && String(entry.explorationPermitApplicationNo).trim()) || ''
        const name = (entry.nameOfApplicant && String(entry.nameOfApplicant).trim()) || ''
        const date = (entry.dateReceived && String(entry.dateReceived).slice(0, 10)) || ''
        masterListKeys.add(`${epa}|${name}|${date}`)
      })

      const toDelete = []
      docs.forEach((d) => {
        const epa = (d.explorationPermitApplicationNo && String(d.explorationPermitApplicationNo).trim()) || ''
        const name = (d.nameOfApplicant && String(d.nameOfApplicant).trim()) || ''
        const date = toYyyyMmDd(d.dateReceived)
        const key = `${epa}|${name}|${date}`
        if (!masterListKeys.has(key)) toDelete.push({ id: d.id, name: name || epa || d.id })
      })

      if (toDelete.length > 0 && !window.confirm(
        `${toDelete.length} record(s) are not in the master list and will be removed. SAFDZ Validation will contain only the 6 master list records. Continue?`
      )) return

      const dateFields = ['dateReceived', 'dateOfReplyToRequest', 'endorsementToBSWM']
      const toUpdate = []
      docs
        .filter((d) => !toDelete.some((x) => x.id === d.id) && !d.semester)
        .forEach((d) => {
          let dt = null
          for (const field of dateFields) {
            const raw = d[field]
            if (raw == null || raw === '') continue
            dt = parseDate(raw)
            if (dt) break
          }
          if (dt) {
            const month = dt.getMonth() + 1
            const semester = month <= 6 ? '1st Semester' : '2nd Semester'
            toUpdate.push({ id: d.id, semester })
          }
        })

      const existingKeys = new Set()
      docs.filter((d) => !toDelete.some((x) => x.id === d.id)).forEach((d) => {
        const epa = (d.explorationPermitApplicationNo && String(d.explorationPermitApplicationNo).trim()) || ''
        const name = (d.nameOfApplicant && String(d.nameOfApplicant).trim()) || ''
        const date = toYyyyMmDd(d.dateReceived)
        if (epa || name || date) existingKeys.add(`${epa}|${name}|${date}`)
      })

      const uniqueToAdd = []
      const seenKey = new Set()
      SAFDZ_MASTER_LIST.forEach((entry) => {
        const epa = (entry.explorationPermitApplicationNo && String(entry.explorationPermitApplicationNo).trim()) || ''
        const name = (entry.nameOfApplicant && String(entry.nameOfApplicant).trim()) || ''
        const date = (entry.dateReceived && String(entry.dateReceived).slice(0, 10)) || ''
        const key = `${epa}|${name}|${date}`
        if (!key || existingKeys.has(key) || seenKey.has(key)) return
        seenKey.add(key)
        uniqueToAdd.push({
          explorationPermitApplicationNo: epa,
          nameOfApplicant: name,
          dateReceived: date || null,
          semester: entry.semester || (parseDate(date) ? (new Date(date).getMonth() + 1 <= 6 ? '1st Semester' : '2nd Semester') : null),
          province: entry.province || null,
          location: entry.location || null,
          area: entry.area || null,
          dateOfReplyToRequest: entry.dateOfReplyToRequest || null,
          endorsementToBSWM: entry.endorsementToBSWM || null,
          endorsementToMGB: entry.endorsementToMGB || null,
          fieldValidation: entry.fieldValidation || null,
        })
      })

      if (toDelete.length === 0 && toUpdate.length === 0 && uniqueToAdd.length === 0) {
        showNotification({
          type: 'info',
          title: 'Nothing to update',
          message: 'SAFDZ Validation already has exactly the 6 master list records with semester filled.',
        })
        return
      }

      try {
        setBackfillingSemester(true)
        if (toDelete.length > 0) {
          for (const item of toDelete) {
            await deleteDoc(doc(db, 'safdzValidation', item.id))
          }
        }
        if (toUpdate.length > 0) {
          await Promise.all(
            toUpdate.map((item) =>
              updateDoc(doc(db, 'safdzValidation', item.id), {
                semester: item.semester,
              })
            )
          )
        }
        if (uniqueToAdd.length > 0) {
          const collRef = collection(db, 'safdzValidation')
          await Promise.all(
            uniqueToAdd.map((item) =>
              addDoc(collRef, {
                ...item,
                createdBy: user?.uid || null,
              })
            )
          )
        }
        const parts = []
        if (toDelete.length > 0) parts.push(`Removed ${toDelete.length} record(s) not in master list.`)
        if (toUpdate.length > 0) {
          const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
          const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
          parts.push(`Updated ${firstCount} to 1st Semester and ${secondCount} to 2nd Semester.`)
        }
        if (uniqueToAdd.length > 0) parts.push(`Added ${uniqueToAdd.length} missing record(s).`)
        showNotification({
          type: 'success',
          title: 'SAFDZ Validation',
          message: parts.length ? parts.join(' ') : 'Sync complete. 6 records only.',
        })
      } catch (err) {
        showNotification({
          type: 'error',
          title: 'Failed to update SAFDZ Validation',
          message: err?.message || 'There was a problem syncing records.',
        })
      } finally {
        setBackfillingSemester(false)
      }
      return
    }

    // Generic fallback: derive semester from the unit's primary date field (Jan–Jun = 1st, Jul–Dec = 2nd)
    const dateFieldOrFields = COLLECTION_DATE_FIELD_FOR_YEAR[selectedCollection]
    if (!dateFieldOrFields) {
      showNotification({
        type: 'info',
        title: 'Backfill not configured',
        message: 'Automatic semester fill is not configured for this unit.',
      })
      return
    }

    const dateFields = Array.isArray(dateFieldOrFields) ? dateFieldOrFields : [dateFieldOrFields]
    const candidates = docs.filter((d) => {
      if (d.semester) return false
      return dateFields.some((f) => d[f] != null && d[f] !== '')
    })
    if (candidates.length === 0) {
      showNotification({
        type: 'success',
        title: 'Nothing to update',
        message: 'All records for this unit already have a semester value.',
      })
      return
    }

    const toUpdate = []
    candidates.forEach((d) => {
      let raw = null
      for (const field of dateFields) {
        if (d[field] != null && d[field] !== '') {
          raw = d[field]
          break
        }
      }
      const dt = raw && typeof raw.toDate === 'function' ? raw.toDate() : raw ? new Date(raw) : null
      if (!dt || Number.isNaN(dt.getTime())) return
      const month = dt.getMonth() + 1
      const semester = month <= 6 ? '1st Semester' : '2nd Semester'
      toUpdate.push({ id: d.id, semester })
    })

    if (toUpdate.length === 0) {
      showNotification({
        type: 'info',
        title: 'No valid dates',
        message: 'No records without semester had a valid date to derive semester from.',
      })
      return
    }

    try {
      setBackfillingSemester(true)
      await Promise.all(
        toUpdate.map((item) =>
          updateDoc(doc(db, selectedCollection, item.id), {
            semester: item.semester,
          })
        )
      )
      const firstCount = toUpdate.filter((x) => x.semester === '1st Semester').length
      const secondCount = toUpdate.filter((x) => x.semester === '2nd Semester').length
      showNotification({
        type: 'success',
        title: 'Semester filled',
        message: `Updated ${firstCount} record(s) to 1st Semester and ${secondCount} record(s) to 2nd Semester for this unit.`,
      })
    } catch (err) {
      showNotification({
        type: 'error',
        title: 'Failed to update semester',
        message: err?.message || 'There was a problem updating the records.',
      })
    } finally {
      setBackfillingSemester(false)
    }
  }

  const handleDelete = async (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds]
    const n = ids.length
    setDeletePhase('deleting')
    setDeleteProgress(0)

    // Duration based on record count: min 2s, +600ms per record, max 15s (more records = longer wait)
    const minDuration = 2000
    const perRecord = 600
    const maxDuration = 15000
    const loadingDuration = Math.min(maxDuration, minDuration + n * perRecord)

    const delay = (ms) => new Promise((r) => setTimeout(r, ms))
    const startTime = Date.now()
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, (elapsed / loadingDuration) * 100)
      setDeleteProgress(pct)
      if (pct >= 100) clearInterval(progressInterval)
    }, 50)

    try {
      const deletePromise = (async () => {
        for (const id of ids) await deleteDoc(doc(db, selectedCollection, id))
      })()
      await Promise.all([deletePromise, delay(loadingDuration)])
      clearInterval(progressInterval)
      setDeleteProgress(100)
      setDeleteConfirming(null)
      setDeletePhase('confirm')
      setSelectedIds(new Set())
      showNotification({
        type: 'success',
        title: n === 1 ? 'Record deleted' : `${n} records deleted`,
        message: n === 1 ? 'Record deleted successfully.' : `${n} records deleted successfully.`,
      })
      addSystemLog({
        action: 'record_deleted',
        userId: user?.uid,
        userEmail: user?.email,
        role: role || 'staff',
        details: `${selectedCollection} ${n} record(s) deleted.`,
      }).catch(() => {})
    } catch (err) {
      clearInterval(progressInterval)
      setDeletePhase('confirm')
      setDeleteProgress(0)
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
    if (selectedCollection === 'plantMaterial' && PLANT_MATERIAL_FORM_FIELDS) {
      const formType = rest.formType
      const formFields = formType && PLANT_MATERIAL_FORM_FIELDS[formType]
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

  // Firestore does not accept undefined. Sanitize so all units can save even with blank/optional fields.
  const sanitizePayloadForFirestore = (obj) => {
    if (obj === undefined) return null
    if (obj === null || typeof obj !== 'object') return obj
    if (Array.isArray(obj)) return obj.map(sanitizePayloadForFirestore)
    const out = {}
    Object.keys(obj).forEach((k) => {
      const v = obj[k]
      out[k] = v === undefined ? null : sanitizePayloadForFirestore(v)
    })
    return out
  }

  const saveEdit = async () => {
    if (!editing) return
    try {
      const payload = { ...editForm, updatedAt: new Date().toISOString() }
      const sanitized = sanitizePayloadForFirestore(payload)
      await updateDoc(doc(db, selectedCollection, editing), sanitized)
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
    } else if (selectedCollection === 'plantMaterial') {
      const plantAccred = filtered.filter((d) => d.formType === 'accreditation')
      const plantMonitoring = filtered.filter((d) => d.formType === 'monitoring')
      const plantStockInv = filtered.filter((d) => d.formType === 'stockInventory')
      const plantOther = filtered.filter((d) => !['accreditation', 'monitoring', 'stockInventory'].includes(d.formType))
      tableRows += '<tr><td colspan="' + numCols + '" style="background:#065f46;color:#fff;font-weight:700;padding:6px 8px;">PLANT NURSERY ACCREDITATION' + (plantAccred.length ? ' (' + plantAccred.length + ' record(s))' : '') + '</td></tr>'
      plantAccred.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      tableRows += '<tr><td colspan="' + numCols + '" style="background:#065f46;color:#fff;font-weight:700;padding:6px 8px;">MONITORING OF ACCREDITED PLANT NURSERY' + (plantMonitoring.length ? ' (' + plantMonitoring.length + ' record(s))' : '') + '</td></tr>'
      plantMonitoring.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      tableRows += '<tr><td colspan="' + numCols + '" style="background:#065f46;color:#fff;font-weight:700;padding:6px 8px;">PLANT NURSERY STOCK INVENTORY' + (plantStockInv.length ? ' (' + plantStockInv.length + ' record(s))' : '') + '</td></tr>'
      plantStockInv.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      if (plantOther.length) {
        tableRows += '<tr><td colspan="' + numCols + '" style="background:#78716c;color:#fff;font-weight:700;padding:6px 8px;">OTHER (' + plantOther.length + ' record(s))</td></tr>'
        plantOther.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
      }
    } else {
      filtered.forEach((doc, idx) => { tableRows += rowToTr(doc, idx) })
    }

    const thCells = headerLabels.map((l) => {
      const parts = l.split('<br>').map((p) => esc(p))
      return '<th>' + parts.join('<br>') + '</th>'
    }).join('')
    const metaParts = []
    if (filterYear) metaParts.push(`Year: ${formatYearLabel(filterYear)}`)
    if (filterSemester) metaParts.push(`Semester: ${filterSemester}`)
    if (filterProvince) metaParts.push(`Province: ${filterProvince}`)
    if (selectedCollection === 'goodAgriPractices' && filterFormType) {
      const formTypeLabel = filterFormType === 'gapCertification' ? 'GAP Certification' : filterFormType === 'monitoring' ? 'Monitoring of GAP Certified Farmer' : 'Other'
      metaParts.push(`Form Type: ${formTypeLabel}`)
    }
    if (selectedCollection === 'plantMaterial' && filterFormType) {
      const formTypeLabel = filterFormType === 'accreditation' ? 'Plant Nursery Accreditation' : filterFormType === 'monitoring' ? 'Monitoring of Accredited Plant Nursery' : filterFormType === 'stockInventory' ? 'Stock Inventory' : 'Other'
      metaParts.push(`Form Type: ${formTypeLabel}`)
    }
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
      await exportToExcel(filtered, selectedCollection, collectionLabel, {
        filterYear,
        filterSemester,
        filterProvince,
        formatYearLabel,
      })
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

  const SEMESTER_OPTIONS_EDIT = [
    { value: '', label: 'Select semester...' },
    { value: '1st Semester', label: '1st Semester' },
    { value: '2nd Semester', label: '2nd Semester' },
  ]

  // Keys that should use date input (settable date picker)
  const isDateField = (k) => {
    if (!k || typeof k !== 'string') return false
    const lower = k.toLowerCase()
    return lower.includes('date')
  }

  const toDateInputValue = (val) => {
    if (val == null || val === '') return ''
    if (typeof val === 'string') {
      const s = val.trim().slice(0, 10)
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
      return ''
    }
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

    if (key === 'semester') {
      const semesterValue = value != null && value !== '' ? String(value) : ''
      return (
        <AppSelect
          options={SEMESTER_OPTIONS_EDIT}
          value={semesterValue}
          onChange={(v) => updateEditField(key, v)}
          placeholder="Select semester..."
          aria-label="Semester"
          className="w-full"
        />
      )
    }

    if (key === 'items' && Array.isArray(value)) {
      const summary = value.map((it, i) => {
        const parts = [it.crops, it.variety].filter(Boolean)
        const qty = it.total != null ? it.total : (parseInt(it.noOfCertified, 10) || 0) + (parseInt(it.noOfNonCertifiedSexual, 10) || 0) + (parseInt(it.noOfNonCertifiedAsexual, 10) || 0)
        return `${i + 1}. ${parts.join(' / ') || '—'} (Total: ${qty})`
      }).join('\n')
      return (
        <div className="p-3 rounded-xl border-2 border-[#e8e0d4] bg-[#faf8f5] text-sm text-[#1e4d2b] whitespace-pre-wrap max-h-48 overflow-y-auto">
          {summary || 'No items'}
        </div>
      )
    }

    if (key === 'asOfMonthYear') {
      const monthVal = value != null && value !== '' ? String(value).slice(0, 7) : ''
      return (
        <input
          type="month"
          value={monthVal}
          onChange={(e) => updateEditField(key, e.target.value)}
          className={inputClass}
          aria-label={key}
        />
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

    // Uploaded file (base64) — display with filename, Download, Remove, and file input to upload/replace
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
      const handleAttachmentChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > MAX_ATTACHMENT_SIZE) {
          alert(`File too large. Max ${Math.round(MAX_ATTACHMENT_SIZE / 1024)} KB.`)
          e.target.value = ''
          return
        }
        const reader = new FileReader()
        reader.onload = () => {
          const data = reader.result
          const b64 = typeof data === 'string' ? data.split(',')[1] || data : ''
          updateEditField('attachmentData', b64)
          updateEditField('attachmentFileName', file.name)
        }
        reader.readAsDataURL(file)
        e.target.value = ''
      }
      return (
        <div className="space-y-3">
          {base64 && base64.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl border-2 border-[#e8e0d4] bg-[#faf8f5]">
              <span className="text-sm font-semibold text-[#1e4d2b] truncate flex-1 min-w-0" title={fileName}>{fileName}</span>
              <button type="button" onClick={download} className="px-3 py-2 min-h-[44px] bg-[#1e4d2b] text-white rounded-xl text-sm font-bold hover:bg-[#153019] whitespace-nowrap touch-manipulation">Download</button>
              <button type="button" onClick={removeAttachment} className="px-3 py-2 min-h-[44px] border-2 border-red-400 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 whitespace-nowrap touch-manipulation">Remove</button>
            </div>
          ) : (
            <p className="text-sm text-[#5c7355]">No file uploaded</p>
          )}
          <label className="block">
            <span className="sr-only">Choose file to upload or replace</span>
            <input
              type="file"
              onChange={handleAttachmentChange}
              className="block w-full text-sm text-[#5c574f] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#1e4d2b]/10 file:text-[#1e4d2b] hover:file:bg-[#1e4d2b]/20 border-2 border-dashed border-[#e8e0d4] rounded-xl py-2.5 px-3"
            />
          </label>
          <p className="text-[10px] text-[#5c574f]">Max 768 KB (images or PDF). Same as in forms.</p>
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

    // Organic Post Market: Name of Product & Commodity — multiple entries with Add (horizontal wrap, compact)
    if (selectedCollection === 'organicPostMarket' && (key === 'nameOfProduct' || key === 'commodity')) {
      const arr = Array.isArray(value) ? [...value] : (value != null && value !== '' ? [String(value)] : [''])
      return (
        <div className="flex flex-wrap gap-2 items-center">
          {arr.map((item, i) => (
            <div key={i} className="flex gap-1.5 items-center min-w-0 max-w-full sm:max-w-[200px]">
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const next = [...arr]
                  next[i] = e.target.value
                  updateEditField(key, next)
                }}
                className={`${inputClass} min-w-0 flex-1`}
                placeholder={key === 'nameOfProduct' ? 'Product' : 'e.g. Rice'}
                aria-label={`${key} ${i + 1}`}
              />
              {arr.length > 1 && (
                <button
                  type="button"
                  onClick={() => updateEditField(key, arr.filter((_, j) => j !== i))}
                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg shrink-0"
                  title="Remove"
                >
                  <iconify-icon icon="mdi:trash-can-outline" width="16"></iconify-icon>
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => updateEditField(key, [...arr, ''])}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 border-2 border-dashed border-[#1e4d2b]/40 text-[#1e4d2b] rounded-lg font-bold text-xs hover:bg-[#1e4d2b]/10 transition-all shrink-0"
          >
            <iconify-icon icon="mdi:plus" width="16"></iconify-icon>
            Add
          </button>
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
    <div className="space-y-4 sm:space-y-6 pb-6 xs:pb-10 sm:pb-12 min-w-0 w-full max-w-full overflow-x-hidden">
      
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
        <div className="p-3 xs:p-4 sm:p-5 border-l-4 border-[#b8a066]/25 space-y-3 xs:space-y-4">
          {/* Primary search bar */}
          <div className="flex flex-col min-w-0">
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
                <button
                  onClick={() => setSearch('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#5c7355] hover:text-[#1e4d2b] hover:scale-110 transition-all duration-200"
                >
                  <iconify-icon icon="mdi:close-circle" width="18"></iconify-icon>
                </button>
              )}
            </div>
          </div>

          {/* Filter row — stack on mobile for 6.1" phones */}
          <div className={`grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 xs:gap-4 lg:gap-5 lg:items-end ${(selectedCollection === 'goodAgriPractices' || selectedCollection === 'plantMaterial') ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
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
              <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Year</label>
              <AppSelect
                value={filterYear}
                onChange={setFilterYear}
                placeholder="All Years"
                options={[
                  { value: '', label: 'All Years' },
                  ...years.map((y) => ({ value: y, label: formatYearLabel(y) })),
                ]}
                leftIcon={<iconify-icon icon="mdi:calendar-outline" width="18"></iconify-icon>}
                aria-label="Year"
                className="min-w-0"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Semester</label>
              <AppSelect
                value={filterSemester}
                onChange={setFilterSemester}
                placeholder="All Semesters"
                options={[
                  { value: '', label: 'All Semesters' },
                  { value: '1st Semester', label: '1st Semester' },
                  { value: '2nd Semester', label: '2nd Semester' },
                ]}
                leftIcon={<iconify-icon icon="mdi:calendar-month-outline" width="18"></iconify-icon>}
                aria-label="Semester"
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
            {selectedCollection === 'goodAgriPractices' && (
              <div className="flex flex-col min-w-0">
                <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Form Type</label>
                <AppSelect
                  value={filterFormType}
                  onChange={setFilterFormType}
                  placeholder="All Forms"
                  options={[
                    { value: '', label: 'All Forms' },
                    { value: 'gapCertification', label: 'GAP Certification' },
                    { value: 'monitoring', label: 'Monitoring of GAP Certified Farmer' },
                    { value: 'other', label: 'Other' },
                  ]}
                  leftIcon={<iconify-icon icon="mdi:file-document-outline" width="18"></iconify-icon>}
                  aria-label="Form Type"
                  className="min-w-0"
                />
              </div>
            )}
            {selectedCollection === 'plantMaterial' && (
              <div className="flex flex-col min-w-0">
                <label className="block text-[10px] font-bold text-[#5c7355] uppercase tracking-wider mb-1.5">Form Type</label>
                <AppSelect
                  value={filterFormType}
                  onChange={setFilterFormType}
                  placeholder="All Forms"
                  options={[
                    { value: '', label: 'All Forms' },
                    { value: 'accreditation', label: 'Plant Nursery Accreditation' },
                    { value: 'monitoring', label: 'Monitoring of Accredited Plant Nursery' },
                    { value: 'stockInventory', label: 'Stock Inventory' },
                    { value: 'other', label: 'Other' },
                  ]}
                  leftIcon={<iconify-icon icon="mdi:file-document-outline" width="18"></iconify-icon>}
                  aria-label="Form Type"
                  className="min-w-0"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- DATA TABLE — green --- */}
      <div className="view-records-anim-3 rounded-2xl border-2 border-[#e8e0d4] bg-white shadow-lg shadow-[#1e4d2b]/8 overflow-hidden flex flex-col min-h-[400px] hover:shadow-xl hover:shadow-[#1e4d2b]/10 transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)]">
        <div className="shrink-0 bg-gradient-to-r from-[#1e4d2b] via-[#1a4526] to-[#153019] px-5 sm:px-6 py-3 relative overflow-hidden border-b-2 border-[#1e4d2b]/20">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_80%_0%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white uppercase tracking-tight">Records</span>
              <span className="text-[11px] font-semibold text-white/85">{collectionLabel}</span>
            </div>
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
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-260px)] xs:max-h-[calc(100vh-280px)] sm:max-h-[calc(100vh-300px)] min-h-0 custom-scrollbar view-records-scroll flex-1 border-l-4 border-[#1e4d2b]/25 -mx-1 px-1 sm:mx-0 sm:px-0">
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
                {(isGAP || isPlantMaterial) && (
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Type</th>
                )}
                {RATING_COLLECTIONS[selectedCollection] && (
                  <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Avg. Rating</th>
                )}
                <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider whitespace-nowrap">Date</th>
                <th className="px-3 sm:px-5 py-3 sm:py-3.5 font-black text-[#1e4d2b] uppercase text-[10px] tracking-wider text-center w-20 sm:w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e0d4]">
              {displayList.length === 0 ? (
                <tr>
                  <td colSpan={4 + ((isGAP || isPlantMaterial) ? 1 : 0) + (RATING_COLLECTIONS[selectedCollection] ? 1 : 0) + (canDelete() ? 1 : 0)} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-[#5c7355] rounded-xl border-2 border-dashed border-[#1e4d2b]/25 bg-[#f0f5ee]/80 py-12 mx-4">
                      <iconify-icon icon="mdi:database-off-outline" width="56" class="opacity-60 animate-pulse"></iconify-icon>
                      <p className="mt-3 font-semibold text-[#1e4d2b]">No records found</p>
                      <p className="text-xs text-[#5c7355] mt-1">Try adjusting filters or search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedList.map((docItem) => (
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
                    {(isGAP || isPlantMaterial) && (
                      <td className="px-5 py-3.5 whitespace-nowrap text-xs font-semibold text-[#5c574f]">
                        {isGAP && (docItem.formType === 'gapCertification' ? 'GAP Certification' : docItem.formType === 'monitoring' ? 'Monitoring' : 'Other')}
                        {isPlantMaterial && (docItem.formType === 'accreditation' ? 'Accreditation' : docItem.formType === 'monitoring' ? 'Monitoring' : docItem.formType === 'stockInventory' ? 'Stock Inv.' : 'Other')}
                      </td>
                    )}
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
                        {docItem.formSubmissionDate
                          ? (() => {
                              const d = docItem.formSubmissionDate
                              const date = typeof d === 'string' ? new Date(d) : (d?.toDate ? d.toDate() : null)
                              return date && !isNaN(date.getTime())
                                ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                                : String(d).slice(0, 10) || '—'
                            })()
                          : '—'}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {canEdit() && (
                          <button onClick={() => openEdit(docItem)} className="p-2 rounded-xl bg-[#1e4d2b]/10 border-2 border-[#1e4d2b]/30 text-[#1e4d2b] hover:bg-[#1e4d2b]/20 hover:border-[#1e4d2b] hover:shadow-md active:scale-95 transition-all duration-300" title="Edit">
                            <iconify-icon icon="mdi:pencil-outline" width="18"></iconify-icon>
                          </button>
                        )}
                        {canDelete() && (
                          <button onClick={() => setDeleteConfirming({ id: docItem.id, name: getDisplayName(docItem, selectedCollection) })} className="p-2 rounded-xl bg-red-50 border-2 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-400 hover:shadow-md active:scale-95 transition-all duration-300" title="Delete">
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
        <div className="shrink-0 bg-gradient-to-r from-[#faf8f5] to-[#f2ede6] border-t-2 border-[#1e4d2b]/15 px-5 py-2.5 flex flex-wrap justify-between items-center gap-2 text-[11px] font-bold text-[#5c7355] transition-colors duration-300">
          <span>
            {displayList.length === 0 ? 'No records' : `Showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, displayList.length)} of ${displayList.length}`}
          </span>
          <span className="flex items-center gap-2">
            {docs.length >= VIEW_RECORDS_LIMIT && (
              <span className="italic text-amber-700">First {VIEW_RECORDS_LIMIT} loaded — use filters to narrow</span>
            )}
            {displayList.length > PAGE_SIZE && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="min-w-[32px] h-8 px-2 rounded-lg border-2 border-[#1e4d2b]/30 text-[#1e4d2b] font-bold hover:bg-[#1e4d2b]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Previous page"
                >
                  <iconify-icon icon="mdi:chevron-left" width="18"></iconify-icon>
                </button>
                <span className="px-2 text-[#1e4d2b] whitespace-nowrap">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="min-w-[32px] h-8 px-2 rounded-lg border-2 border-[#1e4d2b]/30 text-[#1e4d2b] font-bold hover:bg-[#1e4d2b]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  aria-label="Next page"
                >
                  <iconify-icon icon="mdi:chevron-right" width="18"></iconify-icon>
                </button>
              </div>
            )}
          </span>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL (portal = full-screen backdrop) — full width on 6.1" phones --- */}
      {deleteConfirming && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 xs:p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 min-h-[100dvh] min-w-full bg-[#153019]/80 backdrop-blur-md animate-in fade-in duration-300"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={deletePhase === 'confirm' ? () => setDeleteConfirming(null) : undefined}
          />
          <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-[#e8e0d4] shadow-2xl shadow-[#1e4d2b]/20 w-full max-w-[320px] overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out" style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
            {deletePhase === 'deleting' ? (
              /* --- LOADING: Deleting with progress bar --- */
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div className="text-center">
                  <h3 className="text-lg font-black text-[#1e4d2b] uppercase tracking-tight">
                    Deleting…
                  </h3>
                  <p className="text-sm font-medium text-[#5c574f] mt-1">
                    {deleteConfirming.ids ? `${deleteConfirming.count} record${deleteConfirming.count !== 1 ? 's' : ''}` : '1 record'}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-[#e8e0d4] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1e4d2b] to-[#5c7355] rounded-full transition-[width] duration-500 ease-out"
                      style={{ width: `${deleteProgress}%` }}
                    />
                  </div>
                  <p className="text-center text-xs font-medium text-[#5c574f]">
                    Please wait…
                  </p>
                </div>
              </div>
            ) : (
              /* --- CONFIRM --- */
              <>
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
              </>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* --- EDIT MODAL (portal = full-screen backdrop) — full width on 6.1" phones --- */}
      {editing && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 xs:p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 min-h-[100dvh] min-w-full bg-[#153019]/80 backdrop-blur-md animate-in fade-in duration-300"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setEditing(null)}
          />
          <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-[#e8e0d4] shadow-2xl shadow-[#1e4d2b]/20 w-full max-w-[calc(100vw-16px)] xs:max-w-md sm:max-w-lg max-h-[90dvh] sm:max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-300 ease-out" style={{ animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
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
                  if (selectedCollection === 'plantMaterial' && PLANT_MATERIAL_FORM_FIELDS) {
                    const formType = editForm.formType
                    const formFields = formType && PLANT_MATERIAL_FORM_FIELDS[formType]
                    if (formFields?.length) order = formFields
                  }
                  const labels = COLLECTION_FIELD_LABELS?.[selectedCollection]
                  // Hide attachmentFileName row; attachmentData row shows combined "Attachments" upload/download UI for all units
                  const filterKey = (k) => !skip.includes(k) && !(k === 'attachmentFileName' && order && order.includes('attachmentData'))
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