import { collection, addDoc, query, orderBy, limit, getDocs, doc, deleteDoc, where, writeBatch } from 'firebase/firestore'
import { db } from './firebase'

const COLLECTION = 'systemLogs'

/**
 * Log an action to system logs (admin viewable).
 * @param {Object} opts
 * @param {string} opts.action - e.g. 'login' | 'logout' | 'password_change' | 'admin_code_change' | 'record_submitted' | 'record_updated' | 'record_deleted'
 * @param {string} [opts.userId]
 * @param {string} [opts.userEmail]
 * @param {string} [opts.role]
 * @param {string} [opts.details]
 */
export async function addSystemLog({ action, userId = '', userEmail = '', role = '', details = '' }) {
  try {
    await addDoc(collection(db, COLLECTION), {
      action,
      userId,
      userEmail,
      role,
      details,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    console.error('Failed to write system log:', e)
  }
}

/**
 * Fetch recent system logs (for admin System Logs page).
 * @param {number} maxCount
 * @returns {Promise<Array<{ id: string, ... }>>}
 */
export async function getSystemLogs(maxCount = 200) {
  const q = query(
    collection(db, COLLECTION),
    orderBy('timestamp', 'desc'),
    limit(maxCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Delete a single system log by id.
 * @param {string} logId
 * @returns {Promise<void>}
 */
export async function deleteSystemLog(logId) {
  if (!logId) return
  await deleteDoc(doc(db, COLLECTION, logId))
}

/**
 * Bulk delete system logs by year and optional month.
 * @param {{ year: number, month?: number | null }} params
 * @returns {Promise<{ deleted: number }>}
 */
export async function deleteSystemLogsByPeriod({ year, month = null }) {
  if (!year) return { deleted: 0 }

  const start = new Date(year, month ? month - 1 : 0, 1, 0, 0, 0)
  const end = month
    ? new Date(year, month, 1, 0, 0, 0)
    : new Date(year + 1, 0, 1, 0, 0, 0)

  const startIso = start.toISOString()
  const endIso = end.toISOString()

  const q = query(
    collection(db, COLLECTION),
    where('timestamp', '>=', startIso),
    where('timestamp', '<', endIso)
  )

  const snap = await getDocs(q)
  if (snap.empty) return { deleted: 0 }

  let deleted = 0
  let batch = writeBatch(db)
  let opCount = 0

  snap.forEach((d) => {
    batch.delete(doc(db, COLLECTION, d.id))
    deleted += 1
    opCount += 1
    if (opCount === 500) {
      batch.commit()
      batch = writeBatch(db)
      opCount = 0
    }
  })

  if (opCount > 0) {
    await batch.commit()
  }

  return { deleted }
}
