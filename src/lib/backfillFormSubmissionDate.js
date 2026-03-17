import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { COLLECTIONS, OLD_COLLECTION_DATE_FIELD_FOR_YEAR, FORM_SUBMISSION_DATE_FIELD } from './collections'

/** Convert a value (Timestamp, ISO string, or date string) to YYYY-MM-DD, or null if invalid. */
function toYYYYMMDD(value) {
  if (value == null || value === '') return null
  let date
  if (typeof value?.toDate === 'function') {
    date = value.toDate()
  } else if (typeof value === 'string') {
    date = new Date(value)
  } else if (value instanceof Date) {
    date = value
  } else {
    return null
  }
  if (!date || isNaN(date.getTime())) return null
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Parse "asOfMonthYear" style (e.g. "2024-06", "June 2024") to YYYY-MM-DD (use first day of month/year). */
function parseMonthYear(value) {
  if (value == null || value === '') return null
  const s = String(value).trim()
  const match = s.match(/^(\d{4})-(\d{1,2})/) // 2024-06
  if (match) {
    const year = parseInt(match[1], 10)
    const month = parseInt(match[2], 10)
    if (month >= 1 && month <= 12) return `${year}-${String(month).padStart(2, '0')}-01`
  }
  const yearMatch = s.match(/\b(19|20)\d{2}\b/)
  if (yearMatch) return `${yearMatch[0]}-01-01`
  const d = new Date(s)
  if (!isNaN(d.getTime())) return toYYYYMMDD(d)
  return null
}

/** Get Form Submission Date string (YYYY-MM-DD) from doc using old collection date field(s). Falls back to createdAt. */
function getDateStringFromDoc(data, collectionId) {
  const existing = data[FORM_SUBMISSION_DATE_FIELD]
  if (existing && String(existing).trim() !== '') return toYYYYMMDD(existing) || String(existing).trim().slice(0, 10)

  const fieldOrFields = OLD_COLLECTION_DATE_FIELD_FOR_YEAR[collectionId]
  const fields = fieldOrFields == null ? [] : Array.isArray(fieldOrFields) ? fieldOrFields : [fieldOrFields]

  for (const field of fields) {
    const v = data[field]
    if (v == null || v === '') continue
    if (field === 'asOfMonthYear') {
      const parsed = parseMonthYear(v)
      if (parsed) return parsed
    }
    const dateStr = toYYYYMMDD(v)
    if (dateStr) return dateStr
  }

  const createdAt = data.createdAt
  if (createdAt) {
    const dateStr = toYYYYMMDD(createdAt)
    if (dateStr) return dateStr
  }

  return null
}

/**
 * Backfill formSubmissionDate for all records that don't have it, using each record's previous year/date (old date fields or createdAt).
 * @param {import('firebase/firestore').Firestore} firestoreDb
 * @returns {Promise<{ updated: number, skipped: number, noDate: number, errors: Array<{ collectionId: string, docId: string, message: string }> }>}
 */
export async function backfillFormSubmissionDate(firestoreDb) {
  const result = { updated: 0, skipped: 0, noDate: 0, errors: [] }

  for (const { id: collectionId } of COLLECTIONS) {
    const colRef = collection(firestoreDb, collectionId)
    let snap
    try {
      snap = await getDocs(colRef)
    } catch (err) {
      result.errors.push({ collectionId, docId: '', message: err?.message || String(err) })
      continue
    }

    for (const docSnap of snap.docs) {
      const docId = docSnap.id
      const data = docSnap.data()

      if (data[FORM_SUBMISSION_DATE_FIELD] && String(data[FORM_SUBMISSION_DATE_FIELD]).trim() !== '') {
        result.skipped += 1
        continue
      }

      const dateStr = getDateStringFromDoc(data, collectionId)
      if (!dateStr) {
        result.noDate += 1
        continue
      }

      try {
        await updateDoc(doc(firestoreDb, collectionId, docId), { [FORM_SUBMISSION_DATE_FIELD]: dateStr })
        result.updated += 1
      } catch (err) {
        result.errors.push({ collectionId, docId, message: err?.message || String(err) })
      }
    }
  }

  return result
}
