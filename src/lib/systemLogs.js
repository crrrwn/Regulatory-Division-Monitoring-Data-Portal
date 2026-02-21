import { collection, addDoc, query, orderBy, limit, getDocs } from 'firebase/firestore'
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
